import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function InfoPerfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [logeado, setLogeado] = useState(true);

  useEffect(() => {
    // Obtener el usuario del localStorage
    if (logeado) {
    let usuario = localStorage.getItem('usuario');
    if (usuario == null) {
      // Si no hay usuario, crear uno de prueba o redirigir al login
      localStorage.setItem('usuario', JSON.stringify({ id: 4, nombre: "Julio", email: "usuario4@example.com" }));
      usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      usuario = JSON.parse(usuario);
    }
    setUser(usuario);
    } else {
      localStorage.removeItem('usuario');
      navigate('/');
    }
  }, [logeado]);

  return (
    <div className="grupo-gastos-container">
      <aside className="sidebar">
        <div className="user-icon">
          {user && user.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <p className="nombreuser">¡Bienvenido,  {user ? user.nombre : "Usuario"}!</p>
          <p className="emailuser">{user ? user.email : "email"}</p>
        </div>
        <button className="boton" onClick={() => navigate('/infoPerfil')}>Perfil</button>
        <button className="boton" onClick={() => navigate('/grupoGastos')}>Mis grupos</button>
        <button className="boton-roja" onClick={() => {setLogeado(false);}}>
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
            <button className="boton-cambiar">Cambiar Contraseña</button>
          </div>
        
      </main>
    </div>
  );
}

export default InfoPerfil;
