import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {SCENE_COPY} from '../copy';
import {COLORS, PREVIEW_RECT, clampedInterpolate} from '../theme';

/**
 * Scene 3 (8–12s | Frames 240–359, local 0–119): Planning.
 * - Match-cut from full-screen Blue (#39A6DE) block -> Blue root card on white.
 * - Pull back to reveal connector lines & smaller cards snapping beneath it to form a sitemap.
 * - Final half-second (f 104..119): expand one card to PREVIEW_RECT to carry transition.
 */
export const Scene3ResearchSitemap: React.FC = () => {
  const frame = useCurrentFrame();

  // f 0..24: Pull back from full-screen Blue block to Blue root card
  const pullBack = clampedInterpolate(
    frame,
    [0, 24],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  const rootTarget = {x: 1300, y: 205, width: 220, height: 82, rx: 16};
  const rootX = 0 + rootTarget.x * pullBack;
  const rootY = 0 + rootTarget.y * pullBack;
  const rootW = 1920 + (rootTarget.width - 1920) * pullBack;
  const rootH = 1080 + (rootTarget.height - 1080) * pullBack;
  const rootRx = rootTarget.rx * pullBack;

  // f 26..56: Sitemap connector lines draw downward
  const lineDraw = clampedInterpolate(
    frame,
    [26, 56],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const lineLen = 1000;

  // f 40..82: Smaller cards snap into place beneath root card
  const row1Progress = clampedInterpolate(
    frame,
    [40, 62],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const row2Progress = clampedInterpolate(
    frame,
    [56, 80],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  // f 104..119 (final 0.5s): Expand center sitemap card -> PREVIEW_RECT
  const expandT = clampedInterpolate(
    frame,
    [104, 119],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );
  const othersFade = 1 - clampedInterpolate(frame, [104, 112], [0, 1]);

  const centerBase = {x: 1300, y: 365, width: 220, height: 134, rx: 14};
  const expX = centerBase.x + (PREVIEW_RECT.x - centerBase.x) * expandT;
  const expY = centerBase.y + (PREVIEW_RECT.y - centerBase.y) * expandT;
  const expW = centerBase.width + (PREVIEW_RECT.width - centerBase.width) * expandT;
  const expH = centerBase.height + (PREVIEW_RECT.height - centerBase.height) * expandT;
  const expRx = centerBase.rx + (20 - centerBase.rx) * expandT;

  const sideCols = [1030, 1570];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        {/* Sitemap connector lines */}
        {frame >= 24 && othersFade > 0.01 && (
          <g opacity={othersFade}>
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
          </g>
        )}

        {/* Side Row 1 cards (CRM-style elevated white cards with tinted icon chips) */}
        {row1Progress > 0.01 && othersFade > 0.01 && (
          <g opacity={row1Progress * othersFade}>
            {sideCols.map((cx, i) => (
              <g
                key={cx}
                transform={`translate(${cx}, ${365 + (1 - row1Progress) * 20})`}
              >
                <rect
                  x={-3}
                  y={4}
                  width={226}
                  height={138}
                  rx={18}
                  fill={COLORS.cardShadow}
                  opacity={0.75}
                />
                <rect
                  x={0}
                  y={0}
                  width={220}
                  height={134}
                  rx={16}
                  fill={COLORS.card}
                  stroke={COLORS.cardBorder}
                  strokeWidth={1.5}
                />
                <rect
                  x={20}
                  y={20}
                  width={28}
                  height={28}
                  rx={8}
                  fill={i === 0 ? COLORS.blueSoft : COLORS.roseSoft}
                />
                <circle
                  cx={34}
                  cy={34}
                  r={5.5}
                  fill={i === 0 ? COLORS.blue : COLORS.rose}
                />
                <rect
                  x={58}
                  y={28}
                  width={76}
                  height={12}
                  rx={6}
                  fill={COLORS.navy}
                  opacity={0.8}
                />
                <rect
                  x={20}
                  y={64}
                  width={176}
                  height={10}
                  rx={5}
                  fill={COLORS.muted}
                />
                <rect
                  x={20}
                  y={84}
                  width={136}
                  height={10}
                  rx={5}
                  fill={COLORS.muted}
                />
                <rect
                  x={20}
                  y={104}
                  width={154}
                  height={10}
                  rx={5}
                  fill={COLORS.muted}
                  opacity={0.75}
                />
              </g>
            ))}
          </g>
        )}

        {/* Row 2 cards (research, copy, sub-pages — CRM white card styling) */}
        {row2Progress > 0.01 && othersFade > 0.01 && (
          <g opacity={row2Progress * othersFade}>
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
                  : COLORS.mint;

              return (
                <g
                  key={cx}
                  transform={`translate(${cx}, ${555 + (1 - row2Progress) * 20})`}
                >
                  <rect
                    x={-3}
                    y={4}
                    width={226}
                    height={116}
                    rx={18}
                    fill={COLORS.cardShadow}
                    opacity={0.7}
                  />
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
                  <rect
                    x={20}
                    y={20}
                    width={26}
                    height={26}
                    rx={8}
                    fill={chipBg}
                  />
                  <circle cx={33} cy={33} r={5} fill={chipDot} />
                  <rect
                    x={56}
                    y={27}
                    width={i === 1 ? 88 : 68}
                    height={11}
                    rx={5.5}
                    fill={COLORS.navy}
                    opacity={0.78}
                  />
                  <rect
                    x={20}
                    y={60}
                    width={168}
                    height={9}
                    rx={4.5}
                    fill={COLORS.muted}
                  />
                  <rect
                    x={20}
                    y={78}
                    width={124}
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
          <g opacity={pullBack < 0.05 ? 1 : othersFade}>
            <rect
              x={rootX}
              y={rootY}
              width={rootW}
              height={rootH}
              rx={rootRx}
              fill={COLORS.blue}
            />
            {pullBack > 0.7 && (
              <rect
                x={rootX + 54}
                y={rootY + 35}
                width={112}
                height={12}
                rx={6}
                fill={COLORS.card}
                opacity={(pullBack - 0.7) / 0.3}
              />
            )}
          </g>
        )}

        {/* Center Expanding Sitemap Card (expands seamlessly to PREVIEW_RECT in final 0.5s) */}
        {row1Progress > 0.01 && (
          <g opacity={row1Progress}>
            <rect
              x={expX - 4}
              y={expY + 4}
              width={expW + 8}
              height={expH + 6}
              rx={expRx + 4}
              fill={COLORS.cardShadow}
              opacity={0.75}
            />
            <rect
              x={expX}
              y={expY}
              width={expW}
              height={expH}
              rx={expRx}
              fill={COLORS.card}
              stroke={expandT > 0.3 ? COLORS.cardBorderBlue : COLORS.cardBorder}
              strokeWidth={1.8}
            />
            <g opacity={1 - expandT}>
              <rect
                x={expX + 20}
                y={expY + 20}
                width={28}
                height={28}
                rx={8}
                fill={COLORS.blueSoft}
              />
              <circle cx={expX + 34} cy={expY + 34} r={5.5} fill={COLORS.blue} />
              <rect
                x={expX + 58}
                y={expY + 28}
                width={94}
                height={12}
                rx={6}
                fill={COLORS.navy}
                opacity={0.85}
              />
              <rect
                x={expX + 20}
                y={expY + 64}
                width={176}
                height={11}
                rx={5.5}
                fill={COLORS.muted}
              />
              <rect
                x={expX + 20}
                y={expY + 86}
                width={136}
                height={11}
                rx={5.5}
                fill={COLORS.muted}
              />
            </g>
          </g>
        )}
      </svg>

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene3.headline}
        subhead={SCENE_COPY.scene3.subhead}
        startFrame={16}
      />
    </AbsoluteFill>
  );
};
