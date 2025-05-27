const { exec, execSync } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');
const net = require('net');

// ✅ 로그 파일 경로
const logFilePath = path.join(process.cwd(), 'log.txt');

// ✅ 로그 기록 함수 정의
function logToFile(originalFn, message) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFilePath, fullMessage);
  originalFn(message); // 콘솔에도 출력
}

// ✅ console.log / console.error 오버라이드
const originalLog = console.log;
const originalError = console.error;
console.log = msg => logToFile(originalLog, msg);
console.error = msg => logToFile(originalError, msg);

// ✅ PID 찾기 함수 (윈도우 전용)
function getPidOnPort(port) {
  try {
    const result = execSync(`netstat -aon | findstr :${port}`).toString();
    const lines = result.trim().split('\n');
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      return parseInt(pid);
    }
  } catch {
    return null;
  }
}

// ✅ PID로 프로세스 종료
function killProcessByPid(pid) {
  try {
    execSync(`taskkill /PID ${pid} /F`);
    console.log(`🔪 Killed process on port with PID ${pid}`);
  } catch (e) {
    console.error(`❌ Failed to kill process PID ${pid}: ${e.message}`);
  }
}

// ✅ 프록시 서버 경로 및 포트 정의
const proxyPath = path.join(process.cwd(), 'proxy-server', 'server.js');
const proxyPort = 8080;

// ✅ 프록시 포트 사용 여부 확인
function isPortInUse(port, callback) {
  const tester = net
    .createServer()
    .once('error', err => (err.code === 'EADDRINUSE' ? callback(true) : callback(false)))
    .once('listening', () => tester.once('close', () => callback(false)).close())
    .listen(port);
}

// ✅ 프록시 포트 체크 후 실행
isPortInUse(proxyPort, inUse => {
  if (inUse) {
    console.log(`⚠️ Port ${proxyPort} already in use → Skipping proxy startup.`);
  } else {
    console.log(`[DEBUG] Proxy path: ${proxyPath}`);
    if (fs.existsSync(proxyPath)) {
      require(proxyPath);
      console.log('🚀 Proxy Server Running.');
    } else {
      console.error('❌ [ERROR] Proxy Server Not existed');
    }
  }

  // ✅ 정적 서버 설정
  const staticApp = express();
  const distPath = path.join(process.cwd(), 'platform/app/dist');
  console.log(`[DEBUG] dist path: ${distPath}`);

  staticApp.use('/', express.static(distPath));
  staticApp.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const PORT = 8090;

  // ✅ 실행 전 포트 점유 프로세스 확인 및 종료
  const viewerPid = getPidOnPort(PORT);
  if (viewerPid) {
    killProcessByPid(viewerPid);
  }

  // ✅ static 서버 실행
  staticApp
    .listen(PORT, () => {
      console.log(`🖥️ Viewer available at http://localhost:${PORT}`);
      exec(`start chrome http://localhost:${PORT}`);
    })
    .on('error', err => {
      console.error(`❌ Failed to start Viewer server: ${err.message}`);
    });
});
