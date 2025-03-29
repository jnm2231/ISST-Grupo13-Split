import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CrearGrupo() {
    const [groupName, setGroupName] = useState('');
    const navigate = useNavigate();

    const subirGrupo = (e) => {
        e.preventDefault();
        // Codigo para enviar los datos al backend
        console.log('Creating group:', { groupName, description });
        
        // Despues de crear el grupo, navegar de vuelta a la lista de grupos o al dashboard
        // navigate('/grupos');
      };

    return(
        <div className="container">
            <button type="button" class="boton-volver" onClick={() => navigate(-1)}>
                &lt; Volver
            </button>
            <h1>Crear Nuevo Grupo</h1>
            
            <form onSubmit={subirGrupo}>
                <div className="form-group">
                    <label className="form-titles" htmlFor="groupName">Nombre del Grupo</label>
                    <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-buttons">
                    <button type="submit" className="btn">Crear Grupo</button>
                </div>
            </form>
        </div>
    );
}

export default CrearGrupo;