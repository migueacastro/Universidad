// Variables globales
var totalVendido = 0.0,
  cantidadVendida = 0,
  tabla,
  pagarI;

class menu {
  // id, id del boton que invoca al menu, objeto del menu anterior, id del boto para volver a ese menu anterior, funcion ejecutada al mostrar
  // Los 4 atributos después de id son opcionales
  constructor(
    id,
    callerId = null,
    menuAnterior = null,
    backId = null,
    specialFunction = null
  ) {
    this.id = id;
    this.menuAnterior = menuAnterior;
    this.elemento = document.getElementById(this.id);
    this.specialFunction = specialFunction;

    // Asignar escucha para mostrar menu al presionar boton en caso de que
    // no sea nulo.
    if (callerId) {
      this.caller = document.getElementById(callerId);
      this.caller.addEventListener("click", () => {
        this.mostrar();
      });
    }

    // Asignar escucha a un posible boton de volver
    if (backId) {
      document.getElementById(backId).addEventListener("click", () => {
        menuAnterior.mostrar();
        this.ocultar();
      });
    }

    // Por defecto, el elemento es ocultado
    this.elemento.style.display = "none";
  }
  ocultar() {
    this.elemento.style.display = "none";
  }

  // Ocultara todas las secciones y mostrará el menú actual
  mostrar() {
    if (this.specialFunction) {
      this.specialFunction();
    }

    document.querySelectorAll(".seccion").forEach(elemento => {
      elemento.style.display = "none";
    });
    this.elemento.style.display = "flex";
  }
  volver() {
    this.menuAnterior.mostrar();
  }
}

// Objeto del cliente actual: Acumula cantidades y montos
clienteActual = [
  {
    letra: "A",
    cantidad: 0.0,
    acumulado: 0.0
  },
  {
    letra: "B",
    cantidad: 0.0,
    acumulado: 0.0
  },
  {
    letra: "C",
    cantidad: 0.0,
    acumulado: 0.0
  }
];

// Lista de objetos que usaremos para seleccionar
listaCategorias = [
  {
    letra: "A",
    nombre: "cigarrilos y Bebidas Alcohólicas",
    impuestos: 26 / 100,
    cantidad: 0.0,
    acumulado: 0
  },
  {
    letra: "B",
    nombre: "enlatados y Carnes",
    impuestos: 16 / 100,
    cantidad: 0.0,
    acumulado: 0
  },
  {
    letra: "C",
    nombre: "arroz, Azúcar y Huevos",
    impuestos: 0,
    cantidad: 0.0,
    acumulado: 0
  }
];

// Actualiza la tabla de acumulados
function actualizarCaja() {
  for (let i = 0; i < listaCategorias.length; i++) {
    // Sumar acumulado en ventas a la categoria dentro de la lista de categorias
    document.getElementById("acumulado" + listaCategorias[i].letra).innerText =
      parseFloat(listaCategorias[i].acumulado).toFixed(2) + "Bs.";
    
    // Sumar cantidades vendidas a la categoria dentro de la lista de categorias
    document.getElementById("cantidad" + listaCategorias[i].letra).innerText =
      listaCategorias[i].cantidad;
  }
  // Calcular acumulado
  document.getElementById("acumuladoT").innerText =
    parseFloat(totalVendido).toFixed(2) + "Bs.";
  // Calcular total
  document.getElementById("cantidadT").innerText = cantidadVendida;
}

function actualizarTotal() {
  // Reiniciar valores de las categorias del cliente actual
  clienteActual.forEach(objeto => {
    objeto.acumulado = 0.0;
    objeto.cantidad = 0;
  });

  // Iterar por cada fila
  let total = 0,
    productos = 0,
    impuestos = 0,
    base = 0;
  for (let i = 0; i < tabla.rows.length - 1; i++) {
    // Recuperar valores de las filas 
    let categoria = document.getElementById("categoria" + i).value;
    let subtotal = document.getElementById("subtotal" + i).innerText;
    let cantidad = document.getElementById("cantidad" + i).value;
    let impuesto = document.getElementById("impuestos" + i).innerText;
    // Ignorar si la cantidad esta vacia
    if (cantidad == "") {
      continue;
    }
    // Actualizar valores de los elementos de vistas previas al modificar compra
    subtotal = subtotal.replace("Bs.", "");
    impuesto = impuesto.replace("Bs.", "");
    base += parseFloat(subtotal) - parseFloat(impuesto);
    impuestos += parseFloat(impuesto);
    total += parseFloat(subtotal);
    productos += parseInt(cantidad);
    clienteActual.forEach(objeto => {
      if (objeto.letra == categoria) {
        // Actualizar acumuladores de el Objeto de cliente actual
        objeto.acumulado += parseFloat(subtotal);
        objeto.cantidad += parseInt(cantidad);
      }
    });
  }
  // Actualizar valores de el menu de confirmar compra
  let saldo = parseFloat(document.getElementById("pagarI").value).toFixed(2);
  let vuelto = parseFloat(saldo - total).toFixed(2);

  // Monto total en Menu de compra y en Menu de confirmar
  document.getElementById("total").innerText =
    "Monto Total: " + total.toFixed(2) + "Bs.";
  document.getElementById("totalC").innerText =
  "Monto Total: " + total.toFixed(2) + "Bs.";

  // Cantidad de productos en Menu de compra y en Menu de confirmar
  document.getElementById("productos").innerText = "Productos: " + productos;
  document.getElementById("productosC").innerText = "Productos: " + productos;

  // Saldo y vuelto en Menu de compra y en Menu de confirmar
  document.getElementById("saldoC").innerText = "Saldo: " + saldo + "Bs.";
  document.getElementById("vueltoC").innerText = "Vuelto: " + vuelto + "Bs.";

  // Impuestos en Menu de compra y en Menu de confirmar 
  document.getElementById("impuestosC").innerText =
    "Impuestos: " + impuestos.toFixed(2) + "Bs.";
  document.getElementById("impuestos").innerText =
    "Impuestos: " + impuestos.toFixed(2) + "Bs.";
  // Monto base en Menu de compra y confirmar 
    document.getElementById("baseC").innerText =
    "Monto Base: " + base.toFixed(2) + "Bs.";
  document.getElementById("base").innerText =
    "Monto Base: " + base.toFixed(2) + "Bs.";
}
// Reestablece el acumulado de cada categoria para el cliente actual
function reiniciarCliente() {
  for (let i = 0; i < clienteActual.length; i++) {
    clienteActual[i].acumulado = 0.0;
    clienteActual[i].cantidad = 0;
  }
}

