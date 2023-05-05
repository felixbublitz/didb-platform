<?php
require_once('APIData.php');

$data = new APIData();

$target_dir = "../user/files/temp/";
$target_dir_o = "user/files/temp/";


if(isset($_POST['save'])){
  $out = '../user/files/' . $_POST['save'];

  if(isset($_POST['path'])){
    if (!file_exists('../'.$_POST['path'])) {
      mkdir('../' . $_POST['path'], 0777, true);
    }
    $out =  $_POST['path'] . $_POST['save'];
  }

  rename('../user/files/temp/' . $_POST['save'] ,  '../' . $out);

  $data->add('path', $out );
  echo $data->getOutput();
  die();
}




if(!isset($_FILES['file'])){
      $data->error("no file given");
      echo $data->getOutput();
      die();
}

$file = $_FILES['file'];


$rand = rand(0, 9999);
const MAX_SIZE = 500000;

$target_file_name = $rand . basename($file["name"]);
$target_file = $target_dir . $target_file_name;
$fileType = pathinfo($target_file,PATHINFO_EXTENSION);


if (file_exists($target_file)) {
      $data->error("file already exists");
      echo $data->getOutput();
      die();
}

if ($file["size"] > MAX_SIZE) {
      $data->error("file is too large.");
      echo $data->getOutput();
      die();
}

if($fileType != "jpg" && $fileType != "png" && $fileType != "jpeg"
&& $fileType != "gif" && $fileType != "pdf" && $fileType != "mp3" && $fileType != "wav" ) {
    $data->error("file type not allowed.");
    echo $data->getOutput();
    die();
}


if (move_uploaded_file($file["tmp_name"], $target_file)) {
    $data->add('path', $target_dir_o );
    $data->add('filename', $target_file_name);
    $data->add('basename', basename($file["name"]));


} else {
      $data->error("error while uploading");
      echo $data->getOutput();
      die();
}



echo $data->getOutput();
?>
