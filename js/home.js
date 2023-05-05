function searchDoc(){
  var tags_string = "&tags=";
  var levels_string = "&levels=";

  for(var i=0; i<tags.length; i++){
    if(tags[i].enabled){
      tags_string += tags[i].title + ',';
    }
  }
  tags_string = tags_string.substring(0, tags_string.length - 1);

  for(i=0; i<levels.length; i++){
    if(levels[i].enabled){
      levels_string += levels[i].title + ',';
    }
  }
  levels_string = levels_string.substring(0, levels_string.length - 1);

  var url = '?p=search';

  if(levels_string != '&levels'){
    url += levels_string;
  }

  if(tags_string != '&tags'){
    url += tags_string;
  }



  document.location.href = url;

}
