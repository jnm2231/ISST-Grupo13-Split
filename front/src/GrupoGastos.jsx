import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import logo from './assets/logo.png'

//Pagina principal donde se mostraran todos los grupos a los que el usuario pertenece
function GrupoGastos(props) {

  function _imprimeGrupos(){
    
  }

  return (
    <>
      <div className="container">
      <div className="content">
        <button className="boton">Unirse a un Grupo</button>
        <h1>Bienvenido</h1>

        <button className="boton">Crear Grupo</button>
      </div>
      <div className="fila">     
      <div id="conjuntoTarjeta">
        
        <button className="tarjetaGrupo">Viaje a Italia</button>
        <button className="tarjetaGrupo">Viaje a Francia</button>

      </div>
      </div>
    </div>
    </>
  )
}

export default GrupoGastos