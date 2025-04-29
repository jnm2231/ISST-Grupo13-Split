import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import Gastos from './Gastos'
import { mockgrupos } from './constants/mockgrupos';
import { useNavigate} from 'react-router-dom';
//Pagina principal donde se mostraran todos los grupos a los que el usuario pertenece

function GrupoGastos() {

  const navigate = useNavigate();

  const [grupos, setGrupos] = useState([]) //aqui guardo los grupos que me devuelve el servidor o el mock
  const [user, setUser] = useState() //aqui guardo el usuario que me devuelve el servidor o el mock
  const [searchTerm, setSearchTerm] = useState('');

  //Lo que antes estaba en App.jsx
  useEffect(() => {
    // Obtener el usuario del localStorage
    let usuario = localStorage.getItem('usuario');
    if (usuario == null) {
      // Si no hay usuario, crear uno de prueba o redirigir al login
      localStorage.setItem('usuario', JSON.stringify({ id: 4, nombre: "Julio", email: "usuario4@example.com" }));
      usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      usuario = JSON.parse(usuario);
      console.log("GrupoGastos.jsx: Usuario existente:", usuario);
    }
    
    // Actualizar el estado del usuario
    setUser(usuario);
    console.log("Usuario:", usuario);
    console.log(usuario.id);
    
    // Cargar los grupos
    cargar();
  }, []); // Array vacío para que solo se ejecute una vez al montar el componente


  // Función para cargar los datos
  //Los logs con GrupoGastos.cargar() vienen de esta funcion
  async function cargar() {
    console.log("GrupoGastos.cargar(): Ejecutando cargar()");

    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("GrupoGastos.cargar(): No se encontró un token en localStorage");
      //return; Este return estaba cerrando la función cargar antes de tiempo y no se llegaba a cargar el mockgrupos
    }

    if (CONFIG.use_server === true) {
      try {
        // Hacer llamada a la API de /grupos con el token en el encabezado Authorization
        const response = await fetch(`${CONFIG.api_grupos}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Incluir el token en el encabezado
            "Content-Type": "application/json",
          },
          credentials: "include", // Incluir credenciales (opcional)
        });

        console.log("GrupoGastos.cargar():" + CONFIG.api_grupos);
        console.log("GrupoGastos.cargar():" + response);

        if (response.status === 200) {
          console.log("GrupoGastos.cargar(): Respuesta OK");
          const data = await response.json();
          setGrupos(data);
        } else {
          console.log("GrupoGastos.cargar(): espuesta de red OK pero respuesta de HTTP no OK");
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
        <p className="nombreuser">Welcome {user ? user.nombre : "Usuario"}!</p>
        <button className="boton">Perfil</button>
        <button className="boton-rojo" onClick={() => navigate('/')}>Cerrar sesión</button>

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