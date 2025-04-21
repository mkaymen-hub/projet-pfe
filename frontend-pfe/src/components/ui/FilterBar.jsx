// import React from 'react';

// function FilterBar({ filters, setFilters, directions, fonctions, roles }) {
//   return (
//     <div className="flex flex-wrap gap-4">
//       <select
//         value={filters.role}
//         onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
//         className="border rounded-md p-2"
//       >
//         <option value="">Tous les rôles</option>
//         {roles.map(role => <option key={role} value={role}>{role}</option>)}
//       </select>

//       <select
//         value={filters.direction}
//         onChange={(e) => setFilters(prev => ({ ...prev, direction: e.target.value }))}
//         className="border rounded-md p-2"
//       >
//         <option value="">Toutes les directions</option>
//         {directions.map(dir => <option key={dir} value={dir}>{dir}</option>)}
//       </select>

//       <select
//         value={filters.fonction}
//         onChange={(e) => setFilters(prev => ({ ...prev, fonction: e.target.value }))}
//         className="border rounded-md p-2"
//       >
//         <option value="">Toutes les fonctions</option>
//         {fonctions.map(func => <option key={func} value={func}>{func}</option>)}
//       </select>
//     </div>
//   );
// }

// export default FilterBar;
import React from 'react';

function FilterBar({ filters, setFilters, directions, fonctions, roles }) {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        {/* Filtre par rôle */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les rôles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        {/* Filtre par direction */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
          <select
            name="direction"
            value={filters.direction}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les directions</option>
            {directions.map(direction => (
              <option key={direction} value={direction}>{direction}</option>
            ))}
          </select>
        </div>
        
        {/* Filtre par fonction */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
          <select
            name="fonction"
            value={filters.fonction}
            onChange={handleFilterChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les fonctions</option>
            {fonctions.map(fonction => (
              <option key={fonction} value={fonction}>{fonction}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Bouton pour effacer les filtres */}
      {(filters.role || filters.direction || filters.fonction) && (
        <div className="mt-3">
          <button 
            onClick={() => setFilters({ role: '', direction: '', fonction: '' })}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Effacer les filtres
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterBar;
