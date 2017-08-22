

def to_unicode(arg):
    if isinstance(arg, dict):
        for key, value in arg.items():
            if isinstance(value, str):
                arg[key] = unicode(value, 'utf-8')
    elif isinstance(arg, str):
        arg = unicode(arg, 'utf-8')
    return arg


