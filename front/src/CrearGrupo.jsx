import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CrearGrupo() {
    const [groupName, setGroupName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // Estado para almacenar todos los usuarios
    const navigate = useNavigate();

    // Simulación de usuarios disponibles (esto debería venir del backend)
    //const allUsers = ['Olivia', 'Pedro', 'Cristina', 'Juan', 'Ana', 'Carlos'];

    // Obtener usuarios del backend al cargar el componente
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/myApi/usuarios'); // Cambia la URL si es necesario
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                const data = await response.json();
                console.log(data);
                setAllUsers(data); // Guardar los usuarios en el estado
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, []); // El array vacío asegura que esto se ejecute solo una vez al montar el componente

    // Manejar el cambio en el campo de búsqueda
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        console.log('handleSearchChange-> allUsers:',allUsers);

        // Filtrar sugerencias basadas en el término de búsqueda
        if (value) {
            const filteredSuggestions = allUsers.filter((user) =>
                user.nombre.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            //console.log(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    // Añadir un participante a la lista
    const addParticipant = (participante) => {
        if (!participants.includes(participante)) {
            setParticipants([...participants, participante]);
        }
        setSearchTerm('');
        setSuggestions([]);
        console.log("Array participants: ", participants);
    };

    // Eliminar un participante de la lista
    const removeParticipant = (user) => {
        setParticipants(participants.filter((participant) => participant.email !== user.email));
    };

    // Manejar el envío del formulario
    const subirGrupo = async (e) => {
        e.preventDefault();

        //Alerta que salta si el nombre del grupo es null
        //trim() elimina los espacios en blanco al principio y al final de la cadena
        if (!groupName.trim()) {
            alert('El nombre del no puede contener solo espacios');
            return; // Detener la ejecución si el nombre está vacío
        }

        if (participants.length === 0) {
            alert('Debe haber al menos un participante en el grupo');
            return; // Detener la ejecución si no hay participantes
        }

        try{
            // Crear el cuerpo de la petición
            const requestBody = {
                nombre: groupName, // Nombre del grupo
                usuarios: participants.map((participant) => ({
                    nombre: participant.nombre, // Nombre del usuario
                    apodo: participant.apodo || participant.nombre, // Apodo (opcional)
                })),
            };

            // Realizar la petición POST al backend
            const response = await fetch('http://localhost:8080/myApi/grupos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Convertir el objeto a JSON
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error al crear el grupo');
            }

            // Mostrar un mensaje de éxito y redirigir al usuario
            alert('Grupo creado correctamente');
            window.location.href = '/'; // Redirigir a la página principal y hace refresh para que salga el nuevo grupo
            }catch(error){
                console.error('Error de red:', error);
                alert('Error de red al intentar crear el grupo');
            }
    };

    return(
        <div className="container">
            <button type="button" className="boton-volver" onClick={() => navigate(-1)}>
                &lt; Volver
            </button>
            <h1>Crear Nuevo Grupo</h1>
            
            <div className="form-container">
            <form onSubmit={subirGrupo}>
                <div className="form-group">
                    <label className="form-titles" htmlFor="groupName">Nombre del Grupo</label>
                    <input
                        type="text"
                        id="groupName"
                        placeholder="Nombre del grupo"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>

                {/* Campo de búsqueda de participantes */}
                <div className="form-group">
                    <label className="form-titles" htmlFor="participantSearch">Participantes</label>
                    <input
                        type="text"
                        id="participantSearch"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Nombre del participante"
                    />
                    {/* Lista de sugerencias */}
                    {suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((user) => (
                                <li key={user.nombre} onClick={() => addParticipant(user)}>
                                    {user.nombre}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Lista de participantes añadidos */}
                <div className="participants-list">
                    {participants.map((participant) => (
                        <div key={participant.email} className="participant-item">
                            {participant.nombre}
                            <button type="button" onClick={() => removeParticipant(participant)}>✖</button>
                        </div>
                    ))}
                </div>
                
                <div className="form-buttons">
                    <button type="submit" className="btn">Crear Grupo</button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default CrearGrupo;