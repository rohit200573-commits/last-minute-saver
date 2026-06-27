'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  { subject: 'Urgency', A: 120, B: 110, fullMark: 150 },
  { subject: 'Importance', A: 98, B: 130, fullMark: 150 },
  { subject: 'Impact', A: 86, B: 130, fullMark: 150 },
  { subject: 'Effort', A: 99, B: 100, fullMark: 150 },
  { subject: 'Risk', A: 85, B: 90, fullMark: 150 },
  { subject: 'Focus Req.', A: 65, B: 85, fullMark: 150 },
];

export default function RiskRadar() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
          <Radar name="Safe Tasks" dataKey="B" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.3} />
          <Radar name="Risky Tasks" dataKey="A" stroke="#FF5252" fill="#FF5252" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
