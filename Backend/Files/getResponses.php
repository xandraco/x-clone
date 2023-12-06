<?php

  include("../config/conexion.php");
  $conn = conectar();
  $dataPost = file_get_contents('php://input');
  $body = json_decode($dataPost, true);
  $idPost = $body['idpost'];

  $querySelect = "SELECT * FROM posts WHERE idPost = '$idPost'";
  $posts = mysqli_query($conn, $querySelect);
  $postsArray = [];
  
  if ($posts->num_rows > 0) {
    while ($post = mysqli_fetch_array($posts)) {
      $postsArray[] = $post;
    }
    echo json_encode(['STATUS' => 'SUCCESS', 'MESSAGE' => $postsArray]);
  } else {
    echo json_encode(['STATUS' => 'ERROR', 'MESSAGE' => $posts]);
  }

?>
