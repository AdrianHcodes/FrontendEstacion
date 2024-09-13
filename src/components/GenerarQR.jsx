import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { obtenerDatos } from './ObtenerDatos'; // Suponiendo que tienes una función para obtener los datos del usuario

// eslint-disable-next-line react/prop-types
const GenerarQR = ({ idUsuario }) => {
    const [datosUsuario, setDatosUsuario] = useState(null);

    useEffect(() => {
        const fetchDatosUsuario = async () => {
            try {
                const datos = await obtenerDatos(idUsuario);
                // Guardar solo los datos necesarios en el estado local
                const datosParaQR = {
                    id: datos.id,
                    name: datos.name,
                    lastname1: datos.lastname1,
                    lastname2: datos.lastname2,
                    ciuser: datos.ciuser,
                };
                setDatosUsuario(datosParaQR);
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        if (idUsuario) {
            fetchDatosUsuario();
        }
    }, [idUsuario]);

    return (
        <div>
            {datosUsuario ? (
                <div>
                    <QRCode value={JSON.stringify(datosUsuario)} />
                    <p>ID: {datosUsuario.id}</p>
                    <p>Nombre: {datosUsuario.name}</p>
                    <p>Primer Apellido: {datosUsuario.lastname1}</p>
                    <p>Segundo Apellido: {datosUsuario.lastname2}</p>
                    <p>CI: {datosUsuario.ciuser}</p>
                </div>
            ) : (
                <p>Cargando datos del usuario...</p>
            )}
        </div>
    );
};

export default GenerarQR;
