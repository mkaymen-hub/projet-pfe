import React from 'react';

function UserTable({ users, loading, onDeleteRequest }) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-2 text-gray-600">Chargement des utilisateurs...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun utilisateur trouvé.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Email', 'Matricule', 'Direction', 'Fonction', 'Rôle', 'Actions'].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.matricule}</td>
              <td className="px-6 py-4">{user.direction}</td>
              <td className="px-6 py-4">{user.fonction}</td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs font-semibold rounded-full
                  ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'ANALYST_OP' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onDeleteRequest(user)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
