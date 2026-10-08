const contenedorLibros = document.querySelector("#libros");
const contenedorGeneros = document.querySelector("#generos");
const contenedorCarrito = document.querySelector("#productos-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const selectorCliente = document.querySelector("#cliente");
const botonIngresar = document.querySelector("#ingresar");
const usuarioActivo = document.querySelector("#usuario-activo");
const botonSalir = document.querySelector("#salir");
const botonComprar = document.querySelector("#comprar");

let libros = [];
let clientes = [];

function verificarUsuario() {
    if (usuarioActivo) {
        const idCliente = localStorage.getItem("id_cliente");
        const nombreCliente = localStorage.getItem("nombre_cliente");

        if (!idCliente || !nombreCliente) {
            window.location.href = "index.html";
            return false;
        }
    }

    return true;
}

async function obtenerLibros() {
    try {
        const respuesta = await fetch("/libros");
        libros = await respuesta.json();

        if (contenedorLibros) {
            mostrarLibros(libros);
        }
    } catch (error) {
        console.error("Error al obtener los libros:", error);
    }
}

async function obtenerGeneros() {
    try {
        const respuesta = await fetch("/generos");
        const generos = await respuesta.json();

        if (contenedorGeneros) {
            mostrarGeneros(generos);
        }
    } catch (error) {
        console.error("Error al obtener los géneros:", error);
    }
}

async function obtenerClientes() {
    try {
        const respuesta = await fetch("/clientes");
        clientes = await respuesta.json();

        mostrarClientes(clientes);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
    }
}

function mostrarClientes(listaClientes) {
    const clientesActivos = listaClientes.filter(
        (cliente) => cliente.activo === true
    );

    clientesActivos.forEach((cliente) => {
        const opcion = document.createElement("option");

        opcion.value = cliente.id_cliente;
        opcion.textContent = `${cliente.nombre} ${cliente.apellido}`;

        selectorCliente.appendChild(opcion);
    });
}

function ingresar() {
    const idCliente = parseInt(selectorCliente.value);

    if (!idCliente) {
        alert("Seleccioná un cliente");
        return;
    }

    const clienteSeleccionado = clientes.find(
        (cliente) => cliente.id_cliente === idCliente
    );

    if (!clienteSeleccionado) {
        return;
    }

    localStorage.setItem(
        "id_cliente",
        clienteSeleccionado.id_cliente
    );

    localStorage.setItem(
        "nombre_cliente",
        `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}`
    );

    window.location.href = "catalogo.html";
}

function mostrarUsuario() {
    const nombreCliente = localStorage.getItem("nombre_cliente");

    if (usuarioActivo && nombreCliente) {
        usuarioActivo.textContent = `Hola, ${nombreCliente}`;
    }
}

function salir() {
    localStorage.removeItem("id_cliente");
    localStorage.removeItem("nombre_cliente");
    localStorage.removeItem("carrito");

    window.location.href = "index.html";
}

function mostrarLibros(listaLibros) {
    if (!contenedorLibros) {
        return;
    }

    contenedorLibros.innerHTML = "";

    listaLibros.forEach((libro) => {
        const articulo = document.createElement("article");

        articulo.innerHTML = `
            <h3>${libro.titulo}</h3>
            <p>Autor: ${libro.autor}</p>
            <p>Precio: $${libro.precio}</p>
            <p>Stock: ${libro.stock}</p>
            <button>Agregar al carrito</button>
        `;

        const boton = articulo.querySelector("button");

        boton.addEventListener("click", () => {
            agregarAlCarrito(libro);
        });

        contenedorLibros.appendChild(articulo);
    });
}

function mostrarGeneros(generos) {
    if (!contenedorGeneros) {
        return;
    }

    contenedorGeneros.innerHTML = "";

    const botonTodos = document.createElement("button");
    botonTodos.textContent = "Todos";

    botonTodos.addEventListener("click", () => {
        mostrarLibros(libros);
    });

    contenedorGeneros.appendChild(botonTodos);

    generos.forEach((genero) => {
        const boton = document.createElement("button");

        boton.textContent = genero.nombre;

        boton.addEventListener("click", () => {
            const librosFiltrados = libros.filter(
                (libro) => libro.id_genero === genero.id_genero
            );

            mostrarLibros(librosFiltrados);
        });

        contenedorGeneros.appendChild(boton);
    });
}

function agregarAlCarrito(libro) {
    let carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

    carrito.push(libro);

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    mostrarMensajeCarrito(libro);
}

function mostrarMensajeCarrito(libro) {
    const fondo = document.createElement("div");
    fondo.className = "fondo-mensaje";

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-carrito";

    mensaje.innerHTML = `
        <h2>¡Libro agregado!</h2>
        <h3>${libro.titulo}</h3>
        <p>El libro fue agregado correctamente al carrito.</p>
        <p class="precio-mensaje">Precio: $${libro.precio}</p>

        <div class="botones-mensaje">
            <button id="seguir-comprando">Seguir comprando</button>
            <button id="ver-carrito">Ver carrito</button>
        </div>
    `;

    fondo.appendChild(mensaje);
    document.body.appendChild(fondo);

    const botonSeguir = mensaje.querySelector("#seguir-comprando");
    const botonCarrito = mensaje.querySelector("#ver-carrito");

    botonSeguir.addEventListener("click", () => {
        fondo.remove();
    });

    botonCarrito.addEventListener("click", () => {
        window.location.href = "carrito.html";
    });
}

function mostrarCarrito() {
    if (!contenedorCarrito) {
        return;
    }

    const carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML =
            "<p>El carrito está vacío.</p>";

        totalCarrito.textContent = "Total: $0";
        return;
    }

    let total = 0;

    carrito.forEach((libro, indice) => {
        const articulo = document.createElement("article");

        articulo.innerHTML = `
            <h3>${libro.titulo}</h3>
            <p>Autor: ${libro.autor}</p>
            <p>Precio: $${libro.precio}</p>
            <button>Eliminar</button>
        `;

        const botonEliminar = articulo.querySelector("button");

        botonEliminar.addEventListener("click", () => {
            eliminarDelCarrito(indice);
        });

        contenedorCarrito.appendChild(articulo);

        total = total + libro.precio;
    });

    totalCarrito.textContent = `Total: $${total}`;
}

