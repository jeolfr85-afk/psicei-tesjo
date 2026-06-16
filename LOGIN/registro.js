document.addEventListener("DOMContentLoaded", function () {
    const registroForm = document.getElementById("registroForm");

    registroForm.addEventListener("submit", function (e) {
        const selectedArea = document.getElementById("area").value.trim();

        if (selectedArea === "") {
            alert("Por favor selecciona un área válida.");
            e.preventDefault(); // evita que se envíe si no hay área
            return;
        }
    });
});

