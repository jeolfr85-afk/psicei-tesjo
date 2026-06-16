document.addEventListener('DOMContentLoaded', () => {
    const AREAS = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",         
    ];

    const thead = document.getElementById('thead');
    const tbody = document.getElementById('tbody');

    // Encabezados
    thead.innerHTML = `
        <tr>
            <th>NOMBRE DEL SERVIDOR PÚBLICO (DOCENTE-INVESTIGADOR)</th>
            <th>SISTEMAS DE INVESTIGACIÓN (INVESTIGADOR NACIONAL EMÉRITO, SNI NIVEL 3 NACIONAL, SNI NIVEL 2 NACIONAL, SNI NIVEL 1 NACIONAL, CANDIDATO SNI, INVESTIGADOR NACIONAL, INVESTIGADOR POR INSTITUCIÓN, INVESTIGADOR POR EL SISTEMA ESTATAL, INVESTIGADOR VISITANTE ASOCIADOS O TEMPORALES)</th>
            <th>PROGRAMA ACADÉMICO</th>
            <th>HORAS ASIGNADAS A LA INVESTIGACIÓN</th>
        </tr>
    `;

    // Crear filas por área
    function crearFila(area) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" class="editable-text" placeholder="Nombre del servidor público" /></td>
            <td><input type="text" class="editable-text" placeholder="Escribe el sistema  de investigación" /></td>
            <td><input type="text" class="editable-text" placeholder="Escribe el programa academico" /></td>
            <td><input type="text" class="editable-text" placeholder="Escribe las horas asignadas" /></td>
        `;
        tbody.appendChild(tr);
    }

    AREAS.forEach(crearFila);

    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
    });

    // Aplicar eventos a todos los inputs (navegación con teclado)
    function aplicarEventosInputs() {
        const allInputs = Array.from(document.querySelectorAll('.editable, .editable-text, .editable-select'));
        allInputs.forEach((input) => {
            input.addEventListener('keydown', (e) => {
                const colCount = 5; // Ahora son 5 columnas
                const currentIndex = allInputs.indexOf(e.target);

                if (e.key === 'ArrowDown') {
                    const next = currentIndex + colCount;
                    if (next < allInputs.length) allInputs[next].focus();
                } else if (e.key === 'ArrowUp') {
                    const prev = currentIndex - colCount;
                    if (prev >= 0) allInputs[prev].focus();
                } else if (e.key === 'ArrowRight') {
                    const next = currentIndex + 1;
                    if (next < allInputs.length) allInputs[next].focus();
                } else if (e.key === 'ArrowLeft') {
                    const prev = currentIndex - 1;
                    if (prev >= 0) allInputs[prev].focus();
                }
            });
        });
    }

    aplicarEventosInputs();

    // Mostrar periodo
    const periodoTexto = document.getElementById('periodoTexto');
    const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
    if (ciclo) {
        const [anioInicio, anioFin] = ciclo.split('-');
        const periodo = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
        periodoTexto.textContent = periodo;
    } else {
        periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
    }

    // Exportar a Excel
    window.exportToExcel = function () {
        const table = document.getElementById("tabla");
        const wb = XLSX.utils.table_to_book(table, { sheet: "Estadísticas" });
        XLSX.writeFile(wb, "Plantilla de Investigadores.xlsx");
    };

    // Exportar a PDF
    window.exportToPDF = function () {
        const tabla = document.getElementById("tabla");
        const opt = {
            margin: 0.5,
            filename: "Plantilla de Investigadores.pdf",
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(tabla).save();
    };

    // Eventos para los botones
    document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
    document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);
});
