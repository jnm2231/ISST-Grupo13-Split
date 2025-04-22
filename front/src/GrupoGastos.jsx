import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import Gastos from './Gastos'
import { useNavigate} from 'react-router-dom';
//Pagina principal donde se mostraran todos los grupos a los que el usuario pertenece

function GrupoGastos(props) {

  const navigate = useNavigate();

  const [grupo, setGrupo] = useState() //no hace nada
  const [grupoSelect, setGrupoSelect] = useState() //no hace nada

  console.log(props)
  //Imprime las tarjetas
  function _imprimeGrupos(){
    return props.mockgrupos.map((grupo,index) =>(
      
      <button className="tarjetaGrupo" onClick={() => _pasarPagina(grupo)} value={grupo}>{grupo.nombre}</button>
    ));
  }

  //navega y pasa a la pagina gastos los datos que se le meten
  function _pasarPagina(valor){
    navigate(`/${valor.id}`+`/gastos`, { state: { valor } });
  }




  return (
  
  
  <div className="container">
    <div id='sesion'>
    <button className="boton" onClick={() => navigate('/')}>Cerrar sesión</button>
      <button className="boton">Perfil</button>
    </div>
    <div className="content">
      {/*<button className="boton">Unirse a un Grupo</button>*/}
      <div></div>
      <h1 className="Bienvenido">Bienvenido</h1>
      <button className="boton" onClick={() => navigate('/creargrupo')}>Crear Grupo</button>
    </div>
    <div className="fila">     
      <div id="conjuntoTarjeta">
        {_imprimeGrupos()}
      </div>
    </div>
  </div>
    
  )
}

export default GrupoGastos