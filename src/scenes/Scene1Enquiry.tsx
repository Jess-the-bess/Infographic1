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
 * Scene 1 (0–4s | Frames 0–119): First contact.
 * - A subtly angled 3D SaaS enquiry card enters; cursor clicks Send.
 * - A sculpted, curved pure-white paper airplane with layered fold drop shadows
 *   lifts off along a smooth arc while the 3D camera pans gracefully with it.
 * - Final 0.5s (f 102..119): Plane arrives at PLANE_TARGET_BOX (1410, 520) and
 *   transforms cleanly into the rounded Blue (#39A6DE) box opening Scene 2.
 */
export const Scene1Enquiry: React.FC = () => {
  const frame = useCurrentFrame();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const cardIn = clampedInterpolate(frame, [0, 18], [0, 1], expOut);

  // Cursor glides onto the Send Enquiry button (1145, 624) and clicks at f 16..24
  const cursorMove = clampedInterpolate(frame, [4, 17], [0, 1], expOut);
  const cursorX = 1290 + (1145 - 1290) * cursorMove;
  const cursorY = 740 + (624 - 740) * cursorMove;
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

  // Main flight + camera pan progress (f 22..102)
  const flightT = clampedInterpolate(
    frame,
    [22, 102],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  // Exact quadratic Bezier P0=(1140,620), P1=(1560,290), P2=(2060,260)
  const oneMinusT = 1 - flightT;
  const planeWorldX =
    oneMinusT * oneMinusT * 1140 +
    2 * oneMinusT * flightT * 1560 +
    flightT * flightT * 2060;
  const planeWorldY =
    oneMinusT * oneMinusT * 620 +
    2 * oneMinusT * flightT * 290 +
    flightT * flightT * 260;

  const dx = 2 * oneMinusT * (1560 - 1140) + 2 * flightT * (2060 - 1560);
  const dy = 2 * oneMinusT * (290 - 620) + 2 * flightT * (260 - 290);
  const tangentAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  const camPanX = -flightT * 650;
  const camPanY = flightT * 260;

  const screenX = planeWorldX + camPanX;
  const screenY = planeWorldY + camPanY;

  const levelOut = clampedInterpolate(frame, [94, 110], [0, 1], expOut);
  const planeRotation = tangentAngleDeg * (1 - levelOut);

  // Noticeable yet smooth 3D angle across the right-hand animation, settling at (-8, +4) for Scene 2
  const stageRotateY = -11 + flightT * 3 + Math.sin(flightT * Math.PI) * 3.5;
  const stageRotateX = 5.5 - flightT * 1.5 - Math.sin(flightT * Math.PI) * 1.5;
  const stageScale = 0.96 + cardIn * 0.04 + Math.sin(flightT * Math.PI) * 0.025;

  // Final 0.5s morph: Curved white plane -> Rounded Blue Box at PLANE_TARGET_BOX
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
  const planeScale = (0.78 + planePopIn * 0.22) * (1 - morphT * 0.4);

  const boxPop = clampedInterpolate(frame, [104, 118], [0, 1], expOut);
  const boxSize = PLANE_TARGET_BOX.size * (0.45 + boxPop * 0.55);
  const boxRx = PLANE_TARGET_BOX.rx * (1.2 - boxPop * 0.2);

  const trailPath = 'M 1140 620 Q 1560 290 2060 260';
  const trailLen = 1080;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={1390} cy={510} opacity={1} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        scale={stageScale}
        origin="1380px 520px"
      >
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <defs>
            <clipPath id="flightSkyClip">
              <rect x={870} y={0} width={1050} height={1080} />
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

          {/* Panning Multi-Depth Sky World Layer */}
          <g clipPath="url(#flightSkyClip)" opacity={skyFadeOut}>
            {/* Distant slow parallax layer (0.55x) */}
            <g transform={`translate(${camPanX * 0.55}, ${camPanY * 0.55})`} opacity={cardIn}>
              <circle cx={1480} cy={220} r={54} fill={COLORS.blueSoft} opacity={0.75} />
              <circle cx={1760} cy={420} r={42} fill={COLORS.roseSoft} opacity={0.65} />
              <rect
                x={1620}
                y={150}
                width={170}
                height={42}
                rx={21}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.2}
                filter="url(#cardFloatGlow)"
              />
            </g>

            {/* Primary world plane layer (1.0x) */}
            <g transform={`translate(${camPanX}, ${camPanY})`} opacity={cardIn}>
              {/* Sleek SaaS Enquiry Card at Launch Origin */}
              <g
                transform={`translate(0, ${(1 - cardIn) * 28})`}
                filter="url(#cardFloatGlow)"
              >
                <rect
                  x={985}
                  y={435}
                  width={310}
                  height={250}
                  rx={24}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.8}
                />
                <rect
                  x={1013}
                  y={463}
                  width={32}
                  height={32}
                  rx={10}
                  fill={COLORS.blueSoft}
                />
                <circle cx={1029} cy={479} r={6} fill={COLORS.blue} />
                <rect
                  x={1057}
                  y={473}
                  width={118}
                  height={12}
                  rx={6}
                  fill={COLORS.navy}
                  opacity={0.85}
                />

                {/* Form fields */}
                <rect
                  x={1013}
                  y={513}
                  width={254}
                  height={34}
                  rx={10}
                  fill={COLORS.stage}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.2}
                />
                <rect
                  x={1027}
                  y={526}
                  width={116}
                  height={8}
                  rx={4}
                  fill={COLORS.mutedDark}
                  opacity={0.6}
                />

                <rect
                  x={1013}
                  y={557}
                  width={254}
                  height={34}
                  rx={10}
                  fill={COLORS.stage}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.2}
                />
                <rect
                  x={1027}
                  y={570}
                  width={168}
                  height={8}
                  rx={4}
                  fill={COLORS.mutedDark}
                  opacity={0.45}
                />

                {/* Send CTA Pill */}
                <rect
                  x={1013}
                  y={603}
                  width={254}
                  height={46}
                  rx={14}
                  fill={frame >= 18 ? COLORS.blueDeep : COLORS.blue}
                />
                <rect
                  x={1088}
                  y={622}
                  width={76}
                  height={8}
                  rx={4}
                  fill={COLORS.card}
                  opacity={0.92}
                />
                <path
                  d="M 1175 626 C 1181 622, 1187 620, 1192 620 C 1189 625, 1186 630, 1183 633 L 1181 628 Z"
                  fill={COLORS.card}
                />
              </g>

              {/* Floating SaaS milestone cards panning past with soft shadows */}
              <g filter="url(#cardFloatGlow)">
                <rect
                  x={1360}
                  y={285}
                  width={186}
                  height={62}
                  rx={18}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.5}
                />
                <rect x={1378} y={302} width={28} height={28} rx={9} fill={COLORS.blueSoft} />
                <circle cx={1392} cy={316} r={5.5} fill={COLORS.blue} />
                <rect x={1418} y={307} width={92} height={9} rx={4.5} fill={COLORS.navy} opacity={0.8} />
                <rect x={1418} y={322} width={64} height={7} rx={3.5} fill={COLORS.mutedDark} opacity={0.55} />
              </g>

              <g filter="url(#cardFloatGlow)">
                <rect
                  x={1595}
                  y={442}
                  width={200}
                  height={66}
                  rx={18}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.5}
                />
                <rect x={1613} y={461} width={28} height={28} rx={9} fill={COLORS.mintSoft} />
                <circle cx={1627} cy={475} r={5.5} fill={COLORS.mintDeep} />
                <rect x={1653} y={466} width={104} height={9} rx={4.5} fill={COLORS.navy} opacity={0.78} />
                <rect x={1653} y={481} width={72} height={7} rx={3.5} fill={COLORS.mutedDark} opacity={0.55} />
              </g>

              <g filter="url(#cardFloatGlow)">
                <rect
                  x={1820}
                  y={165}
                  width={190}
                  height={60}
                  rx={18}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.5}
                />
                <rect x={1838} y={181} width={28} height={28} rx={9} fill={COLORS.roseSoft} />
                <circle cx={1852} cy={195} r={5.5} fill={COLORS.rose} />
                <rect x={1878} y={186} width={96} height={9} rx={4.5} fill={COLORS.navy} opacity={0.78} />
                <rect x={1878} y={201} width={58} height={7} rx={3.5} fill={COLORS.mutedDark} opacity={0.55} />
              </g>

              {/* Soft vapour trail */}
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

            {/* Foreground depth accents (1.25x) */}
            <g transform={`translate(${camPanX * 1.25}, ${camPanY * 1.25})`} opacity={cardIn * 0.75}>
              <circle cx={1540} cy={595} r={9} fill={COLORS.amber} opacity={0.55} />
              <circle cx={1930} cy={380} r={11} fill={COLORS.blue} opacity={0.3} />
            </g>
          </g>

          {/* Curved, Pure-White Paper Airplane with layered drop shadows */}
          {planeOpacity > 0.01 && (
            <g
              transform={`translate(${screenX}, ${screenY}) rotate(${planeRotation}) scale(${planeScale})`}
              opacity={planeOpacity}
            >
              {/* Soft floating ground shadow below plane */}
              <ellipse
                cx={-6}
                cy={52}
                rx={46}
                ry={9}
                fill={COLORS.cardShadow}
                opacity={0.9}
              />

              <g filter="url(#planeOuterShadow)">
                {/* Far curved rear wing */}
                <path
                  d="M -52 -24 C -14 -24, 34 -12, 70 0 C 34 2, -6 4, -34 10 C -44 0, -50 -12, -52 -24 Z"
                  fill="url(#whiteWingTop)"
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.4}
                  strokeLinejoin="round"
                />

                {/* Curved inner belly / keel fold with shadow */}
                <path
                  d="M -32 8 C 4 4, 38 1, 70 0 C 38 11, 6 24, -18 36 C -22 25, -26 16, -32 8 Z"
                  fill="url(#whiteWingShade)"
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.3}
                  strokeLinejoin="round"
                  filter="url(#wingFoldShadow)"
                />

                {/* Sweeping curved near wing (pure white with sculpted shadow & soft edge) */}
                <path
                  d="M -58 2 C -22 -3, 28 -4, 70 0 C 34 13, 0 28, -32 42 C -38 28, -46 14, -58 2 Z"
                  fill="url(#whiteWingTop)"
                  stroke={COLORS.cardBorderBlue}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                  filter="url(#wingFoldShadow)"
                />

                {/* Delicate curved contour crease along top wing */}
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

          {/* First Rounded Box emerging from plane at PLANE_TARGET_BOX (1410, 520) */}
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
