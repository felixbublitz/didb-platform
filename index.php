<?php

require_once('api/access.php');

$access = new Access();

$page = 'home';
$pagerequest = 'home';
$pageTitle = 'Deutschkurs in der Box';

if(isset($_GET['action'])){



  switch ($_GET['action']){
    case 'login':

    $access->login($_POST['password']);
    break;
    case 'logout':
    $access->logout();
    break;
  }

}


if(isset($_GET['p']))
  $pagerequest = $_GET['p'];

if(file_exists('pages/' . $pagerequest . '.html')){
  $page = $pagerequest;
}

//Check Permissions

if(file_exists('restrictions/' . $pagerequest)){
  if(!$access->permitted()){
    $page = 'login';
  }
}

$globalbody = '';

if($access->permitted()){
  $globalbody = file_get_contents('construct/globalbody_admin.html');
}else{
  $globalbody = file_get_contents('construct/globalbody.html');
}


$footer = file_get_contents('construct/footer.html');
$requiredjs = file_get_contents('construct/requiredjs.html');
$head = file_get_contents('construct/head.html');


$localbody = file_get_contents('pages/' . $page . '.html');


if(file_exists('data/' . $page . '.php')){
  //Creates $data object
  include('data/' . $page . '.php');


  foreach($data->request() as $key => $value){

      $localbody = str_replace('%'.strtoupper($key).'%', $value, $localbody);
  }
}

$pageTitleStart = strpos($localbody, '<page-title>');
$pageTitleEnd = strpos($localbody, '</page-title>');
if ($pageTitleStart !== false && $pageTitleEnd !== false) {
    $pageTitle= substr($localbody , $pageTitleStart + 12, $pageTitleEnd-$pageTitleStart-12 );
    $localbody = substr_replace($localbody, '', $pageTitleStart,  $pageTitleEnd-$pageTitleStart);
}


echo '<!DOCTYPE html><html lang="en">';

echo '<head>' . $head . '<title>'.$pageTitle.'</title></head>';
echo '<body>';
  echo $requiredjs;
  echo '<div class="content-container">';
  echo $globalbody;


    echo $localbody;

  echo $footer;
  echo '</div>';
echo '</body>';


?>
