/*
 Copyright 2015 Jason Randolph Eads
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// TODO: This version does not make much use of React's primary function... To conform, use React properties instead of JQuery

// TODO: The React components need to be broken down further and logically decoupled

// TODO: STYLE: Break up into multiple files and require()

// TODO: STYLE: seperate network-active functions from non-network functions


/*
	Outgoing Message Signatures:
 
	socket.emit('register-name', oldName, newName);
	socket.emit('chat-message',  myName, recipientName, text);
	socket.emit('name-confirm',  myName, session);
 */

var myName = null;
var remoteUsers = [];

// React classes define buildable components

var ConversationTable = React.createClass({
	render: function() {
	return (
		 <table>
			<tr>
				<td className="empty"></td>
				<td className="empty"></td>
				<td className="empty"></td>
			</tr>
			<tr>
				<td className="empty"></td>
				<td className="empty"></td>
				<td className="empty"></td>
			</tr>
			<tr>
				<td className="empty"></td>
				<td className="empty"></td>
				<td className="empty"></td>
			</tr>
		 </table>
		 );
	}
});

var Conversation = React.createClass({
									 
	// Close the conversation.
	// TODO: reshuffle conversations to keep them organized.
	// ALT: Replace empty space with empty box to fill table
	close: function(){
		// Mark the parent as empty so it can be reused
		this.getDOMNode().parentNode.classList.add("empty");
		this.getDOMNode().remove();
	},
	// Send message on enter
	keypress: function(event) {
		if(event.key == "Enter") {
		 var message = event.target.value;
		 event.target.value = "";
	 
		 // TODO: clean this up.
		 var messageList = event.target.parentNode.parentNode.firstChild;
	 
		 // TODO: improve style
		 var div = document.createElement("div");
		 div.style.hidden = "true";
		 React.render(
					  <Message author={myName} text={message} />,
					  div
					  );
		 messageList.appendChild( div.firstChild );
		 div.remove;
		 
		 sendChatMessage(this.props.remoteUser, message);
		}
	},
	// Render a conversation
	render: function() {
        return (
				<div className="conversation" id={this.props.remoteUser}>
                    <div className="conversationHeader">
						<div className="conversationHeaderExitButton" onClick={this.close}>X</div>
                        <div className="conversationHeaderParticipant">
                            {this.props.remoteUser}
                        </div>
                    </div>
                    <div className="conversationBody">
						<div className="conversationBodyMessages">
						</div>
						<div className="conversationBodyInput" >
							<input className="conversationBodyInputText" type="text" onKeyDown={this.keypress} />
						</div>
                    </div>
                </div>
        );
    }
});

var Message = React.createClass({
    render: function() {
        return (
                <div className="message">
					<span className="message-author">{this.props.author}</span>
					<span className="message-text">: {this.props.text}</span>
                </div>
        );
    }
});

var socket = null;
$(document).ready(function(){
				  
				  // Add event handler for dropdown
				  $("#start-conversation-select").on( "change", function(event) {
													 startConversation(event.target.value)
													 } );
				  
				  // Add event handler for Name change
				  $("#name-select-text-input").on("change",function(event){changeName(event.currentTarget.value)})
				  
				  
				  /* Server callbacks */
				  
				  socket = io.connect();
				  
				  // Successful connect
				  socket.on('connected', function() {
							console.log('server: connected');
							
							// If name was registered, attempt to reclaim
							if(myName) {
								console.log("TODO: reclaim name");
								//TODO: reclaim name
							}
							});
				  
				  // Response from registration message
				  socket.on('registered', function(data) {
							console.log('server: registered');
							if( !data['success'] ) {
								// Clear text field
								console.log("That name is not available: %s", myName);
								alert("That name is not available");
								$('#name-select-text-input')[0].value = ''
							}
							else {
								myName = data['name'];
								console.log("name changed to %s", myName);
								updateUsers(data['users'])
							}
							});
				  
				  // Recieve a chat message from the server
				  socket.on('chat-message', function(data) {
							console.log('server: chat-message');
							recieveChatMessage(data["sender"],data["recipient"],data["text"]);
							});
				  
				  
				  // Broadcast update for user list
				  socket.on('users-update',function(data) {
							console.log('server: users-update');
							dropUsers(data["users"])
							})
				  
				  // Broadcast update for a remote user name change
				  socket.on('name-changed', function(data) {
							console.log('server: name-changed');
							updateUser(data["oldName"],data["newName"]);
							})
				  
				  // Broadcast update for a new remote user
				  socket.on('new-user', function(data) {
							console.log('server: new-user');
							newUser(data["name"]);
							})
				  
				  // Broadcast update for a dropped remote user
//				  socket.on('remove-user', function(data) {
//							console.log('server: remove-user');
//							removeUser(data["name"]);
//							})
				  
				  // Broadcast request for name
				  socket.on('get-name', function(session) {
							console.log('server: get-name');
							
							if(myName) {
								console.log('sending ' + myName + ' and ' + session );
								socket.emit('name-confirm',myName,session);
							}
							})
				  
				  /* Initialize */
				  
				  React.render(
							   <ConversationTable />,
							   document.getElementById('content')
							   );
});

