import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckBadge, LaunchSpark} from '../components/AbstractIcons';
import {AmbientBackdrop, CameraStage} from '../components/MotionPrimitives';
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
 * Scene 5 (16–20s | Frames 480–599, local 0–119) — Tablet/Mobile Portrait Hero (1080x1440).
 * - Starts at PREVIEW_RECT matching Scene 4's (-7, +3.5) 3D angle.
 * - Two sequential Coral Rose revision ticks land beside the preview.
 * - Pulls back cleanly to showcase the desktop + mobile solution on white.
 * - At 19s (local frame 90), reveals CRM-style Mint "Live" badge beside it with spark.
 */
export const Scene5ReviewLaunch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const tick1Pop =
    frame < 10
      ? 0
      : spring({
          frame: frame - 10,
          fps,
          config: SPRING_PRESETS.bouncy,
        });
  const tick1Draw = clampedInterpolate(frame, [14, 28], [0, 1], expOut);

  const tick2Pop =
    frame < 34
      ? 0
      : spring({
          frame: frame - 34,
          fps,
          config: SPRING_PRESETS.bouncy,
        });
  const tick2Draw = clampedInterpolate(frame, [38, 52], [0, 1], expOut);

  const ticksFadeOut = clampedInterpolate(
    frame,
    [58, 68],
    [1, 0],
    Easing.in(Easing.cubic)
  );

  // Pull back cleanly to frame full website + mobile app + "Live" badge side-by-side
  const pullBack = clampedInterpolate(frame, [60, 88], [0, 1], expOut);

  const finalRect = {x: 78, y: 635, width: 615, height: 443};
  const siteX = PREVIEW_RECT.x + (finalRect.x - PREVIEW_RECT.x) * pullBack;
  const siteY = PREVIEW_RECT.y + (finalRect.y - PREVIEW_RECT.y) * pullBack;
  const siteW =
    PREVIEW_RECT.width + (finalRect.width - PREVIEW_RECT.width) * pullBack;
  const siteH =
    PREVIEW_RECT.height + (finalRect.height - PREVIEW_RECT.height) * pullBack;

  const settleArc = Math.sin(pullBack * Math.PI);
  const stageRotateY = -7 + pullBack * 1.5 - settleArc * 2;
  const stageRotateX = 3.5 - pullBack * 0.5 + settleArc * 1;

  const livePop =
    frame < 90
      ? 0
      : spring({
          frame: frame - 90,
          fps,
          config: SPRING_PRESETS.snappy,
        });
  const sparkProgress = clampedInterpolate(frame, [90, 108], [0, 1], expOut);

  const pulsePhase = frame >= 92 ? (Math.sin((frame - 92) * 0.28) + 1) / 2 : 0;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={510} cy={860} opacity={0.95} />

      <CameraStage rotateX={stageRotateX} rotateY={stageRotateY} origin="510px 860px">
        <svg
          width={1080}
          height={1440}
          viewBox="0 0 1080 1440"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <WebsiteLayout
            x={siteX}
            y={siteY}
            width={siteW}
            height={siteH}
            fillProgress={1}
            panOffset={0}
            mobileProgress={1}
          />

          {/* Two sequential Coral Rose revision ticks */}
          {ticksFadeOut > 0.01 && (
            <g opacity={ticksFadeOut}>
              <CheckBadge
                x={905}
                y={785}
                popScale={tick1Pop}
                tickProgress={tick1Draw}
                size={1.08}
                fillColor={COLORS.rose}
              />
              <CheckBadge
                x={905}
                y={895}
                popScale={tick2Pop}
                tickProgress={tick2Draw}
                size={1.08}
                fillColor={COLORS.rose}
              />
            </g>
          )}

          {/* Small multicoloured spark beside "Live" at 19s */}
          <LaunchSpark
            x={965}
            y={776}
            progress={sparkProgress}
            scale={0.95}
          />
        </svg>

        {/* CRM-style Mint "Live" Badge revealed at 19s (local frame 90), held through 20s */}
        {livePop > 0.01 && (
          <div
            className="pointer-events-none absolute left-[768px] top-[798px] flex items-center gap-[14px] rounded-[16px] px-[26px] py-[15px] font-sans"
            style={{
              backgroundColor: COLORS.mintSoft,
              boxShadow: `0 14px 34px ${COLORS.cardShadow}`,
              border: `2px solid ${COLORS.mint}`,
              opacity: Math.min(1, livePop * 1.4),
              transform: `scale(${0.88 + livePop * 0.12})`,
            }}
          >
            <span className="relative flex h-[16px] w-[16px] items-center justify-center">
              <span
                className="absolute inline-block h-[16px] w-[16px] rounded-full"
                style={{
                  backgroundColor: COLORS.mint,
                  opacity: 0.55 - pulsePhase * 0.4,
                  transform: `scale(${1 + pulsePhase * 0.85})`,
                }}
              />
              <span
                className="relative inline-block h-[12px] w-[12px] rounded-full"
                style={{backgroundColor: COLORS.mintDeep}}
              />
            </span>
            <span
              className="font-bold tracking-[-0.02em]"
              style={{
                fontSize: '34px',
                lineHeight: 1,
                color: COLORS.mintDeep,
              }}
            >
              {SCENE_COPY.launchBadge}
            </span>
          </div>
        )}
      </CameraStage>

      <SceneTextLayer
        headline={SCENE_COPY.scene5.headline}
        subhead={SCENE_COPY.scene5.subhead}
        startFrame={4}
        accentColor={COLORS.rose}
      />
    </AbsoluteFill>
  );
};
