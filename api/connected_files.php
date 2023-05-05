<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class DocumentConnApi{

function __construct(){

$this->database = new Database();


$result = $this->database->query("SELECT doc.id, doc.title, doc.path FROM didb_documents_additional_files conn JOIN didb_files doc ON conn.file_id = doc.id WHERE conn.document_id=". $_GET['id']);


$ids = array();
$titles = array();
$paths = array();





while($row = mysql_fetch_assoc($result)){
  array_push($ids, $row['id']);
  array_push($titles, $row['title']);
  array_push($paths, $row['path']);
}


$data = new APIData();

  $data->addArray('ids', $ids);
  $data->addArray('titles', $titles);
  $data->addArray('paths', $paths);




  echo $data->getOutput();


}
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(isset($_GET['id'])){

new DocumentConnApi();
}


?>
