import { useState,useEffect } from 'react'
import './App.css'
import GrupoGastos from './GrupoGastos'
import { Routes, Route } from 'react-router-dom';
import Header from './Header'
import { mockgrupos } from './constants/mockgrupos';
import CONFIG from './config/config';
import ErrorPagina from './ErrorPagina';
import spin from './assets/spinner.png'
import Gastos from './Gastos'


//Holahola
/*
* Decidme si el spinner puesto esta bien o queda demasiado raro
*/ 
function App() {

  const [grupo, setGrupo] = useState() //aqui guardare lo que saque del servidor o del mock segun lo configure
  const [loading,setLoading] = useState(true) //pongo esto a true para que funcione como temporizador en el useEffect

//Coge el fichero de config mira la direccion de la api y hace peticion fetch
  async function cargar(){
    console.log("Ejecutando cargar()");
    //Comprueba si coge mock o del servidor
    if(CONFIG.use_server == true){
      try{
        //hace llamada a la api de /grupos
        const response = await fetch(`${CONFIG.api_grupos}`)
        console.log(CONFIG.api_grupos)
        console.log(response)

        //si responde ok (200) me lo guardo en grupo

        if(response.status == 200){
          console.log("responde ok")
          console.log(response)
          const data = await response.json();
          setGrupo(data);
        }
        //si falla hago un log y mando que error hubo de http
        else{
          console.log("respuesta de red ok pero respuesta de HTTP no ok")
          console.log(response)
          const dataError = await response.json();
          console.log(`Error: ${response.status} - ${dataError.error.message}`);
          
        }

      }
      catch(e){
        console.log("ERROR",e)
      }
      console.log("salgo del try")


    }
    //si esta en modo mock cogo el mock y lo meto en grupo
    else{
      setGrupo(mockgrupos.Grupos)
      console.log("me meto en false")
    }
  }

  //Hace que nada mas empezar empieze a cargar, cuando pasa 3 segundos paro de esperar de cargar y saca la pagina inicial
  useEffect(() => {
    cargar()
    setTimeout(() => {
      setLoading(false)
    },3000)
  },[])


  return (
  <div>
    <Header/>
    {loading ? <img className='spin' src={spin} alt="spinner"></img>
    : 
  //la ruta donde comienza es la que pone / y si la ruta no existe se va a la de *
  <Routes>
    <Route path="/" element={<GrupoGastos mockgrupos = {grupo} />}/>
    <Route path="/gastos" element={<Gastos />} />
    <Route path="*" element={<ErrorPagina/>}/>
   </Routes>}
  </div>
  )
}

export default App