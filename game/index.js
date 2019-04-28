async function checkAuth(){
    document.getElementById("warning").style.display = "none";
    document.getElementById("success").style.display = "none";
    document.getElementById("fill").style.display = "none";
    document.getElementById("spin").style.display = "inline-block";
    var username = document.getElementById("username").value.toLowerCase();
    var password = document.getElementById("password").value;
    var userkey = "";
    var ref = firebase.database().ref('User');
    var key = {};
    await ref.once("value").then(function(snapshot){
      key = snapshot.val();
    });
    var data = await Object.values(key);
    var allkey = await Object.keys(key);
    var complete = await check_user_and_pass(data, username, password);
    if(username == null || password == null ||
       username == "" || password == ""){
          document.getElementById("fill").style.display = "block";
    }
    else if(complete == -1){
      document.getElementById("warning").style.display = "block";
    }
    else{
      document.getElementById("success").style.display = "block";
      userkey = allkey[complete];
      localStorage.setItem("userkey", userkey);
      //document.cookie = userkey;
      setTimeout(function(){
        window.location.href = "main.html?key=" + userkey;
      }, 800);
      //console.log(userkey);
    }
    document.getElementById("spin").style.display = "none";
}
function check_user_and_pass(data, username, password){
  for (var i = 0; i < data.length; i++) {
    if(data[i]['username'].toLowerCase() == username && data[i]['password'] == password){
      return i; // if correct
    }
  }
  return -1; // if incorrect
}
