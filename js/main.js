
var tags = [];
var levels = [];
var types = [];
tagsClickable = false;

var leporellos = [];
var leporelloIndex = 0;

var motivations = [];
var motivationIndex = 0;
var loadedTags = 0;
var onDocumentTagsFetchedObject = null;
var activeTag = '';

function APIRequest(name){

  this.source = name;
  this.formData = new FormData();
  var self = this;
  this.method = 'GET';


  this.add = function(attr, val){
    self.formData.append(attr,val);
  }

  this.onFinish = function(obj) {

  }

  this.onError = function(msg) {

  }


  this.execute = function (){
     var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
         var obj = JSON.parse(this.responseText);
         if(obj.status != 'error'){
           self.onFinish(obj.data);
         }else{
           self.onError(obj.message);
         }
       }
     };
     xhttp.open(self.method, 'api/' + self.source + '.php', true);

     xhttp.send(self.formData);
   }

}


function FileUploader() {

  this.fileName = null;
  this.baseName = null;

  this.file = null;
  this.onUploaded = null;
  var self = this;


  this.save = function(onFinish, path) {
    req = new APIRequest('upload_file');
    req.method = 'POST';
    req.add('save', self.fileName);
    if(path != null){
      req.add('path', path);
    }
    req.onFinish = function(obj) {
      onFinish(obj.path, self.baseName);
    }
    req.execute();
  }


  this.upload = function(finput){
    var fileInput = document.getElementById(finput);
    var file = fileInput.files[0];

    req = new APIRequest('upload_file');

    req.onError = function(a){
      alert(a)
    };

    req.onFinish = function(obj) {
      self.file = obj.path + obj.filename;
      self.fileName = obj.filename;
      self.baseName = obj.basename;
      if(self.onUploaded != null)
        self.onUploaded(self);
    }
    req.method = 'POST';
    req.add('file', file);
    req.execute();
  }



}

$(document).ready(function() {
  $('.summernote').summernote();
});


function SQLQuery () {

  this.method = '';
  this.attr = [];
  this.val = [];
  this.where = true;
  this.orderby = '';
  this.from = '';

  var self = this;

  this.setMethod = function(method){
    self.method = method;
  }

  this.add = function(attr, val){
    if(attr != null){
      self.attr.push(attr);
    }

    if(val != null){
      self.val.push(val);
    }
  }

  this.setOrder = function(order){
    self.orderby = "ORDER BY " + order ;
  }

  this.setWhere = function(attr, val){
    self.where = attr + '=' + '"' + val + '"';
  }

  this.setFrom = function(table){
    self.from = table
  }

  this.query = function(onFinish){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && (this.status == 200)) {
        var json = JSON.parse(this.responseText);
        if(json.status == 'error'){
          alert(json.message);
        }else{
          if(onFinish){
          onFinish(json.data);
          }
        }
      }
    };
    var formData = new FormData();

    formData.append('method', self.method);
    formData.append('attr', JSON.stringify(self.attr));
    formData.append('val', JSON.stringify(self.val));
    formData.append('where', self.where);
    formData.append('from', self.from);
    formData.append('orderby', self.orderby);

    xhttp.open("POST", 'api/db_controller.php', true);
    xhttp.send(formData);
  }


}

// anti-pattern! keep reading...
function getAppleInfo() {
    return this.color + ' ' + this.type + ' apple';
}


var tagColors = ['#d65507', '#07d6bb', '#d60707', '#d60782'];

//fix modulo operation
Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function Leporello(i, t, d, p, pdf, t1, t2, t3){
   this.id = i;
   this.title = t;
   this.description = d;
   this.path = p;
   this.pdf = pdf;
   this.thumb_1 = t1;
   this.thumb_2 = t2;
   this.thumb_3 = t3;
}

function Tag(u, i, t, d, c, cid){
  this.dbid = i;
  this.id = u+i;
  this.color = c
  this.colorID = cid;
  this.title = t;
  this.description = d;
  this.enabled = false;
}

if(!!window.performance && window.performance.navigation.type === 2)
{
    console.log('Reloading');
    window.location.reload();
}


$(document).ready(function(){
  $('#content-box').fadeIn(500);

}
);
/*
$(function() {
    $("a").click(function() {
        changePage($(this).attr('href'));
        return false;
    });
});

*/

