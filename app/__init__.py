from flask import request, abort, redirect, url_for
from app.ext.login_manager import LoginManager
from datetime import timedelta

login_manager = LoginManager()

build_info_list = []


def create_app(config_name, config_file):
	from flask import Flask
	app = Flask(__name__, instance_relative_config=True)

	from config import config
	app.config.from_object(config[config_name])
	app.config.from_pyfile(config_file, silent=True)

	config[config_name].init_app(app)
	
	#init login manager
	login_manager.init_app(app)
	
	from .auth import auth
	app.register_blueprint(auth, url_prefix='/auth')

	from .buiploy import buiploy
	app.register_blueprint(buiploy)

	#regist api_blueprint
	from .api import api
	app.register_blueprint(api, url_prefix='/api')

	#if not login, redirect to login page
	login_manager.unauthorized_handler(lambda: redirect(url_for('auth.login')))

	from werkzeug.contrib.profiler import ProfilerMiddleware

	# change flask {{ test }}
	app.jinja_env.variable_start_string = '{{ '
	app.jinja_env.variable_end_string = ' }}'

	return app


