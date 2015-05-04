/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

// React classes define buildable components
var Conversation = React.createClass({
    render: function() {
        return (
                <div className="conversation">
                    <div className="conversationHeader">
                        <h2 className="conversationHeaderParticipant">
                            {this.props.participant}
                        </h2>
                        <div className="conversationHeaderExitButton" id={this.props.exitButtonId}>X</div>
                    </div>
                    <div className="conversationBody">
                        <Message author="jimmy" text="I gotta go..." />
                    </div>
                    <form className="conversationForm" id={this.props.id} >
                        <input className="conversationInput" type="text" />
                    </form>
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
React.render(
			 <Conversation participant="jimmy" />,
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