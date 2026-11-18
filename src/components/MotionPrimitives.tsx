import React from 'react';
import {COLORS} from '../theme';

/**
 * 3D perspective camera wrapper simulating After Effects-style null-rig
 * dollying, panning, and subtle 3D tilt across scenes.
 */
export const CameraStage: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  origin?: string;
  children: React.ReactNode;
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  origin = '1360px 540px',
  children,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        perspective: '1800px',
        perspectiveOrigin: origin,
      }}
    >
      <div
        className="h-full w-full"
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: origin,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Subtle ambient cool-blue studio glow behind the right-side product stage,
 * keeping outer canvas borders pure #FFFFFF.
 */
export const AmbientBackdrop: React.FC<{
  cx?: number;
  cy?: number;
  opacity?: number;
  tint?: string;
}> = ({cx = 1380, cy = 530, opacity = 1, tint = COLORS.blueSoft}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity,
        background: `radial-gradient(640px 460px at ${cx}px ${cy}px, ${tint} 0%, rgba(255,255,255,0) 72%)`,
      }}
    />
  );
};

/**
 * Tactile SaaS pointer cursor with optional click ripple for Zelios-style UI interaction.
 */
export const AnimatedCursor: React.FC<{
  x: number;
  y: number;
  opacity?: number;
  scale?: number;
  clickRipple?: number;
  rippleColor?: string;
}> = ({
  x,
  y,
  opacity = 1,
  scale = 1,
  clickRipple = 0,
  rippleColor = COLORS.blue,
}) => {
  if (opacity <= 0.01) return null;

  const rippleOpacity =
    clickRipple > 0 && clickRipple < 1 ? (1 - clickRipple) * 0.55 : 0;
  const rippleRadius = 10 + clickRipple * 34;

  return (
    <div
      className="pointer-events-none absolute left-0 top-0"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity,
        zIndex: 40,
      }}
    >
      <svg
        width={96}
        height={96}
        viewBox="-48 -48 96 96"
        overflow="visible"
        style={{marginLeft: -48, marginTop: -48}}
      >
        {rippleOpacity > 0.01 && (
          <circle
            cx={0}
            cy={0}
            r={rippleRadius}
            fill="none"
            stroke={rippleColor}
            strokeWidth={3}
            opacity={rippleOpacity}
          />
        )}
        <g filter="drop-shadow(0px 6px 12px rgba(17, 24, 39, 0.22))">
          <path
            d="M 0 0 L 0 28 L 7.5 21.5 L 13.5 33 L 18.5 30.5 L 12.5 19 L 22 18.5 Z"
            fill={COLORS.navy}
            stroke={COLORS.card}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
