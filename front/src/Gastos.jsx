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
  const [showShareModal, setShowShareModal] = useState(false); // Estado para controlar el modal de compartir grupo
  const [editModalVisible, setEditModalVisible] = useState(false); // Estado para el modal de edición
  const [editGastoData, setEditGastoData] = useState({}); // Estado para los datos del gasto a editar
  const [actualizar, setActualizar] = useState(false); // Estado para forzar la actualización

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

  }, [actualizar]);

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

  // Función para abrir el modal
  const abrirModalCompartir = () => {
    setShowShareModal(true);
  };

  // Función para cerrar el modal
  const cerrarModalCompartir = () => {
    setShowShareModal(false);
  };

  // Función para copiar el ID al portapapeles
  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(grupo.id).then(() => {
      alert('ID del grupo copiado al portapapeles');
    }).catch((error) => {
      console.error('Error al copiar el ID:', error);
    });
  };

  // Imprime las tarjetas pasando por el array de gastos dentro de grupo (esto solo se ve en gasto)
  function _imprimegasto() {
    if (!grupo.gastos || grupo.gastos.length === 0) {
      return <p>No hay gastos disponibles.</p>;
    }
    return (
      <div className="gasto-tarjetas">
        {grupo.gastos.map((gasto, index) => (
          <button className="tarjetagastos" onClick={() => abrirModalGasto(gasto)}>
            <p className={gasto.concepto.includes("Deuda") ? "texto-rojo" : ""}>
              {gasto.concepto}
            </p>
            <div className='filagastos'>
              <p className="pagado">Pagado por: {gasto.pagadopor}</p>
              <p className="importe">{gasto.importe.toFixed(2)} €</p>
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
    
    return (
        Object.entries(balance).map(([usuario, deuda], index) => 
         (
            <button className="tarjetagastos" key={index} onClick={() => deuda < 0 && handleDebtClick(usuario)}>
              <div className='filagastos'>
                <p className="importe">{usuario}</p>
                <p className={deuda > 0 ? "verde" : deuda === 0 ? "" : "rojo"}>
                  {deuda.toFixed(2)} €
                </p>
              </div>
              {deuda <0 && (<p className="texto-informacion">
                  Pincha para saldar tus deudas
              </p>)}
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
      })
      .then((gastoCreado) => {
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

        // Añade el nuevo gasto al estado del grupo
        setGrupo((prevGrupo) => ({
          ...prevGrupo,
          gastos: [...prevGrupo.gastos, gastoCreado], // Añade el nuevo gasto a la lista de gastos
        }));

        cargarGrupo();
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

  function abrirModalEditarGasto(gasto) {
    setEditGastoData({
      concepto: gasto.concepto,
      pagadopor: gasto.pagadopor,
      importe: gasto.importe,
      participantes: participantes.map((p) => ({
        usuarioNombre: p.usuario.nombre,
        importeUsuario: p.importe,
      })),
    });
    setEditModalVisible(true);
  }
  
  function cerrarModalEditarGasto() {
    setEditModalVisible(false);
    setEditGastoData({});
  }

  async function actualizarGasto() {
    try {
      const response = await fetch(`${CONFIG.api_gastos}/${selectedGasto.id}/actualizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editGastoData),
      });
      if (!response.ok) {
        throw new Error('Error al actualizar el gasto');
      }
      alert('Gasto actualizado correctamente');
      cerrarModalEditarGasto();
      setActualizar((prev) => !prev);
      cargarParticipacion(selectedGasto.id); // Recargar los datos del gasto actualizado
    } catch (error) {
      console.error('Error al actualizar el gasto:', error);
      alert('Error al intentar actualizar el gasto');
    }
  }

  async function eliminarGasto() {
    if (!selectedGasto) return;
  
    const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el gasto "${selectedGasto.concepto}"?`);
    if (!confirmacion) return;
  
    try {
      const response = await fetch(`${CONFIG.api_gastos}/${selectedGasto.id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el gasto');
      }
  
      alert('Gasto eliminado correctamente');
      cerrarModalGasto(); // Cierra el modal después de eliminar el gasto
      cargarGrupo(); // Recarga los datos del grupo para reflejar los cambios
      cargarBalance(); // Recarga el balance
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
      alert('Error al intentar eliminar el gasto');
    }
  }
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
            <div>
                <button className="boton-compartir" onClick={abrirModalCompartir}>
                    Compartir Grupo
                  </button>
            </div>
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
            <div>
              <button className="btn btn-primary" onClick={() => abrirModalEditarGasto(selectedGasto)}>
                Editar Gasto
              </button>
              <button className="btn btn-danger" onClick={eliminarGasto}>Eliminar Gasto</button>
            </div>
            <button className="btn btn-secondary" onClick={cerrarModalGasto}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal para editar gasto */}
      {editModalVisible && (
        <div className="modal-overlay" onClick={cerrarModalEditarGasto}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar Gasto</h2>
            <form onSubmit={(e) => { e.preventDefault(); actualizarGasto(); }}>
              <label>
                Concepto:
                <input
                  type="text"
                  value={editGastoData.concepto}
                  onChange={(e) => setEditGastoData({ ...editGastoData, concepto: e.target.value })}
                />
              </label>
              <label>
                Pagado por:
                <input
                  type="text"
                  value={editGastoData.pagadopor}
                  onChange={(e) => setEditGastoData({ ...editGastoData, pagadopor: e.target.value })}
                />
              </label>
              <label>
                Importe:
                <input
                  type="number"
                  value={editGastoData.importe}
                  onChange={(e) => {
                    const nuevoImporte = parseFloat(e.target.value);
                    const numeroParticipantes = editGastoData.participantes.length;

                    // Recalcular el importe de cada participante
                    const importePorParticipante = numeroParticipantes > 0 ? nuevoImporte / numeroParticipantes : 0;

                    const participantesActualizados = editGastoData.participantes.map((participante) => ({
                      ...participante,
                      importeUsuario: importePorParticipante,
                    }));

                    setEditGastoData({
                      ...editGastoData,
                      importe: nuevoImporte,
                      participantes: participantesActualizados,
                    });
                  }}
                />
              </label>
              <h4>Participantes:</h4>
              {editGastoData.participantes?.map((participante, index) => (
                <div key={index}>
                  <label>
                    Nombre:
                    <input
                      type="text"
                      value={participante.usuarioNombre}
                      onChange={(e) => {
                        const updatedParticipantes = [...editGastoData.participantes];
                        updatedParticipantes[index].usuarioNombre = e.target.value;
                        setEditGastoData({ ...editGastoData, participantes: updatedParticipantes });
                      }}
                    />
                  </label>
                  <label>
                    Importe:
                    <input
                      type="number"
                      value={participante.importeUsuario}
                      onChange={(e) => {
                        const updatedParticipantes = [...editGastoData.participantes];
                        updatedParticipantes[index].importeUsuario = parseFloat(e.target.value);
                        setEditGastoData({ ...editGastoData, participantes: updatedParticipantes });
                      }}
                    />
                  </label>
                </div>
              ))}
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              <button type="button" className="btn btn-secondary" onClick={cerrarModalEditarGasto}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de compartir grupo */}
      {showShareModal && (
        <div className="modal-overlay" onClick={cerrarModalCompartir}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Compartir Grupo</h2>
            <p><strong>ID del Grupo:</strong> {grupo.id}</p>
            <button className="btn btn-primary" onClick={copiarAlPortapapeles}>
              Copiar ID
            </button>
            <button className="btn btn-secondary" onClick={cerrarModalCompartir}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gastos;