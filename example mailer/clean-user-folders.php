<?php
// Данный скрипт предназначен для крон задач на сервере
// Папка с файлами 
$dir = __DIR__ . "/user_files/";

$handle = opendir($dir);

// Перебираем все элементы в директории
while (($file = readdir($handle)) !== false) {
  // Проверяем, является ли элемент текущей директорией или родительской
  if ($file != "." && $file != "..") {
    // Составляем полный путь
    $path = $dir . $file;
    // Если это папка - удаляем рекурсивно
    if (is_dir($path)) {
      removeDirectory($path);
    }
  }
}

// Закрываем директорию  
closedir($handle);

// Функция для рекурсивного удаления папки
function removeDirectory($path)
{
  // Отрываем папку
  $handle = opendir($path);
  // Перебираем все вложенные элементы
  while (($file = readdir($handle)) !== false) {
    // Составляем полный путь
    $filePath = $path . "/" . $file;
    // Удаляем вложенные элементы
    if ($file != "." && $file != "..") {
      if (is_dir($filePath)) {
        // Рекурсивно вызываем функцию, если это папка
        removeDirectory($filePath);
      } else {
        // Удаляем файл
        unlink($filePath);
      }
    }
  }
  // Удаляем саму папку
  closedir($handle);
  rmdir($path);
}