function changePage(url){

  $('#content-box').fadeOut(100, function(){
    window.location.href = url;
});

}


function tagsLoaded(){
  loadedTags++;
  if(loadedTags == 3 && onDocumentTagsFetchedObject != null && onDocumentTagsFetched != undefined){
    onDocumentTagsFetched(onDocumentTagsFetchedObject);
  }
}



function onTagSaved(id){
  loadTags(function(){switchTag('tag'+id)});
}


function saveNewTag(id){



  var tagTitle = $('#' + id).val();

  if(tagTitle == '')
  return;


  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200)) {
      if(onTagSaved){
      onTagSaved(this.responseText);
      }
    }
  };

  var formData = new FormData();
  formData.append('title', tagTitle);
  formData.append('description', '');

  xhttp.open("POST", 'api/save_tag.php', true);

  xhttp.send(formData);

}


function getTag(id){
  for(var i=0; i<tags.length; i++){
    if(tags[i].id == id){
      return tags[i];
    }
  }

  for(var i=0; i<levels.length; i++){
    if(levels[i].id == id){
      return levels[i];
    }
  }

  for(var i=0; i<types.length; i++){
    if(types[i].id == id){
      return types[i];
    }
  }

  return null;
}

function switchTag(id, enable){
  var tag = getTag(id);

  if(tag && enable != undefined){
    if(enable){
      tag.enabled = true;
      console.log("enable");
      $('#' + id).removeClass('disabled');
      return;
    }else{
      tag.enabled = false;
      $('#' + id).addClass('disabled');
      return;
    }
  }

  if(tag && tag.enabled){
    tag.enabled = false;
    $('#' + id).addClass('disabled');
  }else if(tag){
    tag.enabled = true;
      $('#' + id).removeClass('disabled');
  }else{
  }

}

function toggleTag(id, id2){
    $('#' + id).removeClass('disabled');
    $('#' + id2).addClass('disabled');

}


function Motivation(i, a, p, t, d){
   this.id = i;
   this.author = a;
   this.position = p;
   this.thumb = t;
   this.description = d;
}

