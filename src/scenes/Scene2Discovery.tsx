import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  AmbientBackdrop,
  AnimatedCursor,
  CameraStage,
} from '../components/MotionPrimitives';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {SCENE_COPY} from '../copy';
import {
  COLORS,
  DISCOVERY_BLOCK,
  PLANE_TARGET_BOX,
  SPRING_PRESETS,
  clampedInterpolate,
} from '../theme';

/**
 * Scene 2 (4–8s | Frames 120–239, local 0–119) — Tablet/Mobile Portrait Hero (1080x1440).
 * - Opens on PLANE_TARGET_BOX (540, 870) matching Scene 1's (-7, +3.5) 3D angle.
 * - Expands into DISCOVERY_BLOCK (180, 650, 720x420) with animated Teams call bubble,
 *   agreement bubble, cursor approval click, and CRM-style Mint sign-off pill.
 * - Final 0.5s zooms smoothly to fill 1080x1440 cleanly.
 */
export const Scene2Discovery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const blockExpand = clampedInterpolate(frame, [0, 26], [0, 1], expOut);

  const zoomFull = clampedInterpolate(
    frame,
    [104, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  const midDrift = Math.sin(clampedInterpolate(frame, [0, 104], [0, Math.PI]));
  const stageRotateY = (-7 - midDrift * 3) * (1 - zoomFull);
  const stageRotateX = (3.5 + midDrift * 1.5) * (1 - zoomFull);

  const startX = PLANE_TARGET_BOX.cx - PLANE_TARGET_BOX.size / 2;
  const startY = PLANE_TARGET_BOX.cy - PLANE_TARGET_BOX.size / 2;

  const baseX = startX + (DISCOVERY_BLOCK.x - startX) * blockExpand;
  const baseY = startY + (DISCOVERY_BLOCK.y - startY) * blockExpand;
  const baseW =
    PLANE_TARGET_BOX.size +
    (DISCOVERY_BLOCK.width - PLANE_TARGET_BOX.size) * blockExpand;
  const baseH =
    PLANE_TARGET_BOX.size +
    (DISCOVERY_BLOCK.height - PLANE_TARGET_BOX.size) * blockExpand;
  const baseRx =
    PLANE_TARGET_BOX.rx + (DISCOVERY_BLOCK.rx - PLANE_TARGET_BOX.rx) * blockExpand;

  const rectX = baseX + (0 - baseX) * zoomFull;
  const rectY = baseY + (0 - baseY) * zoomFull;
  const rectW = baseW + (1080 - baseW) * zoomFull;
  const rectH = baseH + (1440 - baseH) * zoomFull;
  const rectRx = baseRx * (1 - zoomFull);

  const bubbleSlide = clampedInterpolate(frame, [24, 56], [0, 1], expOut);
  const bubbleFadeOut = clampedInterpolate(
    frame,
    [102, 110],
    [1, 0],
    Easing.in(Easing.cubic)
  );
  const bubbleOpacity = clampedInterpolate(frame, [24, 34], [0, 1]) * bubbleFadeOut;

  const leftBubbleOffset = (1 - bubbleSlide) * -90;
  const rightBubbleOffset = (1 - bubbleSlide) * 90;

  const cursorMove = clampedInterpolate(frame, [46, 62], [0, 1], expOut);
  const cursorX = 760 + (558 - 760) * cursorMove;
  const cursorY = 1045 + (988 - 1045) * cursorMove;
  const cursorClickRipple = clampedInterpolate(
    frame,
    [63, 76],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cursorScale =
    frame >= 62 && frame <= 67
      ? 1 -
        clampedInterpolate(frame, [62, 65], [0, 0.16]) +
        clampedInterpolate(frame, [65, 68], [0, 0.16])
      : 1;
  const cursorOpacity =
    clampedInterpolate(frame, [46, 52], [0, 1]) *
    (1 - clampedInterpolate(frame, [76, 88], [0, 1]));

  const tickPop =
    frame < 64
      ? 0
      : spring({
          frame: frame - 64,
          fps,
          config: SPRING_PRESETS.bouncy,
        });
  const tickDraw = clampedInterpolate(frame, [68, 88], [0, 1], expOut);
  const tickLen = 48;

  const waveHeights = [10, 22, 30, 18, 26, 12];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={540} cy={860} opacity={1 - zoomFull} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        origin="540px 860px"
      >
        <svg
          width={1080}
          height={1440}
          viewBox="0 0 1080 1440"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <defs>
            <filter id="discoveryGlow" x="-18%" y="-18%" width="136%" height="140%">
              <feDropShadow
                dx="0"
                dy="22"
                stdDeviation="22"
                floodColor="#39A6DE"
                floodOpacity="0.24"
              />
            </filter>
            <filter id="innerCardShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="10"
                floodColor="#0F172A"
                floodOpacity="0.16"
              />
            </filter>
            <linearGradient id="blueBlockGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.blue} />
              <stop offset="100%" stopColor={COLORS.blueDeep} />
            </linearGradient>
          </defs>

          <g filter={zoomFull < 0.9 ? 'url(#discoveryGlow)' : undefined}>
            <rect
              x={rectX}
              y={rectY}
              width={rectW}
              height={rectH}
              rx={rectRx}
              fill="url(#blueBlockGrad)"
            />
          </g>

          {zoomFull < 0.85 && blockExpand > 0.4 && (
            <rect
              x={rectX + 16}
              y={rectY + 16}
              width={Math.max(0, rectW - 32)}
              height={Math.max(0, rectH - 32)}
              rx={Math.max(0, rectRx - 8)}
              fill="none"
              stroke={COLORS.card}
              strokeWidth={1.5}
              opacity={0.18 * blockExpand * (1 - zoomFull)}
            />
          )}

          {bubbleOpacity > 0.01 && (
            <g opacity={bubbleOpacity} filter="url(#innerCardShadow)">
              <g transform={`translate(${402 + leftBubbleOffset}, 765)`}>
                <rect
                  x={-130}
                  y={-60}
                  width={260}
                  height={120}
                  rx={24}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.5}
                />
                <path d="M -88 60 L -106 84 L -56 60 Z" fill={COLORS.card} />

                <circle cx={-84} cy={-18} r={17} fill={COLORS.blueSoft} />
                <circle cx={-84} cy={-18} r={7.5} fill={COLORS.blue} />
                <circle
                  cx={-70}
                  cy={-5}
                  r={4.5}
                  fill={COLORS.mint}
                  stroke={COLORS.card}
                  strokeWidth={2}
                />

                {waveHeights.map((baseH, idx) => {
                  const h =
                    baseH *
                    (0.6 + 0.4 * Math.abs(Math.sin((frame + idx * 5) * 0.22)));
                  return (
                    <rect
                      key={idx}
                      x={-48 + idx * 16}
                      y={-18 - h / 2}
                      width={8}
                      height={h}
                      rx={4}
                      fill={idx % 2 === 0 ? COLORS.blue : COLORS.navy}
                      opacity={0.82}
                    />
                  );
                })}

                <rect
                  x={-102}
                  y={22}
                  width={176}
                  height={12}
                  rx={6}
                  fill={COLORS.muted}
                />
              </g>

              <g transform={`translate(${680 + rightBubbleOffset}, 868)`}>
                <rect
                  x={-126}
                  y={-56}
                  width={252}
                  height={112}
                  rx={24}
                  fill={COLORS.blueSoft}
                  stroke={COLORS.card}
                  strokeWidth={1.5}
                />
                <path d="M 56 56 L 94 80 L 80 56 Z" fill={COLORS.blueSoft} />
                <rect
                  x={-94}
                  y={-24}
                  width={28}
                  height={28}
                  rx={8}
                  fill={COLORS.card}
                />
                <circle cx={-80} cy={-10} r={6} fill={COLORS.rose} />
                <rect
                  x={-54}
                  y={-17}
                  width={136}
                  height={12}
                  rx={6}
                  fill={COLORS.card}
                />
                <rect
                  x={-94}
                  y={16}
                  width={156}
                  height={11}
                  rx={5.5}
                  fill={COLORS.card}
                  opacity={0.85}
                />
              </g>
            </g>
          )}

          {tickPop > 0.01 && bubbleFadeOut > 0.01 && (
            <g
              transform={`translate(540, 982) scale(${tickPop})`}
              opacity={bubbleFadeOut}
              filter="url(#innerCardShadow)"
            >
              <rect
                x={-98}
                y={-30}
                width={196}
                height={60}
                rx={18}
                fill={COLORS.mintSoft}
                stroke={COLORS.mint}
                strokeWidth={2}
              />
              <path
                d="M -64 1 L -54 11 L -38 -9"
                fill="none"
                stroke={COLORS.mintDeep}
                strokeWidth={4.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={tickLen}
                strokeDashoffset={tickLen * (1 - tickDraw)}
              />
              <rect
                x={-20}
                y={-6}
                width={88}
                height={12}
                rx={6}
                fill={COLORS.mintDeep}
                opacity={0.78}
              />
            </g>
          )}
        </svg>

        <AnimatedCursor
          x={cursorX}
          y={cursorY}
          opacity={cursorOpacity}
          scale={cursorScale}
          clickRipple={cursorClickRipple}
          rippleColor={COLORS.mint}
        />
      </CameraStage>

      <SceneTextLayer
        headline={SCENE_COPY.scene2.headline}
        subhead={SCENE_COPY.scene2.subhead}
        startFrame={4}
        fadeOutRange={[102, 111]}
      />
    </AbsoluteFill>
  );
};
