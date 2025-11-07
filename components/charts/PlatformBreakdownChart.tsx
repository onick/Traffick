"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { platform: 'Meta', spend: 980, leads: 78 },
  { platform: 'Google', spend: 720, leads: 62 },
  { platform: 'TikTok', spend: 640, leads: 47 },
]

export default function PlatformBreakdownChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="platform" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="spend" fill="#3b82f6" name="Spend ($)" />
        <Bar dataKey="leads" fill="#10b981" name="Leads" />
      </BarChart>
    </ResponsiveContainer>
  )
}
