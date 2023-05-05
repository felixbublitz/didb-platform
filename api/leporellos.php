<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class LeporelloApi{

function __construct(){

$this->database = new Database();


$result = $this->database->query('SELECT distinct  doc.id, doc.title, doc.path, doc.description FROM didb_documents doc JOIN didb_documents_types connType on connType.document_id = doc.id JOIN didb_types type on type.id = connType.type_id WHERE type.title = "Leporello" ');


$data = new APIData();

$ids = array();
$titles = array();
$paths = array();
$thumb_1 = array();
$thumb_2 = array();
$thumb_3 = array();
$pdf = array();

$descriptions = array();

while($row = mysql_fetch_assoc($result)){
  array_push($ids, $row['id']);
  array_push($titles, $row['title']);
  array_push($paths, $row['path']);
  array_push($thumb_1, $row['path'] . '/' . "thumb-0.jpg");
  array_push($thumb_2, $row['path'] . '/' . "thumb-1.jpg");
  array_push($thumb_3, $row['path'] . '/' . "thumb-2.jpg");
  array_push($pdf, $row['path'] . '/' . "original.pdf");

  array_push($descriptions, $row['description']);
}
  $data->addArray('ids', $ids);
  $data->addArray('titles', $titles);
  $data->addArray('paths', $paths);
  $data->addArray('pdf', $pdf);
  $data->addArray('thumb_1', $thumb_1);
  $data->addArray('thumb_2', $thumb_2);
  $data->addArray('thumb_3', $thumb_3);

  $data->addArray('descriptions', $descriptions);



echo $data->getOutput();
}

}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new LeporelloApi();


?>
