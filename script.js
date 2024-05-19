//const { connect } = require("mqtt");

var ID_std = document.getElementById("correct");
var deleteButton = document.getElementById("delete");
var btn = document.querySelectorAll(".r > div");
var inp = document.querySelector("input");
var IDElement = document.getElementById("ID_Display");
var pointElement = document.getElementById("Point_Display");
var danceElement = document.getElementById("DancePoint");

client = new Paho.MQTT.Client("broker.emqx.io", Number(8084), "/wss");
client.startTrace();

function onConnectclickDiv() {
    //client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    console.log("onConnect-clickDiv");
    client.subscribe("recycle-start");
    message = new Paho.MQTT.Message("1");
    message.destinationName = "recycle-start";
    client.send(message);
    window.location.href = 'page3.html';
}

function onConnectpoint() {
    client.onConnectionLost = onConnectionLostpoint;
    client.onMessageArrived = onMessageArrived;
    console.log("onConnect-point");
    client.subscribe("recycle-point");
}

function onConnectID() {
    //client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    console.log("onConnect-ID");
    client.subscribe("recycle-ID");
    message = new Paho.MQTT.Message(inp.value);
    message.destinationName = "recycle-ID";
    client.send(message);
    window.location.href = 'page5.html';
}

function NotPlayGame(){
    //client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.subscribe("recycle-end");
    message = new Paho.MQTT.Message("1");
    message.destinationName = "recycle-end";
    for (let i=0;i<=5;i++){
        client.send(message);
    }
    window.location.href = 'end.html';
}

function onFailure(errorMessage) {
    console.log('Connection failed:', errorMessage.errorMessage);
}

function onConnectionLostpoint(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    client.connect({onSuccess:onConnectpoint,
        useSSL: true});
}

function onConnectionLostdance(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    client.connect({onSuccess:onConnect,
        useSSL: true});
}

function onMessageArrived(message) {
    var PointID = 0;
    console.log("onMessageArrived:"+message.payloadString);
    document.getElementById('dataValue').textContent = message.payloadString;
    PointID = message.payloadString;
    console.log(PointID);
    localStorage.setItem('PointID', PointID); 
}

function onMessageArrivedDancePoint(message) {
    var DancePoint = 0;
    console.log("onMessageArrived:"+message.payloadString);
    document.getElementById('DancePointValue').textContent = message.payloadString;
    DancePoint = message.payloadString;
    console.log(DancePoint);
    //danceElement.innerHTML = DancePoint; 
    localStorage.setItem('DancePointAll', DancePoint); 
}

function page2(){
    document.getElementById("clickDiv").addEventListener("click", function() {
        client.connect({
            onSuccess:onConnectclickDiv,
            useSSL: true,
            //onFailure: onFailure,
            //reconnect: true
        });
        console.log("attempting to connect...")
    });
}

function page3(){
    document.addEventListener('DOMContentLoaded', function() {
        client.connect({onSuccess:onConnectpoint,
            useSSL: true});
        console.log("attempting to connect...")
    });
}

function page4(){
    var ID = 0;
    btn.forEach(val=>{
        val.addEventListener("click",()=>{
            inp.value += val.innerText;
            ID = inp.value;
            localStorage.setItem('ID1', ID); 
            console.log(ID);
        })
    });

    deleteButton.addEventListener("click", function() {
        inp.value = inp.value.slice(0,-1);
    });

    ID_std.addEventListener("click",function(){
        client.connect({
            onSuccess:onConnectID,
            useSSL: true,
        });
        console.log("attempting to connect...");
    });
}

function page5(){
    document.getElementById("NotPlayGame").addEventListener("click",function(){
        client.connect({onSuccess:NotPlayGame,
            useSSL: true});
        console.log("attempting to connect...")
    });
    var storedID = localStorage.getItem('ID1');
    var storedPoint = localStorage.getItem('PointID');
    console.log(storedID);
    if (storedID) {
        IDElement.innerHTML = storedID; 
        pointElement.innerHTML = storedPoint;
    }
    
    const image = [
        "suffer/pic1.png",
        "suffer/pic2.png",
        "suffer/pic3.png",
        "suffer/pic4.png",
        "suffer/pic5.png",
        "suffer/pic6.png",
        "suffer/pic7.png",
        "suffer/pic8.png",
        "suffer/pic9.png",
        "suffer/pic10.png"
      ]
      const randomImage = image[Math.floor(image.length * Math.random())]
      
      const stuff = document.getElementById("stuff")
      const stuffStyles = window.getComputedStyle(stuff)
      const width = stuffStyles.getPropertyValue('width').slice(0, -2)
      const height = stuffStyles.getPropertyValue('height').slice(0, -2)
      const top = Math.floor(Math.random() * height)
      const left = Math.floor(Math.random() * width)
      
      // Ensure no-repeat is styled in your CSS
      stuff.style.backgroundImage = `url(${randomImage})`
      stuff.style.backgroundPosition = `center center`
      stuff.style.backgroundRepeat = 'no-repeat'
      //stuff.style.backgroundAttachment = 'fixed';
      stuff.style.backgroundSize = '100% auto';
}

function onConnect(){
    client.onMessageArrived = onMessageArrivedDancePoint;
    console.log("onConnect-dance-point");
    client.subscribe("recycle-dance-point");
    console.log("connect already");
}


function onConnectdance(pose) {
    client.onConnectionLost = onConnectionLostdance;
    client.onMessageArrived = onMessageArrived;
    client.connect();
    console.log("onConnect-dance");
    client.subscribe("recycle-dance");
    console.log("connect already");
    message = new Paho.MQTT.Message(pose);
    message.destinationName = "recycle-dance";
    //for(let i=0;i<=1;i++){
        client.send(message);
        console.log("send..",message);
    //}
    //window.location.href = 'page5.html';
}

