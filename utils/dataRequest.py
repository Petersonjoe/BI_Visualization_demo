#-*- coding: utf-8 -*-
from __builtin__ import object, property, staticmethod
from dbAccess import Connector
from readConfig import DecodeConfig
from querySettings import DIRECT_QUERY, TREND_QUERY
from datetime import *
import sqlite3
import sys
import json
import random
import time

reload(sys)
sys.setdefaultencoding("utf-8")

sqliteConn = sqlite3.connect('./test.db', check_same_thread=False)

def _isNone(num):
    if not num:
        return 0.0
    else:
        return num

def _dKey(l):
    d = {}
    if l is not None:
        for i in l:
            if d.has_key(i) and d[i] is not None:
                d[i]  = d[i] + 1
            elif i is not None:
                d[i] = 1
        key = [i for i in d.keys() if d[i] > 1]
        return key
    else:
        return None

def _extractData(queryString):

    sqliteDB = sqliteConn.cursor()
    dataRes = sqliteDB.execute(queryString)
    data = dataRes.fetchall()
    sqliteDB.close()

    return data

def _parseSqliteTable(queryString):
    '''
    :@queryString the object that to be parsed
     extract the table name with RegEx
    '''
    import re

    '''
    :Introduction to python Regular Expression

     Reserved Keys, a.k.a., metaCharacters:
     . ^ $ * + ? { } [ ] \ | ( )

     []    a pair for containing the multi-match condition
     ^     except for
     |     or
     \     tranlate the characters, including metaCharacters

     *     match the character before it, 0 or many times
     +     match the character before it, 1 or many times
     ?     match the character before it, 0 or 1 time
     {m,n} match the character before it, at least m times and at most n times
     .     match any characters except ones start from the next line, a.k.a., 
           match except \n, re.DOTALL parameter will release the limitation

     $     match EOS, end of string
     ()    to group the match result, paired with the group() method

     Match rules:
     \s match arbitrary invisible characters, a.k.a., [ \t\n\f\v\r]
     \S match arbitrary visible characters, a.k.a., [^ \t\n\f\v\r]
     \w match any characters and numbers, a.k.a., [a-zA-Z0-9_]
     \W match except any characters and numbers, a.k.a, [^a-zA-Z0-9_]
     \d match any numbers [0-9]
     \D match any non-numbers [^0-9]
     
     Flag:
     re.I ignorecase
     re.L locale-aware
     re.M match in multi-line
     re.S enable matching \n for dot
     re.U enable unicode parsing
     re.X made RE understandable
    '''
    if 'where' in queryString.lower():
        querySplit = '(.*)from(.*)where(.*)'
    else:
        querySplit = '(.*)from(.*)'
    trimStr = '\S+'

    parseRes0 = re.search(querySplit,queryString,re.M|re.I|re.S)
    if parseRes0:
        subStr0 = parseRes0.group(2)
        parseRes1 = re.search(trimStr,subStr0)
        if parseRes1:
            tableName = parseRes1.group()
        else:
            print 'Trim table name failed!'
    else:
        print 'Extract table name failed!'

    fieldList = []
    fieldTypeList = []
    if tableName:
        sqlQuery = 'PRAGMA TABLE_INFO({})'.format(tableName)
        data = _extractData(sqlQuery)

        if data is not None:
            for row in data:
                fieldList.append(row[1])
                fieldTypeList.append(row[2])
            return fieldList
        else:
            print 'Table structure extraction from sqlite failed!'
    else:
        print 'TableName extraction failed!'

def _errDataProvider(qHead=None, dataHolder=None, **kwargs):
    '''
        parameters conn, qHead and dataHolder are mandatory
    '''
    count = 0
    # check params
    assert (qHead and dataHolder)
            
    # process unfixed cases
    sqlQuery = DIRECT_QUERY[qHead]
    data = _extractData(sqlQuery)
    fieldList = _parseSqliteTable(sqlQuery)
    
    if data is None:
        dataHolder[qHead] = None
    else:
        count = 0
        for row in data:
            if count == 0:
                for cd in fieldList:
                    dataHolder[qHead][cd] = []
            for i in range(len(fieldList)):
                if isinstance(row[i],datetime):
                    xrow = '{}'.format(row[i].strftime('%Y-%m-%d %H:%M:%S'))
                elif isinstance(row[i],date):
                    xrow = '{}'.format(row[i].strftime('%Y-%m-%d'))
                else:
                    xrow = row[i] and row[i] or ""
                dataHolder[qHead][fieldList[i]].append(xrow)
            count += 1

    return dataHolder[qHead]

