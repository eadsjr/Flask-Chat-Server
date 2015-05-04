/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

// React classes define buildable components

var ConversationTable = React.createClass({
										 render: function() {
										 return (
												 <table>
													 <tr>
														<td>
															<Conversation participant="Jimmy" />
														</td>
														<td>
															<Conversation participant="Alucard" />
														</td>
														<td>
															<Conversation participant="Bernard" />
														</td>
													</tr>
													<tr>
														<td>
															<Conversation participant="Joel" />
														</td>
													</tr>
												 </table>
												 );
										  }
										  });


var Conversation = React.createClass({
    render: function() {
        return (
                <div className="conversation">
                    <div className="conversationHeader">
                        <div className="conversationHeaderParticipant">
                            {this.props.participant}
                        </div>
                        <div className="conversationHeaderExitButton" id={this.props.exitButtonId}>X</div>
                    </div>
                    <div className="conversationBody">
						<div className="conversationBodyMessages">
							<Message author="jimmy" text="I gotta go..." />
						</div>
						<div className="conversationBodyInput" id={this.props.id} >
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
                    <h3 className="messageAuthor">{this.props.author}</h3>
                    {this.props.text}
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
                    <button className="conversationHeaderExit" id={this.props.exitButtonId}>X</button>
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