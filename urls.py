#-*- coding: utf-8 -*-

#url page mapping
urls = (
    '/', 'index',
    '/output?', 'result',
    '/mail_input','email',
    '/mainpage', 'visuals',
    '/wkrpage', 'subpage',
    '/casepage', 'casepage',
    '/testdemo', 'demo',
    '/login', 'login',
    '/logout?', 'logout',
    '/jsondata', 'response',
    '/wkrjsondata', 'wkr_response',
    '/casejsondata', 'case_response',
    '/dailymonitor', 'dailymonitor',
    '/dailymonitor/response', 'dailytrack_response'
    )

Authenticated = {
    'admin@sample.com': 0,
    'guest@sample.com': 0,
    }