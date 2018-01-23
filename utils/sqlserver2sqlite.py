#-*- coding: utf-8 -*-
""""
This module is a sql server to sql lite table converter,
a Python version.

Test environment: SQL SERVER 2014, sqlite3, python2.7.13
"""
import os
import sqlite3
import pyodbc

from dbAccess import Connector
from readConfig import DecodeConfig

__author__ = "Lei Ji"

sourceConn = DecodeConfig(filename = 'db.config')
sourceConn.getConfig(option = 'Test')
sourceDB = Connector(sourceConn.connString)

destConn = sqlite3.connect('./test.db')

## Key --> field type in sqlite3; value list --> field types in sql server or other RDBMS
TYPE_MAPPING = {
	"INTEGER": ['int', 'integer', 'tinyint', 'smallint', 'mediumint', 'bigint', 'unsigned big int', 'int2', 'int8'],
	"TEXT": ['character', 'varchar', 'varying character', 'nchar', 'native character', 'nvarchar', 'text', 'clob'],
	"NONE": ['blob', 'no datatype specified'],
	"REAL": ['real', 'double', 'double precision', 'float'],
	"NUMERIC": ['numeric', 'decimal', 'boolean', 'date', 'datetime']
}

class DataConverter(object):
	"""
	Pull the data table structure, and translate the field type to sqlite builtin type.
	"""
	
	def __init__(self, s_table_name):
		self.s_table_name = s_table_name
	
	# private function    
	def __copySourceTableStructure(self):
		'''
		Private function for create table, copy table field list
		'''
		
		headStr = 'CREATE TABLE ' + self.s_table_name + ' ('
		bodyStr = ''
		footStr = ')'
		fieldList = ''
		
		sourceDB.sqlQuery = """
							select TABLE_NAME, 
								   COLUMN_NAME, 
								   IS_NULLABLE, 
								   DATA_TYPE
							  from INFORMATION_SCHEMA.COLUMNS
							 where TABLE_NAME = '{}'
							""".format(self.s_table_name)
		
		sourceDB.connOpen()
		dataRes = sourceDB.execQuery()
		data = dataRes.fetchall()
		sourceDB.connClose()
		
		for row in data:
			for key, value in TYPE_MAPPING.items():
				if row[3] in value:
					if cmp(row[2], 'YES') == 0:
						bodyStr += '[' + row[1] + '] ' + key + ' NULL,'
					else:
						bodyStr += '[' + row[1] + '] ' + key + ' NOT NULL,'
					break
			fieldList += '[' + row[1] + '],'
			
		bodyStr = bodyStr[0:len(bodyStr)-1]
		fieldList = fieldList[0:len(fieldList)-1]
		
		testExist = "select * from sqlite_master where name = '{}'".format(self.s_table_name) 
		destDB = destConn.cursor()
		testRes = destDB.execute(testExist)
		testData = testRes.fetchall()
		if not testData:
			print '********\n-->\nExec sql: [{}]. '.format(headStr + bodyStr + footStr) + '\nThe dest table not exist. Creating it...\n'
			destDB.execute(headStr + bodyStr + footStr)
			print 'Table created successfully.\n-->\n'
			destDB.close()
		else:
			print '-->\nExec sql: [{}]'.format(testExist) + '\nThe dest table exists. Drop and then create it. \nDroping...\n'
			dropStr = 'Drop table {}'.format(self.s_table_name)
			destDB.execute(dropStr)
			print 'Table droped.\nTable re-creating...\n'
			destDB.execute(headStr + bodyStr + footStr)
			print 'Successfully create table {}\n********\n'.format(self.s_table_name)
			destDB.close()

		return fieldList
	
	# directly call this method    
	def insertDataIntoDest(self):
		'''
		1. copy the table structure, if there has been the table, then drop and recreate
		2. insert data into destination table.
		'''
		from datetime import date, datetime

		destDB = destConn.cursor()
		fieldStr = self.__copySourceTableStructure()
		headStr = 'insert into ' + self.s_table_name + '(' + fieldStr + ') values ('
		bodyStr = ''
		footStr = ')'

		sourceDB.sqlQuery = 'select ' + fieldStr + ' from ' + self.s_table_name
		print '********\n-->Exec sql: [{}]\n'.format(sourceDB.sqlQuery)
		sourceDB.connOpen()
		dataRes = sourceDB.execQuery()
		data = dataRes.fetchall()
		print 'Got data!\n********\n'
		sourceDB.connClose()
		
		count = 0
		for row in data:
			bodyStr = ''
			for i in range(len(row)):
				if row[i] is None:
					row[i] = 'Null'
					bodyStr += "{" + str(i) + "},"
				elif isinstance(row[i], unicode):
					row[i] = row[i].replace("'","''")
					bodyStr += "'{" + str(i) + "}',"
				elif isinstance(row[i], datetime) or isinstance(row[i], date):
					row[i] = '{}'.format(row[i].strftime('%Y-%m-%d %H:%M:%S'))
					bodyStr += "'{" + str(i) + "}',"
				else:
					bodyStr += "{" + str(i) + "},"
			bodyStr = bodyStr[0:len(bodyStr)-1]
			insertQuery = headStr + bodyStr + footStr
			insertQuery = insertQuery.format(*row)
			if count < 9:
				print '-->Exec sql: [{}]\n'.format(insertQuery)
			elif count == 9:
				print '-->...\n'.format(insertQuery)
			destDB.execute(insertQuery)        
			count += 1     	
		
		print '-->Data insert into table [{}] over!\n********\n'.format(self.s_table_name)
		destDB.close()

	def dataTest(self):
		'''
		this method is to test if the data can be extracted successfully from the target table
		'''
		print '********\n-->Test table: [{}]\n'.format(self.s_table_name)        
		testStr = 'select * from {0}'.format(self.s_table_name)
		print '-->Test query: [{}]\n'.format(testStr)
		destDB = destConn.cursor()
		dataRes = destDB.execute(testStr)
		data = dataRes.fetchall()

		if not data:
			print '-->No data found. Insert test failed!\n-->Please re-test for table [{}]\n********\n'.format(self.s_table_name)
		else:
			if len(data) <= 10:
				print '-->Data insert success.\n{} samples listed below:\n'.format(len(data))
				for i in range(len(data)):
					print data[i]
			else:
				print 'Data insert success.\n10 samples listed below:\n'.format(len(data))
				for i in range(10):
					print data[i]
			print '\n********\n'






		


