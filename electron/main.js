const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

// ✅ NODE_ENV를 production으로 설정
process.env.NODE_ENV = 'production';

// ✅ WebSecurity 옵션 제어 (CORS 문제 우회 목적)
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// 1. Proxy 서버 실행
let proxyProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      contextIsolation: true,
    },
    show: false, // 렌더링 후 보여주기
  });

  // 2. OHIF Viewer의 index.html 띄움
  win.loadFile(path.join(__dirname, '../platform/app/dist/index.html'));
  win.once('ready-to-show', () => {
    win.show();
}

app.whenReady().then(() => {
  // 3. 프록시 서버 실행
  proxyProcess = spawn('node', ['proxy-server/server.js'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
  });

  // 로그 보기
  proxyProcess.stdout.on('data', data => {
    console.log(`[proxy] ${data}`);
  });

  // 4. UI 실행
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (proxyProcess) {
      proxyProcess.kill();
    } // 앱 종료 시 프록시도 종료
    app.quit();
  }
});
