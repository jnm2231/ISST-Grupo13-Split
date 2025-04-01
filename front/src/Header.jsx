import './App.css';
import logo from './assets/logo.png';

function Header() {
  return (
    <div className="blue-background" style={{
      background: 'linear-gradient(90deg, #15738E, #007BFF)',
      padding: '1rem 0',
      textAlign: 'center',
    }}>
      <img src={logo} alt="logo" width="200px" />
    </div>
  );
}

export default Header;