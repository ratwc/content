if(document.cookie == "" || document.cookie == null){
  window.location.href = "index.html";
}
var userkey = document.cookie;
var color = ["#007bff","#28a745","#17a2b8","#ffc107","#dc3545","#343a40"];
var bg_color = ["#b8daff","#c3e6cb","#bee5eb","#ffeeba","#f5c6cb","#c6c8ca"];
var color_text = ["primary","success","info","warning","danger","dark"];
var colors = 0;
var username = "";
var used = "";
async function onload(){
  var ref = firebase.database().ref('User');
  await ref.once("value").then(function(snapshot){
    username = snapshot.child(userkey).child("username").val();;
    colors = snapshot.child(userkey).child("colors").val();
    used = snapshot.child(userkey).child("id_test").val();
  });
  var used_test = used.split(",");
  document.getElementById("town").innerHTML = username;
  document.getElementById("town").style.background = color[colors-1];
  document.body.style.background = bg_color[colors - 1];
  var know_ref = firebase.database().ref('Knowledge');
  var key = {};
  await know_ref.once("value").then(function(snapshot){
    key = snapshot.val();
  });
  var data = await Object.values(key);
  var allkey = await Object.keys(key);
  await setTable(data, allkey, used_test);
}
function setTable(data, allkey, used_test){
  var show = "";
  for (var i = 0; i < data.length; i++) {
    show += "<tr class='show_know' id='test" + (i + 1) + "' onclick='goto_know("
    + '"' + allkey[i] + '"'
    + ")'>"
    +  "<td>#" + data[i]['ID'] + "</td>"
    +  "<td>" + data[i]['Title'] + "</td>"
    +  "<td>" + data[i]['Lesson'] + "</td>"
    +  "<td>" + data[i]['Subject'] + "</td>"
    + "</tr>";
  }
  document.getElementById("show_knowledge").innerHTML = show;
  if(used_test[0] != ""){
    for (var i = 0; i < used_test.length; i++) {
      document.getElementById("test" + used_test[i]).style.background = bg_color[5];
    }
  }
}
function goto_know(know_key){
  send_key = '"' + know_key + '"';
  window.location.href = "knowledge.html?test=" + know_key;
}
function logout(){
  document.cookie = "";
  location.reload();
}
function Back(){
  window.history.back();
}
