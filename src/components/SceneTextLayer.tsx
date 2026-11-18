import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {COLORS, clampedInterpolate} from '../theme';

export interface SceneTextLayerProps {
  headline: string;
  subhead: string;
  startFrame?: number;
  fadeOutRange?: [number, number];
  accentColor?: string;
}

/**
 * Masked kinetic Plus Jakarta Sans typography layer stacked cleanly at the top
 * of the tablet/mobile hero canvas so wording remains large, exact, and crisp
 * while the 3D product stage animates in the lower viewport.
 */
export const SceneTextLayer: React.FC<SceneTextLayerProps> = ({
  headline,
  subhead,
  startFrame = 0,
  fadeOutRange,
  accentColor = COLORS.blue,
}) => {
  const frame = useCurrentFrame();

  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const barProgress = clampedInterpolate(
    frame,
    [startFrame, startFrame + 16],
    [0, 1],
    expOut
  );
  const hProgress = clampedInterpolate(
    frame,
    [startFrame + 2, startFrame + 20],
    [0, 1],
    expOut
  );
  const sProgress = clampedInterpolate(
    frame,
    [startFrame + 14, startFrame + 32],
    [0, 1],
    expOut
  );

  const fadeOut = fadeOutRange
    ? clampedInterpolate(frame, fadeOutRange, [1, 0], Easing.in(Easing.cubic))
    : 1;

  return (
    <div
      className="pointer-events-none absolute left-[76px] right-[76px] top-[88px] select-none font-sans"
      style={{opacity: fadeOut}}
    >
      {/* Kinetic accent pill bar */}
      <div className="mb-[24px] flex items-center gap-[10px]">
        <div
          className="h-[7px] rounded-full"
          style={{
            width: `${Math.round(barProgress * 52)}px`,
            backgroundColor: accentColor,
            opacity: barProgress,
          }}
        />
        <div
          className="h-[7px] w-[12px] rounded-full"
          style={{
            backgroundColor: COLORS.mint,
            opacity: barProgress,
            transform: `scale(${0.4 + barProgress * 0.6})`,
          }}
        />
      </div>

      {/* Masked headline slide-up */}
      <div className="overflow-hidden pb-[6px]">
        <h2
          className="m-0 font-bold tracking-[-0.032em]"
          style={{
            fontSize: '76px',
            lineHeight: 1.08,
            color: COLORS.navy,
            opacity: Math.min(1, hProgress * 1.4),
            transform: `translate3d(0, ${(1 - hProgress) * 56}px, 0)`,
          }}
        >
          {headline}
        </h2>
      </div>

      {/* Masked subhead slide-up */}
      <div className="mt-[20px] overflow-hidden pb-[4px]">
        <p
          className="m-0 font-medium tracking-[-0.012em]"
          style={{
            fontSize: '38px',
            lineHeight: 1.36,
            color: COLORS.slate,
            opacity: Math.min(1, sProgress * 1.4),
            transform: `translate3d(0, ${(1 - sProgress) * 34}px, 0)`,
          }}
        >
          {subhead}
        </p>
      </div>
    </div>
  );
};
