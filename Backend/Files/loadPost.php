<?php

  include("../config/conexion.php");
  $conn = conectar();
  $querySelect = "SELECT * FROM posts";
  $posts = mysqli_query($conn, $querySelect);
  $postsArray = [];
  
  if ($posts -> num_rows > 0) {
    while ($post = mysqli_fetch_array($posts)) {
      $postsArray[] = $post;
    }
    echo json_encode(['STATUS' => 'SUCCESS', 'MESSAGE' => $postsArray]);
  } else {
    echo json_encode(['STATUS' => 'SUCCESS', 'MESSAGE' => 'No hay posts para mostrar']);
  }

?>
