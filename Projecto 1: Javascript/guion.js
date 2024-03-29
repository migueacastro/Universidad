class menu {
    // id, id del boton que invoca al menu, objeto del menu anterior, id del boto para volver a ese menu anterior, funcion ejecutada al mostrar
    // Los 4 atributos después de id son opcionales
    constructor(id, callerId = null, menuAnterior = null, backId = null, specialFunction = null) {
        this.id = id;
        this.menuAnterior = menuAnterior;
        this.elemento = document.getElementById(this.id);
        this.specialFunction = specialFunction;

        let esteElemento = this.elemento;

        // Asignar escucha para mostrar menu al presionar boton en caso de que
        // no sea nulo.
        if (callerId) {
            this.caller = document.getElementById(callerId);
            this.caller.addEventListener('click', () => { this.mostrar(); });
        }

        // Asignar escucha a un posible boton de volver
        if (backId) {
            document.getElementById(backId).addEventListener('click', () => {
                menuAnterior.mostrar();
                this.ocultar();
            })
        }

        // Por defecto, el elemento es ocultado
        this.elemento.setAttribute('hidden', '');
    }
    ocultar() {
        this.elemento.setAttribute('hidden', '');
    }

    // Ocultara todas las secciones y mostrará el menú actual
    mostrar() {
        if (this.specialFunction) {
            this.specialFunction();
        }

        document.querySelectorAll('.seccion').forEach(elemento => {
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
        'letra': 'A',
        'cantidad': 0.0,
        'acumulado': 0.0,
    },
    {
        'letra': 'B',
        'cantidad': 0.0,
        'acumulado': 0.0,
    },
    {
        'letra': 'C',
        'cantidad': 0.0,
        'acumulado': 0.0,
    }
]
function reiniciarCliente() {
    for (let i = 0; i < clienteActual.length; i++) {
        clienteActual[i].acumulado = 0.0;
        clienteActual[i].cantidad = 0;
    }
}
// Variables globales
var totalVendido = 0.0;
var cantidadVendida = 0;
// Lista de objetos que usaremos para seleccionar
listaCategorias = [
    { 'letra': 'A', 'nombre': 'cigarrilos y Bebidas Alcohólicas', 'impuestos': 26 / 100, 'ventas': 0.0, 'acumulado': 0 },
    { 'letra': 'B', 'nombre': 'enlatados y Carnes', 'impuestos': 16 / 100, 'ventas': 0.0, 'acumulado': 0 },
    { 'letra': 'C', 'nombre': 'arroz, Azúcar y Huevos', 'impuestos': 0, 'ventas': 0.0, 'acumulado': 0 },
]



function actualizarTotal() {
    clienteActual.forEach(objeto => {
        objeto.acumulado = 0.0;
        objeto.cantidad = 0;
    })
    tabla = document.getElementById('tablaProductos');
    let total=0, productos=0;
    for (let i = 1; i < tabla.rows.length - 1; i++) {
        let categoria = document.getElementById("categoria"+i).value;
        let subtotal = document.getElementById("subtotal"+i).innerText;
        let cantidad = document.getElementById("cantidad"+i).value;
        if (cantidad == "") {
            continue;
        }
        subtotal = subtotal.replace("Bs.", "");
        total += parseFloat(subtotal);
        productos += parseInt(cantidad);
        clienteActual.forEach(objeto => {
            if (objeto.letra == categoria) {
                objeto.acumulado += parseFloat(subtotal);
                objeto.cantidad += parseInt(cantidad);
            }
        })
        

    }
    // Actualizar objeto de usuario
    let saldo = parseFloat(document.getElementById("pagarI").value).toFixed(2);
    let vuelto = parseFloat(saldo - total).toFixed(2);
    document.getElementById("total").innerText = "Total: "+total.toFixed(2)+"Bs.";
    document.getElementById("productos").innerText = "Productos: "+productos;
    document.getElementById("totalC").innerText = "Total: "+total.toFixed(2)+"Bs.";
    document.getElementById("productosC").innerText = "Productos: "+productos;
    document.getElementById("saldoC").innerText = "Saldo: "+ saldo + "Bs.";
    document.getElementById("vueltoC").innerText = "Vuelto: "+ vuelto + "Bs.";
}



function eliminarFila(elemento) {
    // Boton --> Celda --> Fila
    let tabla = document.getElementById('tablaProductos').rows;
    let longitudTabla = tabla.length;
    let fila = elemento.parentNode.parentNode;
    let posicion;
     // Acceder a la tabla y eliminar el hijo que sea esta fila
    for (let i = 0; i < longitudTabla; i++) {
        if (tabla[i] == fila) {
            posicion = i;
            fila.parentNode.removeChild(fila);
        }
    }
    // Iterar desde la posicion establecida hasta el fin de la tabla (Habiendole quitado la fila) 
    for (let i = posicion; i < longitudTabla -1; i++) {
        document.getElementById("precio"+i).id = "precio"+(i-1);
        document.getElementById("cantidad"+i).id = "cantidad"+(i-1);
        document.getElementById("categoria"+i).id = "categoria"+(i-1);
        document.getElementById("impuestos"+i).id = "impuestos"+(i-1);
        document.getElementById("subtotal"+i).id = "subtotal"+(i-1);
        document.getElementById("eliminar"+i).id = "eliminar"+(i-1);
    }
   
    
    actualizarTotal();

}
function agregarFila() {
    tabla = document.getElementById('tablaProductos');
    longitudTabla = tabla.rows.length;
    for (let i = 0; i < longitudTabla; i++) {
        // Agregar elemento hijo antes del footer de la tabla
        if (i == longitudTabla - 1) {
            let fila = tabla.insertRow(i + 1);

            // Crear celda con el input precio
            let celda1 = fila.insertCell(0);
            let precio = document.createElement("input");
            precio.min = 0;
            precio.type = "number";
            precio.id = "precio" + i;
            

            // Crear celda con el input cantidad
            let celda2 = fila.insertCell(1);
            let cantidad = document.createElement("input");
            cantidad.min = 1;
            cantidad.type = "number";
            cantidad.id = "cantidad" + i;


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


            // Crear celda de impuestos
            let celda4 = fila.insertCell(3);
            celda4.id = "impuestos" + i;


            // Crear celda de subtotal
            let celda5 = fila.insertCell(4);
            celda5.id = "subtotal" + i;


            // Crear boton de eliminar 
            let celda6 = fila.insertCell(5);
            let botonEliminar = document.createElement("button");
            botonEliminar.innerText = "X"
            botonEliminar.id = "eliminar" + i;
            botonEliminar.addEventListener('click', () => { eliminarFila(botonEliminar); })

            // Agregar escuchadores de eventos para actualizar impuestos y subtotal
            let actualizarDatosFila = () => {
                // Si cualquiera de los dos inputs no son numeros, verificar si no es numero y en dado caso
                // Establecer el dato como nulo, y luego terminar la funcion 
                if (isNaN(precio.value) || isNaN(cantidad.value)) {
                    precio.value = isNaN(precio.value) ? null : precio.value;
                    cantidad.value = isNaN(cantidad.value) ? null : cantidad.value;

                    // Reestablecer los valores de Impuestos y Subtotal
                    celda4.innerText = "0Bs.";
                    celda5.innerText = "0Bs.";
                    actualizarTotal();
                    return;
                }
                else if ((precio.value == "") || (cantidad.value == "")) {
                    precio.value = (precio.value == "") ? null : precio.value;
                    cantidad.value = (cantidad.value == "") ? null : cantidad.value;

                    // Reestablecer los valores de Impuestos y Subtotal
                    celda4.innerText = "0Bs.";
                    celda5.innerText = "0Bs.";
                    actualizarTotal();
                    return;
                }
                // Iterar en las categorias hasta que la letra coincida con el valor de 
                // la categoria seleccionada
                let impuestos;
                listaCategorias.forEach(elemento => {
                    if (elemento.letra == categoria.value) {
                        impuestos = elemento.impuestos
                    }
                });
                subtotal = parseFloat(precio.value) * parseFloat(cantidad.value);
                subtotal += parseFloat(subtotal) * parseFloat(impuestos);
                celda4.innerText = parseFloat(impuestos * subtotal).toFixed(2) + "Bs.";
                celda5.innerText = subtotal.toFixed(2) + "Bs.";

                actualizarTotal();
            }

            // Agregar escuchadores de eventos a los elementos de la fila
            precio.addEventListener('keyup', () => {
                actualizarDatosFila();
            })
            cantidad.addEventListener('keyup', () => {
                actualizarDatosFila();
            });
            categoria.addEventListener('change', () => {
                actualizarDatosFila();
            })

            // Agregar elemetos a la fila
            celda1.appendChild(precio);
            celda2.appendChild(cantidad);
            celda3.appendChild(categoria);
            celda4.innerText = "0Bs";
            celda5.innerText = "0Bs";
            celda6.appendChild(botonEliminar);
        }
    }
}

function pagar() {
    for (let i = 0; i < listaCategorias.length; i++) {
        listaCategorias[i].acumulado += parseFloat(clienteActual[i].acumulado);
        listaCategorias[i].ventas += parseInt(clienteActual[i].cantidad);
        totalVendido += parseFloat(clienteActual[i].acumulado);
        cantidadVendida += parseInt(clienteActual[i].cantidad);
    }
    
    let tablaInformacion = document.getElementById('informacionT');
    for (let i = 0; i < listaCategorias.length; i++) {
        document.getElementById("acumulado" + listaCategorias[i].letra).innerText = parseFloat(listaCategorias[i].acumulado).toFixed(2) + "Bs."; 
        document.getElementById("cantidad" + listaCategorias[i].letra).innerText = listaCategorias[i].ventas; 
    }
    document.getElementById("acumuladoT").innerText = parseFloat(totalVendido).toFixed(2) + "Bs.";
    document.getElementById("cantidadT").innerText = cantidadVendida;
    document.getElementById('cerrarCajaB').removeAttribute('hidden');
}

function reiniciarTabla() {

    // Eliminar todas las filas de la tabla de productos
    let tabla = document.getElementById('tablaProductos');
    let longitudTabla = tabla.rows.length;
    for (let i = longitudTabla - 1; i > 0; i--) {
        tabla.deleteRow(i);
    }
    actualizarTotal();
}

function iniciar() {
    // Aqui asignare la escucha de eventos a cada boton que quiero que muestre
    // un menu determinado.


    // Menu abrir caja, cuando aparece, ejecuta la funcion para ocultar el boton "Cerrar caja"
    let menuAbrirCaja = new menu('cajaM', 'cerrarCajaB', null, null, function () {
        document.getElementById('cerrarCajaB').setAttribute('hidden', '');
        document.getElementById('informacionS').setAttribute('hidden', '');
    });
    menuAbrirCaja.mostrar();

    // Menu inicio , cuando aparece, ejecuta la funcion para mostrar el boton "Cerrar caja"
    let menuInicio = new menu('inicioM', 'abrirCajaB', menuAbrirCaja, null, ()=> {
        document.getElementById('informacionS').removeAttribute('hidden');
        document.getElementById('cerrarCajaB').removeAttribute('hidden');
    })

    let menuVenta = new menu('ventaM', 'nuevaVentaB', menuInicio, null, ()=> {
        document.getElementById('confirmarM').setAttribute('hidden', '');;
        document.getElementById('saldoInsuficienteM').setAttribute('hidden', '');
    });
    document.getElementById('añadirProducto').addEventListener('click', () => {
        agregarFila();
    }
    );

    let menuDialogo = new menu('dialogoM', 'pagarB', menuVenta, 'volverB', () => {
        let saldo = document.getElementById('pagarI').value;
        let total = document.getElementById('total').innerText.replace('Total:', '');
        total = total.replace('Bs.', '');
        if (parseFloat(total) > parseFloat(saldo)) {
            document.getElementById('confirmarM').setAttribute('hidden', '');
            document.getElementById('saldoInsuficienteM').removeAttribute('hidden');
        }
        else {
            document.getElementById('confirmarM').removeAttribute('hidden');
            document.getElementById('saldoInsuficienteM').setAttribute('hidden', '');
        }
    });
    document.getElementById('pagarI').addEventListener('keyup', ()=> {
        let saldo = document.getElementById('pagarI').value;
        let botonPagar = document.getElementById('pagarB');
        let total = document.getElementById('total').innerText.replace('Total:', '');
        total = total.replace('Bs.', '');
        if (!(isNaN(saldo) || saldo == "" || saldo == 0) && (parseFloat(total) > 0)) {
            botonPagar.removeAttribute('hidden');
        } else {
            botonPagar.setAttribute('hidden', true);
        }
        actualizarTotal();
    })
    document.getElementById('pagarB').addEventListener('click', ()=>{
        menuDialogo.mostrar();
    })

    document.getElementById('confirmarB').addEventListener('click', ()=> {
        document.getElementById('confirmarM').setAttribute('hidden', '');
        document.getElementById('saldoInsuficienteM').setAttribute('hidden', '');
        pagar();
        reiniciarTabla();
        reiniciarCliente();
        menuDialogo.ocultar();
        menuInicio.mostrar();
    });
}


document.addEventListener('DOMContentLoaded', function () {
    iniciar();

});