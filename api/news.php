<?php


require_once('../data/Database.php');
require_once('APIData.php');

$database;


Class NewsApi{



  function __construct(){

    $this->database = new Database();

    $result = $this->database->select(array('id', 'date', 'title', 'body'), 'didb_blog');

    $ids = array();
    $dates = array();
    $titles = array();
    $bodys = array();



    for($i=0; $i<sizeof($result);$i++){
      array_push($ids, $result[$i]['id']);
      array_push($dates, $result[$i]['date']);
      array_push($titles, $result[$i]['title']);
      array_push($bodys, $result[$i]['body']);
    }


    $data = new APIData();
    $data->addArray('ids', $ids);
    $data->addArray('dates', $dates);
    $data->addArray('titles', $titles);
    $data->addArray('bodys', $bodys);

    echo $data->getOutput();


  }
}

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');


new NewsApi();





?>
