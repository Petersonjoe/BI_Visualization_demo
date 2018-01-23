#-*- coding: utf-8 -*-
from __future__ import unicode_literals  # fix python2 for supporting Chinese character
import web
import re
import os
import sys
import time
import uuid
from utils import webCrawl
from utils import readConfig
from utils.dataRequest import DataRequest, PostHandler
from urls import urls, Authenticated
from settings import AppSettings
import hashlib
reload(sys)
sys.setdefaultencoding("utf-8")

__author__ = 'Lei Ji'

# configure the service settings
# web.config.debug = False
render = web.template.render("./templates/")
app = web.application(urls, globals())
configs = AppSettings()
configs.sessionConfig()
db = configs.db
bicopyright = '<p id="copyright"> Author: Lei Ji. All rights reserved.<p>'

if web.config.get('_session') is None:
    #store = web.session.DBStore(self.db, 'sessions')  # for later test, use database to store session
    store = web.session.DiskStore('sessions')
    session = web.session.Session(app, store, initializer={'login': 0, 'privilege': 0})
    web.config._session = session
else:
    session = web.config._session

# login page service
class login:
    def GET(self):
        title = "login"
        if configs.logged(session):  # already logged
            return render.home(bicopyright)
        else:                        # login at first time 
            #session.login = 1
            return render.login(title)
        return render.login(title)

    def POST(self):
        # keys: signinInputEmail|signinInputPassword|regInputEmail|regInputPassword
        recdata = web.input() 
        signinEmail = recdata.has_key("signinInputEmail") and recdata["signinInputEmail"] or False
        signinPassword = recdata.has_key("signinInputPassword") and recdata["signinInputPassword"] or False
        regEmail = recdata.has_key("regInputEmail") and recdata["regInputEmail"] or False
        regPassword = recdata.has_key("regInputPassword") and recdata["regInputPassword"] or False  
    
        try:
            # for new member, register the message
            if regEmail: 
                if not Authenticated.has_key(regEmail): return web.seeother('/logout?msg=You are not Authenticated, please contact the administrator!')

                db.connOpen()
                db.sqlQuery = "select count(*) from Sample_Users where email='" + regEmail + "'"
                result = db.execQuery()
                identR = result.fetchone()[0] == 0 and True or False
                db.connClose()
                if identR:
                    # not to use the execQuery() method
                    userid = str(uuid.uuid4()).replace('-', '')
                    userpass = str(hashlib.sha1("sAlT754-" + regPassword).hexdigest())
                    db.connOpen()
                    db.sqlQuery = "insert into Sample_Users(id, password, email) values ('" + userid + "','" + userpass + "','" + regEmail + "')"
                    db.execQuery()
                    #db.cursor.execute(db.sqlQuery)
                    #db.cnxn.commit()
                    
                    # test if the regist event success
                    db.sqlQuery = "select count(*) from Sample_Users where email ='" + regEmail + "'"
                    result = db.execQuery()
                    identT = result.fetchone()[0] == 0 and True or False
                    if identT:
                        db.connClose()
                        return web.seeother("/logout?msg=505 Internal Error!")
                    db.connClose() 

                    session.login = 1
                    session.privilage = 0
                    return web.seeother('/')
                else:
                    return web.seeother('/logout?msg=Signin failed:' + ' cannot double registed!')
            elif signinEmail and not regEmail:
                if not Authenticated.has_key(signinEmail): return web.seeother('/logout?msg=You are not Authenticated, please contact the administrator!')

                db.connOpen()
                db.sqlQuery = "select password,privilege from Sample_Users where email='" + signinEmail + "'"
                result = db.execQuery()
                result = result.fetchone()
                db.connClose()
                identS = (result is None) and False or {'password': str(result[0]), 'privilege': str(result[1])}
                if identS:
                    if cmp(hashlib.sha1("sAlT754-"+signinPassword).hexdigest(), identS['password']) == 0:
                        session.login = 1
                        session.privilege = identS['privilege']
                        return web.seeother('/')
                    else:
                        return web.seeother('/logout?msg=Password error: try again!')
                else: 
                    if session.login == 1: session.login = 0
                    session.privilege = 0
                    return web.seeother('/logout?msg=Login failed: try again!')
            else:
                session.login = 0
                session.privilege = 0
                return web.seeother('/logout?msg=Login error: try again!')
        except Exception, ex:
            session.login = 0
            session.privilege = 0
            return web.seeother('/logout?msg=Login error:' + ' ' + ex.message)

# logout page service
class logout:
    def GET(self):
        session.login = 0
        session.kill()
        info = web.input() is not None and web.input() or None
        return render.logout(info)

# main page service
class index:
    def GET(self):
        if configs.logged(session):
            return render.home(bicopyright)
        else:
            return web.seeother('/login')
        
