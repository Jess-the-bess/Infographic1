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
 * Scene 2 (4–8s | Frames 120–239, local 0–119): Discovery and agreement.
 * - Opens on PLANE_TARGET_BOX, expanding with exponential Zelios easing into a 3D-tilted
 *   Teams Discovery & Service Agreement workspace.
 * - Two layered dialogue/call cards (with animated Teams audio waveform) glide together,
 *   an animated cursor taps the agreement confirmation, and a CRM Mint sign-off pill lands.
 * - Final 0.5s (f 104..119): Camera dollies forward as the Blue block zooms full-frame.
 */
export const Scene2Discovery: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  // f 0..26: Expand plane-transformed box -> DISCOVERY_BLOCK
  const blockExpand = clampedInterpolate(frame, [0, 26], [0, 1], expOut);

  // f 104..119: Zoom into Blue block until it fills 1920x1080 frame
  const zoomFull = clampedInterpolate(
    frame,
    [104, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  // Subtle 3D tilt during discovery that flattens cleanly before full-frame zoom
  const stageRotateY = -4.5 * blockExpand * (1 - zoomFull);
  const stageRotateX = 2.5 * blockExpand * (1 - zoomFull);

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

  // f 24..58: Two speech/call cards glide together inside the block
  const bubbleSlide = clampedInterpolate(frame, [24, 56], [0, 1], expOut);
  const bubbleFadeOut = clampedInterpolate(
    frame,
    [102, 110],
    [1, 0],
    Easing.in(Easing.cubic)
  );
  const bubbleOpacity = clampedInterpolate(frame, [24, 34], [0, 1]) * bubbleFadeOut;

  const leftBubbleOffset = (1 - bubbleSlide) * -86;
  const rightBubbleOffset = (1 - bubbleSlide) * 86;

  // Animated cursor moves to click confirmation pill at f 62..68
  const cursorMove = clampedInterpolate(frame, [46, 62], [0, 1], expOut);
  const cursorX = 1610 + (1428 - 1610) * cursorMove;
  const cursorY = 675 + (634 - 675) * cursorMove;
  const cursorClickRipple = clampedInterpolate(
    frame,
    [63, 76],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cursorScale =
    frame >= 62 && frame <= 67
      ? 1 - clampedInterpolate(frame, [62, 65], [0, 0.16]) + clampedInterpolate(frame, [65, 68], [0, 0.16])
      : 1;
  const cursorOpacity =
    clampedInterpolate(frame, [46, 52], [0, 1]) *
    (1 - clampedInterpolate(frame, [76, 88], [0, 1]));

  // f 64..92: Confirmation Mint sign-off pill lands with spring bounce
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

  // Subtle live audio waveform bars on the Teams call bubble
  const waveHeights = [10, 20, 28, 16, 24, 12];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={1410} cy={520} opacity={1 - zoomFull} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        origin="1410px 520px"
      >
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <defs>
            <filter id="discoveryGlow" x="-15%" y="-15%" width="130%" height="135%">
              <feDropShadow
                dx="0"
                dy="22"
                stdDeviation="22"
                floodColor="#39A6DE"
                floodOpacity="0.22"
              />
            </filter>
            <linearGradient id="blueBlockGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.blue} />
              <stop offset="100%" stopColor={COLORS.blueDeep} />
            </linearGradient>
          </defs>

          {/* Blue Discovery Block */}
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

          {/* Subtle frosted inner frame while bounded */}
          {zoomFull < 0.85 && blockExpand > 0.4 && (
            <rect
              x={rectX + 14}
              y={rectY + 14}
              width={Math.max(0, rectW - 28)}
              height={Math.max(0, rectH - 28)}
              rx={Math.max(0, rectRx - 8)}
              fill="none"
              stroke={COLORS.card}
              strokeWidth={1.5}
              opacity={0.18 * blockExpand * (1 - zoomFull)}
            />
          )}

          {/* Teams Call + Dialogue Cards sliding together inside the Blue block */}
          {bubbleOpacity > 0.01 && (
            <g opacity={bubbleOpacity}>
              {/* Left crisp white Teams call bubble with animated audio waveform */}
              <g transform={`translate(${1295 + leftBubbleOffset}, 436)`}>
                <rect
                  x={-118}
                  y={-56}
                  width={236}
                  height={112}
                  rx={22}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.5}
                />
                <path d="M -82 56 L -98 78 L -52 56 Z" fill={COLORS.card} />

                {/* Caller avatar + live badge dot */}
                <circle cx={-76} cy={-16} r={16} fill={COLORS.blueSoft} />
                <circle cx={-76} cy={-16} r={7} fill={COLORS.blue} />
                <circle cx={-63} cy={-4} r={4.5} fill={COLORS.mint} stroke={COLORS.card} strokeWidth={2} />

                {/* Animated audio waveform */}
                {waveHeights.map((baseH, idx) => {
                  const h =
                    baseH *
                    (0.6 + 0.4 * Math.abs(Math.sin((frame + idx * 5) * 0.22)));
                  return (
                    <rect
                      key={idx}
                      x={-44 + idx * 14}
                      y={-16 - h / 2}
                      width={7}
                      height={h}
                      rx={3.5}
                      fill={idx % 2 === 0 ? COLORS.blue : COLORS.navy}
                      opacity={0.82}
                    />
                  );
                })}

                <rect
                  x={-92}
                  y={20}
                  width={158}
                  height={11}
                  rx={5.5}
                  fill={COLORS.muted}
                />
              </g>

              {/* Right frosted white-blue agreement card bubble */}
              <g transform={`translate(${1520 + rightBubbleOffset}, 526)`}>
                <rect
                  x={-114}
                  y={-52}
                  width={228}
                  height={104}
                  rx={22}
                  fill={COLORS.blueSoft}
                  stroke={COLORS.card}
                  strokeWidth={1.5}
                />
                <path d="M 52 52 L 88 74 L 74 52 Z" fill={COLORS.blueSoft} />
                <rect
                  x={-84}
                  y={-22}
                  width={26}
                  height={26}
                  rx={8}
                  fill={COLORS.card}
                />
                <circle cx={-71} cy={-9} r={5.5} fill={COLORS.rose} />
                <rect
                  x={-48}
                  y={-15}
                  width={126}
                  height={12}
                  rx={6}
                  fill={COLORS.card}
                />
                <rect
                  x={-84}
                  y={16}
                  width={142}
                  height={11}
                  rx={5.5}
                  fill={COLORS.card}
                  opacity={0.85}
                />
              </g>
            </g>
          )}

          {/* CRM-style Mint Sign-Off Pill */}
          {tickPop > 0.01 && bubbleFadeOut > 0.01 && (
            <g
              transform={`translate(1410, 624) scale(${tickPop})`}
              opacity={bubbleFadeOut}
            >
              <rect
                x={-92}
                y={-28}
                width={184}
                height={56}
                rx={16}
                fill={COLORS.mintSoft}
                stroke={COLORS.mint}
                strokeWidth={2}
              />
              <path
                d="M -60 1 L -51 10 L -36 -9"
                fill="none"
                stroke={COLORS.mintDeep}
                strokeWidth={4.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={tickLen}
                strokeDashoffset={tickLen * (1 - tickDraw)}
              />
              <rect
                x={-20}
                y={-6}
                width={82}
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
