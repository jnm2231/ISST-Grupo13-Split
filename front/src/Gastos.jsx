import { useEffect, useState } from 'react';
import './App.css';
import CONFIG from './config/config';
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate

function Gastos() {
  const [esgasto, setEsgasto] = useState(true);
  const [boton1, setBoton1] = useState("seleccionado");
  const [boton2, setBoton2] = useState("noseleccionado");
  const location = useLocation();
  const navigate = useNavigate(); // Inicializa navigate
  const grupo = location.state?.valor;

  function volverAGrupoGastos() {
    navigate("/grupogastos"); // Redirige a la ruta de GrupoGastos
  }

  // Imprime las tarjetas pasando por el array de gastos dentro de grupo (esto solo se ve en gasto)
  function _imprimegasto() {
    return (
      grupo.gastos.map((gasto, index) => (
        <button className="tarjetagastos" value={gasto} key={index}>
          {gasto.concepto}
          <div className='filagastos'>
            <p className="pagado">Pagado por: {gasto.pagadopor}</p>
            <p className="importe">{gasto.importe}</p>
          </div>
        </button>
      ))
    );
  }

  // Esto imprimiría y mostraría en balance el dinero debido a ti pero falta por hacer
  function _imprimebalance() {
    return (
      grupo.gastos.map((gasto, index) => (
        <div key={index}>estoy en balance</div>
      ))
    );
  }

  // Esto es lo que se ejecuta cuando aprietas el botón de balance y gasto y sirve para que cambie de página
  function cambio() {
    console.log(esgasto);
    // Esta parte es para cambiar el css de los botones
    let boton1e = boton1;
    let boton2e = boton2;
    setBoton1(boton2e);
    setBoton2(boton1e);
    // Esto es para cambiar de gasto a balance o viceversa
    setEsgasto(!esgasto);
    console.log(esgasto);
  }

  // Esto es para que salte cada vez que pulso uno de los botones
  useEffect(() => {
    console.log("Cambio detectado: esgasto ahora es", esgasto);
  }, [esgasto]);

  return (
    <div className="container">
      <h1>{grupo.nombre}</h1>
      <button onClick={volverAGrupoGastos}>Volver</button> {/* Botón Volver */}
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
  );
}

export default Gastos;