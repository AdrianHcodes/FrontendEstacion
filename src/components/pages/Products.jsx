import { useEffect, useState } from 'react';
import { MdModeEdit,MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";
import axios from 'axios';
import Modal from '../Modal';
import Swal from 'sweetalert2';


const Products = () => {
  const [data, setData] = useState([]); //guarda las lista de usuarios
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editData, setEditData] = useState({
    idproduct: null,
    nameproduct: '',
    price: '',
    descriptionproduct: '',
    estado: '',
    idcategory: '',
  });

  // eslint-disable-next-line no-unused-vars
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nameproduct: '',
    price: '',
    descriptionproduct: '',
    estado: '',
    idcategory: '',
  });

  const apiUrl = "http://localhost:4000/products";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/category');
        setCategory(response.data);
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
      idproduct: user.idproduct,
      nameproduct: user.nameproduct,
      price: user.price,
      descriptionproduct:user.descriptionproduct,
      estado: user.estado,
      idcategory: user.idcategory,
    });
    setSelectedCategory(user.idcategory);
    setShowModal(true);
  };

  // eslint-disable-next-line no-unused-vars
  const handleCancelUpdate = () => {
    setEditData({
      idproduct: null,
      nameproduct: '',
      price: '',
      descriptionproduct: '',
      estado: '',
      idcategory: '',
    });
    setSelectedCategory('');
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      console.error('Debe seleccionar una categoria válido');
      return;
    }
    try {
      await axios.put(`${apiUrl}/${editData.idproduct}`, {
        nameproduct: editData.nameproduct,
        price: editData.price,
        descriptionproduct: editData.descriptionproduct,
        estado: editData.estado,
        idcategory: selectedCategory,
      });

      const updatedUsers = data.map(user =>
        user.idproduct === editData.idproduct ? { ...user, idcategory: selectedCategory } : user
      );
      setData(updatedUsers);
      
      setEditData({
        idproduct: null,
        nameproduct: '',
        price: '',
        descriptionproduct: '',
        estado: '',
        idcategory: '',
      });

      setSelectedCategory('');
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
          const updatedUsers = data.filter(user => user.idproduct !== userId);
          setData(updatedUsers);
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
      nameproduct: '',
      price: '',
      descriptionproduct: '',
      estado: '',
      idcategory: '',
    });
    setSelectedCategory('');
    
  };


  //<<<<<<<<<<<<<<<<<<<<<<<< crear nuevo>>>>>>>>>>>>>>>>>>>>>
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      console.error('Debe seleccionar una categoria válido');
      return;
    }

    try {
      const response = await axios.post(apiUrl, {
        nameproduct:newUserData.nameproduct,
        price: newUserData.price,
        descriptionproduct: newUserData.descriptionproduct,
        estado: newUserData.estado,
        idcategory: selectedCategory,
      });
      setData([...data, response.data]);
      setShowAddForm(false); 
      setNewUserData({
        nameproduct: '',
        price: '',
        descriptionproduct: '',
        estado: '',
        idcategory: '',
      });
      setSelectedCategory('');
      cerrarModal();
      Swal.fire({icon: 'success',title: '¡Dato guardado correctamente!',showConfirmButton: false,timer: 1500});
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };
  
  const getCategoryName = (categoryId) => {
    const categoria = category.find( categoria=> categoria.idcategory === categoryId);
    return categoria? categoria.namecategory : 'Categoria desconocido';
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
      console.error('Error al cargar products:', error);
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
      contentLabel="Crear Nueva Producto"
      className="ModalCrearCategoria"
      >
        <form onSubmit={handleAddSubmit}>  
          <label>Nombre:</label>
          <input
            type="text"
            placeholder='Ingrese el nombre de producto'
            value={newUserData.nameproduct}
            onChange={(e) => setNewUserData({ ...newUserData, nameproduct: e.target.value })}
            required
          />
          <label>Precio</label>
          <input
            type="text"
            placeholder='Ingrese el precio'
            value={newUserData.price}
            onChange={(e) => setNewUserData({ ...newUserData, price: e.target.value })}
            required
          />
          <label>Descripcion:</label>
          <input
            type="text"
            placeholder='Ingrese el segundo apellido'
            value={newUserData.descriptionproduct}
            onChange={(e) => setNewUserData({ ...newUserData, descriptionproduct: e.target.value })}
            required
          />
          <label>Estado:</label>
          <input
            type="text"
            placeholder='Ingrese el carnet'
            value={newUserData.estado}
            onChange={(e) => setNewUserData({ ...newUserData, estado: e.target.value })}
            required
          />
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Selecciona un rol</option>
            {category.map((categoria) => (
              <option key={categoria.idcategory} value={categoria.idcategory}>{categoria.namecategory}</option>
            ))}
          </select>
          <div className="botons-modal">
            <button className='btn-guardar' type="submit" >Guardar</button>
            <button className='btn-cancelar' type="button" onClick={handleCancelAdd}>Cancelar</button>
          </div>
          
        </form>
      </Modal>
      <div className='titulo'>
          <h1>Productos</h1>
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
            <th>Precio</th>
            <th>Descripcion</th>
            <th>Estado</th>
            <th>Categoria</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          
        {currentData && currentData.length > 0 && currentData.map((object) => (
          
            <tr key={object.idproduct}>
              <td>{object.idproduct}</td>
              <td>{object.nameproduct}</td>
              <td>{object.price}</td>
              <td>{object.descriptionproduct}</td>
              <td>{object.estado}</td>
              <td>{getCategoryName(object.idcategory)}</td> 
              <td className="actions">
                <button className="btn-edit" onClick={() => handleUpdate(object)}><MdModeEdit className="edit" /></button>
                <button className="btn-delete" onClick={() =>handleDeleteUser(object.idproduct)}><MdDeleteOutline className="delete" /></button>
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
        <h2>Editar Producto</h2>
        <form onSubmit={handleUpdateSubmit}>
          <label>ID Product: {editData.idproduct}</label><br />
          <label>Nombre:</label>
          <input
            type="text"
            value={editData.nameproduct}
            onChange={(e) => setEditData({ ...editData, nameproduct: e.target.value })}
            required
          />
          <label>Precio:</label>
          <input
            type="text"
            value={editData.price}
            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
            required
          />
          <label>Description:</label>
          <input
            type="text"
            value={editData.descriptionproduct}
            onChange={(e) => setEditData({ ...editData, descriptionproduct: e.target.value })}
            required
          />
          <label>Estado:</label>
          <input
            type="text"
            value={editData.estado}
            onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
            required
          />
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Selecciona una categoria</option>
            {category.map((categoria) => (
              <option key={categoria.idcategoria} value={categoria.idcategory}>{categoria.namecategory}</option>
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



export default Products;
