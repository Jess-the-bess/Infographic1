import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {
  AmbientBackdrop,
  AnimatedCursor,
  CameraStage,
} from '../components/MotionPrimitives';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {SCENE_COPY} from '../copy';
import {COLORS, PLANE_TARGET_BOX, clampedInterpolate} from '../theme';

/**
 * Scene 1 (0–4s | Frames 0–119) — Tablet/Mobile Portrait Hero (1080x1440).
 * - Top: Plus Jakarta Sans copy anchored cleanly above y=420.
 * - Bottom stage: 3D-tilted SaaS enquiry card; cursor clicks Send.
 * - Curved pure-white paper airplane with layered drop shadows lifts off along
 *   P0=(295,1002), P1=(680,620), P2=(1040,640) while camera pans smoothly
 *   so the plane arrives at PLANE_TARGET_BOX (540, 870) and morphs into Scene 2's box.
 */
export const Scene1Enquiry: React.FC = () => {
  const frame = useCurrentFrame();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const cardIn = clampedInterpolate(frame, [0, 18], [0, 1], expOut);

  // Cursor glides onto Send button (295, 1002) and clicks at f 16..24
  const cursorMove = clampedInterpolate(frame, [4, 17], [0, 1], expOut);
  const cursorX = 435 + (295 - 435) * cursorMove;
  const cursorY = 1130 + (1002 - 1130) * cursorMove;
  const cursorClickRipple = clampedInterpolate(
    frame,
    [17, 29],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cursorScale =
    frame >= 16 && frame <= 21
      ? 1 -
        clampedInterpolate(frame, [16, 19], [0, 0.16]) +
        clampedInterpolate(frame, [19, 22], [0, 0.16])
      : 1;
  const cursorOpacity =
    clampedInterpolate(frame, [3, 9], [0, 1]) *
    (1 - clampedInterpolate(frame, [26, 36], [0, 1]));

  // Flight + screen pan (f 22..102)
  const flightT = clampedInterpolate(
    frame,
    [22, 102],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  // Quadratic Bezier P0=(295,1002), P1=(680,620), P2=(1040,640)
  const oneMinusT = 1 - flightT;
  const planeWorldX =
    oneMinusT * oneMinusT * 295 +
    2 * oneMinusT * flightT * 680 +
    flightT * flightT * 1040;
  const planeWorldY =
    oneMinusT * oneMinusT * 1002 +
    2 * oneMinusT * flightT * 620 +
    flightT * flightT * 640;

  const dx = 2 * oneMinusT * (680 - 295) + 2 * flightT * (1040 - 680);
  const dy = 2 * oneMinusT * (620 - 1002) + 2 * flightT * (640 - 620);
  const tangentAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Screen pan tracks plane smoothly so flightT=1 lands at (540, 870)
  const camPanX = -flightT * 500;
  const camPanY = flightT * 230;

  const screenX = planeWorldX + camPanX;
  const screenY = planeWorldY + camPanY;

  const levelOut = clampedInterpolate(frame, [94, 110], [0, 1], expOut);
  const planeRotation = tangentAngleDeg * (1 - levelOut);

  // Subtle smooth 3D angle settling at (-7, +3.5) for Scene 2 handoff
  const stageRotateY = -10 + flightT * 3 + Math.sin(flightT * Math.PI) * 3;
  const stageRotateX = 5 - flightT * 1.5 - Math.sin(flightT * Math.PI) * 1.5;
  const stageScale = 0.96 + cardIn * 0.04 + Math.sin(flightT * Math.PI) * 0.025;

  const morphT = clampedInterpolate(
    frame,
    [102, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  const skyFadeOut = 1 - clampedInterpolate(frame, [98, 111], [0, 1]);
  const planePopIn = clampedInterpolate(frame, [19, 26], [0, 1], expOut);
  const planeOpacity =
    planePopIn * (1 - clampedInterpolate(frame, [104, 113], [0, 1]));
  const planeScale = (0.8 + planePopIn * 0.2) * (1 - morphT * 0.4);

  const boxPop = clampedInterpolate(frame, [104, 118], [0, 1], expOut);
  const boxSize = PLANE_TARGET_BOX.size * (0.45 + boxPop * 0.55);
  const boxRx = PLANE_TARGET_BOX.rx * (1.2 - boxPop * 0.2);

  const trailPath = 'M 295 1002 Q 680 620 1040 640';
  const trailLen = 960;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={540} cy={880} opacity={1} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        scale={stageScale}
        origin="540px 880px"
      >
        <svg
          width={1080}
          height={1440}
          viewBox="0 0 1080 1440"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <defs>
            {/* Clipped below top hero copy so flying elements never overlap text */}
            <clipPath id="portraitSkyClip">
              <rect x={0} y={420} width={1080} height={1020} />
            </clipPath>
            <filter id="cardFloatGlow" x="-22%" y="-22%" width="144%" height="148%">
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="18"
                floodColor="#39A6DE"
                floodOpacity="0.16"
              />
            </filter>
            <filter id="planeOuterShadow" x="-35%" y="-35%" width="170%" height="190%">
              <feDropShadow
                dx="-2"
                dy="16"
                stdDeviation="12"
                floodColor="#1E293B"
                floodOpacity="0.16"
              />
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="5"
                floodColor="#39A6DE"
                floodOpacity="0.18"
              />
            </filter>
            <filter id="wingFoldShadow" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="4"
                floodColor="#64748B"
                floodOpacity="0.22"
              />
            </filter>
            <linearGradient id="whiteWingTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
            <linearGradient id="whiteWingShade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="vapourGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.08} />
              <stop offset="55%" stopColor={COLORS.blue} stopOpacity={0.5} />
              <stop offset="100%" stopColor={COLORS.blueDeep} stopOpacity={0.65} />
            </linearGradient>
          </defs>

          <g clipPath="url(#portraitSkyClip)" opacity={skyFadeOut}>
            {/* Distant parallax layer (0.55x) */}
            <g transform={`translate(${camPanX * 0.55}, ${camPanY * 0.55})`} opacity={cardIn}>
              <circle cx={680} cy={590} r={48} fill={COLORS.blueSoft} opacity={0.75} />
              <circle cx={960} cy={800} r={38} fill={COLORS.roseSoft} opacity={0.65} />
              <rect
                x={820}
                y={520}
                width={170}
                height={42}
                rx={21}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.2}
                filter="url(#cardFloatGlow)"
              />
            </g>

            {/* Primary world layer (1.0x) */}
            <g transform={`translate(${camPanX}, ${camPanY})`} opacity={cardIn}>
              {/* Sleek SaaS Enquiry Card at Launch Origin */}
              <g
                transform={`translate(0, ${(1 - cardIn) * 28})`}
                filter="url(#cardFloatGlow)"
              >
                <rect
                  x={130}
                  y={800}
                  width={330}
                  height={266}
                  rx={24}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.8}
                />
                <rect x={160} y={830} width={34} height={34} rx={10} fill={COLORS.blueSoft} />
                <circle cx={177} cy={847} r={6.5} fill={COLORS.blue} />
                <rect
                  x={206}
                  y={841}
                  width={124}
                  height={12}
                  rx={6}
                  fill={COLORS.navy}
                  opacity={0.85}
                />

                {/* Form inputs */}
                <rect
                  x={160}
                  y={882}
                  width={270}
                  height={36}
                  rx={10}
                  fill={COLORS.stage}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.2}
                />
                <rect
                  x={176}
                  y={896}
                  width={122}
                  height={8}
                  rx={4}
                  fill={COLORS.mutedDark}
                  opacity={0.6}
                />

                <rect
                  x={160}
                  y={928}
                  width={270}
                  height={36}
                  rx={10}
                  fill={COLORS.stage}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.2}
                />
                <rect
                  x={176}
                  y={942}
                  width={176}
                  height={8}
                  rx={4}
                  fill={COLORS.mutedDark}
                  opacity={0.45}
                />

                {/* Send CTA Pill */}
                <rect
                  x={160}
                  y={978}
                  width={270}
                  height={48}
                  rx={14}
                  fill={frame >= 18 ? COLORS.blueDeep : COLORS.blue}
                />
                <rect
                  x={240}
                  y={998}
                  width={80}
                  height={8}
                  rx={4}
                  fill={COLORS.card}
                  opacity={0.92}
                />
                <path
                  d="M 332 1002 C 338 998, 344 996, 349 996 C 346 1001, 343 1006, 340 1009 L 338 1004 Z"
                  fill={COLORS.card}
                />
              </g>

              {/* Floating SaaS milestone cards panning past */}
              <g filter="url(#cardFloatGlow)">
                <rect
                  x={520}
                  y={640}
                  width={196}
                  height={66}
                  rx={18}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.5}
                />
                <rect x={540} y={659} width={28} height={28} rx={9} fill={COLORS.blueSoft} />
                <circle cx={554} cy={673} r={5.5} fill={COLORS.blue} />
                <rect x={580} y={664} width={96} height={9} rx={4.5} fill={COLORS.navy} opacity={0.8} />
                <rect x={580} y={679} width={66} height={7} rx={3.5} fill={COLORS.mutedDark} opacity={0.55} />
              </g>

              <g filter="url(#cardFloatGlow)">
                <rect
                  x={730}
                  y={830}
                  width={210}
                  height={68}
                  rx={18}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.5}
                />
                <rect x={750} y={850} width={28} height={28} rx={9} fill={COLORS.mintSoft} />
                <circle cx={764} cy={864} r={5.5} fill={COLORS.mintDeep} />
                <rect x={790} y={855} width={108} height={9} rx={4.5} fill={COLORS.navy} opacity={0.78} />
                <rect x={790} y={870} width={74} height={7} rx={3.5} fill={COLORS.mutedDark} opacity={0.55} />
              </g>

              <g filter="url(#cardFloatGlow)">
                <rect
                  x={940}
                  y={525}
                  width={196}
                  height={64}
                  rx={18}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.5}
                />
                <rect x={960} y={543} width={28} height={28} rx={9} fill={COLORS.roseSoft} />
                <circle cx={974} cy={557} r={5.5} fill={COLORS.rose} />
                <rect x={1000} y={548} width={96} height={9} rx={4.5} fill={COLORS.navy} opacity={0.78} />
                <rect x={1000} y={563} width={60} height={7} rx={3.5} fill={COLORS.mutedDark} opacity={0.55} />
              </g>

              {flightT > 0.01 && (
                <path
                  d={trailPath}
                  fill="none"
                  stroke="url(#vapourGrad)"
                  strokeWidth={4}
                  strokeDasharray={`${trailLen}`}
                  strokeDashoffset={trailLen * (1 - flightT)}
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* Faster foreground depth dots (1.25x) */}
            <g transform={`translate(${camPanX * 1.25}, ${camPanY * 1.25})`} opacity={cardIn * 0.75}>
              <circle cx={680} cy={970} r={9} fill={COLORS.amber} opacity={0.55} />
              <circle cx={1020} cy={760} r={11} fill={COLORS.blue} opacity={0.3} />
            </g>
          </g>

          {/* Curved Pure-White Paper Airplane with layered drop shadows */}
          {planeOpacity > 0.01 && (
            <g
              transform={`translate(${screenX}, ${screenY}) rotate(${planeRotation}) scale(${planeScale})`}
              opacity={planeOpacity}
            >
              <ellipse
                cx={-6}
                cy={54}
                rx={48}
                ry={9}
                fill={COLORS.cardShadow}
                opacity={0.9}
              />

              <g filter="url(#planeOuterShadow)">
                <path
                  d="M -52 -24 C -14 -24, 34 -12, 70 0 C 34 2, -6 4, -34 10 C -44 0, -50 -12, -52 -24 Z"
                  fill="url(#whiteWingTop)"
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                />
                <path
                  d="M -32 8 C 4 4, 38 1, 70 0 C 38 11, 6 24, -18 36 C -22 25, -26 16, -32 8 Z"
                  fill="url(#whiteWingShade)"
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.3}
                  strokeLinejoin="round"
                  filter="url(#wingFoldShadow)"
                />
                <path
                  d="M -58 2 C -22 -3, 28 -4, 70 0 C 34 13, 0 28, -32 42 C -38 28, -46 14, -58 2 Z"
                  fill="url(#whiteWingTop)"
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                  filter="url(#wingFoldShadow)"
                />
                <path
                  d="M -42 5 C -8 2, 28 0, 62 0"
                  fill="none"
                  stroke={COLORS.blueSoft}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </g>
            </g>
          )}

          {/* First Rounded Box at PLANE_TARGET_BOX (540, 870) */}
          {boxPop > 0.01 && (
            <g filter="url(#cardFloatGlow)">
              <rect
                x={PLANE_TARGET_BOX.cx - boxSize / 2}
                y={PLANE_TARGET_BOX.cy - boxSize / 2}
                width={boxSize}
                height={boxSize}
                rx={boxRx}
                fill={COLORS.blue}
                opacity={boxPop}
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
          rippleColor={COLORS.blue}
        />
      </CameraStage>

      <SceneTextLayer
        headline={SCENE_COPY.scene1.headline}
        subhead={SCENE_COPY.scene1.subhead}
        startFrame={2}
      />
    </AbsoluteFill>
  );
};
