/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

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
				  socket.on('retrieve-usernames-response', function(json) {
							updateUsersDropdown(json.data);
							});
				  

				  // Add event handler for dropdown
				  $("#start-conversation-select").on( "change", function(event) {startConversation(event.currentTarget.value)} );
				  
				  });


// Create a new conversation window
function startConversation(username) {
	if(username == "") {
		return;
	}
	console.log("conversation with %s started", username);
}


// unpacks usernames and updates the select box
function updateUsersDropdown(data) {
	var optionlist = "<option></option>";
	for( elem in data ) {
		optionlist += "<option>" + data[elem].username + "</option>";
	}
	$("#start-conversation-select").html(optionlist);
}

function doDebug() {
	console.log("button pressed");
	
	//var socket = io.connect();
	
	//socket.emit('event1','button pressed');
	socket.emit('retrieve-usernames');
}

