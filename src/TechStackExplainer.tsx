import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Scene1Enquiry} from './scenes/Scene1Enquiry';
import {Scene2Discovery} from './scenes/Scene2Discovery';
import {Scene3ResearchSitemap} from './scenes/Scene3ResearchSitemap';
import {Scene4DesignBuild} from './scenes/Scene4DesignBuild';
import {Scene5ReviewLaunch} from './scenes/Scene5ReviewLaunch';
import {COLORS} from './theme';

export const TechStackExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {/* 0–4s: Enquiry and first call */}
      <Sequence from={0} durationInFrames={120}>
        <Scene1Enquiry />
      </Sequence>

      {/* 4–8s: Teams discovery and service agreement */}
      <Sequence from={120} durationInFrames={120}>
        <Scene2Discovery />
      </Sequence>

      {/* 8–12s: Research, sitemap and copy */}
      <Sequence from={240} durationInFrames={120}>
        <Scene3ResearchSitemap />
      </Sequence>

      {/* 12–16s: Design, build, domain and hosting */}
      <Sequence from={360} durationInFrames={120}>
        <Scene4DesignBuild />
      </Sequence>

      {/* 16–20s: Two revision rounds and launch */}
      <Sequence from={480} durationInFrames={120}>
        <Scene5ReviewLaunch />
      </Sequence>
    </AbsoluteFill>
  );
};
