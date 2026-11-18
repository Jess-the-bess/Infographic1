import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {
  AmbientBackdrop,
  AnimatedCursor,
  CameraStage,
} from '../components/MotionPrimitives';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {SCENE_COPY} from '../copy';
import {COLORS, PREVIEW_RECT, clampedInterpolate} from '../theme';

/**
 * Scene 3 (8–12s | Frames 240–359, local 0–119): Planning.
 * - Match-cuts seamlessly from full-screen Blue -> Blue root card on white.
 * - Pulls back in 3D space to reveal glowing connector lines & elevated CRM-style
 *   research, sitemap, and copy cards snapping cleanly into place.
 * - Cursor taps the central page node; in the final 0.5s (f 104..119) it expands
 *   smoothly to PREVIEW_RECT to carry the transition into Design & Build.
 */
export const Scene3ResearchSitemap: React.FC = () => {
  const frame = useCurrentFrame();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  // f 0..24: Pull back from full-screen Blue block to Blue root card
  const pullBack = clampedInterpolate(frame, [0, 24], [0, 1], expOut);

  const rootTarget = {x: 1300, y: 205, width: 220, height: 82, rx: 18};
  const rootX = 0 + rootTarget.x * pullBack;
  const rootY = 0 + rootTarget.y * pullBack;
  const rootW = 1920 + (rootTarget.width - 1920) * pullBack;
  const rootH = 1080 + (rootTarget.height - 1080) * pullBack;
  const rootRx = rootTarget.rx * pullBack;

  // f 24..56: Sitemap connector lines draw downward
  const lineDraw = clampedInterpolate(frame, [24, 56], [0, 1], expOut);
  const lineLen = 1000;

  // Staggered card entrances
  const row1Progress = clampedInterpolate(frame, [38, 62], [0, 1], expOut);
  const row2Progress = clampedInterpolate(frame, [54, 78], [0, 1], expOut);

  // Cursor glides to center card (1410, 432) and clicks at f 96..104
  const cursorMove = clampedInterpolate(frame, [76, 95], [0, 1], expOut);
  const cursorX = 1640 + (1425 - 1640) * cursorMove;
  const cursorY = 640 + (440 - 640) * cursorMove;
  const cursorClickRipple = clampedInterpolate(
    frame,
    [96, 108],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cursorScale =
    frame >= 95 && frame <= 101
      ? 1 - clampedInterpolate(frame, [95, 98], [0, 0.16]) + clampedInterpolate(frame, [98, 101], [0, 0.16])
      : 1;
  const cursorOpacity =
    clampedInterpolate(frame, [76, 82], [0, 1]) *
    (1 - clampedInterpolate(frame, [104, 112], [0, 1]));

  // f 104..119 (final 0.5s): Expand center sitemap card -> PREVIEW_RECT
  const expandT = clampedInterpolate(
    frame,
    [104, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );
  const othersFade = 1 - clampedInterpolate(frame, [102, 110], [0, 1]);

  // Subtle, smooth 3D architectural angle: enters flat from Scene 2 full-frame, peaks at (-11, 5.5), settles at (-8, 4) for Scene 4
  const midArc = Math.sin(clampedInterpolate(frame, [24, 104], [0, Math.PI]));
  const stageRotateX = pullBack * (4 + midArc * 1.8);
  const stageRotateY = pullBack * (-8 - midArc * 3.2);

  const centerBase = {x: 1300, y: 365, width: 220, height: 134, rx: 16};
  const expX = centerBase.x + (PREVIEW_RECT.x - centerBase.x) * expandT;
  const expY = centerBase.y + (PREVIEW_RECT.y - centerBase.y) * expandT;
  const expW = centerBase.width + (PREVIEW_RECT.width - centerBase.width) * expandT;
  const expH = centerBase.height + (PREVIEW_RECT.height - centerBase.height) * expandT;
  const expRx = centerBase.rx + (22 - centerBase.rx) * expandT;

  const sideCols = [1030, 1570];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={1410} cy={460} opacity={pullBack} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        origin="1410px 440px"
      >
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <defs>
            <filter id="sitemapCardGlow" x="-20%" y="-20%" width="140%" height="148%">
              <feDropShadow
                dx="0"
                dy="16"
                stdDeviation="15"
                floodColor="#39A6DE"
                floodOpacity="0.16"
              />
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="5"
                floodColor="#0F172A"
                floodOpacity="0.06"
              />
            </filter>
            <filter id="connectorShadow" x="-15%" y="-15%" width="130%" height="140%">
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="4"
                floodColor="#39A6DE"
                floodOpacity="0.22"
              />
            </filter>
            <linearGradient id="rootCardGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={COLORS.blue} />
              <stop offset="100%" stopColor={COLORS.blueDeep} />
            </linearGradient>
          </defs>

          {/* Sitemap connector lines */}
          {frame >= 22 && othersFade > 0.01 && (
            <g opacity={othersFade} filter="url(#connectorShadow)">
              <path
                d="M 1410 287 L 1410 326 M 1140 326 L 1680 326 M 1140 326 L 1140 365 M 1410 326 L 1410 365 M 1680 326 L 1680 365 M 1140 499 L 1140 555 M 1410 499 L 1410 555 M 1680 499 L 1680 555"
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineLen}
                strokeDashoffset={lineLen * (1 - lineDraw)}
              />
              {/* Junction node dots */}
              {lineDraw > 0.55 && (
                <g opacity={(lineDraw - 0.55) / 0.45}>
                  <circle cx={1410} cy={326} r={5.5} fill={COLORS.blue} />
                  <circle cx={1140} cy={326} r={4.5} fill={COLORS.blue} />
                  <circle cx={1680} cy={326} r={4.5} fill={COLORS.blue} />
                </g>
              )}
            </g>
          )}

          {/* Side Row 1 cards (CRM white elevated cards with crisp micro-icons) */}
          {row1Progress > 0.01 && othersFade > 0.01 && (
            <g opacity={row1Progress * othersFade} filter="url(#sitemapCardGlow)">
              {sideCols.map((cx, i) => (
                <g
                  key={cx}
                  transform={`translate(${cx}, ${365 + (1 - row1Progress) * 26}) scale(${0.92 + row1Progress * 0.08})`}
                >
                  <rect
                    x={0}
                    y={0}
                    width={220}
                    height={134}
                    rx={16}
                    fill={COLORS.card}
                    stroke={COLORS.cardBorderBlue}
                    strokeWidth={1.6}
                  />
                  {/* Tinted icon well */}
                  <rect
                    x={20}
                    y={20}
                    width={30}
                    height={30}
                    rx={9}
                    fill={i === 0 ? COLORS.blueSoft : COLORS.roseSoft}
                  />
                  {i === 0 ? (
                    /* Market research mini bar-chart glyph */
                    <g fill={COLORS.blue}>
                      <rect x={27} y={37} width={3.5} height={7} rx={1.5} />
                      <rect x={33} y={32} width={3.5} height={12} rx={1.5} />
                      <rect x={39} y={28} width={3.5} height={16} rx={1.5} />
                    </g>
                  ) : (
                    /* Draft copy editorial line glyph */
                    <g stroke={COLORS.rose} strokeWidth={2.2} strokeLinecap="round">
                      <line x1={28} y1={30} x2={42} y2={30} />
                      <line x1={28} y1={36} x2={40} y2={36} />
                      <line x1={28} y1={42} x2={36} y2={42} />
                    </g>
                  )}
                  <rect
                    x={60}
                    y={29}
                    width={84}
                    height={12}
                    rx={6}
                    fill={COLORS.navy}
                    opacity={0.82}
                  />
                  <rect x={20} y={66} width={176} height={10} rx={5} fill={COLORS.muted} />
                  <rect x={20} y={86} width={136} height={10} rx={5} fill={COLORS.muted} />
                  <rect
                    x={20}
                    y={106}
                    width={96}
                    height={8}
                    rx={4}
                    fill={i === 0 ? COLORS.blueSoft : COLORS.roseSoft}
                  />
                </g>
              ))}
            </g>
          )}

          {/* Row 2 cards (sub-pages, analytics, flows) */}
          {row2Progress > 0.01 && othersFade > 0.01 && (
            <g opacity={row2Progress * othersFade} filter="url(#sitemapCardGlow)">
              {[1030, 1300, 1570].map((cx, i) => {
                const chipBg =
                  i === 0
                    ? COLORS.blueSoft
                    : i === 1
                    ? COLORS.roseSoft
                    : COLORS.mintSoft;
                const chipDot =
                  i === 0
                    ? COLORS.blue
                    : i === 1
                    ? COLORS.rose
                    : COLORS.mintDeep;

                return (
                  <g
                    key={cx}
                    transform={`translate(${cx}, ${555 + (1 - row2Progress) * 26}) scale(${0.92 + row2Progress * 0.08})`}
                  >
                    <rect
                      x={0}
                      y={0}
                      width={220}
                      height={112}
                      rx={16}
                      fill={COLORS.card}
                      stroke={COLORS.cardBorder}
                      strokeWidth={1.5}
                    />
                    <rect x={20} y={20} width={28} height={28} rx={8} fill={chipBg} />
                    <circle cx={34} cy={34} r={5.5} fill={chipDot} />
                    <rect
                      x={58}
                      y={28}
                      width={i === 1 ? 92 : 74}
                      height={11}
                      rx={5.5}
                      fill={COLORS.navy}
                      opacity={0.8}
                    />
                    <rect x={20} y={62} width={172} height={9} rx={4.5} fill={COLORS.muted} />
                    <rect
                      x={20}
                      y={80}
                      width={126}
                      height={9}
                      rx={4.5}
                      fill={COLORS.muted}
                      opacity={0.75}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Root Blue Card */}
          {othersFade > 0.01 && (
            <g
              opacity={pullBack < 0.05 ? 1 : othersFade}
              filter={pullBack > 0.15 ? 'url(#sitemapCardGlow)' : undefined}
            >
              <rect
                x={rootX}
                y={rootY}
                width={rootW}
                height={rootH}
                rx={rootRx}
                fill="url(#rootCardGrad)"
              />
              {pullBack > 0.65 && (
                <g opacity={(pullBack - 0.65) / 0.35}>
                  <circle cx={rootX + 46} cy={rootY + 41} r={8} fill={COLORS.card} opacity={0.9} />
                  <rect
                    x={rootX + 66}
                    y={rootY + 35}
                    width={106}
                    height={12}
                    rx={6}
                    fill={COLORS.card}
                  />
                </g>
              )}
            </g>
          )}

          {/* Center Expanding Sitemap Card -> expands seamlessly to PREVIEW_RECT */}
          {row1Progress > 0.01 && (
            <g opacity={row1Progress} filter="url(#sitemapCardGlow)">
              <rect
                x={expX}
                y={expY}
                width={expW}
                height={expH}
                rx={expRx}
                fill={COLORS.card}
                stroke={
                  frame >= 96 || expandT > 0.25
                    ? COLORS.blue
                    : COLORS.cardBorderBlue
                }
                strokeWidth={frame >= 96 && expandT < 0.2 ? 2.4 : 2}
              />
              <g opacity={1 - expandT}>
                <rect
                  x={expX + 20}
                  y={expY + 20}
                  width={30}
                  height={30}
                  rx={9}
                  fill={COLORS.blueSoft}
                />
                <circle cx={expX + 35} cy={expY + 35} r={6} fill={COLORS.blue} />
                <rect
                  x={expX + 60}
                  y={expY + 29}
                  width={98}
                  height={12}
                  rx={6}
                  fill={COLORS.navy}
                  opacity={0.88}
                />
                <rect
                  x={expX + 20}
                  y={66 + expY}
                  width={176}
                  height={11}
                  rx={5.5}
                  fill={COLORS.muted}
                />
                <rect
                  x={expX + 20}
                  y={88 + expY}
                  width={136}
                  height={11}
                  rx={5.5}
                  fill={COLORS.muted}
                />
                <rect
                  x={expX + 20}
                  y={108 + expY}
                  width={82}
                  height={8}
                  rx={4}
                  fill={COLORS.blueSoft}
                />
              </g>
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

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene3.headline}
        subhead={SCENE_COPY.scene3.subhead}
        startFrame={16}
      />
    </AbsoluteFill>
  );
};
