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
 * - Sleek 3D-tilted SaaS enquiry card enters; animated cursor clicks the Send CTA.
 * - Origami paper airplane launches into its buoyant first flight with multi-layer
 *   parallax & smooth camera screen pan tracking alongside it.
 * - Final 0.5s (f 102..119): Plane arrives at PLANE_TARGET_BOX (1410, 520) and
 *   transforms cleanly into the rounded Blue (#39A6DE) box that opens Scene 2.
 */
export const Scene1Enquiry: React.FC = () => {
  const frame = useCurrentFrame();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  // Card entrance & subtle 3D tilt settle
  const cardIn = clampedInterpolate(frame, [0, 18], [0, 1], expOut);

  // Cursor glides onto the Send Enquiry button (1140, 620) and clicks at f 16..24
  const cursorMove = clampedInterpolate(frame, [4, 17], [0, 1], expOut);
  const cursorX = 1280 + (1145 - 1280) * cursorMove;
  const cursorY = 740 + (624 - 740) * cursorMove;
  const cursorClickRipple = clampedInterpolate(
    frame,
    [17, 29],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cursorScale =
    frame >= 16 && frame <= 21
      ? 1 - clampedInterpolate(frame, [16, 19], [0, 0.16]) + clampedInterpolate(frame, [19, 22], [0, 0.16])
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

  // Tangent pitch along flight curve
  const dx = 2 * oneMinusT * (1560 - 1140) + 2 * flightT * (2060 - 1560);
  const dy = 2 * oneMinusT * (290 - 620) + 2 * flightT * (260 - 290);
  const tangentAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Screen pan follows the plane smoothly so it arrives at PLANE_TARGET_BOX (1410, 520)
  const camPanX = -flightT * 650;
  const camPanY = flightT * 260;

  const screenX = planeWorldX + camPanX;
  const screenY = planeWorldY + camPanY;

  // Level pitch to 0deg as plane morphs into opening box
  const levelOut = clampedInterpolate(frame, [94, 110], [0, 1], expOut);
  const planeRotation = tangentAngleDeg * (1 - levelOut);

  // Subtle 3D camera bank during flight that settles flat for clean Scene 2 cut
  const stageRotateY = -6 * (1 - flightT) + Math.sin(flightT * Math.PI) * 5;
  const stageRotateX = 3 * (1 - flightT) - Math.sin(flightT * Math.PI) * 2.5;
  const stageScale = 0.96 + cardIn * 0.04 + Math.sin(flightT * Math.PI) * 0.03;

  // Final 0.5s morph: Plane -> Rounded Blue Box at PLANE_TARGET_BOX (1410, 520)
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
  const planeScale = (0.75 + planePopIn * 0.25) * (1 - morphT * 0.42);

  const boxPop = clampedInterpolate(frame, [104, 118], [0, 1], expOut);
  const boxSize = PLANE_TARGET_BOX.size * (0.45 + boxPop * 0.55);
  const boxRx = PLANE_TARGET_BOX.rx * (1.2 - boxPop * 0.2);

  const trailPath = 'M 1140 620 Q 1560 290 2060 260';
  const trailLen = 1080;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={1390} cy={510} opacity={0.95} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        scale={stageScale}
        origin="1360px 540px"
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
            <filter id="cardFloatGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="18"
                floodColor="#39A6DE"
                floodOpacity="0.14"
              />
            </filter>
            <linearGradient id="vapourGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.08} />
              <stop offset="55%" stopColor={COLORS.blue} stopOpacity={0.55} />
              <stop offset="100%" stopColor={COLORS.rose} stopOpacity={0.65} />
            </linearGradient>
          </defs>

          {/* Panning Multi-Depth Sky World Layer (clipped cleanly to right half) */}
          <g clipPath="url(#flightSkyClip)" opacity={skyFadeOut}>
            {/* Distant slow parallax layer (0.55x) */}
            <g transform={`translate(${camPanX * 0.55}, ${camPanY * 0.55})`} opacity={cardIn}>
              <circle cx={1480} cy={220} r={54} fill={COLORS.blueSoft} opacity={0.7} />
              <circle cx={1760} cy={420} r={42} fill={COLORS.roseSoft} opacity={0.65} />
              <rect
                x={1620}
                y={150}
                width={170}
                height={42}
                rx={21}
                fill={COLORS.stage}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1}
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
                {/* Top CRM icon chip + header bar */}
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

                {/* Form input skeletons */}
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

                {/* Primary Send Enquiry Pill Button */}
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
                  d="M 1176 626 L 1190 620 L 1184 633 L 1181 628 Z"
                  fill={COLORS.card}
                />
              </g>

              {/* Floating SaaS milestone cards panning gracefully past */}
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

              {/* Glowing vapour trail matching exact plane trajectory */}
              {flightT > 0.01 && (
                <path
                  d={trailPath}
                  fill="none"
                  stroke="url(#vapourGrad)"
                  strokeWidth={4.5}
                  strokeDasharray={`${trailLen}`}
                  strokeDashoffset={trailLen * (1 - flightT)}
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* Faster foreground subtle accents (1.25x) */}
            <g transform={`translate(${camPanX * 1.25}, ${camPanY * 1.25})`} opacity={cardIn * 0.75}>
              <circle cx={1540} cy={595} r={9} fill={COLORS.amber} opacity={0.55} />
              <circle cx={1930} cy={380} r={11} fill={COLORS.blue} opacity={0.3} />
            </g>
          </g>

          {/* Origami Paper Airplane (aligned horizontally so tangent rotation reads cleanly) */}
          {planeOpacity > 0.01 && (
            <g
              transform={`translate(${screenX}, ${screenY}) rotate(${planeRotation}) scale(${planeScale})`}
              opacity={planeOpacity}
            >
              <ellipse
                cx={-6}
                cy={46}
                rx={42}
                ry={8}
                fill={COLORS.cardShadow}
                opacity={0.85}
              />
              {/* Main upper wing */}
              <path d="M -56 -15 L 68 0 L -26 32 L -29 6 Z" fill={COLORS.blue} />
              {/* Deep fold keel */}
              <path d="M -29 6 L 68 0 L -14 19 Z" fill={COLORS.blueDeep} />
              {/* Lower shadow wing */}
              <path
                d="M -29 6 L -26 32 L -4 15 Z"
                fill={COLORS.navy}
                opacity={0.28}
              />
              {/* Highlighted coral nose */}
              <path
                d="M 30 -4 L 68 0 L 30 9 Z"
                fill={COLORS.rose}
                opacity={0.94}
              />
            </g>
          )}

          {/* First Rounded Box emerging directly from plane at PLANE_TARGET_BOX (1410, 520) */}
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

        {/* Interactive Cursor clicking Send Enquiry */}
        <AnimatedCursor
          x={cursorX}
          y={cursorY}
          opacity={cursorOpacity}
          scale={cursorScale}
          clickRipple={cursorClickRipple}
          rippleColor={COLORS.blue}
        />
      </CameraStage>

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene1.headline}
        subhead={SCENE_COPY.scene1.subhead}
        startFrame={2}
      />
    </AbsoluteFill>
  );
};
