// Express 프레임워크 및 프록시 미들웨어, CORS 미들웨어 불러오기
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 8080;

// 모든 요청에 대해 CORS 허용 (모든 origin, 모든 메서드 허용)
app.use(cors());

// '/dicom-web'으로 시작하는 요청을 Orthanc 서버로 프록시 처리
app.use(
  '/dicom-web',
  createProxyMiddleware({
    target: 'http://localhost:8042', // 실제 Orthanc DICOM 서버 주소
    changeOrigin: true, // Origin 헤더를 대상 서버 주소로 변경 (CORS 우회용)
    // pathRewrite 옵션 없음 → 요청 경로 그대로 유지
  })
);

// 서버 실행 및 포트 확인 메시지 출력
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Proxy server 0000 running at http://localhost:${PORT}`);
});
