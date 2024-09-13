import { BiFace, BiMenu } from "react-icons/bi";
import { FaRegCalendarCheck } from "react-icons/fa"; // O cualquier otro ícono de asistencia que prefieras
import "../styles/navbar.css";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de importar Link para la navegación

// eslint-disable-next-line react/prop-types
const NavBar = ({ toggleSidebar }) => {

    // eslint-disable-next-line no-unused-vars
    const [userRole, setUserRole] = useState(null);
    const [roleName, setRoleName] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('http://localhost:4000/rol'); // Cambia la URL según tu API
                const roles = response.data;

                // Obtener el rol del usuario del localStorage
                const roleId = Number(localStorage.getItem('roluser'));
                setUserRole(roleId);

                // Buscar el nombre del rol basado en el ID del rol
                const role = roles.find(role => role.idrol === roleId);
                setRoleName(role ? role.namerol : 'Cajero'); // Asume que los roles tienen 'id' y 'name'
            } catch (error) {
                console.error('Error fetching roles:', error);
                setRoleName('Cajero');
            }
        };

        fetchRoles();
    }, []);

    return (
        <nav className="navbar">
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <BiMenu className="icon" />
                <BiFace className="icon" />
                    <p>{roleName}</p>
            </button>
            <div className="navbar-right">
                <form className="search-form">
                    <input type="text" placeholder="Buscar..." />
                </form>
                <Link to="/Asistencia" className="assist-button">
                    <FaRegCalendarCheck className="icon" />
                    <span>Asistencia</span>
                </Link>
            </div>
        </nav>
    );
}

export default NavBar;
