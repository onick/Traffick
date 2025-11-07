"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { date: '2025-10-28', spend: 420, leads: 35 },
  { date: '2025-10-29', spend: 380, leads: 32 },
  { date: '2025-10-30', spend: 450, leads: 38 },
  { date: '2025-10-31', spend: 390, leads: 31 },
  { date: '2025-11-01', spend: 410, leads: 36 },
  { date: '2025-11-02', spend: 480, leads: 42 },
  { date: '2025-11-03', spend: 520, leads: 45 },
]

export default function SpendVsLeadsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="date" 
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        />
        <YAxis yAxisId="left" fontSize={12} />
        <YAxis yAxisId="right" orientation="right" fontSize={12} />
        <Tooltip />
        <Legend />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="spend" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Spend ($)"
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="leads" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Leads"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
