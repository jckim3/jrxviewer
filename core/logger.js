function overrideConsole() {
  const fs = require('fs');
  const path = require('path');
  const logFilePath = path.join(process.cwd(), 'log.txt');

  const originalLog = console.log;
  const originalError = console.error;

  function logToFile(originalFn, message) {
    const timestamp = new Date().toISOString();
    const fullMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFilePath, fullMessage);
    originalFn(message);
  }

  console.log = msg => logToFile(originalLog, msg);
  console.error = msg => logToFile(originalError, msg);
}

// ✅ 이렇게 export
module.exports = {
  overrideConsole,
};
