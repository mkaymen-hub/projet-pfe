import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const DetailedFluxModal = ({ flux, formatDate, getSparklineData, darkMode }) => {
  return (
    <div>
      <div className="mb-4">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut:</p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          flux.status === 'UP' 
            ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800' 
            : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          {flux.status}
        </span>
      </div>
      <div className="mb-4">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dernier chargement:</p>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {flux.dernierChargement ? formatDate(flux.dernierChargement) : 'Aucune donnée'}
        </p>
      </div>
      <div className="mb-4">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tendance:</p>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getSparklineData(flux.nomFlux)}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey="index" 
                tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
              />
              <YAxis tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={flux.status === 'UP' ? (darkMode ? '#34D399' : '#10B981') : (darkMode ? '#F87171' : '#EF4444')} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DetailedFluxModal;
