#!/usr/bin/env python
# -*- coding: utf-8 -*-

import chardet

class ConfigDict(dict):
    '''
    Simple dict but support access as x.y style.
    '''
    def __init__(self, names=(), values=(), **kw):
        super(ConfigDict, self).__init__(**kw)
        for k, v in zip(names, values):
            self[k] = v

    def __getattr__(self, key):
        try:
            return self[key]
        except KeyError:
            raise AttributeError(r"'ConfigDict' object has no attribute '%s'" % key)

    def __setattr__(self, key, value):
        self[key] = value

def toDict(d):
    # try:
    D = ConfigDict()
    for k, v in d.items():
        if isinstance(v, dict):
            D[k] = toDict(v)
        else:
            D[k] = v
    return D
    # except:
    #     return False