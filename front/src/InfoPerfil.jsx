import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import CONFIG from './config/config'
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function InfoPerfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [logeado, setLogeado] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Estado para controlar el modal
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');


  useEffect(() => {
    if(!logeado){
      localStorage.removeItem('usuario');
      navigate('/');
      return;
    }
    // Obtener el usuario del localStorage
    let usuario = localStorage.getItem('usuario');
    console.log(usuario);
    if (usuario == null) {
      // Si no hay usuario, crear uno de prueba o redirigir al login
      localStorage.setItem('usuario', JSON.stringify({ nombre: "Julio", email: "usuario4@example.com" }));
      usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      usuario = JSON.parse(usuario);
    }
    setUser(usuario);
  }, [logeado]);

  // Función para abrir el modal
  const abrirModalPassword = () => {
    setShowPasswordModal(true);
  };

  // Función para cerrar el modal
  const cerrarModalPassword = () => {
    setShowPasswordModal(false);
    setPassword('');
    setRepeatPassword('');
  };

  // Función para manejar el cambio de contraseña (sin lógica de backend por ahora)
  const handlePasswordChange = async () => {
    if (password !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      // Obtener el ID del usuario desde el estado o localStorage
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      console.log(usuario);
      const usuarioId = usuario?.nombre; // Suponiendo que el nombre es el ID único del usuario
      console.log(usuarioId);

      // Realizar la solicitud al backend
      const response = await fetch(CONFIG.api_base_url + `/usuarios/${usuarioId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevaPassword: password,
          repetirPassword: repeatPassword,
        }),
      });

      if (response.ok) {
        alert('Contraseña cambiada con éxito');
        cerrarModalPassword();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'No se pudo cambiar la contraseña'}`);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      alert('Ocurrió un error al intentar cambiar la contraseña');
    }
  };

  return (
    <div className="grupo-gastos-container">
      <aside className="sidebar">
        <div className="user-icon">
          {user?.nombre?.charAt(0).toUpperCase() || "U"}
        </div>
        <div>
          <p className="nombreuser">¡Bienvenido, {user ? user.nombre : "Usuario"}!</p>
          <p className="emailuser">{user ? user.email : "email"}</p>
        </div>
        <button className="boton" onClick={() => navigate('/infoPerfil')}>Perfil</button>
        <button className="boton" onClick={() => navigate('/grupoGastos')}>Mis grupos</button>
        <button className="boton-roja" onClick={() => setLogeado(false)}>
          <LogOut size={20} className="logout-icon" /> Cerrar sesión
        </button>
      </aside>
      <main className="main-content">
        <div className="content">
          <p className="peque">Perfil del usuario</p>
        </div>
          <div className="perfil-container">
            <div className="perfil-info">
              <p className="root"><strong>Nombre:</strong> {user ? user.nombre : "Usuario"}</p>
              <p className="root"><strong>Email:</strong> {user ? user.email : "email"}</p>
            </div>
            <button className="boton-cambiar" onClick={abrirModalPassword}>Cambiar Contraseña</button>
          </div>
        
      </main>

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={cerrarModalPassword}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cambiar Contraseña</h2>
            <form>
              <div className="form-group">
                <label htmlFor="password">Nueva Contraseña:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="repeatPassword">Repetir Contraseña:</label>
                <input
                  type="password"
                  id="repeatPassword"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                />
              </div>
              <button type="button" className="btn btn-primary" onClick={handlePasswordChange}>
                Cambiar Contraseña
              </button>
              <button type="button" className="btn btn-secondary" onClick={cerrarModalPassword}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoPerfil;
