const { overrideConsole } = require('./core/logger');
const { isPortInUse } = require('./core/port-utils');
const { runProxyServer } = require('./core/proxy-runner');
const { startStaticServer } = require('./core/static-server');
const { checkLicense } = require('./core/license-manager');

overrideConsole();

(async () => {
  isLicensed = await checkLicense();
  //isLicensed = 1;
  if (!isLicensed) {
    console.error('🚫 License check failed. Exiting...');
    process.exit(1);
  }
  console.log('License passed...');
  const proxyPort = 8080;
  isPortInUse(proxyPort, inUse => {
    if (!inUse) {
      runProxyServer();
    } else {
      console.log(`⚠️ Port ${proxyPort} already in use → Skipping proxy startup.`);
    }

    startStaticServer(8090);
  });
})();
