<?php

require_once('Database.php');

class Data{
  private $content = array();
  protected $database;

  function __construct() {
    $this->database = new Database();
    $this->loadData();
  }

  function loadData(){

  }

  function add($key, $value){
    $this->content[$key] = $value;
  }

  function request(){
    return $this->content;
  }

}


?>
