import { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/reportes.css"

const Reports = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [ventas, setVentas] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const getUserName = (Iduser) => {
    const user = users.find(user => user.id === Iduser);
    return user ? user.name : 'Usuario desconocido';
  };

  const generarReporte = async () => {
    try {
      const response = await axios.get('http://localhost:4000/salefecha', {
        params: {
          fechaInicio,
          fechaFin
        }
      });

      const ventasEnRango = response.data;
      setVentas(ventasEnRango);

      // Calcular el total de ventas en el rango
      const total = ventasEnRango.reduce((total, venta) => total + parseFloat(venta.total), 0);
      setTotalVentas(total);
    } catch (error) {
      console.error('Error al obtener las ventas por rango de fechas:', error);
      // Manejar el error según tus necesidades
    }
  };

  const generarDocumentoImpresion = () => {
    let contenido = '';

    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

    contenido += `--ESTACION PIZZA--\n`;
    contenido += `Reporte de Ventas\n`;
    contenido += `Fecha de Reporte: ${new Date().toLocaleDateString()}\n`;
    contenido += `Fecha de Inicio: ${new Date(fechaInicio).toLocaleDateString('es-ES', options)}\n`;
    contenido += `Fecha Fin: ${new Date(fechaFin).toLocaleDateString('es-ES', options)}\n\n`;

    contenido += '---------------------------------------\n';
    contenido += 'Fecha    | Cliente         | Total\n';
    contenido += '---------------------------------------\n';

    ventas.forEach(venta => {
        contenido += `${new Date(venta.date).toLocaleDateString().padEnd(9, ' ')}| ${venta.nameclient.padEnd(16, ' ')}| ${venta.total}\n`;
    });

    contenido += '---------------------------------------\n';
    contenido += `Total de Ventas: Bs ${totalVentas.toFixed(2)}\n`;

    return contenido;
};

  const imprimirDocumento = () => {
    const contenido = generarDocumentoImpresion();
    const ventanaImpresion = window.open('', '_blank');

    if (!ventanaImpresion) {
      alert('No se pudo abrir la ventana de impresión. Asegúrate de permitir las ventanas emergentes en tu navegador.');
      return;
    }

    ventanaImpresion.document.write(`
      <html>
          <head>
              <title>Reporte de Ventas</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      font-size: 8pt; 
                  }
                  pre {
                      white-space: pre-wrap;
                  }
                  /* Agrega estilos adicionales aquí según sea necesario */
              </style>
          </head>
          <body>
              <pre>${contenido}</pre>
          </body>
      </html>
  `);  

    ventanaImpresion.document.close();
    ventanaImpresion.print();
    ventanaImpresion.close();
  };

  return (
    <div className='body'>
      <h2>Reporte de Ventas por Rango de Fechas</h2>
      <label>Fecha de Inicio:</label>
      <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />

      <label>Fecha Fin:</label>
      <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

      <button onClick={generarReporte}>Generar Reporte</button>
      <button onClick={imprimirDocumento}>Imprimir Reporte</button>

      <div>
        <h3>Ventas en el Rango Seleccionado</h3>
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Documento</th>
              <th>Usuario</th>
              <th>Total Bs</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.idsale}>
                <td>{new Date(venta.date).toLocaleDateString()}</td>
                <td>{venta.nameclient}</td>
                <td>{venta.numdocument}</td>
                <td>{getUserName(venta.iduser)}</td>
                <td>{venta.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h2>Total de Ventas: ${totalVentas.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default Reports;
