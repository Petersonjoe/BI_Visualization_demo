#-*- coding: utf-8 -*-
import pyodbc
import sys
from readConfig import DecodeConfig

reload(sys)
sys.setdefaultencoding("utf-8")

class Connector(object):
    '''basic operations for sql server connection, such as connect, execute, close connection'''

    sqlQuery  = None
    cnxn = None

    def __init__(self, connString, cursor = None):
        self.connString = connString
        self.cursor = cursor
    
    #@property
    def connOpen(self):
        try:
            self.cnxn = pyodbc.connect(self.connString)
            self.cursor = self.cnxn.cursor()
            return self.cursor
        except Exception, e:
            print e.message
            raise

    def execQuery(self):
        try:
            if self.sqlQuery is not None:
                if ("select" in self.sqlQuery.lower() and "into" not in self.sqlQuery.lower())\
                    or "exec " in self.sqlQuery.lower():
                    queryResult = self.cursor.execute(self.sqlQuery)
                    return queryResult
                elif ("update" in self.sqlQuery.lower()) \
                    or ("insert" in self.sqlQuery.lower()) \
                    or ("into" in self.sqlQuery.lower()):
                    queryResult = self.cursor.execute(self.sqlQuery)
                    self.cnxn.commit()
                else:
                    raise IndexError
        except Exception, e:
            print e.message
            raise

    #@property
    def connClose(self):
        try:
            if self.cursor is not None:
                self.cursor.close()
        except Exception, e:
            print e.message
            raise

class TableObj(object):
    '''This is a class for storing a table object,
       the instance will be dynamically realized with the table fields
    '''
    def __init__(self):
        self.attrilist = {}

    def initAttributes(self, attributes):
        if len(attributes) > 0:
            for key, value in attributes.items():
                if value == '' or value is None:
                    self.attrilist[key] = 'Null'
                else:
                    self.attrilist[key] = value

class TableOperator(object):
    ''' this class is to process the related sql query'''
    _attributes = {}
    innerTable = TableObj()

    def __init__(self, tablename):
        self.tablename = tablename
        self.mappingInfo = DecodeConfig(self.tablename + ".csv")
    
    def __cleanString(self, queryString, *args):
        '''for clean the weired characters in the sql query
        '''
        Null = 'NULL'
        if len(args) > 0:
            for arg in args:
                queryString = queryString.replace(arg, Null)
            return queryString
        else:
            return queryString
            
    def _initTable(self):    
        '''realize an Table Object with giving the specific attributes from .csv file
           for the value of _attributes, please refernece the class - TableObj
        '''
        self._attributes = self.mappingInfo.getConfig()    #attribute gets the mappingdict
        self.innerTable.initAttributes(self._attributes)

    def selectQuery(self, *args):    
        '''simply return the select string,
           pass the args list as the select list
           default return value is 'select * from table'
        '''
        header = "select "
        body = ''
        tail = " from " + self.tablename
        if len(args) > 0:
            for arg in args:
                if '[' or ']' in arg:
                    body += arg + ','
                else:
                    body += "[" + arg + "],"
        else:
            body = "*"

        return header + body + tail

    def updateQuery(self, valueSet):
        '''valueSet accepts the key-value dict from webspider
           valueSet should have format as:
           [Label] from html: [Value] from html
        '''
        _count = 0
        header = "update " + self.tablename + " set "
        body = ""
        

        if len(valueSet) > 0:
            for label, value in valueSet.items():
                if (self.innerTable is not None) \
                    and self.innerTable.attrilist.has_key(label):
                    if "int" in str(type(value)):
                        pass
                    else:
                        value = str(value).replace("'","''").replace("<br/>"," ")
                    body += self.innerTable.attrilist[label] + "='" + str(value) + "',"    
                else:
                    _count += 1    
            body = body[0:len(body)-1]  # remove the last comma
            if valueSet.has_key("Primary Email1:"):
                tail = " where Email = '" + valueSet["Primary Email1:"] + "'"
            else:
                tail = " where Email = '" + valueSet["NT User Domain ID:"] + "'"
            return self.__cleanString(header + body + tail, "\xc2\xa0", "None")
        else:
            return None

    def insertQuery(self, valueSet):
        '''valueSet accepts the key-value dict from webspider
           valueSet should have format as:
           [Label] from html: [Value] from html
        '''
        _count = 0
        header = "insert into " + self.tablename + "("
        body = ") values ("
        tail = ")"
        if len(valueSet) > 0:
            for label, value in valueSet.items():
                if (self.innerTable is not None) \
                    and self.innerTable.attrilist.has_key(label):
                    if "int" in str(type(value)):
                        pass
                    else:
                        value = str(value).replace("'","''").replace("<br/>"," ")
                    header += self.innerTable.attrilist[label] + ","
                    body += "'" + str(value) + "',"
                else:
                    _count += 1
            header = header[0:len(header)-1]
            body = body[0:len(body)-1]
            return self.__cleanString(header + body + tail, "\xc2\xa0", "None")
        else:
            return None

