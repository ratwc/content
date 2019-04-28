async function saveData(){
  document.getElementById("warning").style.display = "none";
  document.getElementById("success").style.display = "none";
  document.getElementById("fill").style.display = "none";
  document.getElementById("exist").style.display = "none";
  document.getElementById("spin").style.display = "inline-block";
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var repassword = document.getElementById('repassword').value;
    if(username == null || password == null || repassword == null ||
       username == "" || password == "" || repassword == ""){
          document.getElementById("fill").style.display = "block";
    }
    else if(password == repassword){
      if(await check_username(username) == 0){
        document.getElementById("exist").style.display = "block";
      }
      else {
        await insertData(username, password);
        document.getElementById("success").style.display = "block";
        setTimeout(function(){
          window.history.back();
        }, 800);
      }
    }
    else{
      document.getElementById("warning").style.display = "block";
    }
    document.getElementById("spin").style.display = "none";
}
async function insertData(username, password){ // save data to firebase
  var firebaseRef = firebase.database().ref('User');
  await firebaseRef.push({
    username: username,
    password: password,
    colors: 1,
    level: 1, //default
    attack: 0, //default
    shield: 1, //default
    money: 11, //default
    token: 3, //default
    id_test: "" //default
  });
  console.log("Success");
}
async function check_username(username){
  var ref = firebase.database().ref('User');
  var key = {};
  await ref.once("value").then(function(snapshot){
    key = snapshot.val();
  });
  var data = Object.values(key);
  for (var i = 0; i < data.length; i++) {
    if(data[i]['username'] == username){
      return 0; // if exist
    }
  }
  return 1; // if not exist
}
