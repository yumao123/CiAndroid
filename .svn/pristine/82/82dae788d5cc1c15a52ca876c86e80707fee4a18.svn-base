from . import auth
from flask import render_template, flash, request, redirect, url_for, session

from .forms import LoginForm
from models.users import Users
from app.ext.login_manager import login_user, logout_user


@auth.route('/login', methods=['GET', 'POST'])
def login():
	form = LoginForm()
	if request.method == 'POST':
		if form.validate_on_submit():
			user = Users.check_user_exists(form.username.data)
			print user
			if user is not None and user.verify_password(form.password.data):
				login_user(user, form.remenber_me.data)
				return redirect(url_for('buiploy.index'))
		else:
			flash('Username or password is requied', 'error')
			return render_template('auth/login.html', form= form)
		flash('Invalid username or password')
	return render_template('auth/login.html', form= form)


@auth.route('/logout', methods=['GET', 'POST'])
def logout():
	form = LoginForm()
	logout_user()
	flash('You have been logged out!', 'success')
	return redirect(url_for('auth.login'))