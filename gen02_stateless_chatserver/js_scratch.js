// Response from registration message
socket.on('registered', function(data) {
		  console.log('server: registered');
		  if( !data['success'] ) {
		  // Clear text field
		  alert("That name is not available");
		  $('#name-select-text-input')[0].value = ''
		  }
		  else {
		  myName = data['name'];
		  console.log("name changed to %s", myName);
		  remoteUsers = data['users'];
		  }
		  });

// Recieve a chat message from the server
socket.on('chat-message', function(data) {
		  console.log('server: chat-message');
		  recieveChatMessage(data["name"],data["text"]);
		  });

// updateUsers(data["names"],data["ids"]);

// Broadcast update for a remote user name change
socket.on('name-changed', function(data) {
		  console.log('server: name-changed');
		  updateUser(data["oldName"],data["newName"]);
		  })

// Broadcast update for a dropped remote user
socket.on('remove-user', function(data) {
		  console.log('server: remove-user');
		  removeUser(data["name"]);
		  })
