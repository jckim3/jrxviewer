const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());

app.use(
  '/dicom-web',
  createProxyMiddleware({
    target: 'http://localhost:8042',
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running at http://localhost:${PORT}`);
});
