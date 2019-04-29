var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var userkey = temp[1];
if(userkey == "" || userkey == null){
  window.location.href = "index.html";
}
var color = ["#007bff","#28a745","#17a2b8","#ffc107","#dc3545","#343a40"];
var bg_color = ["#b8daff","#c3e6cb","#bee5eb","#ffeeba","#f5c6cb","#c6c8ca"];
var color_text = ["primary","success","info","warning","danger","dark"];
var colors = 0, show_attack = "", show_shield = "";
var username = "", money = 0, attack = 0;
var username_rival = "", key_rival = "", reval_all = [], rival_shield = 0, rival_money = 0, rival_level = 0;
var cost = 10;
async function onload(){
  var ref = firebase.database().ref('User');
  await ref.once("value").then(function(snapshot){
    username = snapshot.child(userkey).child("username").val();
    colors = snapshot.child(userkey).child("colors").val();
    attack = snapshot.child(userkey).child("attack").val();
    money = snapshot.child(userkey).child("money").val();
    /*--------------------------------------------------------*/
    if(username_rival != ""){
      rival_money = snapshot.child(key_rival).child("money").val();
      rival_shield = snapshot.child(key_rival).child("shield").val();
    }
  });
  document.getElementById("town").innerHTML = username;
  document.getElementById("town").style.background = color[colors-1];
  document.body.style.background = bg_color[colors - 1];
  show_attack = "";
  for (var i = 0; i < attack; i++) show_attack += "<i class='fas fa-bolt red'></i> ";
  document.getElementById("attack").innerHTML = (show_attack == "" ? "<h6 class='red'>Not enough attack point!</h6>" : show_attack);
  document.getElementById("new_rival").innerHTML = "<strong>Search new rival " + cost + "</strong> <i class='fas fa-coins coins'></i>";
  document.getElementById("new_rival").style.color = color[3];
  if(username_rival != ""){
    document.getElementById("show_name_rival").style.display = "block";
    document.getElementById("myAttack").style.display = "block";
    document.getElementById("name_rival").innerHTML = username_rival + " Town";
    document.getElementById("show_name_rival").style.color = color[colors-1];
    document.getElementById("show_name_rival").style.background = bg_color[colors-1];
    document.getElementById("show_name_rival").style.borderColor = color[colors-1];
    document.getElementById("rival_town").style.display = "inline-block";
    document.getElementById("rival_town").src = "level/" + rival_level + ".png";
    show_shield = "";
    for (var i = 0; i < rival_shield; i++) show_shield += "<i class='fas fa-shield-alt shield'></i>";
    document.getElementById("rival_shield").innerHTML = (show_shield == "" ? "" : show_shield);
    document.getElementById("rival_money").innerHTML = "<i class='fas fa-coins coins'></i>  " + numberWithCommas(rival_money);
  }
  else {
    random_rival();
  }
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
async function random_rival(){
  if(money >= cost || username_rival == ""){
    money -= cost;
    var ref = firebase.database().ref('User');
    await ref.once("value").then(function(snapshot){
      reval_all = snapshot.val();
    });
    var rival_all_key = await Object.keys(reval_all);
    do{
      var rand = rival_all_key[Math.floor(Math.random()*rival_all_key.length)];
    }while(userkey == rand);
    await ref.once("value").then(function(snapshot){
      username_rival = snapshot.child(rand).child("username").val();
      rival_level = snapshot.child(rand).child("level").val();
      rival_money = snapshot.child(rand).child("money").val();
      rival_shield = snapshot.child(rand).child("shield").val();
      key_rival = rand;
    });
    document.getElementById("spin-rival").style.display = "inline-block";
    document.getElementById("spin-rival").style.color = color[colors - 1];
    setTimeout(function(){
      document.getElementById("spin-rival").style.display = "none";
      onload();
    }, 800);
    update();
  }
  else {
    document.getElementById("new_rival").innerHTML = "Not enough money! <i class='fa fa-times' aria-hidden='true'></i>"
    document.getElementById("new_rival").style.color = color[4];
    document.getElementById("new_rival").style.background = bg_color[4];
    document.getElementById("new_rival").style.borderColor = color[4];
    setTimeout(async function(){
      document.getElementById("new_rival").innerHTML = "Finding Rival <i class='fas fa-skull-crossbones'></i>"
      document.getElementById("new_rival").innerHTML = "<strong>Search new rival " + cost + "</strong> <i class='fas fa-coins coins'></i>";
      document.getElementById("new_rival").style.color = color[3];
      document.getElementById("new_rival").style.background = bg_color[3];
      document.getElementById("new_rival").style.borderColor = color[3];
    }, 1200);
  }
}
function attack_rival() {
  if(rival_shield != 0 && attack != 0){
    rival_shield--;
    attack--;
    document.getElementById("show_rival").style.display = "block";
    document.getElementById("show_rival").innerHTML = "<strong>" + username_rival + " Shield -1</strong>";
    document.getElementById("show_rival").style.color = color[0];
    document.getElementById("show_rival").style.background = bg_color[0];
    document.getElementById("show_rival").style.borderColor = color[0];
    setTimeout(function(){
      document.getElementById("show_rival").style.display = "none";
    }, 2000);
  }
  else if(rival_money != 0 && attack != 0){
    attack--;
    var steal = Math.floor(Math.random()*80*rival_level + rival_level);
    if(steal < rival_money) money += steal;
    else money += rival_money;
    rival_money -= steal;
    if(rival_money - steal < 0) rival_money = 0;
    document.getElementById("show_rival").style.display = "block";
    document.getElementById("show_rival").innerHTML = "<strong>" + username_rival + " Coins -" + steal + "</strong>";
    document.getElementById("show_rival").style.color = color[3];
    document.getElementById("show_rival").style.background = bg_color[3];
    document.getElementById("show_rival").style.borderColor = color[3];
    setTimeout(function(){
      document.getElementById("show_rival").style.display = "none";
    }, 2000);
  }
  update();
}
async function update(){
  var ref = firebase.database().ref('User');
  await ref.child(key_rival).update({ money: rival_money, shield: rival_shield});
  await ref.child(userkey).update({ money: money, attack: attack});
  //console.log("update complete");
  onload();
}
function logout(){
  userkey = "";
  window.location.href = "rival.html?key=" + userkey;
}
function Back(){
  window.history.back();
}
