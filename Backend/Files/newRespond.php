<?php
include("../config/conexion.php");
$conn = conectar();
$dataPost = file_get_contents('php://input');
$body = json_decode($dataPost, true);

$idPost = $body['idPost'];
$idUsuario = $body['idUsuario'];
$mensaje = $body['message'];
$fecha = date("Y-m-d");

$querySelect = "SELECT id FROM `usuarios` WHERE email = '$idUsuario'";
$idUserResult = mysqli_query($conn, $querySelect);

if ($idUserResult) {
    $idUserArray = mysqli_fetch_assoc($idUserResult);
    $idFinal = $idUserArray['id'];
    
    $queryInsert = "INSERT INTO responses VALUES (null, '$idPost', '$idFinal', '$mensaje')";
    $result = mysqli_query($conn, $queryInsert);

    if ($result) {
        echo json_encode(['STATUS' => 'SUCCESS', 'MESSAGE' => 'Se ha registrado el response']);
    } else {
        echo json_encode(['STATUS' => 'ERROR', 'MESSAGE' => $queryInsert]);
    }
} else {
    echo json_encode(['STATUS' => 'ERROR', 'MESSAGE' => 'No se encontró el usuario']);
}
?>
