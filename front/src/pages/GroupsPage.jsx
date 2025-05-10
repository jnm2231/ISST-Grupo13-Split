import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Users, Box, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileSection from '../components/ProfileSection';
import CONFIG from '../config/config';

function GroupsPage() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userId = params.get('b');

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('usuario');
      navigate('/');
      return;
    }
    loadUser();
    loadGroups();
  }, [isLoggedIn]);

  const loadUser = async () => {
    if (!token) {
      const storedUser = JSON.parse(localStorage.getItem('usuario'));
      setUser(storedUser);
    } else {
      try {
        const response = await fetch(`${CONFIG.api_base_url}/me?userId=${userId}`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`, // Incluir el token en el encabezado
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });
        if (response.status === 200) {
          const data = await response.text();
          localStorage.setItem('usuario', JSON.stringify({ name: userId, email: data })); // Guardar el usuario en localStorage
          setUser({ nombre: userId, email: data });
          localStorage.setItem('token', token);
        } else {
          console.log("GrupoGastos.cargarUsuario(): espuesta de red OK pero respuesta de HTTP no OK");
            const dataError = await response.json();
            console.log(`GrupoGastos.cargarUsuario(): Error: ${response.status} - ${dataError.error.message}`);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    }
  };

  const loadGroups = async () => {
    try {
      const response = await fetch(`${CONFIG.api_grupos}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      } else {
        console.error('Error fetching groups');
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await fetch(`${CONFIG.api_grupos}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId }),
        credentials: 'include',
      });
      if (response.ok) {
        alert('Te has unido al grupo correctamente');
        setShowJoinModal(false);
        loadGroups();
      } else {
        alert('Error al unirse al grupo');
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-12">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <ProfileSection isGuest={!user} />
          </div>

          {/* Groups Section */}
          <div className="md:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mis Grupos de Gastos</h1>
                <p className="text-gray-600 mt-1">Gestiona y visualiza tus grupos para compartir gastos</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar grupo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                </div>

                <button
                  onClick={() => navigate('/creargrupo')}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Nuevo Grupo</span>
                </button>

                <button
                  onClick={() => setShowJoinModal(true)}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  <span>Unirse a Grupo</span>
                </button>
              </div>
            </div>

            {groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {/*{group.participantes.length} miembros*/}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-gray-800 mb-2">{group.nombre}</h2>

                      <p className="text-gray-600 mb-6 line-clamp-2">
                        {group.descripcion || "Grupo para compartir gastos"}
                      </p>

                      <button
                        onClick={() => navigate(`/${group.id}/gastos`, { state: { group } })}
                        className="w-full flex items-center justify-center gap-2 mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <span>Ver Gastos</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm">
                <Box className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes grupos todavía</h3>
                <p className="text-gray-600 mb-6 text-center max-w-md">
                  Crea tu primer grupo para empezar a compartir gastos con amigos, familia o compañeros.
                </p>
                <button
                  onClick={() => navigate('/creargrupo')}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Crear mi primer grupo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Unirse a un Grupo</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ID del Grupo"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleJoinGroup}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Unirse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupsPage;