import { useEffect, useState } from 'react';
import './App.css';
import CONFIG from './config/config';
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate
import {useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import spin from './assets/spinner.png';

function Gastos() {
  const [esgasto, setEsgasto] = useState(true);
  const [boton1, setBoton1] = useState("seleccionado");
  const [boton2, setBoton2] = useState("noseleccionado");
  const [balance, setBalance] = useState();
  const location = useLocation();
  const navigate = useNavigate(); // Inicializa navigate
  const [grupo, setGrupo] = useState({});
  const [loading,setLoading] = useState(true) //pongo esto a true para que funcione como temporizador en el useEffect
  let params = useParams();
  let id = params.grupoId;
  console.log("Grupo ID:", id);

  useEffect(() => {

    async function cargarDatos() {
      console.log("Cargando datos...");
      try {
        await Promise.all([cargarBalance(), cargarGrupo()]);
        console.log("Datos cargados correctamente");
      } catch (error) {
        console.log("Error al cargar los datos:", error);
      }
    }
    cargarDatos();
    setTimeout(() => {
      setLoading(false)
    },3000)

  }, []);

  async function cargarGrupo() {
    console.log("Ejecutando cargarGrupo()");
    try{
      //hace llamada a la api de /grupos
      const response = await fetch(`${CONFIG.api_grupos}`+`/${id}`)
      console.log(CONFIG.api_grupos)
      console.log(response)

      //si responde ok (200) me lo guardo en grupo

      if(response.status == 200){
        console.log("responde ok")
        console.log(response)
        const data = await response.json();
        setGrupo(data);
        console.log("grupo:")
        console.log(grupo)
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

  function volverAGrupoGastos() {
    navigate("/"); // Redirect to the main page
  }

  function _navegarAnadirGasto() {
    navigate(`/${id}/gastos/anadirgasto`,{ state: { grupoId: id } }); // Redirect to add gasto page
  }

  async function cargarBalance(){
    console.log("Ejecutando cargarBalance()");
    //Comprueba si coge mock o del servidor
      try{
        //hace llamada a la api de /grupos
        const response = await fetch(`${CONFIG.api_grupos}`+`/${id}/balances`)
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
  function _pasarPagina(valor) {
    navigate(`/${id}/gastos/${valor.id}`); // Redirect to gasto details
  }

  // Esto imprimiría y mostraría en balance el dinero debido a ti pero falta por hacer
  function _imprimebalance() {
    console.log(balance);
    
    return (
        Object.entries(balance).map(([usuario, deuda], index) => 
         (
            <button className="tarjetagastos" key={index}>
              <div className='filagastos'>
                <p className="importe">{usuario}</p>
                <p className={deuda > 0 ? "verde" : deuda === 0 ? "" : "rojo"}>{deuda}</p>
              </div>
            </button>
          )
        )
      
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
  }

  // Esto es para que salte cada vez que pulso uno de los botones
  useEffect(() => {
    console.log("Cambio detectado: esgasto ahora es", esgasto);
  }, [esgasto]);


  return (
    <div>
      {loading ? (
        <img className="spin" src={spin} alt="Cargando..." />
      ) : (
        <div className="container">
          <h1>{grupo.nombre}</h1>
          <button className="boton-volver" onClick={volverAGrupoGastos}>&lt; Volver</button>
          <div className="navegar">
            <ul>
              <button className={boton1} onClick={() => cambio()}>Gastos</button>
              <button className={boton2} onClick={() => cambio()}>Balance</button>
            </ul>
          </div>
          <div className="fila">
            <div id="conjuntoTarjeta">
              {esgasto ? (
                <>
                  <button className="boton-anadirgasto" onClick={_navegarAnadirGasto}>
                    Añadir Gasto
                  </button>
                  {_imprimegasto()}
                </>
              ) : (
                _imprimebalance()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gastos;