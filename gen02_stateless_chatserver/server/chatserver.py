'''
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
 '''

from flask import Flask
from threading import Timer
from flask.ext.socketio import SocketIO, emit
import random
import uuid

app = Flask("ChatServer", static_url_path='', static_folder='../public_html/')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

socketio = SocketIO(app)

# These short-lived sessions exist for the duration of an event, <5 seconds
sessions = []

# outgoing message types:
#
#	emit('users-update', {'users':users}, broadcast=True)
#	emit('registered',{'success':True, 'name':newName,'users':mySession})
#	emit('chat-message', {"sender": sender, "recipient":recipient, "text":text}, broadcast=True)
#	emit('new-user', {'name':newName})
#	emit('name-changed', {'name':newName})


@socketio.on('register-name')
def register_for_chat( oldName, newName ):
	
	if(not oldName):
		print 'new registration for name %s' % newName
	else:
		print 'user %s requests name %s' % (oldName, newName)

	# initiate session
	session = uuid.uuid1()
	sessions.append([session,[]])
	socket.emit('get-name', session)
	
	Thread(4.0,register_for_chat_finish, args=[oldName,newName, session])

# Runs after delay, collects resulting active connections
def register_for_chat_finish( oldName, newName, session ):
	
	# Collect session
	mySession = None
	for s in sessions:
		if s[0] == session:
			mySession = s
			break
	
	# Check for name collision
	if mySession:
		for n in mySession:
			if n == newName:
				print 'name collision: registration failed'
				users = mySession[1]
				emit('registered',{'success':False, 'name':oldName, 'users':users})
				return

	# Respond to registration
	users = mySession[1]
	emit('registered',{'success':True, 'name':newName, 'users':users})

	# Broadcast updated data to clients
	if(not oldName):
		emit('new-user', {'name':newName}, broadcast=True)
	else:
		emit('name-changed', {'name':newName}, broadcast=True)

	# Reclaim memory
	sessions.remove(mySession)


# Relay for messages
@socketio.on('chat-message')
def handle_event(sender, recipient, text):
	print 'message: from %s to %s: %s' % (sender, recipient, text)
	emit('chat-message', {"sender": sender, "recipient":recipient, "text":text}, broadcast=True)

# Callback from a general attendance check
@socketio.on('name-confirm')
def confirm_name(name, session):
	for s in sessions:
		if s[0] == session:
			s[1].append(name)
			break

# Echo connection confirmation
@socketio.on('connect')
def connect():
	emit('connected')
	print 'connected to client'

# Check to see if client is gone, then inform clients of change
@socketio.on('disconnect')
def disconnect():
	print 'disconnected from client'
	
	# initiate session
	session = uuid.uuid1()
	sessions.append([session,[]])
	emit('get-name', session)


	Thread(4.0,disconnect_finish, args=[session])
	#TODO: scan for names and send out updates

def disconnect_finish(session):
	
	# Collect session
	mySession = None
	for s in sessions:
		if s[0] == session:
			mySession = s
			break

	# Send user list update
	users = mySession[1]
	emit('users-update', {'users':users}, broadcast=True)

	#reclaim memory
	sessions.remove(mySession)

# Run if not loaded as a module
if __name__ == '__main__':
	# TODO: change port?
	socketio.run(app)
