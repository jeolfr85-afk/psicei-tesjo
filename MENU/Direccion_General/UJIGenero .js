class UJIGenero {
    constructor() {
        this.init();
    }

    init() {
        // Agregar el evento de clic al botón
        const button = document.querySelector('.btn');
        button.addEventListener('click', this.redirectToPage);
    }

    redirectToPage() {
        // Redirige a la página deseada
        window.location.href = "/prueba/prueba/MENU/inicio.php";
    }
}

// Crear una instancia de la clase
new UJIGenero();
