import { useEffect, useState } from 'react';
import './App.css';
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate


function InfoGasto() {
    const location = useLocation();
    const navigate = useNavigate(); // Inicializa navigate

    function volverAGastos() {
        navigate("/gastos"); // Redirige a la ruta de GrupoGastos
      }
    return (
        <div className="container">
            <div className="content">
                
                <button className="boton-volver" onClick={volverAGastos}>&lt; Volver</button>
                <h1>Info Gasto</h1>
                </div>
        </div>
    );
}

export default InfoGasto;