function agregarFila() {
  longitudTabla = tabla.rows.length;
  for (let i = 0; i < longitudTabla; i++) {
    // Agregar elemento hijo antes del footer de la tabla
    if (i == longitudTabla - 1) {
      let fila = tabla.tBodies[0].insertRow(i);

      
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
      categoria.insertAdjacentHTML(
        "beforeend",
        `
                <option value="A">Categoria A</option>
                <option value="B">Categoria B</option>
                <option value="C">Categoria C</option>
            `
      );
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
      botonEliminar.innerText = "X";
      botonEliminar.id = "eliminar" + i;
      botonEliminar.classList.add("boton-eliminar");
      botonEliminar.addEventListener("click", () => {
        eliminarFila(botonEliminar);
      });

      // Agregar escuchadores de eventos para actualizar impuestos y subtotal
      let actualizarDatosFila = () => {
        // Si cualquiera de los dos inputs no son numeros, verificar si no es numero y en dado caso
        // Establecer el dato como nulo, y luego terminar la funcion
        if (isNaN(precio.value) || isNaN(cantidad.value)) {
          precio.value = isNaN(precio.value) ? null : precio.value;
          cantidad.value = isNaN(cantidad.value) ? null : cantidad.value; // Validar si alguno de los dos es nulo

          // Reestablecer los valores de Impuestos y Subtotal
          celda4.innerText = "0Bs.";
          celda5.innerText = "0Bs.";
          actualizarTotal();
          return;
        } else if (precio.value == "" || cantidad.value == "") {
          // Validar si alguno de los dos esta vacio
          precio.value = precio.value == "" ? null : precio.value;
          cantidad.value = cantidad.value == "" ? null : cantidad.value;

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
            impuestos = elemento.impuestos;
          }
        });
        subtotal = parseFloat(precio.value) * parseFloat(cantidad.value);
        celda4.innerText = parseFloat(impuestos * subtotal).toFixed(2) + "Bs.";
        subtotal += parseFloat(subtotal) * parseFloat(impuestos);
        celda5.innerText = subtotal.toFixed(2) + "Bs.";
        actualizarTotal();
      };

      // Agregar escuchadores de eventos a los elementos de la fila
      precio.addEventListener("input", () => {
        actualizarDatosFila();
      });
      cantidad.addEventListener("input", () => {
        actualizarDatosFila();
      });
      categoria.addEventListener("input", () => {
        actualizarDatosFila();
      });

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
function eliminarFila(elemento) {
  // Boton --> Celda --> Fila
  let longitudTabla = tabla.length;
  let fila = elemento.parentNode.parentNode;
  let posicion;
  // Acceder a la tabla y eliminar el hijo que sea esta fila
  for (let i = 0; i < longitudTabla; i++) {
    if (tabla.rows[i] == fila) {
      posicion = i;
      fila.parentNode.removeChild(fila);
    }
  }
  // Iterar desde la posicion establecida hasta el fin de la tabla (Habiendole quitado la fila)
  for (let i = posicion; i < longitudTabla - 1; i++) {
    // Actualizar identificadores para que corresponadn con su posicion en la tabla actual
    document.getElementById("precio" + i).id = "precio" + (i - 1);
    document.getElementById("cantidad" + i).id = "cantidad" + (i - 1);
    document.getElementById("categoria" + i).id = "categoria" + (i - 1);
    document.getElementById("impuestos" + i).id = "impuestos" + (i - 1);
    document.getElementById("subtotal" + i).id = "subtotal" + (i - 1);
    document.getElementById("eliminar" + i).id = "eliminar" + (i - 1);
  }

  actualizarTotal();
}

// Por cada elemento de la lista de categorias, reestablecer sus acumuladores
// y actualizar los valores de la caja
function reiniciarCaja() {
  listaCategorias.forEach(elemento => {
    elemento.acumulado = 0.0;
    elemento.cantidad = 0;
  });
  totalVendido = 0.0;
  cantidadVendida = 0;
  actualizarCaja();
}

function pagar() {
  for (let i = 0; i < listaCategorias.length; i++) {
    // Acumuladores de categoria
    listaCategorias[i].acumulado += parseFloat(clienteActual[i].acumulado);
    listaCategorias[i].cantidad += parseInt(clienteActual[i].cantidad);
    // Acumuladores de caja
    totalVendido += parseFloat(clienteActual[i].acumulado);
    cantidadVendida += parseInt(clienteActual[i].cantidad);
  }
  actualizarCaja();
}

function reiniciarTabla() {
  // Eliminar todas las filas de la tabla de productos

  let longitudTabla = tabla.rows.length;
  for (let i = longitudTabla - 1; i > 0; i--) {
    tabla.deleteRow(i);
  }
  document.getElementById("pagarI").value = "";
  // Despues de borrar todas las filas de la tabla, agregar una fila vacia
  agregarFila();
  actualizarTotal();
}

function iniciar() {
  // Aqui asignare la escucha de eventos a cada boton que quiero que muestre
  // un menu determinado.

  // Menu abrir caja, cuando aparece, ejecuta la funcion para ocultar el boton "Cerrar caja"
  let menuAbrirCaja = new menu("cajaM", "cerrarCajaB", null, null, function() {
    document.getElementById("cerrarCajaB").style.display = "none";
    document.getElementById("informacionS").style.display = "none";
    reiniciarCaja();
  });
  menuAbrirCaja.mostrar();

  // Menu inicio , cuando aparece, ejecuta la funcion para mostrar el boton "Cerrar caja"
  let menuInicio = new menu(
    "inicioM",
    "abrirCajaB",
    menuAbrirCaja,
    null,
    () => {
      document.getElementById("informacionS").style.display = "flex";
      document.getElementById("cerrarCajaB").style.display = "flex";
    }
  );

  
  document.getElementById("irInicioB").addEventListener("click", () => {
    // Al volver a inicio, ejecutar las siguientes funciones
    menuInicio.mostrar();
    reiniciarTabla();
    reiniciarCliente();
    menuDialogo.ocultar();
  });
  let menuVenta = new menu("ventaM", "nuevaVentaB", menuInicio, null, () => {
    document.getElementById("confirmarM").style.display = "none";
    document.getElementById("saldoInsuficienteM").style.display = "none";
  });

  document.getElementById("nuevaVentaB").addEventListener("click", () => {
    reiniciarTabla();
  });

  document.getElementById("añadirProducto").addEventListener("click", () => {
    agregarFila();
  });

  let menuDialogo = new menu("dialogoM", "pagarB", menuVenta, "volverB", () => {
    let saldo = pagarI.value;
    // Obtener el valor del total
    let total = document
      .getElementById("total")
      .innerText.replace("Monto Total:", "");
    // Extraer el valor flotante del monto total.
    total = total.replace("Bs.", "");
    // Verificar si el saldo es valido, mostrar el boton de confirmar si es asi.
    if (parseFloat(total) > parseFloat(saldo)) {
      document.getElementById("confirmarM").style.display = "none";
      document.getElementById("saldoInsuficienteM").style.display = "flex";
    } else {
      document.getElementById("confirmarM").style.display = "flex";
      document.getElementById("saldoInsuficienteM").style.display = "none";
    }
  });
  document.getElementById("volverB2").addEventListener("click", () => {
    menuVenta.mostrar();
  });
  document.getElementById("pagarI").addEventListener("input", () => {
    // Al llenar el input de Saldo.
    let saldo = pagarI.value;
    let botonPagar = document.getElementById("pagarB");
    let total = document
      .getElementById("total")
      .innerText.replace("Monto Total:", "");
    total = total.replace("Bs.", "");
    // Validar si el saldo existe en el input, y mostrar el boton de pagar si hay un numero.
    if (!(isNaN(saldo) || saldo == "" || saldo == 0) && parseFloat(total) > 0) {
      botonPagar.style.display = "flex";
    } else {
      botonPagar.style.display = "none";
    }
    actualizarTotal();
  });
  document.getElementById("pagarB").addEventListener("click", () => {
    menuDialogo.mostrar();
  });

  document.getElementById("confirmarB").addEventListener("click", () => {
    // Al confirmar la compra
    document.getElementById("confirmarM").style.display = "none";
    document.getElementById("saldoInsuficienteM").style.display = "none";
    pagar();
    reiniciarTabla();
    reiniciarCliente();
    menuDialogo.ocultar();
    menuInicio.mostrar();
  });
}


document.addEventListener("DOMContentLoaded", function() {
  // Luego de iniciar el Document Object Model
  pagarI = document.getElementById("pagarI");
  tabla = document.getElementById("tablaProductos");
  iniciar();
});
