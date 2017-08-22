from models import db_session, Base
from sqlalchemy import Column, String, Integer

class SystemModule(Base):

	__tablename__ = 'ci_tb_system'

	id 			= Column(Integer, primary_key = True)
	cid 		= Column(String(32))
	modal_id 	= Column(String(32))
	item_id 	= Column(String(32))
	item_name 	= Column(String(32))
	item_type 	= Column(String(16))
	item_class 	= Column(String(32))
	item_title 	= Column(String(32))
	item_info 	= Column(String(512))
	orderby 	= Column(Integer)

	def __repr__(self):
		return '<Item %r>' % self.item_name

	@classmethod
	def get_itemInfo(cls, item_name):
		item_info = {}
		#get item_info
		session = db_session()
		item_info = session.query(SystemModule).filter_by(item_name = item_name).first() and session.query(SystemModule).filter_by(item_name = item_name).first().item_info or None
		session.close()
		return item_info



class Menu(Base):

	__tablename__ = 'ci_tb_menu'

	id 			= Column(Integer, primary_key = True)
	menu_code 	= Column(String(8), unique=True)
	menu_name 	= Column(String(32), unique=True)
	parent_code = Column(String(8))
	cid 		= Column(String(32))
	url 		= Column(String(48))
	status 		= Column(Integer)
	orderby 	= Column(Integer)
	remark 		= Column(String(32))
	icon 		= Column(String(32))


	def __repr__(self):
		return '<Menu %r>' % self.menu_name


	@classmethod
	def insert_menu(cls, menu_info):
		session = db_session()
		if menu_info is not None:
			menu = Menu(menu_code= menu_info.menu_code, menu_name= menu_info.menu_name, parent_code= menu_info.parent_code, cid= menu_info.cid,
						url= menu_info.url, status= 1, orderby= menu_info.orderby, remark= menu_info.remark, icon= menu_info.icon
				)
			session.add(menu)
			session.commit()
		session.close()
		return True


	@classmethod
	def get_menu(cls):
		menu = []
		session = db_session()
		#get pnode menu_code
		pnodes = sorted(session.query(Menu).filter_by(parent_code = 'system', status = 1).all(), key = lambda menu: menu.orderby)
		#get node menu_code
		for pnode in pnodes:
			nodes = sorted(session.query(Menu).filter_by(parent_code = pnode.menu_code, status = 1).all(), key = lambda menu: menu.orderby)
			if nodes is not None:
				nodeInfo = cls.to_json(pnode)
				nodeInfo['cnode'] = []
				for node in nodes:
					if nodes is not None:
						nodeInfo['cnode'].append(cls.to_json(node))
				menu.append(nodeInfo)
		session.close()
		return menu


	@classmethod
	def to_json(cls, nodeInfo):
		return {
			'menu_name'	: nodeInfo.menu_name,
			'url'		: nodeInfo.url,
			'icon'		: nodeInfo.icon,
			'cid'		: nodeInfo.cid,
		}



