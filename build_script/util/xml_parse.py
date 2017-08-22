#--coding:utf-8--

import xml.etree.ElementTree as ET


class XmlManager():

    def __init__(self, xml_path= None):

        if xml_path:
            self.xml_path = xml_path
            self.tree = self._read_xml()
            self.root = self._get_xml_root()

    #Use parse to get tree
    def _read_xml(self):
        try:
            return ET.parse(self.xml_path)
        except IOError, e:
            #File not exist
            #todo raise error
            raise SyntaxError('Xml is not exist')
   
    #Get root
    def _get_xml_root(self):
        return self.tree.getroot()

    #Modify value
    def modify_value(self, name, value):
        for ele in self.root:
            if cmp(ele.attrib['name'], name) == 0:
                if ele.attrib.has_key('value'):
                    ele.attrib['value'] = value
                else:
                    ele.text = value

    #Write xml to file
    def write_xml(self, encode= None):
        if encode is None:
            encode = 'utf-8'

        return self.tree.write(self.xml_path, encoding = encode)

    def __del__(self):
        pass


'''
usage:      Modify xml
params:
xml_path:   Xml file path
data:       name & value
eg:         update_xml_file("/home/test/test.xml", {"name":"mike", "age":12})
'''
def update_xml_file(xml_path, data):
    err = None
    # try:
    xmlHandler = XmlManager(xml_path= xml_path)
    for name, value in data.items():
        if isinstance(value, int):
            value = str(value)
        xmlHandler.modify_value(name, value)
    xmlHandler.write_xml(encode='utf-8')
    # except SyntaxError,e :
    #     err = '{0}:{1}'.format(type(e), e)
    # finally:
    #     return err


if __name__ == '__main__':
    data = {"app_name": 'test1', "public_session_fail": '123'}
    ret = update_xml_file('strings.xml', data)
    print ret
