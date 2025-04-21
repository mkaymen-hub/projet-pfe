
// AdminDashboard.jsx modernisé (sans changer la structure)
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import UserStats from '../components/ui/UserStats';
// import UserTable from '../components/ui/UserTable';
// import SearchBar from '../components/ui/SearchBar';
// import DeleteModal from '../components/ui/DeleteModal';
// import Register from '../components/ui/Register';
// import FilterBar from '../components/ui/FilterBar';
// import axios from '../services/api';
// import { toast } from 'react-toastify';
// import { motion } from 'framer-motion';
// import { FiLogOut, FiUserPlus, FiUsers, FiSettings } from 'react-icons/fi';
// import logo from '../assets/images/Tunisie-Telecom.jpg';

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showRegister, setShowRegister] = useState(false);  // Contrôle si le formulaire est affiché
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [filters, setFilters] = useState({ role: '', direction: '', fonction: '' });
//   const [activeSection, setActiveSection] = useState('utilisateurs'); // État pour suivre l'élément sélectionné
//   const navigate = useNavigate();

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('/api/users');
//       setUsers(res.data);
//     } catch (err) {
//       toast.error("Erreur de chargement des utilisateurs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleDelete = async () => {
//     if (deleteConfirm) {
//       try {
//         await axios.delete(`/api/users/${deleteConfirm.id}`);
//         toast.success("Utilisateur supprimé !");
//         setDeleteConfirm(null);
//         fetchUsers();
//       } catch (err) {
//         toast.error("Erreur lors de la suppression de l'utilisateur");
//       }
//     }
//   };

//   const uniqueValues = (key) => [...new Set(users.map(user => user[key]).filter(Boolean))];

//   const filteredUsers = users.filter(user =>
//     ['email', 'matricule', 'direction', 'fonction', 'role'].some(field =>
//       user[field]?.toLowerCase().includes(searchTerm.toLowerCase())
//     ) &&
//     (filters.role === '' || user.role === filters.role) &&
//     (filters.direction === '' || user.direction === filters.direction) &&
//     (filters.fonction === '' || user.fonction === filters.fonction)
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r shadow-sm flex flex-col">
//         <div className="flex items-center gap-2 p-4 border-b">
//           <img src={logo} alt="Tunisie Telecom" className="w-10 h-10 object-contain" />
//           <h2 className="text-lg font-semibold text-blue-700">Tunisie Telecom</h2>
//         </div>
//         <nav className="flex flex-col gap-2 p-4 text-gray-700">
//           {/* Utilisateurs */}
//           <button
//             onClick={() => setActiveSection('utilisateurs')}
//             className={`flex items-center gap-3 p-2 rounded ${activeSection === 'utilisateurs' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
//           >
//             <FiUsers className="text-lg" /> Utilisateurs
//           </button>

//           {/* Sous-menu Utilisateurs */}
//           {activeSection === 'utilisateurs' && (
//             <div className="ml-6 space-y-2">
//               <button onClick={() => setShowRegister(true)} className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded">
//                 <FiUserPlus className="text-lg" /> Ajouter Utilisateur
//               </button>
//             </div>
//           )}

//           {/* Paramètres */}
//           <button
//             onClick={() => setActiveSection('parametres')}
//             className={`flex items-center gap-3 p-2 rounded ${activeSection === 'parametres' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
//           >
//             <FiSettings className="text-lg" /> Paramètres
//           </button>

//           {/* Déconnexion */}
//           <button
//             onClick={() => { localStorage.clear(); navigate('/'); }}
//             className="flex items-center gap-3 mt-auto p-2 text-red-600 hover:bg-red-50 rounded"
//           >
//             <FiLogOut className="text-lg" /> Déconnexion
//           </button>
//         </nav>
//       </aside>

//       {/* Main */}
//       <motion.main className="flex-1 p-6 space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
//         <div className="flex justify-between items-center">
//           <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//         </div>

//         <div className="bg-white p-4 rounded-md shadow-sm">
//           <FilterBar
//             filters={filters}
//             setFilters={setFilters}
//             directions={uniqueValues('direction')}
//             fonctions={uniqueValues('fonction')}
//             roles={uniqueValues('role')}
//           />
//         </div>

