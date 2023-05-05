<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class DBController{

  function __construct(){

  $this->database = new Database();

  $from = $_POST['from'];
  $where = $_POST['where'];
  $method = $_POST['method'];
  $orderby = $_POST['orderby'];
  $attr = json_decode($_POST['attr']);
  $val = json_decode($_POST['val']);

  $attr_str = implode (", " , $attr);
  $val_str = implode ("', '" , $val);


  if($method == 'select'){

    $result = $this->database->query("SELECT " . $attr_str . " FROM " . $from . " WHERE " . $where ." " . $orderby);
    $out = array();

    while($row = mysql_fetch_assoc($result)){

      for($i=0; $i<sizeof($attr); $i++){
        if(!isset($out[$attr[$i]])){
          $out[$attr[$i]] = array();
        }
        array_push($out[$attr[$i]], $row[$attr[$i]]);

      }
    }

    $data = new APIData();
    for($i=0; $i<sizeof($attr); $i++){
      $data->addArray($attr[$i], $out[$attr[$i]]);
    }

    echo $data->getOutput();
    return;

    }


  if($method == 'delete'){
    $result = $this->database->query("DELETE FROM " . $from . " WHERE " . $where);

    $data = new APIData();
    if($result == true){
      $data->add('success', 'true');
    }else{
      $data->error('error while deleting');
    }


    echo $data->getOutput();
    return;

  }

  if($method == 'update'){
    $upd = '';

    for($i=0;$i<sizeof($attr);$i++){
      $upd .= $attr[$i] . ' = ' . "'" . $val[$i] . "',";
    }
    $upd = substr($upd, 0, -1);

    //$upd = addslashes($upd);
    $result = $this->database->query("UPDATE " . $from . " SET " . $upd . " WHERE " . $where);

    var_dump("UPDATE " . $from . " SET " . $upd . " WHERE " . $where);

    $data = new APIData();
    if($result == true){
      $data->add('success', 'true');
    }else{
      $data->error('error while updating');
    }


    echo $data->getOutput();
    return;

  }

  if($method == 'insert'){
    $result = $this->database->queryAndGetRow("INSERT INTO " . $from . "(" . $attr_str . ") VALUES ('" . $val_str . "')");

    $data = new APIData();
    if($result == true){
      $data->add('success', 'true');
      $data->add('id', $result);
    }else{
      $data->error('error while inserting');
    }


    echo $data->getOutput();
    return;

  }


  $data = new APIData();
  $data->error("invalid method");
  echo $data->getOutput();


  }
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new DBController();


?>
