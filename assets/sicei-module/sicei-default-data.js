/** Registros iniciales por subárea (10 c/u) — se cargan si el módulo está vacío */
(function () {
  'use strict';

  const P = [
    'INGENIERÍA ELECTROMECÁNICA IEME-2010-210',
    'INGENIERÍA INDUSTRIAL IIND-2010-227',
    'INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224',
    'INGENIERÍA MECATRÓNICA IMCT-2010-229',
    'ARQUITECTURA ARQU-2010-204',
    'CONTADOR PÚBLICO COPU-2010-205',
    'INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201',
    'INGENIERÍA QUÍMICA IQUI-2010-232',
    'INGENIERÍA EN MATERIALES IMAT-2010-222',
    'LICENCIATURA EN TURISMO LTUR-2012-237'
  ];

  window.SICEI_DEFAULT_DATA = {
    'sicei_alumnos_eventos_': [
      { id: 'ae1', programa: P[0], nombre: 'Juan Pablo García Mendoza', sexo: 'Hombre', areaConocimiento: 'Ingeniería', etapa: 'Congreso regional', fecha: '2026-03-12', resultados: 'Mención honorífica', estado: 'completada', observaciones: 'Participación en expo ciencias.' },
      { id: 'ae2', programa: P[1], nombre: 'María Fernanda López Castro', sexo: 'Mujer', areaConocimiento: 'Ciencias básicas', etapa: 'Foro estudiantil', fecha: '2026-03-18', resultados: 'Ponencia aceptada', estado: 'revisada', observaciones: '' },
      { id: 'ae3', programa: P[2], nombre: 'Diego Alejandro Ruiz Hernández', sexo: 'Hombre', areaConocimiento: 'Tecnología', etapa: 'Hackathon', fecha: '2026-04-02', resultados: 'Segundo lugar', estado: 'completada', observaciones: 'Equipo interdisciplinario.' },
      { id: 'ae4', programa: P[3], nombre: 'Valeria Sofía Martínez Pérez', sexo: 'Mujer', areaConocimiento: 'Ingeniería', etapa: 'Semana académica', fecha: '2026-04-09', resultados: 'Participación destacada', estado: 'completada', observaciones: '' },
      { id: 'ae5', programa: P[4], nombre: 'Luis Eduardo González Torres', sexo: 'Hombre', areaConocimiento: 'Diseño', etapa: 'Concurso nacional', fecha: '2026-04-15', resultados: 'Finalista', estado: 'pendiente', observaciones: 'Pendiente certificado.' },
      { id: 'ae6', programa: P[5], nombre: 'Camila Isabel Reyes Vargas', sexo: 'Mujer', areaConocimiento: 'Administración', etapa: 'Simposio', fecha: '2026-04-22', resultados: 'Asistencia certificada', estado: 'completada', observaciones: '' },
      { id: 'ae7', programa: P[6], nombre: 'Andrés Felipe Jiménez Silva', sexo: 'Hombre', areaConocimiento: 'Emprendimiento', etapa: 'Feria de proyectos', fecha: '2026-05-03', resultados: 'Proyecto seleccionado', estado: 'revisada', observaciones: '' },
      { id: 'ae8', programa: P[7], nombre: 'Daniela Paola Herrera Luna', sexo: 'Mujer', areaConocimiento: 'Química', etapa: 'Jornada de investigación', fecha: '2026-05-08', resultados: 'Cartel presentado', estado: 'completada', observaciones: '' },
      { id: 'ae9', programa: P[8], nombre: 'Santiago Morales Delgado', sexo: 'Hombre', areaConocimiento: 'Materiales', etapa: 'Taller técnico', fecha: '2026-05-14', resultados: 'Asistencia completa', estado: 'completada', observaciones: '' },
      { id: 'ae10', programa: P[9], nombre: 'Ximena Alejandra Ortiz Ríos', sexo: 'Mujer', areaConocimiento: 'Turismo', etapa: 'Congreso estatal', fecha: '2026-05-20', resultados: 'Ponente invitada', estado: 'completada', observaciones: 'Evento en Jocotitlán.' }
    ],

    'sicei_capacita_doc_acad_': [
      { id: 'cd1', nombreCurso: 'Metodología de la investigación', institucion: 'TESJo', instructor: 'Dra. Ana Sánchez Ruiz', participante: 'Mtro. Roberto Hernández Luna', sexo: 'Hombre', programa: P[0], beca: 'No', tipoCurso: 'Curso', duracion: '40 horas', periodo: 'Ene–Jun 2026', lugar: 'TESJo', estado: 'completada', observaciones: '' },
      { id: 'cd2', nombreCurso: 'Evaluación por competencias', institucion: 'IPN', instructor: 'Dr. Miguel Torres', participante: 'Mtra. Laura Patricia Vega', sexo: 'Mujer', programa: P[1], beca: 'Sí', tipoCurso: 'Diplomado', duracion: '60 horas', periodo: 'Ene–Jun 2026', lugar: 'Virtual', estado: 'completada', observaciones: '' },
      { id: 'cd3', nombreCurso: 'Aula invertida', institucion: 'UNAM', instructor: 'Ing. Carlos Morales', participante: 'Ing. Gabriela Mendoza Flores', sexo: 'Mujer', programa: P[2], beca: 'No', tipoCurso: 'Taller', duracion: '20 horas', periodo: 'Ene–Jun 2026', lugar: 'TESJo', estado: 'revisada', observaciones: '' },
      { id: 'cd4', nombreCurso: 'Inteligencia artificial aplicada', institucion: 'Microsoft Learn', instructor: 'Especialista certificado', participante: 'Mtro. Jorge Luis Ramírez', sexo: 'Hombre', programa: P[3], beca: 'No', tipoCurso: 'Curso', duracion: '30 horas', periodo: 'Ene–Jun 2026', lugar: 'Virtual', estado: 'completada', observaciones: '' },
      { id: 'cd5', nombreCurso: 'Gestión de proyectos PMI', institucion: 'Coursera', instructor: 'Facilitador PMI', participante: 'Dra. Patricia Elizabeth Cruz', sexo: 'Mujer', programa: P[4], beca: 'No', tipoCurso: 'Curso', duracion: '45 horas', periodo: 'Ene–Jun 2026', lugar: 'Virtual', estado: 'pendiente', observaciones: 'En curso.' },
      { id: 'cd6', nombreCurso: 'Normatividad educativa', institucion: 'TESJo', instructor: 'Lic. Ricardo Mejía', participante: 'Ing. Fernando Díaz Ortega', sexo: 'Hombre', programa: P[5], beca: 'No', tipoCurso: 'Seminario', duracion: '16 horas', periodo: 'Ene–Jun 2026', lugar: 'TESJo', estado: 'completada', observaciones: '' },
      { id: 'cd7', nombreCurso: 'Diseño instruccional', institucion: 'UAEM', instructor: 'Mtra. Silvia Núñez', participante: 'Mtra. Silvia Guadalupe Núñez', sexo: 'Mujer', programa: P[6], beca: 'Sí', tipoCurso: 'Curso', duracion: '32 horas', periodo: 'Ene–Jun 2026', lugar: 'Híbrido', estado: 'completada', observaciones: '' },
      { id: 'cd8', nombreCurso: 'Tutoría y acompañamiento', institucion: 'TESJo', instructor: 'Dra. Beatriz Solís', participante: 'Ing. Héctor Valdez', sexo: 'Hombre', programa: P[7], beca: 'No', tipoCurso: 'Taller', duracion: '24 horas', periodo: 'Ene–Jun 2026', lugar: 'TESJo', estado: 'completada', observaciones: '' },
      { id: 'cd9', nombreCurso: 'Uso avanzado de Moodle', institucion: 'TESJo', instructor: 'Ing. Rosa Pineda', participante: 'Mtra. Norma Estrada', sexo: 'Mujer', programa: P[8], beca: 'No', tipoCurso: 'Taller', duracion: '18 horas', periodo: 'Ene–Jun 2026', lugar: 'Virtual', estado: 'revisada', observaciones: '' },
      { id: 'cd10', nombreCurso: 'Liderazgo educativo', institucion: 'CONACYT', instructor: 'Dr. Arturo Campos', participante: 'Lic. Óscar Fuentes', sexo: 'Hombre', programa: P[9], beca: 'Sí', tipoCurso: 'Diplomado', duracion: '80 horas', periodo: 'Ene–Jun 2026', lugar: 'Virtual', estado: 'completada', observaciones: '' }
    ],

    'sicei_tele_hardware_': [
      { id: 'th1', sede: 'TES Jocotitlán', marca: 'Dell', modelo: 'PowerEdge R740', tipoServidor: 'Servidor', memoria: '64 GB', disco: '1 TB SSD', estado: 'completada', observaciones: 'Servidor principal de aplicaciones.' },
      { id: 'th2', sede: 'TES Jocotitlán', marca: 'Cisco', modelo: 'Catalyst 2960', tipoServidor: 'Switch', memoria: '—', disco: '—', estado: 'completada', observaciones: 'Switch edificio A.' },
      { id: 'th3', sede: 'Extensión Aculco', marca: 'HP', modelo: 'ProDesk 400', tipoServidor: 'Estación de trabajo', memoria: '16 GB', disco: '512 GB SSD', estado: 'completada', observaciones: '' },
      { id: 'th4', sede: 'TES Jocotitlán', marca: 'Ubiquiti', modelo: 'EdgeRouter X', tipoServidor: 'Router', memoria: '—', disco: '—', estado: 'revisada', observaciones: 'Enlace campus.' },
      { id: 'th5', sede: 'TES Jocotitlán', marca: 'Fortinet', modelo: 'FortiGate 60F', tipoServidor: 'Firewall', memoria: '—', disco: '—', estado: 'completada', observaciones: '' },
      { id: 'th6', sede: 'TES Jocotitlán', marca: 'Lenovo', modelo: 'ThinkCentre M920', tipoServidor: 'Estación de trabajo', memoria: '8 GB', disco: '256 GB SSD', estado: 'completada', observaciones: 'Laboratorio 2.' },
      { id: 'th7', sede: 'Extensión Aculco', marca: 'Dell', modelo: 'OptiPlex 7090', tipoServidor: 'Estación de trabajo', memoria: '16 GB', disco: '512 GB SSD', estado: 'pendiente', observaciones: 'Pendiente mantenimiento.' },
      { id: 'th8', sede: 'TES Jocotitlán', marca: 'HP', modelo: 'ProLiant DL380', tipoServidor: 'Servidor', memoria: '128 GB', disco: '2 TB SSD', estado: 'completada', observaciones: 'Servidor de respaldo.' },
      { id: 'th9', sede: 'TES Jocotitlán', marca: 'Cisco', modelo: 'ISR 4331', tipoServidor: 'Router', memoria: '—', disco: '—', estado: 'completada', observaciones: '' },
      { id: 'th10', sede: 'TES Jocotitlán', marca: 'Lenovo', modelo: 'ThinkPad L14', tipoServidor: 'Estación de trabajo', memoria: '16 GB', disco: '512 GB SSD', estado: 'completada', observaciones: 'Equipo docente móvil.' }
    ],

    'sicei_tele_software_': [
      { id: 'ts1', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'Windows Server 2022', categoria: 'Sistema operativo', licencias: 2, estado: 'completada', observaciones: '' },
      { id: 'ts2', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'Moodle', categoria: 'Educación', licencias: 1, estado: 'completada', observaciones: 'Plataforma institucional.' },
      { id: 'ts3', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'Microsoft 365 A3', categoria: 'Productividad', licencias: 500, estado: 'completada', observaciones: '' },
      { id: 'ts4', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'AutoCAD', categoria: 'Diseño', licencias: 40, estado: 'revisada', observaciones: '' },
      { id: 'ts5', sede: 'Extensión Aculco', tipoSoftware: 'Usado', nombre: 'MATLAB', categoria: 'Ingeniería', licencias: 25, estado: 'completada', observaciones: '' },
      { id: 'ts6', sede: 'TES Jocotitlán', tipoSoftware: 'Desarrollado', nombre: 'SICEI', categoria: 'Gestión', licencias: 1, estado: 'completada', observaciones: 'Sistema interno TESJo.' },
      { id: 'ts7', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'Adobe Creative Cloud', categoria: 'Diseño', licencias: 15, estado: 'completada', observaciones: '' },
      { id: 'ts8', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'Zoom Education', categoria: 'Comunicación', licencias: 50, estado: 'completada', observaciones: '' },
      { id: 'ts9', sede: 'TES Jocotitlán', tipoSoftware: 'Usado', nombre: 'ESET Endpoint', categoria: 'Seguridad', licencias: 200, estado: 'completada', observaciones: '' },
      { id: 'ts10', sede: 'Extensión Aculco', tipoSoftware: 'Usado', nombre: 'Visual Studio Community', categoria: 'Desarrollo', licencias: 30, estado: 'pendiente', observaciones: 'Renovación en trámite.' }
    ],

    'sicei_recursos_info_': [
      { id: 'ri1', recurso: 'Proyector Epson', tipo: 'Hardware', cantidad: 12, ubicacion: 'Edificio A', area: 'Centro de Cómputo', estado: 'completada', observaciones: '' },
      { id: 'ri2', recurso: 'Laptop docente Dell', tipo: 'Hardware', cantidad: 8, ubicacion: 'Oficinas', area: 'Desarrollo Académico', estado: 'completada', observaciones: '' },
      { id: 'ri3', recurso: 'Switch 24 puertos', tipo: 'Red', cantidad: 6, ubicacion: 'Rack principal', area: 'Centro de Cómputo', estado: 'completada', observaciones: '' },
      { id: 'ri4', recurso: 'Access point WiFi 6', tipo: 'Red', cantidad: 15, ubicacion: 'Campus', area: 'Centro de Cómputo', estado: 'revisada', observaciones: '' },
      { id: 'ri5', recurso: 'Impresora multifuncional', tipo: 'Hardware', cantidad: 4, ubicacion: 'Biblioteca', area: 'Vinculación', estado: 'completada', observaciones: '' },
      { id: 'ri6', recurso: 'Tablet Samsung', tipo: 'Hardware', cantidad: 10, ubicacion: 'Laboratorio', area: 'Investigación', estado: 'completada', observaciones: '' },
      { id: 'ri7', recurso: 'Licencia antivirus', tipo: 'Software', cantidad: 200, ubicacion: 'Institucional', area: 'Centro de Cómputo', estado: 'completada', observaciones: '' },
      { id: 'ri8', recurso: 'UPS 1500VA', tipo: 'Hardware', cantidad: 5, ubicacion: 'Servidores', area: 'Centro de Cómputo', estado: 'completada', observaciones: '' },
      { id: 'ri9', recurso: 'Cámara web HD', tipo: 'Hardware', cantidad: 20, ubicacion: 'Aulas', area: 'Desarrollo Académico', estado: 'pendiente', observaciones: 'En proceso de instalación.' },
      { id: 'ri10', recurso: 'Micrófono inalámbrico', tipo: 'Hardware', cantidad: 6, ubicacion: 'Auditorio', area: 'Difusión', estado: 'completada', observaciones: '' }
    ],

    'sicei_proy_investigacion_': [
      { id: 'pi1', nombreProyecto: 'Optimización energética en procesos industriales', investigador: 'Dr. Miguel Ángel Torres', programa: P[1], linea: 'Desarrollo tecnológico', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'TESJo', estado: 'completada', observaciones: '' },
      { id: 'pi2', nombreProyecto: 'Sistema IoT para monitoreo agrícola', investigador: 'Ing. Carlos Eduardo Morales', programa: P[2], linea: 'Aplicación industrial', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'CONACYT', estado: 'completada', observaciones: '' },
      { id: 'pi3', nombreProyecto: 'Nuevos compuestos en materiales poliméricos', investigador: 'Dra. Ana María Sánchez Ruiz', programa: P[8], linea: 'Ciencia de materiales', periodo: '2026-B', estadoProyecto: 'En formulación', financiamiento: 'Fondo institucional', estado: 'pendiente', observaciones: '' },
      { id: 'pi4', nombreProyecto: 'Software de gestión académica móvil', investigador: 'Ing. Gabriela Mendoza Flores', programa: P[2], linea: 'Tecnologías de la información', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'TESJo', estado: 'revisada', observaciones: '' },
      { id: 'pi5', nombreProyecto: 'Tratamiento de aguas residuales', investigador: 'Ing. Fernando Díaz Ortega', programa: P[7], linea: 'Ingeniería química', periodo: '2026-B', estadoProyecto: 'Concluido', financiamiento: 'CONACYT', estado: 'completada', observaciones: '' },
      { id: 'pi6', nombreProyecto: 'Diseño sustentable de vivienda social', investigador: 'Mtra. Laura Patricia Vega', programa: P[4], linea: 'Arquitectura sustentable', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'TESJo', estado: 'completada', observaciones: '' },
      { id: 'pi7', nombreProyecto: 'Automatización con PLC en líneas de producción', investigador: 'Mtro. Roberto Hernández Luna', programa: P[3], linea: 'Mecatrónica', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'Sector privado', estado: 'completada', observaciones: '' },
      { id: 'pi8', nombreProyecto: 'Turismo comunitario en la región', investigador: 'Mtra. Silvia Guadalupe Núñez', programa: P[9], linea: 'Desarrollo regional', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'TESJo', estado: 'completada', observaciones: '' },
      { id: 'pi9', nombreProyecto: 'Contabilidad forense en PyMEs', investigador: 'C.P. Beatriz Solís', programa: P[5], linea: 'Ciencias administrativas', periodo: '2026-B', estadoProyecto: 'En formulación', financiamiento: 'Fondo institucional', estado: 'pendiente', observaciones: '' },
      { id: 'pi10', nombreProyecto: 'Eficiencia en sistemas electromecánicos', investigador: 'Ing. Héctor Valdez', programa: P[0], linea: 'Energía', periodo: '2026-B', estadoProyecto: 'En curso', financiamiento: 'TESJo', estado: 'completada', observaciones: '' }
    ],

    'sicei_plantilla_inv_': [
      { id: 'pl1', nombre: 'Dr. Miguel Ángel Torres', sistemaInvestigacion: 'SNII', programa: P[1], horasInvestigacion: 12, estado: 'completada', observaciones: '' },
      { id: 'pl2', nombre: 'Dra. Ana María Sánchez Ruiz', sistemaInvestigacion: 'SNII', programa: P[8], horasInvestigacion: 16, estado: 'completada', observaciones: '' },
      { id: 'pl3', nombre: 'Ing. Carlos Eduardo Morales', sistemaInvestigacion: 'PRODEP', programa: P[2], horasInvestigacion: 8, estado: 'completada', observaciones: '' },
      { id: 'pl4', nombre: 'Ing. Gabriela Mendoza Flores', sistemaInvestigacion: 'SNII', programa: P[2], horasInvestigacion: 10, estado: 'revisada', observaciones: '' },
      { id: 'pl5', nombre: 'Mtro. Roberto Hernández Luna', sistemaInvestigacion: 'PRODEP', programa: P[3], horasInvestigacion: 6, estado: 'completada', observaciones: '' },
      { id: 'pl6', nombre: 'Mtra. Laura Patricia Vega', sistemaInvestigacion: 'Ninguno', programa: P[4], horasInvestigacion: 4, estado: 'completada', observaciones: '' },
      { id: 'pl7', nombre: 'Ing. Fernando Díaz Ortega', sistemaInvestigacion: 'SNII', programa: P[7], horasInvestigacion: 14, estado: 'completada', observaciones: '' },
      { id: 'pl8', nombre: 'Mtra. Silvia Guadalupe Núñez', sistemaInvestigacion: 'PRODEP', programa: P[9], horasInvestigacion: 6, estado: 'completada', observaciones: '' },
      { id: 'pl9', nombre: 'C.P. Beatriz Solís', sistemaInvestigacion: 'Ninguno', programa: P[5], horasInvestigacion: 4, estado: 'pendiente', observaciones: '' },
      { id: 'pl10', nombre: 'Ing. Héctor Valdez', sistemaInvestigacion: 'PRODEP', programa: P[0], horasInvestigacion: 8, estado: 'completada', observaciones: '' }
    ],

    'sicei_snii_': [
      { id: 'sn1', nombreDocente: 'Dr. Miguel Ángel Torres', sexo: 'Masculino', nivelEstudios: 'Doctorado', escolaridad: 'Doctor en Ciencias', programa: P[1], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'SNII Nivel II', estado: 'completada', observaciones: '' },
      { id: 'sn2', nombreDocente: 'Dra. Ana María Sánchez Ruiz', sexo: 'Femenino', nivelEstudios: 'Doctorado', escolaridad: 'Doctora en Ingeniería', programa: P[8], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'SNII Nivel I', estado: 'completada', observaciones: '' },
      { id: 'sn3', nombreDocente: 'Ing. Carlos Eduardo Morales', sexo: 'Masculino', nivelEstudios: 'Maestría', escolaridad: 'Maestro en Tecnología', programa: P[2], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'Candidato SNII', estado: 'revisada', observaciones: '' },
      { id: 'sn4', nombreDocente: 'Ing. Gabriela Mendoza Flores', sexo: 'Femenino', nivelEstudios: 'Maestría', escolaridad: 'Maestra en Ciencias', programa: P[2], dedicacion: 'Medio tiempo', sistemaInvestigacion: 'SNII Nivel I', estado: 'completada', observaciones: '' },
      { id: 'sn5', nombreDocente: 'Mtro. Roberto Hernández Luna', sexo: 'Masculino', nivelEstudios: 'Maestría', escolaridad: 'Maestro en Educación', programa: P[3], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'Candidato SNII', estado: 'completada', observaciones: '' },
      { id: 'sn6', nombreDocente: 'Mtra. Laura Patricia Vega', sexo: 'Femenino', nivelEstudios: 'Maestría', escolaridad: 'Maestra en Arquitectura', programa: P[4], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'Ninguno', estado: 'completada', observaciones: '' },
      { id: 'sn7', nombreDocente: 'Ing. Fernando Díaz Ortega', sexo: 'Masculino', nivelEstudios: 'Doctorado', escolaridad: 'Doctor en Química', programa: P[7], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'SNII Nivel I', estado: 'completada', observaciones: '' },
      { id: 'sn8', nombreDocente: 'Mtra. Silvia Guadalupe Núñez', sexo: 'Femenino', nivelEstudios: 'Maestría', escolaridad: 'Maestra en Turismo', programa: P[9], dedicacion: 'Medio tiempo', sistemaInvestigacion: 'Candidato SNII', estado: 'completada', observaciones: '' },
      { id: 'sn9', nombreDocente: 'C.P. Beatriz Solís', sexo: 'Femenino', nivelEstudios: 'Licenciatura', escolaridad: 'Contador Público', programa: P[5], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'Ninguno', estado: 'pendiente', observaciones: '' },
      { id: 'sn10', nombreDocente: 'Ing. Héctor Valdez', sexo: 'Masculino', nivelEstudios: 'Maestría', escolaridad: 'Maestro en Ingeniería', programa: P[0], dedicacion: 'Tiempo completo', sistemaInvestigacion: 'Candidato SNII', estado: 'completada', observaciones: '' }
    ],

    'sicei_act_deportivas_': [
      { id: 'dep1', programa: P[0], sexo: 'HOMBRE', disciplina: 'FUTBOL', tipoInscripcion: 'Selección', cantidad: 22, estado: 'completada', observaciones: '' },
      { id: 'dep2', programa: P[1], sexo: 'MUJER', disciplina: 'VOLEIBOL', tipoInscripcion: 'Selección', cantidad: 14, estado: 'completada', observaciones: '' },
      { id: 'dep3', programa: P[2], sexo: 'HOMBRE', disciplina: 'BASQUETBALL', tipoInscripcion: 'Taller', cantidad: 18, estado: 'completada', observaciones: '' },
      { id: 'dep4', programa: P[3], sexo: 'MUJER', disciplina: 'ATLETISMO', tipoInscripcion: 'Taller', cantidad: 12, estado: 'revisada', observaciones: '' },
      { id: 'dep5', programa: P[4], sexo: 'HOMBRE', disciplina: 'TEAKWONDO', tipoInscripcion: 'Taller', cantidad: 15, estado: 'completada', observaciones: '' },
      { id: 'dep6', programa: P[5], sexo: 'MUJER', disciplina: 'GIMNASIO', tipoInscripcion: 'Taller', cantidad: 20, estado: 'completada', observaciones: '' },
      { id: 'dep7', programa: P[6], sexo: 'HOMBRE', disciplina: 'TENIS DE MESA', tipoInscripcion: 'Taller', cantidad: 10, estado: 'completada', observaciones: '' },
      { id: 'dep8', programa: P[7], sexo: 'MUJER', disciplina: 'BOX', tipoInscripcion: 'Taller', cantidad: 8, estado: 'completada', observaciones: '' },
      { id: 'dep9', programa: P[8], sexo: 'HOMBRE', disciplina: 'TIRO CON ARCO', tipoInscripcion: 'Selección', cantidad: 6, estado: 'pendiente', observaciones: '' },
      { id: 'dep10', programa: P[9], sexo: 'MUJER', disciplina: 'FUTBOL BARDAS', tipoInscripcion: 'Taller', cantidad: 16, estado: 'completada', observaciones: '' }
    ],

    'sicei_act_culturales_': [
      { id: 'cul1', programa: P[0], sexo: 'MUJER', taller: 'DANZA FOLCLORICA', tipoInscripcion: 'Selección', cantidad: 18, estado: 'completada', observaciones: '' },
      { id: 'cul2', programa: P[1], sexo: 'HOMBRE', taller: 'TEATRO MUSICAL', tipoInscripcion: 'Taller', cantidad: 14, estado: 'completada', observaciones: '' },
      { id: 'cul3', programa: P[2], sexo: 'MUJER', taller: 'CORO', tipoInscripcion: 'Selección', cantidad: 22, estado: 'completada', observaciones: '' },
      { id: 'cul4', programa: P[3], sexo: 'HOMBRE', taller: 'PINTURA', tipoInscripcion: 'Taller', cantidad: 12, estado: 'revisada', observaciones: '' },
      { id: 'cul5', programa: P[4], sexo: 'MUJER', taller: 'AJEDREZ', tipoInscripcion: 'Taller', cantidad: 10, estado: 'completada', observaciones: '' },
      { id: 'cul6', programa: P[5], sexo: 'HOMBRE', taller: 'BANDA DE ROCK', tipoInscripcion: 'Selección', cantidad: 8, estado: 'completada', observaciones: '' },
      { id: 'cul7', programa: P[6], sexo: 'MUJER', taller: 'RITMOS LATINOS', tipoInscripcion: 'Taller', cantidad: 16, estado: 'completada', observaciones: '' },
      { id: 'cul8', programa: P[7], sexo: 'HOMBRE', taller: 'ESCULTURA', tipoInscripcion: 'Taller', cantidad: 9, estado: 'completada', observaciones: '' },
      { id: 'cul9', programa: P[8], sexo: 'MUJER', taller: 'LECTURA', tipoInscripcion: 'Taller', cantidad: 11, estado: 'pendiente', observaciones: '' },
      { id: 'cul10', programa: P[9], sexo: 'HOMBRE', taller: 'SHOW DANCE', tipoInscripcion: 'Selección', cantidad: 15, estado: 'completada', observaciones: '' }
    ],

    'sicei_cursos_continua_': [
      { id: 'ec1', tipoCurso: 'CURSOS CORTOS', nombreCurso: 'Excel avanzado para administración', hombres: 8, mujeres: 12, total: 20, discapacidad: 1, hablantesIndigenas: 0, estado: 'completada', observaciones: '' },
      { id: 'ec2', tipoCurso: 'DIPLOMADOS', nombreCurso: 'Diplomado en logística y cadena de suministro', hombres: 15, mujeres: 10, total: 25, discapacidad: 0, hablantesIndigenas: 2, estado: 'completada', observaciones: '' },
      { id: 'ec3', tipoCurso: 'SEMINARIOS', nombreCurso: 'Seminario de normatividad laboral', hombres: 6, mujeres: 9, total: 15, discapacidad: 0, hablantesIndigenas: 0, estado: 'revisada', observaciones: '' },
      { id: 'ec4', tipoCurso: 'TALLERES', nombreCurso: 'Taller de soldadura básica', hombres: 18, mujeres: 4, total: 22, discapacidad: 1, hablantesIndigenas: 1, estado: 'completada', observaciones: '' },
      { id: 'ec5', tipoCurso: 'CURSOS CORTOS', nombreCurso: 'Introducción a la programación Python', hombres: 14, mujeres: 11, total: 25, discapacidad: 0, hablantesIndigenas: 0, estado: 'completada', observaciones: '' },
      { id: 'ec6', tipoCurso: 'DIPLOMADOS', nombreCurso: 'Diplomado en gestión de proyectos', hombres: 10, mujeres: 14, total: 24, discapacidad: 2, hablantesIndigenas: 0, estado: 'completada', observaciones: '' },
      { id: 'ec7', tipoCurso: 'TALLERES', nombreCurso: 'Taller de emprendimiento', hombres: 9, mujeres: 13, total: 22, discapacidad: 0, hablantesIndigenas: 3, estado: 'completada', observaciones: '' },
      { id: 'ec8', tipoCurso: 'SEMINARIOS', nombreCurso: 'Seminario de energías renovables', hombres: 12, mujeres: 8, total: 20, discapacidad: 0, hablantesIndigenas: 0, estado: 'pendiente', observaciones: '' },
      { id: 'ec9', tipoCurso: 'OTROS', nombreCurso: 'Curso de primeros auxilios', hombres: 7, mujeres: 11, total: 18, discapacidad: 1, hablantesIndigenas: 0, estado: 'completada', observaciones: '' },
      { id: 'ec10', tipoCurso: 'CURSOS CORTOS', nombreCurso: 'AutoCAD básico', hombres: 16, mujeres: 6, total: 22, discapacidad: 0, hablantesIndigenas: 1, estado: 'completada', observaciones: '' }
    ],

    'sicei_proy_vinculacion_': [
      { id: 'pv1', area: 'INVESTIGACIÓN Y DESARROLLO', sector: 'Manufactura', numeroAlumnos: 12, nombreProyecto: 'Vinculación con PyME metalmecánica', estado: 'completada', observaciones: '' },
      { id: 'pv2', area: 'ASESORÍAS TÉCNICAS', sector: 'Servicios', numeroAlumnos: 8, nombreProyecto: 'Consultoría contable a MIPyMEs', estado: 'completada', observaciones: '' },
      { id: 'pv3', area: 'PRÁCTICAS PROFESIONALES', sector: 'Tecnología', numeroAlumnos: 15, nombreProyecto: 'Prácticas en empresa de software', estado: 'revisada', observaciones: '' },
      { id: 'pv4', area: 'EDUCACIÓN CONTINUA', sector: 'Social', numeroAlumnos: 20, nombreProyecto: 'Capacitación comunitaria en turismo', estado: 'completada', observaciones: '' },
      { id: 'pv5', area: 'SERVICIO SOCIAL', sector: 'Gobierno', numeroAlumnos: 10, nombreProyecto: 'Apoyo a dependencia municipal', estado: 'completada', observaciones: '' },
      { id: 'pv6', area: 'INVESTIGACIÓN Y DESARROLLO', sector: 'Agroindustria', numeroAlumnos: 9, nombreProyecto: 'Proyecto de riego tecnificado', estado: 'completada', observaciones: '' },
      { id: 'pv7', area: 'ASESORÍAS TÉCNICAS', sector: 'Construcción', numeroAlumnos: 11, nombreProyecto: 'Asesoría en obra habitacional', estado: 'pendiente', observaciones: '' },
      { id: 'pv8', area: 'PRÁCTICAS PROFESIONALES', sector: 'Manufactura', numeroAlumnos: 14, nombreProyecto: 'Estancia en planta industrial', estado: 'completada', observaciones: '' },
      { id: 'pv9', area: 'OTROS', sector: 'Salud', numeroAlumnos: 6, nombreProyecto: 'Campamento de salud comunitaria', estado: 'completada', observaciones: '' },
      { id: 'pv10', area: 'EDUCACIÓN CONTINUA', sector: 'Educación', numeroAlumnos: 18, nombreProyecto: 'Talleres en secundarias locales', estado: 'completada', observaciones: '' }
    ],

    'sicei_servicio_comunidad_': [
      { id: 'sc1', area: 'JURÍDICA', consultas: 45, beneficiarios: 80, estado: 'completada', observaciones: 'Asesorías legales gratuitas.' },
      { id: 'sc2', area: 'SALUD', consultas: 60, beneficiarios: 120, estado: 'completada', observaciones: 'Jornada de salud.' },
      { id: 'sc3', area: 'EDUCACIÓN', consultas: 35, beneficiarios: 200, estado: 'revisada', observaciones: 'Apoyo escolar.' },
      { id: 'sc4', area: 'VIVIENDA', consultas: 28, beneficiarios: 55, estado: 'completada', observaciones: '' },
      { id: 'sc5', area: 'ECOLOGÍA', consultas: 22, beneficiarios: 90, estado: 'completada', observaciones: 'Reforestación comunitaria.' },
      { id: 'sc6', area: 'JURÍDICA', consultas: 30, beneficiarios: 48, estado: 'completada', observaciones: '' },
      { id: 'sc7', area: 'SALUD', consultas: 40, beneficiarios: 75, estado: 'completada', observaciones: '' },
      { id: 'sc8', area: 'EDUCACIÓN', consultas: 50, beneficiarios: 150, estado: 'completada', observaciones: '' },
      { id: 'sc9', area: 'VIVIENDA', consultas: 18, beneficiarios: 36, estado: 'pendiente', observaciones: '' },
      { id: 'sc10', area: 'ECOLOGÍA', consultas: 25, beneficiarios: 60, estado: 'completada', observaciones: '' }
    ],

    'sicei_servicio_social_': [
      { id: 'ss1', programa: P[0], tipoRegistro: 'En proceso', categoria: 'Sector público', subcategoria: 'HOMBRES', cantidad: 18, estado: 'completada', observaciones: '' },
      { id: 'ss2', programa: P[1], tipoRegistro: 'Concluyeron', categoria: 'Sector social', subcategoria: 'MUJERES', cantidad: 22, estado: 'completada', observaciones: '' },
      { id: 'ss3', programa: P[2], tipoRegistro: 'Deben realizar', categoria: 'Sector privado', subcategoria: 'HOMBRES', cantidad: 15, estado: 'revisada', observaciones: '' },
      { id: 'ss4', programa: P[3], tipoRegistro: 'Por sector', categoria: 'Manufactura', subcategoria: 'MUJERES', cantidad: 12, estado: 'completada', observaciones: '' },
      { id: 'ss5', programa: P[4], tipoRegistro: 'En proceso', categoria: 'Construcción', subcategoria: 'HOMBRES', cantidad: 10, estado: 'completada', observaciones: '' },
      { id: 'ss6', programa: P[5], tipoRegistro: 'Concluyeron', categoria: 'Servicios', subcategoria: 'MUJERES', cantidad: 20, estado: 'completada', observaciones: '' },
      { id: 'ss7', programa: P[6], tipoRegistro: 'No iniciaron', categoria: 'Sector privado', subcategoria: 'HOMBRES', cantidad: 8, estado: 'pendiente', observaciones: '' },
      { id: 'ss8', programa: P[7], tipoRegistro: 'En proceso', categoria: 'Sector público', subcategoria: 'CON DISCAPACIDAD', cantidad: 3, estado: 'completada', observaciones: '' },
      { id: 'ss9', programa: P[8], tipoRegistro: 'Por sector', categoria: 'Tecnología', subcategoria: 'MUJERES', cantidad: 14, estado: 'completada', observaciones: '' },
      { id: 'ss10', programa: P[9], tipoRegistro: 'Concluyeron', categoria: 'Turismo', subcategoria: 'HABLANTES DE LENGUAS INDÍGENAS', cantidad: 5, estado: 'completada', observaciones: '' }
    ],

    'sicei_residencia_prof_': [
      { id: 'rp1', programa: P[0], tipoRegistro: 'Con 85% créditos', categoria: 'Manufactura', subcategoria: 'HOMBRES', cantidad: 14, estado: 'completada', observaciones: '' },
      { id: 'rp2', programa: P[1], tipoRegistro: 'Oficio aceptación', categoria: 'Servicios', subcategoria: 'MUJERES', cantidad: 16, estado: 'completada', observaciones: '' },
      { id: 'rp3', programa: P[2], tipoRegistro: 'Alta sistema', categoria: 'TI', subcategoria: 'HOMBRES', cantidad: 12, estado: 'revisada', observaciones: '' },
      { id: 'rp4', programa: P[3], tipoRegistro: 'Por sector', categoria: 'Automotriz', subcategoria: 'MUJERES', cantidad: 10, estado: 'completada', observaciones: '' },
      { id: 'rp5', programa: P[4], tipoRegistro: 'Con 85% créditos', categoria: 'Construcción', subcategoria: 'HOMBRES', cantidad: 8, estado: 'completada', observaciones: '' },
      { id: 'rp6', programa: P[5], tipoRegistro: 'No iniciaron', categoria: 'Contabilidad', subcategoria: 'MUJERES', cantidad: 6, estado: 'pendiente', observaciones: '' },
      { id: 'rp7', programa: P[6], tipoRegistro: 'Oficio aceptación', categoria: 'Comercio', subcategoria: 'HOMBRES', cantidad: 11, estado: 'completada', observaciones: '' },
      { id: 'rp8', programa: P[7], tipoRegistro: 'Alta sistema', categoria: 'Química', subcategoria: 'MUJERES', cantidad: 9, estado: 'completada', observaciones: '' },
      { id: 'rp9', programa: P[8], tipoRegistro: 'Por sector', categoria: 'Metalurgia', subcategoria: 'HOMBRES', cantidad: 7, estado: 'completada', observaciones: '' },
      { id: 'rp10', programa: P[9], tipoRegistro: 'Con 85% créditos', categoria: 'Turismo', subcategoria: 'MUJERES', cantidad: 13, estado: 'completada', observaciones: '' }
    ],

    'sicei_cap_doc_difusion_': [
      { id: 'df1', nombreCurso: 'Comunicación institucional', institucion: 'TESJo', participante: 'Mtra. Claudia Rojas', sexo: 'Mujer', programa: P[2], estado: 'completada', observaciones: '' },
      { id: 'df2', nombreCurso: 'Redes sociales educativas', institucion: 'IPN', participante: 'Lic. Verónica Limón', sexo: 'Mujer', programa: P[5], estado: 'completada', observaciones: '' },
      { id: 'df3', nombreCurso: 'Diseño gráfico básico', institucion: 'UNAM', participante: 'Ing. Manuel Soto', sexo: 'Hombre', programa: P[4], estado: 'revisada', observaciones: '' },
      { id: 'df4', nombreCurso: 'Fotografía documental', institucion: 'TESJo', participante: 'Mtra. Norma Estrada', sexo: 'Mujer', programa: P[9], estado: 'completada', observaciones: '' },
      { id: 'df5', nombreCurso: 'Producción de video', institucion: 'Coursera', participante: 'Lic. Arturo Campos', sexo: 'Hombre', programa: P[1], estado: 'completada', observaciones: '' },
      { id: 'df6', nombreCurso: 'Protocolo y ceremonial', institucion: 'TESJo', participante: 'Lic. Ricardo Mejía', sexo: 'Hombre', programa: P[6], estado: 'completada', observaciones: '' },
      { id: 'df7', nombreCurso: 'Atención ciudadana', institucion: 'Gobierno del Estado', participante: 'C.P. Beatriz Solís', sexo: 'Mujer', programa: P[5], estado: 'completada', observaciones: '' },
      { id: 'df8', nombreCurso: 'Redacción institucional', institucion: 'TESJo', participante: 'Ing. Rosa Delia Pineda', sexo: 'Mujer', programa: P[0], estado: 'pendiente', observaciones: '' },
      { id: 'df9', nombreCurso: 'Organización de eventos', institucion: 'UAEM', participante: 'Lic. Óscar Fuentes', sexo: 'Hombre', programa: P[9], estado: 'completada', observaciones: '' },
      { id: 'df10', nombreCurso: 'Marca personal docente', institucion: 'Virtual', participante: 'Ing. Héctor Valdez', sexo: 'Hombre', programa: P[3], estado: 'completada', observaciones: '' }
    ],

    'sicei_cap_directivo_': [
      { id: 'dir1', nombreCurso: 'Liderazgo directivo', institucion: 'TESJo', participante: 'Lic. Ricardo Mejía', sexo: 'Hombre', programa: P[0], estado: 'completada', observaciones: '' },
      { id: 'dir2', nombreCurso: 'Gestión administrativa', institucion: 'IPN', participante: 'C.P. Beatriz Solís', sexo: 'Mujer', programa: P[5], estado: 'completada', observaciones: '' },
      { id: 'dir3', nombreCurso: 'Presupuesto público', institucion: 'SHCP', participante: 'Ing. Héctor Valdez', sexo: 'Hombre', programa: P[1], estado: 'revisada', observaciones: '' },
      { id: 'dir4', nombreCurso: 'Recursos humanos', institucion: 'UNAM', participante: 'Mtra. Norma Estrada', sexo: 'Mujer', programa: P[6], estado: 'completada', observaciones: '' },
      { id: 'dir5', nombreCurso: 'Marco jurídico educativo', institucion: 'TESJo', participante: 'Lic. Arturo Campos', sexo: 'Hombre', programa: P[2], estado: 'completada', observaciones: '' },
      { id: 'dir6', nombreCurso: 'Planeación estratégica', institucion: 'CONACYT', participante: 'Ing. Rosa Delia Pineda', sexo: 'Mujer', programa: P[3], estado: 'completada', observaciones: '' },
      { id: 'dir7', nombreCurso: 'Transparencia y acceso', institucion: 'INAI', participante: 'Lic. Óscar Fuentes', sexo: 'Hombre', programa: P[4], estado: 'completada', observaciones: '' },
      { id: 'dir8', nombreCurso: 'Evaluación institucional', institucion: 'TESJo', participante: 'Mtra. Claudia Rojas', sexo: 'Mujer', programa: P[7], estado: 'pendiente', observaciones: '' },
      { id: 'dir9', nombreCurso: 'Compras gubernamentales', institucion: 'Compranet', participante: 'Lic. Verónica Limón', sexo: 'Mujer', programa: P[8], estado: 'completada', observaciones: '' },
      { id: 'dir10', nombreCurso: 'Igualdad y no discriminación', institucion: 'TESJo', participante: 'Ing. Manuel Soto', sexo: 'Hombre', programa: P[9], estado: 'completada', observaciones: '' }
    ]
  };
})();