function onconnectDanceStart(){
    //client.onConnectionLost = onConnectionLost;
    //client.onMessageArrived = onMessageArrived;
    client.onMessageArrived = onMessageArrivedDancePoint;
    //client.subscribe("recycle-dance-start");console.log("connect-dance-start");
    //client.subscribe("recycle-dance-point");console.log("connect-dance-point");
    //client.subscribe("recycle-dance");console.log("connect-dance");
    console.log("connect already");
    message = new Paho.MQTT.Message("1");
    message.destinationName = "recycle-dance-start";
    //for(let i=0;i<=1;i++){
    client.send(message);
    console.log("send..",message);
    window.location.href='page7.html';
}

function onconnectDancePoint(){
    //client.onConnectionLost = onConnectionLost;
    //client.onMessageArrived = onMessageArrivedDancePoint;
    console.log("connect-dance-point");
    client.subscribe("recycle-dance-point");
    console.log("connect already");
}


function CallMQTTAfterDelay(delay, pose) {
    client.connect({onSuccess:onConnectdance,
        useSSL:true});
    setTimeout(function() {
        console.log("set time out");
        onConnectdance(pose);
    }, delay * 1000);
} 
 function page6(){
    document.getElementById("BtnDanceGame").addEventListener("click",function(){
        client.connect({onSuccess:onconnectDanceStart,
            useSSL: true});
        console.log("connect-dancestart.")
    });
    
}

function page7(){
    //document.addEventListener('DOMContentLoaded', function() {
        //client.connect({onSuccess:onConnect,
        //    useSSL: true});
        //console.log("attempting to connect...")
        var video = document.getElementById("VideoGameDance");
        video.addEventListener("ended",function(){
            window.location.href = "page8.html";
        });
    //});
    CallMQTTAfterDelay(6,"clap");
    CallMQTTAfterDelay(7,"clap");
    CallMQTTAfterDelay(9,"clap");
    CallMQTTAfterDelay(11,"clap");
    CallMQTTAfterDelay(13,"two");
    CallMQTTAfterDelay(14,"two");
    CallMQTTAfterDelay(20,"two");
    CallMQTTAfterDelay(21,"clap");
    CallMQTTAfterDelay(23,"two");
    CallMQTTAfterDelay(25,"clap");
    CallMQTTAfterDelay(26,"hold");
    CallMQTTAfterDelay(32,"clap");
    CallMQTTAfterDelay(34,"two");
    CallMQTTAfterDelay(35,"clap");
    CallMQTTAfterDelay(38,"two");
    CallMQTTAfterDelay(39,"clap");
}


const redirectDelay = 30; 
let countdownTimer; 

function startCountdown() {
  let count = redirectDelay;

  countdownTimer = setInterval(() => {
    count--;
    
    if (count <= 0) {
      clearInterval(countdownTimer);
      window.location.href = 'home.html';
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(countdownTimer);
}

function repage(){
    document.addEventListener('click', startCountdown);

    let inactiveTimeout = setTimeout(startCountdown, 15000);

    document.addEventListener('mousemove', () => {
    clearTimeout(inactiveTimeout);
    resetCountdown();
    inactiveTimeout = setTimeout(startCountdown, 15000);
    });
}

function saveData(){
    client.connect({onSuccess:onconnectpageend,
        useSSL: true});
    let timer = 10;
    setInterval(() => {
        timer--;
        
        if (timer <= 0) {
          clearInterval(timer);
          window.location.href = 'home.html';
        }
      }, 1000);
}

function onconnectpageend(){
    client.subscribe("recycle-end");
    message = new Paho.MQTT.Message("1");
    message.destinationName = "recycle-end";
    client.send(message);
}


function page8(){
    var storedID = localStorage.getItem('ID1');
    var storedPoint = localStorage.getItem('PointID');
    var storedDance = localStorage.getItem('DancePointAll');
    var AllScore = Number(storedDance)+Number(storedPoint);
    console.log(storedPoint);
    console.log(storedDance);
    console.log(AllScore);
    
    if (storedID) {
        IDElement.innerHTML = storedID; 
        pointElement.innerHTML = AllScore;
    }
    
    const image = [
        "suffer/pic1.png",
        "suffer/pic2.png",
        "suffer/pic3.png",
        "suffer/pic4.png",
        "suffer/pic5.png",
        "suffer/pic6.png",
        "suffer/pic7.png",
        "suffer/pic8.png",
        "suffer/pic9.png",
        "suffer/pic10.png"
      ]
      const randomImage = image[Math.floor(image.length * Math.random())]
      
      const stuff = document.getElementById("stuff")
      const stuffStyles = window.getComputedStyle(stuff)
      const width = stuffStyles.getPropertyValue('width').slice(0, -2)
      const height = stuffStyles.getPropertyValue('height').slice(0, -2)
      const top = Math.floor(Math.random() * height)
      const left = Math.floor(Math.random() * width)
      
      // Ensure no-repeat is styled in your CSS
      stuff.style.backgroundImage = `url(${randomImage})`
      stuff.style.backgroundPosition = `center center`
      stuff.style.backgroundRepeat = 'no-repeat'
      //stuff.style.backgroundAttachment = 'fixed';
      stuff.style.backgroundSize = '100% auto';
      window.onload = fetchData;
}

function fetchData() {
    fetch('https://script.google.com/macros/s/AKfycbxERssK_OqmDeBSCds6Htv7q9BaXGrMJ4vYhjeGJUf9H0sVq8d_GfAMEoJoYX9sDrQ/exec?read')
      .then(response => response.json())
      .then(data => {
        console.log(data); 
        displayData([data]);
      })
  }
  
  function displayData(data) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = data;
  }
  