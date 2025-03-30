import { useEffect, useState } from 'react';
import './App.css';
import CONFIG from './config/config';
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate

function Gastos() {
  const [esgasto, setEsgasto] = useState(true);
  const [boton1, setBoton1] = useState("seleccionado");
  const [boton2, setBoton2] = useState("noseleccionado");
  const [balance, setBalance] = useState();
  const location = useLocation();
  const navigate = useNavigate(); // Inicializa navigate
  const grupo = location.state?.valor;
  const idGrupo = grupo.id;

  function volverAGrupoGastos() {
    navigate("/"); // Redirige a la ruta de GrupoGastos
  }
  async function cargarBalance(){
    console.log("Ejecutando cargarBalance()");
    //Comprueba si coge mock o del servidor
      try{
        //hace llamada a la api de /grupos
        const response = await fetch(`${CONFIG.api_grupos}`+`/${idGrupo}/balances`)
        console.log(CONFIG.api_grupos)
        console.log(response)

        //si responde ok (200) me lo guardo en grupo

        if(response.status == 200){
          console.log("responde ok")
          console.log(response)
          const data = await response.json();
          setBalance(data);
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

  // Imprime las tarjetas pasando por el array de gastos dentro de grupo (esto solo se ve en gasto)
  function _imprimegasto() {
    return (
      grupo.gastos.map((gasto, index) => (
        <button className="tarjetagastos" onClick={() => _pasarPagina(gasto)} value={gasto} key={index}>
          {gasto.concepto}
          <div className='filagastos'>
            <p className="pagado">Pagado por: {gasto.pagadopor}</p>
            <p className="importe">{gasto.importe}</p>
          </div>
        </button>
      ))
    );
  }
  //navega y pasa a la pagina gastos los datos que se le meten
  function _pasarPagina(valor){
    navigate(`/infogasto`, { state: { valor } });
  }

  // Esto imprimiría y mostraría en balance el dinero debido a ti pero falta por hacer
  function _imprimebalance() {
    console.log(balance);
    
    return (
      <>
        {Object.entries(balance).map(([usuario, deuda], index) => 
          deuda === 0 ? null : (
            <button className="tarjetagastos" key={index}>
              <div className='filagastos'>
                <p className="importe">{usuario}</p>
                <p className={deuda > 0 ? "verde" : "rojo"}>{deuda}</p>
              </div>
            </button>
          )
        )}
      </>
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

  useEffect(() => {
    cargarBalance();
    console.log("Cargando balance");
  }, []);


  return (
    <div className="container">
      <h1>{grupo.nombre}</h1>
      <button className="boton-volver" onClick={volverAGrupoGastos}>&lt; Volver</button> {/* Botón Volver */}
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