// Change user's name
function changeName( newName ) {
	var oldName = myName;
	
	//TODO: security review - user sourced data inserted as HTML
	$(".message-author").filter(":contains('" + oldName + "')").html(name);
	
	socket.emit('register-name', oldName, newName);
}

// Create a new conversation window - no network activity
function startConversation(remoteUser) {
	if(remoteUser === "" || !remoteUser) {
		return;
	}
	
	// If this conversation already exists, ignore
	if( $(".conversation[id='" + remoteUser + "']").length ) {
		console.log("conversation with " +remoteUser+ " already open");
		return;
	}
	
	// If there is an empty space available, use it
	var emptySpace = $("td.empty").first();
	if( emptySpace.length ) {
		emptySpace.removeClass("empty");
		React.render(
					 <Conversation remoteUser={remoteUser} />,
					 emptySpace[0]
					 );
	}
	else {
		console.log("Maximum number of conversations active.");
	}
	
	// TODO: Dynamically expand with additional rows
	
	//	var rows = $("#content > table").children().children();
	//	var tdElems = $("#content > table").children().children().children();
	
	//	var tdElemsCount = $("#content td").length;
	////	var tdCount = tdElems.length;
	//	var conversations = $("#content .conversation");
	//
	//	if( tdElemsCount === conversations.length ) {
	//		var tableCol = Math.floor(tdElemsCount % 3);
	//		var tableRow = Math.floor(tdElemsCount / 3);
	//
	//	}
	
	
	console.log("conversation with %s started", remoteUser);
}

function newUser( name ) {
	if( name == myName ) {
		return
	}
	console.log("New User: " + name)
	
	var option = document.createElement("option");
	option.setAttribute("data-remote-user",name);
	$(option).html(name);
	$("#start-conversation-select")[0].appendChild(option);
}

// Removes a user from the UI, gracefully
function removeUser( name ) {
	// remove them from dropdown
	$("option[data-chatid='" + user + "']").remove();
	
	// inform local user of disconnect
	recieveChatMessage(user, myName, "{ user was disconnected }")
}

// Update user name
function updateUser( oldName, newName ) {
	console.log('oldname: %s    ...  newName: %s    .... myName: %s', oldName,newName,myName)
	if( oldName == myName || newName == myName ) {
		return;
	}
	if( !oldName || !newName ) {
		console.log('input is undefined in update user!')
		return;
	}
	
	remoteUsers.splice(remoteUsers.indexOf(oldName), 1);
	remoteUsers.push(newName);
	
	//TODO: security review - user sourced data inserted as HTML
	console.log("User name change: " + oldName + "    new name:" + newName);
	$("option[data-remote-user='" + newName + "']").html(newName);
	
	// change conversation header
	$('#' + oldName + ' .conversationHeaderParticipant').html(newName);
	
	// change author on messages
	$('#' + oldName + ' .message-author').filter(":contains('" + oldName + "')").html(newName);
	
	// change convrsation id
	$('#' + oldName)[0].setAttribute('id',newName);
}

// Deletes any users that are no longer connected
// TODO: Consider expanding to fill in missing users
function dropUsers( names ) {
	
	// Primarily for detecting deletions, so skip this case
	if( names.length == remoteUsers.length || !remoteUsers.length) {
		return
	}
	
	var missing_names = [];
	var userSet = Set(remoteUsers)
	for(user in names) {
		// If there is a missing user
		if( !(userSet.prototype.has(user)) ) {
			removeUser(user);
		}
	}
}

// Populates the dropdown menu
function updateUsers( names ) {
	remoteUsers = [];
	var optionlist = "<option></option>";
	var i = 0;
	console.log('recieved names: ' + names);
	while( i < names.length ) {
		// Skip self
		if( names[i] == myName ) {
			i++;
			continue;
		}
		remoteUsers.concat(names[i]);
		optionlist += '<option data-remote-user="' + names[i] + '">' + names[i] + '</option>';
		i++;
	}
	$("#start-conversation-select").html(optionlist);
	console.log('updated user list and dropdown')
}

// TODO: REFACTOR: consider folding into caller
function sendChatMessage(recipientName, text) {
	console.log("sending message: " + text);
	socket.emit('chat-message',myName,recipientName,text);
}

function recieveChatMessage(sender, recipient, text) {
	// Ignore your own messages
	if( sender == myName ) {
		return;
	}
	// Ignore messages for other people
	if( recipient != myName ) {
		return;
	}
	
	var messageList = $("#" + sender + " .conversationBodyMessages")[0];

	// Start conversation if needed.
	if( !messageList || !(messageList.length) ) {
		startConversation(sender);
		messageList = $("#" + sender + " .conversationBodyMessages")[0];
	}
	
	// TODO: Clean up required - style
	// Instance message in view
	var div = document.createElement("div");
	div.style.hidden = "true";
	React.render(
				 <Message author={sender} text={text} />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	div.remove;
}