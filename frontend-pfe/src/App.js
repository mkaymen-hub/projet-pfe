/*import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {isLoggedIn ? (
        <h1>Bienvenue ! Vous êtes connecté.</h1>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
}

export default App;*/

//ca fonctionne que avec admin
/*import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // import navigate
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OpDashboard from './pages/OpDashboard';
import BizDashboard from './pages/BizDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); // Ajouter un état pour le rôle de l'utilisateur
  const navigate = useNavigate(); // Déclarer navigate

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setRole(role); // Stocke le rôle de l'utilisateur
    navigate(getRedirectPath(role)); // Effectuer la redirection en fonction du rôle
  };

  const getRedirectPath = (role) => {
    // Rediriger vers l'interface appropriée en fonction du rôle
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "ANALYSTE_BIZ") return "/business/dashboard";
    return "/"; // Redirection par défaut
  };

  return (
    <div>
      {isLoggedIn ? (
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/operationnel/dashboard" element={<OpDashboard />} />
          <Route path="/business/dashboard" element={<BizDashboard />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      )}
    </div>
  );
}

export default App;*/


//version qui marche saud biz analyste
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from './pages/Login';
import Register from './components/ui/Register';
import AdminDashboard from './pages/AdminDashboard';
import OpDashboard from './pages/OpDashboard';
import BizDashboard from './pages/BizDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
  
    if (token && storedRole) {
      setIsLoggedIn(true);
      setRole(storedRole);
      navigate(getRedirectPath(storedRole)); // <== redirection automatique
    }
  }, []);

  const handleLoginSuccess = (role) => {
    setIsLoggedIn(true);
    setRole(role);
    navigate(getRedirectPath(role));
  };

  const getRedirectPath = (role) => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "ANALYST_OP") return "/operationnel/dashboard";
    if (role === "ANALYST_BIZ") return "/business/dashboard"; // <-- ici
    return "/";
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      
      <Route path="/admin/dashboard" element={isLoggedIn && role === "ADMIN" ? <AdminDashboard /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/operationnel/dashboard" element={isLoggedIn && role === "ANALYST_OP" ? <OpDashboard /> : <Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/business/dashboard" element={isLoggedIn && role === "ANALYST_BIZ" ? <BizDashboard /> : <Login onLoginSuccess={handleLoginSuccess} />} />
    </Routes>
  );
}

export default App;
