import { useState, useEffect } from 'react';
import { ImPrinter } from "react-icons/im";
import axios from 'axios';
import "../../styles/nuevaVenta.css"
import Swal from 'sweetalert2';
//import QRCode from 'qrcode.react';
//import logo22 from '../../assets/logo-estacion/logo-estacion.png';

const NuevaVenta = () => {
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [detalles, setDetalles] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [ventaId, setVentaId] = useState(null); // Estado para almacenar el ID de la venta creada
    const [totalVenta, setTotalVenta] = useState(0); // Estado para el total de la venta

    const [fechaVenta, setFechaVenta] = useState('');
    const [Cliente, setCliente] = useState('');
    const [Documento, setDocumento] = useState('');

    const apiUrl = 'http://localhost:4000';

    useEffect(() => {
        // Obtener productos disponibles al cargar el componente
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${apiUrl}/products`);
                setProductos(response.data);
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProductos();
    }, []);

    const handleFechaChange = (event) => {
        setFechaVenta(event.target.value);
    };

    const handleClienteChange = (event) => {
        setCliente(event.target.value);
    };
    const handleDocumentChange = (event) => {
        setDocumento(event.target.value);
    };

    const handleProductoChange = (event) => {
        setProductoSeleccionado(event.target.value);
    };

    const handleCantidadChange = (event) => {
        setCantidad(Number(event.target.value));
    };

    const crearVenta = async () => {
        try {
            const response = await axios.post(`${apiUrl}/sale`, {
                date: fechaVenta,
                nameclient: Cliente,
                numdocument: Documento,
                iduser: 23, // Reemplaza con el ID de usuario correcto si es necesario
                total: 0, // Inicializamos el total en 0 al crear la venta
            });

            setVentaId(response.data.idsale); // Guardar el ID de la venta creada
            setMensaje('Venta creada correctamente');
        } catch (error) {
            console.error('Error al crear venta:', error);
            setMensaje('Error al crear la venta. Por favor, inténtalo de nuevo.');
        }
    };

    const agregarDetalleVenta = async () => {
        try {
            const response = await axios.post(`${apiUrl}/ventas/${ventaId}/detalle-venta`, {
                idproduct: productoSeleccionado,
                amount: cantidad,
            });

            setMensaje('Producto agregado a la venta correctamente');
            setProductoSeleccionado('');
            setCantidad(1);

            // Actualizar los detalles de venta mostrados en la interfaz
            const newDetalle = {
                iddetail: response.data.iddetail,
                idproduct: response.data.idproduct,
                amount: response.data.amount,
                idsale: ventaId,
            };

            setDetalles([...detalles, newDetalle]);

            // Actualizar el total de la venta en el estado local
            const precioProducto = await obtenerPrecioProducto(productoSeleccionado);
            const subtotal = precioProducto * cantidad;
            setTotalVenta(totalVenta + subtotal);
        } catch (error) {
            console.error('Error al agregar detalle de venta:', error);
            setMensaje('Error al agregar el producto a la venta. Por favor, inténtalo de nuevo.');
        }
    };

    const obtenerPrecioProducto = async (idProducto) => {
        try {
            const response = await axios.get(`${apiUrl}/products/${idProducto}`);
            return response.data.price;
        } catch (error) {
            console.error('Error al obtener precio del producto:', error);
            return 0;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!ventaId) {
            // Si no hay venta creada, crear la venta primero
            handleSubmitVenta();
        } else {
            // Si ya hay venta creada, agregar el detalle de venta
            await agregarDetalleVenta();
        }
    };
    const handleSubmitVenta = async()=>{
        event.preventDefault();
        if (!ventaId) {
            // Si no hay venta creada, crear la venta primero
            await crearVenta();
        }
    }

    const handleEliminarDetalle = async (id) => {
        try {
            await axios.delete(`${apiUrl}/ventas/${ventaId}/detalle-venta/${id}`);

            // Filtrar los detalles para eliminar el detalle con iddetails especificado
            const updatedDetalles = detalles.filter((detalle) => detalle.iddetail !== id);
            setDetalles(updatedDetalles);

            setMensaje('Detalle de venta eliminado correctamente');
            let totalVentaActualizado = 0;
            for (let detalle of detalles) {
                const precioProducto = await obtenerPrecioProducto(detalle.idproduct);
                const subtotal = precioProducto * detalle.amount;
                totalVentaActualizado += subtotal;
            }
            // Actualizar el total de la venta en el estado
            setTotalVenta(totalVentaActualizado);
           } catch (error) {
            console.error('Error al eliminar detalle de venta:', error);
            setMensaje('Error al eliminar el detalle de venta. Por favor, inténtalo de nuevo.');
        }
    };

    
    
    const handleGuardarVenta = async () => {
        try {
            setMensaje('Guardando la venta...');
            // Recalcular el total de la venta sumando los subtotales de cada detalle
            let totalVentaActualizado = 0;
            for (let detalle of detalles) {
                const precioProducto = await obtenerPrecioProducto(detalle.idproduct);
                const subtotal = precioProducto * detalle.amount;
                totalVentaActualizado += subtotal;
            }
            // Actualizar el total de la venta en el estado
            setTotalVenta(totalVentaActualizado);
            await axios.put(`${apiUrl}/sale/${ventaId}`, {
                date: fechaVenta,
                nameclient: Cliente,
                numdocument: Documento,
                iduser: 23, ///usuario que atiende
                total: totalVentaActualizado,
            });
            Swal.fire({text:'Se guardo correctamente',icon:'success',showConfirmButton: false,timer: '1000'})
            // Mostrar mensaje de éxito
            setMensaje('Venta guardada correctamente');
        } catch (error) {
            console.error('Error al guardar la venta:', error);
            setMensaje('Error al guardar la venta. Por favor, inténtalo de nuevo.');
        }
    };

    const handleCancelarVenta = async () => {
        try {

            await axios.delete(`${apiUrl}/sale/${ventaId}`);
            // Limpiar estados y mensajes
            setVentaId(null);
            setCliente('')
            setDocumento('')
            setDetalles([]);
            setTotalVenta(0);
            setMensaje('Venta cancelada y eliminada correctamente');
            Swal.fire({text:'Venta Cancelada correctamente',icon:'error',showConfirmButton: false,timer: '1000'})
        } catch (error) {
            console.error('Error al cancelar la venta:', error);
            setMensaje('Error al cancelar la venta. Por favor, inténtalo de nuevo.');
        }
    };

    //
    const generarDocumentoImpresion = () => {
        let contenido = '';
    
        contenido += `ESTACION PIZZA \n`;
        contenido += `Nota de venta \n`;
        contenido += `-------------------------- \n`;
    
        contenido += `Venta Nro: ${ventaId}\n`;
        contenido += `Fecha: ${fechaVenta}\n`;
        contenido += `Cliente: ${Cliente}\n`;
        contenido += `Documento: ${Documento}\n\n`;
    
        // Encabezado de la tabla de detalles
        contenido += 'Detalle de Venta:\n';
        contenido += '--------------------------------\n';
        contenido += 'Item | Producto       | Cant.\n';
        contenido += '--------------------------------\n';
    
        // Detalles de la venta
        detalles.forEach((detalle, index) => {
            let productName = getProductName(detalle.idproduct).substring(0, 15); // Limitar el nombre del producto a 15 caracteres
            let itemNumber = index + 1;
            let cantidad = detalle.amount.toString().substring(0, 5); // Limitar la cantidad a 5 caracteres
            contenido += `${itemNumber.toString().padEnd(4, ' ')}| ${productName.padEnd(15, ' ')}| ${cantidad}\n`;
        });
    
        contenido += '--------------------------------\n';
    
        contenido += `\nTotal Venta: Bs ${totalVenta.toFixed(2)}\n`;
    
        return contenido;
    };
    
    
    //
    const imprimirDocumento = () => {
        const contenido = generarDocumentoImpresion();
        const ventanaImpresion = window.open('', '_blank');
        ventanaImpresion.document.write(`<pre>${contenido}</pre>`);
        ventanaImpresion.document.close();
        ventanaImpresion.print();
        ventanaImpresion.close();
    };

    const getProductName = (id) => {
        const producto = productos.find((prod) => prod.idproduct === id);
        return producto ? producto.nameproduct : 'Producto Desconocido';
    };
    

    return (
        <div className='new-venta'>
            <div className='nueva-venta'>
                <h2>Nueva Venta</h2>
                <form onSubmit={handleSubmitVenta} >
                    <label htmlFor="fecha" >Fecha</label>
                    <input type="date" id="fecha" value={fechaVenta} onChange={handleFechaChange} />

                    <label htmlFor="cliente" >Cliente:</label>
                    <input type="text" id="cliente" value={Cliente} onChange={handleClienteChange} />

                    <label htmlFor="document" >Documento:</label>
                    <input type="text" id="document" value={Documento} onChange={handleDocumentChange} />
                    <div className='btn-nuevo'><button type="submit">Nueva Venta</button>
                    </div>
                </form>
                

                <form onSubmit={handleSubmit} >
                    <label htmlFor="producto">Producto:</label>
                    <select id="producto" value={productoSeleccionado} onChange={handleProductoChange}>
                        <option value="">Selecciona un producto</option>
                        {productos.map((producto) => (
                            <option key={producto.idproduct} value={producto.idproduct}>
                                {`${producto.nameproduct} || Precio: Bs${producto.price}`}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="cantidad">Cantidad:</label>
                    <input type="number" id="cantidad" value={cantidad} onChange={handleCantidadChange} />
                    <div className='btn-nuevo'><button type="submit">Agregar</button></div>
                    
                </form>
            </div>
            <div className=''>
                <h2>Detalle de Venta</h2>
                {detalles.length > 0 ? (
                    <table  className='tabla-detalle'>
                        <thead>
                            <tr>
                                <th>ID Producto</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalles.map((detalle) => (
                                <tr key={detalle.iddetail}>
                                    <td>{detalle.idproduct}</td>
                                    <td>{getProductName(detalle.idproduct)}</td>
                                    <td>{detalle.amount}</td>
                                    <td>
                                        <button className='btn-delete' onClick={() => handleEliminarDetalle(detalle.iddetail)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay productos en la venta actual.</p>
                )}

                <h3>Total de la Venta: ${totalVenta.toFixed(2)}</h3>
                <div className='btn-ventas'>
                    <button onClick={handleGuardarVenta} className='btn-guardar-venta'>Guardar Venta</button>
                    <button onClick={handleCancelarVenta} className='btn-cancelar'>Cancelar Venta</button>
                    <button onClick={imprimirDocumento} className='btn-imprimir'><ImPrinter /></button>
                </div>
                
                {mensaje && <p>{mensaje}</p>}
            </div>
        </div>
    );
};

export default NuevaVenta;
