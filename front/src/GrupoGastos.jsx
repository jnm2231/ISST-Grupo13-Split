import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import logo from './assets/logo.png'

//Pagina principal donde se mostraran todos los grupos a los que el usuario pertenece
function GrupoGastos(props) {

  console.log(props)
  function _imprimeGrupos(){
    return props.mockgrupos.Grupos.map((grupo,index) =>(
      <button className="tarjetaGrupo">{grupo.Nombre}</button>
    ));
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
        {_imprimeGrupos()}
      </div>
      </div>
    </div>
    </>
  )
}

export default GrupoGastos