<?php

session_start();

$userId = $_SESSION['user_id'];

$userFolder = __DIR__ . "/user_files/$userId";

if (isset($_POST['delete'])) {

  $blobName = $_POST['file'];

  $filePath = "$userFolder/$blobName";

  if (unlink($filePath)) {
    echo "File deleted";
  } else {
    echo "Error deleting file";
  }
}
