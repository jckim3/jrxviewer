import React from 'react';
import { AboutModal } from '@ohif/ui-next';

function AboutModalDefault() {
  return (
    <AboutModal className="w-[400px]">
      <AboutModal.ProductName>JRX Viewer</AboutModal.ProductName>
      <AboutModal.ProductVersion>v1.0.0</AboutModal.ProductVersion>
      <AboutModal.ProductBeta>Private Build</AboutModal.ProductBeta>

      <AboutModal.Body>
        <AboutModal.DetailItem
          label="Build Date"
          value="May 2025"
        />
        <AboutModal.SocialItem
          icon="SocialGithub"
          url="jckim3/jrxviewer"
          text="github.com/jckim3/jrxviewer"
        />
      </AboutModal.Body>
    </AboutModal>
  );
}

export default {
  'ohif.aboutModal': AboutModalDefault,
};
