#!/usr/bin/env python
# -*- coding: utf-8 -*-
import threading, time, os, signal
from flask import Flask, request, make_response, jsonify
from build_script._script import getLog
from app.ext.util import to_unicode
import json

#任务列表
task_list = list()
#任务详情
task_proc_info = dict(task_restart= False, thread_exit= False)

app = Flask(__name__, instance_relative_config=True)

#进度条服务
@app.route('/api/get_process', methods=['GET', 'POST'])
def get_process():
	global task_list
	if len(task_list):
		if task_list[0]['task_type'] == 'packageupload':
			from build_script.globals import ci_globals
			progress = ci_globals.upload_progress
		else:
			progress = 100
	if request.method == 'GET':
		return make_response(
			jsonify(
				{
					"task_count": len(task_list),
					'task_name': len(task_list) and task_list[0]['task_name'] or None,
					"task_id":  len(task_list) and task_list[0]['task_id'] or None,
					"progress": len(task_list) and progress or 100,
					}),200
		)


#获取日志服务
@app.route('/api/get_log', methods=['GET', 'POST'])
def get_log():
	if request.method == 'POST':
		history_info = eval(request.data)
		log_info = getLog(history_info)
		return make_response(
			jsonify(
				{
					"log_info": log_info,
					}),200
		)


#获取日志服务
@app.route('/api/stop_package', methods=['GET', 'POST'])
def stop_package():
	if request.method == 'POST':
		from build_script.globals import ci_globals
		ci_globals.package_process_stop = True
		abort(404)



#打包服务
@app.route('/api/ask_for_build', methods=['GET', 'POST'])
def ask_for_build():
	global task_list
	if request.method == 'POST':
		request_args = json.loads(request.get_data())
		import uuid
		task_id = uuid.uuid1() 
		task = {
			'task_id': task_id,
			'task_type': 'package',
			'task_name': request_args['enterprise_name'],
			'task_info': request_args,
		}
		task_list.append(task)
	return make_response(jsonify({"result": 'success!', "task_id": task_id}), 200)

#缓存代码服务
@app.route('/api/cache_code', methods=['GET', 'POST'])
def cache_code():
	global task_list
	if request.method == 'POST':
		request_args = to_unicode(eval(request.data))
		#记录打包信息,且返回id
		from build_script.util.my_dict import toDict
		cache_info = toDict(request_args)
		
		from models.enterprise import RepositoryModule
		cache_id = RepositoryModule.add_repository(cache_info)
		#存入队列
		request_args['cache_id'] = cache_id
		import uuid
		task_id = uuid.uuid1() 
		task = {
			'task_id': task_id,
			'task_type': 'cachecode',
			'task_name': '缓存代码中...',
			'task_info': request_args,
		}
		task_list.append(task)

	return make_response(jsonify({"result": 'success!', 'task_id': task_id}), 200)


#上传安装包
@app.route('/api/upload_package', methods=['GET', 'POST'])
def upload_package():
	global task_list
	if request.method == 'POST':
		request_args = to_unicode(eval(request.data))
		#记录打包信息,且返回id
		from build_script.util.my_dict import toDict
		cache_info = toDict(request_args)
		
		#存入队列
		import uuid
		task_id = uuid.uuid1() 
		task = {
			'task_id': task_id,
			'task_type': 'packageupload',
			'task_name': '正在上传安装包...',
			'task_info': request_args,
		}
		task_list.append(task)

	return make_response(jsonify({"result": 'success!', 'task_id': task_id}), 200)



def task_thread():
	global task_list, task_proc_info

	while not task_proc_info['thread_exit']:
		if len(task_list):
			from build_script.exceptionhelpers import CiError
			from build_script._script import exec_task_for

			exec_task_for(task_list[0])
			del task_list[0]
		time.sleep(1)
			
'''
	
'''	
def env_init():

	from build_script import config as c
	init_folder_list = [c.PACKAGE_REPROSITORY, c.UPLOAD_REPROSITORY, c.LOCAL_CODE_REPERTORY, 
		c.LOCAL_LOGO_REPERTORY, c.LOG_DIR, c.DB_PATH
	]

	for folder in init_folder_list:
		try:
			os.makedirs(folder)
		except:
			continue


#处理ctrl+c,关闭线程
def handler(signum, frame):
	global task_proc_info
	task_proc_info['thread_exit'] = True
	exit()


if __name__ == '__main__':
	# 监控ctrl + c
	signal.signal(signal.SIGTERM, handler)
	signal.signal(signal.SIGINT, handler)

	env_init()

	th = threading.Thread(target= task_thread, args= ())
	th.start()

	#监控打包和返回进度缓存
	app.run(host='127.0.0.1', port=8003, threaded=True)


