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

function _imprimegasto(){
  return(
    grupo.gastos.map((gasto,index) =>(

      <button className="tarjetagastos" value={gasto}>
        {gasto.concepto}
        <div className='filagastos'>
        <p className="pagado">Pagado por: {gasto.pagadopor}</p>
        <p className="importe">{gasto.importe}</p>
        </div>
        </button>

    ))
  )
}


  return (
    
      <div className="container">
        <h1>{grupo.nombre}</h1>
        <div className="navegar">
        <ul>
          <li className='seleccionado'>Gastos</li>
          <li>Balance</li>
        </ul>
        </div>
        <div className="fila">     
        <div id="conjuntoTarjeta">
        {_imprimegasto()}
        </div>
        </div>
      </div>
    
  )
}

export default Gastos