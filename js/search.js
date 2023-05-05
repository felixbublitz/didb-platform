var documentItem = '<div id="document-%ID%" class="col-xs-12 col-sm-4 col-md-4 col-lg-2 "><div class="card"><a href="?p=document&doc=%ID%#skipheader"><img src="%PREVIEW%" style="width:100%;"></a></div><h3></h3><h4>%TITLE%</h4></div>';
var noItem = '<div id="document-no" class="col-xs-12 col-sm-4 col-md-2 col-lg-2 "><div style="opacity:0.4" class="card"><img src="img/sample.png" style="width:100%;"></div><h3></h3><h4>nichts gefunden</h4></div>';

var documents = [];



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function removeItem(id){
  removeDocument(id);

}


function removeDocument(id){
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200)) {
      loadDocuments();
    }
  };

  var formData = new FormData();
  formData.append('id', id);
  formData.append('remove', true);

  xhttp.open("POST", 'api/save_document.php', true);

  xhttp.send(formData);
}


function Document(i, ti, d, th, ty){
   this.id = i;
   this.title = ti;
   this.description = d;
   this.thumb = th;
   this.type = ty;
}



function loadDocuments(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      onDocumentsFetched(JSON.parse(this.responseText));
    }
  };

  var url = 'api/search.php?o=1';

  if(GET('levels'))
  url += '&levels=' + GET('levels');

  if(GET('tags'))
  url += '&tags=' + GET('tags');

  xhttp.open("GET", url, true);
  xhttp.send();

}


function GET(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


function onDocumentsFetched(json){
  console.log(json);
  documents = [];
  for(var i=0; i<json.data.titles.length; i++){
    documents.push(new Document(json.data.ids[i], json.data.titles[i], json.data.descriptions[i], json.data.thumbs[i], null));
  }
  updateDocumentList();
}


function updateDocumentList(){
  $('#document-list').empty();


  if(documents.length == 0){
    $('#document-list').append(noItem);
  }

  for(var i=0; i<documents.length; i++){
    $('#document-list').append(createItem(documents[i]));
  }


}




function createItem(document){
    var out = documentItem;
    out = out.replaceAll('%ID%', document.id);
    out = out.replaceAll('%TITLE%', document.title);
    out = out.replaceAll('%DESCRIPTION%', document.description);
    out = out.replaceAll('%PREVIEW%', document.thumb);
    out = out.replaceAll('%TYPE%', document.type);

    return out;
}


loadDocuments();
