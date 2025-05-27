const fs = require('fs');
const os = require('os');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const crypto = require('crypto');
const { Console } = require('console');

const licensePath = path.join(os.homedir(), '.jrxviewer-license.json');
const licenseServerUrl = 'https://jrx-license-server-production.up.railway.app/api/check'; // TODO: 실제 주소로 변경

// ⏱️ 마지막 검사일 계산
function daysSince(dateStr) {
  const last = new Date(dateStr);
  const now = new Date();
  return (now - last) / (1000 * 60 * 60 * 24);
}

// 🔐 키를 환경변수 또는 텍스트 파일에서 불러오기
function getKeyFromFileOrEnv() {
  try {
    if (process.env.JRX_LICENSE_KEY) {
      return process.env.JRX_LICENSE_KEY.trim();
    }
    const licenseFilePath = path.join(process.cwd(), 'license-key.txt'); // ← 실행 디렉토리 기준
    if (fs.existsSync(licenseFilePath)) {
      return fs.readFileSync(licenseFilePath, 'utf8').trim();
    }
  } catch {
    return '';
  }
  return '';
}

// 🧠 MAC 주소 얻기
function getMacAddress() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let i of iface) {
      if (!i.internal && i.mac && i.mac !== '00:00:00:00:00:00') {
        return i.mac;
      }
    }
  }
  return '00:00:00:00:00:00';
}

// 🔐 장치 고유 Signature 생성
function generateDeviceSignature() {
  try {
    const mac = getMacAddress();

    const cpuId = execSync(
      'powershell -Command "Get-WmiObject Win32_Processor | Select-Object -ExpandProperty ProcessorId"',
      { encoding: 'utf8' }
    ).trim();

    const osUuid = execSync(
      'powershell -Command "Get-WmiObject Win32_ComputerSystemProduct | Select-Object -ExpandProperty UUID"',
      { encoding: 'utf8' }
    ).trim();

    const raw = `${mac}-${cpuId}-${osUuid}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  } catch (err) {
    console.error('❌ Failed to generate device signature:', err.message || err);
    console.error('[DEBUG] Stack trace:', err?.stack);
    return 'unknown';
  }
}

// 🌐 서버에 라이선스 확인 요청
function verifyLicense(key, signature) {
  return new Promise((resolve, reject) => {
    const url = `${licenseServerUrl}?key=${key}&signature=${signature}`;
    https
      .get(url, res => {
        resolve(res.statusCode === 200);
      })
      .on('error', err => {
        reject(err);
      });
  });
}

// 📥 라이선스 입력 (환경변수 또는 파일에서)
async function promptForLicense() {
  try {
    const key = getKeyFromFileOrEnv();
    if (!key || key.length < 5) {
      console.error('❌ No license key found in environment or file.');
      return false;
    }

    const signature = generateDeviceSignature();
    console.log('🔐 Generated device signature:', signature);
    const valid = await verifyLicense(key, signature);

    if (valid) {
      fs.writeFileSync(
        licensePath,
        JSON.stringify(
          { key, deviceSignature: signature, lastChecked: new Date().toISOString() },
          null,
          2
        )
      );
      console.log('✅ License verified and saved.');
      return true;
    } else {
      console.error('❌ Invalid license key or device.');
      return false;
    }
  } catch (err) {
    console.error('❌ Failed to prompt for license:', err.message || err);
    console.error('[DEBUG] Stack trace:', err?.stack);
    return false;
  }
}

// ✅ 최종 확인 함수 (메인 엔트리)
async function checkLicense() {
  if (!fs.existsSync(licensePath)) {
    return await promptForLicense();
  }

  try {
    const data = JSON.parse(fs.readFileSync(licensePath, 'utf-8'));

    if (daysSince(data.lastChecked) < 3) {
      return true;
    }

    const currentSignature = generateDeviceSignature();
    const valid = await verifyLicense(data.key, currentSignature);

    if (valid) {
      data.lastChecked = new Date().toISOString();
      fs.writeFileSync(licensePath, JSON.stringify(data, null, 2));
      return true;
    } else {
      console.error('❌ License expired or invalid.');
      return await promptForLicense();
    }
  } catch (err) {
    console.error('❌ Failed to load license file:', err.message || err);
    return await promptForLicense();
  }
}

module.exports = { checkLicense };
