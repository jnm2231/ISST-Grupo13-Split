import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Components
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import GroupsPage from './pages/GroupsPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseDetailPage from './pages/ExpenseDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import AddExpensePage from './pages/AddExpensePage';
import ErrorPage from './pages/ErrorPage';

// Utilities and data
import { mockgrupos } from './constants/mockgrupos';
import CONFIG from './config/config';

function App() {
  const [groups, setGroups] = useState();
  const [loading, setLoading] = useState(true);

  // Get user from localStorage or create a test user if none exists
  let usuario = localStorage.getItem('usuario');
  if (usuario == null) {
    localStorage.setItem('usuario', JSON.stringify({ 
      id: 4, 
      nombre: "Julio", 
      email: "usuario4@example.com" 
    }));
    usuario = JSON.parse(localStorage.getItem('usuario') || '');
  } else {
    usuario = JSON.parse(usuario);
  }

  // Function to load data from API or mock data
  async function loadData() {
    console.log("Loading data...");

    const token = localStorage.getItem("token");
    
    if (CONFIG.use_server === true && token) {
      try {
        const response = await fetch(`${CONFIG.api_grupos}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 200) {
          const data = await response.json();
          setGroups(data);
        } else {
          const dataError = await response.json();
          console.error(`Error: ${response.status} - ${dataError.error?.message}`);
        }
      } catch (error) {
        console.error("ERROR", error);
      }
    } else {
      setGroups(mockgrupos.Grupos);
      console.log("Mock mode activated");
    }
  }

  useEffect(() => {
    loadData();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/grupoGastos" element={<GroupsPage groups={groups} />} />
          <Route path="/:grupoId/gastos" element={<ExpensesPage />} />
          <Route path="/:grupoId/gastos/:gastoId" element={<ExpenseDetailPage />} />
          <Route path="/creargrupo" element={<CreateGroupPage />} />
          <Route path="/:grupoId/gastos/anadirgasto" element={<AddExpensePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;