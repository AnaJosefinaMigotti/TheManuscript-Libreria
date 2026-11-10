const contenedorLibros = document.querySelector("#libros");
const contenedorGeneros = document.querySelector("#generos");
const contenedorCarrito = document.querySelector("#productos-carrito");
const totalCarrito = document.querySelector("#total-carrito");
const formularioLogin = document.querySelector("#formulario-login");
const campoEmail = document.querySelector("#email");
const campoPassword = document.querySelector("#password");
const mensajeLogin = document.querySelector("#mensaje-login");
const botonIngresar = document.querySelector("#ingresar");
const usuarioActivo = document.querySelector("#usuario-activo");
const botonSalir = document.querySelector("#salir");
const botonComprar = document.querySelector("#comprar");

let libros = [];

function obtenerToken() {
    return localStorage.getItem("token");
}

function limpiarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("id_cliente");
    localStorage.removeItem("nombre_cliente");
    localStorage.removeItem("carrito");
}

function verificarUsuario() {
    if (usuarioActivo || contenedorLibros || contenedorCarrito) {
        const token = obtenerToken();
        const nombreCliente = localStorage.getItem("nombre_cliente");

        if (!token || !nombreCliente) {
            limpiarSesion();
            window.location.href = "index.html";
            return false;
        }

        try {
            const partes = token.split(".");

            if (partes.length !== 3) {
                throw new Error("Token inválido");
            }

            const contenido = JSON.parse(
                atob(
                    partes[1]
                        .replace(/-/g, "+")
                        .replace(/_/g, "/")
                )
            );

            if (!contenido.exp || contenido.exp * 1000 <= Date.now()) {
                throw new Error("Token vencido");
            }
        } catch (error) {
            limpiarSesion();
            window.location.href = "index.html";
            return false;
        }
    }

    return true;
}

async function ingresar(evento) {
    evento.preventDefault();

    const email = campoEmail.value.trim();
    const password = campoPassword.value;

    mensajeLogin.textContent = "";

    if (!email || !password) {
        mensajeLogin.textContent = "Ingresá tu correo y contraseña.";
        return;
    }

    botonIngresar.disabled = true;
    botonIngresar.textContent = "Ingresando...";

    try {
        const respuesta = await fetch("/clientes/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensajeLogin.textContent =
                resultado.mensaje || "No se pudo iniciar sesión.";
            return;
        }

        if (!resultado.token || !resultado.cliente) {
            mensajeLogin.textContent = "Respuesta de inicio de sesión inválida.";
            return;
        }

        localStorage.removeItem("carrito");

        localStorage.setItem("token", resultado.token);
        localStorage.setItem(
            "id_cliente",
            String(resultado.cliente.id_cliente)
        );
        localStorage.setItem(
            "nombre_cliente",
            `${resultado.cliente.nombre} ${resultado.cliente.apellido}`
        );

        window.location.href = "catalogo.html";
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensajeLogin.textContent =
            "No se pudo conectar con el servidor.";
    } finally {
        botonIngresar.disabled = false;
        botonIngresar.textContent = "Ingresar";
    }
}

function mostrarUsuario() {
    const nombreCliente = localStorage.getItem("nombre_cliente");

    if (usuarioActivo && nombreCliente) {
        usuarioActivo.textContent = `Hola, ${nombreCliente}`;
    }
}

function salir() {
    limpiarSesion();
    window.location.href = "index.html";
}

async function obtenerLibros() {
    try {
        const respuesta = await fetch("/libros");

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los libros");
        }

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

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los géneros");
        }

        const generos = await respuesta.json();

        if (contenedorGeneros) {
            mostrarGeneros(generos);
        }
    } catch (error) {
        console.error("Error al obtener los géneros:", error);
    }
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
    const carrito = JSON.parse(
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

        total += libro.precio;
    });

    totalCarrito.textContent = `Total: $${total}`;
}

function eliminarDelCarrito(indice) {
    const carrito = JSON.parse(
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
    const token = obtenerToken();

    const carrito = JSON.parse(
        localStorage.getItem("carrito")
    ) || [];

    if (!token) {
        alert("Debés iniciar sesión para comprar.");
        limpiarSesion();
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
            itemExistente.cantidad += 1;
        } else {
            librosVenta.push({
                id_libro: libro.id_libro,
                cantidad: 1
            });
        }
    });

    try {
        const respuesta = await fetch("/ventas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                libros: librosVenta
            })
        });

        const resultado = await respuesta.json();

        if (respuesta.status === 401 || respuesta.status === 403) {
            alert(resultado.mensaje || "La sesión no es válida.");
            limpiarSesion();
            window.location.href = "index.html";
            return;
        }

        if (!respuesta.ok) {
            alert(resultado.mensaje || "No se pudo realizar la compra.");
            return;
        }

        localStorage.removeItem("carrito");

        mostrarCarrito();
        mostrarMensajeCompra(resultado);
    } catch (error) {
        console.error("Error al realizar la compra:", error);
        alert("No se pudo conectar con el servidor.");
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
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", ingresar);
    }

    if (contenedorLibros) {
        obtenerLibros();
    }

    if (contenedorGeneros) {
        obtenerGeneros();
    }

    if (contenedorCarrito) {
        mostrarCarrito();
    }

    if (usuarioActivo) {
        mostrarUsuario();
    }

    if (botonSalir) {
        botonSalir.addEventListener("click", salir);
    }

    if (botonComprar) {
        botonComprar.addEventListener("click", comprar);
    }
}