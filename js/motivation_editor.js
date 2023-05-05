var newItem = '<div  style="padding:0 32px;" class="carousel-item %ACTIVE%"><div class="carousel-content-outer"><div style="display:table; width:100%; vertical-align:middle"><div class="carousel-content" style=""><div style="width:100%"><div id="motivation-bubble" style="-webkit-filter: drop-shadow(1px 1px 4px #ccc);filter: drop-shadow(1px 1px 4px #ccc);"><img src="img/check.svg" onclick="add()" style="cursor:pointer;width:48px;margin:0;position:absolute;right:0;top:-12px;"><div style="background:#07afd6; padding: 4px 8px; border-radius: 24px;"><textarea class="motivation-description" id="motivation-description-%ID%" style="width:100%;height:100%;background:transparent;border:0;color:white;text-align:center;font-size:20px;padding:16px;" placeholder="Neue Motivation">%DESCRIPTION%</textarea></div><img style="margin:0;" src="img/bubble_2.png"></div><div id="motivation-about"><div id="image-upload"><label for="file-input-%ID%"><img class="motivation-thumb" id="motivation-thumb-%ID%" src="%THUMB%" style="-webkit-filter: drop-shadow(1px 1px 4px #ccc);filter: drop-shadow(1px 1px 4px #ccc);margin-top:8px;margin-bottom:8px; width:128px;cursor:pointer;" class="img-circle"></label><input onChange="upload(%ID%)" id="file-input-%ID%" name="file-%ID%" type="file" style="display:none;"/></div><div style="margin-top:0;margin-bottom:0;font-size:24px;color:black!important"><input id="motivation-author-%ID%" style="background:transparent; border:0;text-align:center;" placeholder="Autor" value="%AUTHOR%"></div><p style="margin-top:0;font-size:16px;color:black!important"><input style="background:transparent; border:0;text-align:center;" id="motivation-position-%ID%" value="%POSITION%" placeholder="Position"></p></div></div></div></div></div></div>';

var item = '<div style="padding:0 32px;" class="carousel-item %ACTIVE%"><div class="carousel-content-outer"><div style="display:table; width:100%; vertical-align:middle"><div class="carousel-content" style=""><div style="width:100%"><div id="motivation-bubble" style="-webkit-filter: drop-shadow(1px 1px 4px #ccc);filter: drop-shadow(1px 1px 4px #ccc);"><img src="img/delete.svg" onclick="remove(%ID%)" style="cursor:pointer;width:48px;margin:0;position:absolute;right:0;top:-12px;"><div style="background:#07afd6; padding: 4px 8px; border-radius: 24px;"><textarea onchange="update(%ID%)" class="motivation-description" id="motivation-description-%ID%" style="width:100%;height:100%;background:transparent;border:0;color:white;text-align:center;font-size:20px;padding:16px;" placeholder="Motivation">%DESCRIPTION%</textarea></div><img style="margin:0;" src="img/bubble_2.png"></div><div id="motivation-about"><div id="image-upload"><label for="file-input-%ID%"><img class="motivation-thumb" id="motivation-thumb-%ID%" src="%THUMB%" style="-webkit-filter: drop-shadow(1px 1px 4px #ccc);filter: drop-shadow(1px 1px 4px #ccc);margin-top:8px;margin-bottom:8px; width:128px;cursor:pointer;" class="img-circle"></label><input id="file-input-%ID%" name="file-%ID%" onChange="upload(%ID%)" type="file" style="display:none;"/></div><div style="margin-top:0;margin-bottom:0;font-size:24px;color:black!important"><input id="motivation-author-%ID%" style="background:transparent; border:0;text-align:center;" onchange="update(%ID%)" placeholder="Autor" value="%AUTHOR%"></div><p style="margin-top:0;font-size:16px;color:black!important"><input style="background:transparent; border:0;text-align:center;" id="motivation-position-%ID%" onchange="update(%ID%)" value="%POSITION%" placeholder="Position"></p></div></div></div></div></div></div>';



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};


var uploadedThumb = null;

function upload(id){
  fu = new FileUploader();
  fu.onUploaded = function(fu){
    $('#motivation-thumb-' + id).attr('src', fu.file);
    if(id != -1){
      fu.save(function(thumb){
        update(id, thumb);
      });

    }else{
      fu.save(function(thumb){
        uploadedThumb = thumb;
      });
    }
  }
  fu.upload('file-input-' + id);
}




function update(id, thumb){
  sql = new SQLQuery();
  sql.setMethod('update');
  sql.setFrom('didb_motivations');
  if(thumb != null){
    sql.add('thumb', thumb);
  }
  sql.add('author', $('#motivation-author-' + id).val());
  sql.add('position', $('#motivation-position-' + id).val());
  sql.add('description', $('#motivation-description-' + id).val());
  sql.setWhere('id', id);
  sql.query();

}

function add(){
  if(uploadedThumb == null){
    alert("no image");
  }

  sql = new SQLQuery();
  sql.setMethod('insert');
  sql.setFrom('didb_motivations');
  sql.add('author', $('#motivation-author-' + -1).val());
  sql.add('position', $('#motivation-position-' + -1).val());
  sql.add('description', $('#motivation-description-' + -1).val());
  sql.add('thumb', uploadedThumb);


  sql.query();
  location.reload();

}


function remove(id){
  sql = new SQLQuery();
  sql.setMethod('delete');
  sql.setFrom('didb_motivations');
  sql.setWhere('id', id);
  sql.query();
  location.reload();

}


function loadMotivations(){
  sql = new SQLQuery();
  sql.setMethod('select');
  sql.setFrom('didb_motivations');
  sql.add('id');
  sql.add('author');
  sql.add('position')
  sql.add('thumb')
  sql.add('description')
  sql.query(motivationsFetched);
}


function motivationsFetched(json){
  for(var i=0; i< json.id.length; i++){
    $('#carousel-cont').append(createItem(json.id[i], json.author[i], json.position[i], json.thumb[i], json.description[i], i==0));

    if(i != 0){
      $('#carousel-indicator').append('<li data-target="#carouselExampleIndicators" data-slide-to="' + i +'"></li>');
    }

  }

  $('#carousel-cont').append(createItem(-1, '', '','img/girl.svg', '', false));
  $('#carousel-indicator').append('<li data-target="#carouselExampleIndicators" data-slide-to="' + json.id.length +'"></li>');

}


function createItem(id, author, position, thumb, description, active){
  if(id==-1){
    out = newItem;
  }else{
    out = item;
  }

  if(active){
    out = out.replaceAll('%ACTIVE%', 'active');
  }
  out = out.replaceAll('%ID%', id);
  out = out.replaceAll('%AUTHOR%', author);
  out = out.replaceAll('%POSITION%', position);
  out = out.replaceAll('%THUMB%', thumb);
  out = out.replaceAll('%DESCRIPTION%', description);
  return out;

}


loadMotivations();
