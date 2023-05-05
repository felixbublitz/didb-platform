<?php

include("Data.php");

class DocumentData extends Data{

  function loadData(){
    if(!isset($_GET['doc'])){
      $this->add("title",'');
      $this->add("description",'');
      $this->add("uid",'');
      $this->add("preview",'');
      $this->add("license",1);
      $this->add("imgopacity",'0.4');
      $this->add("autogen",'wird generiert');
      $this->add("id",'-1');
      return;
    }

    $result = $this->database->select(array('title', 'path', 'description', 'id', 'uid', 'license'),'didb_documents','id=' . $_GET['doc']);

    $this->add("title",$result[0]['title']);
    $this->add("description",$result[0]['description']);
    $this->add("preview",$result[0]['path'] . '/' . 'thumb-0.jpg');
    $this->add("id",$result[0]['id']);
    $this->add("uid",$result[0]['uid']);
    $this->add("license",$result[0]['license']);
    $this->add("imgopacity",'1');
    $this->add("autogen",'nicht veränderbar');
  }

}

$data = new DocumentData();


?>
