import {Easing, interpolate} from 'remotion';

export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 600,
} as const;

/**
 * Brand-aligned TechStack Sydney palette combining the CRM's crisp SaaS UI
 * (pure white cards, cool-blue hairline borders, soft ambient elevation, Plus Jakarta Sans)
 * with the curated high-energy accent palette:
 * Rose (#EB4B77) · Amber (#E99557) · Yellow (#FBD354) · Mint (#7CD19F) · Blue (#39A6DE)
 */
export const COLORS = {
  bg: '#FFFFFF',
  stage: '#F8FAFC',
  card: '#FFFFFF',
  cardBorder: '#E2E8F0',
  cardBorderBlue: '#D6E8FA',
  cardShadow: '#EAF1FB',
  muted: '#E5ECF4',
  mutedDark: '#CBD5E1',

  // Deep navy typography & slate secondary text (aligned to CRM screenshot)
  navy: '#111827',
  slate: '#64748B',

  // Primary Brand Blue (first flight, discovery, sitemap root, primary UI)
  blue: '#39A6DE',
  blueDeep: '#2288C2',
  blueSoft: '#EFF7FD',

  // Warm energy highlight (CTA, revision ticks, data accents)
  rose: '#EB4B77',
  roseSoft: '#FDF0F4',

  // Confirmation & Live state (aligned to CRM Mint sign-off pill)
  mint: '#7CD19F',
  mintDeep: '#15803D',
  mintSoft: '#ECFDF5',

  // Supporting warmth (mood-board swatches, mini donut & launch spark)
  amber: '#E99557',
  yellow: '#FBD354',
} as const;

export const SPRING_PRESETS = {
  snappy: {damping: 18, stiffness: 180, mass: 0.75},
  smooth: {damping: 24, stiffness: 115, mass: 0.9},
  bouncy: {damping: 14, stiffness: 200, mass: 0.7},
};

export const PLANE_TARGET_BOX = {
  cx: 1410,
  cy: 520,
  size: 112,
  rx: 26,
} as const;

export const DISCOVERY_BLOCK = {
  x: 1130,
  y: 340,
  width: 560,
  height: 360,
  rx: 28,
} as const;

export const PREVIEW_RECT = {
  x: 1020,
  y: 255,
  width: 630,
  height: 454,
} as const;

export const clampedInterpolate = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing: (t: number) => number = Easing.inOut(Easing.cubic)
): number => {
  return interpolate(frame, inputRange, outputRange, {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};
