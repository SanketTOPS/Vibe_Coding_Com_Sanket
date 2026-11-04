import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu, X, User, LogOut, ChevronDown, Wrench } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    const links = {
      super_admin: '/admin',
      customer: '/customer',
      provider: '/provider',
      technician: '/technician',
    };
    return links[user?.role] || '/';
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              HomeServe
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/services" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Services</Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg border border-gray-200"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-xs">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-sm">{user.full_name?.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <Link to="/services" className="text-gray-600 font-medium py-2" onClick={() => setIsMenuOpen(false)}>Services</Link>
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="btn-secondary text-red-600 text-center">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

