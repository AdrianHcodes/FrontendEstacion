import { useState, useEffect } from 'react';
import { BiSolidReport } from 'react-icons/bi';
import { LuLayoutDashboard } from 'react-icons/lu';
import { PiUserList, PiUserSwitchLight } from 'react-icons/pi';
import { MdProductionQuantityLimits, MdOutlinePointOfSale } from 'react-icons/md';
import { TbReportMoney, TbCategoryPlus } from 'react-icons/tb';
import { IoMdExit } from 'react-icons/io';
import "../styles/sidebar.css";
import { Link } from 'react-router-dom';
import imagen from '../assets/logo-estacion/logo-estacion-blanco.png'; // Ruta de la imagen de tu logo
import axios from 'axios';

//eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen }) => {
    const [subMenuOpen, setSubMenuOpen] = useState(null);
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

    const handleSubMenuClick = (index) => {
        setSubMenuOpen(subMenuOpen === index ? null : index);
    };

    const handleCloseSidebar = () => {
        setSubMenuOpen(null);
    };
    

    return (
        <div className={`menu ${isOpen ? 'open' : 'closed'}`}>
            <div className='imagen'>
                <img src={imagen} alt="Logo de la empresa" className="logo-imagen" />
            </div>
            <ul className='menu-list'>
                {/* Siempre visible */}
                <li>
                    <Link to="/Home" onClick={handleCloseSidebar}>
                        <a className='item'>
                            <LuLayoutDashboard className="icon" />
                            Dashboard
                        </a>
                    </Link>
                </li>

                {/* Opciones visibles para Administrador */}
                {roleName === 'Administrador' && (
                    <li>
                        <a className='item' onClick={() => handleSubMenuClick(1)}>
                            <PiUserList className="icon" />
                            Usuarios
                        </a>
                        {subMenuOpen === 1 && (
                            <ul className="submenu">
                                <li className='submenu-item'>
                                    <Link to="/Users">
                                        <a className='item'>
                                            <PiUserList className="icon" />
                                            Usuarios
                                        </a>
                                    </Link>
                                </li>
                                <li className='submenu-item'>
                                    <Link to="/Rol">
                                        <a className='item'>
                                            <PiUserSwitchLight className="icon" />
                                            Roles
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                )}

                {/* Opciones visibles para Cajero, Administrador y Gerente */}
                {(roleName === 'Administrador' || roleName === 'Gerente') && (
                    <li>
                        <a className='item' onClick={() => handleSubMenuClick(2)}>
                            <MdProductionQuantityLimits className="icon" />
                            Productos
                        </a>
                        {subMenuOpen === 2 && (
                            <ul className="submenu">
                                <li className='submenu-item'>
                                    <Link to="/Products">
                                        <a className='item'>
                                            <MdProductionQuantityLimits className="icon" />
                                            Producto
                                        </a>
                                    </Link>
                                </li>
                                <li className='submenu-item'>
                                    <Link to="/Category">
                                        <a className='item'>
                                            <TbCategoryPlus className="icon" />
                                            Categoria
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>
                )}
                
                {/* Opciones visibles para todos los roles */}
                {(roleName === 'Administrador' || roleName === 'Cajero' || roleName === 'Gerente') && (
                
                <li>
                    <a className='item' onClick={() => handleSubMenuClick(3)}>
                        <TbReportMoney className="icon" />
                        Ventas
                    </a>
                    {subMenuOpen === 3 && (
                        <ul className="submenu">
                            <li className='submenu-item'>
                                <Link to="/Ventas">
                                    <a className='item'>
                                        <TbReportMoney className="icon" />
                                        Historial Ventas
                                    </a>
                                </Link>
                            </li>
                            <li className='submenu-item'>
                                <Link to="/NuevaVenta">
                                    <a className='item'>
                                        <MdOutlinePointOfSale className="icon" />
                                        Nueva Venta
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                )}
                <li>
                    <a className='item' onClick={() => handleSubMenuClick(4)}>
                        <BiSolidReport className="icon" />
                        Reportes
                    </a>
                    {subMenuOpen === 4 && (
                        <ul className="submenu">
                            <li className='submenu-item'>
                                <Link to="/Reports">
                                    <a className='item'>
                                        <BiSolidReport className="icon" />
                                        Reporte Ventas
                                    </a>
                                </Link>
                            </li>
                            <li className='submenu-item'>
                                <Link to="/ReportAsists">
                                    <a className='item'>
                                        <BiSolidReport className="icon" />
                                        Reporte Asistencia
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li>
                    <Link to="/Salir">
                        <a className='item'>
                            <IoMdExit className="icon" />
                            Salir
                        </a>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
