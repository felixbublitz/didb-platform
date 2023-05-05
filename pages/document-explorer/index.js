var documentItem = '<div style="margin:4px;float:left;width:20%;" id="document-%ID%"><div class="card"><a href="?p=documenteditor&doc=%ID%#skipheader"><img src="../../%PREVIEW%" style="border-radius:4px;border:1px dashed #ccc;width:100%"></a><p onclick="removeItem(%ID%)" class="button-remove"></p></div><h4 style="text-align:center;margin-top:0px;font-size:16px;">%TITLE%</h4>';

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

  xhttp.open("POST", '../../api/save_document.php', true);

  xhttp.send(formData);
}


function Document(i, ti, d, p, ty){
   this.id = i;
   this.title = ti;
   this.description = d;
   this.preview_url = p;
   this.type = ty;
}



function loadDocuments(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      onDocumentsFetched(JSON.parse(this.responseText));
    }
  };
  xhttp.open("GET", "../../api/documents.php", true);
  xhttp.send();

}


function onDocumentsFetched(json){
  console.log(json);
  documents = [];
  for(var i=0; i<json.data.titles.length; i++){
    documents.push(new Document(json.data.ids[i], json.data.titles[i], json.data.descriptions[i], json.data.preview_urls[i], json.data.types[i]));
  }
  updateDocumentList();
}


function updateDocumentList(){
  $('#document-list').empty();

  for(var i=0; i<documents.length; i++){
    $('#document-list').append(createItem(documents[i]));
  }

}




function createItem(document){
    var out = documentItem;
    out = out.replaceAll('%ID%', document.id);
    out = out.replaceAll('%TITLE%', document.title);
    out = out.replaceAll('%DESCRIPTION%', document.description);
    out = out.replaceAll('%PREVIEW%', document.preview_url);
    out = out.replaceAll('%TYPE%', document.type);

    return out;
}

loadDocuments();
