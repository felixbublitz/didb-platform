<?php

include("Data.php");
include("data/truncate.php");



function escapeJson($str){
  $str = str_replace('"', '\"', $str);
  $str = nl2br($str);
  $str = str_replace(array("\r", "\n"), '', $str);

  return $str;
}


class HomeData extends Data{


  function loadData(){

    $result = $this->database->select(array('title', 'preview_url', 'description'),'didb_documents');

    if($result == ""){
      $this->add("preview_1", "img/sample.png");
      $this->add("preview_2", "img/sample.png");
      $this->add("preview_3", "img/sample.png");
    }else{
      $this->add("preview_1", $result[0]['preview_url']);
      $this->add("preview_2", $result[1]['preview_url']);
      $this->add("preview_3", $result[2]['preview_url']);
    }



    $result = $this->database->select(array('id', 'date', 'title', 'body'), 'didb_blog', '', ' ORDER BY date DESC');

    $ids = array();
    $dates = array();
    $titles = array();
    $bodys = array();





    for($i=0; $i<2;$i++){
        $new_datetime = DateTime::createFromFormat ( "Y-m-d H:i:s",   $result[$i]['date'] );

        $this->add('date_'.$i, escapeJson($new_datetime->format('d.m.Y')));
        $this->add('title_'.$i, escapeJson($result[$i]['title']));


        $ab = truncate($result[$i]['body'], 500, '...', $exact = false, $considerHtml = true);

        $this->add('body_'.$i, $ab);
    }


  }

}

$data = new HomeData();


?>
