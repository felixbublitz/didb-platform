<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class LeporelloApi{


function toJSON($text){
  $text = nl2br($text);
  $text = str_replace(array("\n", "\r"), '', $text);
  return $text;
}

function __construct(){

$this->database = new Database();


$result = $this->database->query('SELECT distinct doc.id, doc.title, doc.path, doc.description, type.title as type FROM didb_documents doc LEFT JOIN didb_documents_types conn ON conn.document_id = doc.id LEFT JOIN didb_types type ON conn.type_id = type.id');


$data = new APIData();

$ids = array();
$titles = array();
$paths = array();
$thumb = array();
$pdf = array();
$descriptions = array();
$types = array();


while($row = mysql_fetch_assoc($result)){
  array_push($ids, $this->toJSON($row['id']));
  array_push($titles, $this->toJSON($row['title']));
  array_push($descriptions, $this->toJSON($row['description']));
  array_push($types, $this->toJSON($row['type']));
  array_push($paths, $this->toJSON($row['path']));

  if($this->toJSON($row['type']) == 'Leporello'){
    array_push($thumb, $this->toJSON($row['path'] .  "thumb-2.jpg"));
  }else{
    array_push($thumb, $this->toJSON($row['path'] .  "thumb-0.jpg"));
  }
  
  array_push($pdf, $this->toJSON($row['path'] .  "original.pdf"));
}


  $data->addArray('ids', $ids);
  $data->addArray('titles', $titles);
  $data->addArray('descriptions', $descriptions);
  $data->addArray('types', $types);
  $data->addArray('paths', $paths);
  $data->addArray('pdf', $pdf);
  $data->addArray('thumb', $thumb);





echo $data->getOutput();
}

}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new LeporelloApi();


?>
