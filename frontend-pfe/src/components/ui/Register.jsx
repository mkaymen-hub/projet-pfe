import React, { useState } from 'react';
import axios from '../../services/api';
import { FiX } from 'react-icons/fi'; // Importez une icône de fermeture

const Register = ({ onSuccess, onClose }) => { // Récupérez la prop onClose
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    matricule: '',
    email: '',
    password: '',
    direction: '',
    fonction: '',
    role: 'ADMIN',
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!form.matricule.trim()) {
      newErrors.matricule = "Le matricule est requis";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({...errors, [name]: undefined});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post('/api/auth/register', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Reset the form
      setForm({
        matricule: '',
        email: '',
        password: '',
        direction: '',
        fonction: '',
        role: 'ADMIN',
      });

      // Call onSuccess to close the form or refresh data
      if (onSuccess) onSuccess();
    } catch (err) {
      const backendMessage = err.response?.data || "Erreur lors de l'enregistrement.";
      setErrorMessage(backendMessage);
      console.error("Erreur détaillée :", backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
      {/* Bouton de fermeture */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        style={{ top: '0.5rem', right: '0.5rem' }} // Style en ligne pour plus de contrôle
      >
        <FiX className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-semibold mb-4">Créer un utilisateur</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matricule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
            <input
              type="text"
              name="matricule"
              value={form.matricule}
              onChange={handleChange}
              className={`${inputClasses} ${errors.matricule ? 'border-red-500' : ''}`}
              placeholder="Matricule"
            />
            {errors.matricule && <p className={errorClasses}>{errors.matricule}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`${inputClasses} ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Email"
            />
            {errors.email && <p className={errorClasses}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`${inputClasses} ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Mot de passe"
            />
            {errors.password && <p className={errorClasses}>{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="ADMIN">Admin</option>
              <option value="ANALYST_OP">Analyste Opérationnel</option>
              <option value="ANALYST_BIZ">Analyste Business</option>
            </select>
          </div>

          {/* Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <input
              type="text"
              name="direction"
              value={form.direction}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Direction"
            />
          </div>

          {/* Fonction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fonction</label>
            <input
              type="text"
              name="fonction"
              value={form.fonction}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Fonction"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="button" // Ajout du bouton Annuler
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-2"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Création...
              </span>
            ) : "Créer l'utilisateur"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;