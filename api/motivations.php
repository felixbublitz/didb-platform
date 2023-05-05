<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class MotivationApi{

function __construct(){

$this->database = new Database();


$result = $this->database->select(array('id', 'author', 'position', 'thumb', 'description'),'didb_motivations');


$data = new APIData();

$ids = array();
$authors = array();
$positions = array();
$thumbs = array();
$descriptions = array();

for($i=0; $i<count($result); $i++){
  array_push($ids, $result[$i]['id']);
  array_push($authors, $result[$i]['author']);
  array_push($positions, $result[$i]['position']);
  array_push($thumbs, $result[$i]['thumb']);
  array_push($descriptions, $result[$i]['description']);
}
  $data->addArray('ids', $ids);
  $data->addArray('authors', $authors);
  $data->addArray('positions', $positions);
  $data->addArray('thumbs', $thumbs);
  $data->addArray('descriptions', $descriptions);



echo $data->getOutput();
}

}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new MotivationApi();


?>
