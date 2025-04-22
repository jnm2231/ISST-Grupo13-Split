import './App.css'
import Header from './Header';
import { useNavigate} from 'react-router-dom';

function InicioSesion() {

    const navigate = useNavigate();

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
                <button className="btn-login">Login</button>
                <button className="btn-register">Register</button>
                {/*Botón provisional para avanzar de pantalla hasta que esté la logica*/}
                <button className="boton" onClick={() => navigate('/grupoGastos')}>Continuar</button>
            </div>
        </div>
    );
}

export default InicioSesion;