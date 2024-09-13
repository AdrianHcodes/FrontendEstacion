
import { Link } from 'react-router-dom';
import { FaChartLine, FaCalendarCheck } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import "../../styles/home.css";  // Asegúrate de tener los estilos adecuados en este archivo

// Registrar los componentes necesarios de Chart.js
ChartJS.register(LineElement, PointElement, Tooltip, Legend, CategoryScale, LinearScale);

const Home = () => {
  // Datos y opciones para el gráfico de líneas
  const lineData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Ventas Mensuales',
        data: [1200, 1500, 1800, 2000, 1700],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat().format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="home">
      <h1>Bienvenido al Sistema de Control de Personal y Ventas</h1>
      
      <div className="dashboard-sections">
        <div className="dashboard-section">
          <FaChartLine className="icon" />
          <h2>Resumen de Ventas</h2>
          <p>Ventas Totales: $12,345</p>
          <p>Ventas del Día: $567</p>
        </div>
        
        <div className="dashboard-section">
          <FaCalendarCheck className="icon" />
          <h2>Resumen de Asistencia</h2>
          <p>Asistencias Totales: 98%</p>
          <p>Asistencias del Día: 95%</p>
        </div>

        {/* Tarjetas de misión y visión */}
        <div className="card">
          <h2>Misión de la Empresa</h2>
          <p>Proveer soluciones innovadoras y de alta calidad que mejoren la eficiencia y el rendimiento de nuestros clientes.</p>
        </div>

        <div className="card">
          <h2>Visión de la Empresa</h2>
          <p>Ser líderes en el mercado global ofreciendo productos y servicios que superen las expectativas y aporten valor real.</p>
        </div>

        {/* Nueva sección con gráficos y tarjeta */}
        <div className="dashboard-details">
          <div className="chart-container">
            <h2>Ventas Mensuales</h2>
            <Line data={lineData} options={lineOptions} />
          </div>

          <div className="card">
            <h2>Productos Más Vendidos</h2>
            <ul>
              <li>Producto A - 500 unidades</li>
              <li>Producto B - 300 unidades</li>
              <li>Producto C - 250 unidades</li>
              <li>Producto D - 200 unidades</li>
              <li>Producto E - 150 unidades</li>
            </ul>
            <Link to="/products">Ver Todos los Productos</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
