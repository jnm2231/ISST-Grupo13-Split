import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CONFIG from './config/config';

function AnadirGasto() {
    const [gastoName, setGastoName] = useState('');
    const [PagadoPor, setPagadoPor] = useState('');
    const [ImporteGasto, setImporteGasto] = useState('');
    const [participants, setParticipants] = useState([]);
    const [groupUsers, setGroupUsers] = useState([]);
    const [showModal, setShowModal] = useState(false); // Controla si el modal está visible
    const [showPagadoPorModal, setShowPagadoPorModal] = useState(false); // Controla si el modal de "Pagado por" está visible
    const navigate = useNavigate();
    const location = useLocation();
    const idGrupo = location.state?.grupoId;

    useEffect(() => {
        const fetchGroupUsers = async () => {
            try {
                const response = await fetch(`${CONFIG.api_grupos}/${idGrupo}/usuarios`);
                if (!response.ok) throw new Error('Error al obtener los usuarios del grupo');
                const data = await response.json();
                setGroupUsers(data);
            } catch (error) {
                console.error('Error al obtener los usuarios del grupo:', error);
            }
        };
        fetchGroupUsers();
    }, [idGrupo]);

    const toggleParticipant = (user) => {
        if (participants.includes(user)) {
            setParticipants(participants.filter((participant) => participant !== user));
        } else {
            setParticipants([...participants, user]);
        }
    };

    const selectPagadoPor = (user) => {
        setPagadoPor(user);
        setShowPagadoPorModal(false); // Cierra el modal después de seleccionar
    };

    const subirGasto = async (e) => {
        e.preventDefault();
        if (!gastoName.trim()) {
            alert('El nombre del gasto no puede contener solo espacios');
            return;
        }
        if (participants.length === 0) {
            alert('Debe haber al menos un participante en el gasto');
            return;
        }
        if (parseFloat(ImporteGasto) <= 0 || parseFloat(ImporteGasto) === 0) {
            alert('Debe introducir un número válido en el campo de Importe');
            return;
        }
        try {
            const requestBody = {
                concepto: gastoName,
                pagadopor: PagadoPor,
                importe: parseFloat(ImporteGasto),
                participantes: participants.map((participant) => ({
                    usuarioNombre: participant,
                    importeUsuario: parseFloat(ImporteGasto) / participants.length,
                })),
            };
            const response = await fetch(`${CONFIG.api_grupos}/${idGrupo}/gastos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) throw new Error('Error al crear el gasto');
            alert('Gasto creado correctamente');
            window.location.href = `/${idGrupo}/gastos`; // Redirigir a la página de gastos del grupo
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de red al intentar crear el gasto');
        }
    };

    return (
        <div className="container">
            <button type="button" className="boton-volver" onClick={() => navigate(-1)}>
                &lt; Volver
            </button>
            <h1>Crear Nuevo Gasto</h1>
            <div className="form-container">
                <form onSubmit={subirGasto}>
                    <div className="form-group">
                        <label className="form-titles" htmlFor="gastoName">Nombre del Gasto</label>
                        <input
                            type="text"
                            id="gastoName"
                            placeholder="Nombre del gasto"
                            value={gastoName}
                            onChange={(e) => setGastoName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-titles" htmlFor="PagadoPor">Pagado por</label>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setShowPagadoPorModal(true)}
                        >
                            {PagadoPor ? `Pagado por: ${PagadoPor}` : 'Seleccionar quién pagó'}
                        </button>
                    </div>
                    <div className="form-group">
                        <label className="form-titles" htmlFor="Importe">Importe</label>
                        <input
                            type="text"
                            id="Importe"
                            placeholder="Importe"
                            value={ImporteGasto}
                            onChange={(e) => setImporteGasto(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-titles">Participantes</label>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setShowModal(true)}
                        >
                            Seleccionar Participantes
                        </button>
                        {participants.length > 0 && (
                            <ul className="selected-participants">
                                {participants.map((participant) => (
                                    <li key={participant} className='listaParticipantesGasto'>{participant}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn">Añadir Gasto</button>
                    </div>
                </form>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Seleccionar Participantes</h2>
                        {groupUsers.length > 0 ? (
                            <ul className="participants-list">
                                {groupUsers.map((user) => (
                                    <li key={user.email} className="participant-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={participants.includes(user)}
                                                onChange={() => toggleParticipant(user)}
                                            />
                                            {user}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aún no hay miembros en el grupo.</p>
                        )}
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setShowModal(false)}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para "Pagado por" */}
            {showPagadoPorModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Seleccionar quién pagó</h2>
                        {groupUsers.length > 0 ? (
                            <ul className="participants-list">
                                {groupUsers.map((user) => (
                                    <li key={user.email}>
                                        <button
                                            type="button"
                                            className="btnotrocolor"
                                            onClick={() => selectPagadoPor(user)}
                                        >
                                            {user}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aún no hay miembros en el grupo.</p>
                        )}
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setShowPagadoPorModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnadirGasto;
