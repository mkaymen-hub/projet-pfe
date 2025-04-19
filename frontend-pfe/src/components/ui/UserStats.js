import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00C49F'];

function UserStats({ users }) {
  const total = users.length;

  const grouped = users.reduce((acc, user) => {
    const role = user.role || 'Inconnu';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(grouped).map((role, index) => ({
    name: role,
    value: grouped[role],
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">📊 Statistiques des utilisateurs</h2>
      <p className="mb-4 text-gray-700">👥 Nombre total : <strong>{total}</strong></p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UserStats;
