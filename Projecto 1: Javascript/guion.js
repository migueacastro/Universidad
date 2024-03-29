class menu {
    // id, id del boton que invoca al menu, objeto del menu anterior, id del boto para volver a ese menu anterior, funcion ejecutada al mostrar
    // Los 4 atributos después de id son opcionales
    constructor(id, callerId=null, menuAnterior=null, backId=null, specialFunction=null) {
        this.id = id;
        this.menuAnterior = menuAnterior;
        this.elemento = document.getElementById(this.id);
        this.specialFunction = specialFunction;

        let esteElemento = this.elemento;

        // Asignar escucha para mostrar menu al presionar boton en caso de que
        // no sea nulo.
        if (callerId) {
            this.caller = document.getElementById(callerId);
            this.caller.addEventListener('click', () => { this.mostrar();});
        }

        // Asignar escucha a un posible boton de volver
        if (backId) {
            document.getElementById(backId).addEventListener('click', () => {
                menuAnterior.mostrar();
                this.ocultar();
            })
        }

        // Por defecto, el elemento es ocultado
        this.elemento.setAttribute('hidden','');
    }
    ocultar() {
        this.elemento.setAttribute('hidden','');
    }

    // Ocultara todas las secciones y mostrará el menú actual
    mostrar() {
        if (this.specialFunction) {
            this.specialFunction(); 
        }
        
        document.querySelectorAll('.seccion').forEach( elemento => {
            elemento.setAttribute('hidden', '');
        })
        this.elemento.removeAttribute('hidden');
    }
    volver() {
        this.menuAnterior.mostrar();
    }
}

// Objeto del cliente actual: Acumula cantidades y montos
clienteActual = [
    {
        'letra':'A',
        'cantidad':0.0,
        'acumulado':0.0,
    },
    {
        'letra':'B',
        'cantidad':0.0,
        'acumulado':0.0,
    },
    {
        'letra':'C',
        'cantidad':0.0,
        'acumulado':0.0,
    }
]


// Lista de objetos que usaremos para seleccionar
listaCategorias = [
    {'letra':'A','nombre':'cigarrilos y Bebidas Alcohólicas', 'impuestos':20/100, 'ventas':0, 'acumulado':0},
    {'letra':'B','nombre':'enlatados y Carnes', 'impuestos':10/100, 'ventas':0, 'acumulado':0},
    {'letra':'C','nombre':'arroz, Azúcar y Huevos', 'impuestos':10/100, 'ventas':0, 'acumulado':0},
]

function eliminarFila(elemento) {
    // Boton --> Celda --> Fila
    let fila = elemento.parentNode.parentNode;
    // Acceer a la tabla y eliminar el hijo que sea esta fila
    fila.parentNode.removeChild(fila);

}
function agregarFila() {
    tabla = document.getElementById('tablaProductos');
    longitudTabla = tabla.rows.length;
    for (let i = 0; i <  longitudTabla; i++) {
        // Agregar elemento hijo antes del footer de la tabla
        if (i == longitudTabla - 1) {
            let fila = tabla.insertRow(i+1);

            // Crear celda con el input precio
            let celda1 = fila.insertCell(0);
            let precio = document.createElement("input");
            precio.min = 0;
            precio.type = "number";
            precio.id = "precio" + i;
            celda1.appendChild(precio);

            // Crear celda con el input cantidad
            let celda2 = fila.insertCell(1);
            let cantidad = document.createElement("input");
            cantidad.min = 1;
            cantidad.type = "number";
            cantidad.id = "cantidad" + i;
            celda2.appendChild(cantidad);

            // Crear celda de categoria
            let celda3 = fila.insertCell(2);
            let categoria = document.createElement("select");
            // Insertar las opciones 
            categoria.insertAdjacentHTML('beforeend', `
                <option value="A">Rubro A</option>
                <option value="B">Rubro B</option>
                <option value="C">Rubro C</option>
            `);
            // Crear un ciclo que asigne las opciones disponibles
            categoria.id = "categoria" + i;
            celda3.appendChild(categoria);

            // Crear celda de impuestos
            let celda4 = fila.insertCell(3);
            celda4.id = "impuestos" + i;
            celda4.appendChild(document.createTextNode("0Bs."));

            // Crear celda de subtotal
            let celda5 = fila.insertCell(4);
            celda5.id = "subtotal" + i;
            celda5.appendChild(document.createTextNode("0Bs."));  
            
            // Crear boton de eliminar 
            let celda6 = fila.insertCell(5);
            let botonEliminar = document.createElement("button");
            botonEliminar.innerText = "X"
            botonEliminar.id = "eliminar"+i;
            botonEliminar.addEventListener('click', ()=> {eliminarFila(botonEliminar);})
            celda6.appendChild(botonEliminar);
        }
    }
}

function reiniciarTabla() {
    
    // Eliminar todas las filas de la tabla de productos
    let tabla = document.getElementById('tablaProductos');
    let longitudTabla = tabla.rows.length;
    for (let i = longitudTabla - 1; i > 0; i--) {
        tabla.deleteRow(i);
    }
}

function iniciar() {
    // Aqui asignare la escucha de eventos a cada boton que quiero que muestre
    // un menu determinado.

    
    // Menu abrir caja, cuando aparece, ejecuta la funcion para ocultar el boton "Cerrar caja"
    let menuAbrirCaja = new menu('cajaM', 'cerrarCajaB', null, null, function () {
        document.getElementById('cerrarCajaB').setAttribute('hidden', '');
    });
    menuAbrirCaja.mostrar();

    // Menu inicio , cuando aparece, ejecuta la funcion para mostrar el boton "Cerrar caja"
    let menuInicio = new menu('inicioM', 'abrirCajaB', menuAbrirCaja, null)

    let menuVenta = new menu ('ventaM', 'nuevaVentaB', menuInicio, 'pagarB');
    document.getElementById('añadirProducto').addEventListener('click', ()=> {
            agregarFila();
        }
    );
    document.getElementById('pagarB').addEventListener('click',  function () {
        document.getElementById('cerrarCajaB').removeAttribute('hidden');
        reiniciarTabla();
    });    
}


document.addEventListener('DOMContentLoaded', function () {
    iniciar();
    
});