import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import Gastos from './Gastos'
import { mockgrupos } from './constants/mockgrupos';
import { useNavigate} from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Import the logout icon
//Pagina principal donde se mostraran todos los grupos a los que el usuario pertenece

function GrupoGastos() {

  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userId = params.get('b');

  const [grupos, setGrupos] = useState([]) //aqui guardo los grupos que me devuelve el servidor o el mock
  const [user, setUser] = useState() //aqui guardo el usuario que me devuelve el servidor o el mock
  const [searchTerm, setSearchTerm] = useState('');
  const [logeado, setLogeado] = useState(true);

  //Lo que antes estaba en App.jsx
  useEffect(() => {
    if(!logeado){
      localStorage.removeItem('usuario');
      navigate('/');
      return;
    }
    cargarUsuario(); // Cargar el usuario al montar el componente
    cargar();
  }, [logeado]); // Array vacío para que solo se ejecute una vez al montar el componente


  // Función para cargar los datos
  async function cargarUsuario() {
    // Obtener usuario del backend
    console.log(localStorage.getItem('usuario'));
    if(token){
      if (CONFIG.use_server === true) {
        try {
          const response = await fetch(`${CONFIG.api_base_url}/me?userId=${userId}`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`, // Incluir el token en el encabezado
              "Content-Type": "application/json",
            },
            credentials: "include", // Incluir credenciales (opcional)
          });
          if (response.status === 200) {
            const data = await response.text();
            localStorage.setItem('usuario', JSON.stringify({ nombre: userId, email: data })); // Guardar el usuario en localStorage
            setUser({ nombre: userId, email: data }); // Guardar el usuario en el estado
            if (token) {
              localStorage.setItem('token', token);
              console.log(token);
              // redirigir o hacer algo más
            }
          } else {
            console.log("GrupoGastos.cargarUsuario(): espuesta de red OK pero respuesta de HTTP no OK");
            const dataError = await response.json();
            console.log(`GrupoGastos.cargarUsuario(): Error: ${response.status} - ${dataError.error.message}`);
          }
        } catch (e) {
          console.log("GrupoGastos.cargarUsuario(): ERROR", e);
        }
      }
    } else {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      setUser(usuario); // Guardar el usuario en el estado
    }
  }
  //Los logs con GrupoGastos.cargar() vienen de esta funcion
  async function cargar() {
    console.log("GrupoGastos.cargar(): Ejecutando cargar()");

    // Obtener el token del localStorage


    if (CONFIG.use_server === true) {
      try {
        // Hacer llamada a la API de /grupos con el token en el encabezado Authorization
        const response = await fetch(`${CONFIG.api_grupos}`, {
          method: "GET",
          credentials: "include", // Incluir credenciales (opcional)
        });

        console.log("GrupoGastos.cargar():" + CONFIG.api_grupos);
        console.log("GrupoGastos.cargar():" + response);

        if (response.status === 200) {
          console.log("GrupoGastos.cargar(): Respuesta OK");
          const data = await response.json();
          setGrupos(data);
        } else {
          console.log("GrupoGastos.cargar(): Respuesta de red OK pero respuesta de HTTP no OK");
          const dataError = await response.json();
          console.log(`GrupoGastos.cargar(): Error: ${response.status} - ${dataError.error.message}`);
        }
      } catch (e) {
        console.log("GrupoGastos.cargar(): ERROR", e);
      }
    } else {
      setGrupos(mockgrupos.Grupos);
      console.log("GrupoGastos.cargar(): Modo mock activado");
    }
  }

  //Imprime las tarjetas
  function _imprimeGrupos() {
    return grupos
      .filter((grupo) => grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((grupo, index) => (
        <button className="tarjetaGrupo" onClick={() => _pasarPagina(grupo)} value={grupo} key={index}>
          {grupo.nombre}
        </button>
      ));
  }

  //navega y pasa a la pagina gastos los datos que se le meten
  function _pasarPagina(valor){
    navigate(`/${valor.id}`+`/gastos`, { state: { valor } });
  }

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
        <button className="boton-roja" onClick={() => setLogeado(false)}>
          <LogOut size={20} className="logout-icon" />   Cerrar sesión
        </button>
      </aside>
      <main className="main-content">
        <div className="top-bar">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar grupos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="action-buttons">
            <button className="boton" onClick={() => navigate('/creargrupo')}>Crear Grupo</button>
            <button className="boton-unirse">Unirse a un Grupo</button>
          </div>
        </div>
        <div className="grupo-tarjetas">
          {_imprimeGrupos()}
        </div>
      </main>
    </div>
  );
}

export default GrupoGastos;