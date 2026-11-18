import React from 'react';
import {AbsoluteFill, Easing, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  AmbientBackdrop,
  AnimatedCursor,
  CameraStage,
} from '../components/MotionPrimitives';
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
 * - A frosted mood-board swatch dock slides in above; an animated cursor sweeps across
 *   the swatches as their colours & live charts fill the wireframe section by section.
 * - Overlapping CRM Mobile Companion frame slides out, while the 3D camera pans gently
 *   across the build and Domain Globe & Cloud Hosting badges settle beside it.
 * - Settles cleanly at exact PREVIEW_RECT position across the next cut.
 */
export const Scene4DesignBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const wireframeFade = clampedInterpolate(frame, [0, 12], [0.35, 1], expOut);

  // Mood-board swatch dock slides in smoothly above preview
  const swatchSlide = clampedInterpolate(frame, [8, 28], [0, 1], expOut);
  const swatchX = PREVIEW_RECT.x - (1 - swatchSlide) * 48;

  // Animated cursor sweeps across swatches (f 20..62)
  const cursorSweep = clampedInterpolate(frame, [20, 62], [0, 1], Easing.inOut(Easing.cubic));
  const cursorX = PREVIEW_RECT.x + 42 + cursorSweep * 216;
  const cursorY = 204 + Math.sin(cursorSweep * Math.PI * 3) * 4;
  const cursorOpacity =
    clampedInterpolate(frame, [16, 22], [0, 1]) *
    (1 - clampedInterpolate(frame, [62, 72], [0, 1]));
  const activeSwatchIdx = Math.min(4, Math.floor(cursorSweep * 5));
  const cursorRipple = clampedInterpolate(
    frame % 14,
    [0, 10],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  // Section-by-section colour fill (f 24..72)
  const fillProgress = clampedInterpolate(
    frame,
    [24, 72],
    [0, 1],
    Easing.inOut(Easing.cubic)
  );

  // Overlapping CRM Mobile App companion slides in smoothly (f 50..82)
  const mobileProgress = clampedInterpolate(frame, [50, 82], [0, 1], expOut);

  // Gentle 3D camera pan & tilt across finished page, returning smoothly to 0 for Scene 5 cut
  const panPhase = clampedInterpolate(frame, [68, 110], [0, Math.PI]);
  const panOffset = -Math.sin(panPhase) * 18;
  const stageRotateY = -Math.sin(panPhase) * 4.5;
  const stageRotateX = Math.sin(panPhase) * 2;

  // Domain Globe & Hosting Cloud badges settle beside preview
  const globePop =
    frame < 72
      ? 0
      : spring({
          frame: frame - 72,
          fps,
          config: SPRING_PRESETS.snappy,
        });
  const cloudPop =
    frame < 82
      ? 0
      : spring({
          frame: frame - 82,
          fps,
          config: SPRING_PRESETS.snappy,
        });

  const swatches = [COLORS.navy, COLORS.blue, COLORS.rose, COLORS.amber, COLORS.mint];

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <AmbientBackdrop cx={1360} cy={490} opacity={0.95} />

      <CameraStage
        rotateX={stageRotateX}
        rotateY={stageRotateY}
        origin="1360px 480px"
      >
        <svg
          width={1920}
          height={1080}
          viewBox="0 0 1920 1080"
          shapeRendering="geometricPrecision"
          style={{display: 'block'}}
        >
          <defs>
            <filter id="badgeFloatGlow" x="-25%" y="-25%" width="150%" height="155%">
              <feDropShadow
                dx="0"
                dy="14"
                stdDeviation="14"
                floodColor="#39A6DE"
                floodOpacity="0.14"
              />
            </filter>
          </defs>

          {/* Mood-board swatch dock */}
          {swatchSlide > 0.01 && (
            <g
              transform={`translate(${swatchX}, 168)`}
              opacity={swatchSlide}
              filter="url(#badgeFloatGlow)"
            >
              <rect
                x={0}
                y={0}
                width={308}
                height={62}
                rx={31}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.6}
              />
              {swatches.map((hex, i) => {
                const isActive =
                  frame >= 20 && frame <= 68 && activeSwatchIdx === i;
                return (
                  <g key={hex} transform={`translate(${44 + i * 55}, 31)`}>
                    {isActive && (
                      <circle
                        cx={0}
                        cy={0}
                        r={22}
                        fill="none"
                        stroke={hex}
                        strokeWidth={2}
                        opacity={0.45}
                      />
                    )}
                    <circle
                      cx={0}
                      cy={0}
                      r={isActive ? 18 : 16}
                      fill={hex}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Website Wireframe -> Section-by-section Colour Build + Mobile Companion */}
          <g opacity={wireframeFade}>
            <WebsiteLayout
              x={PREVIEW_RECT.x}
              y={PREVIEW_RECT.y}
              width={PREVIEW_RECT.width}
              height={PREVIEW_RECT.height}
              fillProgress={fillProgress}
              panOffset={panOffset}
              mobileProgress={mobileProgress}
            />
          </g>

          {/* Dotted signal connectors to Domain Globe & Cloud Hosting */}
          {globePop > 0.1 && (
            <path
              d="M 1692 380 L 1734 380 M 1780 432 L 1780 474"
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
              transform={`translate(1780, ${380 + (1 - globePop) * 18}) scale(${0.88 + globePop * 0.12})`}
              opacity={globePop}
              filter="url(#badgeFloatGlow)"
            >
              <rect
                x={-44}
                y={-44}
                width={88}
                height={88}
                rx={22}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.6}
              />
              <circle cx={0} cy={0} r={24} fill={COLORS.blueSoft} />
              <ellipse
                cx={0}
                cy={0}
                rx={11}
                ry={24}
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={2.5}
              />
              <line
                x1={-23}
                y1={0}
                x2={23}
                y2={0}
                stroke={COLORS.navy}
                strokeWidth={2.2}
              />
              <path
                d="M -18 -11 C -6 -7, 6 -7, 18 -11"
                fill="none"
                stroke={COLORS.navy}
                strokeWidth={1.8}
              />
              <path
                d="M -18 11 C -6 7, 6 7, 18 11"
                fill="none"
                stroke={COLORS.navy}
                strokeWidth={1.8}
              />
              {/* Active Mint status dot */}
              <circle
                cx={30}
                cy={-30}
                r={5.5}
                fill={COLORS.mint}
                stroke={COLORS.card}
                strokeWidth={2}
              />
            </g>
          )}

          {/* Hosting Cloud badge */}
          {cloudPop > 0.01 && (
            <g
              transform={`translate(1780, ${516 + (1 - cloudPop) * 18}) scale(${0.88 + cloudPop * 0.12})`}
              opacity={cloudPop}
              filter="url(#badgeFloatGlow)"
            >
              <rect
                x={-44}
                y={-44}
                width={88}
                height={88}
                rx={22}
                fill={COLORS.card}
                stroke={COLORS.cardBorderBlue}
                strokeWidth={1.6}
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
              <circle
                cx={30}
                cy={-30}
                r={5.5}
                fill={COLORS.mint}
                stroke={COLORS.card}
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        <AnimatedCursor
          x={cursorX}
          y={cursorY}
          opacity={cursorOpacity}
          clickRipple={frame >= 22 && frame <= 62 ? cursorRipple : 0}
          rippleColor={swatches[activeSwatchIdx]}
        />
      </CameraStage>

      {/* Anchored Editable Typography Layer */}
      <SceneTextLayer
        headline={SCENE_COPY.scene4.headline}
        subhead={SCENE_COPY.scene4.subhead}
        startFrame={4}
      />
    </AbsoluteFill>
  );
};
