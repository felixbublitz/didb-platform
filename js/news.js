


var entries = [];


var entry = ""
var editableEntry = '<div style="padding: 8px; text-align:center;" class="row row-blog  vertical-align justify-content-center"><div class = "col-sm-12 col-md-10 col-lg-8"><div class="news-date">%DATE%</div><div class="news-item" style="position:relative;"><p onclick="updateNews(%ID%)" class="button-add" style="right:42px;"></p><p onclick="removeNews(%ID%)" class="button-remove"></p><div class="news-headline"><input class="blog-input" id ="blog-input-%ID%" placeholder="Neuer Beitrag" value="%TITLE%"></input></div><div class="news-body"><textarea class="blog-textarea summernote" uid=%ID% id="blog-textarea-%ID%">%BODY%</textarea></div></div>  </div><div class="col-12"><div class="time-line"></div></div></div>';


var newEntry = '<div style="padding: 8px; text-align:center;" class="row row-blog  vertical-align justify-content-center"><div class = "col-sm-12 col-md-10 col-lg-8"><div class="news-date">%DATE%</div><div class="news-item" style="position:relative;"><p onclick="addNews()" class="button-add"></p><div class="news-headline"><input class="blog-input" id="blog-input-new" placeholder="Neuer Beitrag" value="%TITLE%"></input></div><div class="news-body"><textarea id="blog-textarea-new" class="blog-textarea summernote">%BODY%</textarea></div></div>  </div><div class="col-12"><div class="time-line"></div></div></div>';



var defaultEntry = '<div style="padding: 8px; text-align:center;" class="row row-blog  vertical-align justify-content-center"><div class = "col-sm-12 col-md-10 col-lg-8"><div class="news-date">%DATE%</div><div class="news-item"><div class="news-headline">%TITLE%</div><div class="news-body">%BODY%</div></div>  </div><div class="col-12"><div class="time-line"></div></div></div>';
var editor = false;

var loadedEntries = 0;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};





function addNews(){
  var body = $('#blog-textarea-new').val()
  var title = $('#blog-input-new').val();


  sql = new SQLQuery();
  sql.setMethod('insert');
  sql.setFrom('didb_blog');
  sql.add('title', title);
  sql.add('body', body);
  sql.query();

  location.reload();


}


function updateNews(id){
  var body = $('#blog-textarea-' + id).val()
  var title = $('#blog-input-' + id).val();


  sql = new SQLQuery();
  sql.setMethod('update');
  sql.setFrom('didb_blog');
  sql.setWhere('id', id);
  sql.add('title', title);
  sql.add('body', body);

  sql.query();
  location.reload();


}


function removeNews(id){

  sql = new SQLQuery();
  sql.setMethod('delete');
  sql.setFrom('didb_blog');
  sql.setWhere('id', id);
  sql.query();

  location.reload();
}



function createItem(document){

  var out = null;
  if(document.id == null){
    out = newEntry;
  }else {
    out = entry;
  }


    if(document.date == 'now'){
      var d = new Date(Date.now());

    }else{
      var t = document.date.split(/[- :]/);
      var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

    }


    out = out.replaceAll('%DATE%', d.getDate() + '.' + (d.getMonth()+1) + '.' + d.getFullYear());
    out = out.replaceAll('%TITLE%', document.title);
    out = out.replaceAll('%ID%', document.id);
    out = out.replaceAll('%BODY%', document.body);

    return out;
}



function load(editor_enabled){

  if(editor_enabled){
    editor = true;

    entry = editableEntry;
  }else{
    entry = defaultEntry;
  }

  request = new SQLQuery();
  request.setMethod('select');
  request.setFrom('didb_blog');
  request.add('id')
  request.add('title');
  request.add('date');
  request.add('body');
  request.setOrder('date DESC');


  request.query(push_to_entries);

}


function push_to_entries(json){

  for(var i=0; i<json.id.length; i++){
    var cont = {'id' : json.id[i], 'date' : json.date[i], 'title' : json.title[i], 'body' : json.body[i]};
    entries.push(cont);
  }

  load_entries();

}

function load_entries(){
  $('#loading-icon').hide();
  if(editor){
    $('#blog-container').append(createItem({'title':'', 'body' : '', 'date' : 'now'}));
  }
  for(var i=0; i< entries.length; i++){
    $('#blog-container').append(createItem(entries[i]));
    loadedEntries++;
  }
    $('#blog-container').append('<div style="margin: 8px; text-align:center;" class="row row-blog  vertical-align justify-content-center"><div style="text-align:center;background:#757575;height:32px;width:32px;border-radius:16px;"></div></div>');

if(editor){
  $(".news-body").css("padding", 0);
  }


$('.summernote').summernote();
}


$.getScript( "js/access.js" , function(){checkAccess(load)});
