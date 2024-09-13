import axios from 'axios';


export const obtenerDatos = async (idUsuario) => {
    const apiUrl = "http://localhost:4000/users";
    try {
        const response = await axios.get(`${apiUrl}/${idUsuario}`)
        return response.data; // Retorna los datos del usuario
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        throw error; // Manejo de errores: lanzar el error para manejarlo más arriba
    }
};
