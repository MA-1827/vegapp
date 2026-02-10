
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { NutritionData } from '../types';

interface Props {
  data: NutritionData;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const NutritionCharts: React.FC<Props> = ({ data }) => {
  const macroData = [
    { name: 'Carbs', value: data.macros.carbohydrates },
    { name: 'Protein', value: data.macros.protein },
    { name: 'Fat', value: data.macros.fat },
    { name: 'Fiber', value: data.macros.fiber },
    { name: 'Sugar', value: data.macros.sugar },
  ].filter(item => item.value > 0);

  const vitaminData = data.vitamins.map(v => ({
    name: v.name,
    DV: v.percentageDV
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Macronutrients (g)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={macroData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label
            >
              {macroData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Vitamins (% Daily Value)</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={vitaminData} layout="vertical" margin={{ left: 40, right: 30 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="DV" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NutritionCharts;
