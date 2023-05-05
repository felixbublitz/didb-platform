<?php

require_once('../data/Database.php');
require_once('APIData.php');


$api = new DocumentVotesApi();

Class DocumentVotesApi{

private $database;

  function __construct(){
  $this->database = new Database();


  $points = intval($_GET['rating']);
  $ip = $_SERVER['REMOTE_ADDR'];
  $data = new APIData();


  $this->database->allowWriting();
  $this->database->delete('didb_blocked_ips', '(UNIX_TIMESTAMP()-unix_timestamp(created)) >86400');

  $result = $this->database->select(array('id', 'ip'), 'didb_blocked_ips', 'document_id=' .$_GET['id'].' AND ip="'. $ip. '"');


    if($result == ''){
      $id = intval($_GET['id']);
      if(!is_numeric($id)){
        $id = null;
      }

      $this->database->insert('didb_blocked_ips', array('ip', 'document_id'), array($ip, $id));
      if($this->database->select(array('document_id'), 'didb_documents_votes', 'document_id=' .$id) == ''){
        $this->database->insert('didb_documents_votes', array('document_id', 'votes', 'points'), array($id, 1, $points));
      }else{
        $this->database->update('didb_documents_votes', array('votes=votes+1', 'points=points+'. $points ), 'document_id=' .$id );
      }
    }else{
      $data->error('already voted');
    }

  echo $data->getOutput();


  }
}

?>
