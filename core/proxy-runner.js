const fs = require('fs');
const path = require('path');

function runProxyServer() {
  const proxyPath = path.join(process.cwd(), 'proxy-server', 'server.js');
  console.log(`[DEBUG] Proxy path: ${proxyPath}`);

  if (fs.existsSync(proxyPath)) {
    require(proxyPath);
    console.log('🚀 Proxy Server Running.');
  } else {
    console.error('❌ [ERROR] Proxy Server Not existed');
  }
}

module.exports = { runProxyServer };
