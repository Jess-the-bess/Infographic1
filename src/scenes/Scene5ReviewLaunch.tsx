import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckBadge, LaunchSpark} from '../components/AbstractIcons';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {WebsiteLayout} from '../components/WebsiteLayout';
import {SCENE_COPY} from '../copy';
import {
  COLORS,
  PREVIEW_RECT,
  SPRING_PRESETS,
  clampedInterpolate,
} from '../theme';

/**
 * Scene 5 (16–20s | Frames 480–599, local 0–119): Revisions and launch.
 * - Website preview starts in exact PREVIEW_RECT position from Scene 4.
 * - Two Coral Rose (#EB4B77) revision ticks land sequentially beside the preview.
 * - Pull back to reveal the full website on pure white.
 * - At 19s (local frame 90), reveal "Live" beside it with Mint dot and one small spark.
 * - Hold final frame cleanly through 20s.
 */
export const Scene5ReviewLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Sequential revision ticks
  const tick1Pop =
    frame < 10
      ? 0
      : spring({
          frame: frame - 10,
          fps,
          config: SPRING_PRESETS.bouncy,
        });
  const tick1Draw = clampedInterpolate(
    frame,
    [14, 28],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  const tick2Pop =
    frame < 34
      ? 0
      : spring({
          frame: frame - 34,
          fps,
          config: SPRING_PRESETS.bouncy,
        });
  const tick2Draw = clampedInterpolate(
    frame,
    [38, 52],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  const ticksFadeOut = clampedInterpolate(
    frame,
    [58, 68],
    [1, 0],
    Easing.in(Easing.cubic)
  );

  // f 60..88: Pull back to reveal full website on pure white
  const pullBack = clampedInterpolate(
    frame,
    [60, 88],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  const finalRect = {x: 1005, y: 274, width: 590, height: 425};
  const siteX = PREVIEW_RECT.x + (finalRect.x - PREVIEW_RECT.x) * pullBack;
  const siteY = PREVIEW_RECT.y + (finalRect.y - PREVIEW_RECT.y) * pullBack;
  const siteW =
    PREVIEW_RECT.width + (finalRect.width - PREVIEW_RECT.width) * pullBack;
  const siteH =
    PREVIEW_RECT.height + (finalRect.height - PREVIEW_RECT.height) * pullBack;

  // f 90 (19s): Reveal "Live" beside it with one small multicoloured spark
  const livePop =
    frame < 90
      ? 0
      : spring({
          frame: frame - 90,
          fps,
          config: SPRING_PRESETS.snappy,
        });
  const sparkProgress = clampedInterpolate(
    frame,
    [90, 108],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        {/* Full Website Preview */}
        <WebsiteLayout
          x={siteX}
          y={siteY}
          width={siteW}
          height={siteH}
          fillProgress={1}
          panOffset={0}
        />

        {/* Two sequential Coral Rose revision ticks beside preview */}
        {ticksFadeOut > 0.01 && (
          <g opacity={ticksFadeOut}>
            <CheckBadge
              x={1736}
              y={425}
              popScale={tick1Pop}
              tickProgress={tick1Draw}
              size={1.08}
              fillColor={COLORS.rose}
            />
            <CheckBadge
              x={1736}
              y={530}
              popScale={tick2Pop}
              tickProgress={tick2Draw}
              size={1.08}
              fillColor={COLORS.rose}
            />
          </g>
        )}

        {/* Single small multicoloured spark beside "Live" at 19s */}
        <LaunchSpark
          x={1775}
          y={424}
          progress={sparkProgress}
          scale={0.95}
        />
      </svg>

      {/* CRM-style Mint "Live" Badge revealed at 19s (local frame 90), held through 20s */}
      {livePop > 0.01 && (
        <div
          className="pointer-events-none absolute left-[1632px] top-[452px] flex items-center gap-[14px] rounded-[16px] px-[28px] py-[15px] font-sans"
          style={{
            backgroundColor: COLORS.mintSoft,
            boxShadow: `0 12px 30px ${COLORS.cardShadow}`,
            border: `2px solid ${COLORS.mint}`,
            opacity: Math.min(1, livePop * 1.4),
            transform: `scale(${0.88 + livePop * 0.12})`,
          }}
        >
          <span
            className="inline-block h-[14px] w-[14px] rounded-full"
            style={{backgroundColor: COLORS.mintDeep}}
          />
          <span
            className="font-bold tracking-[-0.02em]"
            style={{
              fontSize: '36px',
              lineHeight: 1,
              color: COLORS.mintDeep,
            }}
          >
            {SCENE_COPY.launchBadge}
          </span>
        </div>
      )}

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene5.headline}
        subhead={SCENE_COPY.scene5.subhead}
        startFrame={4}
      />
    </AbsoluteFill>
  );
};
