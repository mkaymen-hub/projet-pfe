/*import React from 'react';
import { useNavigate } from 'react-router-dom';

function OpDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les informations de connexion dans localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Rediriger l'utilisateur vers la page de connexion
    navigate('/');
  };

  return (
    <div>
      <h1>Opérationnel Dashboard</h1>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}

export default OpDashboard;*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OpDashboard() {
  const navigate = useNavigate();
  const [fluxList, setFluxList] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/');
  };

  // Utilisation de useEffect pour récupérer les données au démarrage du composant
  useEffect(() => {
    axios.get("http://localhost:8080/api/flux/status", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => {
        setFluxList(res.data);
      })
      .catch(err => {
        console.error("Erreur lors du fetch des statuts de flux:", err);
      });
  }, []);

  // Fonction pour formater la date ISO en un format lisible
  const formatDate = (dateStr) => {
    // Si la date est au format ISO, créer un objet Date directement
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) ? date.toLocaleString() : 'Date invalide';
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Opérationnel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nom du flux</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Dernière date de chargement</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Statut</th>
            </tr>
          </thead>
          <tbody>
            {fluxList.map((flux, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-4">{flux.nomFlux}</td>
                <td className="px-6 py-4">{flux.dernierChargement ? formatDate(flux.dernierChargement) : 'Aucune donnée'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${flux.status === 'UP' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {flux.status}
                  </span>
                </td>
              </tr>
            ))}
            {fluxList.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-gray-500 py-6">Aucun flux trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OpDashboard;