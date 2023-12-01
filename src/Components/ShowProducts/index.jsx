import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { show_alerta } from '../../Helpers/alerts'
import { useEffect, useState } from 'react';

export const ShowProducts = () => {

    const url = 'http://api-products.run';

    // Estado para obtener todos los productos de la base de datos
    const [products, setProducts] = useState([]);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [title, setTitle] = useState('');

    // Estado para guardar, actualizar o eliminar
    const [operation, setOperation] = useState(1);

    useEffect(() => {
        getProducts();
    }, []);

    // Function para obtener los productos
    const getProducts = async () => {
        const respuesta = await axios.get(url);
        setProducts(respuesta.data);
    }

    const openModal = (op, id, name, descripcion, precio) => {
        setId('');
        setName('');
        setDescripcion('');
        setPrecio('');
        setOperation(op);
        if (op === 1) {
            setTitle('Registrar Producto');
        } else if (op === 2) {
            setTitle('Editar Producto');
            setId(id);
            setName(name);
            setDescripcion(descripcion);
            setPrecio(precio);
        }

        window.setTimeout(function () {
            document.getElementById('nombre').focus();
        }, 500);
    }

    const validar = () => {
        var parametros;
        var metodo;
        if (name.trim() === '') {
            show_alerta('Escribe el nombre del producto', 'warning');
        } else if (descripcion.trim() === '') {
            show_alerta('Escribe la descripción del producto', 'warning');
        } else if (precio.trim() === '') {
            show_alerta('Escribe el precio del producto', 'warning');
        } else {
            if (operation === 1) {
                parametros = { name: name.trim(), descripcion: descripcion.trim(), precio: precio };
                metodo = 'POST';
            } else {
                parametros = { id: id, name: name.trim(), descripcion: descripcion.trim(), precio: precio };
                metodo = 'PUT';
            }
            enviarSolicitud(metodo, parametros);
        }
    }

    const enviarSolicitud = async (metodo, parametros) => {
        await axios({ method: metodo, url: url, data: parametros }).then(function (respuesta) {
            var tipo = respuesta.data[0];
            var msj = respuesta.data[1];
            show_alerta(msj, tipo);
            if (tipo === 'success') {
                document.getElementById('btnCerrar').click();
                getProducts();
            }
        })
            .catch(function (error) {
                show_alerta('Error en la solicitud', 'error')
                console.log(error)
            })
    }

    const deleteProduct = (id, name) => { 
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title:'¿Seguro deseas eliminar el producto '+name+'?',
            icon: 'question',text:'No se podrá dar marcha atras',
            showCancelButton:true, confirmButtonText:'Si, eliminar',cancelButtonText:'Cancelar'
        }).then((result) => {
            if(result.isConfirmed) {
                setId(id);
                enviarSolicitud('DELETE', {id:id});
            } else {
                show_alerta('El producto No fue eliminado', 'info');
            }
        })
    }

    return (
        <div className='App'>
            <div className='container-fluid'>
                <div className='row mt-3'>
                    <div className='col-md-4 offset-md-4'>
                        <div className='d-grid mx-auto'>
                            <button className='btn btn-dark' onClick={() => openModal(1)} data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className='fa-solid fa-circle-plus'></i> Añadir Producto
                            </button>
                        </div>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col-12 col-lg-8 offset-0 offset-lg-2'>
                        <div className='table-responsive'>
                            <table className='table table-bordered'>
                                <thead>
                                    <tr><th>#</th><th>PRODUCTO</th><th>DESCRIPCION</th><th>PRECIO</th></tr>
                                    <tr><td>1</td><td>Zapato</td><td>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam, amet maiores aliquam necessitatibus modi maxime odit quasi non delectus ea!</td><td>300</td></tr>
                                    <tr><td>2</td><td>Pantalon</td><td>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga fugiat obcaecati nam ducimus est animi exercitationem minus distinctio illo at!</td><td>200</td></tr>
                                    <tr><td>3</td><td>Camisa</td><td>Lorem ipsum dolor, sit amet consectetur adipisicing elit. At hic fuga, incidunt nisi dicta neque quibusdam error voluptatem soluta ipsum.</td><td>500</td></tr>
                                    <tr><td>4</td><td>Short</td><td>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim aut laborum amet voluptate asperiores vero error placeat quibusdam!</td><td>100</td></tr>
                                    <tr><td>5</td><td>Medias</td><td>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi corporis pariatur aliquam suscipit ducimus ad, minima consequatur blanditiis.</td><td>400</td></tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {
                                        products.map((product, i) => (
                                            <tr key={product.id}>
                                                <td>{(i + 1)}</td>
                                                <td>{product.name}</td>
                                                <td>{product.descripcion}</td>
                                                <td>${new Intl.NumberFormat('es-mx').format(product.precio)}</td>
                                                <td>
                                                    <button onClick={() => openModal(2, product.id, product.name, product.descripcion, product.precio)} className='btn btn-warning' data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                                        <i className='fa-solid fa-edit'></i>
                                                    </button>
                                                    &nbsp;
                                                    <button onClick={() => deleteProduct(product.id,product.name)} className='btn btn-danger'>
                                                        <i className='fa-solid fa-trash'></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id='modalProducts' className='modal fade' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type="hidden" id='id'></input>
                            {/* Input del nombre */}
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-gift'></i></span>
                                <input type="text" id='nombre' className='form-control' placeholder='Nombre del producto' value={name} onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            {/* Input de description */}
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-comment'></i></span>
                                <input type="text" id='descripcion' className='form-control' placeholder='Descripción' value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></input>
                            </div>
                            {/* Input de precio */}
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa-solid fa-dollar-sign'></i></span>
                                <input type="text" id='precio' className='form-control' placeholder='Precio' value={precio} onChange={(e) => setPrecio(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button className='btn btn-success' onClick={() => validar()}>
                                    <i className='fa-solid fa-floppy-disk'></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' id='btnCerrar' className='btn btn-secondary' data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}