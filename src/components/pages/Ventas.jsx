import { useEffect, useState } from "react";
import axios from 'axios';
import { MdOutlineFirstPage, MdOutlineLastPage } from "react-icons/md";
import "../../styles/table.css";

const Ventas = () =>{

    const [venta, setVenta] = useState([]);
    /////////
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6); // Número de filas por página
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    
    const fechData =()=>{
        return axios.get("http://localhost:4000/sale/")
        .then((response)=>setVenta(response.data));
    }
    useEffect(()=>{
        fechData();
    },[])

    //<<<<< buscar >>>>>>
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

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // El mes comienza desde 0
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    ///////////////
     // Lógica de paginación
     const indexOfLastUser = currentPage * usersPerPage;
     const indexOfFirstUser = indexOfLastUser - usersPerPage;
     const currentVenta = venta.slice(indexOfFirstUser, indexOfLastUser);
    return(
        <div className='tabla-container'>
        <h1>Lista de Ventas</h1>
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
              <th>Cliente</th>
              <th>Documento</th>
              <th>Total Bs</th>
              <th>Fecha</th>
              
            </tr>
          </thead>
          <tbody>
          {currentVenta && currentVenta.length > 0 && currentVenta.map((Object) => (
              <tr key={Object.idsale}>
                <td>{Object.idsale}</td>
                <td>{Object.nameclient}</td>
                <td>{Object.numdocument}</td>
                <td>{Object.total}</td>
                <td>{formatDate(Object.date)}</td>
              </tr>
            ))}
          </tbody>
          
          
        </table>
        <div className="pagination">
                <MdOutlineFirstPage className="iconpage"/> 
                {Array.from({ length: Math.ceil(venta.length / usersPerPage) }, (_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                ))}
                <MdOutlineLastPage className="iconpage"/>
            </div>
      </div>
    );
}

export default Ventas;