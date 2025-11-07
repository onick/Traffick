"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { stage: 'Impressions', value: 1250000 },
  { stage: 'Clicks', value: 25000 },
  { stage: 'Leads', value: 187 },
  { stage: 'Sales', value: 42 },
]

export default function FunnelChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" fontSize={12} />
        <YAxis dataKey="stage" type="category" width={100} fontSize={12} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
