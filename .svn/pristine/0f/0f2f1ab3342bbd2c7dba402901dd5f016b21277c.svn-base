from . import buiploy
from flask import render_template

from app.ext.login_manager import login_required
from models.system import Menu
from app.ext.backstage_manager import get_template


@buiploy.route('/')
@login_required
def index():
	menu_info = Menu.get_menu()
	return render_template('main.html', menus= menu_info)


@buiploy.route('/ci/<module>', methods=['GET'])
@login_required
def render_page(module):
	current_module = module
	return render_template(get_template(current_module, 'system'))


