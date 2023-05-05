
function checkAccess(onFinish){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var result = JSON.parse(this.responseText);
      var permission = false
      if(result.data.admin == 'true'){
        permission = true;
      }
      onFinish(permission);
    }
  };
  xhttp.open("GET", "api/access.php?method=allowed", true);
  xhttp.send();

}
