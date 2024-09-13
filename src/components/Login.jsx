import { useState } from 'react';
import axios from 'axios';
import '../styles/login.css'; // Asegúrate de importar tus estilos CSS
import Logo from '../assets/logo-estacion/logo-estacion-blanco.png'; // Ruta de la imagen de tu logo
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
const Login = ({ handleLogin }) => {
  const [loginuser, setLoginUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/login', {
        loginuser,
        password,
      });

      if (response.data.success) {
        const { user } = response.data; // Extrae los datos del usuario

        // Almacena el iduser en localStorage
        localStorage.setItem('roluser', user.roluser); // Asegúrate de que 'id' es la clave correcta en el objeto user

        handleLogin(user); // Llama a la función del padre con los datos del usuario
        Swal.fire({
          text: 'Inicio de sesión exitoso',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      Swal.fire({
        text: 'Error en la autenticación, inténtelo nuevamente',
        icon: 'error',
        showConfirmButton: false,
        timer: 1600
      });
    }
  };

  return (
    <div className="login-container">
      <div className='logo'>
        <img src={Logo} alt="Logo de la empresa" className="logo-img" />
      </div>
      <div>
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Login</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <input
              type="text"
              placeholder='Ingrese su usuario'
              value={loginuser}
              onChange={(e) => setLoginUser(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder='Ingrese su contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
