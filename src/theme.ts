import {Easing, interpolate} from 'remotion';

/**
 * 3:4 Portrait composition tailored specifically for tablet & mobile hero sections
 * (1080x1440 @ 30fps, 20 seconds / 600 frames).
 */
export const VIDEO_CONFIG = {
  width: 1080,
  height: 1440,
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

  navy: '#111827',
  slate: '#64748B',

  blue: '#39A6DE',
  blueDeep: '#2288C2',
  blueSoft: '#EFF7FD',

  rose: '#EB4B77',
  roseSoft: '#FDF0F4',

  mint: '#7CD19F',
  mintDeep: '#15803D',
  mintSoft: '#ECFDF5',

  amber: '#E99557',
  yellow: '#FBD354',
} as const;

export const SPRING_PRESETS = {
  snappy: {damping: 18, stiffness: 180, mass: 0.75},
  smooth: {damping: 24, stiffness: 115, mass: 0.9},
  bouncy: {damping: 14, stiffness: 200, mass: 0.7},
};

export const PLANE_TARGET_BOX = {
  cx: 540,
  cy: 870,
  size: 124,
  rx: 28,
} as const;

export const DISCOVERY_BLOCK = {
  x: 180,
  y: 650,
  width: 720,
  height: 420,
  rx: 30,
} as const;

export const PREVIEW_RECT = {
  x: 100,
  y: 645,
  width: 670,
  height: 482,
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
