<?php
require_once('APIData.php');

$data = new APIData();


if(!isset($_FILES["img"])){
      $data->error("File is not an image.");
      echo $data->getOutput();
      die();
}

$target_dir = "../img/temp/";
$target_dir_o = "img/temp/";
$rand = rand(0, 9999);
$target_file_name= $rand . basename($_FILES["img"]["name"]);
$target_file = $target_dir .$target_file_name;
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($_FILES["img"]["tmp_name"]);
    if($check !== false) {
        $data->error("File is an image - " . $check["mime"] . ".");
        $uploadOk = 1;
    } else {
          $data->error("File is not an image.");
        $uploadOk = 0;
    }
}
// Check if file already exists
if (file_exists($target_file)) {
      $data->error("Sorry, file already exists.");
    $uploadOk = 0;
}
// Check file size
if ($_FILES["img"]["size"] > 500000) {
      $data->error("Sorry, your file is too large.");
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
&& $imageFileType != "gif" ) {
    $data->error("Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
      $data->error("Sorry, your file was not uploaded.");
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["img"]["tmp_name"], $target_file)) {
        $data->add('path', $target_dir_o );
        $data->add('filename', $target_file_name);

    } else {
          $data->error("Sorry, there was an error uploading your file.");
    }
}


echo $data->getOutput();
?>