# BI view input page service
class email: 
    def GET(self): 
        #form = emailform()
        title = 'Submit Page'
        return render.email_input(title)

    def POST(self):
        title = 'Submit Page' 
        form = web.input() 
        #preprocess the data input from web
        if str(form["Mode:"]) == "0" and form['Email:']:
            webemail = str(form['Email:'])    
        elif str(form["Mode:"]) == "1" and form['EmailList:']:
            webemail = str(form['EmailList:'])
        else:
            return render.email_input(title)
       
        info = webemail.replace("\n",";").replace("\r","")
        getInfo = re.split(',|;|\n|\s+|\t',info)
            
        #get info from BI view
        ts = time.time()    
        res = webCrawl.getEmployee(getInfo)
            
        #write data into json file
        ctxdata = web.ctx.env["HTTP_COOKIE"]
        ctxdata = re.split('=',ctxdata)
        filename = ctxdata[1]
        reslist = readConfig.DecodeConfig()
        reslist.jsonLoad(res,filename)

        if '@hpe.com' in info:
            newurl = '/output?fn=' + filename + '&ts=' + str(ts)
        elif '\\' in info:
            newurl = '/output?fn=' + filename + '&ts=' + str(ts)
        else:
            return render.email_input(title)
            
        raise web.seeother(newurl)

# BI View result show service
class result:
    def GET(self):
        data = web.input()
        filename = data["fn"]
        reslist = readConfig.DecodeConfig()
        
        res = reslist.jsonParse(filename)
        ts = data["ts"]
        te = time.time()
        dr = str(float(te)-float(ts))
        duration = dr[0:dr.find(".")+3]
        return render.output(res, duration)

# pyecharts test page service
class visuals:
    def GET(self):
       #charts = DataRequest()  ## try ajax to extract data from response
       return render.mainpage()

class subpage:
    def GET(self):
        data = web.input()
        name = data["name"]
        wkrcaseinfo = DataRequest.wkrCaseList(name)
        return render.subpage(name, wkrcaseinfo)

class casepage:
    def GET(self):
        ''' received a data formed by 
            'cid' - caseid
            'pid' - packageid
            '**kwargs' - other params
        ''' 
        data = web.input()
        caseid = data.has_key("cid") and data["cid"] or False
        pkgid = data.has_key("pid") and data["pid"] or False
        if caseid:
            casename = DataRequest.casePageSankey(caseid, requestType = "web", isCase = True)
            return render.casepage(caseid, casename, indexflag = 1)
        elif (pkgid and not caseid):
            casename = DataRequest.casePageSankey(pkgid, requestType = "web", isCase = False)
            return render.casepage(pkgid, casename, indexflag = 0)
        else:
            return web.notfound("Ooops! There must be something wrong with your request parameters!")

class dailymonitor:
    def GET(self):
        #data = DataRequest()
        #resdata = data.errDataRequest()
        return render.dailymonitor()

    def POST(self):
        data = web.data()
        try:
            receiver = PostHandler()
            response = receiver.dailyTrackingHandler(data)
        except Exception, ex:  # finally json dumps error, fixed
            #print ex.args[0]
            print ex.message 
        return response

# bootstrap frame and ajax test page service
class response:
    def GET(self):
        data = web.input()
        type = data.matrice
        charts = DataRequest()
        if cmp(type,"cpu") == 0:
            return charts.cpu
        elif cmp(type,"memory") == 0:
            return charts.memory
        elif cmp(type,"disk") == 0:
            return charts.diskSpace
        elif cmp(type, "casesummary") == 0:
            return charts.caseResults
        else:
            return web.notfound("Ooops! There must be something wrong with your request parameters!")

class wkr_response:
    def GET(self):
        data = web.input()
        name = data.name
        type = data.matrice
        if cmp(type, "casesummary") == 0:
            caseSummaryData = DataRequest.wkrCaseSummary(name)
            return caseSummaryData
        else:
            return web.notfound("Ooops! There must be something wrong with your request parameters!")

class case_response:
    def GET(self):
        data = web.input()
        caseid = data.has_key("cid") and data["cid"] or False
        pkgid = data.has_key("pid") and data["pid"] or False

        if cmp(data["matrice"],"sankey") == 0:
            if caseid:
                casedata = DataRequest.casePageSankey(caseid, requestType="ajax", isCase = True)
            elif pkgid:
                casedata = DataRequest.casePageSankey(pkgid, requestType="ajax", isCase = False)
            else:
                return web.notfound("Ooops! There must be something wrong with your request parameters!")
            return casedata
        elif cmp(data["matrice"], "tat") == 0:
            if caseid:
                tatdata = DataRequest.casePageTAT(caseid, isCase = 1)
            elif pkgid:
                tatdata = DataRequest.casePageTAT(pkgid, isCase = 0)
            else:
                return web.notfound("Ooops! There must be something wrong with your request parameters!")
            return tatdata
        elif cmp(data["matrice"], "kpi") == 0:
            kpidata = DataRequest.casePageKPI(caseid)
            return kpidata
        else:
            return web.notfound("Ooops! There must be something wrong with your request parameters!")

class dailytrack_response:
    def GET(self):
        data = web.input()
        itemname = data.item
        if data.has_key("value"):
            itemvalue = data.value
        else:
            itemvalue = False

        if itemvalue:
            err_data = DataRequest().errDataRequest(item=itemname,val=itemvalue)
        else:
            err_data = DataRequest().errDataRequest(item=itemname)
        res_data = err_data and err_data or False
        if res_data:
            return res_data
        else:
            return web.notfound("Ooops! There must be something wrong with your request parameters!")

class demo:
    def GET(self):
        return render.testdemo()


if __name__=="__main__":
    web.internalerror = web.debugerror
    app.run()