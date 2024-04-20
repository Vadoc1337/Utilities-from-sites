<?php
session_start();

$userId = $_SESSION['user_id']; // идентификатор пользователя из сессии

if (!isset($_SESSION['user_id'])) {
  $_SESSION['user_id'] = uniqid(); // генерируем уникальный идентификатор
}

$userId = $_SESSION['user_id'];

if (!empty($_FILES['file'])) {

  // создаем папку для пользователя, если еще не создана
  $userDir = "user_files/$userId";
  if (!file_exists($userDir)) {
    mkdir($userDir);
  }

  $filePath = $userDir . "/" . $_FILES['file']['name'];

  if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
    chmod($filePath, 0755);
    echo 'File Uploaded';

    $expires = time() + 60 * 60;
    touch($filePath, $expires);
  }
}

$folders = scandir("files");

foreach ($folders as $userId) {

  if ($userId == "." || $userId == "..") continue;

  $userDir = "user_files/$userId";
  $userFolder = opendir($userDir);

  while ($file = readdir($userFolder)) {
    $path = $userDir . '/' . $file;
    if (is_file($path)) {
      if (filemtime($path) < time()) {
        unlink($path);
      }
    }
  }

  closedir($userFolder);
}
