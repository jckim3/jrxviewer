import React from 'react';
import { AboutModal } from '@ohif/ui-next';

function AboutModalDefault() {
  return (
    <AboutModal className="w-[400px]">
      {/* ✅ ProductName을 클릭 가능하게 처리 */}
      <AboutModal.ProductName>
        <a
          href="https://JRXDiagnostics.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          JRX Viewer
        </a>
      </AboutModal.ProductName>

      <AboutModal.ProductVersion>v1.0.0</AboutModal.ProductVersion>
      <AboutModal.ProductBeta>Private Build</AboutModal.ProductBeta>

      <AboutModal.Body>
        <AboutModal.DetailItem
          label="Build Date"
          value="May 2025"
        />
        {/* ❌ GitHub SocialItem 제거 */}
      </AboutModal.Body>
    </AboutModal>
  );
}

export default {
  'ohif.aboutModal': AboutModalDefault,
};
