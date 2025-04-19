import React from 'react';

function FilterBar({ filters, setFilters, directions, fonctions, roles }) {
  return (
    <div className="flex flex-wrap gap-4">
      <select
        value={filters.role}
        onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
        className="border rounded-md p-2"
      >
        <option value="">Tous les rôles</option>
        {roles.map(role => <option key={role} value={role}>{role}</option>)}
      </select>

      <select
        value={filters.direction}
        onChange={(e) => setFilters(prev => ({ ...prev, direction: e.target.value }))}
        className="border rounded-md p-2"
      >
        <option value="">Toutes les directions</option>
        {directions.map(dir => <option key={dir} value={dir}>{dir}</option>)}
      </select>

      <select
        value={filters.fonction}
        onChange={(e) => setFilters(prev => ({ ...prev, fonction: e.target.value }))}
        className="border rounded-md p-2"
      >
        <option value="">Toutes les fonctions</option>
        {fonctions.map(func => <option key={func} value={func}>{func}</option>)}
      </select>
    </div>
  );
}

export default FilterBar;
