import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("Token JWT envoyé :", token); // Log pour vérifier si le token est récupéré et envoyé
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;