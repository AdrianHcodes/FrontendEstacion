import { useState, useEffect } from 'react';
import "../styles/asistencia.css"
const RelojBolivia = () => {
    const [horaActual, setHoraActual] = useState('');

    useEffect(() => {
        // Función para obtener la hora actual de Bolivia
        const obtenerHoraActual = () => {
            const ahora = new Date();
            // Ajustar a la hora de Bolivia (UTC-4)
            const horaBolivia = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
            setHoraActual(horaBolivia.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };

        // Obtener la hora actual al montar el componente
        obtenerHoraActual();

        // Actualizar la hora cada segundo
        const intervalo = setInterval(() => {
            obtenerHoraActual();
        }, 1000);

        // Limpiar el intervalo cuando se desmonte el componente
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className='reloj-bolivia'>
            <h2>Hora actual en Bolivia</h2>
            <div className='hora-actual'>{horaActual}</div>
        </div>
    );
};

export default RelojBolivia;
