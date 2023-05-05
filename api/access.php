<?php

require_once('APIData.php');
require_once('../config/credentials.php');


Class Access{
private $data;

function __construct(){
  if(!isset($_SESSION ))
  session_start();
}



function permitted(){
  if(isset($_SESSION['admin']) && $_SESSION['admin'] == true){
    return true;
  }else{
    return false;
  }
}


function logout(){
  $_SESSION['admin'] = false;
}

function login($password){
  if($password && md5($password) == Credentials::$CMS_PASSWORD){
    $_SESSION['admin'] = true;
    return true;
  }else{
    return false;
  }
}




}



if(isset($_GET['method']) && $_GET['method'] == 'allowed'){
  $access = new Access();
  $data = new APIData();
  $res = ($access->permitted()) ? 'true' : 'false';

  $data->add('admin', $res);

  echo $data->getOutput();
}




?>
