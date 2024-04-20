<?php
if (empty($_POST['phone']) || empty($_POST['message'])) {
  die('Access denied');
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
// use sender.php;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
// require 'sender.php';

session_start();
$userId = $_SESSION['user_id'];
$userFolder = "user_files/$userId";

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->IsHTML(true);

// $mail->SMTPDebug = SMTP::DEBUG_SERVER;    
$mail->isSMTP();                                            //Send using SMTP
$mail->Host       = 'smtp.test.com';                     //Set the SMTP server to send through
$mail->SMTPAuth   = true;                                   //Enable SMTP authentication
$mail->Username   = 'example@mail.com';                     //SMTP username
$mail->Password   = '12345678';                               //SMTP password
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
$mail->Port       = 465;

//От кого письмо
$mail->setFrom('client_example@mail.com', 'Client');
//Кому отправить
$mail->addAddress('notary@mail.com');

//Тема письма
$mail->Subject = 'Письмо с сайта';
//Тело письма
$body = '<h2>Обращение</h2>';

// Check if 'name' field is not empty
if (!empty($_POST['name'])) {
  $name = htmlspecialchars($_POST['name']);
  $body .= '<p><strong>Имя:</strong> ' . $name . '</p>';
}
// Check if 'email' field is not empty and is a valid email format
if (!empty($_POST['email']) && filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
  $email = htmlspecialchars($_POST['email']);
  $body .= '<p><strong>E-mail:</strong> ' . $email . '</p>';
}

// Check if 'phone' field is not empty
if (!empty($_POST['phone'])) {
  $phone = htmlspecialchars($_POST['phone']);
  $body .= '<p><strong>Телефон:</strong> ' . $phone . '</p>';
}
// Check if 'message' field is not empty
if (!empty($_POST['message'])) {
  $message = htmlspecialchars($_POST['message']);
  $body .= '<p><strong>Сообщение:</strong> ' . $message . '</p>';
}


function attachFiles($mail, $userFolder)
{

  if (!is_dir($userFolder)) {
    mkdir($userFolder);
  }

  $folder = opendir($userFolder);

  while ($file = readdir($folder)) {

    if (!is_file($userFolder . '/' . $file)) continue;

    $mail->addAttachment($userFolder . '/' . $file);
  }
}
function deleteAttachedFiles($mail, $userFolder)
{

  $folder = opendir($userFolder);

  while ($file = readdir($folder)) {

    $path = $userFolder . '/' . $file;

    if (is_file($path)) {
      unlink($path);
    }
  }
}
attachFiles($mail, $userFolder);

$mail->Body = $body;
// Send the email
if (!$mail->send()) {
  $message = 'Ошибка';
} else {
  $message = 'Данные отправлены!';
  deleteAttachedFiles($mail, $userFolder);
}

$response = ['message' => $message];

echo json_encode($response);
