import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import logo from './assets/logo.png'

//Header de la pagina
function Header() {

  return (
    <>
      <div className="blue-background">
        <img src={logo} alt="logo" width="300px"></img>
      </div>
    </>
  )
}

export default Header