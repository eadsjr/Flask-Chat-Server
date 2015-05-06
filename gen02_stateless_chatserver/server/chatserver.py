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

from flask import Flask, copy_current_request_context
from threading import Timer
from flask.ext.socketio import SocketIO, emit
import random
import uuid

app = Flask("ChatServer", static_url_path='', static_folder='../public_html/')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))

socketio = SocketIO(app)

# Number of seconds to wait for client pings
REQUEST_TIMEOUT = 3.0

# These short-lived sessions exist for the duration of an event, <5 seconds
sessions = []

# client-bound message signatures:
#
#	emit('connected')
#	emit('registered',{'success':True, 'name':newName,'users':mySession})
#	emit('chat-message', {"sender": sender, "recipient":recipient, "text":text}, broadcast=True)
#	emit('new-user', {'name':newName}, broadcast=True)
#	emit('name-changed', {'name':newName}, broadcast=True)
#	emit('users-update', {'users':users}, broadcast=True)
#	emit('get-name', session, broadcast=True)

@socketio.on('register-name')
def register_for_chat( oldName, newName ):
	
	# Runs after, collects response from active connections
	@copy_current_request_context
	def register_for_chat_finish( oldName, newName, session ):
		
		print 'continuing registration for %s' % newName
		
		print 'sessions %s' % str(sessions)
		
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
					
					# Send user list update to others
					emit('users-update', {'users':users}, broadcast=True)
					
					emit('registered',{'success':False, 'name':oldName, 'users':users})
					return
		else:
			print 'ERROR: session not recovered in register_for_chat_finish'
			return
		
		# Send user list update to others
		users = mySession[1]
		emit('users-update', {'users':users}, broadcast=True)
		
		# Respond to registration
		emit('registered',{'success':True, 'name':newName, 'users':users})
		
		# Broadcast updated data to clients
		if(not oldName):
			emit('new-user', {'name':newName}, broadcast=True)
		else:
			emit('name-changed', {'oldName':oldName,'newName':newName}, broadcast=True)

		# Reclaim memory
		sessions.remove(mySession)
		
		print 'successfully registered %s' % newName
	# END register_for_chat_finish
	
	if(not oldName):
		print 'new registration for name %s' % newName
	else:
		print 'user %s requests name %s' % (oldName, newName)

	# initiate session, request all active clients
	session = uuid.uuid1()
	sessions.append([session,[]])
	emit('get-name', session, broadcast=True)
	
	# four second delay before calling register_for_chat_finish
	t = Timer(REQUEST_TIMEOUT, register_for_chat_finish, args=[oldName,newName, session])
	t.start()


# Relay for messages
@socketio.on('chat-message')
def handle_event(sender, recipient, text):
	print 'message: from %s to %s: %s' % (sender, recipient, text)
	emit('chat-message', {"sender": sender, "recipient":recipient, "text":text}, broadcast=True)

# Callback from a general attendance check
@socketio.on('name-confirm')
def confirm_name(name, session):
	# Add the user to the appopriate session
	print 'confirmation from %s' % name
	for s in sessions:
		if str(s[0]) == session:
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
	
	# Runs after, collects response from active connections
	@copy_current_request_context
	def disconnect_finish(session):
		print 'disconnected from client, active users refreshed'
	
		# Collect session
		mySession = None
		for s in sessions:
			if s[0] == session:
				mySession = s
				
				# Send user list update
				users = mySession[1]
				emit('users-update', {'users':users}, broadcast=True)
				
				#reclaim memory
				sessions.remove(mySession)
				
				break
	# END disconnect_finish

	print 'disconnected from client, updating users'
	
	# initiate session, request all active clients
	session = uuid.uuid1()
	sessions.append([session,[]])
	emit('get-name', session, broadcast=True)
	
	# after delay send updated
	t = Timer(REQUEST_TIMEOUT,disconnect_finish, args=[session])
	t.start()

# Run if not loaded as a module
if __name__ == '__main__':
	# TODO: change port?
	socketio.run(app)
