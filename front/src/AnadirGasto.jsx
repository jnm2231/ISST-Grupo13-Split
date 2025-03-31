import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function AnadirGasto() {
    const [concepto, setConcepto] = useState('');
    const [importe, setImporte] = useState('');
    const [pagadopor, setPagadopor] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const grupoId = location.state?.grupoId;

    const subirGasto = (e) => {
        e.preventDefault();
        // Código para enviar los datos al backend
        console.log('Añadiendo gasto:', { concepto, importe, pagadopor, grupoId });

        // Después de añadir el gasto, navegar de vuelta a la lista de gastos
        navigate(-1);
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
                <div className="form-buttons">
                    <button type="submit" className="btn">Añadir Gasto</button>
                </div>
            </form>
        </div>
    );
}

export default AnadirGasto;

