import { useState,useEffect } from 'react'
import './App.css'
import GrupoGastos from './GrupoGastos'
import { Routes, Route } from 'react-router-dom';
import Error from './Error'
import Header from './Header'
import { mockgrupos } from './constants/mockgrupos';
import CONFIG from './config/config';
import ErrorPagina from './ErrorPagina';

//Holahola
/*
TODO: poner un spinner u otra cosa mientras carga en lugar de repetir 2 veces el header
*/ 
function App() {

  const [grupo, setGrupo] = useState()
  const [loading,setLoading] = useState(true)

//Coge el fichero de config mira la direccion de la api y hace peticion 
  async function cargar(){
    console.log("Ejecutando cargar()");
    if(CONFIG.use_server == true){
      try{
        const response = await fetch(`${CONFIG.api_grupos}`)
        console.log(CONFIG.api_grupos)
        console.log(response)

        if(response.status == 200){
          console.log("responde ok")
          console.log(response)
          const data = await response.json();
          setGrupo(data);
        }
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
    else{
      setGrupo(mockgrupos)
      console.log("me meto en false")
    }
  }

  useEffect(() => {
    cargar()
    setTimeout(() => {
      setLoading(false)
    },3000)
  },[])


  return (
  <div>
    <Header/>
    {loading ? <Header/>
    
    : 
  
  <Routes>
    <Route path="/" element={<GrupoGastos mockgrupos = {grupo} />}/>
    <Route path="*" element={<ErrorPagina/>}/>
   </Routes>}
  </div>
  )
}

export default App