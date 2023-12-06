<?php
  function conectar() {
    $host = "auth-db531.hstgr.io";
    $user = "u351541285_x_clone";
    $pass = "1P0w3r#01";
    $db = "u351541285_x_clone";
    $conn = mysqli_connect($host,$user,$pass);
    mysqli_select_db($conn, $db);
    return $conn;
  }
?>
