import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TopBar from '../../components/Topbar/TopBar';
import { ArrowUpCircle } from 'lucide-react';
// import './Layout.scss';

function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll visibility for the button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="authlayout">
      <TopBar />
      <div className="content">
        <Outlet />
      </div>
      {/* <button
        className={`scroll-to-top ${isScrolled ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpCircle size={24} />
      </button> */}
    </div>
  );
}

// Function to check if a cookie exists for authentication
const checkAuthCookie = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('authToken='));
  return cookie ? true : false;
};

// Function to check if localStorage has the token
const checkAuthLocalStorage = () => {
  const token = localStorage.getItem('authToken');
  return token ? true : false;
};

function RequireAuth() {
  const isAuthenticated = checkAuthCookie() || checkAuthLocalStorage(); // Check both cookies and localStorage
  if (isAuthenticated) {
    return <Layout />;
  } else {
    return <Navigate to="/login" />;
  }
}

export { Layout, RequireAuth };
