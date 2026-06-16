document.addEventListener('DOMContentLoaded', () => {

    const encabezados = [
        "PROGRAMA ACADEMICO",
        "NUMERO DE DONCES FORMADOS COMO TUTORES",
        "NUMERO DE PROFESORES QUE PARTICIPAN EN EL PROYECTO INSTITUCIONAL DE ACOMPAÑAMINETO Y TUTORIA DE ESTUDIANTES",
        "NUMERO DE ALUMNOS QUE PARETICIPAN EN EL PROYECTO INSTITUCIONAL DE ACOMPAÑAMIENTO Y TUTORIA A ESTUDIANTES"
    ];

    const thead = document.getElementById('thead');
    const tbody = document.getElementById('tbody');

    // Crear encabezados
    const trHead = document.createElement('tr');
    encabezados.forEach(texto => {
        const th = document.createElement('th');
        th.textContent = texto;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);

    // Función para agregar fila
    function agregarFila() {
        const fila = document.createElement('tr');
        encabezados.forEach((enc, index) => {
            const td = document.createElement('td');
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    }

    // Navegación flechas para celdas normales
    function moverTeclas(e) {
        const td = e.target;
        const tr = td.parentElement;
        const tbody = tr.parentElement;
        let i = Array.from(tr.children).indexOf(td);
        let j = Array.from(tbody.children).indexOf(tr);

        switch(e.key) {
            case 'ArrowRight':
                if(i < tr.children.length - 1) tr.children[i+1].focus();
                break;
            case 'ArrowLeft':
                if(i > 0) tr.children[i-1].focus();
                break;
            case 'ArrowDown':
                if(j < tbody.children.length - 1) tbody.children[j+1].children[i].focus();
                break;
            case 'ArrowUp':
                if(j > 0) tbody.children[j-1].children[i].focus();
                break;
        }
    }

    // Navegación flechas para inputs de fecha
    function moverTeclasInput(e){
        const input = e.target;
        const td = input.parentElement;
        const tr = td.parentElement;
        const tbody = tr.parentElement;
        let i = Array.from(tr.children).indexOf(td);
        let j = Array.from(tbody.children).indexOf(tr);

        switch(e.key) {
            case 'ArrowRight':
                if(i < tr.children.length - 1){
                    const next = tr.children[i+1].querySelector('input') || tr.children[i+1];
                    next.focus();
                }
                break;
            case 'ArrowLeft':
                if(i > 0){
                    const prev = tr.children[i-1].querySelector('input') || tr.children[i-1];
                    prev.focus();
                }
                break;
            case 'ArrowDown':
                if(j < tbody.children.length - 1){
                    const next = tbody.children[j+1].children[i].querySelector('input') || tbody.children[j+1].children[i];
                    next.focus();
                }
                break;
            case 'ArrowUp':
                if(j > 0){
                    const prev = tbody.children[j-1].children[i].querySelector('input') || tbody.children[j-1].children[i];
                    prev.focus();
                }
                break;
        }
    }

    // Actualizar totales
    function actualizarTotales() {
        const tEst = document.getElementById('totalEstudiantes');
        const tAdm = document.getElementById('totalAdministrativos');
        const tDoc = document.getElementById('totalDocentes');
        if(!tEst || !tAdm || !tDoc) return;

        let totalEst = 0, totalAdm = 0, totalDoc = 0;
        Array.from(tbody.children).forEach(fila => {
            const celdas = fila.children;
            totalEst += parseInt(celdas[5].textContent) || 0;
            totalAdm += parseInt(celdas[6].textContent) || 0;
            totalDoc += parseInt(celdas[7].textContent) || 0;
        });

        tEst.textContent = totalEst;
        tAdm.textContent = totalAdm;
        tDoc.textContent = totalDoc;
    }

    // Crear 6 filas iniciales
    for(let i=0; i<6; i++) agregarFila();

    // Botón agregar fila
    const btnAgregarFila = document.getElementById('btnAgregarFila');
    if(btnAgregarFila) btnAgregarFila.addEventListener('click', agregarFila);

    // Exportar Excel
    const btnExcel = document.getElementById('btnGuardarExcel');
    if(btnExcel){
        btnExcel.addEventListener('click', () => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.table_to_sheet(document.getElementById('tablaTalleres'));
            XLSX.utils.book_append_sheet(wb, ws, "Talleres");
            XLSX.writeFile(wb, "talleres.xlsx");
        });
    }

    // Exportar PDF
    const btnPDF = document.getElementById('btnGuardarPDF');
    if(btnPDF){
        btnPDF.addEventListener('click', () => {
            const element = document.getElementById('tablaTalleres');
            html2pdf().set({margin:10, filename:'talleres.pdf', html2canvas:{scale:2}}).from(element).save();
        });
    }

    // Mostrar periodo
    const periodoTexto = document.getElementById('periodoTexto');
    const ciclo = localStorage.getItem('cicloEscolarSeleccionado');
    if (periodoTexto){
        if(ciclo){
            const [anioInicio, anioFin] = ciclo.split('-');
            periodoTexto.textContent = `Periodo: Septiembre ${anioInicio.slice(-4)} - Febrero ${anioFin.slice(-4)}`;
        } else {
            periodoTexto.textContent = 'Periodo: Septiembre XXXX - Febrero XXXX';
        }
    }

    // Sidebar toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    if(sidebar && toggleBtn){
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '⯈' : '⯇';
        });
    }

});
