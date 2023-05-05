<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database;

Class SearchApi{

function __construct(){

$this->database = new Database();

$tags = [];
$levels = [];

if(isset($_GET['levels'])){
$get_levels = $_GET['levels'];
$levels = explode(',', $get_levels);
}

if(isset($_GET['tags'])){
$get_tags = $_GET['tags'];
$tags = explode(',', $get_tags);
}


$level_sql = "";
$tag_sql = "";

if($levels){
foreach ($levels as $level) {
  $level_sql .= "lvln.title = '" .$level . "' OR ";
}

$level_sql = substr($level_sql, 0, -4);
}else{
  $level_sql = "0";
}

if($tags){

foreach ($tags as $tag) {
  $tag_sql .= "tagn.title = '" . $tag . "' OR ";
}

$tag_sql = substr($tag_sql, 0, -4);
}else{
  $tag_sql = "0";
}


$result = $this->database->query("SELECT document_id, doc.title, doc.description, doc.path, sum(rating) as rating FROM (SELECT * FROM (SELECT lvl.document_id, count(lvl.level_id) as rating FROM didb_documents_levels lvl JOIN didb_levels lvln ON lvln.id = lvl.level_id WHERE " . $level_sql . " GROUP BY document_id) lvl_rating UNION ALL SELECT * FROM (SELECT tag.document_id, count(tag.tag_id) as rating FROM didb_documents_tags tag JOIN didb_tags tagn ON tagn.id = tag.tag_id WHERE ". $tag_sql ." GROUP BY tag.document_id) tag_rating) attachedtable JOIN didb_documents doc ON doc.id = attachedtable.document_id GROUP BY document_id ORDER BY rating DESC");

$id = array();
$title = array();
$description = array();
$thumb = array();
$rating = array();


while($row = mysql_fetch_assoc($result)){
  array_push($id, $row['document_id']);
  array_push($title, $row['title']);
  array_push($description, $row['description']);
  array_push($thumb, $row['path'] . '/' . "thumb-0.jpg");
  array_push($rating, $row['rating']);
}
$data = new APIData();

  $data->addArray('ids', $id);
  $data->addArray('titles', $title);
  $data->addArray('descriptions', $description);
  $data->addArray('thumbs', $thumb);
  $data->addArray('ratings', $rating);

  echo $data->getOutput();


}
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

new SearchApi();


?>
