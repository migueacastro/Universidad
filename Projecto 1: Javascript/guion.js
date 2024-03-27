class menu {
    constructor(id, callerId=null, menuAnterior=null, backId=null) {
        this.id = id;
        this.menuAnterior = menuAnterior;
        this.elemento = document.getElementById(this.id);

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
        document.querySelectorAll('.seccion').forEach( elemento => {
            elemento.setAttribute('hidden', '');
        })
        this.elemento.removeAttribute('hidden');
    }
    volver() {
        this.menuAnterior.mostrar();
    }
}


// Lista de objetos que usaremos para seleccionar
listaCategorias = [
    {'letra':'A','nombre':'Cigarrilos y Bebidas Alcohólicas', 'iva':20/100, 'ventas':0, 'acumulado':0},
    {'letra':'B','nombre':'Enlatados y Carnes', 'iva':10/100, 'ventas':0, 'acumulado':0},
    {'letra':'C','nombre':'Arroz, Azúcar y Huevos', 'iva':10/100, 'ventas':0, 'acumulado':0},
]

// Variable en la que se almacena el objeto del dicionario anterior seleccionado
var categoriaActual = null;


function iniciar() {
    // Aqui asignare la escucha de eventos a cada boton que quiero que muestre
    // un menu determinado.

    // Menu inicio 
    let menuInicio = new menu('inicioM', 'categoriasV');
    menuInicio.mostrar();

    // Menu Categorias
    let menuCategorias = new menu('categoriasM', 'nuevaVentaB', menuInicio);
    

    // Menu Compra de Producto
    let menuCompra = new menu('productoM', null, menuCategorias, 'productoV');
    
    
    // Asignar evento de mostrar menuCompra a todos los elementos cuya
    // clase sea activarMenuCompra
    document.querySelectorAll('.activarMenuCompra').forEach(elemento => {

        elemento.addEventListener('click', () => { 
            // Seleccionar categoria actual
            listaCategorias.forEach(categoria => {
                if (categoria.letra == `${elemento.value}`) {
                    categoriaActual = categoria;
                }
            });
            document.getElementById('tituloCompraProducto').innerText = `Articulos: ${categoriaActual.nombre}`;
            document.getElementById('acumulado').innerText = `Acumulado en esta categoría: ${categoriaActual.acumulado}`
            document.getElementById('ventas').innerText = `Ventas en esta categoría: ${categoriaActual.ventas}`
            menuCompra.mostrar() });
    })
    
}


document.addEventListener('DOMContentLoaded', function () {
    iniciar();
    
});