function mod(n, m) {
        return ((n % m) + m) % m;
}




    window.addEventListener('message', function(event){
      switch(event.data){
        case 'CLOSE_PRINTGUIDE':
        $("#print-guide").animate({
        left: '100%',
        top: '-200px',
        marginLeft: '0',
        marginTop: '0',
        opacity: '0'

      },{duration: 250, complete: resetPrintGuide});

        // $("#print-guide").css('display', 'none');
        break;
        case 'SHOW_PRINTHINT':
          showHintArrow();
        break;

        case 'GO_TO_PRINTER':
        window.location.href = '?p=print';
        break;
      }
    });

    function resetPrintGuide(){
      $("#print-guide").css('left','50%');
      $("#print-guide").css('top','50%');
      $("#print-guide").css('width','600px');
      $("#print-guide").css('height','420px');
      $("#print-guide").css('opacity','0');
      $("#print-guide").css('margin-top','-210px');
      $("#print-guide").css('margin-left','-300px');

      document.getElementById('print-guide').style.display = "none";
    }





    function showHintArrow(){

       $("#hint-arrow").css('display', 'block');

        $("#hint-arrow").animate({
        opacity: '0.8'
      },{duration: 200, complete: hideHintArrow});

    }

     function hideHintArrow(){

       setTimeout(function(){
 $("#hint-arrow").animate({
        opacity: '0'
      },{duration: 200, complete: removeHintArrow});


       }, 1000);



    }


    function removeHintArrow(){
       $("#hint-arrow").css('display', 'none');
    }

    function changeDescription(){

        $("#browse-description").animate({
        opacity: '0'
      },{duration: 400, complete: showDescription});



    }


    function nextMotivation(){
      motivationIndex = (motivationIndex + 1).mod(motivations.length);


      shrink("motivation-bubble");
      fadeOut("motivation-about");
      setTimeout(function(){ showMotivation(''); }, 450);
    }

    function showMotivation(a){

      $('#motivation-author').html(motivations[motivationIndex].author);
      $('#motivation-position').html(motivations[motivationIndex].position);
      $('#motivation-description').html('„' + motivations[motivationIndex].description + '“');
      $('#motivation-thumb').attr('src', motivations[motivationIndex].thumb);

      shrinkRev("motivation-bubble");
      fadeIn("motivation-about");
      setTimeout(nextMotivation, 10000);
    }



    function showDescription(){
      $("#browse-description-headline").html(leporellos[leporelloIndex].title);
      $("#browse-description-p").html(leporellos[leporelloIndex].description);
       $("#browse-description").animate({
        opacity: '1'
      },{duration: 1500});
    }



    function scrollToAnchor(aid){
      url = location.href.split("#");
      if(url[0] != "http://www.deutschkursinderbox.de/"){
        changePage("http://www.deutschkursinderbox.de/#" + aid);
      }
        var aTag = $("#" + aid);
        $('html,body').animate({scrollTop: aTag.offset().top - 54},'slow');
    }


    function loadLeporellos(){

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          onLeporellosFetched(JSON.parse(this.responseText));
        }
      };
      xhttp.open("GET", "api/leporellos.php", true);
      xhttp.send();

    }


    function loadMotivations(){

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          onMotivationsFetched(JSON.parse(this.responseText));
        }
      };
      xhttp.open("GET", "api/motivations.php", true);
      xhttp.send();

    }


    function enableClickableTags(){
      tagsClickable = true;
    }



    function loadTags(onFinish){

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          onTagsFetched(JSON.parse(this.responseText), onFinish);
        }
      };
      xhttp.open("GET", "api/tags.php", true);
      xhttp.send();

    }

    function loadLevel(){

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          onLevelsFetched(JSON.parse(this.responseText));
        }
      };
      xhttp.open("GET", "api/levels.php", true);
      xhttp.send();

    }


    function loadTypes(){

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          onTypesFetched(JSON.parse(this.responseText));
        }
      };
      xhttp.open("GET", "api/types.php", true);
      xhttp.send();

    }


    function updateLeporellos(onFinish){

      fadeOut('browse-item-left-new-img', 250);
      fadeOut('browse-item-left-img', 250);
      fadeOut('browse-item-middle-img', 250);
      fadeOut('browse-item-right-img', 250);
      fadeOut('browse-item-right-new-img', 250);

      window.setTimeout(onFinish, 500);

      window.setTimeout(function(){

        $('#browse-item-left-new-img').attr('src',leporellos[(leporelloIndex).mod(leporellos.length)].thumb_1);
        $('#browse-item-left-img').attr('src', leporellos[(leporelloIndex ).mod(leporellos.length)].thumb_1);
        $('#browse-item-middle-img').attr('src',leporellos[(leporelloIndex).mod(leporellos.length)].thumb_2);
        $('#browse-item-right-img').attr('src',leporellos[(leporelloIndex ).mod(leporellos.length)].thumb_3);
        $('#browse-item-right-new-img').attr('src',leporellos[(leporelloIndex ).mod(leporellos.length)].thumb_3);

        fadeIn('browse-item-left-new-img', 250);
        fadeIn('browse-item-left-img', 250);
        fadeIn('browse-item-middle-img', 250);
        fadeIn('browse-item-right-img', 250);
        fadeIn('browse-item-right-new-img', 250);



      }, 250)





      $('#browse-item-middle').click(function functionName() {
        document.location.href = '?p=document&doc='+ leporellos[(leporelloIndex).mod(leporellos.length)].id ;
      });
    }


    function onLeporellosFetched(json){

      for(var i=0; i<json.data.titles.length; i++){
        leporellos.push(new Leporello(json.data.ids[i], json.data.titles[i], json.data.descriptions[i], json.data.paths[i], json.data.pdf[i], json.data.thumb_1[i],json.data.thumb_2[i],json.data.thumb_3[i]));
      }

      if(leporellos.length != 0){
      changeDescription();
      updateLeporellos();
      }
    }


    function onMotivationsFetched(json){

      for(var i=0; i<json.data.ids.length; i++){
        motivations.push(new Motivation(json.data.ids[i], json.data.authors[i], json.data.positions[i], json.data.thumbs[i], json.data.descriptions[i]));
      }

      nextMotivation();

    }


    function onTagsFetched(json, onFinish){
      tags = [];
      for(var i=0; i<json.data.ids.length; i++){
        tags.push(new Tag('tag', json.data.ids[i], json.data.titles[i], json.data.descriptions[i], json.data.colors[i], json.data.cid[i]));
      }
      onTagsLoaded(onFinish);

    }

    function onLevelsFetched(json){
      for(var i=0; i<json.data.ids.length; i++){
        levels.push(new Tag('level', json.data.ids[i], json.data.titles[i], json.data.descriptions[i]));
      }
      onLevelsLoaded();

    }


    function onTypesFetched(json){
      for(var i=0; i<json.data.ids.length; i++){
        types.push(new Tag('type', json.data.ids[i], json.data.titles[i], json.data.descriptions[i]));
      }
      onTypesLoaded();

    }


    function saveTagState(){

      if(!getTag(activeTag)){
        return;
      }
      var hex = "";
      var val = "";

         $( "#color-templates-te option:selected" ).each(function() {
           hex += $( this ).attr('hex') + "";
           val += $( this ).val() + "";
         });

         getTag(activeTag).color = hex;
         getTag(activeTag).colorID = val;


         $('#' + activeTag).css('background-color', hex);
         $('#' + activeTag).attr('cid', val);

    }


    function onTagsLoaded(onFinish){
      $('#tagarea').empty();

      if(tags.length == 0){
          $('#tagarea').append('<li id="-1" title="keine" class="tag" style="cursor:default;background:#fff;color:#000">keine</li>');
      }




      for(var i=0; i<tags.length; i++){
        if(tagsClickable){
          $('#tagarea').append(createClickableTagElement(tags[i], i));
        }else{
          $('#tagarea').append(createTagElement(tags[i], i));
        }

      }

      tagsLoaded();

      if(typeof(onFinish) != "undefined"){
        onFinish();
      }

      if(typeof(onTagsAppear) != "undefined"){
        onTagsAppear();
      }
    }



    function onLevelsLoaded(){
      for(var i=0; i<levels.length; i++){
        if(tagsClickable){
          $('#tagarea_level').append(createClickableTagElement(levels[i], i));
        }else{
          $('#tagarea_level').append(createTagElement(levels[i], i));
        }
      }

      tagsLoaded();

      if(typeof(onLevelsAppear) != "undefined"){
        onLevelsAppear();
      }
    }


    function onTypesLoaded(){
      for(var i=0; i<types.length; i++){
        if(tagsClickable){
          $('#tagarea_type').append(createClickableTagElement(types[i], i));
        }else{
          $('#tagarea_type').append(createTagElement(types[i], i));
        }
      }

      tagsLoaded();

      if(typeof(onTypesAppear) != "undefined"){
        onTypesAppear();
      }
    }

    function openTagEditor(id){
      cid = 1;

      if(activeTag!=''){
      $("#" + activeTag).css('border', 'none');
      }
      activeTag = id;


      switchTag(id);


      var tag = getTag(activeTag);



      $('.tag-editor-label').html(tag.title);

      $(".color-templates").val($('#'+id).attr('cid'));

      $('#color-picker').attr('tag', id);
    }



    function createTagElement(tag, index){
      var out = '<li id="%ID%" cid="%CID%" title="%DESCRIPTION%" class="tag disabled" style="cursor:default;background:%BG%">%TITLE%</li>';
      out = out.replaceAll('%ID%', tag.id);
      out = out.replaceAll('%TITLE%', tag.title);
      out = out.replaceAll('%DESCRIPTION%', tag.description);
      out = out.replaceAll('%BG%', tag.color);
      out = out.replaceAll('%CID%', tag.colorID);

      return out;
    }


    function createClickableTagElement(tag, index){
      var out = '<li id="%ID%" cid="%CID%" title="%DESCRIPTION%" onclick="openTagEditor(\'%ID%\')" class="tag disabled clickable" style="background:%BG%">%TITLE%</li>';
      out = out.replaceAll('%ID%', tag.id);
      out = out.replaceAll('%TITLE%', tag.title);
      out = out.replaceAll('%DESCRIPTION%', tag.description);
      out = out.replaceAll('%BG%', tag.color);
      out = out.replaceAll('%CID%', tag.colorID);

      return out;
    }

    function swapLeft(){
      fadeOut("browse-arrowLeft", 50);
      fadeOut("browse-arrowRight", 50);

      setTimeout(function(){
        leporelloIndex = (leporelloIndex + 1).mod(leporellos.length);
        changeDescription();
        moveToMiddle("browse-item-right");
        moveToMiddle("browse-item-left");
        setTimeout(function(){ switchItems('moveLeft'); }, 450);
      }, 50);
    }

    function swapRight(){
      fadeOut("browse-arrowLeft", 50);
      fadeOut("browse-arrowRight", 50);
      leporelloIndex = (leporelloIndex - 1).mod(leporellos.length);
      changeDescription();
      moveToMiddle("browse-item-right");
      moveToMiddle("browse-item-left");

      setTimeout(function(){ switchItems('moveRight'); }, 450);
    }

    function switchItems(direction){

      switch(direction){
        case 'moveLeft':
        $("#browse-item-left").css('opacity', '1');
        break;

        case 'moveRight':
        $("#browse-item-right").css('opacity', '1');
        break;

      }
      fadeIn("browse-arrowLeft", 200, 0.7);
      fadeIn("browse-arrowRight", 200, 0.7);
      updateLeporellos(resetItems);
    }


    function resetItems(){

       $("#browse-item-left").transition({
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, -15deg) scale(0.9, 1, 1) translate3d(-105%, -9%, 0px)'
      }, 500);

        $("#browse-item-middle").transition({
        transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg) scale(1, 1, 1) translate3d(0px, 0px, 0px)'
      }, 500);

         $("#browse-item-right").transition({
         transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 15deg) scale(0.9, 1, 1) translate3d(105%, -9%, 0px)'
       }, 500);

          $("#browse-item-right-new").transition({
         transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 15deg) scale(0.9, 1, 1) translate3d(105%, -9%, 0px)'
       }, 500);

      $("#browse-item-right-new").css('opacity', '0');

    }


    function shrink(element){
        $("#"+element).transition({transform: 'scale(0.0, 1, 1)'  });
    }

    function shrinkRev(element){
        $("#"+element).transition({transform: 'scale(1, 1, 1)'  });
    }

    function moveLeft(element){
      $("#"+element).animate({
        marginLeft: '-100px'
      });
    }



    function fadeOut(element, speed){
      $("#"+element).animate({
        opacity: '0'
      }, speed);
    }

    function fadeIn(element, speed, to){
      if(!to){
        to = 1;
      }
       $("#"+element).animate({
        opacity: to
      }, speed);
    }

    function moveToLeft(element){


       $("#"+element).transition({transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, -15deg) scale(0.9, 1, 1) translate3d(-105%, -9%, 0px)'  });

    }


    function moveToRight(element){
        $("#"+element).transition({ transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 15deg) scale(0.9, 1, 1) translate3d(105%, -9%, 0px)' });
    }

    function moveToMiddle(element){
        $("#"+element).transition({transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg) scale(1, 1, 1) translate3d(0px, 0px, 0px)'  });
    }


    function removePrintGuide(){
        document.getElementById('print-guide').style.display = "none";
    }





      function hidePrintGuide(){
        $("#print-guide").animate({
            opacity: '0'
            },{duration: 250, complete: removePrintGuide});
      }

        function showPrintGuide(docID, title, preview_url, path){
          $('#print-guide-iframe').attr('src','pages/print-guide/add.html');

          $('#print-guide-iframe').on("load", function() {
            document.getElementById('print-guide').style.display = "block";
            document.getElementById('print-guide-iframe').contentWindow.postMessage({key:"SEND_ID", value: docID}, "*");
            document.getElementById('print-guide-iframe').contentWindow.postMessage({key:"SEND_TITLE", value: title}, "*");
            document.getElementById('print-guide-iframe').contentWindow.postMessage({key:"SEND_PATH", value: path}, "*");
            document.getElementById('print-guide-iframe').contentWindow.postMessage({key:"SEND_PREVIEW", value: preview_url}, "*");
            $("#print-guide").animate({
             opacity: '0.98'
             },{duration: 250});
          });



      }


      function showDocumentExplorer(){
        $('#print-guide-iframe').attr('src','pages/document-explorer/index.html');

        $('#print-guide-iframe').on("load", function() {
          document.getElementById('print-guide').style.display = "block";
          $("#print-guide").animate({
           opacity: '0.98'
           },{duration: 250});
        });



    }
