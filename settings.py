#-*- coding: utf-8 -*-
import web
from utils.readConfig import DecodeConfig
from utils.dbAccess import Connector

class AppSettings(object):

    def __init__(self):
        # database connection string
        self.CONFIG = DecodeConfig('db.config')
        self.db = Connector(self.CONFIG.getConfig())
        
        #self.DB_TYPE = self.CONFIG.getConfig('dbConfig','DB_TYPE')
        #self.DB_NAME = self.CONFIG.getConfig('dbConfig','DB_NAME')
        #self.HOST = self.CONFIG.getConfig('dbConfig','HOST')
        #self.PORT = self.CONFIG.getConfig('dbConfig','PORT')
        #self.USER = self.CONFIG.getConfig('dbConfig','USER')
        #self.PASSWORD = self.CONFIG.getConfig('dbConfig','PASSWORD')


        #self.db = web.database(
        #        dbn  = self.DB_TYPE,
        #        user = self.USER,
        #        pw   = self.PASSWORD,
        #        host = self.HOST,
        #        port = self.PORT,
        #        db   = self.DB_NAME
        #    )

    # configuration
    def sessionConfig(self):
        web.config.session_parameters['cookie_name'] = 'webpy_session_id'
        web.config.session_parameters['cookie_domain'] = None
        web.config.session_parameters['timeout'] = 3600 * 24 #24 * 60 * 60, # 24 hours in seconds
        web.config.session_parameters['ignore_expiry'] = False
        web.config.session_parameters['ignore_change_ip'] = True
        web.config.session_parameters['secret_key'] = 'fLjUfxqXtfNoIldA0A0J'
        web.config.session_parameters['expired_message'] = 'Session expired'

    def mailConfig(self):
        web.config.smtp_server = 'smtp-americas.hp.com'
        web.config.smtp_port = 25
        #web.config.smtp_username = 'cookbook@gmail.com'
        #web.config.smtp_password = 'secret'
        #web.config.smtp_starttls = True

    # detect session status
    def logged(self, session):
        if session.login == 1:
            return True
        else:
            return False

    # for privilege control, not used in current test
    def createRender(self, privilege):
        if privilege == 0:
            render = web.template.render('templates/home')  #this is new directory
        elif privilege == 1:
            render = web.template.render('templates/user')
        elif privilege == 2:
            render = web.template.render('templates/admin')
        else:
            render = web.template.render('templates/login')
        return render