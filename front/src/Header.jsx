import './App.css';
import logo from './assets/logo.png';

// Header de la pagina
function Header() {
  return (
    <div className="blue-background">
      <img src={logo} alt="logo" width="300px"></img>
    </div>
  );
}

export default Header;