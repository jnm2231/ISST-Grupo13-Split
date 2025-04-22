import { useState,useEffect } from 'react'
import './App.css'
import GrupoGastos from './GrupoGastos'
import { Routes, Route } from 'react-router-dom';
import Header from './Header'
import InicioSesion from './InicioSesion';
import { mockgrupos } from './constants/mockgrupos';
import CONFIG from './config/config';
import ErrorPagina from './ErrorPagina';
import spin from './assets/spinner.png'
import Gastos from './Gastos'
import InfoGasto from './InfoGasto'
import CrearGrupo from './CrearGrupo'
import AnadirGasto from './AnadirGasto'


//Holahola
/*
* Decidme si el spinner puesto esta bien o queda demasiado raro
*/ 
function App() {
  const [grupo, setGrupo] = useState(); // Aquí guardo lo que saque del servidor o del mock según lo configure
  const [loading, setLoading] = useState(true); // Pongo esto a true para que funcione como temporizador en el useEffect

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
  async function cargar() {
    console.log("Ejecutando cargar()");

    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No se encontró un token en localStorage");
      return;
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

        console.log(CONFIG.api_grupos);
        console.log(response);

        if (response.status === 200) {
          console.log("Respuesta OK");
          const data = await response.json();
          setGrupo(data);
        } else {
          console.log("Respuesta de red OK pero respuesta de HTTP no OK");
          const dataError = await response.json();
          console.log(`Error: ${response.status} - ${dataError.error.message}`);
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    } else {
      setGrupo(mockgrupos.Grupos);
      console.log("Modo mock activado");
    }
  }

  useEffect(() => {
    cargar();
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
    <Route path="/" element={<InicioSesion/>} />{/*Comentar esta linea y descomentar linea de abajo para voler a ver la vista de todos los grupos creados como antes*/}
    <Route path="/grupoGastos" element={<GrupoGastos mockgrupos={grupo} />} />
    <Route path="/:grupoId/gastos" element={<Gastos />} />
    {/* <Route path="/:grupoId/balance" element={<Gastos />} />/* esto es para el balance */}
    <Route path="/:grupoId/gastos/:gastoId" element={<InfoGasto />} />
    <Route path="/creargrupo" element={<CrearGrupo />} />
    <Route path="/:grupoId/gastos/anadirgasto" element={<AnadirGasto />} />
    <Route path="*" element={<ErrorPagina />} />
   </Routes>}
  </div>
  )
}

export default App;