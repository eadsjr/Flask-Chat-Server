/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

// TODO: Ensure DOM interactions play nice with React classes

// TODO: The React components need to be broken down further and logically decoupled

// TODO: Break up into multiple files and require()

// TODO: This version does not make much use of React's primary function... To conform, use React properties instead of JQuery

// TODO: at list selection time, multiple users with same name can cause an issue

// TODO: seperate network-active functions from non-network functions

var myName = "You";
var myId = null;
var myPublicId = null;
var otherUsers = [];


// React classes define buildable components

var ConversationTable = React.createClass({
	render: function() {
	return (
		 <table>
			 <tr>
				<td>
		 <Conversation participant="Jimmy" id="JimmysPubID" />
				</td>
				<td>
					<Conversation participant="Alucard" id="AlucardsPubID" />
				</td>
				<td>
					<Conversation participant="Bernard" id="BernardsPubID" />
				</td>
			</tr>
			<tr>
				<td>
					<Conversation participant="Joel" id="JoelsPubID" />
				</td>
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
	keypress: function(event) {
									 if(event.key == "Enter") {
										var message = event.target.value;
										event.target.value = "";
									 
										// TODO: clean this up.
										var messageList = event.target.parentNode.parentNode.firstChild;
									
									 
									 
									 var div = document.createElement("div");
									 div.style.hidden = "true";
										React.render(
													 <Message author={myName} text={message} />,
													 div
													 );
									 messageList.appendChild( div.firstChild );
									 
									 div.remove;
									 
									 sendChatMessage(message, this.props.id);
									 
//										console.log("sent message: " + message);
									 
//										console.log(event);
										
									 
									 }
//									 console.log("meh");
	},
									 
    render: function() {
		//$(".conversationHeaderExitButton").on("change",function(event){changeName(event.currentTarget.value)})
//		this.textinputid = this.props.id + "-text";
//		this.exitbuttonfunc = "closeButtonFunction("+ this.props.id +")";
									 //						<div className="conversationHeaderExitButton" onClick={this.props.closeFunc}>X</div>
//									 this.state.theid = this.props.id;
									 
									 //			{this.props.id}
        return (
				<div className="conversation" id={this.props.id}>
                    <div className="conversationHeader">
						<div className="conversationHeaderExitButton" onClick={this.close}>X</div>
                        <div className="conversationHeaderParticipant">
                            {this.props.participant}
                        </div>
                    </div>
                    <div className="conversationBody">
						<div className="conversationBodyMessages">
						</div>
						<div className="conversationBodyInput" id={this.textinputid} >
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

React.render(
			 <ConversationTable />,
			 document.getElementById('content')
);


/*
// React classes define buildable components

var Conversation = React.createClass({
    render: function() {
        return (
                <ConversationHeader />
                <ConversationBody />
                <ConversationForm />
                );
    }
});

var ConversationHeader = React.createClass({
    render: function() {
        return (
                <div className="conversationHeader">
                    <h2 className="conversationHeaderParticipant">
                        {this.props.participant}
                    </h2>
                    <button className="conversationHeaderExit" id={this.props.conversationId}>X</button>
                </div>
                );
    }
});

var ConversationBody = React.createClass({
    render: function() {
        return (
                <div className="conversationBody">
                    //
                </div>
                );
    }
});

var ConversationForm = React.createClass({
    render: function() {
        return (
                <form className="conversationForm" id={this.props.id>
                <input className="conversationInput" type="text" />
                );
    }
})

//*/


console.log("running");

var socket = null;
$(document).ready(function(){
				  console.log("document is ready");
				  
				  initializeDummyMessages();
				  
				  // Add event handler for dropdown
				  $("#start-conversation-select").on( "change", function(event) {
													 var name = event.target.value;
													 var chatid = event.target.children[event.target.selectedIndex].getAttribute("data-chatid")
													 startConversation(name, chatid)
													 } );
				  
				  // Add event handler for Name change
				  $("#name-select-text-input").on("change",function(event){changeName(event.currentTarget.value)})
				  
				  
				  /* Server callbacks */
				  
				  socket = io.connect();
				  
				  // Successful connect
				  socket.on('connected', function(data) {
							console.log("connected to server");
							});
				  
				  // Recieve a chat message from the server
				  socket.on('chat-message', function(data) {
							console.log('server: chat-message')
							console.log(data)
							recieveChatMessage(data["text"],data["id"],data["name"]);
							});
				  
				  // Updated list of remote users
				  socket.on('retrieve-user-data-response', function(data) {
							console.log('server: retrieve-user-data-response')
							updateUsers(data["names"],data["ids"]);
							});
				  
				  // Broadcast update for a remote user name change
				  socket.on('name-changed', function(data) {
							updateUser(data["name"],data["id"]);
							})
				  
				  // Broadcast update for a new remote user
				  socket.on('new-user', function(data) {
							newUser(data["name"],data["id"]);
							})
				  
				  // Response from successful registration
				  socket.on('registered', function(data) {
							myId = data['privateID'];
							myPublicId = data['publicID'];
							});
				  
				  
				  /* Initialize from server */
				  
				  // Register with chat server
				  socket.emit('register', myName);
				  
				  // Request usernames for dropdown
				  socket.emit('retrieve-user-data', myId);
				  
});



// Change user's name
// TODO: this will cause problems if your name is the same as someone else's
function changeName(name) {
	var oldName = myName;
	myName = name;
	
	//TODO: security review - user sourced data inserted as HTML
	$(".message-author").filter(":contains('" + oldName + "')").html(name);
	
	socket.emit('change-name', myId, name);
	
	console.log("name changed to %s", name);
}

function newUser( name, id ) {
	if( id == myPublicId ) {
		return
	}
	console.log("New User: " + id)
	
	var option = document.createElement("option");
	option.setAttribute("data-chatid",id);
	$(option).html(name);
	$("#start-conversation-select")[0].appendChild(option);
}

// Update user name
function updateUser( name, id) {
	if( id == myPublicId ) {
		return;
	}
	
	//TODO: security review - user sourced data inserted as HTML
	console.log("User updated: " + id);
	$("option[data-chatid='" + id + "']").html(name);
	
	// change conversation header
	var oldName = $('#' + id + ' .conversationHeaderParticipant').html();
	$('#' + id + ' .conversationHeaderParticipant').html(name);
	
	// change author on messages
	$('#' + id + ' .message-author').filter(":contains('" + oldName + "')").html(name);
	//$('#f12aad38-f340-11e4-aabf-3c15c2b9bb5c .message-author').filter(":contains('RileyD')")
}

// Create a new conversation window - no network activity
function startConversation(username,chatid) {
	if(username === "") {
		return;
	}
	
	// If this conversation already exists, ignore
	if( $(".conversation[id='" + chatid + "']").length ) {
		console.log("conversation with " +chatid+ " already open");
		return;
	}
	
	// If there is an empty space available, use it
	var emptySpace = $("td.empty").first();
	if( emptySpace.length ) {
		emptySpace.removeClass("empty");
		React.render(
					 <Conversation participant={username} id={chatid} />,
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
	
	
	console.log("conversation with %s started", chatid);
}

function updateUsers( names, ids ) {
	otherUsers = [];
	var optionlist = "<option></option>";
	var i = 0;
	while( i < names.length ) {
		// Skip self
		if( ids[i] == myPublicId ) {
			i++;
			continue;
		}
		otherUsers.concat({
						  name: names[i],
						  id: ids[i]});
//		console.log( 'id'  + ids[i] );
//		console.log( 'name'  + names[i] );
		optionlist += '<option data-chatid="' + ids[i] + '">' + names[i] + '</option>';
		i++;
	}
	$("#start-conversation-select").html(optionlist);
	console.log('updated user list and dropdown')
}

// TODO: consider folding into caller
function sendChatMessage(text, recipientID) {
	console.log("sending message: " + text);
	socket.emit('chat-message',myId,recipientID,text);
}

function recieveChatMessage(text, senderID, senderName) {
	if( senderID == myPublicId ) {
		return
	}
	
	var messageList = $("#" + senderID + " .conversationBodyMessages")[0];

	// Start conversation if needed.
	if( !messageList || !(messageList.length) ) {
		startConversation(senderName, senderID);
		messageList = $("#" + senderID + " .conversationBodyMessages")[0];
	}
	
	console.log("DEBUG")
	console.log(text)
	console.log(senderID)
	console.log(senderName)
	
	// TODO: Clean up required - style
	// Instance message in view
	var div = document.createElement("div");
	div.style.hidden = "true";
	React.render(
				 <Message author={senderName} text={text} />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	div.remove;
}

function doDebug() {
	console.log("button pressed");
	
	//var socket = io.connect();
	
	//socket.emit('debug','button pressed');
	
	var obj = {
		text: "hello",
		senderID:"XYZ",
		recipientID:"ABC"
	}
	
//	socket.emit('debug','button pressed');
	socket.emit('debug',obj);
}

// Dummy messages for example and debug value.
// TODO: Remove or relocate dummy text as needed
function initializeDummyMessages() {
	
	var div = document.createElement("div");
	div.style.hidden = "true";
	var messageList = $("#JimmysPubID .conversationBodyMessages")[0];
	
	React.render(
				 <Message author="Jimmy" text="Are Polysaccrides are bad for you?" />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	
	React.render(
				 <Message author="You" text="...what?" />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	React.render(
				 <Message author="Jimmy" text="nevermind..." />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	messageList = $("#AlucardsPubID .conversationBodyMessages")[0];
	
	React.render(
				 <Message author="You" text="Is it really you?" />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	React.render(
				 <Message author="You" text="Hello?" />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	
	messageList = $("#BernardsPubID .conversationBodyMessages")[0];
	
	React.render(
				 <Message author="Bernard" text="I had a dream last night." />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	React.render(
				 <Message author="Bernard" text="Isn't that interesting?" />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	
	
	React.render(
				 <Message author="Bernard" text="The quick brown fox jumps over the lazy dog." />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	
	messageList = $("#JoelsPubID .conversationBodyMessages")[0];
	
	
	React.render(
				 <Message author="Joel" text="Lorem ipsum dolor sit amet, quo labore temporibus dissentiet in, nibh option vidisse vel ut. Euismod denique at eos. Ea eam iriure legendos intellegat. Liber gubergren ei mei. Te sumo ferri nam, duo nonumy pertinacia ne, ne alii viris definitionem qui." />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	
	
	React.render(
				 <Message author="Joel" text="Doctus quaeque probatus nec ex, ut ludus munere democritum has. Labores albucius instructior eum in, ea erat dicta inani has, ei quo oblique suscipiantur comprehensam. Iisque vivendo probatus nec no, tota equidem habemus vel at, quo ei justo iisque. Nam adhuc lucilius persequeris ne, ei quis mazim denique pro. Postea option eligendi nam no, diceret ancillae consulatu ea mea, ad sed primis discere postulant. Mei id regione discere consulatu." />,
				 div
				 );
	messageList.appendChild( div.firstChild );
	
	
	div.remove;
}

