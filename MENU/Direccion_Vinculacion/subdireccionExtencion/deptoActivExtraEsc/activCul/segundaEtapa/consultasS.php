<?php
$conexion = new mysqli ("localhost", "root","", "ejemplo1");
 if ($conexion-> connect_error){
    die ("Error de conexion: " . $conexion->connect_error );

 }

 //consultas de la base de datos

 $sql ="SELECT * FROM centro_informacion_p ORDER BY fecha_registro DESC";
 $result = $conexion-> query($sql);

 $datos = [];
 if ($result->num_rows > 0){
    while ($row = $result-> fetch_assoc()){
        $datos [] =$row;


    }
 }
 $conexion->close ();
 ?>