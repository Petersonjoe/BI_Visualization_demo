#-*- coding: utf-8 -*-
# from utils.sqlserver2sqlite import DataConverter
# from utils.dbAccess import Connector
# from utils.readConfig import DecodeConfig

# # find the config file
# myConn = DecodeConfig(filename='db.config')
# # read the conn in config
# myConn.getConfig(option='Test')
# # create a connector that holds the connection
# sourceDB = Connector(myConn.connString)

# sourceDB.sqlQuery = '''
#                         select TABLE_NAME 
#                         from INFORMATION_SCHEMA.TABLES
#                         where TABLE_NAME like 'Sample_%'
#                     '''
# sourceDB.connOpen()
# dataRes = sourceDB.execQuery()
# data = dataRes.fetchall()
# sourceDB.connClose()

# for table in data: 
#     #import pdb; pdb.set_trace()
#     obj = DataConverter(table[0])
#     obj.insertDataIntoDest()
#     obj.dataTest()

# from utils.dataRequest import DataRequest

# import pdb; pdb.set_trace()
# obj = DataRequest()
# err_data = obj.errDataRequest(item='unfixed')


from utils import readConfig
from utils.dataRequest import DataRequest, PostHandler
from urls import urls, Authenticated
from settings import AppSettings

import pdb; pdb.set_trace()
configs = AppSettings()
configs.sessionConfig()
db = configs.db
db.connOpen()
db.sqlQuery = "select count(*) from Sample_Users where email='" + 'admin@sample.com' + "'"
result = db.execQuery()









     








