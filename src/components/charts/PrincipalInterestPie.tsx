import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/calculations';

interface PrincipalInterestPieProps {
  principal: number;
  totalInterest: number;
}

const COLORS = ['#10b981', '#ef4444']; // green for principal, red for interest

export function PrincipalInterestPie({ principal, totalInterest }: PrincipalInterestPieProps) {
  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest },
  ];

  const total = principal + totalInterest;
  const interestPercent = ((totalInterest / total) * 100).toFixed(1);

  return (
    <div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          textAlign: 'center',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--spacing-sm)',
        }}
      >
        {interestPercent}% of your total payments will go to interest
      </div>
    </div>
  );
}
