import { useEffect, useState } from 'react';
import { MdModeEdit,MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";
import axios from 'axios';
import Modal from '../Modal';
import Swal from 'sweetalert2';


const Rol = () => {
  const [data, setData] = useState([]); //guarda las lista de usuarios
  const [editData, setEditData] = useState({
    idrol: null,
    namerol: '',
    descriptionrol: '',
    staterol: '',
  });

  // eslint-disable-next-line no-unused-vars
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    namerol: '',
    descriptionrol: '',
    staterol: '',
  });

  const apiUrl = "http://localhost:4000/rol";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchUsers();
  }, []);

//<<<<<<<<<<<<<<<<<<<<<<<<<<actualizar>>>>>>>>>>>>>>>>>>>>>>
  const handleUpdate = (user) => {
    setEditData({
      idrol: user.idrol,
      namerol:user.namerol,
      descriptionrol: user.descriptionrol,
      staterol: user.staterol,
    });
    setShowModal(true);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCancelUpdate = () => {
    setEditData({
      idrol: null,
      namerol: '',
      descriptionrol: '',
      staterol: '',
    });
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/${editData.idrol}`, {
        namerol: editData.namerol,
        descriptionrol: editData.descriptionrol,
        staterol: editData.staterol,
      });
      
      const updatedData = data.map(item => {
        if (item.idrol === editData.idrol) { 
          return {
            ...item,
            namerol: editData.namerol,
            descriptionrol: editData.descriptionrol,
            staterol: editData.staterol
          };
        }
        return item;
      });     
      setData(updatedData);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating rol:', error);
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
          console.log('Rol deleted:', response.data);
          const updatedUsers = data.filter(user => user.idrol !== userId);
          setData(updatedUsers);
          Swal.fire({text:'Se elimino correctamente',icon:'success',showConfirmButton: false,timer: '1500'})
        }
      })){return}
      //
     
    } catch (error) {
      console.error('Error deleting rol:', error);
    }
  };

  

  const handleCancelAdd = () => {
    setModalCrearAbierto(false);
    setShowAddForm(false);
    cerrarModal();
    setNewUserData({
      namerol: '',
      descriptionrol: '',
      staterol: '',
    });
  };


  //<<<<<<<<<<<<<<<<<<<<<<<< crear nuevo>>>>>>>>>>>>>>>>>>>>>
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const estadoFinal = newUserData.staterol || "activo";
      const response = await axios.post(apiUrl, {
        namerol: newUserData.namerol,
        descriptionrol: newUserData.descriptionrol,
        staterol: estadoFinal,
      });
      setData([...data, response.data]);
      setShowAddForm(false); 
      setNewUserData({
        namerol: '',
        descriptionrol: '',
        staterol: '',
        
      });
      cerrarModal();
      Swal.fire({icon: 'success',title: '¡Dato guardado correctamente!',showConfirmButton: false,timer: 1500});
    } catch (error) {
      console.error('Error adding user:', error);
    }
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
      setData(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

//-------------------------------------------------------------------

const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7); // Número de filas por página
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
  const currentData = data.slice(indexOfFirstUser, indexOfLastUser);


  return (
    <div>
      
      <Modal
      isOpen={modalCrearAbierto}
      onRequestClose={cerrarModal}
      contentLabel="Crear Nueva Rol"
      className="ModalCrearCategoria"
      >
        <form onSubmit={handleAddSubmit}>  
          <label>Nombre:</label>
          <input
            type="text"
            placeholder='Ingrese el nombre de producto'
            value={newUserData.namerol}
            onChange={(e) => setNewUserData({ ...newUserData, namerol: e.target.value })}
            required
          />
          <label>Descripcion</label>
          <input
            type="text"
            placeholder='Ingrese el precio'
            value={newUserData.descriptionrol}
            onChange={(e) => setNewUserData({ ...newUserData, descriptionrol: e.target.value })}
            required
          />
          <label>Estado:</label>
          <select
            value={editData.staterol}
            onChange={(e) => setEditData({ ...editData, staterol: e.target.value })}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <div className="botons-modal">
            <button className='btn-guardar' type="submit" >Guardar</button>
            <button className='btn-cancelar' type="button" onClick={handleCancelAdd}>Cancelar</button>
          </div>
        </form>
      </Modal>
      <div className='titulo'>
          <h1>Lista de Roles</h1>
          <button className="crearCategoriaButton" onClick={abrirModalCrear}>
                Nuevo
                <IoIosAddCircleOutline  className="icon"/>
          </button>
      </div>
        <div className="filtro-container">
        <input type="text"
               onChange={handleFiltroChange} 
               className="filtro-input"
               placeholder="Buscar..." />
        </div>
      
      <table className='tabla-usuarios'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          
        {currentData && currentData.length > 0 && currentData.map((object) => (
          
            <tr key={object.idrol}>
              <td>{object.idrol}</td>
              <td>{object.namerol}</td>
              <td>{object.descriptionrol}</td>
              <td>{object.staterol}</td>
              <td className="actions">
                <button className="btn-edit" onClick={() => handleUpdate(object)}><MdModeEdit className="edit" /></button>
                <button className="btn-delete" onClick={() =>handleDeleteUser(object.idrol)}><MdDeleteOutline className="delete" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
                <MdOutlineFirstPage className="iconpage"/> 
                {Array.from({ length: Math.ceil(data.length / usersPerPage) }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                ))}
                <MdOutlineLastPage className="iconpage"/>
        </div>
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div>
        <h2>Editar Rol</h2>
        <form onSubmit={handleUpdateSubmit}>
          <label>ID Rol: {editData.idrol}</label><br />
          <label>Nombre:</label>
          <input
            type="text"
            value={editData.namerol}
            onChange={(e) => setEditData({ ...editData, namerol: e.target.value })}
            required
          />
          <label>Descripcion:</label>
          <input
            type="text"
            value={editData.descriptionrol}
            onChange={(e) => setEditData({ ...editData, descriptionrol: e.target.value })}
            required
          />
          <label>Estado:</label>
          <select
            value={editData.staterol}
            onChange={(e) => setEditData({ ...editData, staterol: e.target.value })}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
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



export default Rol;