function eliminarDelCarrito(indice) {
    let carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

    carrito.splice(indice, 1);

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    mostrarCarrito();
}

async function comprar() {
    const idCliente = parseInt(
        localStorage.getItem("id_cliente")
    );

    const carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

    if (!idCliente) {
        alert("No hay un cliente identificado");
        window.location.href = "index.html";
        return;
    }

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const librosVenta = [];

    carrito.forEach((libro) => {
        const itemExistente = librosVenta.find(
            (item) => item.id_libro === libro.id_libro
        );

        if (itemExistente) {
            itemExistente.cantidad =
                itemExistente.cantidad + 1;
        } else {
            librosVenta.push({
                id_libro: libro.id_libro,
                cantidad: 1
            });
        }
    });

    const nuevaVenta = {
        id_cliente: idCliente,
        fecha: new Date().toISOString(),
        pagada: true,
        libros: librosVenta
    };

    try {
        const respuesta = await fetch("/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaVenta)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje);
            return;
        }

        localStorage.removeItem("carrito");

        mostrarCarrito();

        mostrarMensajeCompra(resultado);

    } catch (error) {
        console.error("Error al realizar la compra:", error);
    }
}

function mostrarMensajeCompra(venta) {
    const fondo = document.createElement("div");
    fondo.className = "fondo-mensaje";

    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-carrito";

    mensaje.innerHTML = `
        <h2>¡Compra realizada!</h2>
        <p>Tu compra fue registrada correctamente.</p>
        <h3>Venta N.º ${venta.id_venta}</h3>
        <p class="precio-mensaje">Total: $${venta.total}</p>

        <div class="botones-mensaje">
            <button id="continuar-comprando">Seguir comprando</button>
        </div>
    `;

    fondo.appendChild(mensaje);
    document.body.appendChild(fondo);

    const botonContinuar = mensaje.querySelector(
        "#continuar-comprando"
    );

    botonContinuar.addEventListener("click", () => {
        window.location.href = "catalogo.html";
    });
}

const usuarioValido = verificarUsuario();

if (usuarioValido) {

    if (contenedorLibros) {
        obtenerLibros();
    }

    if (contenedorGeneros) {
        obtenerGeneros();
    }

    if (selectorCliente && botonIngresar) {
        obtenerClientes();

        botonIngresar.addEventListener("click", () => {
            ingresar();
        });
    }

    if (contenedorCarrito) {
        mostrarCarrito();
    }

    if (usuarioActivo) {
        mostrarUsuario();
    }

    if (botonSalir) {
        botonSalir.addEventListener("click", () => {
            salir();
        });
    }

    if (botonComprar) {
        botonComprar.addEventListener("click", () => {
            comprar();
        });
    }
}