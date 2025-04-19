import React from 'react';
import { Search } from 'lucide-react'; // compatible ShadCN

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="w-4 h-4 text-gray-500" />
      </div>
      <input
        type="text"
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Rechercher un utilisateur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
