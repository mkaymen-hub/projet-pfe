
import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Brush, ReferenceLine
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';

// Chargement paresseux des composants lourds
const DetailedFluxModal = lazy(() => import('./DetailedFluxModal'));

function OpDashboard() {
  const [chargementCounts, setChargementCounts] = useState({});
  const [fluxList, setFluxList] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [selectedFlux, setSelectedFlux] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60); // en secondes
  const [zoomDomain, setZoomDomain] = useState(null);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [selectedFluxDetails, setSelectedFluxDetails] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);
  const navigate = useNavigate();



  // Détecter si l'appareil est mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialiser les dates par défaut (aujourd'hui et il y a 7 jours)
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    setEndDate(formatDateForInput(today));
    setStartDate(formatDateForInput(sevenDaysAgo));
  }, []);

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

  const fetchChargementCounts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/flux/count", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      const countMap = {};
      response.data.forEach(item => {
        countMap[item.nomFlux] = item.total;
      });
  
      setChargementCounts(countMap);
    } catch (error) {
      console.error("Erreur lors de la récupération des compteurs :", error);
    }
  };


  // Vérifie le token dès le départ
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token manquant. Redirection.");
      navigate('/');
      return;
    }
    fetchFluxStatus();
    fetchChargementCounts(); // <--- ajoute cette ligne ici
  }, []);

  // Effet pour l'actualisation automatique
  useEffect(() => {
    let intervalId;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchFluxStatus();
        if (startDate && endDate) {
          fetchChartData();
        }
        setLastRefreshTime(new Date());
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval, startDate, endDate]);

  // Effet pour mettre à jour selectedFlux quand fluxList change
  useEffect(() => {
    if (fluxList.length > 0 && selectedFlux.length === 0) {
      // Par défaut, sélectionner tous les flux
      setSelectedFlux(fluxList.map(flux => flux.nomFlux));
    }
  }, [fluxList]);

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

  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchFluxStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/flux/status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });




      setFluxList(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du fetch des statuts de flux:", err);
      setError("Impossible de récupérer les statuts des flux.");
      setLoading(false);
    }
  };

  const formatDateForApi = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format "yyyy-MM-dd" : "2025-04-20"
  };

  const transformDataForChart = (fluxData) => {
    console.log("fluxData reçue depuis /api/flux/trends:", fluxData);
    if (!fluxData || !Array.isArray(fluxData)) return [];
    
    // Créer un dictionnaire pour stocker les dates et les comptages par flux
    const dateCountMap = {};
    
    // Parcourir chaque flux
    fluxData.forEach(flux => {
      if (flux.tendances && Array.isArray(flux.tendances)) {
        // Compter les chargements par jour pour chaque flux
        flux.tendances.forEach(dateTime => {
          const date = new Date(dateTime);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          
          if (!dateCountMap[dateStr]) {
            dateCountMap[dateStr] = {};
          }
          
          if (!dateCountMap[dateStr][flux.nomFlux]) {
            dateCountMap[dateStr][flux.nomFlux] = 0;
          }
          
          dateCountMap[dateStr][flux.nomFlux]++;
        });
      }
    });
    
    // Convertir le dictionnaire en tableau pour Recharts
    const chartData = Object.keys(dateCountMap).map(date => {
      const dataPoint = { date };
      
      // Ajouter le comptage pour chaque flux
      fluxData.forEach(flux => {
        dataPoint[flux.nomFlux] = dateCountMap[date][flux.nomFlux] || 0;
      });
      
      return dataPoint;
    });
    
    // Trier les données par date
    return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getColorForIndex = (index) => {
    const colors = darkMode 
      ? ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#60A5FA', '#A78BFA', '#F472B6', '#2DD4BF', '#FB923C', '#818CF8']
      : ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];
    return colors[index % colors.length];
  };

  const fetchChartData = async () => {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (!startDate || !endDate) {
      console.error("Les dates doivent être définies.");
      return;
    }

    // Formater les dates avant de les envoyer
    const formattedStartDate = formatDateForApi(startDate);
    const formattedEndDate = formatDateForApi(endDate);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8080/api/flux/trends", {
        params: { startDate: formattedStartDate, endDate: formattedEndDate },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      // Transformer les données pour le graphique
      const transformedData = transformDataForChart(response.data);
      setChartData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données du graphique:", error);
      setError("Impossible de récupérer les données du graphique. Veuillez réessayer plus tard.");
      setLoading(false);
    }
  };

  // Fonction debounce pour éviter trop d'appels lors du changement de dates
  const debouncedFetchChartData = useCallback(
    debounce(() => {
      fetchChartData();
    }, 500),
    [startDate, endDate]
  );

  const handleDateChange = (event, type) => {
    const value = event.target.value;
    console.log(`${type === 'start' ? 'Start' : 'End'} Date sélectionnée:`, value);
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    
    // Si les deux dates sont définies, déclencher la recherche automatiquement
    if (startDate && endDate) {
      debouncedFetchChartData();
    }
  };

  // Formater la date pour l'affichage dans le tableau
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2); // On garde seulement les 2 derniers chiffres de l'année
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
  

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Fonction pour obtenir la date du dernier chargement
  const getLatestChargementDate = () => {
    if (!Array.isArray(fluxList) || fluxList.length === 0) return 'Aucune donnée';
    
    const latestDate = fluxList.reduce((latest, flux) => {
      if (!flux.dernierChargement) return latest;
      const currentDate = new Date(flux.dernierChargement);
      return currentDate > latest ? currentDate : latest;
    }, new Date(0));
    
    return latestDate.getTime() === 0 ? 'Aucune donnée' : formatDate(latestDate);
  };

  // Fonction pour générer des données de sparkline
  const getSparklineData = (fluxName) => {
    if (!chartData.length) {
      // Si pas de données réelles, générer des données aléatoires
      return Array.from({ length: 10 }, (_, i) => ({
        index: i,
        value: Math.floor(Math.random() * 10) + 1
      }));
    }
    
    // Utiliser les données réelles du graphique pour ce flux
    return chartData.map((dataPoint, index) => ({
      index,
      value: dataPoint[fluxName] || 0
    }));
  };

  const getChargementCount = (fluxName) => {
    return chargementCounts[fluxName] || 0;
  };

  // Fonction pour gérer la sélection/désélection des flux
  const handleFluxSelection = (fluxName) => {
    setSelectedFlux(prev => {
      if (prev.includes(fluxName)) {
        return prev.filter(name => name !== fluxName);
      } else {
        return [...prev, fluxName];
      }
    });
  };

  // Fonction pour sélectionner/désélectionner tous les flux
  const handleSelectAllFlux = () => {
    if (selectedFlux.length === fluxList.length) {
      setSelectedFlux([]);
    } else {
      setSelectedFlux(fluxList.map(flux => flux.nomFlux));
    }
  };
  

  // Fonction pour gérer le zoom sur le graphique
  const handleZoom = (domain) => {
    setZoomDomain(domain);
  };
  
  
  // Fonction pour réinitialiser le zoom
  const resetZoom = () => {
    setZoomDomain(null);
  };

  // Fonction pour exporter les données en CSV
  const exportToCSV = () => {
    if (!chartData.length) return;
    
    // Créer l'en-tête CSV
    const headers = ['date', ...fluxList.map(flux => flux.nomFlux)];
    
    // Créer les lignes de données
    const rows = chartData.map(dataPoint => {
      return headers.map(header => {
        return dataPoint[header] !== undefined ? dataPoint[header] : '';
      }).join(',');
    });
    
    // Assembler le contenu CSV
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tendances_flux_${formatDateForApi(startDate)}_${formatDateForApi(endDate)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour afficher les détails d'un flux
  const showFluxDetails = (flux) => {
    setSelectedFluxDetails(flux);
    setShowDetailModal(true);
  };

  // Composant SparklineChart pour les mini-graphiques dans le tableau
  const SparklineChart = ({ data, color }) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Composant de tooltip personnalisé
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 border rounded-md shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
        >
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{`Date: ${label}`}</p>
          <div className="mt-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center mb-1">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {`${entry.name}: ${entry.value} chargement${entry.value > 1 ? 's' : ''}`}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Fonction pour rendre le graphique selon le type sélectionné
  const renderChart = () => {
    // Filtrer les données pour n'inclure que les flux sélectionnés
    const filteredFluxList = fluxList.filter(flux => selectedFlux.includes(flux.nomFlux));
    
    // Calculer la moyenne pour la ligne de référence
    const calculateAverage = (fluxName) => {
      if (!chartData.length) return 0;
      const sum = chartData.reduce((total, dataPoint) => total + (dataPoint[fluxName] || 0), 0);
      return sum / chartData.length;
    };
    
    switch (chartType) {
      case 'area':
        return (
          <AreaChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setTooltipContent({
                  label: e.activeLabel,
                  payload: e.activePayload
                });
              }
            }}
            onMouseLeave={() => setTooltipContent(null)}
          >
            <defs>
              {filteredFluxList.map((flux, index) => (
                <linearGradient key={flux.nomFlux} id={`color-${flux.nomFlux}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getColorForIndex(index)} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={getColorForIndex(index)} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="date" 
              domain={zoomDomain ? [zoomDomain.x[0], zoomDomain.x[1]] : ['auto', 'auto']}
              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
            />
            <YAxis 
              domain={zoomDomain ? [zoomDomain.y[0], zoomDomain.y[1]] : ['auto', 'auto']} 
              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              onClick={(e) => handleFluxSelection(e.dataKey)}
              formatter={(value, entry) => {
                return <span style={{ color: selectedFlux.includes(value) ? entry.color : darkMode ? '#6B7280' : '#9CA3AF' }}>{value}</span>;
              }}
              wrapperStyle={{ color: darkMode ? "#E5E7EB" : "#1F2937" }}
            />
            {filteredFluxList.map((flux, index) => (
              <Area 
                key={flux.nomFlux}
                type="monotone" 
                dataKey={flux.nomFlux} 
                stroke={getColorForIndex(index)} 
                fillOpacity={1}
                fill={`url(#color-${flux.nomFlux})`}
                hide={!selectedFlux.includes(flux.nomFlux)}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            ))}
            {filteredFluxList.map((flux, index) => (
              selectedFlux.includes(flux.nomFlux) && (
                <ReferenceLine 
                  key={`avg-${flux.nomFlux}`}
                  y={calculateAverage(flux.nomFlux)} 
                  stroke={getColorForIndex(index)} 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `Moy. ${flux.nomFlux}`, 
                    fill: getColorForIndex(index),
                    fontSize: 10
                  }} 
                />
              )
            ))}
            <Brush 
              dataKey="date" 
              height={30} 
              stroke={darkMode ? "#818CF8" : "#4F46E5"} 
              fill={darkMode ? "#1F2937" : "#F9FAFB"}
              tickFormatter={(tick) => tick.split('-')[2]} // Afficher seulement le jour
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setTooltipContent({
                  label: e.activeLabel,
                  payload: e.activePayload
                });
              }
            }}
            onMouseLeave={() => setTooltipContent(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="date" 
              domain={zoomDomain ? [zoomDomain.x[0], zoomDomain.x[1]] : ['auto', 'auto']}
              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
            />
            <YAxis 
              domain={zoomDomain ? [zoomDomain.y[0], zoomDomain.y[1]] : ['auto', 'auto']} 
              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              onClick={(e) => handleFluxSelection(e.dataKey)}
              formatter={(value, entry) => {
                return <span style={{ color: selectedFlux.includes(value) ? entry.color : darkMode ? '#6B7280' : '#9CA3AF' }}>{value}</span>;
              }}
              wrapperStyle={{ color: darkMode ? "#E5E7EB" : "#1F2937" }}
            />
            {filteredFluxList.map((flux, index) => (
              <Bar 
                key={flux.nomFlux}
                dataKey={flux.nomFlux} 
                fill={getColorForIndex(index)} 
                hide={!selectedFlux.includes(flux.nomFlux)}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            ))}
            {filteredFluxList.map((flux, index) => (
              selectedFlux.includes(flux.nomFlux) && (
                <ReferenceLine 
                  key={`avg-${flux.nomFlux}`}
                  y={calculateAverage(flux.nomFlux)} 
                  stroke={getColorForIndex(index)} 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `Moy. ${flux.nomFlux}`, 
                    fill: getColorForIndex(index),
                    fontSize: 10
                  }} 
                />
              )
            ))}
            <Brush 
              dataKey="date" 
              height={30} 
              stroke={darkMode ? "#818CF8" : "#4F46E5"} 
              fill={darkMode ? "#1F2937" : "#F9FAFB"}
              tickFormatter={(tick) => tick.split('-')[2]} // Afficher seulement le jour
            />
          </BarChart>
        );
      default: // 'line'
        return (
          <LineChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            onMouseMove={(e) => {
              if (e && e.activePayload) {
                setTooltipContent({
                  label: e.activeLabel,
                  payload: e.activePayload
                });
              }
            }}
            onMouseLeave={() => setTooltipContent(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="date" 
              domain={zoomDomain ? [zoomDomain.x[0], zoomDomain.x[1]] : ['auto', 'auto']}
              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
            />
            <YAxis 
              domain={zoomDomain ? [zoomDomain.y[0], zoomDomain.y[1]] : ['auto', 'auto']} 
              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              onClick={(e) => handleFluxSelection(e.dataKey)}
              formatter={(value, entry) => {
                return <span style={{ color: selectedFlux.includes(value) ? entry.color : darkMode ? '#6B7280' : '#9CA3AF' }}>{value}</span>;
              }}
              wrapperStyle={{ color: darkMode ? "#E5E7EB" : "#1F2937" }}
            />
            {filteredFluxList.map((flux, index) => (
              <Line 
                key={flux.nomFlux}
                type="monotone" 
                dataKey={flux.nomFlux} 
                stroke={getColorForIndex(index)} 
                activeDot={{ r: 8 }}
                hide={!selectedFlux.includes(flux.nomFlux)}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            ))}
            {filteredFluxList.map((flux, index) => (
              selectedFlux.includes(flux.nomFlux) && (
                <ReferenceLine 
                  key={`avg-${flux.nomFlux}`}
                  y={calculateAverage(flux.nomFlux)} 
                  stroke={getColorForIndex(index)} 
                  strokeDasharray="3 3" 
                  label={{ 
                    value: `Moy. ${flux.nomFlux}`, 
                    fill: getColorForIndex(index),
                    fontSize: 10
                  }} 
                />
              )
            ))}
            <Brush 
              dataKey="date" 
              height={30} 
              stroke={darkMode ? "#818CF8" : "#4F46E5"} 
              fill={darkMode ? "#1F2937" : "#F9FAFB"}
              tickFormatter={(tick) => tick.split('-')[2]} // Afficher seulement le jour
            />
          </LineChart>
        );
    }
  };

  // Calculer le temps restant avant la prochaine actualisation
  const getRefreshCountdown = () => {
    if (!autoRefresh || !lastRefreshTime) return '';
    
    const nextRefreshTime = new Date(lastRefreshTime.getTime() + refreshInterval * 1000);
    const now = new Date();
    const remainingSeconds = Math.max(0, Math.floor((nextRefreshTime - now) / 1000));
    
    return `Prochaine actualisation dans ${remainingSeconds}s`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* En-tête amélioré */}
      <header className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard Opérationnel</h1>
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center"
            >
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
              >
                {darkMode ? (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center"
            >
              <input
                id="autoRefresh"
                type="checkbox"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
                className={`h-4 w-4 ${darkMode ? 'bg-gray-700 border-gray-600 text-indigo-500' : 'bg-white border-gray-300 text-indigo-600'} focus:ring-indigo-500 rounded`}
              />
              <label htmlFor="autoRefresh" className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Actualisation auto
              </label>
              {autoRefresh && (
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className={`ml-2 block w-24 pl-3 pr-10 py-1 text-base ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
                      : 'border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  } sm:text-sm rounded-md`}
                >
                  <option value={30}>30s</option>
                  <option value={60}>1min</option>
                  <option value={300}>5min</option>
                  <option value={600}>10min</option>
                </select>
              )}
            </motion.div>
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => {
                localStorage.removeItem("token");
                navigate('/');
              }}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                darkMode 
                  ? 'text-white bg-red-600 hover:bg-red-700' 
                  : 'text-white bg-red-600 hover:bg-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </motion.button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section des filtres améliorée */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'} rounded-lg p-6 mb-6`}
        >
          <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'} mb-4`}>Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e, 'start')}
                className={`w-full rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Date de fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(e, 'end')}
                className={`w-full rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>
            <div className="flex items-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchChartData}
                disabled={!startDate || !endDate || loading}
                className={`flex-grow inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                  darkMode 
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50' 
                    : 'text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                  </>
                ) : (
                  'Appliquer les filtres'
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                disabled={!chartData.length || loading}
                className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                title="Exporter en CSV"
              >
                <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </motion.button>
            </div>
          </div>
          
          {/* Filtres de flux */}
          {fluxList.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filtrer par flux</label>
                <button
                  onClick={handleSelectAllFlux}
                  className={`text-xs ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-900'}`}
                >
                  {selectedFlux.length === fluxList.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {fluxList.map((flux, index) => (
                  <motion.button
                    key={flux.nomFlux}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFluxSelection(flux.nomFlux)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedFlux.includes(flux.nomFlux)
                        ? darkMode 
                          ? 'bg-indigo-900 text-indigo-200 border border-indigo-700' 
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                    style={{
                      borderColor: selectedFlux.includes(flux.nomFlux) ? getColorForIndex(index) : undefined,
                      color: selectedFlux.includes(flux.nomFlux) ? getColorForIndex(index) : undefined
                    }}
                  >
                    {flux.nomFlux}
                    {selectedFlux.includes(flux.nomFlux) ? (
                      <svg className="ml-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="ml-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Indicateur de prochaine actualisation */}
          {autoRefresh && lastRefreshTime && (
            <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getRefreshCountdown()}
            </div>
          )}
        </motion.div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-md p-3`}>
                <svg className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Total des flux</dt>
                  <dd className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fluxList.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${darkMode ? 'bg-green-900' : 'bg-green-100'} rounded-md p-3`}>
                <svg className={`h-6 w-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Flux actifs (UP)</dt>
                  <dd className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {fluxList.filter(flux => flux.status === 'UP').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${darkMode ? 'bg-red-900' : 'bg-red-100'} rounded-md p-3`}>
                <svg className={`h-6 w-6 ${darkMode ? 'text-red-400' : 'text-red-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Flux inactifs (DOWN)</dt>
                  <dd className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {fluxList.filter(flux => flux.status === 'DOWN').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${darkMode ? 'bg-yellow-900' : 'bg-yellow-100'} rounded-md p-3`}>
                <svg className={`h-6 w-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>Dernier chargement</dt>
                  <dd className="flex items-baseline">
                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {getLatestChargementDate()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tableau de suivi des flux amélioré */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden mb-6`}
        >
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>Suivi des flux</h2>
          </div>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Nom du flux
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Dernière date de chargement
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Statut
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Tendance
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Total chargements
                  </th>
                  <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                {Array.isArray(fluxList) && fluxList.length > 0 ? (
                  fluxList.map((flux, index) => (
                    <motion.tr 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`${
                        darkMode 
                          ? selectedFlux.includes(flux.nomFlux) ? 'bg-indigo-900 bg-opacity-20 hover:bg-indigo-900 hover:bg-opacity-30' : 'hover:bg-gray-700' 
                          : selectedFlux.includes(flux.nomFlux) ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleFluxSelection(flux.nomFlux)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{flux.nomFlux}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>{flux.dernierChargement ? formatDate(flux.dernierChargement) : 'Aucune donnée'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          flux.status === 'UP' 
                            ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800' 
                            : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                        }`}>
                          {flux.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-8">
                          {/* Mini sparkline chart pour chaque flux */}
                          <SparklineChart data={getSparklineData(flux.nomFlux)} color={flux.status === 'UP' ? (darkMode ? '#34D399' : '#10B981') : (darkMode ? '#F87171' : '#EF4444')} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{getChargementCount(flux.nomFlux)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showFluxDetails(flux);
                          }}
                          className={`inline-flex items-center px-2 py-1 border text-xs rounded-md ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' 
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <svg className="mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Détails
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {loading ? (
                        <div className="flex justify-center items-center">
                          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={darkMode ? "#9CA3AF" : "#6B7280"}>
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement des données...
                        </div>
                      ) : (
                        'Aucun flux disponible'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Graphiques de tendances améliorés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique principal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2`}
          >
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>Tendances de chargement des flux</h2>
              <div className="flex space-x-2">
                <select 
                  className={`rounded-md text-sm ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="line">Ligne</option>
                  <option value="area">Aire</option>
                  <option value="bar">Barres</option>
                </select>
                {zoomDomain && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetZoom}
                    className={`inline-flex items-center px-2 py-1 border text-xs font-medium rounded ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 bg-gray-700 hover:bg-gray-600' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    Réinitialiser zoom
                  </motion.button>
                )}
              </div>
            </div>
            <div className="p-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-md p-4 mb-4 ${darkMode ? 'bg-red-900' : 'bg-red-50'}`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className={`h-5 w-5 ${darkMode ? 'text-red-300' : 'text-red-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              {loading ? (
                <div className="flex justify-center items-center h-80">
                  <motion.svg 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`h-10 w-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </motion.svg>
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={`flex justify-center items-center h-80 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} rounded-lg border-2 border-dashed`}>
                  <div className="text-center">
                    <svg className={`mx-auto h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sélectionnez une plage de dates et cliquez sur "Appliquer les filtres" pour afficher les tendances</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Graphiques complémentaires */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>Répartition des statuts</h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'UP', value: fluxList.filter(flux => flux.status === 'UP').length, color: darkMode ? '#34D399' : '#10B981' },
                        { name: 'DOWN', value: fluxList.filter(flux => flux.status === 'DOWN').length, color: darkMode ? '#F87171' : '#EF4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                    >
                      {[
                        { name: 'UP', value: fluxList.filter(flux => flux.status === 'UP').length, color: darkMode ? '#34D399' : '#10B981' },
                        { name: 'DOWN', value: fluxList.filter(flux => flux.status === 'DOWN').length, color: darkMode ? '#F87171' : '#EF4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ color: darkMode ? "#E5E7EB" : "#1F2937" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className={`transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>Activité par flux</h2>
            </div>
            <div className="p-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fluxList.map(flux => ({
                      name: flux.nomFlux,
                      chargements: getChargementCount(flux.nomFlux),
                      status: flux.status
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                    />
                    <YAxis tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ color: darkMode ? "#E5E7EB" : "#1F2937" }} />
                    <Bar 
                      dataKey="chargements" 
                      name="Nombre de chargements"
                      animationDuration={1000}
                      animationEasing="ease-in-out"
                    >
                      {fluxList.map((flux, index) => (
                        <Cell key={`cell-${index}`} fill={flux.status === 'UP' ? (darkMode ? '#34D399' : '#10B981') : (darkMode ? '#F87171' : '#EF4444')} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Modal de détails du flux */}
      <AnimatePresence>
        {showDetailModal && selectedFluxDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={() => setShowDetailModal(false)}
              ></motion.div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`inline-block align-bottom ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
              >
                <Suspense fallback={
                  <div className="p-6 flex justify-center items-center">
                    <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                }>
                  <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium" id="modal-title">
                        Détails du flux: {selectedFluxDetails.nomFlux}
                      </h3>
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className={`rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'} focus:outline-none`}
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="mb-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut:</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedFluxDetails.status === 'UP' 
                          ? darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800' 
                          : darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedFluxDetails.status}
                      </span>
                    </div>
                    <div className="mb-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dernier chargement:</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {selectedFluxDetails.dernierChargement ? formatDate(selectedFluxDetails.dernierChargement) : 'Aucune donnée'}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nombre total de chargements:</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {getChargementCount(selectedFluxDetails.nomFlux)}
                      </p>
                    </div>
                    <div className="mb-4">
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Tendance:</p>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={getSparklineData(selectedFluxDetails.nomFlux)}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                            <XAxis 
                              dataKey="index" 
                              tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }}
                            />
                            <YAxis tick={{ fill: darkMode ? "#9CA3AF" : "#4B5563" }} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={selectedFluxDetails.status === 'UP' ? (darkMode ? '#34D399' : '#10B981') : (darkMode ? '#F87171' : '#EF4444')} 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                              animationDuration={1000}
                              animationEasing="ease-in-out"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className={`inline-flex justify-center px-4 py-2 text-sm font-medium rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      Fermer
                    </button>
                  </div>
                </Suspense>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OpDashboard;
