import { useState,useEffect } from 'react'
import './App.css'
import GrupoGastos from './GrupoGastos'
import { Routes, Route } from 'react-router-dom';
import Header from './Header'
import InicioSesion from './InicioSesion';
import CONFIG from './config/config';
import ErrorPagina from './ErrorPagina';
import spin from './assets/spinner.png'
import Gastos from './Gastos'
import InfoGasto from './InfoGasto'
import CrearGrupo from './CrearGrupo'
import AnadirGasto from './AnadirGasto'
import InfoPerfil from './InfoPefil'; // Import the InfoPerfil component


function App() {
  const [grupo, setGrupo] = useState(); // Aquí guardo lo que saque del servidor o del mock según lo configure
  const [loading, setLoading] = useState(true); // Pongo esto a true para que funcione como temporizador en el useEffect
  
  /*-----------------Todo esto ya no va aquí, debe ir en el componente GrupoGastos.jsx-------------------*/
  /*
  // Obtener el usuario del localStorage y parsearlo
  let usuario = localStorage.getItem('usuario');
  if (usuario == null) {
    // Si no hay usuario, crear uno de prueba
    localStorage.setItem('usuario', JSON.stringify({ id: 4, nombre: "Julio", email: "usuario4@example.com" }));
    usuario = JSON.parse(localStorage.getItem('usuario')); // Parsear el JSON después de guardarlo
  } else {
    usuario = JSON.parse(usuario); // Parsear el JSON existente
  }

  console.log(usuario);
  console.log(usuario.id); // Ahora debería mostrar correctamente el ID del usuario

  // Función para cargar los datos
  //Los logs con App.cargar() vienen de esta funcion
  async function cargar() {
    console.log("App.cargar(): Ejecutando cargar()");

    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("App.cargar(): No se encontró un token en localStorage");
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

        console.log("App.cargar():" + CONFIG.api_grupos);
        console.log("App.cargar():" + response);

        if (response.status === 200) {
          console.log("App.cargar(): Respuesta OK");
          const data = await response.json();
          setGrupo(data);
        } else {
          console.log("App.cargar(): espuesta de red OK pero respuesta de HTTP no OK");
          const dataError = await response.json();
          console.log(`App.cargar(): Error: ${response.status} - ${dataError.error.message}`);
        }
      } catch (e) {
        console.log("App.cargar(): ERROR", e);
      }
    } else {
      setGrupo(mockgrupos.Grupos);
      console.log("App.cargar(): Modo mock activado");
    }
  }

  useEffect(() => {
    cargar();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
*/
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
  <div>
    <Header/>
    {loading ? <img className='spin' src={spin} alt="spinner"></img>
    : 
  //la ruta donde comienza es la que pone / y si la ruta no existe se va a la de *
  <Routes>
  <Route path="/" element={<InicioSesion />} />
  <Route path="/grupoGastos" element={<GrupoGastos />} />
  <Route path="/:grupoId/gastos" element={<Gastos />} />
  <Route path="/:grupoId/gastos/:gastoId" element={<InfoGasto />} />
  <Route path="/creargrupo" element={<CrearGrupo />} />
  <Route path="/:grupoId/gastos/anadirgasto" element={<AnadirGasto />} />
  <Route path="/infoPerfil" element={<InfoPerfil />} /> {/* Add this route */}
  <Route path="*" element={<ErrorPagina />} />
   </Routes>}
  </div>
  )
}

export default App;