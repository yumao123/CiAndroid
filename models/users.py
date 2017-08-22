from models import db_session, Base
from sqlalchemy import Column, String, Integer
from werkzeug.security import generate_password_hash, check_password_hash

class Role(Base):

    __tablename__ = 'ci_tb_role'

    id          = Column(Integer, primary_key = True)
    rolename    = Column(String(64), unique=True)

    def __repr__(self):
        return '<Role %r>' % self.rolename


class Users(Base):
    
    __tablename__ = 'ci_tb_users'

    id              = Column(Integer, primary_key = True)
    username        = Column(String(64), unique=True, index=True)
    password_hash   = Column(String(64))
    role_id         = Column(Integer)

    def __repr__(self):
        return '<Users %r>' % self.username

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @classmethod
    def check_user_exists(cls, username):
        session = db_session()
        try:
            user = session.query(Users).filter_by(username=username).first()
            return user
        except Exception, e:
            return '{0}:{1}'.format(type(e), e)
        finally:
            session.close()


if __name__ == '__main__':
    print generate_password_hash('admin')
    print check_password_hash(generate_password_hash('admin'), 'admin')
