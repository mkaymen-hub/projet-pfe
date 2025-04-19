import React from 'react';
import { Plus, X } from 'lucide-react'; // ShadCN compatible

function FloatingButton({ onClick, showForm }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      aria-label="Ajouter un utilisateur"
    >
      {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
    </button>
  );
}

export default FloatingButton;
