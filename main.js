//Creamos clases y sus constructores
class Producto {
    constructor(id, nombre, precio, img) {
        this.id = id;
        this.nombre = nombre; 
        this.precio = precio;
        this.img = img;
        this.cantidad = 1; 
    }
}

const arosCG = new Producto(0, "ArosCG", 4000, "img/aroscg.jpeg"); 
const arosEstrella = new Producto(1, "ArosEstrella", 4000, "img/arosestrella.jpeg");
const bagNiñx = new Producto(2, "BagNiñx", 6000, "img/teabagniñx.jpeg");
const bagQSALT = new Producto(3, "BagQSALT", 6000, "img/teabagqslt.jpeg");
const idealesPrimaveras = new Producto(4, "IdealesPrimaveras", 8000, "img/discoip.jpeg");

const productosArray = [arosCG, arosEstrella, bagNiñx, bagQSALT, idealesPrimaveras];

class Cliente {
    constructor(nombre, apellido, direccion, telefono, ciudad, pais) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.direccion = direccion;
        this.telefono = telefono;
        this.ciudad = ciudad;
        this.pais = pais;
    }
}

//Creación de array Carrito
let carrito = [];

//Creación de array de clientes

let clientesArray = []

//Modificamos el DOM mostrando los productos: 
const contenedorProductos = document.getElementById("contenedorProductos");

//Mostrar los productos en la página

const mostrarProductos = () => {
    productosArray.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                        <div class="card">
                            <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                            <div class="card-body">
                                <h5> ${producto.nombre} </h5>
                                <p>${producto.precio}</p>
                                <button id="boton${producto.id}" class="btn colorBoton"> Agregar al carrito </button>
                            </div>
                        </div>
                        `
        contenedorProductos.appendChild(card);

        //Agregar productos al carrito: 
        const boton = document.getElementById(`boton${producto.id}`);
        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        })

    })
}

mostrarProductos();

//Función para agregar al carrito

const agregarAlCarrito = (id) => {
    const productoEnCarrito = carrito.find(producto => producto.id === id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        const producto = productosArray.find(producto => producto.id === id);
        carrito.push(producto);
    }
    calcularTotal();
    const carritoJson = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoJson);
    Swal.fire(
        'Producto agregado con éxito',
        '',
        'success'
    )    
}

//Función para eliminar el producto del carrito: 

const eliminarDelCarrito = (id) => {
    const producto = carrito.find(producto => producto.id === id);
    const indice = carrito.indexOf(producto);
    carrito.splice(indice, 1);
    mostrarCarrito();
}

//Calculamos el total de la compra: 

const total = document.getElementById("total");

const calcularTotal = () => {
    let totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
    total.innerHTML = `${totalCompra}`;
}

//Función para mostrar el carrillo de compras: 

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
})

const mostrarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                        <div class="card">
                            <img src="${producto.img}" class="card-img-top imgProductos" alt="${producto.nombre}">
                            <div class="card-body">
                                <h5> ${producto.nombre} </h5>
                                <p>${producto.precio}</p>
                                <p>${producto.cantidad}</p>
                                <button id="eliminar${producto.id}" class="btn colorBoton"> Eliminar </button>
                                
                            </div>
                        </div>
                        `
        contenedorCarrito.appendChild(card);

        //Eliminar productos del carrito: 
        const boton = document.getElementById(`eliminar${producto.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(producto.id);
        })
    })
    calcularTotal();
}

//Vaciamos todo el carrito de compras: 

const vaciarCarrito = document.getElementById("vaciarCarrito");

vaciarCarrito.addEventListener("click", () => {
    eliminarTodoElCarrito();
})

//Funcion para eliminar todos los elementos del carrito: 

const eliminarTodoElCarrito = () => {
    localStorage.removeItem("carrito");
    carrito = [];
    mostrarCarrito();
} 


//Función para hacer el pago y finalizar la compra

const aceptarCompra = document.getElementById("aceptarCompra");

aceptarCompra.addEventListener("click", () => {
    finalizarCompra();
})

const finalizarCompra = (() => {
    // Obtener el valor numérico entero de un input
    
    var inputDinero = document.getElementById("dinero").value;
    var dinero = parseInt(inputDinero);
    if (isNaN(inputDinero)) {
        Swal.fire(
            'El valor ingresado no es un número válido',
            'Intenta con otro valor...',
            'error'
        )
    } else {
        var totalAPagar = document.getElementById("total");
        var spanValue = totalAPagar.textContent;
        var total = parseInt(spanValue);
    }
    if (dinero >= total) {
        guardarCliente();
        vuelto = dinero - total;
        Swal.fire(
            'Compra realizada con éxito',
            'Tu vuelto es de: ' + vuelto,
            'success'
        )
        eliminarTodoElCarrito();  
        
        
    }else {
        Swal.fire(
            'El valor ingresado no alcanza para pagar el carrito',
            'Intenta con otro valor...',
            'error'
        )
    }
})

//Función para mostrar el valor total que llevas acumulado en el carrito:

const verMonto = document.getElementById("verMonto");
verMonto.addEventListener("click", () =>{
    verMontoTotal();
})

const verMontoTotal =(() => {
    let totalCompra = 0;
    carrito.forEach(producto => {
        totalCompra += producto.precio * producto.cantidad;
    })
    Swal.fire(
        'El total de la compra es de: ' + totalCompra,
        '',
        'success'
    )
}) 

//Función para guardar el cliente que hizo la compra:

const guardarCliente = (() => {
    var inputElement = document.getElementById('inputNombre');
    var nombreCliente = inputElement.value;
    var inputElement = document.getElementById('inputApellido');
    var apellidoCliente = inputElement.value;
    var inputElement = document.getElementById('inputDireccion');
    var direccionCliente = inputElement.value;
    var inputElement = document.getElementById('inputTelefono');
    var telefonoCliente = inputElement.value;
    var inputElement = document.getElementById('inputCiudad');
    var ciudadCliente = inputElement.value;
    var inputElement = document.getElementById('inputPais');
    var paisCliente = inputElement.value;
    const cliente = new Cliente(nombreCliente, apellidoCliente, direccionCliente, telefonoCliente, ciudadCliente, paisCliente);
    clientesArray = [cliente];
    const clienteJson = JSON.stringify(cliente);
    localStorage.setItem("cliente", clienteJson);
})


