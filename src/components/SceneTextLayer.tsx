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
 * Masked kinetic Plus Jakarta Sans typography layer anchored cleanly on the left.
 * Keeps wording exact and readable across screen sizes while graphics animate in 3D on the right.
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
      className="pointer-events-none absolute left-[104px] top-[348px] w-[720px] select-none font-sans"
      style={{opacity: fadeOut}}
    >
      {/* Kinetic accent pill bar */}
      <div className="mb-[26px] flex items-center gap-[10px]">
        <div
          className="h-[6px] rounded-full"
          style={{
            width: `${Math.round(barProgress * 46)}px`,
            backgroundColor: accentColor,
            opacity: barProgress,
          }}
        />
        <div
          className="h-[6px] w-[10px] rounded-full"
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
            fontSize: '70px',
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
      <div className="mt-[22px] overflow-hidden pb-[4px]">
        <p
          className="m-0 font-medium tracking-[-0.012em]"
          style={{
            fontSize: '35px',
            lineHeight: 1.38,
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
