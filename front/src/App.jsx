import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import logo from './assets/logo.png'

//Holahola
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container">
      <div className="blue-background">
        <img src={logo} alt="logo" width="300px"></img>
      </div>
      <div className="content">
        <h1>Bienvenido</h1>
        <div id="conjuntoTarjeta">
          <p className="tarjetaGrupo">Viaje a Italia</p>
          <p className="tarjetaGrupo">Viaje Francia</p>
        </div>
      </div>
    </div>
    </>
  )
}

export default App