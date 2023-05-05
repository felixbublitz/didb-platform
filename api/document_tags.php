<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class DocumentTagsApi{

function __construct(){

$this->database = new Database();


$tag_result = $this->database->query("SELECT tag.id, tag.title, tag.description FROM didb_documents_tags conn JOIN didb_tags tag ON conn.tag_id = tag.id WHERE conn.document_id=". $_GET['id']);
$level_result = $this->database->query("SELECT level.id, level.title, level.description FROM didb_documents_levels conn JOIN didb_levels level ON conn.level_id = level.id WHERE conn.document_id=". $_GET['id']);
$type_result = $this->database->query("SELECT type.id, type.title, type.description FROM didb_documents_types conn JOIN didb_types type ON conn.type_id = type.id WHERE conn.document_id=". $_GET['id']);


$tags = array();
$levels = array();
$types = array();




while($row = mysql_fetch_assoc($tag_result)){
  array_push($tags, $row['id']);
}

while($row = mysql_fetch_assoc($level_result)){
  array_push($levels, $row['id']);
}

while($row = mysql_fetch_assoc($type_result)){
  array_push($types, $row['id']);
}
$data = new APIData();

  $data->addArray('tags', $tags);

  $data->addArray('levels', $levels);
  $data->addArray('types', $types);

  echo $data->getOutput();


}
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(isset($_GET['id'])){

new DocumentTagsApi();
}


?>
