import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ScheduleEntry } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface PaymentBreakdownChartProps {
  schedule: ScheduleEntry[];
}

export function PaymentBreakdownChart({ schedule }: PaymentBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={schedule}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
        />
        <YAxis label={{ value: 'Payment ($)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value), 2)}
          labelFormatter={(label) => `Month ${label}`}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="interest"
          stackId="1"
          stroke="#ef4444"
          fill="#fca5a5"
          name="Interest"
        />
        <Area
          type="monotone"
          dataKey="principal"
          stackId="1"
          stroke="#10b981"
          fill="#86efac"
          name="Principal"
        />
        <Area
          type="monotone"
          dataKey="lumpSum"
          stackId="1"
          stroke="#8b5cf6"
          fill="#c4b5fd"
          name="Annual Lump Sum"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
