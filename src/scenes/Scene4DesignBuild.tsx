import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneTextLayer} from '../components/SceneTextLayer';
import {WebsiteLayout} from '../components/WebsiteLayout';
import {SCENE_COPY} from '../copy';
import {
  COLORS,
  PREVIEW_RECT,
  SPRING_PRESETS,
  clampedInterpolate,
} from '../theme';

/**
 * Scene 4 (12–16s | Frames 360–479, local 0–119): Design and build.
 * - Expanded card becomes a website wireframe at PREVIEW_RECT.
 * - A small strip of mood-board swatches slides in above it.
 * - Swatch colours fill the wireframe section by section.
 * - Gentle pan across the finished page while Globe & Cloud settle beside it.
 * - Website preview stays in the exact PREVIEW_RECT position for Scene 5.
 */
export const Scene4DesignBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wireframeFade = clampedInterpolate(
    frame,
    [0, 12],
    [0.25, 1],
    Easing.out(Easing.cubic)
  );

  // Mood-board swatch strip slides in smoothly above preview
  const swatchSlide = clampedInterpolate(
    frame,
    [10, 32],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const swatchX = PREVIEW_RECT.x - (1 - swatchSlide) * 48;

  // Section-by-section colour fill
  const fillProgress = clampedInterpolate(
    frame,
    [26, 74],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  // Gentle pan across finished page, returning smoothly to 0
  const panPhase = clampedInterpolate(frame, [70, 108], [0, Math.PI]);
  const panOffset = -Math.sin(panPhase) * 20;

  // Domain Globe & Hosting Cloud settle cleanly beside preview
  const globePop =
    frame < 74
      ? 0
      : spring({
          frame: frame - 74,
          fps,
          config: SPRING_PRESETS.snappy,
        });
  const cloudPop =
    frame < 84
      ? 0
      : spring({
          frame: frame - 84,
          fps,
          config: SPRING_PRESETS.snappy,
        });

  const swatches = [COLORS.navy, COLORS.blue, COLORS.rose, COLORS.amber, COLORS.mint];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        shapeRendering="geometricPrecision"
        style={{display: 'block'}}
      >
        {/* Mood-board swatch strip */}
        {swatchSlide > 0.01 && (
          <g transform={`translate(${swatchX}, 172)`} opacity={swatchSlide}>
            <rect
              x={-3}
              y={4}
              width={304}
              height={62}
              rx={31}
              fill={COLORS.cardShadow}
              opacity={0.75}
            />
            <rect
              x={0}
              y={0}
              width={298}
              height={58}
              rx={29}
              fill={COLORS.card}
              stroke={COLORS.cardBorderBlue}
              strokeWidth={1.5}
            />
            {swatches.map((hex, i) => (
              <circle
                key={hex}
                cx={40 + i * 54}
                cy={29}
                r={17}
                fill={hex}
              />
            ))}
          </g>
        )}

        {/* Website Wireframe -> Section-by-section Colour Build */}
        <g opacity={wireframeFade}>
          <WebsiteLayout
            x={PREVIEW_RECT.x}
            y={PREVIEW_RECT.y}
            width={PREVIEW_RECT.width}
            height={PREVIEW_RECT.height}
            fillProgress={fillProgress}
            panOffset={panOffset}
          />
        </g>

        {/* Dotted flow connectors to Globe & Cloud */}
        {globePop > 0.1 && (
          <path
            d="M 1656 410 L 1710 410 M 1756 462 L 1756 502"
            fill="none"
            stroke={COLORS.blue}
            strokeWidth={3}
            strokeDasharray="6 7"
            strokeLinecap="round"
            opacity={globePop}
          />
        )}

        {/* Domain Globe badge */}
        {globePop > 0.01 && (
          <g
            transform={`translate(1756, ${410 + (1 - globePop) * 18}) scale(${0.88 + globePop * 0.12})`}
            opacity={globePop}
          >
            <rect
              x={-47}
              y={-40}
              width={94}
              height={94}
              rx={24}
              fill={COLORS.cardShadow}
              opacity={0.75}
            />
            <rect
              x={-44}
              y={-44}
              width={88}
              height={88}
              rx={22}
              fill={COLORS.card}
              stroke={COLORS.cardBorderBlue}
              strokeWidth={1.5}
            />
            <circle cx={0} cy={0} r={25} fill={COLORS.blueSoft} />
            <ellipse
              cx={0}
              cy={0}
              rx={11}
              ry={25}
              fill="none"
              stroke={COLORS.blue}
              strokeWidth={2.6}
            />
            <line
              x1={-24}
              y1={0}
              x2={24}
              y2={0}
              stroke={COLORS.navy}
              strokeWidth={2.4}
            />
            <path
              d="M -19 -12 C -6 -8, 6 -8, 19 -12"
              fill="none"
              stroke={COLORS.navy}
              strokeWidth={1.8}
            />
            <path
              d="M -19 12 C -6 8, 6 8, 19 12"
              fill="none"
              stroke={COLORS.navy}
              strokeWidth={1.8}
            />
          </g>
        )}

        {/* Hosting Cloud badge */}
        {cloudPop > 0.01 && (
          <g
            transform={`translate(1756, ${546 + (1 - cloudPop) * 18}) scale(${0.88 + cloudPop * 0.12})`}
            opacity={cloudPop}
          >
            <rect
              x={-47}
              y={-40}
              width={94}
              height={94}
              rx={24}
              fill={COLORS.cardShadow}
              opacity={0.75}
            />
            <rect
              x={-44}
              y={-44}
              width={88}
              height={88}
              rx={22}
              fill={COLORS.card}
              stroke={COLORS.cardBorderBlue}
              strokeWidth={1.5}
            />
            <path
              d="M -22 14 C -31 14, -34 0, -22 -5 C -20 -18, -2 -22, 6 -11 C 15 -16, 29 -8, 25 5 C 33 8, 30 19, 18 19 L -18 19 C -25 19, -28 14, -22 14 Z"
              fill={COLORS.blue}
            />
            <path
              d="M -7 9 L -7 -2 M -11 2 L -7 -2 L -3 2"
              fill="none"
              stroke={COLORS.card}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 7 -2 L 7 9 M 3 5 L 7 9 L 11 5"
              fill="none"
              stroke={COLORS.card}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene4.headline}
        subhead={SCENE_COPY.scene4.subhead}
        startFrame={4}
      />
    </AbsoluteFill>
  );
};
