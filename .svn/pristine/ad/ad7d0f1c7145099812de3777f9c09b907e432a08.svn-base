 # -*- coding: utf-8 -*-
import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
	DEBUG = True
	TESTING = True
	SECRET_KEY = 'yumao'
	USERNAME = 'admin'
	PASSWORD = 'admin'


class DevelopmentConfig(Config):
	DEBUG = True

	@classmethod
	def init_app(cls, app):
		pass


class BuiployConfig(Config):

	#sql设置,暂时使用sqlite
	# SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db/buiploy.sqlite')
	# SQLALCHEMY_TRACK_MODIFICATIONS = True
	# SQLALCHEMY_COMMIT_ON_TEARDOWN = True

	#session 过期时间
	PERMANENT_SESSION_LIFETIME = timedelta(minutes=30)

	@classmethod
	def init_app(cls, app):
		pass


config = {
	'DevelopmentConfig': DevelopmentConfig,
	'BuiployConfig': BuiployConfig,
}