import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, ChevronLeft, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import CONFIG from '../config/config';

function ExpensesPage() {
  const { grupoId } = useParams();
  const navigate = useNavigate();

  const [grupo, setGrupo] = useState({});
  const [balance, setBalance] = useState({});
  const [loading, setLoading] = useState(true);
  const [isExpensesView, setIsExpensesView] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [pagadas, setPagadas] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        await Promise.all([loadBalance(), loadGroup()]);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [grupoId]);

  async function loadGroup() {
    try {
      const response = await fetch(`${CONFIG.api_grupos}/${grupoId}`);
      if (response.status === 200) {
        const data = await response.json();
        setGrupo(data);
      } else {
        const dataError = await response.json();
        console.error(`Error: ${response.status} - ${dataError.error?.message}`);
      }
    } catch (error) {
      console.error("Error al cargar el grupo:", error);
    }
  }

  async function loadBalance() {
    try {
      const response = await fetch(`${CONFIG.api_grupos}/${grupoId}/balances`);
      if (response.status === 200) {
        const data = await response.json();
        setBalance(data);
      } else {
        const dataError = await response.json();
        console.error(`Error: ${response.status} - ${dataError.error?.message}`);
      }
    } catch (error) {
      console.error("Error al cargar el balance:", error);
    }
  }

  const handleDebtClick = (usuario) => {
    fetch(`${CONFIG.api_grupos}/${grupoId}/deudas`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener las deudas");
        return response.json();
      })
      .then((deudas) => {
        const deudasUsuario = deudas[usuario] || {};
        setSelectedDebt({ usuario, deudas: deudasUsuario });
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error al obtener las deudas detalladas:", error);
      });
  };

  const handleCheckboxChange = (acreedor) => {
    const cantidad = selectedDebt.deudas[acreedor];
    const nuevoGasto = {
      concepto: `Deuda pagada por ${selectedDebt.usuario} a ${acreedor}`,
      pagadopor: selectedDebt.usuario,
      importe: cantidad,
      participantes: [{ usuarioNombre: acreedor, importeUsuario: cantidad }],
    };

    fetch(`${CONFIG.api_grupos}/${grupoId}/gastos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoGasto),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al crear el gasto');
        setBalance((prevBalance) => ({
          ...prevBalance,
          [selectedDebt.usuario]: prevBalance[selectedDebt.usuario] + cantidad,
          [acreedor]: prevBalance[acreedor] - cantidad,
        }));
        setSelectedDebt((prevSelectedDebt) => {
          const updatedDeudas = { ...prevSelectedDebt.deudas };
          delete updatedDeudas[acreedor];
          return { ...prevSelectedDebt, deudas: updatedDeudas };
        });
      })
      .catch((error) => {
        console.error('Error al crear el gasto:', error);
      });

    setPagadas((prev) => ({
      ...prev,
      [acreedor]: !prev[acreedor],
    }));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDebt(null);
  };

  const handleExpenseClick = (gasto) => {
    navigate(`/${grupoId}/gastos/${gasto.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <button
        onClick={() => navigate('/grupoGastos')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span>Volver a Grupos</span>
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{grupo.nombre}</h1>
          <p className="text-gray-600 mt-1">Gestiona los gastos compartidos de este grupo</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsExpensesView(true)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isExpensesView 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setIsExpensesView(false)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !isExpensesView 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Balance
            </button>
          </div>

          {isExpensesView && (
            <button
              onClick={() => navigate(`/${grupoId}/gastos/anadirgasto`)}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Añadir Gasto</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {isExpensesView ? (
          grupo.gastos?.length > 0 ? (
            grupo.gastos.map((gasto, index) => (
              <motion.div
                key={gasto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleExpenseClick(gasto)}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{gasto.concepto}</h3>
                      <p className="text-sm text-gray-500">Pagado por: {gasto.pagadopor}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{gasto.importe.toFixed(2)} €</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <DollarSign className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay gastos registrados</h3>
              <p className="text-gray-500 mb-6">Añade tu primer gasto para empezar a llevar el control</p>
              <button
                onClick={() => navigate(`/${grupoId}/gastos/anadirgasto`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Añadir Gasto</span>
              </button>
            </div>
          )
        ) : (
          Object.entries(balance).map(([usuario, deuda], index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-4"
              onClick={() => deuda < 0 && handleDebtClick(usuario)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Wallet className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{usuario}</span>
                </div>
                <span className={`font-semibold ${
                  deuda > 0 
                    ? 'text-green-600' 
                    : deuda < 0 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {deuda.toFixed(2)} €
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {showModal && selectedDebt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Deudas de {selectedDebt.usuario}</h2>
            {Object.entries(selectedDebt.deudas).map(([acreedor, cantidad], index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span>{acreedor}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{cantidad.toFixed(2)} €</span>
                  <input
                    type="checkbox"
                    checked={!!pagadas[acreedor]}
                    onChange={() => handleCheckboxChange(acreedor)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesPage;