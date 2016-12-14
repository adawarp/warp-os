navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var peer = new Adawarp();
var myID = null;
var call;

var localStream;
var connectedCall;

var myID;
var partnerID;

var socket = io.connect('localhost:4222');

var acc = [90, 90];

window.onload = function(){
    displayMyCamera();
    peer.on('open', function(){
        document.getElementById("my-id").innerHTML = peer.id;
    });
    peer.login();
    let analogPad1 = new AnalogPad(document.querySelector('#controller'));
    analogPad1.subscribe(function(e){
        //console.log("analog1: ",e);
        acc[0] = e.x;
        acc[1] = e.y;
        socket.emit('servo', acc);
    });
}

peer.on('connection', function(conn) {
    document.getElementById("partnerID").innerHTML = conn.peer;
    conn.on('data', function(data){
        data = JSON.parse(data);
        //console.log(data);
        document.getElementById("receive_message").innerHTML = data;
        socket.emit('servo', data);
    });
});

peer.on('call', function(call){
    connectedCall = call;
    call.answer(localStream);

    call.on('stream', function(stream){
        document.getElementById("partnerVideo").src = URL.createObjectURL(stream);
    });
});

function displayMyCamera(){
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        localStream = stream;
        document.getElementById("myVideo").src = URL.createObjectURL(stream);
    }, function() { alert("Error!"); });
}