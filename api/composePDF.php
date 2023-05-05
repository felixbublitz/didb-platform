<?php

require_once("../data/PDFMerger.php");


$pdf = new PDFMerger;

if(isset($_COOKIE["document-cart"])){
    $documentCart = json_decode($_COOKIE["document-cart"]);
  }else{
    $documentCart = null;
  }


if($documentCart && sizeof($documentCart->documents) !== 0){

    for($i=0; $i<sizeof($documentCart->documents); $i++){
      $doc = $documentCart->documents[$i];
      for($j=0; $j<$doc->count; $j++){
      $pdf->addPDF('../' .$doc->path . '/original.pdf', 'all');
      }

    }
    $pdf->merge('browser', 'DidB Unterlagen.pdf');

  }else{
  echo '<div style="opacity:0.8;position:absolute; top:50%; left:50%; width:500px;height:154px; margin-left:-250px;margin-top:-77px;  text-align:center;"><img src="../img/logo.png" style="width:64px;"><h1>Druckauftrag leer</h1><p>Fügen Sie die gewünschten Dokumente dem Auftrag hinzu.</p></div>';

  }







?>
