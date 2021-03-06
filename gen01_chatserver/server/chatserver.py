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

import json
import uuid
from flask import Flask
from flask.ext.socketio import SocketIO, emit, join_room, leave_room


app = Flask("ChatServer", static_url_path='', static_folder='../public_html/')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


socketio = SocketIO(app)

#@app.route('/')
#@socketio.on('connect', '/chatserver')

#TODO: Needs additional data sanitization!

#TODO: JSON file storage
#	with open('usernames.json', 'r') as file:
#		usernames = json.loads(file.read())
#		emit('retrieve-user-data-response', {'data':usernames})
#		print 'sent usernames'

# User data stored as { PublicID:(Username,PrivateID,ConnectionRoom) }
# NOTE: should start empty in production
# TODO: move debug data to extenal file
users = {
	"JimmysPubID":("Jimmy","JimmysPrivID","JimmysRoom"),
	"JoelsPubID":("Joel","JoelsPrivID","JoelsRoom"),
	"XaviersPubID":("Xavier","XaviersPrivID","XaviersRoom"),
	"RowansPubID":("Rowan","RowansPrivID","RowansRoom"),
	"AlbussPubID":("Albus Percival Wulfrick Dumbledore","AlbussPrivID","AlbussRoom"),
	"SourGrapessPubID":("SourGrapes","SourGrapessPrivID","SourGrapessRoom"),
	"BernardsPubID":("Bernard","BernardsPrivID","BernardsRoom"),
	"AlucardsPubID":("Alucard","AlucardsPrivID","AlucardsRoom"),
}

@socketio.on('register')
def register_for_chat(name):
	print 'registration requested'
	
	# Type scrubbing
	name = str(name)
	
	# generate IDs
	privateID = str(uuid.uuid1()) # identifies sender
	publicID = str(uuid.uuid1()) # identifies to other clients
	room = str(uuid.uuid1()) # used to send to other clients
	
	join_room(room)
	users[publicID] = (name, privateID, room)
	
	print 'registered with public ID %s' % publicID
	
	emit('registered', {'privateID':privateID, 'publicID':publicID})
	emit('new-user',{'name':name, 'id':publicID},broadcast=True)
	print 'registration sent'


@socketio.on('retrieve-user-data')
def retrieve_usernames(senderID):
	print 'user data requested'
	
	
	#TODO: scaling shokepoint
	names = []
	ids = []
	for pubID in users:
		if users[pubID][1] == senderID:
			continue
		names.append( (users[pubID][0]) )
		ids.append( pubID )
	emit('retrieve-user-data-response', {'names':names,'ids':ids})
	print 'user data sent'




@socketio.on('chat-message')
def handle_event(senderID, recipientID, text):
	
	
	print 'from %s to %s: %s' % (senderID, recipientID, text)
	room = users[recipientID][2]
	
#	if(not room):
#		print "Error: "

	#TODO: authentication - verify senderID and connection match

	#TODO: improve retrieval: scaling chokepoint
	publicID = None
	name = None
	for pubID in users:
		if( users[pubID][1] == senderID ):
			publicID = pubID
			name = users[pubID][0]
			break
	emit('chat-message', {"name": name, "id":publicID, "text":text}, broadcast=True)


@socketio.on('change-name')
def change_name(senderID, name):
	
	#TODO: improve retrieval: scaling chokepoint
	publicID = None
	oldName = None
	for pubID in users:
		if( users[pubID][1] == senderID ):
			oldName = users[pubID][0]
			publicID = pubID
			users[pubID] = (name, senderID, users[pubID][2])
			break

	if(not oldName):
		print("Error: Name change failed - No existing entry")
		return

	emit('name-changed',{'name':name, 'id':publicID},broadcast=True)
	print 'user %s changed name to %s' % (oldName, name)


@socketio.on('connect')
def connect():
	emit('connected', {'data':'Connected to ChatServer'})
	print 'connected to client'


@socketio.on('disconnect')
def disconnect():
	print 'disconnected from client'


@socketio.on('debug')
def handle_event(message):
	print 'recieved debug message "%s"' % message

# Run if not loaded as a module
if __name__ == '__main__':
	# TODO: change port?
	socketio.run(app)