//         {showRegister && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mt-6" // On conserve la marge top si elle était voulue
//           >
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un utilisateur</h2>
//             <Register
//               onSuccess={() => {
//                 fetchUsers();
//                 setShowRegister(false);  // Fermer le formulaire après l'ajout
//                 toast.success("Utilisateur ajouté !");
//               }}
//               onClose={() => setShowRegister(false)} // Passe la fonction pour fermer le formulaire
//             />
//           </motion.div>
//         )}

//         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
//           <UserStats users={filteredUsers} />
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-md shadow-sm overflow-hidden"
//         >
//           <UserTable
//             users={filteredUsers}
//             loading={loading}
//             onDeleteRequest={setDeleteConfirm}
//           />
//         </motion.div>

//         <DeleteModal user={deleteConfirm} onCancel={() => setDeleteConfirm(null)} onConfirm={handleDelete} />
//       </motion.main>
//     </div>
//   );
// }

// export default AdminDashboard;

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FiLogOut, FiUserPlus, FiUsers, FiSettings, 
  FiRefreshCw, FiDownload, FiFilter, FiSearch,
  FiPieChart, FiBarChart2, FiActivity, FiGrid,
  FiSun, FiMoon
} from 'react-icons/fi';
// Notez que nous n'importons plus le logo avec fond blanc
import logo from '../assets/images/Tunisie-Telecom1.png';

