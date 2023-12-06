<?php

include("../config/conexion.php");
$conn = conectar();
$dataPost = file_get_contents('php://input');
$body = json_decode($dataPost, true);

$idPost = $body['idPost'];

$querySelect = "SELECT responses.*, usuarios.email AS usuario_email 
  FROM responses 
  INNER JOIN usuarios ON responses.idUsuario = usuarios.id 
  WHERE responses.idPost = '$idPost'";
$posts = mysqli_query($conn, $querySelect);
$postsArray = [];

if ($posts->num_rows > 0) {
  while ($post = mysqli_fetch_array($posts)) {
    $postsArray[] = $post;
  }
  echo json_encode(['STATUS' => 'SUCCESS', 'MESSAGE' => $postsArray]);
} else {
  echo json_encode(['STATUS' => 'NONE', 'MESSAGE' => 'No hay posts para mostrar']);
}

?>