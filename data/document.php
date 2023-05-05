<?php

include("Data.php");

class DocumentData extends Data{

  function loadData(){
    if(!isset($_GET['doc'])){
      return;
    }

    $a=intval($_GET['doc']);
    $result = $this->database->query("SELECT doc.title, doc.license, doc.path, doc.description, doc.id, doc.pages, act_type.title as type FROM didb_documents doc JOIN didb_documents_types types ON doc.id=types.document_id JOIN didb_types act_type ON act_type.id = types.type_id WHERE doc.id=$a");



    while($row = mysql_fetch_assoc($result)){

    $this->add("title",$row['title']);


    if($row['license'] != 0){
      $res2 = $this->database->select(array('logo', 'url'), 'didb_licenses', 'id=' + $row['license']);
      $this->add("license-logo", $res2[0]['logo']);
      $this->add("license-url", $res2[0]['url']);

    }else{
      $this->add("license-logo", 'img/no-license.png');
      $this->add("license-url", '#');

    }


    $this->add("description",nl2br($row['description']));

    for($i=0; $i<intval($row['pages']); $i++){
      $this->add("preview_". $i ,$row['path'] . '/' . 'thumb-'.$i.'.jpg');
    }


    $this->add("path",$row['path'] );
    $this->add("type",$row['type'] );
    $this->add("pages",$row['pages'] );
    $this->add("id",$row['id']);


    $this->add("rating", $this->getRating($row['type']));
  }
  }


  function getRating($type){

    if($type == 'Leporello'){
      return null;
    }
    $this->database = new Database();



    $result = $this->database->select(array('votes', 'points'), 'didb_documents_votes', 'document_id=' .$_GET['doc']);

    if($result == ''){      return 0;
    }

    $possible_points = intval($result[0]['votes'])*5;
    $points = intval($result[0]['points']);

    $rating = round(($points/$possible_points)*5);

    return $rating;
  }

}

$data = new DocumentData();


?>
