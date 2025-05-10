import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, DollarSign, Calendar, User, Tag } from 'lucide-react';
import CONFIG from '../config/config';

function ExpenseDetailPage() {
  const { grupoId, gastoId } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenseDetails() {
      try {
        const response = await fetch(`${CONFIG.api_gastos}/${gastoId}`);
        if (!response.ok) throw new Error('Error al obtener los detalles del gasto');
        const data = await response.json();
        setExpense(data);
      } catch (error) {
        console.error('Error al cargar los detalles del gasto:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenseDetails();
  }, [gastoId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se pudo cargar la información del gasto.</p>
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(`/${grupoId}/gastos`)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span>Volver a Gastos</span>
      </button>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{expense.concepto}</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Cantidad</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(expense.importe)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="text-base text-gray-900">{expense.fecha}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Pagado por</p>
                  <p className="text-base text-gray-900">{expense.pagadopor}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Categoría</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {expense.categoria || 'Sin categoría'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">División del Gasto</h2>
            
            <div className="space-y-3">
              {expense.participantes.map((participant, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {participant.usuario.nombre.charAt(0)}
                        </span>
                      </div>
                      <span className="text-gray-800 font-medium">{participant.usuario.nombre}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(participant.importe)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetailPage;