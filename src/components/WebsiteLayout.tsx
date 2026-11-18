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
  /** 0..1 reveal of overlapping CRM-inspired mobile companion card */
  mobileProgress?: number;
}

/**
 * High-craft SaaS/web + mobile preview combining the TechStack Sydney CRM visual grammar
 * (pure white elevated cards, cool-blue hairline borders, segmented donut + sparkline,
 * Mint sign-off pill, overlapping mobile card) with crisp section-by-section wireframe fill.
 * Contains zero generated text.
 */
export const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({
  x,
  y,
  width,
  height,
  fillProgress,
  panOffset = 0,
  mobileProgress = 0,
}) => {
  const expOut = Easing.bezier(0.16, 1, 0.3, 1);

  const headerFill = clampedInterpolate(fillProgress, [0.0, 0.24], [0, 1], expOut);
  const heroFill = clampedInterpolate(fillProgress, [0.18, 0.56], [0, 1], expOut);
  const ctaFill = clampedInterpolate(fillProgress, [0.42, 0.72], [0, 1], expOut);
  const cardsFill = clampedInterpolate(fillProgress, [0.58, 1.0], [0, 1], expOut);

  const sx = width / 700;
  const sy = height / 504;

  // Growth sparkline draw
  const sparkLen = 220;

  return (
    <g transform={`translate(${x}, ${y}) scale(${sx}, ${sy})`}>
      <defs>
        <filter id="siteSoftGlow" x="-12%" y="-12%" width="124%" height="128%">
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="18"
            floodColor="#39A6DE"
            floodOpacity="0.14"
          />
        </filter>
        <filter id="mobileCardGlow" x="-20%" y="-15%" width="140%" height="140%">
          <feDropShadow
            dx="-6"
            dy="16"
            stdDeviation="14"
            floodColor="#111827"
            floodOpacity="0.12"
          />
        </filter>
        <linearGradient id="sparkAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.28} />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0.0} />
        </linearGradient>
        <clipPath id="websiteBodyClip">
          <rect x={0} y={58} width={700} height={446} />
        </clipPath>
      </defs>

      {/* Main Browser Frame with ambient SaaS shadow */}
      <g filter="url(#siteSoftGlow)">
        <rect
          x={0}
          y={0}
          width={700}
          height={504}
          rx={22}
          fill={COLORS.card}
          stroke={headerFill > 0.3 ? COLORS.cardBorderBlue : COLORS.cardBorder}
          strokeWidth={2}
        />
      </g>

      {/* Top Navigation Bar */}
      <path
        d="M 0 22 C 0 10, 10 0, 22 0 L 678 0 C 690 0, 700 10, 700 22 L 700 58 L 0 58 Z"
        fill={COLORS.stage}
        opacity={0.55 + headerFill * 0.45}
      />
      <line
        x1={0}
        y1={58}
        x2={700}
        y2={58}
        stroke={COLORS.cardBorder}
        strokeWidth={1.5}
      />

      {/* Square Blue 4-dot App Mark */}
      <rect x={24} y={14} width={30} height={30} rx={9} fill={COLORS.mutedDark} />
      <rect
        x={24}
        y={14}
        width={30}
        height={30}
        rx={9}
        fill={COLORS.blue}
        opacity={headerFill}
      />
      <circle cx={34} cy={24} r={2.3} fill={COLORS.card} />
      <circle cx={44} cy={24} r={2.3} fill={COLORS.card} />
      <circle cx={34} cy={34} r={2.3} fill={COLORS.card} />
      <circle cx={44} cy={34} r={2.3} fill={COLORS.card} />

      {/* Brand Wordmark Bar */}
      <rect x={66} y={23} width={92} height={12} rx={6} fill={COLORS.mutedDark} />
      <rect
        x={66}
        y={23}
        width={92}
        height={12}
        rx={6}
        fill={COLORS.navy}
        opacity={headerFill}
      />

      {/* Top Nav Links + Active Soft-Blue Tab */}
      <rect x={402} y={24} width={44} height={10} rx={5} fill={COLORS.muted} />
      <rect
        x={462}
        y={16}
        width={72}
        height={26}
        rx={9}
        fill={headerFill > 0.35 ? COLORS.blueSoft : COLORS.muted}
      />
      <rect
        x={476}
        y={25}
        width={44}
        height={8}
        rx={4}
        fill={headerFill > 0.35 ? COLORS.blue : COLORS.mutedDark}
      />
      <rect x={550} y={24} width={50} height={10} rx={5} fill={COLORS.muted} />
      <circle
        cx={660}
        cy={29}
        r={11}
        fill={headerFill > 0.35 ? COLORS.roseSoft : COLORS.muted}
      />
      <circle
        cx={660}
        cy={29}
        r={4.5}
        fill={headerFill > 0.35 ? COLORS.rose : COLORS.mutedDark}
      />

      {/* Clipped Inner Page Content */}
      <g clipPath="url(#websiteBodyClip)">
        <g transform={`translate(${panOffset}, 0)`}>
          {/* Hero Eyebrow Pill */}
          <rect
            x={36}
            y={86}
            width={116}
            height={22}
            rx={11}
            fill={heroFill > 0.25 ? COLORS.blueSoft : COLORS.muted}
          />
          <circle
            cx={50}
            cy={97}
            r={4.5}
            fill={heroFill > 0.25 ? COLORS.blue : COLORS.mutedDark}
          />
          <rect
            x={62}
            y={93}
            width={74}
            height={8}
            rx={4}
            fill={heroFill > 0.25 ? COLORS.blue : COLORS.mutedDark}
            opacity={0.75}
          />

          {/* Hero Structural Headline Bars */}
          <rect x={36} y={124} width={258} height={22} rx={11} fill={COLORS.muted} />
          <rect
            x={36}
            y={124}
            width={258}
            height={22}
            rx={11}
            fill={COLORS.navy}
            opacity={heroFill}
          />
          <rect x={36} y={158} width={202} height={20} rx={10} fill={COLORS.muted} />
          <rect
            x={36}
            y={158}
            width={202}
            height={20}
            rx={10}
            fill={COLORS.slate}
            opacity={heroFill * 0.85}
          />
          <rect x={36} y={194} width={228} height={9} rx={4.5} fill={COLORS.muted} />
          <rect x={36} y={211} width={174} height={9} rx={4.5} fill={COLORS.muted} />

          {/* Primary Coral Rose CTA + Secondary Outline Pill */}
          <rect
            x={36}
            y={238}
            width={136}
            height={38}
            rx={19}
            fill={COLORS.mutedDark}
          />
          <rect
            x={36}
            y={238}
            width={136}
            height={38}
            rx={19}
            fill={COLORS.rose}
            opacity={ctaFill}
          />
          <rect
            x={68}
            y={253}
            width={72}
            height={8}
            rx={4}
            fill={COLORS.card}
            opacity={0.92}
          />

          <rect
            x={184}
            y={238}
            width={92}
            height={38}
            rx={19}
            fill={COLORS.card}
            stroke={ctaFill > 0.35 ? COLORS.cardBorderBlue : COLORS.muted}
            strokeWidth={1.5}
          />
          <rect
            x={206}
            y={253}
            width={48}
            height={8}
            rx={4}
            fill={ctaFill > 0.35 ? COLORS.navy : COLORS.mutedDark}
            opacity={0.5}
          />

          {/* Right Hero Card: CRM Segmented Donut + Live Growth Sparkline */}
          <rect
            x={330}
            y={82}
            width={334}
            height={206}
            rx={18}
            fill={COLORS.stage}
          />
          <rect
            x={330}
            y={82}
            width={334}
            height={206}
            rx={18}
            fill={COLORS.card}
            stroke={heroFill > 0.3 ? COLORS.cardBorderBlue : COLORS.cardBorder}
            strokeWidth={1.5}
            opacity={heroFill}
          />

          {/* Top mini status bar inside Hero Card */}
          <rect
            x={350}
            y={100}
            width={88}
            height={10}
            rx={5}
            fill={heroFill > 0.3 ? COLORS.navy : COLORS.mutedDark}
            opacity={0.8}
          />
          <rect
            x={574}
            y={96}
            width={70}
            height={20}
            rx={10}
            fill={heroFill > 0.4 ? COLORS.mintSoft : COLORS.muted}
          />
          <circle
            cx={588}
            cy={106}
            r={3.5}
            fill={heroFill > 0.4 ? COLORS.mintDeep : COLORS.mutedDark}
          />
          <rect
            x={598}
            y={103}
            width={34}
            height={6}
            rx={3}
            fill={heroFill > 0.4 ? COLORS.mintDeep : COLORS.mutedDark}
            opacity={0.75}
          />

          {/* Segmented Donut Ring */}
          <g transform="translate(412, 186)">
            <circle
              cx={0}
              cy={0}
              r={42}
              fill="none"
              stroke={COLORS.muted}
              strokeWidth={13}
            />
            <g opacity={heroFill}>
              <circle
                cx={0}
                cy={0}
                r={42}
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={13}
                strokeDasharray={`${114 * heroFill} 265`}
                strokeDashoffset="0"
                transform="rotate(-90)"
              />
              <circle
                cx={0}
                cy={0}
                r={42}
                fill="none"
                stroke={COLORS.mint}
                strokeWidth={13}
                strokeDasharray={`${58 * heroFill} 265`}
                strokeDashoffset="-119"
                transform="rotate(-90)"
              />
              <circle
                cx={0}
                cy={0}
                r={42}
                fill="none"
                stroke={COLORS.amber}
                strokeWidth={13}
                strokeDasharray={`${44 * heroFill} 265`}
                strokeDashoffset="-182"
                transform="rotate(-90)"
              />
              <circle
                cx={0}
                cy={0}
                r={42}
                fill="none"
                stroke={COLORS.rose}
                strokeWidth={13}
                strokeDasharray={`${31 * heroFill} 265`}
                strokeDashoffset="-231"
                transform="rotate(-90)"
              />
            </g>
            <rect
              x={-15}
              y={-6}
              width={30}
              height={12}
              rx={6}
              fill={heroFill > 0.4 ? COLORS.navy : COLORS.mutedDark}
            />
          </g>

          {/* Animated Growth Sparkline Chart beside Donut */}
          <g transform="translate(486, 134)">
            <rect x={0} y={0} width={156} height={96} rx={12} fill={COLORS.stage} />
            <g opacity={heroFill}>
              <path
                d="M 12 78 L 42 62 L 72 68 L 106 38 L 142 22 L 142 88 L 12 88 Z"
                fill="url(#sparkAreaGrad)"
              />
              <path
                d="M 12 78 L 42 62 L 72 68 L 106 38 L 142 22"
                fill="none"
                stroke={COLORS.blue}
                strokeWidth={3.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={sparkLen}
                strokeDashoffset={sparkLen * (1 - heroFill)}
              />
              <circle cx={142} cy={22} r={5} fill={COLORS.rose} opacity={heroFill} />
            </g>
            {/* Legend dots below sparkline */}
            <circle
              cx={16}
              cy={112}
              r={4}
              fill={heroFill > 0.3 ? COLORS.blue : COLORS.mutedDark}
            />
            <rect x={26} y={109} width={34} height={6} rx={3} fill={COLORS.muted} />
            <circle
              cx={74}
              cy={112}
              r={4}
              fill={heroFill > 0.3 ? COLORS.mint : COLORS.mutedDark}
            />
            <rect x={84} y={109} width={34} height={6} rx={3} fill={COLORS.muted} />
          </g>

          {/* Bottom 3 CRM-Style White Feature Cards */}
          {[0, 1, 2].map((idx) => {
            const cx = 36 + idx * 214;
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
                : COLORS.mintDeep;

            return (
              <g key={idx}>
                <rect
                  x={cx}
                  y={316}
                  width={198}
                  height={150}
                  rx={16}
                  fill={COLORS.stage}
                />
                <rect
                  x={cx}
                  y={316}
                  width={198}
                  height={150}
                  rx={16}
                  fill={COLORS.card}
                  stroke={cardsFill > 0.3 ? COLORS.cardBorder : COLORS.muted}
                  strokeWidth={1.5}
                  opacity={cardsFill}
                />
                {/* Soft tinted icon well */}
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
                {/* Card lines */}
                <rect
                  x={cx + 20}
                  y={390}
                  width={134}
                  height={11}
                  rx={5.5}
                  fill={COLORS.mutedDark}
                  opacity={0.45}
                />
                <rect
                  x={cx + 20}
                  y={390}
                  width={134}
                  height={11}
                  rx={5.5}
                  fill={COLORS.navy}
                  opacity={cardsFill * 0.85}
                />
                <rect
                  x={cx + 20}
                  y={414}
                  width={106}
                  height={8}
                  rx={4}
                  fill={COLORS.muted}
                />
                <rect
                  x={cx + 20}
                  y={432}
                  width={76}
                  height={8}
                  rx={4}
                  fill={COLORS.muted}
                />
              </g>
            );
          })}
        </g>
      </g>

      {/* Overlapping Mobile App Companion Card (mirroring CRM mobile frame!) */}
      {mobileProgress > 0.01 && (
        <g
          transform={`translate(${548 + (1 - mobileProgress) * 44}, ${228 + (1 - mobileProgress) * 32}) scale(${0.92 + mobileProgress * 0.08})`}
          opacity={mobileProgress}
          filter="url(#mobileCardGlow)"
        >
          <rect
            x={0}
            y={0}
            width={176}
            height={294}
            rx={26}
            fill={COLORS.card}
            stroke={COLORS.cardBorderBlue}
            strokeWidth={2}
          />
          {/* Dynamic notch / status pill */}
          <rect x={64} y={14} width={48} height={8} rx={4} fill={COLORS.navy} />

          {/* Header dot + bar */}
          <rect x={20} y={38} width={22} height={22} rx={7} fill={COLORS.blueSoft} />
          <circle cx={31} cy={49} r={4.5} fill={COLORS.blue} />
          <rect x={50} y={44} width={78} height={10} rx={5} fill={COLORS.navy} />

          {/* Mobile mini input fields */}
          <rect
            x={20}
            y={76}
            width={136}
            height={34}
            rx={10}
            fill={COLORS.stage}
            stroke={COLORS.cardBorder}
            strokeWidth={1.2}
          />
          <circle cx={36} cy={93} r={5} fill={COLORS.mint} />
          <rect x={48} y={89} width={72} height={8} rx={4} fill={COLORS.mutedDark} opacity={0.55} />

          <rect
            x={20}
            y={120}
            width={136}
            height={34}
            rx={10}
            fill={COLORS.card}
            stroke={COLORS.blue}
            strokeWidth={1.4}
          />
          <rect x={32} y={133} width={92} height={8} rx={4} fill={COLORS.blue} opacity={0.75} />

          <rect
            x={20}
            y={164}
            width={136}
            height={52}
            rx={12}
            fill={COLORS.stage}
            stroke={COLORS.cardBorder}
            strokeWidth={1.2}
          />
          <rect x={32} y={178} width={104} height={8} rx={4} fill={COLORS.muted} />
          <rect x={32} y={194} width={76} height={8} rx={4} fill={COLORS.muted} />

          {/* Mobile CTA Pill */}
          <rect x={20} y={234} width={136} height={38} rx={12} fill={COLORS.blue} />
          <rect
            x={58}
            y={249}
            width={60}
            height={8}
            rx={4}
            fill={COLORS.card}
            opacity={0.92}
          />
        </g>
      )}
    </g>
  );
};
