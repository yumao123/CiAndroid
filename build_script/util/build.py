#!/usr/bin/env python
 # -*- coding: utf-8 -*-
import os, shutil, sys, subprocess
from build_script import config
from build_script.globals import ci_globals

class Build(object):
    def __init__(self, local_code, build_type):
        self.local_code = local_code
        self.build_type = build_type
        self.log_name   = ci_globals.build_log


    def _prepare(self):
        pass


    def _build_clean(self):
        pass


    def _build_release(self):
        pass


    def start(self):
        self._prepare()

        err = self._build_clean()
        if err is not None:
            return err
        err = self._build_release()
        if err is not None:
            return err

        return None


class GradleBuild(Build):
    def __init__(self, local_code, build_type):
        Build.__init__(self, local_code, build_type)


    def _prepare(self):
        #local.properties
        property_file = '{0}/local.properties'.format(self.local_code)
        #Modify local.properties
        with open(property_file, 'w') as fd:
            sdk_dir = 'sdk.dir={0}\n'.format(config.LOCAL_SDK)
            fd.write(sdk_dir)
        
        '''
        #Modify gradle.properties
        gradle_file = self.code_dir + '/gradle.properties'
        with open(gradle_file, 'a') as fd:
            fd.write('\n')
            fd.write('org.gradle.daemon=true\n')
            fd.write('org.gradle.parallel=true\n')
        '''

        from build_script.util.file_parse import update_regular_file
        build_file = '{0}/app/build.gradle'.format(self.local_code)
        update_regular_file(build_file, {"storeFile": "file('"+config.KEY_STORE+"')"})

        #2016-08-09
        build_gradle = '{0}/build.gradle'.format(self.local_code)
        with open(build_gradle, 'r') as fd:
            data = fd.read()
            gradleVmap = config.GRADLE_SETTING['GRADLE_VERSION']
            for version, gradle_tool in gradleVmap.items():
                if version in data:
                    self.gradle_tool = '{0}{1}/bin/gradle'.format(config.GRADLE_PATH, gradle_tool)

        #app
        app_dir = '{0}/app/'.format(self.local_code)
        os.chdir(app_dir)

    def _build_clean(self):
        err = None
        cmd = '{0} clean'.format(self.gradle_tool)

        # returncode = subprocess.Popen(cmd, shell=True, stdin = subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # ret = returncode.wait()
        from build_script.util import helpers 
        ret = helpers.timeout_command(cmd, fileName= self.log_name, timeout= 2*60)
        if ret is None:
            err = 'Build clean timeout...'

        if ret:
            err = 'Build clean failed, please check the log file!'
        return err

    def _build_release(self):
        err = None
        cmd = '{0} assembleRelease'.format(self.gradle_tool)

        from build_script.util import helpers 
        ret = helpers.timeout_command(cmd, fileName= self.log_name)

        if ret:
            err = 'Build release failed, please check the log file!'
        return err

class ExecuteCmdCtx(object):

    def __init__(self, dest_path):
        self.current_path = os.getcwd()
        self.dest_path = dest_path

    def __enter__(self):
        os.chdir(self.dest_path)

    def __exit__(self, e_t, e_v, t_b):
        os.chdir(self.current_path)



def build_by_gradle(local_code= None, build_type= None):
    err = None
    if os.path.exists(local_code):
        with ExecuteCmdCtx(local_code):
            gradle_handle = GradleBuild(local_code, build_type)
            err = gradle_handle.start()
   
    return err
