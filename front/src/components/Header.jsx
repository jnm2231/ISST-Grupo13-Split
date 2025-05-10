import { Link, useLocation } from 'react-router-dom';
import { Wallet } from 'lucide-react';

function Header() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isGroupsPage = location.pathname === '/grupoGastos';

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white text-2xl font-bold transition-transform hover:scale-105"
        >
          <Wallet className="h-8 w-8" />
          <span>SplitEasy</span>
        </Link>
        
        {!isLandingPage && !isGroupsPage && (
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/grupoGastos" 
                  className="text-white hover:text-blue-100 text-sm font-medium transition-colors"
                >
                  Mis Grupos
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;