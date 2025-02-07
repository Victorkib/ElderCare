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
  CalendarDays,
  ClipboardList,
  BarChart2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Topbar.scss';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

export default function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = useSelector((store) => store.user.user);

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
      localStorage.removeItem('authToken');
      Cookies.remove('authToken');
      navigate('/login');
    } catch (error) {
      console.log('Error occured, ', error);
      toast.error('Error logging out.');
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <div>
      <header className={`ecs-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <FaHeart className="logo-icon" />
            <h1>
              {user ? (
                <Link
                  to="/land"
                  className={activeLink === '/' ? 'active' : ''}
                  onClick={() => {
                    setActiveLink('/');
                    closeMenus();
                  }}
                >
                  ElderlyCare
                </Link>
              ) : (
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
              )}
            </h1>
          </div>

          <div
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>

          <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
            {!user ? (
              <div className="nav-links">
                <Link
                  to="/"
                  className={`nav-link ${activeLink === '/' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveLink('/');
                    closeMenus();
                  }}
                >
                  <Home size={18} /> Home
                </Link>

                {/* Show Features and Contact only on Home tab */}
                {activeLink === '/' && (
                  <>
                    <a
                      href="#features"
                      className="nav-link"
                      onClick={closeMenus}
                    >
                      <Heart size={18} /> Features
                    </a>
                    <a
                      href="#contact"
                      className="nav-link"
                      onClick={closeMenus}
                    >
                      <Phone size={18} /> Contact
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
                  <Info size={18} /> About Us
                </Link>
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
                      activeLink === '/register' ? 'active' : ''
                    }`}
                    to="/register"
                    onClick={() => {
                      setActiveLink('/register');
                      closeMenus();
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ) : (
              <div className="nav-links">
                <Link
                  to="/land"
                  className={`nav-link ${
                    activeLink === '/land' ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveLink('/land');
                    closeMenus();
                  }}
                >
                  <Home size={18} /> Dashboard
                </Link>
                <Link
                  to="/Scheduler"
                  className={`nav-link ${
                    activeLink === '/Scheduler' ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveLink('/scheduler');
                    closeMenus();
                  }}
                >
                  <CalendarDays size={18} /> Scheduler
                </Link>
                <Link
                  to="/allHealthLogs"
                  className={`nav-link ${
                    activeLink === '/allHealthLogs' ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveLink('/allHealthLogs');
                    closeMenus();
                  }}
                >
                  <ClipboardList size={18} /> Health Logs
                </Link>
                <Link
                  to="/CareAnalytics"
                  className={`nav-link ${
                    activeLink === '/CareAnalytics' ? 'active' : ''
                  }`}
                  onClick={() => {
                    setActiveLink('/CareAnalytics');
                    closeMenus();
                  }}
                >
                  <BarChart2 size={18} /> Care Analytics
                </Link>
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
                    className={`profile-dropdown ${
                      isProfileOpen ? 'open' : ''
                    }`}
                  >
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
                      <User size={18} /> Profile Settings
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
                      <Settings size={18} /> Account Settings
                    </Link>
                    <button onClick={handleLogout} className="logout-option">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
      <ToastContainer />
    </div>
  );
}
