import { useEffect, useState } from "react";
import axios from 'axios';
import { MdOutlineFirstPage, MdOutlineLastPage,MdModeEdit,MdDeleteOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import "../../styles/table.css";
import Swal from 'sweetalert2';
import Modal from '../Modal.jsx';

const Category = (  ) =>{

  //llamado al api de categorias
  const apiUrl = "http://localhost:4000/category"; // ajusta la URL según tu configuración
  const [data, setData] = useState([]);  //data es lista de categorias, y setdata es poner un objeto al data 

  //modal para actualizar datos
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    idcategory: null,
    namecategory: '',
    estado: ''
  });

  const handleGuardar = () => { //alerta boton guardar (actualizar)
    Swal.fire({icon: 'success',title: '¡Dato guardado correctamente!',showConfirmButton: false,timer: 1500});
  }
  const handleCancelar = () => { //alerta boton cancelar (actualizar)
    Swal.close();  
  }

  // Función para manejar la apertura del modal con los datos a editar
  const handleUpdate = (item) => {
    setEditData({
      idcategory: item.idcategory,
      namecategory: item.namecategory,
      estado: item.estado
    });
    setShowModal(true);
  };

  // Función para enviar la solicitud de actualización al backend usando Axios
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.put(`${apiUrl}/${editData.idcategory}`, {
        namecategory: editData.namecategory,
        estado: editData.estado
      });
      const updatedData = data.map(item => {
        if (item.idcategory === editData.idcategory) { 
          return {
            ...item,
            namecategory: editData.namecategory,
            estado: editData.estado
          };
        }
        return item;
      });     
      setData(updatedData);
      setShowModal(false); // Cierra el modal después de la actualización
    } catch (error) {
      console.error('Error updating data:', error);
      // Maneja los errores de acuerdo a tus necesidades
    }
  
  };

  const fechData =()=>{
    return axios.get(`${apiUrl}`)
    .then((response)=>setData(response.data));
  }
  useEffect(()=>{fechData();},[])

///modal para boton crear//
const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
const [idCategoryCrear, setIdCategoryCrear] = useState('');
const [nameCategoryCrear, setNameCategoryCrear] = useState('');
const [estadoCrear, setEstadoCrear] = useState('');
const [loadingCrear, setLoadingCrear] = useState(false);

const abrirModalCrear = () => {
  setModalCrearAbierto(true);
};
const cerrarModalCrear = () => {
  setModalCrearAbierto(false);
  // Limpiar campos del formulario al cerrar el modal
  setIdCategoryCrear('');
  setNameCategoryCrear('');
  setEstadoCrear('');
};
useEffect(() => {
  cargarCategorias();
}, []);

//actulizar datos automaticamnete
const cargarCategorias = async () => {
  try {
    const response = await axios.get(apiUrl);
    setData(response.data);
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
};

//<<<<<<<< crear categoria >>>>>>>>//
const handleCrearCategoria = async () => {
  setLoadingCrear(true);
  try {
    const estadoFinal = estadoCrear || "activo";
    // eslint-disable-next-line no-unused-vars
    const response = await axios.post(apiUrl, {
      idcategory: idCategoryCrear,
      namecategory: nameCategoryCrear,
      estado: estadoFinal
    });
    Swal.fire({text:'Se creo el registro correctamente',icon:'success',showConfirmButton: false,timer: '1500'})
    cargarCategorias();
    setLoadingCrear(false);
    cerrarModalCrear(); 
  } catch (error) {
    setLoadingCrear(false);
  }
};

//<<<<<<eliminar>>>>>>>//
  const handleDelete = async (itemId) => {
    try {
        if(Swal.fire({
          icon:'warning',
          text:'¿Esta seguro de eliminar este registro?',
          showDenyButton: true,
          denyButtonText: 'No',
          confirmButtonText:'Si',
        }).then(async respuesta=>{
          if(respuesta.isConfirmed){
            const response = await axios.delete(`${apiUrl}/${itemId}`);
            console.log('Item deleted:', response.data);
            const updatedItems = data.filter(item => item.idcategory !== itemId);
            setData(updatedItems);
            Swal.fire({text:'Se elimino correctamente',icon:'success',showConfirmButton: false,timer: '1500'})
          }
        })){return}
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // busqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Número de filas por página
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
  const currentCategory = data.slice(indexOfFirstUser, indexOfLastUser);

  return(

    <div>
      <Modal
      isOpen={modalCrearAbierto}
      onRequestClose={cerrarModalCrear}
      contentLabel="Crear Nueva Categoría"
      className="ModalCrearCategoria"
      >
      <h2>Crear Nueva Categoría</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleCrearCategoria(); }}>
      <br />
        <label>Nombre Categoría:</label>
        <input type="text" value={nameCategoryCrear} onChange={(e) => setNameCategoryCrear(e.target.value)} />
        <label>Estado:</label>
        <select
          value={estadoCrear }
          onChange={(e) => setEstadoCrear(e.target.value)}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      <br />
      {loadingCrear ? (
        <p>Creando categoría...</p>
      ) : ( 
        <div className="botons-modal">
          <button className ='btn-guardar' type="submit">Guardar</button>
          <button className="btn-cancelar" onClick={cerrarModalCrear}>Cancelar</button>
        </div>
      )}
    </form>
  </Modal>
  <div className='titulo'>
    <h1>Categorias</h1>
    <button className="crearCategoriaButton" onClick={abrirModalCrear}>
          Nuevo
          <IoIosAddCircleOutline  className="icon"/>
        </button>
  </div>    
        <div className="filtro-container">
        <input
            type="text"
            placeholder="Buscar por nombre o estado"
            className="filtro-input"
            onChange={handleFiltroChange}
        />
        </div>
        
        <table className="tabla-usuarios">
          <thead className="head">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {currentCategory && currentCategory.length > 0 && currentCategory.map((Object) => (
              <tr key={Object.id}>
                <td>{Object.idcategory}</td>
                <td>{Object.namecategory}</td>
                <td>{Object.estado}</td>
                <td className="actions">
                    <button className="btn-edit" onClick={() => handleUpdate(Object)}><MdModeEdit className="edit" /></button>
                    <button className="btn-delete" onClick={() =>handleDelete (Object.idcategory)}><MdDeleteOutline className="delete" /></button>
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
        <h2>Editar Categoría</h2>
        <form onSubmit={handleUpdateSubmit}>
          <label>ID Categoría: {editData.idcategory}</label>
          <input
            type="text"
            value={editData.namecategory}
            onChange={(e) => setEditData({ ...editData, namecategory: e.target.value })}
            required
          />
          <label>Estado:</label>
          <select
            value={editData.estado}
            onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <div className="botons-modal">
            <button className="btn-guardar" type="submit" onClick={handleGuardar}>Guardar</button>
            <button className="btn-cancelar" type="submit" onClick={handleCancelar}>Cancelar</button>
          </div>
        </form>
      </Modal>

      </div>
      
    );
}

export default Category;