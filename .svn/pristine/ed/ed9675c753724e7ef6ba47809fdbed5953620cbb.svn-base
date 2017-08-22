from flask import render_template, url_for, make_response, request, \
					abort, redirect, g, session, flash

from functools import wraps
from flask import current_app


class LoginManager(object):
	
	def __init__(self, app= None):

		self.unauthorized_callback = None

		self.blueprint_login_views = {}
		
		if app is not None:
			self.init_app(app)

	def init_app(self, app):

		app.login_manager = self


	def unauthorized_handler(self, callback):

		self.unauthorized_callback = callback

	def unauthorized(self):

		if self.unauthorized_callback is not None:
			return self.unauthorized_callback()
		abort(401)


def login_required(func):
	@wraps(func)
	def decorated_view(*args, **kwargs):
		if 'user_id' in session:
			return func(*args, **kwargs)
		else:
			return current_app.login_manager.unauthorized()
	return decorated_view


def login_user(user, remenber=False, ):
	session['user_id'] = user.id
	session['user_name'] = user.username
	if remenber:
		session['remenber'] = 'set'
	return True


def logout_user():
	if 'user_id' in session:
		session.pop('user_id')

	if 'remenber' in session:
		session['remenber'] = 'clear'

	return True

