/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

// React classes define buildable components

var ConversationTable = React.createClass({
										 render: function() {
//										  //										  this.str = "\"console.log(\"jimmy\")\"";
//										  this.props.str = "console.log()";
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
													</tr>
												 </table>
												 );
										  }
										  });


var Conversation = React.createClass({
    render: function() {
		//$(".conversationHeaderExitButton").on("change",function(event){changeName(event.currentTarget.value)})
//		this.textinputid = this.props.id + "-text";
//		this.exitbuttonfunc = "closeButtonFunction("+ this.props.id +")";
        return (
                <div className="conversation" id={this.props.id}>
                    <div className="conversationHeader">
                        <div className="conversationHeaderParticipant">
                            {this.props.participant}
                        </div>
						<div className="conversationHeaderExitButton" onClick={this.props.closeFunc}>X</div>
                    </div>
                    <div className="conversationBody">
						<div className="conversationBodyMessages">
							<Message author="Jimmy" text="I gotta go..." />
							<Message author="Jimmy" text="The quick brown fox jumps over the lazy dog." />
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

//			 <Message author="jimmy" text="I gotta go..." />,
//			 <Conversation participant="jimmy" />
//			 <Conversation participant="Alucard" />,
//										  <Conversation participant="jimmy"></Conversation>
//										  <Conversation participant="Alucard"></Conversation>,

React.render(
			 <ConversationTable />,
			 document.getElementById('content')
);


function closeButtonFunction(conversationId) {
	console.log("inside function closeButtonFunction");
	console.log(conversationId);
}

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