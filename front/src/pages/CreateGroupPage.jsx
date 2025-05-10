import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, X, Users } from 'lucide-react';
import { motion } from 'framer-motion';

function CreateGroupPage() {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [newMember, setNewMember] = useState('');
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/myApi/usuarios');
        if (!response.ok) throw new Error('Error al obtener los usuarios');
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filteredSuggestions = allUsers.filter((user) =>
        user.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addMember = (user) => {
    if (!members.some((member) => member.email === user.email)) {
      setMembers([...members, user]);
    }
    setSearchTerm('');
    setSuggestions([]);
  };

  const removeMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert('El nombre del grupo no puede contener solo espacios');
      return;
    }

    if (members.length === 0) {
      alert('Debe haber al menos un participante en el grupo');
      return;
    }

    try {
      const requestBody = {
        nombre: groupName,
        usuarios: members.map((member) => ({
          nombre: member.nombre,
          apodo: member.apodo || member.nombre,
        })),
      };

      const response = await fetch('http://localhost:8080/myApi/grupos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Error al crear el grupo');

      alert('Grupo creado correctamente');
      navigate('/grupoGastos');
    } catch (error) {
      console.error('Error al crear el grupo:', error);
      alert('Error al intentar crear el grupo');
    }
  };

  return (
    <div className="pb-12 max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/grupoGastos')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span>Volver a Grupos</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Crear Nuevo Grupo</h1>
        </div>

        <form onSubmit={handleCreateGroup}>
          <div className="space-y-6">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Grupo*
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Viaje a Barcelona"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe el propósito de este grupo"
                rows={3}
              ></textarea>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Miembros del Grupo</h2>

              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar usuarios..."
                />
              </div>

              {suggestions.length > 0 && (
                <ul className="space-y-2 mb-4">
                  {suggestions.map((user) => (
                    <motion.li
                      key={user.email}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => addMember(user)}
                    >
                      <span className="text-gray-800">{user.nombre}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              <div className="space-y-2 mb-4">
                {members.length > 0 ? (
                  members.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800">{member.nombre}</span>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    Añade miembros a tu grupo para empezar a compartir gastos.
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/grupoGastos')}
                    className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!groupName || members.length === 0}
                    className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Crear Grupo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupPage;