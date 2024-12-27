import {
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Home,
  Heart,
  Phone,
  Info,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Topbar.scss';
import apiRequest from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';

export default function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('authToken');

  const [activeLink, setActiveLink] = useState('/');
  const location = useLocation();
  const navigate = useNavigate();

  // Update the active link based on the current URL path
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await apiRequest.get('/logout');
      if (response.status) {
        localStorage.removeItem('authToken');
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error Logging out');
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false); // Close the mobile menu
    setIsProfileOpen(false); // Close the profile dropdown
  };

  return (
    <div>
      <header className={`ecs-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <FaHeart className="logo-icon" />
            <h1>
              <Link
                to="/"
                className={activeLink === '/' ? 'active' : ''}
                onClick={() => {
                  setActiveLink('/');
                  closeMenus();
                }}
              >
                ElderlyCare
              </Link>
            </h1>
          </div>

          <div
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            {/* Main navigation - common for all users */}
            <div className="nav-links">
              <Link
                to="/"
                className={`nav-link ${activeLink === '/' ? 'active' : ''}`}
                onClick={() => {
                  setActiveLink('/');
                  closeMenus();
                }}
              >
                <Home size={18} />
                Home
              </Link>

              {/* Show Features and Contact only on Home tab */}
              {activeLink === '/' && (
                <>
                  <a
                    href="#features"
                    className={`nav-link ${
                      activeLink === '#features' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveLink('#features');
                      closeMenus();
                    }}
                  >
                    <Heart size={18} />
                    Features
                  </a>
                  <a
                    href="#contact"
                    className={`nav-link ${
                      activeLink === '#contact' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveLink('#contact');
                      closeMenus();
                    }}
                  >
                    <Phone size={18} />
                    Contact
                  </a>
                </>
              )}

              <Link
                to="/AboutPage"
                className={`nav-link ${
                  activeLink === '/AboutPage' ? 'active' : ''
                }`}
                onClick={() => {
                  setActiveLink('/AboutPage');
                  closeMenus();
                }}
              >
                <Info size={18} />
                About Us
              </Link>
            </div>

            {/* Auth section */}
            {isLoggedIn ? (
              <div className="profile-section">
                <button
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User size={20} />
                  <span>My Profile</span>
                  <ChevronDown
                    size={16}
                    className={`chevron ${isProfileOpen ? 'open' : ''}`}
                  />
                </button>

                <div
                  className={`profile-dropdown ${isProfileOpen ? 'open' : ''}`}
                >
                  <Link
                    to="/dashboard"
                    className={`profile-link ${
                      activeLink === '/dashboard' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveLink('/dashboard');
                      closeMenus();
                    }}
                  >
                    <Home size={18} />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className={`profile-link ${
                      activeLink === '/profile' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveLink('/profile');
                      closeMenus();
                    }}
                  >
                    <User size={18} />
                    Profile Settings
                  </Link>
                  <Link
                    to="/accountSettings"
                    className={`profile-link ${
                      activeLink === '/accountSettings' ? 'active' : ''
                    }`}
                    onClick={() => {
                      setActiveLink('/accountSettings');
                      closeMenus();
                    }}
                  >
                    <Settings size={18} />
                    Account Settings
                  </Link>
                  <button onClick={handleLogout} className="logout-option">
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-section">
                <Link
                  className={`login-button ${
                    activeLink === '/login' ? 'active' : ''
                  }`}
                  to="/login"
                  onClick={() => {
                    setActiveLink('/login');
                    closeMenus();
                  }}
                >
                  Login
                </Link>
                <Link
                  className={`cta-button ${
                    activeLink === '/signup' ? 'active' : ''
                  }`}
                  to="/signup"
                  onClick={() => {
                    setActiveLink('/signup');
                    closeMenus();
                  }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      <ToastContainer />
    </div>
  );
}
