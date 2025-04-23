import './App.css'
import Header from './Header';
import { useNavigate} from 'react-router-dom';
import React, { useState} from 'react';

function InicioSesion() {

    //Estas constantes se encargan de mostrar el modal de login o registro
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // Estados para los campos del formulario
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login con:', username, password);
        // Aquí iría la lógica de autenticación
        setShowLogin(false);
        navigate('/grupoGastos');
    };

    return (
        <div id='PaginaInicio'>
            <div id='bloqueIzquierda'>
                <div className="texto-bienvenida">
                    <h2>Menos estrés a la hora de compartir gastos</h2>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <p>
                        Lleva un registro de los gastos compartidos con 
                        tus amigos, tu pareja, tu familia, 
                        tus compañeros de piso...
                    </p>
                </div>
            </div>
            <div id='bloqueDerecha'>
                <button className="btn-login" onClick={() => setShowLogin(true)}>Login</button>
                <button className="btn-register" onClick={() => setShowRegister(true)}>Register</button>
                {/*Botón provisional para avanzar de pantalla hasta que esté la logica*/}
                <button className="boton" onClick={() => navigate('/grupoGastos')}>Continuar</button>
            </div>
            
            
            {/* Modal de login */}
            {showLogin && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="form-group">
                                <label htmlFor="username">Usuario</label>
                                <input 
                                    type="text" 
                                    id="usernameLogin" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input 
                                    type="password" 
                                    id="passwordLogin" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="btn">
                                    Iniciar Sesión
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => setShowLogin(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InicioSesion;