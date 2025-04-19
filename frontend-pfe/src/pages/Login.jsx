/*import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook pour redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = response.data.token; // ou adapter en fonction de la structure de ta réponse
      localStorage.setItem("token", token); // stocker le JWT

      const role = response.data.role; // ou récupérer le rôle depuis la réponse
      onLoginSuccess(role); // Appeler la fonction pour mettre à jour le rôle

      // Rediriger en fonction du rôle
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "ANALYSTE_OP") {
        navigate("/operationnel/dashboard");
      } else if (role === "ANALYSTE_BIZ") {
        navigate("/business/dashboard");
      }
    } catch (err) {
      setError("Identifiants invalides. Réessayer.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Se connecter</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      <p>Pas encore inscrit ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "10px",
  },
};

export default Login;*/
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import logoTT from '../assets/images/Tunisie-Telecom.jpg';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // ← on récupère navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      
      console.log("Réponse du backend:", data);  // Affiche l'objet de réponse
      const { token, role } = data;
      console.log("Role récupéré:", role);  // Vérifie le rôle récupéré
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      onLoginSuccess(role);
      

      // ← redirections automatiques
      if (role === "ADMIN") {
        console.log("Redirection vers le Dashboard Admin");
        navigate("/admin/dashboard");
      } else if (role === "ANALYST_OP") {
        console.log("Redirection vers le Dashboard Opérationnel");
        navigate("/operationnel/dashboard");
      } else {
        console.log("Redirection vers le Dashboard Business");
        navigate("/business/dashboard");
      }
    } catch (err) {
      setError("Identifiants invalides. Réessayer.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src={logoTT} alt="Logo Tunisie Telecom" style={styles.logo}/>
      </div>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)}
          required style={styles.input}
        />
        <input
          type="password" placeholder="Mot de passe"
          value={password} onChange={e => setPassword(e.target.value)}
          required style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Se connecter
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
      {/* ↘️ plus de lien vers /register */}
    </div>
  );
}

const styles = {
    container: {
      maxWidth: "400px",
      margin: "80px auto",
      padding: "30px",
      border: "none",
      borderRadius: "16px",
      textAlign: "center",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      background: "linear-gradient(to bottom right, #ffffff, #f8f9ff)",
    },
    logoContainer: {
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
      },
      logo: {
        maxWidth: "150px",
        height: "auto",
      },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      margin: "12px 0",
      padding: "12px 15px",
      fontSize: "16px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      transition: "all 0.2s ease",
      outline: "none",
    },
    button: {
      padding: "14px",
      backgroundColor: "#4361ee",
      color: "#fff",
      fontWeight: "bold",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      marginTop: "10px",
      boxShadow: "0 4px 6px rgba(67, 97, 238, 0.2)",
      transition: "all 0.2s ease",
    },
    error: {
      color: "#e53e3e",
      marginTop: "15px",
      padding: "10px",
      backgroundColor: "rgba(254, 215, 215, 0.5)",
      borderRadius: "8px",
      fontSize: "14px",
    },
  };

export default Login;