from mydict import toDict

class Ensure:
    '''
    author: chenpengyu
    time:   2015-11-08
    arg:
    returns:
     
    '''
    def __init__(self, validate, paramType, doc=None):
        self.validate = validate
        self.paramType = paramType
        self.doc = doc

def do_ensure(Class):
    '''
    author: chenpengyu
    time:   2015-11-08
    arg:
    returns:
    
    '''
    def make_property(name, attribute):
        privateName = '__' + name
        def getter(self):
            return getattr(self, privateName)

        def setter(self, value):
            attribute.validate(name, value, attribute.paramType)
            setattr(self, privateName, value)

        return property(getter, setter, doc=attribute.doc)
    
    for name, attribute in Class.__dict__.items():
        if isinstance(attribute, Ensure):
            setattr(Class, name, make_property(name, attribute))

    return Class


def is_paramType(name, value, paramType):
    if (not isinstance(value, paramType)) | (not bool(value)):
        raise TypeError("{} must be of type {}".format(name, paramType))


def return_toDict(function):
    def wrapper(*args, **kw):
        ret = function(*args, **kw)
        if isinstance(ret, tuple):
            toDictTuple = tuple()
            for arg in ret:
                if isinstance(arg, dict):
                    toDictTuple = toDictTuple + (toDict(arg), )
                else:
                    toDictTuple = toDictTuple + (arg, )
            return toDictTuple
        else:
            return toDict(ret)
    return wrapper


