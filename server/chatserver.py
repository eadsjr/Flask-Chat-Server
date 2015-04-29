
# Copyright 2015 Jason Randolph Eads - all rights reserved


from flask import Flask


app = Flask("ChatServer")

@app.route('/')
def hello_world():
	return 'Hello World'


@app.route('/user')
def get_user():
	return ''


if __name__ == '__main__':
	app.run()