import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/Navbar';
import Home from './components/pages/Home';
import Products from './components/pages/Products';
import Reports from './components/pages/Reports';
import ReportAssists from './components/pages/ReportAssists';
import Users from './components/pages/Users';
import Category from './components/pages/Category';
import Rol from './components/pages/Rol';
import Ventas from './components/pages/Ventas';
import NuevaVenta from './components/pages/NuevaVenta';
import Login from './components/Login';
import Asistencia from './components/Asistencia';
import './styles/App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = () => {
    // Por ejemplo, podrías tener una función que cambie `isLoggedIn` a true
    setIsLoggedIn(true);
  };
  
  return (
    <Router>
      {!isLoggedIn ? (
        <Login handleLogin={handleLogin} />
      ) : (
        <div className={`app ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="content">
            <Sidebar isOpen={sidebarOpen} />
            <div className="main-content">
              <NavBar toggleSidebar={toggleSidebar} />
              <Routes>
                {/* Rutas protegidas que requieren autenticación */}
                <Route path="/" element={<Home />} />
                <Route path="/Products" element={<Products />} />
                <Route path="/Users" element={<Users />} />
                <Route path="/Reports" element={<Reports />} />
                <Route path="/ReportAsists" element={<ReportAssists/>}/>
                <Route path="/Category" element={<Category />} />
                <Route path="/Rol" element={<Rol />} />
                <Route path="/Ventas" element={<Ventas />} />
                <Route path="/NuevaVenta" element={<NuevaVenta />} />
                <Route path="/Home" element={<Home />} />

                {/* Ruta pública accesible sin estar logueado */}
                <Route path="/Asistencia" element={<Asistencia />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
};

export default App;
