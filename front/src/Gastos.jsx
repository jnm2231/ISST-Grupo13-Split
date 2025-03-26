import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import { useLocation } from "react-router-dom";

//Pagina principal donde se mostraran todos los gastos


function Gastos() {

  const [esgasto, setEsgasto] = useState(true) //indica si estoy en gasto o en balance (true si estoy en gasto y false si estoy en balance)
  const [boton1, setBoton1] = useState("seleccionado") //esto es para el ccs para que marque el boton de donde estoy en negrita
  const [boton2, setBoton2] = useState("noseleccionado") //esto es para el ccs para que deje el otro boton en formato normal

  //el use location es para coger los datos que viene del link navigation de grupogastos
  const location = useLocation();
  const grupo = location.state?.valor //me guardo lo que hubiese en el link navigation en grupo

  //imprime las tarjetas pasando por el array de gastos dentro de grupo (esto solo se ve en gasto)
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
//esto imprimiria y mostraria en balance el dinero debido a ti pero falta por hacer
function _imprimebalance(){
  return(
    grupo.gastos.map((gasto,index) =>(

<div>estoy en balance</div>

    ))
  )
}

//esto es lo que se ejecuta cuando aprietas el boton de balance y gasto y sirve para que cambie de pagina
function cambio(){
  console.log(esgasto)
  //esta parte es para cambiar el css de los botnes
  let boton1e = boton1
  let boton2e = boton2
  setBoton1(boton2e)
  setBoton2(boton1e)
  //esto es para cambiar de gasto a balance o viceversa
  setEsgasto(!esgasto)
  console.log(esgasto)

}

//esto es para que salte  cada vez que pulso uno de los botones
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