const { exec } = require('child_process');
const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('[INIT] Starting start.js...');

// const proxyApp = require('./proxy-server/server.js'); // 자동 실행될 프록시
// const staticApp = express();
// ✅ 1. 프록시 서버 실행 전 경로 출력 및 체크
const proxyPath = path.join(process.cwd(), 'proxy-server', 'server.js');
console.log(`[DEBUG] 프록시 경로: ${proxyPath}`);

if (fs.existsSync(proxyPath)) {
  require(proxyPath);
  console.log('🚀 프록시 서버 실행됨.');
} else {
  console.error('❌ [ERROR] 프록시 서버 파일이 존재하지 않습니다.');
}
const staticApp = express();

// node start.js const distPath = path.join(__dirname, 'platform/app/dist');
// ✅ 실행 디렉토리 기준으로 package-app-dist 폴더 사용
const distPath = path.join(process.cwd(), 'platform/app/dist');
console.log(`[DEBUG] dist 경로: ${distPath}`);
// console.log(`[DEBUG] __dirname: ${__dirname}`);
// ✅ [추가] dist 폴더 존재 여부 및 파일 내용 확인
// if (!fs.existsSync(distPath)) {
//   console.error('❌ [ERROR] platform/app/dist 폴더가 존재하지 않습니다.');
// } else {
//   const files = fs.readdirSync(distPath);
//   if (files.length === 0) {
//     console.warn('⚠️ [WARNING] platform/app/dist 폴더가 비어 있습니다.');
//   } else {
//     console.log(`📦 [INFO] platform/app/dist 안의 파일: ${files.join(', ')}`);
//   }
// }

// node start.js  staticApp.use('/', express.static(path.join(__dirname, 'platform/app/dist')));
staticApp.use('/', express.static(distPath));

// ✅ React Router 등 SPA 대응
staticApp.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = 8090;
staticApp.listen(PORT, () => {
  console.log(`🖥️ Viewer available at http://localhost:${PORT}`);
  // Chrome 열기 (윈도우용)
  exec(`start chrome http://localhost:${PORT} `);
});
