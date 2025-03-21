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
    
      <div className="container">gastos del grupo {grupo.nombre} con id {grupo.id}</div>
    
  )
}

export default Gastos