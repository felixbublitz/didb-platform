<?php

require_once('../data/Database.php');
require_once('APIData.php');

$database = new Database();

$result = $database->select(array('id'), 'didb_tags', 'title="'. $_POST['title'] .'"');

if(!$result){
  $id = $database->insert('didb_tags',array('title', 'description'),array($_POST['title'], $_POST['description']));
}

echo $id;

?>
