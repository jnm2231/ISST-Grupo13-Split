import { useNavigate } from 'react-router-dom';
import { LogOut, CreditCard, User } from 'lucide-react';
import { useEffect, useState } from 'react';

function ProfileSection({ isGuest = false }) {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    // Obtener el usuario del localStorage
    let usuario = localStorage.getItem('usuario');
    if (usuario == null) {
      // Si no hay usuario, crear uno de prueba o redirigir al login
      localStorage.setItem('usuario', JSON.stringify({ nombre: "Julio", email: "usuario4@example.com" }));
      usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      usuario = JSON.parse(usuario);
    }
    setUser(usuario);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-blue-600" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{user ? user.nombre : "Usuario"}</h2>
        <p className="text-gray-500">{user ? user.email : "email"}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/balance')}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          <span>Ver mis deudas</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {isGuest && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            Estás usando una cuenta de invitado. Los datos mostrados son de ejemplo.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProfileSection;