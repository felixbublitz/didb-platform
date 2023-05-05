<?php
require_once('APIData.php');

$data = new APIData();


if(!isset($_FILES["pdf"])){
      $data->error("no file set");
      echo $data->getOutput();
      die();
}

$target_dir = "../user/documents/temp/";
$target_dir_o = "user/documents/temp/";

$files = glob($target_dir . '*');
foreach($files as $file){
  if(is_file($file))
    unlink($file);
}


$target_file_name= "original.pdf";
$target_file = $target_dir .$target_file_name;
$uploadOk = 1;
$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);

// Check if file already exists
if (file_exists($target_file)) {
      $data->error("Sorry, file already exists.");
    $uploadOk = 0;
}
// Check file size
if ($_FILES["pdf"]["size"] > 10000000) {
      $data->error("Sorry, your file is too large.");
    $uploadOk = 0;
}
// Allow certain file formats
if($imageFileType != "pdf") {
    $data->error("Sorry, only pdf is allowed.");
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {

// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["pdf"]["tmp_name"], $target_file)) {
        createThumbs('/new/'.$target_dir_o);
        $data->add('path', $target_dir_o );
        $data->add('filename', $target_file_name);

        $i = 0;
        $thumb = array();
        while(file_exists($target_dir . 'thumb-' . $i . '.jpg') && $i<=10){
          array_push($thumb, 'thumb-'. $i .'.jpg');
          $i++;
        }

        if(file_exists($target_dir . 'thumb.jpg')){
          array_push($thumb, 'thumb.jpg');
        }

        $data->addArray('thumb', $thumb );

    } else {
          $data->error("Sorry, there was an error uploading your file.");
    }
}


echo $data->getOutput();


function createThumbs($pdf_path){
    $myurl = $_SERVER['DOCUMENT_ROOT'] . $pdf_path . "original.pdf";

    $im = new Imagick();


$im->setResolution(200,200);
$im->readimage($myurl);
$im->setImageFormat('jpeg');
$im->scaleImage(512,0);

if(!$im->writeImages($_SERVER['DOCUMENT_ROOT'] . $pdf_path . 'thumb'.'.jpg',false)){
      die("error write image");
    }
$im->clear();
$im->destroy();




}
?>
