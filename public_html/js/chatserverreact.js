/*
 * Copyright 2015 Jason Randolph Eads - all rights reserved
 */

// React classes define buildable components
var Conversation = React.createClass({
    render: function() {
        return (
                <div className="conversation">
                    //header
                    <div className="conversationHeader">
                        <h2 className="conversationHeaderParticipant">
                            {this.props.participant}
                        </h2>
                        <button className="conversationHeaderExit" id={this.props.exitButtonId}>X</button>
                    </div>

                    //body
                    <div className="conversationBody">
                        <Message author="jimmy" text="I gotta go..." />
                        //
                    </div>
                    
                    //Footer
                    <form className="conversationForm" id={this.props.id} >
                        <input className="conversationInput" type="text" />
                    </form>
            
                    Rats, it won't render

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

React.render(
			 <Conversation participant="jimmy" />
			 <Message author="jimmy" text="I gotta go..." />,
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