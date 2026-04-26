'use client';

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
  showArea?: boolean;
}

export default function MiniChart({ data, color = '#00D4FF', height = 50, showArea = true }: MiniChartProps) {
  if (!data || data.length === 0) return null;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 200;
  const h = height;
  const pad = 2;
  
  const points = data.map((val, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((val - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  
  const polyline = points.join(' ');
  const areaPath = `M${points[0]} L${points.join(' L')} L${200 - pad},${h} L${pad},${h} Z`;
  
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? (color === '#00D4FF' ? color : '#00E5A0') : '#FF4444';
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: `${height}px` }} preserveAspectRatio="none">
      {showArea && (
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {showArea && <path d={areaPath} fill={`url(#grad-${color.replace('#','')})`} />}
      <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="3" fill={lineColor} />
    </svg>
  );
}
