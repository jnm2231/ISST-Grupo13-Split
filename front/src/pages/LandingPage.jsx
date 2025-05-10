import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Receipt, CreditCard, PieChart, ArrowRight, Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Login form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register form states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    let usuario = localStorage.getItem('usuario');
    if (usuario) {
      usuario = JSON.parse(usuario);
      if (usuario.nombre) {
        navigate('/grupoGastos');
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/myApi/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ acceso: username, password: password }),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('Usuario no encontrado');
        if (response.status === 401) throw new Error('Contraseña incorrecta');
        const errorText = await response.text();
        throw new Error(`Error en la autenticación: ${errorText}`);
      }

      const userData = { nombre: username };
      localStorage.setItem('usuario', JSON.stringify(userData));
      setShowLogin(false);
      navigate('/grupoGastos');
    } catch (error) {
      console.error('Error durante el login:', error);
      alert(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const registerResponse = await fetch('http://localhost:8080/myApi/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (!registerResponse.ok) {
        if (registerResponse.status === 400) {
          const errorText = await registerResponse.text();
          throw new Error(`Error en el registro: ${errorText}`);
        } else {
          throw new Error(`Error ${registerResponse.status}: ${registerResponse.statusText}`);
        }
      }

      const loginResponse = await fetch('http://localhost:8080/myApi/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          acceso: registerEmail,
          password: registerPassword,
        }),
      });

      if (!loginResponse.ok) throw new Error('Error al iniciar sesión automáticamente');

      const userData = { nombre: registerName, email: registerEmail };
      localStorage.setItem('usuario', JSON.stringify(userData));

      alert('Usuario registrado correctamente. Iniciando sesión...');
      setShowRegister(false);
      navigate('/grupoGastos');
    } catch (error) {
      console.error('Error durante el registro:', error);
      alert(error.message);
    }
  };

  const handleGoogleSuccess = async (res) => {
    const idToken = res.credential;
    console.log('ID Token:', idToken);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleGoogleError = () => console.error('Error Google Login');

  const features = [
    { 
      icon: <Users className="h-8 w-8 text-blue-900" />,
      title: "Comparte con amigos",
      description: "Divide gastos fácilmente entre amigos, familia o compañeros."
    },
    { 
      icon: <Receipt className="h-8 w-8 text-blue-900" />,
      title: "Registro simple",
      description: "Añade gastos rápidamente y asígnalos a los miembros del grupo."
    },
    { 
      icon: <CreditCard className="h-8 w-8 text-blue-900" />,
      title: "Cálculo automático",
      description: "Cálculos de deudas y pagos automáticos y precisos."
    },
    { 
      icon: <PieChart className="h-8 w-8 text-blue-900" />,
      title: "Visualiza balances",
      description: "Gráficos claros para visualizar quién debe a quién."
    }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-500 p-8 md:p-12 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white max-w-lg mx-auto md:ml-0"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-8 w-8 text-yellow-300" />
            </motion.div>
            <span className="text-lg font-medium text-yellow-300">La forma más inteligente de compartir gastos</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Menos estrés al compartir gastos
          </h1>
          
          <p className="text-lg mb-8 text-blue-50">
            Lleva un registro de los gastos compartidos con tus amigos, 
            pareja, familia o compañeros de piso de manera simple y transparente.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="flex items-start space-x-3 mb-4"
              >
                <div className="flex-shrink-0 p-2 bg-white/90 rounded-lg shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Right Section */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Comienza ahora!</h2>
            <p className="text-gray-600">Regístrate o inicia sesión para empezar a compartir gastos</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setShowLogin(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <span>Iniciar Sesión</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => setShowRegister(true)}
              className="w-full py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Registrarse
            </button>
            
            <button
              onClick={() => navigate('/grupoGastos')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 mt-4"
            >
              Continuar sin cuenta
            </button>
          </div>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </motion.div>
      </div>
      
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar Sesión</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input 
                  type="text" 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input 
                  type="password"
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      {/* Registration Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrarse</h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input 
                  type="text" 
                  id="registerName"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  id="registerEmail"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input 
                  type="password"
                  id="registerPassword"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between mt-6 space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Registrarse
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;