document.addEventListener('DOMContentLoaded', () => {

    const encabezados = [
        "Numero",
        "ID_Delfin",
        "Estudiante",
        "Sexo",
        "Plantel",
        "No. de control",
        "Programa Académico",
        "Institución de Estancia",
        "Estado de Estancia",
        "País Estancia",
        "Modalidad",
        "Apoyo Estancia",
        "Apoyo Congreso",
        "Apoyo Transporte",
        "Estudiante de.."
    ];

    const tabla = document.getElementById('tablaTalleres');
    const thead = document.getElementById('thead');
    const tbody = document.getElementById('tbody');

    const programas = [
        "Ingeniería Electromecánica",
        "Ingeniería Industrial",
        "Ingeniería en Sistemas Computacionales",
        "Ingeniería en Sistemas Computacionales (Extensión Aculco)",
        "Ingeniería Mecatrónica",
        "Arquitectura",
        "Contador Público",
        "Contador Público (Extensión Aculco)",
        "Ingeniería en Gestión Empresarial",
        "Ingeniería en Materiales",
        "Ingeniería en Animación Digital y Efectos Visuales",
        "Licenciatura en Turismo",
        "Licenciatura en Turismo (Extensión Aculco)",
        "Ingeniería en Logística",
        "Maestría en Ingeniería",
        "Doctorado en Ingeniería"
    ];

    // --- Crear encabezados de la tabla principal ---
    function crearEncabezados() {
        const fila = document.createElement('tr');
        encabezados.forEach(texto => {
            const th = document.createElement('th');
            th.textContent = texto;
            fila.appendChild(th);
        });
        thead.appendChild(fila);
    }
    crearEncabezados();

    // --- Crear fila en tabla principal ---
    function agregarFila() {
        const fila = tbody.insertRow();
        encabezados.forEach(enc => {
            const celda = fila.insertCell();
            if (enc === "Sexo") {
                const select = document.createElement('select');
                select.innerHTML = '<option value=""></option><option value="Hombre">Hombre</option><option value="Mujer">Mujer</option>';
                select.className = "editable-select";
                select.addEventListener('change', actualizarTotales);
                celda.appendChild(select);
            } else if (["Apoyo Estancia","Apoyo Congreso","Apoyo Transporte"].includes(enc)) {
                const input = document.createElement('input');
                input.type = "number";
                input.className = "editable-text";
                input.addEventListener('input', actualizarTotales);
                celda.appendChild(input);
            } else {
                const input = document.createElement('input');
                input.type = "text";
                input.className = "editable-text";
                celda.appendChild(input);
            }
        });
        aplicarEventosInputs();
    }

    for(let i=0;i<6;i++) agregarFila();
    document.getElementById('btnAgregarFila').addEventListener('click', agregarFila);

    // --- Función para actualizar todos los totales ---
    function actualizarTotales() {
        // Objetos resumen
        const resumenSexo = { Hombre:0, Mujer:0 };
        const resumenPlantel = { 'TESJo': {hombres:0, mujeres:0}, 'Extensión Aculco': {hombres:0, mujeres:0} };
        const resumenPrograma = {};
        programas.forEach(p => resumenPrograma[p] = {hombres:0, mujeres:0, apoyoEstancia:0, apoyoCongreso:0, apoyoTransporte:0});

        // Totales generales
        let totalApoyoEstancia=0, totalApoyoCongreso=0, totalApoyoTransporte=0, totalHombres=0, totalMujeres=0;

        Array.from(tbody.rows).forEach(fila => {
            const sexo = fila.cells[3].firstChild.value;
            const plantel = fila.cells[4].firstChild.value;
            const programa = fila.cells[6].firstChild.value.trim();
            const estado = fila.cells[8].firstChild.value;
            const pais = fila.cells[9].firstChild.value;
            const modalidad = fila.cells[10].firstChild.value;
            const apoyoEstancia = parseFloat(fila.cells[11].firstChild.value) || 0;
            const apoyoCongreso = parseFloat(fila.cells[12].firstChild.value) || 0;
            const apoyoTransporte = parseFloat(fila.cells[13].firstChild.value) || 0;

            // Totales generales
            totalApoyoEstancia += apoyoEstancia;
            totalApoyoCongreso += apoyoCongreso;
            totalApoyoTransporte += apoyoTransporte;

            if(sexo==='Hombre') totalHombres++;
            if(sexo==='Mujer') totalMujeres++;

            // Sexo
            if(sexo) resumenSexo[sexo]++;

            // Plantel
            if(resumenPlantel[plantel]){
                if(sexo==='Hombre') resumenPlantel[plantel].hombres++;
                if(sexo==='Mujer') resumenPlantel[plantel].mujeres++;
            }

            // Programa Académico
            if(resumenPrograma[programa]){
                if(sexo==='Hombre') resumenPrograma[programa].hombres++;
                if(sexo==='Mujer') resumenPrograma[programa].mujeres++;
                resumenPrograma[programa].apoyoEstancia += apoyoEstancia;
                resumenPrograma[programa].apoyoCongreso += apoyoCongreso;
                resumenPrograma[programa].apoyoTransporte += apoyoTransporte;
            }
        });

        // --- Actualizar tablas ---
        // Totales Apoyos
        document.getElementById('totalApoyoEstancia').textContent = totalApoyoEstancia;
        document.getElementById('totalApoyoCongreso').textContent = totalApoyoCongreso;
        document.getElementById('totalApoyoTransporte').textContent = totalApoyoTransporte;
        document.getElementById('totalGeneralApoyos').textContent = totalApoyoEstancia + totalApoyoCongreso + totalApoyoTransporte;

        // Totales Estudiantes
        document.getElementById('totalHombres').textContent = totalHombres;
        document.getElementById('totalMujeres').textContent = totalMujeres;
        document.getElementById('totalGeneralEstudiantes').textContent = totalHombres + totalMujeres;

        // Tabla Sexo
        document.getElementById('sexoHombres').textContent = resumenSexo.Hombre;
        document.getElementById('sexoMujeres').textContent = resumenSexo.Mujer;

        // Tabla Plantel
        const tbodyPlantel = document.querySelector('#tablaPlantel tbody');
        Array.from(tbodyPlantel.rows).forEach(fila=>{
            const p = fila.cells[0].textContent;
            fila.cells[1].textContent = resumenPlantel[p] ? resumenPlantel[p].hombres : 0;
            fila.cells[2].textContent = resumenPlantel[p] ? resumenPlantel[p].mujeres : 0;
            fila.cells[3].textContent = (resumenPlantel[p] ? resumenPlantel[p].hombres + resumenPlantel[p].mujeres : 0);
        });

        // Tabla Programa Académico
        const tbodyPrograma = document.querySelector('#tablaPrograma tbody');
        Array.from(tbodyPrograma.rows).forEach(fila => {
            const prog = fila.cells[0].textContent;
            fila.cells[1].textContent = resumenPrograma[prog].hombres;
            fila.cells[2].textContent = resumenPrograma[prog].mujeres;
            fila.cells[3].textContent = resumenPrograma[prog].apoyoEstancia;
            fila.cells[4].textContent = resumenPrograma[prog].apoyoCongreso;
            fila.cells[5].textContent = resumenPrograma[prog].apoyoTransporte;
            fila.cells[6].textContent = resumenPrograma[prog].apoyoEstancia + resumenPrograma[prog].apoyoCongreso + resumenPrograma[prog].apoyoTransporte;
        });
    }

    // --- Navegación con teclado ---
    function aplicarEventosInputs() {
        const allInputs = Array.from(document.querySelectorAll('.editable-text, .editable-select'));
        const colCount = encabezados.length;
        allInputs.forEach((input, idx)=>{
            input.addEventListener('keydown', (e)=>{
                let nextIndex;
                if(e.key==='ArrowDown') nextIndex = idx + colCount;
                else if(e.key==='ArrowUp') nextIndex = idx - colCount;
                else if(e.key==='ArrowRight') nextIndex = idx + 1;
                else if(e.key==='ArrowLeft') nextIndex = idx - 1;
                if(nextIndex>=0 && nextIndex<allInputs.length) allInputs[nextIndex].focus();
            });
        });
    }
    aplicarEventosInputs();

    // --- Mostrar periodo ---
    const periodoTexto = document.getElementById('periodoTexto');
    const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
    if(ciclo){
        const [anioInicio, anioFin] = ciclo.split('-');
        periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
    } else {
        periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
    }
        // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
    });
    // Exportar a Excel
    window.exportToExcel = function () {
        const table = document.getElementById("tablaTalleres");
        const wb = XLSX.utils.table_to_book(table, { sheet: "Estadísticas" });
        XLSX.writeFile(wb, "Plantilla de Investigadores.xlsx");
    };

    // Exportar a PDF
    window.exportToPDF = function () {
        const tabla = document.getElementById("tablaTalleres");
        const opt = {
            margin: 0.5,
            filename: "Plantilla de Investigadores.pdf",
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(tabla).save();
    };

    // Botones
    document.getElementById('btnGuardarExcel').addEventListener('click', exportToExcel);
    document.getElementById('btnGuardarPDF').addEventListener('click', exportToPDF);

    actualizarTotales();
});
