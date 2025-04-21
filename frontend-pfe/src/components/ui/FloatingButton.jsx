import React from 'react';

function FloatingButton({ onClick, showForm }) {
  // Si vous préférez masquer ce bouton quand on utilise le bouton alternatif
  // Vous pouvez simplement retourner null ici
  
  return (
    <button
      onClick={onClick}
      className={`fixed right-6 bottom-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        showForm 
          ? 'bg-gray-600 transform rotate-45' 
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
}

export default FloatingButton;
