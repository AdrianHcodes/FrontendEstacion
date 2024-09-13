import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde react-dom/client en lugar de react-dom
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <App />
      <Router/>
  </React.StrictMode>
);
