<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class LevelsApi{

function __construct(){

$this->database = new Database();


$result = $this->database->select(array('id', 'title', 'description'),'didb_levels');


$data = new APIData();

$ids = array();
$titles = array();
$descriptions = array();

for($i=0; $i<count($result); $i++){
  array_push($ids, $result[$i]['id']);
  array_push($titles, $result[$i]['title']);
  array_push($descriptions, $result[$i]['description']);
}
  $data->addArray('ids', $ids);
  $data->addArray('titles', $titles);
  $data->addArray('descriptions', $descriptions);



echo $data->getOutput();
}

}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new LevelsApi();


?>
