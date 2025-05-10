import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Calendar, DollarSign, Users } from 'lucide-react';
import CONFIG from '../config/config';

function AddExpensePage() {
  const navigate = useNavigate();
  const { grupoId } = useParams();

  const [description, setDescription] = useState('');
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState([]);
  const [groupUsers, setGroupUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPayerModal, setShowPayerModal] = useState(false);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await fetch(`${CONFIG.api_grupos}/${grupoId}/usuarios`);
        if (!response.ok) throw new Error('Error al obtener los usuarios del grupo');
        const data = await response.json();
        setGroupUsers(data);
      } catch (error) {
        console.error('Error al obtener los usuarios del grupo:', error);
      }
    };
    fetchGroupUsers();
  }, [grupoId]);

  const toggleParticipant = (user) => {
    if (participants.includes(user)) {
      setParticipants(participants.filter((participant) => participant !== user));
    } else {
      setParticipants([...participants, user]);
    }
  };

  const selectPayer = (user) => {
    setPayer(user);
    setShowPayerModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('El nombre del gasto no puede contener solo espacios');
      return;
    }
    if (participants.length === 0) {
      alert('Debe haber al menos un participante en el gasto');
      return;
    }
    if (parseFloat(amount) <= 0 || parseFloat(amount) === 0) {
      alert('Debe introducir un número válido en el campo de Importe');
      return;
    }
    try {
      const requestBody = {
        concepto: description,
        pagadopor: payer,
        importe: parseFloat(amount),
        participantes: participants.map((participant) => ({
          usuarioNombre: participant,
          importeUsuario: parseFloat(amount) / participants.length,
        })),
      };
      const response = await fetch(`${CONFIG.api_grupos}/${grupoId}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) throw new Error('Error al crear el gasto');
      alert('Gasto creado correctamente');
      navigate(`/${grupoId}/gastos`);
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de red al intentar crear el gasto');
    }
  };

  return (
    <div className="pb-12 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span>Volver a Gastos</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Añadir Nuevo Gasto</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción*
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="¿En qué se gastó el dinero?"
                required
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="payer" className="block text-sm font-medium text-gray-700 mb-1">
                ¿Quién pagó?*
              </label>
              <button
                type="button"
                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => setShowPayerModal(true)}
              >
                {payer ? `Pagado por: ${payer}` : 'Seleccionar quién pagó'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participantes*
              </label>
              <button
                type="button"
                className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                onClick={() => setShowModal(true)}
              >
                Seleccionar Participantes
              </button>
              {participants.length > 0 && (
                <ul className="mt-2">
                  {participants.map((participant) => (
                    <li key={participant} className="text-gray-700">{participant}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Guardar Gasto
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal for participants */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Seleccionar Participantes</h2>
            {groupUsers.length > 0 ? (
              <ul>
                {groupUsers.map((user) => (
                  <li key={user.email}>
                    <label>
                      <input
                        type="checkbox"
                        checked={participants.includes(user)}
                        onChange={() => toggleParticipant(user)}
                      />
                      {user}
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aún no hay miembros en el grupo.</p>
            )}
            <button onClick={() => setShowModal(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* Modal for payer */}
      {showPayerModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Seleccionar quién pagó</h2>
            {groupUsers.length > 0 ? (
              <ul>
                {groupUsers.map((user) => (
                  <li key={user.email}>
                    <button onClick={() => selectPayer(user)}>{user}</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aún no hay miembros en el grupo.</p>
            )}
            <button onClick={() => setShowPayerModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddExpensePage;