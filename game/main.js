var parameters = location.search.substring(1).split("&");
var temp = parameters[0].split("=");
var userkey = temp[1];
if(userkey == "" || userkey == null){
  window.location.href = "index.html";
}
var price_level = [111,311,711,1311,2111,3111,4311,5711,7311];
var level_shield = [1,1,2,2,2,3,3,3,4,4];
var level_attack = [4,4,5,5,5,6,6,6,7,7];
var color = ["#007bff","#28a745","#17a2b8","#ffc107","#dc3545","#343a40"];
var bg_color = ["#b8daff","#c3e6cb","#bee5eb","#ffeeba","#f5c6cb","#c6c8ca"];
var color_text = ["primary","success","info","warning","danger","dark"];
var username = "";
var level = 0, money = 0, shield = 0, attack = 0, token = 0, colors = 0;
var cost = 10;
async function onload(){
  //console.log(userkey);
  var ref = firebase.database().ref('User');
  await ref.once("value").then(function(snapshot){
    username = snapshot.child(userkey).child("username").val();
    level = snapshot.child(userkey).child("level").val();
    money = snapshot.child(userkey).child("money").val();
    shield = snapshot.child(userkey).child("shield").val();
    attack = snapshot.child(userkey).child("attack").val();
    token = snapshot.child(userkey).child("token").val();
    colors = snapshot.child(userkey).child("colors").val();
  });
  //console.log(key);
  changecolor(colors);
  if(level != 10) document.getElementById("next").innerHTML = "<h6>Upgrade " + price_level[level - 1] + " </h6><i class='fas fa-coins coins'></i>";
  else {
    document.getElementById("next").innerHTML = "<h6>Full Upgrade</h6>";
    document.getElementById("next").style.color = color[1];
    document.getElementById("next").style.background = bg_color[1];
    document.getElementById("next").style.borderColor = color[1];
  }
  document.getElementById("town").innerHTML = username;
  document.getElementById("level").innerHTML = "Level " + level + " ";
  document.getElementById("money").innerHTML = "Coins: "+ numberWithCommas(money) + " <i class='fas fa-coins coins'></i>";
  var show_shield = "";
  for (var i = 0; i < shield; i++) show_shield += "<i class='fas fa-shield-alt shield'></i>";
  document.getElementById("shield").innerHTML = "Shield: " + (show_shield == "" ? "<h6 class='red'>empty</h6>" : show_shield);
  var show_attack = "";
  for (var i = 0; i < attack; i++) show_attack += "<i class='fas fa-bolt red'></i>";
  document.getElementById("attack").innerHTML = "Attack: " + (show_attack == "" ? "<h6 class='red'>empty</h6>" : show_attack);
  document.getElementById("token").innerHTML = "Token: " + token + " <i class='fas fa-dice'></i>";

  document.getElementById("home-town").src = "level/" + level + ".png";
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function logout(){
  userkey = "";
  window.location.href = "main.html?key=" + userkey;
}
async function changecolor(number){
  document.getElementById("town").style.background = color[number-1];
  document.getElementById("spin_reward").style.color = color[number-1];
  document.getElementById("show_level").innerHTML =
   "<div class='rounded list-group-item-" + color_text[number-1] + " inspac-t-3 inspac-b-3'>"
    + "<i class='fas fa-angle-left'></i> "
    + "<h5 class='card-title spac-b-1' id='level'></h5>"
    + "<i class='fas fa-angle-right'></i>"
    + "</div>";
  document.getElementById("level").innerHTML = "Level " + level + " ";
  document.body.style.background = bg_color[number - 1];
  var ref = await firebase.database().ref('User');
  await ref.child(userkey).update({colors:number});
  document.getElementById('rival').style.background = bg_color[number-1];
  document.getElementById('rival').style.color = color[number-1];
  document.getElementById('rival').style.borderColor = color[number-1];
  //onload();
}
async function Getreward(){
  document.getElementById("show_reward").innerHTML = "";
  if(token != 0){
    var x = document.getElementById("reward_choice");
    if(x.style.display == "none") x.style.display = 'block';
    else  x.style.display = 'none';
  }
  else {
    document.getElementById("no_token").style.display = 'block';
    setTimeout(function(){
      document.getElementById("no_token").style.display = 'none';
    }, 1500);
  }
}
async function random_reward(){
  document.getElementById("reward_choice").style.display = 'none';
  document.getElementById("spin_reward").style.display = 'inline-block';
  var reward = await cal_reward();
  await setTimeout(function(){
    document.getElementById("spin_reward").style.display = 'none';
    if(reward[0] == 1){
        document.getElementById("show_reward").innerHTML = ""
        + "<div class='alert alert-warning'>"
        + "<i class='fas fa-coins coins'></i><strong> Get " + reward[1] + " Coins!</strong>"
        + "</div>";
        money += reward[1];
    }
    else if(reward[0] == 2){
        document.getElementById("show_reward").innerHTML = ""
        + "<div class='alert alert-danger'>"
        + "<i class='fas fa-bolt red'></i><strong> Get Attack!</strong>"
        + "</div>";
        attack = (attack > level_attack[level-1]) ? attack : attack + 1;
    }
    else if(reward[0] == 3){
        document.getElementById("show_reward").innerHTML = ""
        + "<div class='alert alert-primary'>"
        + "<i class='fas fa-shield-alt shield'></i><strong> Get Shield!</strong>"
        + "</div>";
        shield = (shield > level_shield[level-1]) ? shield : shield + 1;
    }
    else if(reward[0] == 4){
        document.getElementById("show_reward").innerHTML = ""
        + "<div class='alert alert-success'>"
        + "<i class='fas fa-dice'></i><strong> Get " + reward[1] + " Token!</strong>"
        + "</div>";
        token += reward[1];
    }
    else {
        document.getElementById("show_reward").innerHTML = ""
        + "<div class='alert alert-dark'>"
        + "<i class='far fa-smile'></i><strong> Get Nothing!</strong>"
        + "</div>";
    }
    token -= 1;
    if(token < 0) token = 0;
    Update(money, shield, attack, token);
  }, 1000);// 1 coins 2 attack 3 shield 4 token 5 empty
}
/*----------------------------------- Formular Reward ----------------------------------------------------*/
var weight = [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,3,3,4,5,5];
var weight_coins = [1,1,1,1,1,2,2,2,2,3,3,3,4,4,5];
async function cal_reward(){
  var type = weight[Math.floor(Math.random()*weight.length)]; // 1 coins 2 attack 3 shield 4 token 5 empty
  //console.log(type);
  if(type == 1){
    var type_coins = weight_coins[Math.floor(Math.random()*weight_coins.length)];
    var coins = Math.floor(Math.random()*20 + ((type_coins - 1)*20) + 1);
    return [1, coins * level];
  }
  else if(type == 4) return [4, Math.floor(Math.random()*5 + 1)];
  else return [type];
}
/*----------------------------------- Formular Reward ----------------------------------------------------*/
async function Update(money, shield, attack, token){
  var ref = firebase.database().ref('User');
  await ref.child(userkey).update({ money: money, shield: shield, attack: attack, token: token});
  //console.log("update complete");
  onload();
}
function next_level(){
  document.getElementById("show_reward").innerHTML = "";
  if(level != 10){
    if(money >= price_level[level - 1]){
      var x = document.getElementById("confirm");
      if(x.style.display == "none") x.style.display = 'block';
      else  x.style.display = 'none';
    }
    else {
      document.getElementById('enough_money').style.display = 'block';
      document.getElementById('enough_money').style.color = color[4];
      //document.getElementById('enough_money').style.background = bgcolor[colors-1];
      setTimeout(function(){
        document.getElementById('enough_money').style.display = 'none';
      }, 1500);
    }
  }
}
async function confirm_nextlevel(){
  if(money >= price_level[level - 1]){
    money -= price_level[level-1];
    level += 1;
    var ref = await firebase.database().ref('User');
    await ref.child(userkey).update({level: level, money: money});
    document.getElementById("level").innerText = 'Congraturations! to Level ' + level;
    setTimeout(async function(){
      await onload();
      document.getElementById("confirm").style.display = 'none';
    }, 1500);
  }
}
function Learning(){
  window.location.href = "learning.html?key=" + userkey;
}
function rival(){
  if(money < cost){
    document.getElementById("rival").innerHTML = "Not enough money! " + cost + " Coins <i class='fa fa-times' aria-hidden='true'></i>"
    document.getElementById("rival").style.color = color[4];
    document.getElementById("rival").style.background = bg_color[4];
    document.getElementById("rival").style.borderColor = color[4];
    setTimeout(async function(){
      document.getElementById("rival").innerHTML = "Finding Rival <i class='fas fa-skull-crossbones'></i>"
      document.getElementById("rival").style.color = color[colors-1];
      document.getElementById("rival").style.background = bg_color[colors-1];
      document.getElementById("rival").style.borderColor = color[colors-1];
    }, 1200);
  }
  else if(attack == 0){
    document.getElementById("rival").innerHTML = "Not enough attack point! <i class='fa fa-times' aria-hidden='true'></i>"
    document.getElementById("rival").style.color = color[4];
    document.getElementById("rival").style.background = bg_color[4];
    document.getElementById("rival").style.borderColor = color[4];
    setTimeout(async function(){
      document.getElementById("rival").innerHTML = "Finding Rival <i class='fas fa-skull-crossbones'></i>"
      document.getElementById("rival").style.color = color[colors-1];
      document.getElementById("rival").style.background = bg_color[colors-1];
      document.getElementById("rival").style.borderColor = color[colors-1];
    }, 1200);
  }
  else window.location.href = "rival.html?key=" + userkey;
}
