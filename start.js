const { exec } = require('child_process');
const express = require('express');
const path = require('path');

const proxyApp = require('./proxy-server/server.js'); // 자동 실행될 프록시
const staticApp = express();

staticApp.use('/', express.static(path.join(__dirname, 'platform/app/dist')));

const PORT = 8090;
staticApp.listen(PORT, () => {
  console.log(`🖥️ Viewer available at http://localhost:${PORT}`);
  // Chrome 열기 (윈도우용)
  exec(`start chrome http://localhost:${PORT} `);
});
