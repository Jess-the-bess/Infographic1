import React from 'react';
import {Easing} from 'remotion';
import {COLORS, clampedInterpolate} from '../theme';

export interface WebsiteLayoutProps {
  x: number;
  y: number;
  width: number;
  height: number;
  /** 0 = clean wireframe, 1 = section-by-section mood-board colour fill */
  fillProgress: number;
  /** Optional subtle horizontal pan offset inside finished page preview */
  panOffset?: number;
}

/**
 * Brand-aligned SaaS/web preview mirroring the TechStack Sydney CRM screenshot:
 * crisp pure white frame, cool-blue 1.5px border (#D6E8FA), soft ambient glow,
 * clean white metric/feature cards, and cohesive Blue/Rose/Amber/Mint accents.
 * Contains zero generated text.
 */
export const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({
  x,
  y,
  width,
  height,
  fillProgress,
  panOffset = 0,
}) => {
  const headerFill = clampedInterpolate(
    fillProgress,
    [0.0, 0.25],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const heroFill = clampedInterpolate(
    fillProgress,
    [0.2, 0.55],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const ctaFill = clampedInterpolate(
    fillProgress,
    [0.45, 0.72],
    [0, 1],
    Easing.out(Easing.cubic)
  );
  const cardsFill = clampedInterpolate(
    fillProgress,
    [0.62, 1.0],
    [0, 1],
    Easing.out(Easing.cubic)
  );

  const sx = width / 700;
  const sy = height / 504;

  return (
    <g transform={`translate(${x}, ${y}) scale(${sx}, ${sy})`}>
      {/* Soft ambient cool-blue card elevation (matching CRM outer halo) */}
      <rect
        x={-4}
        y={4}
        width={708}
        height={512}
        rx={24}
        fill={COLORS.cardShadow}
        opacity={0.75}
      />

      {/* Crisp white browser frame with subtle cool-blue border */}
      <rect
        x={0}
        y={0}
        width={700}
        height={504}
        rx={20}
        fill={COLORS.card}
        stroke={headerFill > 0.3 ? COLORS.cardBorderBlue : COLORS.cardBorder}
        strokeWidth={2}
      />

      {/* Section 1: Clean Light Top Bar (mirroring CRM header bar!) */}
      <path
        d="M 0 20 C 0 9, 9 0, 20 0 L 680 0 C 691 0, 700 9, 700 20 L 700 58 L 0 58 Z"
        fill={COLORS.stage}
        opacity={0.5 + headerFill * 0.5}
      />
      <line
        x1={0}
        y1={58}
        x2={700}
        y2={58}
        stroke={COLORS.cardBorder}
        strokeWidth={1.5}
      />

      {/* Top-left square Blue app icon (mirroring CRM TSS icon) */}
      <rect
        x={26}
        y={15}
        width={28}
        height={28}
        rx={8}
        fill={COLORS.mutedDark}
      />
      <rect
        x={26}
        y={15}
        width={28}
        height={28}
        rx={8}
        fill={COLORS.blue}
        opacity={headerFill}
      />
      <circle cx={35} cy={24} r={2.2} fill={COLORS.card} />
      <circle cx={45} cy={24} r={2.2} fill={COLORS.card} />
      <circle cx={35} cy={34} r={2.2} fill={COLORS.card} />
      <circle cx={45} cy={34} r={2.2} fill={COLORS.card} />

      {/* Brand title bar */}
      <rect
        x={66}
        y={23}
        width={88}
        height={12}
        rx={6}
        fill={COLORS.mutedDark}
      />
      <rect
        x={66}
        y={23}
        width={88}
        height={12}
        rx={6}
        fill={COLORS.navy}
        opacity={headerFill}
      />

      {/* Right-aligned nav pills (active pill tinted in soft blue like CRM Contacts tab) */}
      <rect x={412} y={24} width={42} height={10} rx={5} fill={COLORS.muted} />
      <rect
        x={470}
        y={17}
        width={68}
        height={24}
        rx={8}
        fill={headerFill > 0.35 ? COLORS.blueSoft : COLORS.muted}
      />
      <rect
        x={484}
        y={25}
        width={40}
        height={8}
        rx={4}
        fill={headerFill > 0.35 ? COLORS.blue : COLORS.mutedDark}
      />
      <rect x={554} y={24} width={48} height={10} rx={5} fill={COLORS.muted} />
      <rect x={618} y={24} width={52} height={10} rx={5} fill={COLORS.muted} />

      {/* Clipped inner page body */}
      <defs>
        <clipPath id="websiteBodyClip">
          <rect x={0} y={58} width={700} height={446} rx={0} />
        </clipPath>
      </defs>

      <g clipPath="url(#websiteBodyClip)">
        <g transform={`translate(${panOffset}, 0)`}>
          {/* Section 2: Left Hero Typography Bars + CTA */}
          <rect
            x={38}
            y={104}
            width={254}
            height={22}
            rx={11}
            fill={COLORS.muted}
          />
          <rect
            x={38}
            y={104}
            width={254}
            height={22}
            rx={11}
            fill={COLORS.navy}
            opacity={heroFill}
          />
          <rect
            x={38}
            y={138}
            width={198}
            height={20}
            rx={10}
            fill={COLORS.muted}
          />
          <rect
            x={38}
            y={138}
            width={198}
            height={20}
            rx={10}
            fill={COLORS.slate}
            opacity={heroFill * 0.85}
          />
          <rect x={38} y={178} width={236} height={10} rx={5} fill={COLORS.muted} />
          <rect x={38} y={198} width={182} height={10} rx={5} fill={COLORS.muted} />

          {/* Primary CTA Pill (Coral Rose energy button) */}
          <rect
            x={38}
            y={232}
            width={142}
            height={38}
            rx={19}
            fill={COLORS.mutedDark}
          />
          <rect
            x={38}
            y={232}
            width={142}
            height={38}
            rx={19}
            fill={COLORS.rose}
            opacity={ctaFill}
          />
          <rect
            x={72}
            y={247}
            width={74}
            height={8}
            rx={4}
            fill={COLORS.card}
            opacity={0.9}
          />

          {/* Right Hero Card (CRM-style clean white card with crisp donut & sparkline graphic!) */}
          <rect
            x={338}
            y={90}
            width={324}
            height={196}
            rx={16}
            fill={COLORS.stage}
          />
          <rect
            x={338}
            y={90}
            width={324}
            height={196}
            rx={16}
            fill={COLORS.card}
            stroke={heroFill > 0.3 ? COLORS.cardBorderBlue : COLORS.cardBorder}
            strokeWidth={1.5}
            opacity={heroFill}
          />

          {/* Segmented Donut Ring inside Hero Card (mirroring CRM Revenue by channel!) */}
          <g transform="translate(426, 188)">
            {/* Base wireframe ring */}
            <circle
              cx={0}
              cy={0}
              r={46}
              fill="none"
              stroke={COLORS.muted}
              strokeWidth={14}
            />
            {/* Brand segments fading in */}
            <g opacity={heroFill}>
              {/* Blue arc */}
              <circle
                cx={0}
                cy={0}
                r={46}
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={14}
                strokeDasharray="125 290"
                strokeDashoffset="0"
                transform="rotate(-90)"
              />
              {/* Mint arc */}
              <circle
                cx={0}
                cy={0}
                r={46}
                fill="none"
                stroke={COLORS.mint}
                strokeWidth={14}
                strokeDasharray="65 290"
                strokeDashoffset="-130"
                transform="rotate(-90)"
              />
              {/* Amber arc */}
              <circle
                cx={0}
                cy={0}
                r={46}
                fill="none"
                stroke={COLORS.amber}
                strokeWidth={14}
                strokeDasharray="48 290"
                strokeDashoffset="-200"
                transform="rotate(-90)"
              />
              {/* Rose arc */}
              <circle
                cx={0}
                cy={0}
                r={46}
                fill="none"
                stroke={COLORS.rose}
                strokeWidth={14}
                strokeDasharray="34 290"
                strokeDashoffset="-253"
                transform="rotate(-90)"
              />
            </g>
            <rect
              x={-16}
              y={-6}
              width={32}
              height={12}
              rx={6}
              fill={heroFill > 0.4 ? COLORS.navy : COLORS.mutedDark}
            />
          </g>

          {/* Clean legend dots beside donut */}
          {[
            {y: 152, color: COLORS.blue, w: 72},
            {y: 176, color: COLORS.mint, w: 62},
            {y: 200, color: COLORS.amber, w: 68},
            {y: 224, color: COLORS.rose, w: 54},
          ].map((row, idx) => (
            <g key={idx}>
              <circle
                cx={512}
                cy={row.y}
                r={5}
                fill={heroFill > 0.3 ? row.color : COLORS.mutedDark}
              />
              <rect
                x={526}
                y={row.y - 4}
                width={row.w}
                height={8}
                rx={4}
                fill={COLORS.muted}
              />
            </g>
          ))}

          {/* Section 3: Bottom 3 White Feature Cards (mirroring CRM AI Meeting Notes / Mobile Sync cards!) */}
          {[0, 1, 2].map((idx) => {
            const cx = 38 + idx * 214;
            const iconBg =
              idx === 0
                ? COLORS.blueSoft
                : idx === 1
                ? COLORS.roseSoft
                : COLORS.mintSoft;
            const iconDot =
              idx === 0
                ? COLORS.blue
                : idx === 1
                ? COLORS.rose
                : COLORS.mint;

            return (
              <g key={idx}>
                <rect
                  x={cx}
                  y={316}
                  width={196}
                  height={146}
                  rx={16}
                  fill={COLORS.stage}
                />
                <rect
                  x={cx}
                  y={316}
                  width={196}
                  height={146}
                  rx={16}
                  fill={COLORS.card}
                  stroke={cardsFill > 0.3 ? COLORS.cardBorder : COLORS.muted}
                  strokeWidth={1.5}
                  opacity={cardsFill}
                />
                {/* Soft icon chip */}
                <rect
                  x={cx + 20}
                  y={336}
                  width={36}
                  height={36}
                  rx={10}
                  fill={COLORS.muted}
                />
                <rect
                  x={cx + 20}
                  y={336}
                  width={36}
                  height={36}
                  rx={10}
                  fill={iconBg}
                  opacity={cardsFill}
                />
                <circle
                  cx={cx + 38}
                  cy={354}
                  r={7}
                  fill={cardsFill > 0.3 ? iconDot : COLORS.mutedDark}
                />
                {/* Clean card bars */}
                <rect
                  x={cx + 20}
                  y={390}
                  width={136}
                  height={11}
                  rx={5.5}
                  fill={COLORS.mutedDark}
                  opacity={0.45}
                />
                <rect
                  x={cx + 20}
                  y={390}
                  width={136}
                  height={11}
                  rx={5.5}
                  fill={COLORS.navy}
                  opacity={cardsFill * 0.85}
                />
                <rect
                  x={cx + 20}
                  y={414}
                  width={102}
                  height={9}
                  rx={4.5}
                  fill={COLORS.muted}
                />
                <rect
                  x={cx + 20}
                  y={432}
                  width={76}
                  height={9}
                  rx={4.5}
                  fill={COLORS.muted}
                />
              </g>
            );
          })}
        </g>
      </g>
    </g>
  );
};
