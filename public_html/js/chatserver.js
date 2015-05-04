/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

// TODO: Current the pattern of using Username as conversation ID allows for multiple elements to end up with the same id. This should be rectified with something, like a counter.



// React classes define buildable components

var ConversationTable = React.createClass({
	render: function() {
	return (
		 <table>
			 <tr>
				<td>
		 <Conversation participant="Jimmy" id="Jimmy" />
				</td>
				<td>
					<Conversation participant="Alucard" id="Alucard" />
				</td>
				<td>
					<Conversation participant="Bernard" id="Bernard" />
				</td>
			</tr>
			<tr>
				<td>
					<Conversation participant="Joel" id="Joel" />
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
							<Message author="Jimmy" text="I gotta go..." />
							<Message author="Jimmy" text="The quick brown fox jumps over the lazy dog." />
							<Message author="Death" text="There is nothing more to say." />
						</div>
						<div className="conversationBodyInput" id={this.textinputid} >
							<input className="conversationBodyInputText" type="text" />
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
					<span className="message-author">{this.props.author}: </span>
					<span className="message-text"> {this.props.text}</span>
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
				  
				  // Request usernames for dropdown
				  socket.emit('retrieve-usernames');
				  
				  // Add event handler for dropdown
				  $("#start-conversation-select").on( "change", function(event) {startConversation(event.currentTarget.value)} );
				  
				  // Add event handler for Name change
				  $("#name-select-text-input").on("change",function(event){changeName(event.currentTarget.value)})
				  
				  
				  
				  });


// Change user's name
function changeName(name) {
	console.log("name changed to %s", name);
}

// Create a new conversation window
function startConversation(username) {
	if(username == "") {
		return;
	}
	console.log("conversation with %s started", username);
	//	$("#content > table");
	
	//	var rows = $("#content > table").children().children();
	//	var tdElems = $("#content > table").children().children().children();
	
	
	// If there is an empty space available, use it
	var emptySpace = $("td.empty").first();
	if( emptySpace.length ) {
		emptySpace.removeClass("empty");
		React.render(
					 <Conversation participant={username} id={username} />,
					 emptySpace[0]
					 );
	}
	else {
		console.log("Maximum number of conversations active.");
	}
	
	// TODO: Dynamically expand with additional rows
	
	//	var tdElemsCount = $("#content td").length;
	////	var tdCount = tdElems.length;
	//	var conversations = $("#content .conversation");
	//
	//	if( tdElemsCount === conversations.length ) {
	//		var tableCol = Math.floor(tdElemsCount % 3);
	//		var tableRow = Math.floor(tdElemsCount / 3);
	//
	//	}
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
	
	socket.emit('event1','button pressed');
}