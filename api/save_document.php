<?php
require_once('../data/Database.php');
require_once('APIData.php');

CONST DOCUMENT_DIR = "../user/documents/" ;
CONST DOCUMENT_DIR_SHORT = "user/documents/" ;



if (!isset($_POST['request']))
  die("no request");

$request = json_decode($_POST['request'], true);

var_dump($request);


$sd = new SaveDocument();

switch ($request['action']) {
  case 'remove':
    $sd->removeDocument($request);
    break;
  case 'add':
    $sd->addDocument($request);
    break;
  case 'update':
    $sd->updateDocument($request);
   break;
  default:
    die("no valid action");
    break;
}


Class SaveDocument{

private $database;


function __construct(){
   $this->database = new Database();
}


function removeDocument($request){
  if(!$request['id'])
    die('no docID set');

  $this->database->delete('didb_documents','id=' . $request['id']);
  $this->deleteUnusedTags();
}
function addDocument($request){
  $request['title'] = addslashes($request['title']);
  $request['description'] = addslashes($request['description']);

  $pages = count($request['thumb']);

  $request['id'] =  $this->database->insert('didb_documents',array('title', 'uid', 'path', 'description', 'pages', 'license'), array($request['title'], $request['uid'], '' , $request['description'], $pages, $request['license']));

  $newpath = DOCUMENT_DIR_SHORT . $request['id'] . '/';
  $this->database->update('didb_documents', array("title='". $request['title'] ."'", "path='". $newpath ."'", "description='". $request['description'] ."'"), "id=" . $request['id']);

  $this->moveFiles($request, '../' . $newpath);
  $this->updateTags($request);
  $this->updateAddDocs($request);
}
function updateDocument($request){
  $request['title'] = addslashes($request['title']);
  $request['description'] = addslashes($request['description']);

  $path = DOCUMENT_DIR_SHORT . $request['id'] . '/';

  if(isset($request['pdf'])){

    $this->moveFiles($request, '../' . $newpath);
    $pages = count($request['thumb']);
    $this->database->update('didb_documents', array("pages=" . $pages, "title='". $request['title'] ."'", "uid='". $request['uid'] ."'", "path='". $path ."'", "description='". $request['description'] ."'", "license='" . $request['license'] . "'"), "id=" . $request['id']);
  }else{
    var_dump("update 123");
    $this->database->update('didb_documents', array("title='". $request['title'] ."'", "uid='". $request['uid'] ."'", "path='". $path ."'", "description='". $request['description'] ."'", "license='" . $request['license'] . "'"), "id=" . $request['id']);
  }

  $this->updateTags($request);
  $this->updateAddDocs($request);
}


function updateTags($request){
  $tags = json_decode($request['tags']);
  $levels = json_decode($request['levels']);
  $types = json_decode($request['types']);

  $this->database->delete('didb_documents_tags','document_id=' . $request['id']);
  $this->database->delete('didb_documents_levels','document_id=' . $request['id']);
  $this->database->delete('didb_documents_types','document_id=' . $request['id']);

  for($i=0; $i<count($tags); $i++){
    $this->database->update('didb_tags', array('category='. $tags[$i]->colorID), "id=".$tags[$i]->dbid);
    if($tags[$i]->enabled){
      $this->database->insert('didb_documents_tags',array('document_id', 'tag_id'),array($request['id'], $tags[$i]->dbid));
    }
  }

  for($i=0; $i<count($levels); $i++){
    if($levels[$i]->enabled){
      $this->database->insert('didb_documents_levels',array('document_id', 'level_id'),array($request['id'], $levels[$i]->dbid));
    }
  }

  for($i=0; $i<count($types); $i++){
    if($types[$i]->enabled){
      $this->database->insert('didb_documents_types',array('document_id', 'type_id'),array($request['id'], $types[$i]->dbid));
    }
  }

  $this->deleteUnusedTags($this->database);
}


function updateAddDocs($request){
  $request['add-docs'] = json_decode($request['add-docs'], true);
  $this->database->delete('didb_documents_connections', 'document_id=' . $request['id']);
  for($i=0; $i<count($request['add-docs']);$i++){

    if($request['add-docs'][$i]['enabled']){
      $this->database->insert('didb_documents_connections',array('document_id', 'connected_document_id'),array($request['id'], $request['add-docs'][$i]['id']));
    }
  }
}

function moveFiles($request, $newpath){

  if(file_exists($newpath))
    return false;

  mkdir($newpath, 0777);
  copy('../' .  $request['path'] . $request['pdf'], $newpath . 'original.pdf');

  for($i=0; $i<count($request['thumb']); $i++){
    copy('../' . $request['path'] . $request['thumb'][$i], $newpath . 'thumb-' . $i . '.jpg');
  }

  return true;
}

function deleteUnusedTags(){
  $result = $this->database->query('select tag.id, tag.title from didb_tags tag where tag.id NOT IN (select distinct tag.id FROM didb_tags tag JOIN didb_documents_tags con ON con.tag_id = tag.id)');

  while($row = mysql_fetch_assoc($result)){
    $this->database->delete('didb_tags','id=' . $row['id']);
  }

}

}
?>
