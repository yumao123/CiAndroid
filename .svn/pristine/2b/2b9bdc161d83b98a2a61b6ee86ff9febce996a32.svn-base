# -*- coding: utf-8 -*-

import re
import chardet
import codecs


def replace_and_remove_comment(pattern, repl, string):
    ret = re.sub(pattern, repl, string)
    # 去掉前面的注释
    if ret.startswith('//'):
        ret = ret.replace('//', '   ', 1)
    return ret

'''
usage:      用于修改类似build.gradle文件
params:
file_name:  文件绝对路径
update_argv:需修改的字段及其对应值
eg:         update_normal_file(file_name="/home/test.grale", data={"versionno": 7, "versionname": 'xuanxunkuaixiao'})
'''
def update_regular_file(file_name=None, data=None):
    # try:
    results = []
    with codecs.open(file_name, 'r+',"utf-8") as fd:
        for line in fd.readlines():
            for key, value in data.items():
                re_params_nomark = '.*' + key + r'\s+.+'
                re_params_mark = '.*' + key + r'\s+".+"'
                re_params_sigmark = '.*' + key + r"\s+'.+'"
                #优先判断该行是否匹配:带双引号
                # e.sub(pattern, repl, string, count=0, flags=0)
                if re.search(re_params_mark, line):
                    line = replace_and_remove_comment(re_params_mark, key + ' ' + '"' + value + '"' + '\n', line)
                #还要考虑是否有单引号
                elif re.search(re_params_sigmark, line):
                    line = replace_and_remove_comment(re_params_sigmark, key + ' ' + "'" + value + "'" + '\n', line)
                #判断该行是否匹配:不带任何引号
                elif re.search(re_params_nomark, line):
                    line = replace_and_remove_comment(re_params_nomark, key + ' ' + value + '\n', line)
                
            results.append(line)
        fd.seek(0, 0)
        fd.truncate()
        for result in results:
            fd.write(result)

    # except IOError, e:
    #     #文件不存在则返回退出
    #     pass
    # finally:
    #     return True