class DataRequest(object):

    @property
    def cpu(self):
        charts = {
            "cpudata":{},
            "cputrend":{
                "xdata":[],
                "ydata":{}
                }
            }

        cpudata = {} 
        sqlQuery = DIRECT_QUERY["cpu"]
        data = _extractData(sqlQuery)
        for i in data:
            key = i[0].replace("\\\\","")
            cpudata[key] = round(i[1],2)
        charts["cpudata"] = cpudata

        sqlQuery = TREND_QUERY["cpu"]
        data = _extractData(sqlQuery)

        lineRes = {}
        attrRes = {}
        try:
            for row in data:
                if lineRes.has_key(row[0]):
                    lineRes[row[0]].append(round(_isNone(row[2]),2))
                    attrRes[row[0]].append(row[1][0:19])  # resolution into seconds only
                else:
                    lineRes[row[0]] = []
                    lineRes[row[0]].append(round(_isNone(row[2]),2))
                    attrRes[row[0]] = []
                    attrRes[row[0]].append(row[1][0:19])
        except Exception, e:
            print e.message
            return '505'

        attr = ["{}".format(i) for i in attrRes["MACHINE2"]]
        charts["cputrend"]["xdata"] = attr
        charts["cputrend"]["ydata"] = lineRes

        f_charts = json.dumps(charts, indent=4, ensure_ascii=False)

        return f_charts
    
    @property
    def memory(self):
        charts = {
            "memorydata":{},
            "memorytrend":{
                "xdata":[],
                "ydata":{}
                }
            }

        memorydata = {}
        sqlQuery = DIRECT_QUERY["memory"]
        data = _extractData(sqlQuery)
        for i in data:
            key = i[0].replace("\\\\","")
            memorydata[key] = round(i[1],2)
        charts["memorydata"] = memorydata

        sqlQuery = TREND_QUERY["memory"]
        data = _extractData(sqlQuery)

        lineRes = {}
        attrRes = {}
        for row in data:
            if lineRes.has_key(row[0]):
                lineRes[row[0]].append(round(_isNone(row[2]),2))
                attrRes[row[0]].append(row[1][0:19])  # resolution into seconds only
            else:
                lineRes[row[0]] = []
                lineRes[row[0]].append(round(_isNone(row[2]),2))
                attrRes[row[0]] = []
                attrRes[row[0]].append(row[1][0:19])

        attr = ["{}".format(i) for i in attrRes["MACHINE2"]]
        charts["memorytrend"]["xdata"] = attr
        charts["memorytrend"]["ydata"] = lineRes

        f_charts = json.dumps(charts, indent=4, ensure_ascii=False)

        return f_charts

    @property
    def caseResults(self): 
        sqlQuery = DIRECT_QUERY["case"]
        data = _extractData(sqlQuery)
        v1 = list(data)[0][::-1]  ## data order - [#processingcase, #pendingcase, #failedcase, #case]

        return json.dumps(v1,indent=4,ensure_ascii=False)

    @property
    def diskSpace(self):
        charts = {}
        diskdata = {}

        v1 = [0 for i in range(4)]  ## data order - [bicwkr6, bicwkr5, bicwkr4, bicwkr3]
        v2 = [0 for i in range(4)]  ## data order - v2 sysdrive; v1 dbdrive
        sqlQuery = DIRECT_QUERY["disk"]
        data = _extractData(sqlQuery)
        for arr in data:
            dKey = arr[0].replace('\\\\','').upper()
            if diskdata.has_key(dKey):
                diskdata[dKey][arr[1].replace(':','')] = round(arr[2],2)
            else:
                diskdata[dKey] = {}
                diskdata[dKey][arr[1].replace(':','')] = round(arr[2],2)

        ## process trend data 
        v_data = {}
        attrRes = {}

        sqlQuery = TREND_QUERY["disk"]
        data = _extractData(sqlQuery)
        for row in data:
            if v_data.has_key(row[0]):
                if v_data[row[0]].has_key(row[2].replace(':','')):
                    v_data[row[0]][row[2].replace(':','')].append(round(_isNone(row[3]),2))
                    attrRes[row[0]][row[2].replace(':','')].append(row[1])
                else:
                    v_data[row[0]][row[2].replace(':','')] = []
                    v_data[row[0]][row[2].replace(':','')].append(round(_isNone(row[3]),2))
                    
                    attrRes[row[0]][row[2].replace(':','')] = []
                    attrRes[row[0]][row[2].replace(':','')].append(row[1])
            else:
                v_data[row[0]] = {}
                v_data[row[0]][row[2].replace(':','')] = []
                v_data[row[0]][row[2].replace(':','')].append(round(_isNone(row[3]),2))

                attrRes[row[0]] = {}    
                attrRes[row[0]][row[2].replace(':','')] = []
                attrRes[row[0]][row[2].replace(':','')].append(row[1])
         
        charts["xAxisData"] = ['{}'.format(i) for i in attrRes["MACHINE2"]["C"]]
        charts["seriesData"] = v_data
        charts["diskdata"] = diskdata

        f_charts = json.dumps(charts, indent=4, ensure_ascii = False)
        return f_charts

    @staticmethod
    def wkrCaseList(wkrname):
        caselistdata = {
            "wkrname": [],
            "cid": [],
            "pid": [],
            "pname": [],
            "owner": [],
            "cstatus": [],
            "casecreatedate": [],
            "casesize": [],
            "timeconsumed": [],
            "#Records": [],
            "#flowin": [],
            "#flowout": []
            }

        sqlQuery = DIRECT_QUERY["wkrpage_case_list"].format(wkrname)
        data = _extractData(sqlQuery)
        for row in data:
            caselistdata["wkrname"].append(row[0])
            caselistdata["cid"].append(row[1])
            caselistdata["pid"].append(row[2])
            caselistdata["pname"].append(row[3])
            caselistdata["owner"].append(row[4])
            caselistdata["cstatus"].append(row[5])
            caselistdata["casecreatedate"].append(row[6])
            caselistdata["casesize"].append(row[7] + row[8])
            caselistdata["#Records"].append(row[9])
            caselistdata["timeconsumed"].append(row[10])
            caselistdata["#flowin"].append(row[11])
            caselistdata["#flowout"].append(row[12])

        return caselistdata

    @staticmethod
    def wkrCaseSummary(wkrname):
        summaryData = {
            'RejectCase': -1,
            'ReadyCase': -1,
            'PendingCase': -1,
            'FailedCase': -1,
            'ValidationFailedCase': -1,
            'CancelledCase': -1,
            'ProcessingCase': -1,
            'CompletedCase': -1
            }
        
        wname = wkrname.upper()
        sqlQuery = DIRECT_QUERY["wkrpage_case_summary"].format(wname)
        data = _extractData(sqlQuery)
        summaryData["RejectCase"] = data[0][2]
        summaryData["ReadyCase"] = data[0][9]
        summaryData["PendingCase"] = data[0][4]
        summaryData["FailedCase"] = data[0][3]
        summaryData["ValidationFailedCase"] = data[0][7]
        summaryData["CancelledCase"] = data[0][8]
        summaryData["ProcessingCase"] = data[0][5]
        summaryData["CompletedCase"] = data[0][6]

        return json.dumps(summaryData, indent=4, ensure_ascii = False)

    @staticmethod
    def casePageSankey(index, **kwargs):
        dataSet = {
            "cid": [],
            "pid": [],
            "tid": [],
            "dtid": [],
            "source": [],
            "cname": [],
            "dest": []
            }
        f_data = {
            "nodes": [],
            "links": [],
            "pid": []
            }

        if(kwargs["isCase"]):
            sqlQuery = DIRECT_QUERY["case_page_sankey"]["case"].format(index)
        else:
            sqlQuery = DIRECT_QUERY["case_page_sankey"]["pkg"].format(index, index)
        data = _extractData(sqlQuery)
        for row in data:
            dataSet["cid"].append(row[0])
            dataSet["pid"].append(row[1])
            dataSet["tid"].append(row[2])
            dataSet["dtid"].append(row[3])
            dataSet["source"].append(row[4])
            dataSet["cname"].append(row[5])
            dataSet["dest"].append(row[6])
        
        f_data["nodes"].append({"name": dataSet["cname"][0]})
        casename = dataSet["cname"][0]
        pkgid = dataSet["pid"][0]

        # for process node
        s_nodes = list(set(dataSet["source"]))
        d_nodes = list(set(dataSet["dest"]))
        conNodes = s_nodes + d_nodes
        conNodes.append(casename)
        dNodes = _dKey(conNodes)

        # generate values
        s_values = {}
        d_values = {}
        s_flag = {}
        d_flag = {}
        for node in s_nodes:
            if (node is not None):
                s_values[node] = len([i for i in range(len(dataSet["source"])) if cmp(dataSet["source"][i],node) == 0])
                s_flag[node] = 0
        for node in d_nodes:
            if (node is not None):
                d_values[node] = len([i for i in range(len(dataSet["dest"])) if cmp(dataSet["dest"][i],node) == 0])
                d_flag[node] = 0

        for i in range(len(dataSet["source"])):
            if (dataSet["source"][i] is not None):
                if (s_flag[dataSet["source"][i]] == 0):
                    if (dataSet["source"][i] in dNodes):
                        node = {"name": dataSet["source"][i] + "_in"}
                        link = {"source": dataSet["source"][i] + "_in", "target": dataSet["cname"][0], "value": s_values[dataSet["source"][i]]}
                    else:
                        node = {"name": dataSet["source"][i]}
                        link = {"source": dataSet["source"][i], "target": dataSet["cname"][0], "value": s_values[dataSet["source"][i]]}
                    f_data["nodes"].append(node)
                    f_data["links"].append(link)
                    s_flag[dataSet["source"][i]] = 1
            if (dataSet["dest"][i] is not None):
                if (d_flag[dataSet["dest"][i]] == 0):
                    if dataSet["dest"][i] in dNodes:
                        node = {"name": dataSet["dest"][i] + "_out"}
                        link = {"source": dataSet["cname"][0], "target": dataSet["dest"][i] + "_out", "value": d_values[dataSet["dest"][i]]}
                    else:
                        node = {"name": dataSet["dest"][i]}
                        link = {"source": dataSet["cname"][0], "target": dataSet["dest"][i], "value": d_values[dataSet["dest"][i]]}
                    f_data["nodes"].append(node)
                    f_data["links"].append(link)
                    d_flag[dataSet["dest"][i]] = 1

        ## need more decoration for extracting data from pid
        f_data["pid"] = pkgid
        response = json.dumps(f_data, indent = 4, ensure_ascii = False)

        if kwargs.has_key("requestType"):
            if cmp(kwargs["requestType"], "web") == 0:
                return casename
            elif cmp(kwargs["requestType"], "ajax") == 0:
                return response    
        else:
            return None

    @staticmethod
    def casePageTAT(index, isCase = 1):
        """
           index: caseid or pkgid
           isCase: whether the caseid provided, 1 yes, 0 no
        """
        TATres = {
            "tasklist": [],
            "timelist": [],
            "tatdata": {},
            "faildata": {}  ## great extensible feature for different matrices
            }

        if isCase:
            sqlQuery = TREND_QUERY["casepage_tat"]["case"].format(index)
        else:
            sqlQuery = TREND_QUERY["casepage_tat"]["pkg"].format(index)
        data = _extractData(sqlQuery)

        tmp_tasklist = []
        tmp_timelist = []
        tmp_caseflag = {}
        for row in data:
            tmp_tasklist.append(row[3])
            if not tmp_caseflag.has_key(row[1]):
                tmp_timelist.append(row[2])
                tmp_caseflag[row[1]] = 1

        TATres["tasklist"] = list(set(tmp_tasklist))
        ##if isCase:  ## optimization should aim to differentiate case and pacakge
        for item in TATres["tasklist"]:
            TATres["tatdata"][item] = [0.0 for i in range(len(tmp_timelist))]
            TATres["faildata"][item] = [0.0 for i in range(len(tmp_timelist))]

        # drawback is that cannot deal with duplicated casestart time
        for row in data:
            TATres["tatdata"][row[3]][tmp_timelist.index(row[2])] = float(row[5])
            TATres["faildata"][row[3]][tmp_timelist.index(row[2])] = int(row[7])

        #need ways to filter out the cases created at the same time
        #TATres["timelist"] = ['{}'.format(i.strftime('%Y-%m-%d %H:%M')) for i in tmp_timelist]
        TATres["timelist"] = tmp_timelist
        result = json.dumps(TATres, indent = 4, ensure_ascii = False)

        return result

    @staticmethod
    def casePageKPI(cid):
        KPIres = {
            "Csize": '',
            "TskMaxVols": '',
            "FailedTskNum": '',
            "TblNum": ''
            }
        
        sqlQuery = DIRECT_QUERY["case_page_kpi"].format(cid)
        data = _extractData(sqlQuery)

        KPIres["Csize"] = data[0][0] + "Gb"
        KPIres["TskMaxVols"] = data[0][1]
        KPIres["FailedTskNum"] = data[0][2]
        KPIres["TblNum"] = data[0][3]
        
        result = json.dumps(KPIres, indent = 4, ensure_ascii = False)
        return result

    @staticmethod
    def errDataRequest(**kwargs):
        '''
           --parameter
               kwargs format: item = itemname
               itemname includes 'unfixed', 'accountinfo', 'manualdelete'
        '''
        count = 0
        res_data = {
            "unfixed":{},
            "accountinfo": {},
            "manualdelete": {}
            }

        if kwargs:
            if kwargs["item"] not in res_data.keys():
                itemName = kwargs["item"]

                if not kwargs.has_key("val"):
                    res_data = {
                        itemName: [],
                        "values": []
                    }
                    sqlQuery = DIRECT_QUERY["dailytrack"].format(itemName)
                else:
                    itemvalue = kwargs["val"]
                    sqlQuery = DIRECT_QUERY["dailytrackdetail"][itemName].format(itemvalue)
                data = _extractData(sqlQuery)
                fieldList = _parseSqliteTable(sqlQuery)

                if not kwargs.has_key("val"):
                    for row in data:
                        res_data[itemName].append(row[0])
                        res_data["values"].append(row[1])
                else:
                    if data is None:
                        res_data["unfixed"] = None
                    else:
                        count = 0
                        for row in data:
                            if count == 0:
                                for cd in fieldList:
                                    res_data["unfixed"][cd] = []
                            for i in range(len(fieldList)):
                                if isinstance(row[i],datetime):
                                    xrow = '{}'.format(row[i].strftime('%Y-%m-%d %H:%M:%S'))
                                elif isinstance(row[i],date):
                                    xrow = '{}'.format(row[i].strftime('%Y-%m-%d'))
                                else:
                                    xrow = row[i] and row[i] or ""
                                res_data["unfixed"][fieldList[i]].append(xrow)
                            count += 1

                #print res_data
                return json.dumps(res_data, indent = 4, ensure_ascii = False)
            else:
                # if cmp(kwargs["item"], "unfixed") == 0:
                #     result = _errDataProvider(kwargs["item"],res_data)
                # elif cmp(kwargs["item"], "accountinfo") == 0:
                #     result = _errDataProvider(kwargs["item"],res_data)
                # elif cmp(kwargs["item"], "manualdelete") == 0:
                result = _errDataProvider(kwargs["item"],res_data)

                return json.dumps(result, indent = 4, ensure_ascii = False)

