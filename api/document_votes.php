<?php

require_once('../data/Database.php');
require_once('APIData.php');


$api = new DocumentVotesApi();

Class DocumentVotesApi{

private $database;

function __construct(){
$this->database = new Database();



$result = $this->database->select(array('votes', 'points'), 'didb_documents_votes', 'document_id=' .$_GET['id']);

$possible_points = intval($result[0]['votes'])*5;
$points = intval($result[0]['points']);

$rating = round(($points/$possible_points)*5);

$data = new APIData();
$data->add('rating', $rating);
echo $data->getOutput();



}
}

?>
