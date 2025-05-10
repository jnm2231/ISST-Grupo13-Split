import { useEffect, useState } from 'react';
import './App.css';
import CONFIG from './config/config';
import { useLocation, useNavigate } from "react-router-dom"; // Importa useNavigate
import {useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import spin from './assets/spinner.png';

function Gastos() {
  const [esgasto, setEsgasto] = useState(true);
  const [boton1, setBoton1] = useState("seleccionado");
  const [boton2, setBoton2] = useState("noseleccionado");
  const [balance, setBalance] = useState();
  const location = useLocation();
  const navigate = useNavigate(); // Inicializa navigate
  const [grupo, setGrupo] = useState({});
  const [loading,setLoading] = useState(true) //pongo esto a true para que funcione como temporizador en el useEffect
  const [showModal, setShowModal] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [pagadas, setPagadas] = useState({}); // Estado para las deudas pagadas
  // Estado para controlar el modal y el gasto seleccionado
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  let params = useParams();
  let id = params.grupoId;
  console.log("Grupo ID:", id);

  useEffect(() => {

    async function cargarDatos() {
      console.log("Cargando datos...");
      try {
        await Promise.all([cargarBalance(), cargarGrupo()]);
        console.log("Datos cargados correctamente");
      } catch (error) {
        console.log("Error al cargar los datos:", error);
      }
    }
    cargarDatos();
    setTimeout(() => {
      setLoading(false)
    },1000)

  }, []);

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
        window.location.href = `/${idGrupo}/gastos`;
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red al intentar crear el gasto');
    }
  };

  async function cargarGrupo() {
    console.log("Ejecutando cargarGrupo()");
    try{
      //hace llamada a la api de /grupos
      const response = await fetch(`${CONFIG.api_grupos}`+`/${id}`)
      console.log(CONFIG.api_grupos)
      console.log(response)

      //si responde ok (200) me lo guardo en grupo

      if(response.status == 200){
        console.log("responde ok")
        console.log(response)
        const data = await response.json();
        setGrupo(data);
        console.log("grupo:")
        console.log(grupo)
      }
      //si falla hago un log y mando que error hubo de http
      else{
        console.log("respuesta de red ok pero respuesta de HTTP no ok")
        console.log(response)
        const dataError = await response.json();
        console.log(`Error: ${response.status} - ${dataError.error.message}`);
        
      }

    }
    catch(e){
      console.log("ERROR",e)
    }
    console.log("salgo del try")
  }

  function volverAGrupoGastos() {
    navigate("/GrupoGastos"); // Redirect to the main page
  }

  function _navegarAnadirGasto() {
    navigate(`/${id}/gastos/anadirgasto`,{ state: { grupoId: id } }); // Redirect to add gasto page
  }

  async function cargarBalance(){
    console.log("Ejecutando cargarBalance()");
    //Comprueba si coge mock o del servidor
      try{
        //hace llamada a la api de /grupos
        const response = await fetch(`${CONFIG.api_grupos}`+`/${id}/balances`)
        console.log(CONFIG.api_grupos)
        console.log(response)

        //si responde ok (200) me lo guardo en grupo

        if(response.status == 200){
          console.log("responde ok")
          console.log(response)
          const data = await response.json();
          setBalance(data);
        }
        //si falla hago un log y mando que error hubo de http
        else{
          console.log("respuesta de red ok pero respuesta de HTTP no ok")
          console.log(response)
          const dataError = await response.json();
          console.log(`Error: ${response.status} - ${dataError.error.message}`);
          
        }

      }
      catch(e){
        console.log("ERROR",e)
      }
      console.log("salgo del try")
  }

  // Imprime las tarjetas pasando por el array de gastos dentro de grupo (esto solo se ve en gasto)
  function _imprimegasto() {
    return (
      <div className="gasto-tarjetas">
        {grupo.gastos.map((gasto, index) => (
          <button className="tarjetagastos" onClick={() => abrirModalGasto(gasto)}>
            <p className={gasto.concepto.includes("Deuda") ? "texto-rojo" : ""}>
              {gasto.concepto}
            </p>
            <div className='filagastos'>
              <p className="pagado">Pagado por: {gasto.pagadopor}</p>
              <p className="importe">{gasto.importe.toFixed(2)}</p>
            </div>
            <p className="texto-informacion">
              Pincha para ver el detalle del gasto
            </p>
          </button>
        ))}
      </div>
    );
  }

  // Función para cargar los participantes de un gasto
  async function cargarParticipacion(gastoId) {
    try {
      const response = await fetch(`${CONFIG.api_gastos}/${gastoId}`);
      if (response.ok) {
        const data = await response.json();
        setParticipantes(data);
      } else {
        console.error("Error al cargar la participación:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cargar la participación:", error);
    }
  }

  // Función para renderizar los participantes de un gasto
  function renderParticipantes() {
    if (!participantes.length) {
      return <p>Cargando participantes...</p>;
    }
    return participantes.map((participante, index) => (
      <div key={index} className="filagastos">
        <p className="importe">{participante.usuario.nombre}</p>
        <p>{participante.importe.toFixed(2)} €</p>
      </div>
    ));
  }

  // Función para abrir el modal
  function abrirModalGasto(gasto) {
    setSelectedGasto(gasto);
    cargarParticipacion(gasto.id); // Cargar los participantes del gasto
    setModalVisible(true);
  }

  // Función para cerrar el modal
  function cerrarModalGasto() {
    setModalVisible(false);
    setSelectedGasto(null);
    setParticipantes([]);
  }

  //navega y pasa a la pagina gastos los datos que se le meten
  function _pasarPagina(valor) {
    navigate(`/${id}/gastos/${valor.id}`); // Redirect to gasto details
  }

  // Esto imprimiría y mostraría en balance el dinero debido a ti pero falta por hacer
  function _imprimebalance() {
    console.log(balance);
    
    return (
        Object.entries(balance).map(([usuario, deuda], index) => 
         (
            <button className="tarjetagastos" key={index} onClick={() => deuda < 0 && handleDebtClick(usuario)}>
              <div className='filagastos'>
                <p className="importe">{usuario}</p>
                <p className={deuda > 0 ? "verde" : deuda === 0 ? "" : "rojo"}>
                  {deuda.toFixed(2)}
                </p>
              </div>
            </button>
          )
        )
      
    );
  }

  function handleDebtClick(usuario) {
    fetch(`${CONFIG.api_grupos}/${id}/deudas`)
      .then((response) => {
        if (!response.ok) throw new Error("Error al obtener las deudas");
        return response.json();
      })
      .then((deudas) => {
        const deudasUsuario = deudas[usuario] || {};
        setSelectedDebt({ usuario, deudas: deudasUsuario });
        setShowModal(true);
      })
      .catch((error) => {
        console.error("Error al obtener las deudas detalladas:", error);
      });
  }

  function closeModal() {
    setShowModal(false);
    setSelectedDebt(null);
  }
// esto es para que se cree un gasto ficticio para saldar la deuda
  function handleCheckboxChange(acreedor) {
    const cantidad = selectedDebt.deudas[acreedor]; // Get the amount owed to the creditor
  
    
    const nuevoGasto = {
      concepto: `Deuda pagada por ${selectedDebt.usuario} a ${acreedor}`,
      pagadopor: selectedDebt.usuario,
      importe: cantidad,
      participantes: [{ usuarioNombre: acreedor, importeUsuario: cantidad }],
    };
  
    // Send the new expense to the API
    fetch(`${CONFIG.api_grupos}/${id}/gastos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoGasto),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error al crear el gasto');
        console.log(`Gasto creado: ${JSON.stringify(nuevoGasto)}`);
  
        // Update the balance and debts locally
        setBalance((prevBalance) => ({
          ...prevBalance,
          [selectedDebt.usuario]: prevBalance[selectedDebt.usuario] + cantidad,
          [acreedor]: prevBalance[acreedor] - cantidad,
        }));
  
        setSelectedDebt((prevSelectedDebt) => {
          const updatedDeudas = { ...prevSelectedDebt.deudas };
          delete updatedDeudas[acreedor]; // Remove the debt from the modal
          return { ...prevSelectedDebt, deudas: updatedDeudas };
        });
      })
      .catch((error) => {
        console.error('Error al crear el gasto:', error);
      });
  
    // Update the state for the checkbox
    setPagadas((prev) => ({
      ...prev,
      [acreedor]: !prev[acreedor],
    }));
  }

  // Esto es lo que se ejecuta cuando aprietas el botón de balance y gasto y sirve para que cambie de página
  function cambio() {
    console.log(esgasto);
    // Esta parte es para cambiar el css de los botones
    let boton1e = boton1;
    let boton2e = boton2;
    setBoton1(boton2e);//prueba hola
    setBoton2(boton1e);
    // Esto es para cambiar de gasto a balance o viceversa
    setEsgasto(!esgasto);
  }

  // Esto es para que salte cada vez que pulso uno de los botones
  useEffect(() => {
    console.log("Cambio detectado: esgasto ahora es", esgasto);
  }, [esgasto]);


  return (
    <div>
      {loading ? (
        <img className="spin" src={spin} alt="Cargando..." />
      ) : (
        <div className="container">
          <h1>{grupo.nombre}</h1>
          <div className="headerGrupoGastos">
            <button className="boton-volver" onClick={volverAGrupoGastos}>&lt; Volver</button>
              <ul className="navegar">
                <button className={boton1} onClick={() => cambio()}>Gastos</button>
                <button className={boton2} onClick={() => cambio()}>Balance</button>
              </ul>
              <div></div>
          </div>
          <div className="fila">
            <div id="conjuntoTarjeta">
              {esgasto ? (
                <>
                  <button className="boton-anadirgasto" onClick={_navegarAnadirGasto}>
                    Añadir Gasto
                  </button>
                  {_imprimegasto()}
                </>
              ) : (
                _imprimebalance()
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && selectedDebt && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Deudas de {selectedDebt.usuario}</h2>
            {Object.entries(selectedDebt.deudas).map(([acreedor, cantidad], index) => (
              <p key={index}>
                Le debes {cantidad.toFixed(2)} a {acreedor}
                <input
                  type="checkbox"
                  checked={!!pagadas[acreedor]}
                  onChange={() => handleCheckboxChange(acreedor)}
                />
              </p>
            ))}
            <button className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {modalVisible && selectedGasto && (
        <div className="modal-overlay" onClick={cerrarModalGasto}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalles del gasto</h2>
            <p><strong>Concepto:</strong> {selectedGasto.concepto}</p>
            <p><strong>Pagado por:</strong> {selectedGasto.pagadopor}</p>
            <p><strong>Importe:</strong> {selectedGasto.importe.toFixed(2)} €</p>
            <h4>Participantes:</h4>
            {renderParticipantes()}
            <button className="btn btn-secondary" onClick={cerrarModalGasto}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gastos;