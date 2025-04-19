import React from 'react';

function DeleteModal({ user, onCancel, onConfirm }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Confirmation</h3>
        <p className="text-gray-700 mb-4">
          Supprimer <strong>{user.email}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
