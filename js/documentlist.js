var documentItem = '<div id="document-%ID%" class="col-xs-6 col-sm-3 col-md-2 col-lg-2 "><div class="card"><a href="?p=documenteditor&doc=%ID%"><img src="%PREVIEW%" style="width:100%;"></a><p onclick="removeItem(%ID%)" class="button-remove"></p></div><h3></h3><h4>%TITLE%</h4><h5>(%TYPE%)</h5></div>';
var elementAdd = '<div class="col-xs-6 col-sm-3 col-md-2 col-lg-2 "><a href="?p=documenteditor"><div class="card"><img src="img/sample.png" style="width:100%; opacity:0.4"><p class="watermark">+</p></div></a><h3></h3><h4>hinzufügen</h4></div>';

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
  formData.append('request', '{"action" : "remove", "id" : "'+ id +'"}');
  xhttp.open("POST", 'api/save_document.php', true);

  xhttp.send(formData);
}


function Document(i, ti, d, ty,p, pdf, t){
   this.id = i;
   this.title = ti;
   this.description = d;
   this.type = ty;
   this.path = p;
   this.pdf = pdf;
   this.thumb = t;
}




function loadDocuments(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      onDocumentsFetched(JSON.parse(this.responseText));
    }
  };
  xhttp.open("GET", "api/documents.php", true);
  xhttp.send();

}


function onDocumentsFetched(json){
  console.log(json);
  documents = [];
  for(var i=0; i<json.data.titles.length; i++){
    documents.push(new Document(json.data.ids[i], json.data.titles[i], json.data.descriptions[i], json.data.types[i], json.data.paths[i], json.data.pdf[i], json.data.thumb[i]));
  }
  updateDocumentList();
}


function updateDocumentList(){
  $('#document-list').empty();

  for(var i=0; i<documents.length; i++){
    $('#document-list').append(createItem(documents[i]));
  }

  $('#document-list').append(elementAdd);
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
