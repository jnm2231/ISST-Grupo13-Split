import './App.css'
import './styles/login.css'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleDollarSign, Users, Clock, BarChart } from 'lucide-react';

function InicioSesion() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Llamada al endpoint de login del backend usando fetch
            const response = await fetch('http://localhost:8080/myApi/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    acceso: username,
                    password: password
                })
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Usuario no encontrado');
                } else if (response.status === 401) {
                    throw new Error('Contraseña incorrecta');
                } else {
                    const errorText = await response.text();
                    throw new Error(`Error en la autenticación: ${errorText}`);
                }
            }


            const userData = {
                nombre: username,
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
                credentials: 'include',
                body: JSON.stringify({
                    acceso: registerEmail,
                    password: registerPassword
                })
            });
    
            if (!loginResponse.ok) {
                throw new Error('Error al iniciar sesión automáticamente');
            }
    
            const userData = {
                nombre: registerName,
                email: registerEmail
            };
            localStorage.setItem('usuario', JSON.stringify(userData));
    
            alert('Usuario registrado correctamente. Iniciando sesión...');
            setShowRegister(false);
            navigate('/grupoGastos');
            
        } catch (error) {
            console.error('Error durante el registro:', error);
            alert(error.message);
        }
    };

    const features = [
        {
            icon: <CircleDollarSign size={24} />,
            title: "Gestión Simple",
            description: "Organiza tus gastos compartidos sin complicaciones"
        },
        {
            icon: <Users size={24} />,
            title: "Grupos Ilimitados",
            description: "Crea todos los grupos que necesites"
        },
        {
            icon: <Clock size={24} />,
            title: "Balance Instantáneo",
            description: "Calcula deudas y pagos automáticamente"
        },
        {
            icon: <BarChart size={24} />,
            title: "Historial Completo",
            description: "Mantén un registro detallado de todos los gastos"
        }
    ];

    return (
        <div className="login-page">
            <div className="background-animation" />
            <motion.section 
                className="left-section"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="welcome-text">
                    <h1>Gestiona gastos en grupo de forma sencilla</h1>
                    <p>La manera más fácil de compartir gastos con amigos, familia, compañeros de piso...</p>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            <motion.section 
                className="right-section"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="auth-container">
                    <div className="auth-buttons">
                        <motion.button
                            className="btn-login"
                            onClick={() => setShowLogin(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Iniciar Sesión
                        </motion.button>
                        <motion.button
                            className="btn-register"
                            onClick={() => setShowRegister(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Registrarse
                        </motion.button>
                        <button className="btn-demo" onClick={() => navigate('/grupoGastos')}>Continuar</button>
                    </div>
                </div>
            </motion.section>

            {showLogin && (
                <div className="modal-overlay" onClick={() => setShowLogin(false)}>
                    <motion.div 
                        className="modal"
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2>Iniciar Sesión</h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="username">Usuario</label>
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="input" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowLogin(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {showRegister && (
                <div className="modal-overlay" onClick={() => setShowRegister(false)}>
                    <motion.div 
                        className="modal"
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2>Registro</h2>
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label htmlFor="registerName">Nombre</label>
                                <input 
                                    type="text" 
                                    className="input" 
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registerEmail">Email</label>
                                <input 
                                    type="email" 
                                    className="input" 
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="registerPassword">Contraseña</label>
                                <input 
                                    type="password" 
                                    className="input" 
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input 
                                    type="password" 
                                    className="input" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowRegister(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default InicioSesion;