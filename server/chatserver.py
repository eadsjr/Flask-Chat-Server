
# Copyright 2015 Jason Randolph Eads - all rights reserved

import json
from flask import Flask
from flask.ext.socketio import SocketIO, emit


app = Flask("ChatServer", static_url_path='', static_folder='../public_html/')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


socketio = SocketIO(app)

#@app.route('/')

#@socketio.on('connect', '/chatserver')



@socketio.on('retrieve-usernames')
def retrieve_usernames():
	print 'usernames requested'
	usernames = None
	with open('usernames.json', 'r') as file:
		usernames = json.loads(file.read())
		emit('retrieve-usernames-response', {'data':usernames})
		print 'sent usernames'


@socketio.on('connect')
def connect():
	emit('connected', {'data':'Connected to ChatServer'})
	print 'connected to client'

@socketio.on('disconnect')
def disconnect():
	print 'disconnected from client'


@socketio.on('event1')
def handle_event(message):
	print 'recieved message "%s"' % message

#@socketio.on('')


if __name__ == '__main__':
	#app.run()
	#socketio.run(app, port=int(os.environ.get("PORT",9001)))
	socketio.run(app)