class PostHandler(object):

    def __init__(self):
        self.__doc__ = '''This is a class for processing post request.
                          You can initiate a instance and call the 
                          static method directly.
                       '''
    @staticmethod
    def dailyTrackingHandler(data):
        records = json.loads(data)
        setFields = {
            '[ErrorCategory]': "Error Category",
            '[Fixed]': "Repaired",
            }
        whereFields = {
            '[PackageName]': "Package Name",
            '[TaskName]': "Task Name",
            '[OperationDate]': "Operation Date"
            }
        maintbl = '[Sample_DQuery_DailyTrackDetail]'
        sqlString = ''

        for i in range(len(records["Package Name"])):
            sqlString += "update " + maintbl + " set " 
            for k, v in setFields.items():
                sqlString += k + " = '" + records[v][i] + "',"
            sqlString = sqlString[0:len(sqlString) - 1] + " where "
            for k, v in whereFields.items():
                if cmp(k,"[OperationDate]") == 0:
                    sqlString += k + " = convert(date, '" + records[v][i] + "') and "
                else:
                    sqlString += k + " ='" + records[v][i] + "' and "
            sqlString = sqlString[0:len(sqlString) - 5] + ";"
        
        sqlQuery = sqlString
        sqliteCursor = sqliteConn.cursor()
        sqliteCursor.execute(sqlQuery)
        sqliteCursor.close()
        return json.dumps({"msg": 'Update successfully!'},indent = 4, ensure_ascii = False)

            
             
                    