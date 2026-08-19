import React from 'react';
import { LaserLine } from '../../types/solver';

interface ProofLaserOverlayProps {
  laserLines: LaserLine[];
  size: number;
}

export const ProofLaserOverlay: React.FC<ProofLaserOverlayProps> = ({ laserLines, size }) => {
  if (!laserLines || laserLines.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <defs>
        <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {laserLines.map((line, idx) => {
        const x1 = ((line.from.col + 0.5) / size) * 100;
        const y1 = ((line.from.row + 0.5) / size) * 100;
        const x2 = ((line.to.col + 0.5) / size) * 100;
        const y2 = ((line.to.row + 0.5) / size) * 100;

        const strokeColor = line.type === 'strong' ? '#38bdf8' : line.type === 'wing' ? '#f43f5e' : '#a855f7';

        return (
          <g key={idx}>
            <line
              x1={`${x1}%`}
              y1={`${y1}%`}
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke={strokeColor}
              strokeWidth="3"
              strokeDasharray={line.type === 'weak' ? '4,4' : undefined}
              strokeLinecap="round"
              filter="url(#laserGlow)"
              className="animate-laser"
            />
            <circle cx={`${x1}%`} cy={`${y1}%`} r="4" fill={strokeColor} />
            <circle cx={`${x2}%`} cy={`${y2}%`} r="4" fill={strokeColor} />
          </g>
        );
      })}
    </svg>
  );
};
