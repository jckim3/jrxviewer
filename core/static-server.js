const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const { getPidOnPort, killProcessByPid } = require('./port-utils');

function startStaticServer(port = 8090) {
  const staticApp = express();
  const distPath = path.join(process.cwd(), 'platform/app/dist');
  console.log(`[DEBUG] dist path: ${distPath}`);

  staticApp.use('/', express.static(distPath));
  staticApp.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });

  const pid = getPidOnPort(port);
  if (pid) {
    killProcessByPid(pid);
  }

  staticApp
    .listen(port, () => {
      console.log(`🖥️ Viewer available at http://localhost:${port}`);
      exec(`start chrome http://localhost:${port}`);
    })
    .on('error', err => {
      console.error(`❌ Failed to start Viewer server: ${err.message}`);
    });
}

module.exports = { startStaticServer };
