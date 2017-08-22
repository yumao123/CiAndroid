


class CiGlobals(object):

	__instance = None

	def __init__(self):
		self.build_log = None
		self.update_code_log = None
		self.upload_progress = None
		self.package_process_stop = False


	def __new__(cls,*args,**kwd):
		if CiGlobals.__instance is None:
			CiGlobals.__instance = object.__new__(cls,*args,**kwd)
		return CiGlobals.__instance

	def clear(self):
		self.build_log = None
		self.update_code_log = None	
		self.package_process_stop = False


ci_globals = CiGlobals()