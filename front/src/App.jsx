import { useState } from 'react'
import './App.css'
import GrupoGastos from './GrupoGastos'
import logo from './assets/logo.png'
import { Routes, Route } from 'react-router-dom';
import Error from './Error'
import Header from './Header'
import { mockgrupos } from './constants/mockgrupos';

//Holahola
function App() {
  const [count, setCount] = useState(0)

  return (
  <>
  <Header/>
  <Routes>
   <Route path="/" element={<GrupoGastos mockgrupos = {mockgrupos} />}/>
   <Route path="*" element={<Error/>}/>
  </Routes>
  </>
  )
}

export default App