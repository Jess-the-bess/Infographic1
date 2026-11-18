/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Player} from '@remotion/player';
import {TechStackExplainer} from './TechStackExplainer';
import {VIDEO_CONFIG} from './theme';

export default function App() {
  return (
    <section className="w-full min-h-screen bg-white flex items-center justify-center overflow-hidden">
      <Player
        component={TechStackExplainer}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        compositionWidth={VIDEO_CONFIG.width}
        compositionHeight={VIDEO_CONFIG.height}
        fps={VIDEO_CONFIG.fps}
        autoPlay
        loop
        initiallyMuted
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        allowFullscreen={false}
        showVolumeControls={false}
        style={{width: '100%'}}
        className="max-w-[min(100%,calc(100vh*3/4),768px)] bg-white"
      />
    </section>
  );
}
