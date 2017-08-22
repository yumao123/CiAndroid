# -*- coding: utf-8 -*-
from app import create_app
from flask.ext.script import Manager, Shell

app = create_app('BuiployConfig', 'application.cfg')
#manager = Manager(app)

'''
@manager.command
def profile(length=25, profile_dir=None):
	from werkzeug.contrib.profiler import ProfilerMiddleware
	app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=[length],
									  profile_dir=profile_dir)

	# change flask {{ test }}
	app.jinja_env.variable_start_string = '{{ '
	app.jinja_env.variable_end_string = ' }}'
	app.run(host='0.0.0.0', port=3000)
'''

if __name__ == '__main__':
	# manager.run()
	app.run(host='0.0.0.0', port=4000, threaded=True)
	

