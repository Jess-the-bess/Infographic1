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
 * Scene 3 (8–12s | Frames 240–359, local 0–119) — Tablet/Mobile Portrait Hero (1080x1440).
 * - Match-cuts from full-screen Blue (1080x1440) into Blue root card at (420, 500).
 * - Pulls back in 3D space to reveal shadowed sitemap connectors & research/copy cards.
 * - Cursor clicks the central card; in final 0.5s it expands to PREVIEW_RECT.
 */
export const Scene3ResearchSitemap: React.FC = () => {
  const frame = useCurrentFrame();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const pullBack = clampedInterpolate(frame, [0, 24], [0, 1], expOut);

  const rootTarget = {x: 420, y: 500, width: 240, height: 86, rx: 18};
  const rootX = 0 + rootTarget.x * pullBack;
  const rootY = 0 + rootTarget.y * pullBack;
  const rootW = 1080 + (rootTarget.width - 1080) * pullBack;
  const rootH = 1440 + (rootTarget.height - 1440) * pullBack;
  const rootRx = rootTarget.rx * pullBack;

  const lineDraw = clampedInterpolate(frame, [24, 56], [0, 1], expOut);
  const lineLen = 1200;

  const row1Progress = clampedInterpolate(frame, [38, 62], [0, 1], expOut);
  const row2Progress = clampedInterpolate(frame, [54, 78], [0, 1], expOut);

  // Cursor glides to center card (540, 748) and clicks at f 96
  const cursorMove = clampedInterpolate(frame, [76, 95], [0, 1], expOut);
  const cursorX = 780 + (552 - 780) * cursorMove;
  const cursorY = 980 + (756 - 980) * cursorMove;
  const cursorClickRipple = clampedInterpolate(
    frame,
    [96, 108],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cursorScale =
    frame >= 95 && frame <= 101
      ? 1 -
        clampedInterpolate(frame, [95, 98], [0, 0.16]) +
        clampedInterpolate(frame, [98, 101], [0, 0.16])
      : 1;
  const cursorOpacity =
    clampedInterpolate(frame, [76, 82], [0, 1]) *
    (1 - clampedInterpolate(frame, [104, 112], [0, 1]));

  const expandT = clampedInterpolate(
    frame,
    [104, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );
  const othersFade = 1 - clampedInterpolate(frame, [102, 110], [0, 1]);

  // Subtle smooth 3D angle settling at (-7, +3.5) for Scene 4 handoff
  const midArc = Math.sin(clampedInterpolate(frame, [24, 104], [0, Math.PI]));
  const stageRotateX = pullBack * (3.5 + midArc * 1.8);
  const stageRotateY = pullBack * (-7 - midArc * 3.2);

  const centerBase = {x: 415, y: 675, width: 250, height: 146, rx: 16};
  const expX = centerBase.x + (PREVIEW_RECT.x - centerBase.x) * expandT;
  const expY = centerBase.y + (PREVIEW_RECT.y - centerBase.y) * expandT;
  const expW = centerBase.width + (PREVIEW_RECT.width - centerBase.width) * expandT;
  const expH = centerBase.height + (PREVIEW_RECT.height - centerBase.height) * expandT;
  const expRx = centerBase.rx + (22 - centerBase.rx) * expandT;

  const sideCols = [105, 725];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={540} cy={780} opacity={pullBack} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        origin="540px 780px"
      >
        <svg
          width={1080}
          height={1440}
          viewBox="0 0 1080 1440"
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
                d="M 540 586 L 540 634 M 230 634 L 850 634 M 230 634 L 230 675 M 540 634 L 540 675 M 850 634 L 850 675 M 230 821 L 230 880 M 540 821 L 540 880 M 850 821 L 850 880"
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={3.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={lineLen}
                strokeDashoffset={lineLen * (1 - lineDraw)}
              />
              {lineDraw > 0.55 && (
                <g opacity={(lineDraw - 0.55) / 0.45}>
                  <circle cx={540} cy={634} r={5.5} fill={COLORS.blue} />
                  <circle cx={230} cy={634} r={4.5} fill={COLORS.blue} />
                  <circle cx={850} cy={634} r={4.5} fill={COLORS.blue} />
                </g>
              )}
            </g>
          )}

          {/* Side Row 1 cards */}
          {row1Progress > 0.01 && othersFade > 0.01 && (
            <g opacity={row1Progress * othersFade} filter="url(#sitemapCardGlow)">
              {sideCols.map((cx, i) => (
                <g
                  key={cx}
                  transform={`translate(${cx}, ${675 + (1 - row1Progress) * 26}) scale(${0.92 + row1Progress * 0.08})`}
                >
                  <rect
                    x={0}
                    y={0}
                    width={250}
                    height={146}
                    rx={18}
                    fill={COLORS.card}
                    stroke={COLORS.cardBorderBlue}
                    strokeWidth={1.6}
                  />
                  <rect
                    x={22}
                    y={22}
                    width={32}
                    height={32}
                    rx={9}
                    fill={i === 0 ? COLORS.blueSoft : COLORS.roseSoft}
                  />
                  {i === 0 ? (
                    <g fill={COLORS.blue}>
                      <rect x={29} y={40} width={4} height={8} rx={1.5} />
                      <rect x={36} y={35} width={4} height={13} rx={1.5} />
                      <rect x={43} y={30} width={4} height={18} rx={1.5} />
                    </g>
                  ) : (
                    <g stroke={COLORS.rose} strokeWidth={2.4} strokeLinecap="round">
                      <line x1={30} y1={32} x2={46} y2={32} />
                      <line x1={30} y1={38} x2={43} y2={38} />
                      <line x1={30} y1={44} x2={39} y2={44} />
                    </g>
                  )}
                  <rect
                    x={66}
                    y={32}
                    width={96}
                    height={12}
                    rx={6}
                    fill={COLORS.navy}
                    opacity={0.82}
                  />
                  <rect x={22} y={72} width={202} height={10} rx={5} fill={COLORS.muted} />
                  <rect x={22} y={92} width={154} height={10} rx={5} fill={COLORS.muted} />
                  <rect
                    x={22}
                    y={114}
                    width={108}
                    height={8}
                    rx={4}
                    fill={i === 0 ? COLORS.blueSoft : COLORS.roseSoft}
                  />
                </g>
              ))}
            </g>
          )}

          {/* Row 2 cards */}
          {row2Progress > 0.01 && othersFade > 0.01 && (
            <g opacity={row2Progress * othersFade} filter="url(#sitemapCardGlow)">
              {[105, 415, 725].map((cx, i) => {
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
                    transform={`translate(${cx}, ${880 + (1 - row2Progress) * 26}) scale(${0.92 + row2Progress * 0.08})`}
                  >
                    <rect
                      x={0}
                      y={0}
                      width={250}
                      height={120}
                      rx={18}
                      fill={COLORS.card}
                      stroke={COLORS.cardBorder}
                      strokeWidth={1.5}
                    />
                    <rect x={22} y={22} width={30} height={30} rx={9} fill={chipBg} />
                    <circle cx={37} cy={37} r={6} fill={chipDot} />
                    <rect
                      x={64}
                      y={31}
                      width={i === 1 ? 102 : 84}
                      height={11}
                      rx={5.5}
                      fill={COLORS.navy}
                      opacity={0.8}
                    />
                    <rect x={22} y={68} width={196} height={9} rx={4.5} fill={COLORS.muted} />
                    <rect
                      x={22}
                      y={86}
                      width={142}
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
                  <circle cx={rootX + 50} cy={rootY + 43} r={8.5} fill={COLORS.card} opacity={0.9} />
                  <rect
                    x={rootX + 72}
                    y={rootY + 37}
                    width={118}
                    height={12}
                    rx={6}
                    fill={COLORS.card}
                  />
                </g>
              )}
            </g>
          )}

          {/* Center Expanding Card -> PREVIEW_RECT */}
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
                  x={expX + 22}
                  y={expY + 22}
                  width={32}
                  height={32}
                  rx={9}
                  fill={COLORS.blueSoft}
                />
                <circle cx={expX + 38} cy={expY + 38} r={6} fill={COLORS.blue} />
                <rect
                  x={expX + 66}
                  y={expY + 32}
                  width={108}
                  height={12}
                  rx={6}
                  fill={COLORS.navy}
                  opacity={0.88}
                />
                <rect
                  x={expX + 22}
                  y={expY + 72}
                  width={202}
                  height={11}
                  rx={5.5}
                  fill={COLORS.muted}
                />
                <rect
                  x={expX + 22}
                  y={expY + 94}
                  width={154}
                  height={11}
                  rx={5.5}
                  fill={COLORS.muted}
                />
                <rect
                  x={expX + 22}
                  y={expY + 114}
                  width={94}
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

      <SceneTextLayer
        headline={SCENE_COPY.scene3.headline}
        subhead={SCENE_COPY.scene3.subhead}
        startFrame={16}
      />
    </AbsoluteFill>
  );
};
