import { useEffect, useState } from 'react';
import './App.css';
import {useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate
import spin from './assets/spinner.png'
import CONFIG from './config/config';

/**
 * 
 * TODO: Arreglar un poco la estetica y añadir los checks de que ha pagado y qeu se elimine cuando lo haga
 */

function InfoGasto() {
    const [loading,setLoading] = useState(true)
    const [participantes, setParticipantes] = useState();
    const location = useLocation();
    const navigate = useNavigate(); // Inicializa navigate
    const gasto = location.state?.valor;
    
    const idGasto = gasto.id;


    function sacaParticipacion(){
        return(participantes.map((participante,index) => (
            <button className="tarjetagastos" key={index}>
            <div className='filagastos'>
              <p className="importe">{participante.usuarioNombre}</p>
              <p >{participante.importe}</p>
            </div>
          </button>
            

            )
        ))
    }

    async function cargarParticipacion(){
        console.log("Ejecutando cargarBalance()");
        //Comprueba si coge mock o del servidor
          try{
            //hace llamada a la api de /grupos
            const response = await fetch(`${CONFIG.api_gastos}`+`/${idGasto}`)
            console.log(CONFIG.api_gastos)
            console.log(response)
    
            //si responde ok (200) me lo guardo en grupo
    
            if(response.status == 200){
              console.log("responde ok")
              console.log(response)
              const data = await response.json();
              setParticipantes(data);
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
          }finally{
            setLoading(false)
          }
          console.log("salgo del try")
      }

      useEffect(() => {
        cargarParticipacion()
      },[])


      return (
        <div className="container">
            {loading ? (
                <img className="spin" src={spin} alt="Cargando..." />
            ) : (
                <>
                    <div className="content">
                        <button className="boton-volver" onClick={() => navigate(-1)}>
                            &lt; Volver
                        </button>
                        <h1>Info Gasto</h1>
                        <p></p>
                    </div>
                    <div className="fila">     
                    <div id="conjuntoTarjeta">
                    {sacaParticipacion()}
                    </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default InfoGasto;
