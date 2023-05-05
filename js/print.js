var printItem = '<div id="document-%ID%" class="col-xs-12 col-sm-4 col-md-4 col-lg-2  "><div class="card"><img src="%PREVIEW%" style="width:100%;"><p style="display:none;" class="watermark"></p><p onclick="removeItem(%ID%)" class="button-remove"></p></div><h3></h3><h4>%TITLE% (%COUNT%x)</h4></div>';
var noItem = '<div id="document-no" class="col-xs-12 col-sm-4 col-md-4 col-lg-2 "><div style="opacity:0.4" class="card"><img src="img/sample.png" style="width:100%;"></div><h3>keine Dokumente</h3><h4></h4></div>';
var documentCart;


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


function setCookie(cname, cvalue, exdays) {
var d = new Date();
d.setTime(d.getTime() + (exdays*24*60*60*1000));
var expires = "expires="+ d.toUTCString();
document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
var name = cname + "=";
var decodedCookie = decodeURIComponent(document.cookie);
var ca = decodedCookie.split(';');
for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
        c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
    }
}
return "";
}



function removeItem(id){

  documentCart.documents.splice(findItem(id), 1);

  console.log(documentCart);

  setCookie('document-cart', JSON.stringify(documentCart), 1);
  loadPrintList();
  document.getElementById('pdf').contentWindow.location.reload();
}


function findItem(id){
  for(var i=0; i<documentCart.documents.length; i++){
    if(documentCart.documents[i].id == id){
      return i;
    }
  }
}

function loadPrintList(){

    $('#print-list').html('');

  var documentCartString = getCookie('document-cart');

  if(documentCartString){
    documentCart = JSON.parse(documentCartString);
  }else{
    documentCart = null;
  }

  if(documentCart && documentCart.documents.length !== 0){

    for(var i=0; i<documentCart.documents.length; i++){
      var doc = documentCart.documents[i];
      $('#print-list').append(createItem(doc.id, doc.title, doc.path, doc.count, doc.preview));
      $('#print-button').css('display', 'inline-block');
    }
  }else{
      $('#print-button').css('display', 'none');
      $('#print-list').append(noItem);

  }
}

function createItem(id, title, path, count, preview){
    var out = printItem;
    out = out.replaceAll('%ID%', id);
    out = out.replaceAll('%TITLE%', title);
    out = out.replaceAll('%PATH%', path);
    out = out.replaceAll('%COUNT%', count);
    out = out.replaceAll('%PREVIEW%', preview);

    return out;
}

loadPrintList();
