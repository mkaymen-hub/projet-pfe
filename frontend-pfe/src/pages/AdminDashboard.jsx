// import React, { useEffect, useState } from 'react';
// import Register from './Register';
// import axios from '../services/api';
// import { useNavigate } from 'react-router-dom';

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showRegister, setShowRegister] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const navigate = useNavigate();

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('/api/users');
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Erreur API /api/users:", err);
//       if (err.response && err.response.status === 403) {
//         toast.error("Vous n'êtes pas autorisé à accéder à cette ressource.");
//       } else {
//         toast.error("Impossible de charger les utilisateurs.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/api/users/${id}`);
//       setUsers(users.filter(u => u.id !== id));
//       toast.success("Utilisateur supprimé avec succès");
//     } catch (err) {
//       console.error(err);
//       toast.error("Erreur lors de la suppression.");
//     } finally {
//       setDeleteConfirm(null); // Reset confirmation dialog
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/');
//   };

//   const handleRegisterSuccess = () => {
//     fetchUsers();
//     setShowRegister(false);
//     toast.success("Utilisateur créé avec succès !");
//   };

//   const filteredUsers = users.filter(user => {
//     const search = searchTerm.toLowerCase();
//     const fieldsToCheck = ['email', 'matricule', 'direction', 'fonction', 'role'];
  
//     return fieldsToCheck.some(field => (user[field]?.toLowerCase() || '').includes(search));
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Toast notification function
//   const toast = {
//     success: (message) => alert(`✅ ${message}`),
//     error: (message) => alert(`❌ ${message}`)
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header with navigation */}
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
//           <button 
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//           >
//             Déconnexion
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Action buttons */}
//         <div className="flex justify-between mb-6">
//           <button
//             onClick={() => setShowRegister(!showRegister)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
//           >
//             {showRegister ? "Annuler" : "Ajouter un utilisateur"}
//           </button>
          
//           <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />

//             </div>
//         </div>

//         {/* Register form (conditionally shown) */}
//         {showRegister && (
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <Register onSuccess={handleRegisterSuccess} />
//           </div>
//         )}

//         {/* Delete confirmation dialog */}
//         {deleteConfirm && (
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
//               <h3 className="text-lg font-medium text-gray-900 mb-3">Confirmer la suppression</h3>
//               <p className="text-gray-600 mb-4">
//                 Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{deleteConfirm.email}</span> ?
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button 
//                   onClick={() => setDeleteConfirm(null)}
//                   className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//                 >
//                   Annuler
//                 </button>
//                 <button 
//                   onClick={() => handleDelete(deleteConfirm.id)}
//                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Users table */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <h2 className="px-6 py-4 bg-gray-50 text-lg font-medium text-gray-900 border-b border-gray-200">
//             Liste des utilisateurs ({filteredUsers.length})
//           </h2>
          
//           {loading ? (
//             <div className="text-center py-8">
//               <div className="spinner"></div>
//               <p className="mt-2 text-gray-600">Chargement des données...</p>
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               {searchTerm ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fonction</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
//                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredUsers.map(user => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{user.email}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.matricule}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.direction}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.fonction}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
//                           user.role === 'ANALYST_OP' ? 'bg-green-100 text-green-800' : 
//                           'bg-blue-100 text-blue-800'}`}>
//                           {user.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <button 
//                           onClick={() => setDeleteConfirm(user)}
//                           className="text-red-600 hover:text-red-900 transition-colors"
//                         >
//                           Supprimer
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </main>

//       <style jsx>{`
//         .spinner {
//           border: 4px solid rgba(0, 0, 0, 0.1);
//           width: 36px;
//           height: 36px;
//           border-radius: 50%;
//           border-left-color: #3b82f6;
//           animation: spin 1s ease infinite;
//           margin: 0 auto;
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserStats from '../components/ui/UserStats';
import UserTable from '../components/ui/UserTable';
import SearchBar from '../components/ui/SearchBar';
import DeleteModal from '../components/ui/DeleteModal';
import FloatingButton from '../components/ui/FloatingButton';
import Register from '../components/ui/Register';
import FilterBar from '../components/ui/FilterBar'; // 🆕 à ajouter
import axios from '../services/api';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ role: '', direction: '', fonction: '' }); // 🆕
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur API /api/users:", err);
      toast.error("Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success("Utilisateur supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const uniqueValues = (key) => [...new Set(users.map(user => user[key]).filter(Boolean))];

  const filteredUsers = users.filter(user =>
    ['email', 'matricule', 'direction', 'fonction', 'role'].some(field =>
      user[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filters.role === '' || user.role === filters.role) &&
    (filters.direction === '' || user.direction === filters.direction) &&
    (filters.fonction === '' || user.fonction === filters.fonction)
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between mb-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Filtres dynamiques */}
        <div className="mb-6">
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            directions={uniqueValues('direction')}
            fonctions={uniqueValues('fonction')}
            roles={uniqueValues('role')}
          />
        </div>

        {showRegister && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <Register onSuccess={() => {
              fetchUsers();
              setShowRegister(false);
              toast.success("Utilisateur ajouté !");
            }} />
          </div>
        )}
<UserStats users={filteredUsers} />
        <UserTable
          users={filteredUsers}
          loading={loading}
          onDeleteRequest={setDeleteConfirm}
        />

        <FloatingButton onClick={() => setShowRegister(prev => !prev)} showForm={showRegister} />
        <DeleteModal user={deleteConfirm} onCancel={() => setDeleteConfirm(null)} onConfirm={handleDelete} />
      </main>
    </div>
  );
}

export default AdminDashboard;