#!/usr/bin/env python
# -*- coding: utf-8 -*-
from . import api
from flask import render_template, url_for

@api.route('/qr')
def get_qr():
	return render_template('qrcode.html')