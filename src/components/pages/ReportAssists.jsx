import { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/reportes.css";

const ReportAssists = () => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasFiltradas, setAsistenciasFiltradas] = useState([]);
  const [totalHoras, setTotalHoras] = useState(0);
  const [totalMinutos, setTotalMinutos] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAsistencias = async () => {
      try {
        const response = await axios.get('http://localhost:4000/assist');
        setAsistencias(response.data);
      } catch (error) {
        console.error('Error fetching asistencias:', error);
      }
    };

    fetchUsers();
    fetchAsistencias();
  }, []);

  const filtrarAsistencias = () => {
    let filteredAsistencias = [...asistencias];
    let horasTotales = 0;
    let minutosTotales = 0;

    // Filtrar por fechas
    if (fechaInicio && fechaFin) {
      const startDate = new Date(fechaInicio);
      const endDate = new Date(fechaFin);
      filteredAsistencias = filteredAsistencias.filter(asistencia => {
        const asistenciaDate = new Date(asistencia.date);
        return asistenciaDate >= startDate && asistenciaDate <= endDate;
      });
    }

    // Filtrar por usuario si hay un usuario seleccionado
    if (selectedUserId) {
      filteredAsistencias = filteredAsistencias.filter(asistencia => asistencia.iduser === selectedUserId);
    }

    // Calcular el total de horas y minutos
    filteredAsistencias.forEach(asistencia => {
      const { checkin, checkout } = asistencia;
      const resultado = calcularHorasEntreCheckInOut(checkin, checkout);
      const [horas, minutos] = resultado.split(' ').filter((_, index) => index % 2 === 0).map(Number);

      horasTotales += horas;
      minutosTotales += minutos;
    });

    // Convertir los minutos a horas si es mayor de 60
    if (minutosTotales >= 60) {
      horasTotales += Math.floor(minutosTotales / 60);
      minutosTotales = minutosTotales % 60;
    }

    setAsistenciasFiltradas(filteredAsistencias);
    setTotalHoras(horasTotales);
    setTotalMinutos(minutosTotales);
  };

  const generarContenidoDeImpresion = () => {
    // URL del logo. Cambia esta URL por la ruta de tu logo.
    const logoUrl = '../../assets/logo-estacion/logo-estacion.png'; // Reemplaza con la URL de tu logo
  
    let contenido = `
      <html>
      <head>
        <title>Reporte de Asistencias</title>
        <style>
          @page {
            size: 8.5in 11in; /* Tamaño carta */
            margin: 0.5in; /* Márgenes ajustados */
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          h2, h3 {
            margin: 0;
            padding: 0;
          }
          .report {
            width: 100%;
            border-collapse: collapse;
          }
          .report th, .report td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .report th {
            background-color: #f2f2f2;
          }
          /* Asegura que la tabla use todo el ancho disponible */
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          /* Añadir estilos para texto grande en la impresión */
          @media print {
            body {
              font-size: 12pt;
            }
            h2, h3 {
              font-size: 14pt;
            }
            .report {
              width: 100%;
            }
            .report td, .report th {
              font-size: 12pt;
            }
            /* Asegurar que la imagen sea visible en impresión */
            .logo {
              width: 150px; /* Ajusta el tamaño del logo según sea necesario */
              height: auto;
              display: block;
              margin-bottom: 10px;
            }
          }
        </style>
      </head>
      <body>
        <!-- Logo al comienzo del reporte -->
        <img src="${logoUrl}" alt="Logo" class="logo">
        <h2>Estacion Pizza</h2>
        <h2>Reporte de Asistencias</h2>
        <p>Fecha de Inicio: ${fechaInicio}</p>
        <p>Fecha Fin: ${fechaFin}</p>
        <p>Usuario Seleccionado: ${selectedUserId ? getUserName(selectedUserId) : 'Todos'}</p>
        <table class="report">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>CI</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Total Horas</th>
            </tr>
          </thead>
          <tbody>
            ${asistenciasFiltradas.map(asistencia => `
              <tr>
                <td>${new Date(asistencia.date).toLocaleDateString()}</td>
                <td>${getUserName(asistencia.iduser)}</td>
                <td>${getUserCi(asistencia.iduser)}</td>
                <td>${asistencia.checkin || 'No registrado'}</td>
                <td>${asistencia.checkout || 'No registrado'}</td>
                <td>${calcularHorasEntreCheckInOut(asistencia.checkin, asistencia.checkout)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <br />
        <h3>Total de Horas: ${totalHoras} horas ${totalMinutos} minutos</h3>
      </body>
      </html>
    `;
  
    return contenido;
  };
    

  const imprimirReporte = () => {
    const contenido = generarContenidoDeImpresion();
    
    const ventanaImpresion = window.open('', '', 'height=800,width=600');
    ventanaImpresion.document.open();
    ventanaImpresion.document.write(contenido);
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
  };

  const getUserName = (Id) => {
    const user = users.find(user => user.id === Id);
    return user ? user.name : 'Usuario desconocido';
  };

  const getUserCi = (Id) => {
    const user = users.find(user => user.id === Id);
    return user ? user.ciuser : 'No encontrado';
  };

  const calcularHorasEntreCheckInOut = (checkin, checkout) => {
    let horas = 0;
    let minutos = 0;
  
    if (!checkin || !checkout) {
      return '0 horas 0 minutos';
    }
  
    try {
      const checkinDate = new Date(`2000-01-01T${checkin}`);
      const checkoutDate = new Date(`2000-01-01T${checkout}`);
  
      // Verificar si las fechas son válidas
      if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
        return '0 horas 0 minutos';
      }
  
      const diferenciaMs = checkoutDate - checkinDate;
  
      // Verificar si la diferencia es negativa
      if (diferenciaMs < 0) {
        return '0 horas 0 minutos';
      }
  
      // Calcular horas y minutos
      horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
      minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));
  
      return `${horas} horas ${minutos} minutos`;
    } catch (error) {
      console.error('Error al calcular horas:', error);
      return '0 horas 0 minutos';
    }
  };
  

  return (
    <div className='body'>
      <h2>Reporte de Asistencias por Rango de Fechas</h2>

      <label>Fecha de Inicio:</label>
      <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />

      <label>Fecha Fin:</label>
      <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />

      <label>Seleccionar Usuario:</label>
      <select
        value={selectedUserId !== null ? selectedUserId : ''}
        onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value, 10) : null)}
      >
        <option value="">Seleccionar usuario</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>

      <button onClick={filtrarAsistencias}>Generar Reporte</button>
      <button onClick={imprimirReporte}>Imprimir Reporte</button>

      <div>
        <h3>Asistencias en el Rango Seleccionado</h3>
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Usuario</th>
              <th>CI</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Total Horas</th>
            </tr>
          </thead>
          <tbody>
            {asistenciasFiltradas.map((asistencia) => {
              const resultado = calcularHorasEntreCheckInOut(asistencia.checkin, asistencia.checkout);
              // eslint-disable-next-line no-unused-vars
              const [horas, minutos] = resultado.split(' ').filter((_, index) => index % 2 === 0).map(Number);

              return (
                <tr key={asistencia.idassist}>
                  <td>{new Date(asistencia.date).toLocaleDateString()}</td>
                  <td>{getUserName(asistencia.iduser)}</td>
                  <td>{getUserCi(asistencia.iduser)}</td>
                  <td>{asistencia.checkin || 'No registrado'}</td>
                  <td>{asistencia.checkout || 'No registrado'}</td>
                  <td>{resultado}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
        <h2>Total de Horas: {totalHoras} horas {totalMinutos} minutos</h2>
      </div>
    </div>
  );
};

export default ReportAssists;
