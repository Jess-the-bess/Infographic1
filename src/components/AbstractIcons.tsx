import React from 'react';
import {COLORS} from '../theme';

export const CheckBadge: React.FC<{
  x: number;
  y: number;
  popScale: number;
  tickProgress: number;
  size?: number;
  fillColor?: string;
}> = ({
  x,
  y,
  popScale,
  tickProgress,
  size = 1,
  fillColor = COLORS.rose,
}) => {
  if (popScale <= 0.01) return null;
  const tickLen = 44;
  return (
    <g transform={`translate(${x}, ${y}) scale(${popScale * size})`}>
      <circle cx={0} cy={4} r={30} fill={COLORS.cardShadow} />
      <circle
        cx={0}
        cy={0}
        r={28}
        fill={COLORS.card}
        stroke={COLORS.cardBorderBlue}
        strokeWidth={1.5}
      />
      <circle cx={0} cy={0} r={20} fill={fillColor} />
      <path
        d="M -9 1 L -2 8 L 10 -8"
        fill="none"
        stroke={COLORS.card}
        strokeWidth={4.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={tickLen}
        strokeDashoffset={tickLen * (1 - tickProgress)}
      />
    </g>
  );
};

export const LaunchSpark: React.FC<{
  x: number;
  y: number;
  progress: number;
  scale?: number;
}> = ({x, y, progress, scale = 1}) => {
  if (progress <= 0.01) return null;
  const burst = Math.min(1, progress * 1.4);
  const rays = [
    {angle: -90, color: COLORS.rose, len: 19},
    {angle: -35, color: COLORS.amber, len: 16},
    {angle: 20, color: COLORS.mint, len: 17},
    {angle: 145, color: COLORS.blue, len: 16},
    {angle: -145, color: COLORS.yellow, len: 17},
  ];

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M 0 -12 C 2 -4, 4 -2, 12 0 C 4 2, 2 4, 0 12 C -2 4, -4 2, -12 0 C -4 -2, -2 -4, 0 -12 Z"
        fill={COLORS.yellow}
        transform={`scale(${0.6 + burst * 0.4})`}
      />
      {rays.map((ray, i) => {
        const rad = (ray.angle * Math.PI) / 180;
        const r1 = 15 + burst * 5;
        const r2 = r1 + ray.len * burst;
        return (
          <g key={i}>
            <line
              x1={Math.cos(rad) * r1}
              y1={Math.sin(rad) * r1}
              x2={Math.cos(rad) * r2}
              y2={Math.sin(rad) * r2}
              stroke={ray.color}
              strokeWidth={3.8}
              strokeLinecap="round"
            />
            <circle
              cx={Math.cos(rad + 0.2) * (r2 + 7)}
              cy={Math.sin(rad + 0.2) * (r2 + 7)}
              r={2.5 * burst}
              fill={ray.color}
            />
          </g>
        );
      })}
    </g>
  );
};
