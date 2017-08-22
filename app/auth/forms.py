from flask.ext.wtf import Form
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import Required, Length, Email, Regexp, EqualTo
from wtforms import ValidationError


class LoginForm(Form):

	username = StringField('username', validators=[Required()]) #, validators=[Required()]
	password = PasswordField('password', validators=[Required()])
	remenber_me = BooleanField('Remember Me')
	submit = SubmitField('Sign In')