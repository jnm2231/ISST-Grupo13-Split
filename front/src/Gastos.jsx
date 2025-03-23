import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import { useLocation } from "react-router-dom";

//Pagina principal donde se mostraran todos los gastos
/*
*TODO: Hacerlo entero
*/

function Gastos() {

  const [esgasto, setEsgasto] = useState(true)
  const [boton1, setBoton1] = useState("seleccionado")
  const [boton2, setBoton2] = useState("noseleccionado")

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
function _imprimebalance(){
  return(
    grupo.gastos.map((gasto,index) =>(

<div>estoy en balance</div>

    ))
  )
}

function cambio(){
  console.log(esgasto)
  let boton1e = boton1
  let boton2e = boton2
  setBoton1(boton2e)
  setBoton2(boton1e)
  setEsgasto(!esgasto)
  console.log(esgasto)

}

useEffect(() => {
  console.log("Cambio detectado: esgasto ahora es", esgasto);
}, [esgasto]);

  return (
    
      <div className="container">
        <h1>{grupo.nombre}</h1>
        <div className="navegar">
        <ul>
          <button className={boton1} onClick={() => cambio()}>Gastos</button>
          <button className={boton2} onClick={() => cambio()}>Balance</button>
        </ul>
        </div>
        <div className="fila">     
        <div id="conjuntoTarjeta">
        {esgasto ? _imprimegasto() : _imprimebalance()}
        
        </div>
        </div>
      </div>
    
  )
}

export default Gastos