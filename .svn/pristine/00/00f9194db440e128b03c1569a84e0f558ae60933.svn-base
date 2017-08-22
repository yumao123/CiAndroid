#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, re, shutil
from build_script import config

class UpdateLogo(object):
    """

    """
    def __init__(self, src_logo_path, enterprise_number, logo_inside_code, os_mode):
        self.src_logo_path      = src_logo_path
        self.enterprise_number  = str(enterprise_number)
        self.logo_inside_code   = logo_inside_code
        self.os_mode            = os_mode


    """

    """
    def _get_src_folder(self):
        src_logo_path       = self.src_logo_path
        enterprise_number   = self.enterprise_number
        os_mode             = self.os_mode
        #列出所有文件夹下文件
        if os.path.exists(src_logo_path):
            src_logo_list = os.listdir(src_logo_path)
            #遍历所有文件
            if len(src_logo_list) == 0:
                return None

            for file in src_logo_list:
                logo_file = re.search(r'(\d+?)\.(.*)', file)
                if logo_file is not None:
                    #eg:/Users/xw/CiApp/repository/logo/141.haixin/android/
                    if logo_file.group(1) == enterprise_number:
                        if self.os_mode == 'android':
                            return '{0}{1}/{2}/'.format(src_logo_path, file, self.os_mode)
                        elif self.os_mode == 'ios':
                            pass
        return None

    """

    """
    def _replace_logo(self):
        src_logo_path = self._get_src_folder()
        logo_inside_code = self.logo_inside_code

        if src_logo_path == None:
            return True

        #Replace logo
        if os.path.exists(src_logo_path):
            src_folder_list = os.listdir(src_logo_path)
            for folder in src_folder_list:
                src_dir     = ''.join((src_logo_path, folder))
                dest_dir    = ''.join((logo_inside_code, folder))
                try:
                    dest_pics = os.listdir(dest_dir)
                    src_pics = os.listdir(src_dir)

                    for pics in src_pics:
                        if pics in dest_pics:
                            os.remove('{0}/{1}'.format(dest_dir, pics))

                    for pics in src_pics:
                        shutil.copy('{0}/{1}'.format(src_dir, pics), '{0}/{1}'.format(dest_dir, pics))
                except OSError, e:
                    continue
        return True


    def start(self):
        self._replace_logo()


'''
usage:              Change package logo
params:
logo_info:          Logo information = {enterprise_number, local_code}
eg:                 update_logo(logo_info)
'''
def update_logo(logo_info):
    enterprise_number   = logo_info.get('enterprise_number')
    local_code          = logo_info.get('local_code')
    os_mode             = logo_info.get('os_mode')

    if enterprise_number is None:
        return False

    logo_inside_code = '{0}{1}'.format(local_code, config.LOGO_INSIDE_CODE)
    update_logo_handle = UpdateLogo(
        src_logo_path       = config.LOCAL_LOGO_REPERTORY, 
        enterprise_number   = enterprise_number, 
        logo_inside_code    = logo_inside_code,
        os_mode             = os_mode,
        )
    update_logo_handle.start()









