import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import { useLocation } from "react-router-dom";

//Pagina principal donde se mostraran todos los gastos
/*
*TODO: Hacerlo entero
*/

function Gastos() {


  const location = useLocation();
  const grupo = location.state?.valor




  return (
    
      <div className="container">
        <h1>{grupo.nombre}</h1>
        <div className="navegar">
        <ul>
          <li>Gastos</li>
          <li>Balance</li>
        </ul>
        </div>
      </div>
    
  )
}

export default Gastos