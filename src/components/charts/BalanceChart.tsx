import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScheduleEntry } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface BalanceChartProps {
  schedule: ScheduleEntry[];
}

export function BalanceChart({ schedule }: BalanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={schedule}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
        />
        <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          fill="#93c5fd"
          name="Remaining Balance"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
