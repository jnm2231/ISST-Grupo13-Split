import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

function ErrorPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4">
      <div className="p-4 bg-blue-100 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-blue-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Página no encontrada</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Lo sentimos, la página que estás buscando no existe o no está disponible en este momento.
      </p>
      
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Home className="h-5 w-5" />
        <span>Volver al inicio</span>
      </button>
    </div>
  );
}

export default ErrorPage;