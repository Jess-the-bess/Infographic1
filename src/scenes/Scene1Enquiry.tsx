import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {SCENE_COPY} from '../copy';
import {COLORS, PLANE_TARGET_BOX, clampedInterpolate} from '../theme';

/**
 * Scene 1 (0–4s | Frames 0–119): First contact.
 * - An origami paper airplane represents the client's enquiry.
 * - f 20..102: Plane lifts off along a buoyant quadratic Bezier flight curve
 *   while a smooth camera screen pan tracks alongside it.
 * - f 102..119 (final 0.5s): Plane arrives at PLANE_TARGET_BOX (1410, 520) and
 *   transforms cleanly into the rounded Blue (#39A6DE) box that opens Scene 2.
 */
export const Scene1Enquiry: React.FC = () => {
  const frame = useCurrentFrame();

  const introPop = clampedInterpolate(
    frame,
    [0, 16],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  // Main flight + camera pan progress (f 20..102)
  const flightT = clampedInterpolate(
    frame,
    [20, 102],
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

  // True tangent pitch along curve
  const dx = 2 * oneMinusT * (1560 - 1140) + 2 * flightT * (2060 - 1560);
  const dy = 2 * oneMinusT * (290 - 620) + 2 * flightT * (260 - 290);
  const tangentAngleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Screen pan follows the plane smoothly so it arrives at PLANE_TARGET_BOX (1410, 520)
  const camPanX = -flightT * 650;
  const camPanY = flightT * 260;

  const screenX = planeWorldX + camPanX;
  const screenY = planeWorldY + camPanY;

  // Smoothly level pitch to 0° as plane prepares to morph into the first box
  const levelOut = clampedInterpolate(
    frame,
    [94, 110],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const planeRotation = tangentAngleDeg * (1 - levelOut);

  // Final 0.5s transformation: Plane -> Rounded Blue Box at PLANE_TARGET_BOX (1410, 520)
  const morphT = clampedInterpolate(
    frame,
    [102, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  const skyFadeOut = 1 - clampedInterpolate(frame, [100, 112], [0, 1]);
  const planeOpacity =
    introPop * (1 - clampedInterpolate(frame, [104, 113], [0, 1]));
  const planeScale = (0.9 + introPop * 0.1) * (1 - morphT * 0.45);

  const boxPop = clampedInterpolate(
    frame,
    [104, 118],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const boxSize = PLANE_TARGET_BOX.size * (0.45 + boxPop * 0.55);
  const boxRx = PLANE_TARGET_BOX.rx * (1.2 - boxPop * 0.2);

  // Exact matching vapour trail curve in world space
  const trailPath = 'M 1140 620 Q 1560 290 2060 260';
  const trailLen = 1080;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        <defs>
          <clipPath id="flightSkyClip">
            <rect x={910} y={0} width={1010} height={1080} />
          </clipPath>
        </defs>

        {/* Panning Sky World Layer (clipped cleanly to right half) */}
        <g clipPath="url(#flightSkyClip)" opacity={skyFadeOut}>
          <g transform={`translate(${camPanX}, ${camPanY})`}>
            <g opacity={introPop}>
              {/* CRM-style launch pad card at origin (zero generated text) */}
              <rect
                x={1042}
                y={569}
                width={194}
                height={112}
                rx={22}
                fill={COLORS.cardShadow}
                opacity={0.75}
              />
              <rect
                x={1045}
                y={565}
                width={194}
                height={112}
                rx={22}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.5}
              />
              <rect
                x={1067}
                y={587}
                width={26}
                height={26}
                rx={8}
                fill={COLORS.blueSoft}
              />
              <circle cx={1080} cy={600} r={5.5} fill={COLORS.blue} />
              <rect
                x={1103}
                y={594}
                width={84}
                height={12}
                rx={6}
                fill={COLORS.muted}
              />
              <rect
                x={1067}
                y={628}
                width={126}
                height={10}
                rx={5}
                fill={COLORS.muted}
              />
              <rect
                x={1067}
                y={646}
                width={86}
                height={10}
                rx={5}
                fill={COLORS.muted}
                opacity={0.75}
              />

              {/* Elevated SaaS sky landmarks panning smoothly past */}
              <rect
                x={1357}
                y={304}
                width={156}
                height={44}
                rx={22}
                fill={COLORS.cardShadow}
                opacity={0.65}
              />
              <rect
                x={1360}
                y={300}
                width={156}
                height={44}
                rx={22}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.5}
              />
              <circle cx={1384} cy={322} r={7} fill={COLORS.blue} />
              <rect
                x={1402}
                y={317}
                width={84}
                height={10}
                rx={5}
                fill={COLORS.blueSoft}
              />

              <rect
                x={1557}
                y={474}
                width={185}
                height={48}
                rx={24}
                fill={COLORS.cardShadow}
                opacity={0.6}
              />
              <rect
                x={1560}
                y={470}
                width={185}
                height={48}
                rx={24}
                fill={COLORS.card}
                stroke={COLORS.cardBorder}
                strokeWidth={1.5}
              />
              <rect
                x={1584}
                y={489}
                width={110}
                height={10}
                rx={5}
                fill={COLORS.muted}
              />

              <circle cx={1710} cy={210} r={26} fill={COLORS.blueSoft} />
              <circle cx={1710} cy={210} r={10} fill={COLORS.blue} opacity={0.4} />

              <rect
                x={1817}
                y={369}
                width={165}
                height={46}
                rx={23}
                fill={COLORS.cardShadow}
                opacity={0.6}
              />
              <rect
                x={1820}
                y={365}
                width={165}
                height={46}
                rx={23}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.5}
              />
              <circle cx={1844} cy={388} r={6} fill={COLORS.mint} />
              <rect
                x={1860}
                y={383}
                width={94}
                height={10}
                rx={5}
                fill={COLORS.muted}
              />

              <rect
                x={1950}
                y={120}
                width={190}
                height={52}
                rx={26}
                fill={COLORS.blueSoft}
              />
              <circle cx={1920} cy={360} r={14} fill={COLORS.roseSoft} />
            </g>

            {/* Exact vapour trail matching plane path */}
            {flightT > 0.01 && (
              <path
                d={trailPath}
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={4}
                strokeDasharray={`${trailLen}`}
                strokeDashoffset={trailLen * (1 - flightT)}
                strokeLinecap="round"
                opacity={0.45}
              />
            )}
          </g>
        </g>

        {/* Paper Airplane (horizontally aligned along +x so rotation matches tangent pitch) */}
        {planeOpacity > 0.01 && (
          <g
            transform={`translate(${screenX}, ${screenY}) rotate(${planeRotation}) scale(${planeScale})`}
            opacity={planeOpacity}
          >
            {/* Soft air shadow */}
            <ellipse
              cx={-4}
              cy={42}
              rx={38}
              ry={7}
              fill={COLORS.cardShadow}
              opacity={0.75}
            />
            {/* Main upper wing */}
            <path
              d="M -54 -14 L 64 0 L -26 30 L -28 6 Z"
              fill={COLORS.blue}
            />
            {/* Deep fold keel */}
            <path
              d="M -28 6 L 64 0 L -14 18 Z"
              fill={COLORS.blueDeep}
            />
            {/* Lower wing */}
            <path
              d="M -28 6 L -26 30 L -4 14 Z"
              fill={COLORS.navy}
              opacity={0.28}
            />
            {/* Crisp coral nose accent */}
            <path
              d="M 28 -4 L 64 0 L 28 8 Z"
              fill={COLORS.rose}
              opacity={0.92}
            />
          </g>
        )}

        {/* First Rounded Box emerging directly from the plane at (1410, 520) */}
        {boxPop > 0.01 && (
          <rect
            x={PLANE_TARGET_BOX.cx - boxSize / 2}
            y={PLANE_TARGET_BOX.cy - boxSize / 2}
            width={boxSize}
            height={boxSize}
            rx={boxRx}
            fill={COLORS.blue}
            opacity={boxPop}
          />
        )}
      </svg>

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene1.headline}
        subhead={SCENE_COPY.scene1.subhead}
        startFrame={4}
      />
    </AbsoluteFill>
  );
};