// Composants importés
import UserStats from '../components/ui/UserStats';
import UserTable from '../components/ui/UserTable';
import SearchBar from '../components/ui/SearchBar';
import DeleteModal from '../components/ui/DeleteModal';
import Register from '../components/ui/Register';
import FilterBar from '../components/ui/FilterBar';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ role: '', direction: '', fonction: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Vérifier le thème préféré de l'utilisateur
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
      setLastRefreshTime(new Date());
      toast.success("Données utilisateurs mises à jour");
    } catch (err) {
      toast.error("Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (deleteConfirm) {
      try {
        await axios.delete(`/api/users/${deleteConfirm.id}`);
        toast.success("Utilisateur supprimé !");
        setDeleteConfirm(null);
        fetchUsers();
      } catch (err) {
        toast.error("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const uniqueValues = (key) => [...new Set(users.map(user => user[key]).filter(Boolean))];

  const filteredUsers = users.filter(user =>
    ['email', 'matricule', 'direction', 'fonction', 'role'].some(field =>
      user[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filters.role === '' || user.role === filters.role) &&
    (filters.direction === '' || user.direction === filters.direction) &&
    (filters.fonction === '' || user.fonction === filters.fonction)
  );

  const exportToCSV = () => {
    if (!filteredUsers.length) return;
    
    // Créer l'en-tête CSV
    const headers = ['id', 'email', 'matricule', 'direction', 'fonction', 'role'];
    
    // Créer les lignes de données
    const rows = filteredUsers.map(user => {
      return headers.map(header => {
        return user[header] !== undefined ? user[header] : '';
      }).join(',');
    });
    
    // Assembler le contenu CSV
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Formater la date pour l'affichage
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Statistiques pour le tableau de bord
  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(user => user.role === 'ADMIN').length,
    analystOpUsers: users.filter(user => user.role === 'ANALYST_OP').length,
    analystBizUsers: users.filter(user => user.role === 'ANALYST_BIZ').length,
  };

  // Données pour les graphiques (simulées)
  const roleDistribution = [
    { name: 'Admin', value: stats.adminUsers },
    { name: 'Analyste Op', value: stats.analystOpUsers },
    { name: 'Analyste Biz', value: stats.analystBizUsers },
  ];

  // Obtenir la couleur pour un index donné (même fonction que dans OpDashboard)
  const getColorForIndex = (index) => {
    const colors = darkMode 
      ? ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#60A5FA', '#A78BFA', '#F472B6', '#2DD4BF', '#FB923C', '#818CF8']
      : ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];
    return colors[index % colors.length];
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Utilisation du logo transparent avec une balise img directe */}
            <img 
              src={logo}
              alt="Tunisie Telecom" 
              className="h-10" 
            />
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-indigo-800'}`}>Administration</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {lastRefreshTime && `Dernière mise à jour: ${formatDate(lastRefreshTime)}`}
            </span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-indigo-50 text-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              aria-label="Changer de thème"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchUsers}
              disabled={loading}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              aria-label="Rafraîchir les données"
            >
              <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { localStorage.clear(); navigate('/'); }}
              className={`p-2 rounded-full ${darkMode ? 'bg-red-900 text-red-100 hover:bg-red-800' : 'bg-red-50 text-red-600 hover:bg-red-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
              aria-label="Déconnexion"
            >
              <FiLogOut className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'dashboard'
                  ? darkMode 
                    ? 'border-indigo-400 text-indigo-400' 
                    : 'border-indigo-600 text-indigo-600'
                  : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FiGrid className="mr-2" />
                Tableau de bord
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? darkMode 
                    ? 'border-indigo-400 text-indigo-400' 
                    : 'border-indigo-600 text-indigo-600'
                  : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FiUsers className="mr-2" />
                Utilisateurs
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'stats'
                  ? darkMode 
                    ? 'border-indigo-400 text-indigo-400' 
                    : 'border-indigo-600 text-indigo-600'
                  : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FiBarChart2 className="mr-2" />
                Statistiques
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'settings'
                  ? darkMode 
                    ? 'border-indigo-400 text-indigo-400' 
                    : 'border-indigo-600 text-indigo-600'
                  : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <FiSettings className="mr-2" />
                Paramètres
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Users Card */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                      <FiUsers className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Utilisateurs</p>
                      <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
                <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'} px-6 py-2`}>
                  <div className="text-xs text-indigo-100">
                    Dernière mise à jour: {lastRefreshTime ? formatDate(lastRefreshTime) : 'Jamais'}
                  </div>
                </div>
              </div>

              {/* Admin Users Card */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                      <FiSettings className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Administrateurs</p>
                      <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.adminUsers}</p>
                    </div>
                  </div>
                </div>
                <div className={`${darkMode ? 'bg-gradient-to-r from-purple-400 to-pink-500' : 'bg-gradient-to-r from-purple-500 to-pink-600'} px-6 py-2`}>
                  <div className="text-xs text-purple-100">
                    {Math.round((stats.adminUsers / stats.totalUsers) * 100)}% du total
                  </div>
                </div>
              </div>

              {/* Analyst Users Card */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${darkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-600'}`}>
                      <FiActivity className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Analystes</p>
                      <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.analystOpUsers + stats.analystBizUsers}</p>
                    </div>
                  </div>
                </div>
                <div className={`${darkMode ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'} px-6 py-2`}>
                  <div className="text-xs text-emerald-100">
                    {Math.round(((stats.analystOpUsers + stats.analystBizUsers) / stats.totalUsers) * 100)}% du total
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border mb-6`}>
              <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Utilisateurs récents</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                        Email
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                        Rôle
                      </th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                        Direction
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${user.role === 'ADMIN' 
                              ? darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800' 
                              : user.role === 'ANALYST_OP' 
                                ? darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800' 
                                : darkMode ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {user.direction || 'Non spécifié'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`px-6 py-3 ${darkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'}`}>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`text-sm ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'} font-medium`}
                >
                  Voir tous les utilisateurs →
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
              <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Actions rapides</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setActiveTab('users'); setShowRegister(true); }}
                  className={`flex items-center justify-center p-4 ${darkMode ? 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'} rounded-lg transition-colors`}
                >
                  <FiUserPlus className="mr-2" />
                  Ajouter un utilisateur
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={exportToCSV}
                  className={`flex items-center justify-center p-4 ${darkMode ? 'bg-emerald-900 text-emerald-200 hover:bg-emerald-800' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'} rounded-lg transition-colors`}
                >
                  <FiDownload className="mr-2" />
                  Exporter les données
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center justify-center p-4 ${darkMode ? 'bg-purple-900 text-purple-200 hover:bg-purple-800' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'} rounded-lg transition-colors`}
                >
                  <FiPieChart className="mr-2" />
                  Voir les statistiques
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="w-full md:w-auto">
                <SearchBar 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  placeholder="Rechercher un utilisateur..."
                  icon={<FiSearch className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                  darkMode={darkMode}
                />
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRegister(true)}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                    darkMode ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <FiUserPlus className="mr-2 -ml-1 h-4 w-4" />
                  Ajouter
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToCSV}
                  disabled={!filteredUsers.length}
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    !filteredUsers.length ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FiDownload className="mr-2 -ml-1 h-4 w-4" />
                  Exporter
                </motion.button>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
              <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex items-center`}>
                <FiFilter className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filtres</h3>
              </div>
              <div className="p-4">
                <FilterBar
                  filters={filters}
                  setFilters={setFilters}
                  directions={uniqueValues('direction')}
                  fonctions={uniqueValues('fonction')}
                  roles={uniqueValues('role')}
                  darkMode={darkMode}
                />
              </div>
            </div>

            {/* Remplacer AnimatePresence par div */}
            <div>
              {showRegister && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}
                >
                  <div className={`flex justify-between items-center px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Ajouter un utilisateur</h2>
                    <button 
                      onClick={() => setShowRegister(false)}
                      className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <svg className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <Register
                      onSuccess={() => {
                        fetchUsers();
                        setShowRegister(false);
                        toast.success("Utilisateur ajouté !");
                      }}
                      onClose={() => setShowRegister(false)}
                      darkMode={darkMode}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
              <UserTable
                users={filteredUsers}
                loading={loading}
                onDeleteRequest={setDeleteConfirm}
                darkMode={darkMode}
              />
            </div>

            {/* Remplacer AnimatePresence par div */}
            <div>
              {deleteConfirm && (
                <DeleteModal 
                  user={deleteConfirm} 
                  onCancel={() => setDeleteConfirm(null)} 
                  onConfirm={handleDelete}
                  darkMode={darkMode}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
              <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Répartition des utilisateurs par rôle</h2>
              </div>
              <div className="p-6 h-64 flex items-center justify-center">
                {/* Ici, vous pourriez intégrer un graphique réel avec une bibliothèque comme Recharts */}
                <div className="w-full max-w-md">
                  {roleDistribution.map((item, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.name}</span>
                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.value}</span>
                      </div>
                      <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2.5`}>
                        <div 
                          className={`h-2.5 rounded-full`}
                          style={{ 
                            width: `${(item.value / stats.totalUsers) * 100}%`,
                            backgroundColor: getColorForIndex(index)
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
                <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Statistiques des utilisateurs</h2>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className={`px-4 py-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg overflow-hidden sm:p-6`}>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Total Utilisateurs</dt>
                      <dd className={`mt-1 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalUsers}</dd>
                    </div>
                    <div className={`px-4 py-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg overflow-hidden sm:p-6`}>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Administrateurs</dt>
                      <dd className={`mt-1 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.adminUsers}</dd>
                    </div>
                    <div className={`px-4 py-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg overflow-hidden sm:p-6`}>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Analystes Opérationnels</dt>
                      <dd className={`mt-1 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.analystOpUsers}</dd>
                    </div>
                    <div className={`px-4 py-5 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg overflow-hidden sm:p-6`}>
                      <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Analystes Business</dt>
                      <dd className={`mt-1 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.analystBizUsers}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
                <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Actions</h2>
                </div>
                <div className="p-6 space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={exportToCSV}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md ${
                      darkMode ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    <FiDownload className="mr-2 -ml-1 h-4 w-4" />
                    Exporter les données utilisateurs
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setActiveTab('users'); setShowRegister(true); }}
                    className={`w-full flex items-center justify-center px-4 py-3 border text-sm font-medium rounded-md ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300' 
                        : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    <FiUserPlus className="mr-2 -ml-1 h-4 w-4" />
                    Ajouter un nouvel utilisateur
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-md overflow-hidden border`}>
              <div className={`px-6 py-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Paramètres du compte</h2>
              </div>
              <div className="p-6">
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>Cette section est en cours de développement.</p>
                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 ${
                      darkMode ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    Modifier le profil
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                  >
                    Changer le mot de passe
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t py-4`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2025 Tunisie Telecom. Tous droits réservés.
            </div>
            <div className={`mt-2 md:mt-0 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Dashboard Administrateur | Version 2.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminDashboard;
