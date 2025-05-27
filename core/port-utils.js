const { execSync } = require('child_process');
const net = require('net');

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

function killProcessByPid(pid) {
  try {
    execSync(`taskkill /PID ${pid} /F`);
    console.log(`🔪 Killed process on port with PID ${pid}`);
  } catch (e) {
    console.error(`❌ Failed to kill process PID ${pid}: ${e.message}`);
  }
}

function isPortInUse(port, callback) {
  const tester = net
    .createServer()
    .once('error', err => (err.code === 'EADDRINUSE' ? callback(true) : callback(false)))
    .once('listening', () => tester.once('close', () => callback(false)).close())
    .listen(port);
}

module.exports = { getPidOnPort, killProcessByPid, isPortInUse };
