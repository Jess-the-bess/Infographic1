import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
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
 * Scene 2 (4–8s | Frames 120–239, local 0–119): Discovery and agreement.
 * - Opens directly on the rounded Blue (#39A6DE) box transformed from the plane.
 * - Box expands smoothly into DISCOVERY_BLOCK.
 * - Two simple speech bubbles slide together inside it, then a Mint (#7CD19F) tick confirms.
 * - In the final half-second (f 104..119), zoom into the Blue block until it fills the frame.
 */
export const Scene2Discovery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // f 0..26: Expand the plane-transformed box -> DISCOVERY_BLOCK
  const blockExpand = clampedInterpolate(
    frame,
    [0, 26],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  // f 104..119: Zoom into the Blue block until it fills the entire 1920x1080 frame
  const zoomFull = clampedInterpolate(
    frame,
    [104, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

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
  const rectW = baseW + (1920 - baseW) * zoomFull;
  const rectH = baseH + (1080 - baseH) * zoomFull;
  const rectRx = baseRx * (1 - zoomFull);

  // f 30..62: Two simple speech bubbles slide together inside the block
  const bubbleSlide = clampedInterpolate(
    frame,
    [30, 62],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const bubbleFadeOut = clampedInterpolate(
    frame,
    [103, 111],
    [1, 0],
    Easing.in(Easing.cubic)
  );
  const bubbleOpacity = clampedInterpolate(frame, [30, 38], [0, 1]) * bubbleFadeOut;

  const leftBubbleOffset = (1 - bubbleSlide) * -90;
  const rightBubbleOffset = (1 - bubbleSlide) * 90;

  // f 64..92: Confirmation Mint tick lands smoothly
  const tickPop =
    frame < 64
      ? 0
      : spring({
          frame: frame - 64,
          fps,
          config: SPRING_PRESETS.bouncy,
        });
  const tickDraw = clampedInterpolate(
    frame,
    [70, 90],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const tickLen = 46;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        {/* Soft ambient cool-blue halo behind bounded block */}
        {zoomFull < 0.98 && (
          <rect
            x={rectX - 4}
            y={rectY + 6}
            width={rectW + 8}
            height={rectH + 4}
            rx={rectRx + 4}
            fill={COLORS.cardShadow}
            opacity={(1 - zoomFull) * 0.85}
          />
        )}

        {/* Blue Discovery Block (from plane box -> rounded block -> full frame) */}
        <rect
          x={rectX}
          y={rectY}
          width={rectW}
          height={rectH}
          rx={rectRx}
          fill={COLORS.blue}
        />

        {/* Two simple speech bubbles sliding together inside the block */}
        {bubbleOpacity > 0.01 && (
          <g opacity={bubbleOpacity}>
            {/* Left crisp white speech bubble */}
            <g transform={`translate(${1320 + leftBubbleOffset}, 450)`}>
              <rect
                x={-110}
                y={-52}
                width={220}
                height={104}
                rx={22}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.5}
              />
              <path d="M -78 52 L -94 74 L -50 52 Z" fill={COLORS.card} />
              <circle cx={-72} cy={-16} r={7} fill={COLORS.blue} />
              <rect
                x={-54}
                y={-22}
                width={120}
                height={12}
                rx={6}
                fill={COLORS.blueSoft}
              />
              <rect
                x={-80}
                y={8}
                width={118}
                height={12}
                rx={6}
                fill={COLORS.muted}
              />
            </g>

            {/* Right sky-tint speech bubble */}
            <g transform={`translate(${1500 + rightBubbleOffset}, 548)`}>
              <rect
                x={-110}
                y={-48}
                width={220}
                height={96}
                rx={22}
                fill={COLORS.blueSoft}
                stroke={COLORS.card}
                strokeWidth={1.5}
              />
              <path d="M 52 48 L 88 70 L 74 48 Z" fill={COLORS.blueSoft} />
              <rect
                x={-80}
                y={-18}
                width={136}
                height={12}
                rx={6}
                fill={COLORS.card}
              />
              <rect
                x={-80}
                y={8}
                width={88}
                height={12}
                rx={6}
                fill={COLORS.card}
                opacity={0.85}
              />
            </g>
          </g>
        )}

        {/* CRM-style Mint sign-off pill confirming agreement (zero generated text) */}
        {tickPop > 0.01 && bubbleFadeOut > 0.01 && (
          <g
            transform={`translate(1410, 622) scale(${tickPop})`}
            opacity={bubbleFadeOut}
          >
            <rect
              x={-82}
              y={-26}
              width={164}
              height={52}
              rx={16}
              fill={COLORS.mintSoft}
              stroke={COLORS.mint}
              strokeWidth={2}
            />
            <path
              d="M -52 1 L -44 9 L -30 -8"
              fill="none"
              stroke={COLORS.mintDeep}
              strokeWidth={4.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={tickLen}
              strokeDashoffset={tickLen * (1 - tickDraw)}
            />
            <rect
              x={-14}
              y={-6}
              width={72}
              height={12}
              rx={6}
              fill={COLORS.mintDeep}
              opacity={0.75}
            />
          </g>
        )}
      </svg>

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene2.headline}
        subhead={SCENE_COPY.scene2.subhead}
        startFrame={4}
        fadeOutRange={[102, 111]}
      />
    </AbsoluteFill>
  );
};
