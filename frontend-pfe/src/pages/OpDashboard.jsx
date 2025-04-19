import React from 'react';
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

export default OpDashboard;