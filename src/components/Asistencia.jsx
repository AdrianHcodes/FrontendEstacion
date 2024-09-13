import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import jsQR from 'jsqr';
import Swal from 'sweetalert2';
import "../styles/asistencia.css";
import RelojBolivia from '../components/horaActual.jsx';

const Asistencia = () => {
    const apiUrl = 'http://localhost:4000/users';
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useState([]);
    const [assistencias, setAsistencias] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [mensaje, setMensaje] = useState('');
    const [ultimoQR, setUltimoQR] = useState(null);

    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                const response = await axios.get('http://localhost:4000/assist');
                setAsistencias(response.data);
            } catch (error) {
                console.error('Error al obtener asistencias:', error);
            }
        };

        const fetchUsuarios = async () => {
            try {
                const response = await axios.get(apiUrl);
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchAsistencias();
        fetchUsuarios();
    }, []);

    useEffect(() => {
        iniciarCamara();
    }, []);

    const iniciarCamara = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            setMensaje('No se pudo acceder a la cámara. Verifica los permisos o intenta en otro navegador.');
        }
    };

    const escanearQR = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const { videoWidth, videoHeight } = video;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            context.drawImage(video, 0, 0, videoWidth, videoHeight);

            const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
            const code = jsQR(imageData.data, videoWidth, videoHeight);

            if (code) {
                try {
                    const userData = JSON.parse(code.data);

                    if (userData.id) {
                        setUltimoQR(code.data);
                        guardarAsistencia(userData.id);
                    } else {
                        setMensaje('No se encontró ID de usuario en el código QR.');
                    }
                } catch (error) {
                    setMensaje('Error al parsear JSON del código QR.');
                }
            } else {
                setMensaje('No se detectó ningún código QR. Intenta nuevamente.');
            }
        }
    };

    const escanearQR2 = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const { videoWidth, videoHeight } = video;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
            context.drawImage(video, 0, 0, videoWidth, videoHeight);

            const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
            const code = jsQR(imageData.data, videoWidth, videoHeight);

            if (code) {
                try {
                    const userData = JSON.parse(code.data);

                    if (userData.id) {
                        setUltimoQR(code.data);
                        guardarAsistencia2(userData.id);
                    } else {
                        setMensaje('No se encontró ID de usuario en el código QR.');
                    }
                } catch (error) {
                    setMensaje('Error al parsear JSON del código QR.');
                }
            } else {
                setMensaje('No se detectó ningún código QR. Intenta nuevamente.');
            }
        }
    };

    const guardarAsistencia2 = async (data) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.put(`http://localhost:4000/assist/${data}`, {
                iduser: data,
                date: new Date().toISOString(),
                checkout: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            Swal.fire({ text: 'Salida guardada correctamente', icon: 'success', showConfirmButton: false, timer: 1800 });
            await fetchAsistencias();
        } catch (error) {
            Swal.fire({ text: 'Error al guardar la asistencia, intente nuevamente', icon: 'error', showConfirmButton: false, timer: 1400 });
        }
    };

    const guardarAsistencia = async (data) => {
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await axios.post(`http://localhost:4000/assist/${data}`, {
                date: new Date().toISOString(),
                checkin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            Swal.fire({ text: 'Entrada guardada correctamente', icon: 'success', showConfirmButton: false, timer: 1800 });
            await fetchAsistencias();
        } catch (error) {
            Swal.fire({ text: 'Error al guardar la asistencia, intente nuevamente', icon: 'error', showConfirmButton: false, timer: 1400 });
            setMensaje('Error al guardar la asistencia. Intenta nuevamente.');
        }
    };

    const fetchAsistencias = async () => {
        try {
            const response = await axios.get('http://localhost:4000/assist');
            setAsistencias(response.data);
        } catch (error) {
            console.error('Error al obtener asistencias:', error);
        }
    };

    // Obtener la fecha actual
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Filtrar las asistencias para mostrar solo las del día actual
    const asistenciasDelDia = assistencias.filter(asistencia => 
        new Date(asistencia.date).toISOString().split('T')[0] === today
    );

    const getUserName = (Id) => {
        const object = users.find(object => object.id === Id);
        return object ? object.name : 'no encontrado';
    };
    const getUserCi = (Id) => {
        const object = users.find(object => object.id === Id);
        return object ? object.ciuser : 'no encontrado';
    };
    const calcularHorasEntreCheckInOut = (checkin, checkout) => {
        // Parsear las horas a objetos Date
        const checkinDate = new Date(`2000-01-01T${checkin}`);
        const checkoutDate = new Date(`2000-01-01T${checkout}`);

        // Calcular la diferencia en milisegundos
        const diferenciaMs = checkoutDate - checkinDate;

        // Convertir la diferencia a horas y minutos
        const horas = Math.floor(diferenciaMs / (1000 * 60 * 60));
        const minutos = Math.floor((diferenciaMs % (1000 * 60 * 60)) / (1000 * 60));

        // Formatear la salida
        return `${horas} horas ${minutos} minutos`;
    };

    

    return (
        <div className="App">
            <div className='menu-asistencia'>
                <div>
                    <RelojBolivia />
                    <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }}></video>
                    <br />
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

                    <div className='botones'>
                        <button className='btn-entrada' onClick={escanearQR}>Entrada</button>
                        <button className='btn-salida' onClick={escanearQR2}>Salida</button>
                    </div>

                    <br />
                    {ultimoQR && <p>Último código QR escaneado: {ultimoQR}</p>}
                    {mensaje && <p>{mensaje}</p>}
                </div>
            </div>

            <div className='tabla-asistencias'>
                <h2>Asistencias del Día</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>CI</th>
                            <th>Fecha</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Horas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asistenciasDelDia.map((asistencia) => (
                            <tr key={asistencia.id}>
                                <td>{asistencia.iduser}</td>
                                <td>{getUserName(asistencia.iduser)}</td>
                                <td>{getUserCi(asistencia.iduser)}</td>
                                <td>{new Date(asistencia.date).toLocaleDateString()}</td>
                                <td>{asistencia.checkin || 'No registrado'}</td>
                                <td>{asistencia.checkout || 'No registrado'}</td>
                                <td>{calcularHorasEntreCheckInOut(asistencia.checkin, asistencia.checkout) }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Asistencia;
