/* 
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

//alert("yo!");
console.log("running");

// Communicate with backend via websocket
var socket = '';
$(document).ready(function(){
    console.log("document is ready");
    namespace = '';
    
    socket = io.connect();
    socket.on('connected', function(msg) {
        console.log(msg);
        console.log('Whee!');
        socket.emit('event1', {data: 'Client connected!'});
    });
    socket.on('message', function(msg) {
        console.log(msg);
    });
    socket.on('special', function(msg) {
        console.log(msg);
    });
    socket.on('retrieve-usernames-response', function(data) {
        console.log(data);
    });
    
    //console.log(socket);
});


function doDebug() {
    console.log("button pressed");
    
    //var socket = io.connect();
    
    //socket.emit('event1','button pressed');
    //socket.emit('event1','button pressed');
    socket.emit('retrieve-usernames');
}

