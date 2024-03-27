class menu {
    constructor(id, callerId=null, menuAnterior, ) {
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
        

        // Por defecto, el elemento es ocultado
        this.elemento.setAttribute('hidden','');
    }
    ocultar() {
        this.elemento.setAttribute('hidden','');
    }

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


function iniciar() {
    // Aqui asignare la escucha de eventos a cada boton que quiero que muestre
    // un menu determinado.

    // Menu inicio 
    let menuInicio = new menu('inicioM', 'categoriasV');
    menuInicio.mostrar();

    // Menu Categorias
    let menuCategorias = new menu('categoriasM', 'nuevaVentaB', menuInicio);
}


document.addEventListener('DOMContentLoaded', function () {
    iniciar();
    
});