import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {COLORS, clampedInterpolate} from '../theme';

export interface SceneTextLayerProps {
  headline: string;
  subhead: string;
  startFrame?: number;
  fadeOutRange?: [number, number];
}

/**
 * Editable Plus Jakarta Sans typography layer anchored cleanly on the left side.
 * Styled to match the CRM's crisp #111827 headlines and #64748B secondary copy.
 */
export const SceneTextLayer: React.FC<SceneTextLayerProps> = ({
  headline,
  subhead,
  startFrame = 0,
  fadeOutRange,
}) => {
  const frame = useCurrentFrame();

  const hProgress = clampedInterpolate(
    frame,
    [startFrame, startFrame + 16],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const sProgress = clampedInterpolate(
    frame,
    [startFrame + 16, startFrame + 32],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  const fadeOut = fadeOutRange
    ? clampedInterpolate(frame, fadeOutRange, [1, 0], Easing.in(Easing.cubic))
    : 1;

  return (
    <div
      className="pointer-events-none absolute left-[110px] top-[350px] w-[760px] select-none font-sans"
      style={{opacity: fadeOut}}
    >
      <div
        className="mb-[24px] h-[5px] rounded-full"
        style={{
          width: `${Math.round(hProgress * 52)}px`,
          backgroundColor: COLORS.blue,
          opacity: hProgress,
        }}
      />
      <h2
        className="m-0 font-bold tracking-[-0.03em]"
        style={{
          fontSize: '72px',
          lineHeight: 1.08,
          color: COLORS.navy,
          opacity: hProgress,
          transform: `translateY(${(1 - hProgress) * 18}px)`,
        }}
      >
        {headline}
      </h2>
      <p
        className="mt-[24px] mb-0 font-medium tracking-[-0.01em]"
        style={{
          fontSize: '36px',
          lineHeight: 1.38,
          color: COLORS.slate,
          opacity: sProgress,
          transform: `translateY(${(1 - sProgress) * 14}px)`,
        }}
      >
        {subhead}
      </p>
    </div>
  );
};
