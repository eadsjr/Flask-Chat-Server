##
# Copyright 2015 Jason Randolph Eads - all rights reserved
##

import json
import uuid
from flask import Flask
from flask.ext.socketio import SocketIO, emit, join_room, leave_room


app = Flask("ChatServer", static_url_path='', static_folder='../public_html/')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))


socketio = SocketIO(app)

#@app.route('/')
#@socketio.on('connect', '/chatserver')


# User data stored as { PublicID:(Username,PrivateID,ConnectionRoom) }
# NOTE: should start empty in production
# TODO: move debug data to extenal file
# TODO: switch to using private ID as key.
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
	
	# generate IDs
	privateID = uuid.uuid1() # identifies sender
	publicID = uuid.uuid1() # identifies to other clients
	room = uuid.uuid1() # used to send to other clients
	
	join_room(room)
	users[publicID] = (name, privateID, room)
	
	print 'registered with public ID %s' % publicID
	
	emit('registered', privateID)
	emit('new-user',{'name':name, 'id':publicID},broadcast=True)
	print 'registration sent'


@socketio.on('retrieve-user-data')
def retrieve_usernames(senderID):
	print 'user data requested'
	names = []
	ids = []
	for pubID in users:
		if users[pubID][1] == senderID:
			continue
		names.append( (users[pubID][0]) )
		ids.append( pubID )
	emit('retrieve-user-data-response', {'names':names,'ids':ids})
	print 'user data sent'


#	with open('usernames.json', 'r') as file:
#		usernames = json.loads(file.read())
#		emit('retrieve-user-data-response', {'data':usernames})
#		print 'sent usernames'


@socketio.on('chat-message')
def handle_event(senderID, recipientID, text):
	print 'from %s to %s: %s' % (senderID, recipientID, text)
	room = users[recipientID][2]
	
#	if(room)

	#TODO: authentication - verify senderID and connection match

	#TODO: improve retrieval: scaling chokepoint
	publicID = None
	for pubID in users:
		if( users[pubID][1] == senderID ):
			publicID = pubID
			break
	emit('chat-message', {"id":publicID, "text":text}, broadcast=True)

@socketio.on('change-name')
def change_name(senderID, name):
	
	print('users %o' % users)
	
	#TODO: improve retrieval: scaling chokepoint
	publicID = None
	oldName = None
	for pubID in users:
		if( users[pubID][1] == senderID ):
			users[pubID] = (name, senderID, users[pubID][2])
			oldName = users[pubID][0]
			publicID = pubID
			break
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
