
from models import db_engine, Base
from models.enterprise import *
from models.system import *
from models.users import *

def create_all(eng):
	Base.metadata.create_all(eng)


if __name__ == '__main__':

	create_all(db_engine)