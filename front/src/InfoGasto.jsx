import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import './App.css';
import spin from './assets/spinner.png';
import CONFIG from './config/config';

/**
 * 
 * TODO: Arreglar un poco la estetica y añadir los checks de que ha pagado y qeu se elimine cuando lo haga
 */

function InfoGasto() {
    const { grupoId, gastoId } = useParams(); // Extract grupoId and gastoId
    const [loading, setLoading] = useState(true);
    const [participantes, setParticipantes] = useState();
    const navigate = useNavigate();

    function sacaParticipacion() {
        return (participantes.map((participante, index) => (
            <button className="tarjetagastos" key={index}>
                <div className='filagastos'>
                    <p className="importe">{participante.usuario.nombre}</p>
                    <p>{participante.importe.toFixed(2)}</p>
                </div>
            </button>
        )));
    }

    async function cargarParticipacion() {
        console.log("Ejecutando cargarBalance()");
        try {
            const response = await fetch(`${CONFIG.api_gastos}/${gastoId}`);
            console.log(CONFIG.api_gastos);
            console.log(response);

            if (response.status == 200) {
                console.log("responde ok");
                console.log(response);
                const data = await response.json();
                setParticipantes(data);
            } else {
                console.log("respuesta de red ok pero respuesta de HTTP no ok");
                console.log(response);
                const dataError = await response.json();
                console.log(`Error: ${response.status} - ${dataError.error.message}`);
            }
        } catch (e) {
            console.log("ERROR", e);
        } finally {
            setLoading(false);
        }
        console.log("salgo del try");
    }

    useEffect(() => {
        cargarParticipacion();
    }, [gastoId]);

    return (
        <div>
            {loading ? (
                <img className="spin" src={spin} alt="Cargando..." />
            ) : (
                <div className='container'>
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
                </div>
            )}
        </div>
    );
}

export default InfoGasto;
