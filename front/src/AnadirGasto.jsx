import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AnadirGasto() {
    const [concepto, setConcepto] = useState('');
    const [importe, setImporte] = useState('');
    const [pagadopor, setPagadopor] = useState('');
    const [participantes, setParticipantes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const grupoId = location.state?.grupoId;

    const subirGasto = (e) => {
        e.preventDefault();
        // Código para enviar los datos al backend
        console.log('Añadiendo gasto:', { concepto, importe, pagadopor, participantes, grupoId });

        // Después de añadir el gasto, navegar de vuelta a la lista de gastos
        navigate(-1);
    };

    const agregarParticipante = () => {
        if (busqueda && !participantes.includes(busqueda)) {
            setParticipantes([...participantes, busqueda]);
            setBusqueda('');
        }
    };

    const eliminarParticipante = (nombre) => {
        setParticipantes(participantes.filter((p) => p !== nombre));
    };

    return (
        <div className="container">
            <button type="button" className="boton-volver" onClick={() => navigate(-1)}>
                &lt; Volver
            </button>
            <h1>Añadir Nuevo Gasto</h1>
            <form onSubmit={subirGasto}>
                <div className="form-group">
                    <label className="form-titles" htmlFor="concepto">Concepto</label>
                    <input
                        type="text"
                        id="concepto"
                        value={concepto}
                        onChange={(e) => setConcepto(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-titles" htmlFor="importe">Importe</label>
                    <input
                        type="number"
                        id="importe"
                        value={importe}
                        onChange={(e) => setImporte(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-titles" htmlFor="pagadopor">Pagado Por</label>
                    <input
                        type="text"
                        id="pagadopor"
                        value={pagadopor}
                        onChange={(e) => setPagadopor(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-titles" htmlFor="busqueda">Buscar Participantes</label>
                    <input
                        type="text"
                        id="busqueda"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <button type="button" className="btn" onClick={agregarParticipante}>
                        Agregar Participante
                    </button>
                </div>
                <div className="form-group">
                    <label className="form-titles">Participantes Seleccionados</label>
                    <ul>
                        {participantes.map((nombre, index) => (
                            <li key={index}>
                                {nombre}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => eliminarParticipante(nombre)}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn">Añadir Gasto</button>
                </div>
            </form>
        </div>
    );
}

export default AnadirGasto;

