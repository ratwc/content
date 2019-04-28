var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var userkey = temp[1];
if(userkey == "" || userkey == null){
  window.location.href = "index.html";
}
var color = ["#007bff","#28a745","#17a2b8","#ffc107","#dc3545","#343a40"];
var bg_color = ["#b8daff","#c3e6cb","#bee5eb","#ffeeba","#f5c6cb","#c6c8ca"];
var color_text = ["primary","success","info","warning","danger","dark"];
var colors = 0, token = 0;
var username = "";
var id = 0, subject = "", lesson = "", title = "", info = 0, answer_keep = "", answer = new Array(20), direct = "";
var page = 1, choose_number = 0, sum_token = 0, reward_info = 0, reward_test = 0, count = 0;
var save_answer = new Array(20);
var useto = new Array(20), used = "";
async function onload(){
  var ref = firebase.database().ref('User');
  await ref.once("value").then(function(snapshot){
    username = snapshot.child(userkey).child("username").val();;
    token = snapshot.child(userkey).child("token").val();
    colors = snapshot.child(userkey).child("colors").val();
    used = snapshot.child(userkey).child("id_test").val();
  });
  document.getElementById("town").innerHTML = username;
  document.getElementById("town").style.background = color[colors-1];
  document.getElementById("get-started").style.background = color[colors-1];
  document.getElementById("get-started").style.borderColor = color[colors-1];
  document.body.style.background = bg_color[colors - 1];
  document.getElementById("info-test-content").style.display = "none";
  var url = location.href.match(/\?(.+)/)[1];
  var temp2 = window.location.href.split("=");
  var destination = temp2[2];
  var know_ref = firebase.database().ref('Knowledge');
  await know_ref.once("value").then(function(snapshot){
    id = snapshot.child(destination).child("ID").val();
    subject = snapshot.child(destination).child("Subject").val();
    lesson = snapshot.child(destination).child("Lesson").val();
    title =  snapshot.child(destination).child("Title").val();
    info =  snapshot.child(destination).child("Info").val();
    var point = snapshot.child(destination).child("Point").val();
    answer_keep = snapshot.child(destination).child("Answer").val();
    answer = answer_keep.split(',');
    document.getElementById('title').innerText= title;
    useto = used.split(",");
    var get_point = point.split(',');
    reward_info = parseInt(get_point[0]); reward_test = parseInt(get_point[1]);
    var sub = title.split(" ");
    for (var i = 0; i < sub.length; i++) {
      direct += sub[i];
    }
  });
  for (var i = 0; i <= info + answer.length; i++) {
    save_answer[i] = 0;
  }
  sum_token = info * reward_info;
  document.getElementById("control-p").style.display = "none";
  document.getElementById("control-p").style.background = bg_color[colors - 1];
  document.getElementById("control-n").style.background = bg_color[colors - 1];
  for (var i = 0; i < useto.length; i++) {
    if(parseInt(useto[i]) == id){
      sum_token = reward_test;
      reward_info = 0; reward_test = 0;
      break;
    }
  }
  content();
}
function check_finish() {
  if(count == answer.length) document.getElementById("finish").style.display = "block";
  else document.getElementById("finish").style.display = "none";
}
function change_page_previous() {
  page--
  if(page == 1){
    document.getElementById("control-p").style.display = "none";
  }
  else document.getElementById("control-n").style.display = "inline-block";
  content();
}
function change_page_next(){
  page++;
  if(page == info + answer.length){
    document.getElementById("control-n").style.display = "none";
  }
  else document.getElementById("control-p").style.display = "inline-block";
  content();
}
function content(){
  var show = "<img class='d-block w-100' src='Knowledge/" + subject + "/" + lesson + "/" + direct + "/" + page + ".png'>";
  document.getElementById("spin-check").style.display = "none";
  document.getElementById("spin-check").style.color = color[colors - 1];
  document.getElementById("show_content").innerHTML = show;
  document.getElementById('show_content').style.borderColor = color[colors - 1];
  for (var i = 1; i <= 4; i++) document.getElementById('choice-bg-' + i).innerHTML = "<strong>Answer " + i + ".</strong>";
  for (var i = 1; i <= 4; i++) document.getElementById('choice-bg-' + i).style.borderColor = color[colors - 1];
  for (var i = 1; i <= 4; i++) document.getElementById('choice-bg-' + i).style.background = "white";
  if(page > info) document.getElementById("choice").style.display = "block";
  else document.getElementById("choice").style.display = "none";
  document.getElementById("confirm").style.display = "none";
  if(save_answer[page] > 0) {
    if(save_answer[page] == parseInt(answer[page - info - 1])){
      document.getElementById("choice-bg-" + save_answer[page]).innerHTML = "<strong>Answer " + save_answer[page] + ". </strong><i class='fas fa-check'></i>";
      document.getElementById("choice-bg-" + save_answer[page]).style.background = bg_color[1];
    }
    else {
      document.getElementById("choice-bg-" + answer[page - info - 1]).innerHTML = "<strong>Answer " + answer[page - info - 1] + ". </strong><i class='fas fa-check'></i>";
      document.getElementById("choice-bg-" + save_answer[page]).innerHTML = "<strong>Answer " + save_answer[page] + ". </strong><i class='fa fa-times' aria-hidden='true'></i>";
      document.getElementById("choice-bg-" + save_answer[page]).style.background = bg_color[4];
      document.getElementById("choice-bg-" + answer[page - info - 1]).style.background = bg_color[1];
    }
  }
  check_finish();
}
function send_answer(number){
  if(save_answer[page] == 0){
    for (var i = 1; i <= 4; i++) {
      if(i == number) document.getElementById("choice-bg-" + i).style.background = bg_color[colors - 1];
      else document.getElementById("choice-bg-" + i).style.background = "white";
    }
    document.getElementById("confirm").style.display = "block";
    document.getElementById("confirm").style.borderColor = color[colors - 1];
    choose_number = number;
  }
}
function comfirm_answer(){
  document.getElementById("spin-check").style.display = "inline-block";
  setTimeout(function(){
    document.getElementById("spin-check").style.display = "none";
    document.getElementById("confirm").style.display = "none";
    if(choose_number == parseInt(answer[page - info - 1])){
      document.getElementById("choice-bg-" + choose_number).innerHTML = "<strong>Correct </strong><i class='fas fa-check'></i>";
      document.getElementById("choice-bg-" + choose_number).style.background = bg_color[1];
      sum_token += reward_test;
    }
    else {
      document.getElementById("choice-bg-" + choose_number).innerHTML = "<strong>Incorrect </strong><i class='fa fa-times' aria-hidden='true'></i>";
      document.getElementById("choice-bg-" + choose_number).style.background = bg_color[4];
      document.getElementById("choice-bg-" + answer[page - info - 1]).innerHTML = "<strong>Answer " + answer[page - info - 1] + ". </strong><i class='fas fa-check'></i>";
      document.getElementById("choice-bg-" + answer[page - info - 1]).style.background = bg_color[1];
      sum_token += reward_info;
    }
    save_answer[page] = choose_number;
    count++;
    check_finish();
  }, 800);
}
function logout(){
  userkey = "";
  window.location.href = "Knowledge.html?key=" + userkey;
}
function Back(){
  window.history.back();
}
function Get_started() {
  document.getElementById("get-started").style.display = "none";
  document.getElementById("info-test-content").style.display = "block";
  document.getElementById("back").style.display = "none";
  document.getElementById("logout").style.display = "none";
}
async function finish(){
  document.getElementById("info-test-content").style.display = "none";
  document.getElementById("token-reward").style.display = "block";
  document.getElementById("token-reward").style.background = color[colors-1];
  document.getElementById("token-reward").style.borderColor = color[colors-1];
  document.getElementById("finish").style.display = "none ";
  document.getElementById("token-reward").innerHTML = "<h5>Congraturations <i class='fas fa-rocket'></i><br>Get " + sum_token + " token <i class='fas fa-dice'></i></h5>";
  if(used == "") used = '' + id + '';
  else used += "," + id;
  setTimeout(async function(){
    var ref = firebase.database().ref('User');
    token += sum_token;
    await ref.child(userkey).update({token: token, id_test: used});
    window.location.href = "main.html?key=" + userkey;
  }, 2000);
}
