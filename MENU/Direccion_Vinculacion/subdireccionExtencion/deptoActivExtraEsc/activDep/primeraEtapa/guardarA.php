<?php
// Configuración conexión
$projectRoot = __DIR__;
while ($projectRoot !== dirname($projectRoot) && !is_file($projectRoot . '/API/config.php')) {
    $projectRoot = dirname($projectRoot);
}
require_once $projectRoot . '/API/config.php';

// Arrays con datos (programas y talleres)
$programas = [
  "INGENIERÍA ELECTROMECÁNICA IEME-2010-210",
  "INGENIERÍA INDUSTRIAL IIND-2010-227",
  "INGENIERÍA INDUSTRIAL IIND-2010-227. EXTENSIÓN ACULCO",
  "INGENIERÍA EN SISTEMAS COMPUTACIONALES ISIC-2010-224",
  "INGENIERÍA EN SISTEMAS COMPUTACIALES ISIC-2010-224. EXTENSIÓN ACULCO",
  "INGENIERÍA MECATRÓNICA IMCT-2010-229",
  "ARQUITECTURA ARQU-2010-204",
  "CONTADOR PÚBLICO COPU-2010-205",
  "CONTADOR PÚBLICO COPU-2010-205. EXTENSIÓN ACULCO",
  "INGENIERÍA EN GESTIÓN EMPRESARIAL IGEM-2009-201",
  "INGENIERÍA QUÍMICA IQUI-2010-232",
  "INGENIERÍA EN MATERIALES IMAT-2010-222",
  "INGENIERÍA EN ANIMACIÓN DIGITAL Y EFECTOS VISUALES IAEV-2012-238",
  "LICENCIATURA EN TURISMO LTUR-2012-237",
  "LICENCIATURA EN TURISMO LTUR-2012-237. EXTENSIÓN ACULCO",
  "INGENIERÍA EN LOGÍSTICA ILOG-2009-202"
];

$talleresBase = [
  "DEPORTES", "BOX", "GIMNASIO", "TEAKWONDO", "TIRO CON ARCO", "ATLETISMO",
  "FUTBOL", "VOLEIBOL", "BASQUETBALL", "FUTBOL BARDAS", "TENIS DE MESA", "OTROS",
  "INSCRITOS TOTAL"
];

// Crear conexión
$conexion = getDBConnection();

if ($conexion->connect_error) {
  die("Error de conexión: " . $conexion->connect_error);
}

// Insertar programas
foreach ($programas as $prog) {
  $prog_esc = $conexion->real_escape_string($prog);
  $sql = "INSERT INTO programas (nombre) VALUES ('$prog_esc')";
  if (!$conexion->query($sql)) {
    echo "Error al insertar programa: " . $conexion->error . "<br>";
  }
}

// Insertar talleres
foreach ($talleresBase as $tall) {
  $tall_esc = $conexion->real_escape_string($tall);
  $sql = "INSERT INTO talleres (nombre) VALUES ('$tall_esc')";
  if (!$conexion->query($sql)) {
    echo "Error al insertar taller: " . $conexion->error . "<br>";
  }
}

echo "Inserciones completadas.";

$conexion->close();
?>
