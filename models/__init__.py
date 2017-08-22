from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

import os
from build_script.config import DB_PATH

class LazyConnect:

	db_session = None

	@classmethod
	def get_session(cls):

		if cls.db_session is None:
			path = DB_PATH
			engine = create_engine('sqlite:///' + os.path.join(path, 'buiploy.sqlite'))
			cls.db_session = sessionmaker(bind=engine)
		return cls.db_session, engine



def orm_paginate(orm_query, page, per_page):
    offset  = (page - 1) * per_page
    tail    = page * per_page
    return orm_query.all()[offset:tail]



db_session, db_engine = LazyConnect.get_session()
Base = declarative_base()