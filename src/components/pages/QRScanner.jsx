import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { decode } from 'jsqr';

const QRScanner = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [mensaje, setMensaje] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [ultimoQR, setUltimoQR] = useState(null);

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
            const code = decode(imageData.data, videoWidth, videoHeight);
            
            if (code) {
                setUltimoQR(code.data);
                // Guardar tanto el check-in como el check-out
                guardarAsistencia(code.data, 'checkin');
                setTimeout(() => guardarAsistencia(code.data, 'checkout'), 5000); // Ejemplo de guardar check-out después de 5 segundos
            } else {
                setMensaje('No se detectó ningún código QR. Intenta nuevamente.');
            }
        }
    };
    
    const apiUrl = "http://localhost:4000/assits";

    const guardarAsistencia = async (data, tipo) => {
        try {
            const response = await axios.post(apiUrl, {
                idUsuario: data,
                fecha: new Date().toISOString(),
                tipo: tipo // 'checkin' o 'checkout'
            });

            console.log(`${tipo} guardado para el usuario ${data}:`, response.data);
            setMensaje(`${tipo === 'checkin' ? 'Check-in' : 'Check-out'} guardado correctamente.`);
        } catch (error) {
            console.error(`Error al guardar ${tipo}:`, error);
            setMensaje(`Error al guardar ${tipo}. Intenta nuevamente.`);
        }
    };

    return (
        <div>
            <h2>Lector de QR para Asistencia</h2>
            <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }}></video>
            <br />
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <br />
            <button onClick={escanearQR}>Escanear QR</button>
            <br />
            
        </div>
    );
};

export default QRScanner;
