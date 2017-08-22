class CiError(SyntaxError):

	def __init__(self, info):
		buf = []
		buf.append(info)
		SyntaxError.__init__(self, ''.join(buf).encode('utf-8'))


#pretreat error
class PretreatError(CiError):

	def __init__(self, info):
		buf = []
		buf.append(info)
		CiError.__init__(self, ''.join(buf).encode('utf-8'))


#clearup error
class ClearupError(CiError):

	def __init__(self, info):
		buf = []
		buf.append(info)
		CiError.__init__(self, ''.join(buf).encode('utf-8'))


#package error
class PackageError(CiError):

	def __init__(self, info):
		buf = []
		buf.append(info)
		CiError.__init__(self, ''.join(buf).encode('utf-8'))