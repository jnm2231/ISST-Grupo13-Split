import { useEffect, useState  } from 'react'
import './App.css'
import CONFIG from './config/config'
import Gastos from './Gastos'
import { useNavigate} from 'react-router-dom';
//Pagina principal donde se mostraran todos los grupos a los que el usuario pertenece
/*
TODO: que carge aqui los datos en lugar de la app para ir incluyendo el tema de que cada usuario tenga sus grupos
*/
function GrupoGastos(props) {

  const navigate = useNavigate();

  const [grupo, setGrupo] = useState()
  const [grupoSelect, setGrupoSelect] = useState()

  console.log(props)
  //Imprime las tarjetas
  function _imprimeGrupos(){
    return props.mockgrupos.map((grupo,index) =>(
      
      <button className="tarjetaGrupo" onClick={() => _pasarPagina(grupo)} value={grupo}>{grupo.nombre}</button>
    ));
  }

  function _pasarPagina(valor){
    navigate(`/gastos`, { state: { valor } });
  }




  return (
    
      <div className="container">
      <div className="content">
        <button className="boton">Unirse a un Grupo</button>
        <h1>Bienvenido</h1>

        <button className="boton">Crear Grupo</button>
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