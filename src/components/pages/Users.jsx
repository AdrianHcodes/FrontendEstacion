import { useEffect, useState } from 'react';
import { MdModeEdit,MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";
import axios from 'axios';
import Modal from '../Modal';
import Swal from 'sweetalert2';
// eslint-disable-next-line no-unused-vars
import GenerarQR from '../GenerarQR.jsx';

const Users = () => {
  const [users, setUsers] = useState([]); //guarda las lista de usuarios
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [roles, setRoles] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [mostrarQR, setMostrarQR] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [editData, setEditData] = useState({
    id: null,
    name: '',
    lastname1: '',
    lastname2: '',
    ciuser: '',
    email: '',
    password: '',
    loginuser: '',
    roluser: '',
  });

  // eslint-disable-next-line no-unused-vars
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    lastname1: '',
    lastname2: '',
    ciuser: '',
    email: '',
    password: '',
    loginuser: '',
    roluser: '',
  });

  const apiUrl = "http://localhost:4000/users";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/rol');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchUsers();
    fetchRoles();
  }, []);

//<<<<<<<<<<<<<<<<<<<<<<<<<<actualizar>>>>>>>>>>>>>>>>>>>>>>
  const handleUpdate = (user) => {
    setEditData({
      id: user.id,
      name: user.name,
      lastname1: user.lastname1,
      lastname2: user.lastname2,
      ciuser: user.ciuser,
      email: user.email,
      roluser: user.roluser,
      loginuser: user.loginuser,
      password: user.password,
    });
    setSelectedRole(user.roluser);
    setShowModal(true);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCancelUpdate = () => {
    setEditData({
      id: null,
      name: '',
      lastname1: '',
      lastname2: '',
      ciuser: '',
      email: '',
      roluser: '',
      password: '',
      loginuser: '',
    });
    setSelectedRole('');
  };
  const handleUsuarioChange = (event) => {
    setUsuarioSeleccionado(event.target.value);
    setMostrarQR(false); // Resetear el estado de mostrar QR cuando cambia el usuario seleccionado
};

const handleGenerarQR = () => {
  if (usuarioSeleccionado) {
    setMostrarQR(true);
  } else {
    alert('Por favor, selecciona un usuario.');
  }
};


const abrirModalQR = () => {
  setShowQRModal(true);
};

const cerrarModalQR = () => {
  setShowQRModal(false);
  setMostrarQR(false);
};
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      console.error('Debe seleccionar un rol válido');
      return;
    }
    try {
      await axios.put(`${apiUrl}/${editData.id}`, {
        name: editData.name,
        lastname1: editData.lastname1,
        lastname2: editData.lastname2,
        ciuser: editData.ciuser,
        email: editData.email,
        roluser: selectedRole,
        password: editData.password,
        loginuser: editData.loginuser,
      });
      

      const updatedUsers = users.map(user =>
        user.id === editData.id ? { ...user, roluser: selectedRole } : user
      );
      setUsers(updatedUsers);
      
      setEditData({
        id: null,
        name: '',
        lastname1: '',
        lastname2: '',
        ciuser: '',
        email: '',
        roluser: '',
        password: '',
        loginuser: '',
      });

      setSelectedRole('');
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  //<<<<<<<<<<<<<<<<<<<eliminar>>>>>>>>>>>>>>>>>>>>>>>>
  const handleDeleteUser = async (userId) => {
    try {
      //
      if(Swal.fire({
        icon:'warning',
        text:'¿Esta seguro de eliminar este registro?',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText:'Si',
      }).then(async respuesta=>{
        if(respuesta.isConfirmed){
          const response = await axios.delete(`${apiUrl}/${userId}`);
          console.log('User deleted:', response.data);
          const updatedUsers = users.filter(user => user.id !== userId);
          setUsers(updatedUsers);
          Swal.fire({text:'Se elimino correctamente',icon:'success',showConfirmButton: false,timer: '1500'})
        }
      })){return}
      //
     
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  

  const handleCancelAdd = () => {
    setModalCrearAbierto(false);
    setShowAddForm(false);
    cerrarModal();
    setNewUserData({
      name: '',
      lastname1: '',
      lastname2: '',
      ciuser: '',
      email: '',
      password: '',
      loginuser: '',
      roluser: '',
    });
    setSelectedRole('');
    
  };


  //<<<<<<<<<<<<<<<<<<<<<<<< crear nuevo>>>>>>>>>>>>>>>>>>>>>
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      console.error('Debe seleccionar un rol válido');
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        name: newUserData.name,
        lastname1: newUserData.lastname1,
        lastname2: newUserData.lastname2,
        ciuser: newUserData.ciuser,
        email: newUserData.email,
        roluser: selectedRole,
        password: newUserData.password,
        loginuser: newUserData.loginuser,
      });
      setUsers([...users, response.data]);
      setShowAddForm(false); 
      setNewUserData({
        name: '',
        lastname1: '',
        lastname2: '',
        ciuser: '',
        email: '',
        password: '',
        loginuser: '',
        roluser: '',
      });
      setSelectedRole('');
      cerrarModal();
      Swal.fire({icon: 'success',title: '¡Dato guardado correctamente!',showConfirmButton: false,timer: 1500});
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  const getRoleName = (roleId) => {
    const role = roles.find(role => role.idrol === roleId);
    return role ? role.namerol : 'Rol desconocido';
  };
 
  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< controlers botones >>>>>>>>>>>>>>>>>>>>>>>>
  // eslint-disable-next-line no-unused-vars
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const abrirModalCrear = () => {
    setModalCrearAbierto(true);
  };
  const cerrarModal = () => {
    setModalCrearAbierto(false);
    // Limpiar campos del formulario al cerrar el modal
  };

  const [showModal, setShowModal] = useState(false);
  
  const handleGuardar = () => { //alerta boton guardar (actualizar)
    cargarDatos();
    Swal.fire({icon: 'success',title: '¡Dato guardado correctamente!',showConfirmButton: false,timer: 1500});
  }
  const handleCancelar = () => { //alerta boton cancelar (actualizar)
    cerrarModal();
    setShowModal(false)
    Swal.close();  
  }
  const cargarDatos = async () => {
    try {
      const response = await axios.get(apiUrl);
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

//-------------------------------------------------------------------

const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6); // Número de filas por página
  const handlePageChange = (pageNumber) => {setCurrentPage(pageNumber);};
  ////<<<<< buscar >>>>>>
  const handleFiltroChange = (e) => {
      const filtro = e.target.value.toLowerCase();
      const rows = document.querySelectorAll(".tabla-usuarios tbody tr");
      rows.forEach(row => {
      let found = false;
      row.childNodes.forEach(cell => {
      const text = cell.innerText.toLowerCase();
      if (text.includes(filtro)) {
        found = true;
      }
      });
      if (found) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  };
  // Lógica de paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentCategory = users.slice(indexOfFirstUser, indexOfLastUser);
  
  

  return (
    <div>
      
      <Modal
      isOpen={modalCrearAbierto}
      onRequestClose={cerrarModal}
      contentLabel="Crear Nueva Categoría"
      className="ModalCrearCategoria"
      >
        <form onSubmit={handleAddSubmit}>
         
          <label>Nombre:</label>
          <input
            type="text"
            placeholder='Ingrese el nombre'
            value={newUserData.name}
            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
            required
          />
          <label>Primer Apellido:</label>
          <input
            type="text"
            placeholder='Ingrese el primer apellido'
            value={newUserData.lastname1}
            onChange={(e) => setNewUserData({ ...newUserData, lastname1: e.target.value })}
            required
          />
          <label>Segundo Apellido:</label>
          <input
            type="text"
            placeholder='Ingrese el segundo apellido'
            value={newUserData.lastname2}
            onChange={(e) => setNewUserData({ ...newUserData, lastname2: e.target.value })}
            required
          />
          <label>CI:</label>
          <input
            type="text"
            placeholder='Ingrese el carnet'
            value={newUserData.ciuser}
            onChange={(e) => setNewUserData({ ...newUserData, ciuser: e.target.value })}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            placeholder='Ingrese el email'
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
            required
          />
          <label>Contraseña:</label>
          <input
            type="text"
            placeholder='Ingrese la contraseña'
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
            required
          />
          <label>Login User:</label>
          <input
            type="text"
            placeholder='Ingrese el ususario de acceso'
            value={newUserData.loginuser}
            onChange={(e) => setNewUserData({ ...newUserData, loginuser: e.target.value })}
            required
          />
          <label>Rol:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.idrol} value={role.idrol}>{role.namerol}</option>
            ))}
          </select>
          <div className="botons-modal">
            <button className='btn-guardar' type="submit" >Guardar</button>
            <button className='btn-cancelar' type="button" onClick={handleCancelAdd}>Cancelar</button>
          </div>
          
        </form>
      </Modal>
      <div className='titulo'>
          <h1>Lista de Usuarios</h1>
          <button className="crearCategoriaButton" onClick={abrirModalCrear}>
                Nuevo
                <IoIosAddCircleOutline  className="icon"/>
          </button>
          <div>
      <button onClick={abrirModalQR}>Abrir Modal de QR</button>

      <Modal isOpen={showQRModal} onRequestClose={cerrarModalQR}>
        <header className="App-header">
          <label htmlFor="usuario">Selecciona un usuario:</label>
          <select id="usuario" value={usuarioSeleccionado} onChange={handleUsuarioChange}>
            <option value="">Selecciona un usuario</option>
            {users.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.name}
              </option>
            ))}
          </select>
          <button onClick={handleGenerarQR}>Generar QR</button>
        </header>
        <main>
          {mostrarQR && <GenerarQR idUsuario={usuarioSeleccionado} />}
        </main>
        <button onClick={cerrarModalQR}>Cerrar</button>
      </Modal>
    </div>
      </div>
        <div className="filtro-container">
        <input
            type="text"
            placeholder="Buscar por nombre o estado"
            className="filtro-input"
            onChange={handleFiltroChange}
        />
        </div>
      
      <table className='tabla-usuarios'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido1</th>
            <th>Apellido2</th>
            <th>ci</th>
            <th>Email</th>
            <th>Loginuser</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {currentCategory && currentCategory.length > 0 && currentCategory.map((user) => (
          
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.lastname1}</td>
              <td>{user.lastname2}</td>
              <td>{user.ciuser}</td>
              <td>{user.email}</td>
              <td>{user.loginuser}</td>
              <td>{getRoleName(user.roluser)}</td>
              <td className="actions">
                <button className="btn-edit" onClick={() => handleUpdate(user)}><MdModeEdit className="edit" /></button>
                <button className="btn-delete" onClick={() =>handleDeleteUser(user.id)}><MdDeleteOutline className="delete" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
                <MdOutlineFirstPage className="iconpage"/> 
                {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                ))}
                <MdOutlineLastPage className="iconpage"/>
        </div>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div>
        <h2>Editar Usuario</h2>
        <form onSubmit={handleUpdateSubmit}>
          <label>ID Usuario: {editData.id}</label><br />
          <label>Nombre:</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            required
          />
          <label>Apellido 1:</label>
          <input
            type="text"
            value={editData.lastname1}
            onChange={(e) => setEditData({ ...editData, lastname1: e.target.value })}
            required
          />
          <label>Apellido 2:</label>
          <input
            type="text"
            value={editData.lastname2}
            onChange={(e) => setEditData({ ...editData, lastname2: e.target.value })}
            required
          />
          <label>CI:</label>
          <input
            type="text"
            value={editData.ciuser}
            onChange={(e) => setEditData({ ...editData, ciuser: e.target.value })}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            required
          />
          <label>Password:</label>
          <input
            type="text"
            value={editData.password}
            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
            required
          />
          <label>Loginuser:</label>
          <input
            type="text"
            value={editData.loginuser}
            onChange={(e) => setEditData({ ...editData, loginuser: e.target.value })}
            required
          />
          <label>Rol:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((role) => (
              <option key={role.idrol} value={role.idrol}>{role.namerol}</option>
            ))}
          </select>
          <div className="botons-modal">
            <button type="submit" className="btn-guardar" onClick={handleGuardar}>Guardar</button>
            <button type="button" className="btn-cancelar" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </div>
      </Modal>
      
    </div>
    
  );
};

export default Users;
