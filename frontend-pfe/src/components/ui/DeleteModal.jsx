import React from 'react';

function DeleteModal({ user, onCancel, onConfirm }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Confirmation de suppression</h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.email}</strong> ?
          Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
