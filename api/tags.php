<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class TagsApi{

function __construct(){

$this->database = new Database();

$result = $this->database->query("SELECT t.id, t.title, t.description, c.color, c.id as cid from didb_tags t, didb_tags_categories c WHERE c.id = t.category ORDER BY t.id ");


$data = new APIData();

$ids = array();
$titles = array();
$descriptions = array();
$colors = array();
$cid = array();




while($row = mysql_fetch_assoc($result)){

  array_push($ids, $row['id']);
  array_push($titles, $row['title']);
  array_push($descriptions, $row['description']);
  array_push($colors, $row['color']);
  array_push($cid, $row['cid']);


}


  $data->addArray('ids', $ids);
  $data->addArray('titles', $titles);
  $data->addArray('descriptions', $descriptions);
  $data->addArray('colors', $colors);
  $data->addArray('cid', $cid);





echo $data->getOutput();
}

}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new TagsApi();


?>
