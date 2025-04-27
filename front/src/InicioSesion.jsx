import './App.css'
import Header from './Header';
import { useNavigate} from 'react-router-dom';
import React, { useState} from 'react';

function InicioSesion() {

    //Estas constantes se encargan de mostrar el modal de login o registro
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // Estados para los campos del formulario de login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Estados para los campos del formulario de registro
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    /*
        const handleLogin = (e) => {
            e.preventDefault();
            console.log('Login con:', username, password);
            
            setShowLogin(false);
            navigate('/grupoGastos');
        };
    */

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login con:', username, password);

        try {
            // Llamada al endpoint de login del backend usando fetch
            const response = await fetch('http://localhost:8080/myApi/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acceso: username,  // El backend espera "acceso"
                    password: password
                })
            });

            if (!response.ok) {
                // Manejar respuestas de error HTTP específicas
                if (response.status === 404) {
                    throw new Error('Usuario no encontrado');
                } else if (response.status === 401) {
                    throw new Error('Contraseña incorrecta');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Error en la autenticación: ${errorText}`);
                }
            }

            // Si llegamos aquí, la autenticación fue exitosa
            const token = await response.text(); // El token viene como texto
            console.log('Login exitoso, token recibido:', token);

            // Guardar el token en localStorage
            localStorage.setItem('token', token);

            // Crear y guardar datos de usuario
            const userData = {
                nombre: username,
                // No tenemos acceso al ID real o email desde el token
            };
            localStorage.setItem('usuario', JSON.stringify(userData));

            setShowLogin(false);
            navigate('/grupoGastos');
        } catch (error) {
            console.error('Error durante el login:', error);
            alert(error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log('Registro con:', registerName, registerEmail, registerPassword);
        
        // Verificar que las contraseñas coinciden
        if (registerPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
    
        try {
            // Paso 1: Registrar al usuario
            const registerResponse = await fetch('http://localhost:8080/myApi/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: registerName,
                    email: registerEmail,
                    password: registerPassword
                })
            });
    
            if (!registerResponse.ok) {
                if (registerResponse.status === 400) {
                    const errorText = await registerResponse.text();
                    throw new Error(`Error en el registro: ${errorText}`);
                } else {
                    throw new Error(`Error ${registerResponse.status}: ${registerResponse.statusText}`);
                }
            }
    
            console.log('Registro exitoso');
            
            // Paso 2: Iniciar sesión automáticamente con las credenciales recién registradas
            const loginResponse = await fetch('http://localhost:8080/myApi/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acceso: registerEmail,  // Usar email como acceso
                    password: registerPassword
                })
            });
    
            if (!loginResponse.ok) {
                throw new Error('Error al iniciar sesión automáticamente');
            }
    
            // Obtener token de la respuesta
            const token = await loginResponse.text();
            console.log('Login automático exitoso, token recibido:', token);
    
            // Guardar el token y datos del usuario en localStorage
            localStorage.setItem('token', token);
            const userData = {
                nombre: registerName,
                email: registerEmail
            };
            localStorage.setItem('usuario', JSON.stringify(userData));
    
            // Mostrar mensaje de éxito
            alert('Usuario registrado correctamente. Iniciando sesión...');
            
            // Cerrar modal de registro
            setShowRegister(false);
            
            // Navegar a la página de grupos
            navigate('/grupoGastos');
            
        } catch (error) {
            console.error('Error durante el registro:', error);
            alert(error.message);
        }
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
                {/*<button className="boton" onClick={() => navigate('/grupoGastos')}>Continuar</button>*/}
            </div>
            
            {/* ----------------------------Modales--------------------------------- */}

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
                                    className="modalInput" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="modalInput" 
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

            {/* Modal de registro */}
            {showRegister && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Registro</h2>
                        <form onSubmit={handleRegister} className="register-form">
                            <div className="form-group">
                                <label htmlFor="registerName">Nombre</label>
                                <input 
                                    type="text" 
                                    className="modalInput" 
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registerEmail">Email</label>
                                <input 
                                    type="email" 
                                    className="modalInput" 
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registerPassword">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="modalInput" 
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input 
                                    type="password" 
                                    className="modalInput" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="submit" className="btn">
                                    Registrarse
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => setShowRegister(false)}
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