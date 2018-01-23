#-*- coding: utf-8 -*-
import re
import sys
import time
import uuid
from selenium import webdriver
from bs4 import BeautifulSoup
from dbAccess import Connector, TableOperator
from readConfig import DecodeConfig

reload(sys)
sys.setdefaultencoding("utf-8")

def isInDB(employee):
    '''Check if the employee is already in the database,
       return 0 if not exists, return > 0 if exists 
    '''
    tablename = DecodeConfig("db.config").getConfig("tableConfig", "employeeTable")
    connString = DecodeConfig('db.config').getConfig()
    a = Connector(connString)
    tail = "'"

    if "@" in employee:
        header1 = "select count(*) from " + tablename + " where [Email] = '"
        a.sqlQuery = header1 + employee + tail
    elif "\\" in employee:
        header2 = "select count(*) from " + tablename + " where [NTAccount] = '"
        a.sqlQuery = header2 + employee + tail
    else:
        return None
        
    a.connOpen()
    res = a.execQuery().fetchone()[0]
    a.connClose()
    return res

def get_email(search_people, content):
    if '@' in search_people:
        email = search_people
    else:
        soup = BeautifulSoup(content)
        soup_body = soup.body
        soup_title = soup_body.select('tr[class="RightModuleHeader"]')
        soup_title = str(soup_title)
        if "href" in soup_title:
            mail = r'<a .*?>(.*?)</a>'
            email = re.findall(mail, soup_title, re.S | re.M)
            email = str(email[0])
        else:
            mail = r'<td>(.*?)</td>'
            email = re.findall(mail, soup_title, re.S | re.M)
            # print email
            email = str(email[0])
    return email

def getContent(email, url, cutFlag):
    url = DecodeConfig("url.config").getConfig("urlList", url)

    # concatenate url
    if cutFlag == 0:    # page 1
        url = url.replace("**", email)
    elif cutFlag == 1:   # page 2 & 3
        r2 = r'(.*?)@.*?'
        people = re.findall(r2, email, re.S | re.M)
        if len(people) == 0:
            return -1
        else:
            people = str(people[0])
        url = url.replace('**', people)

    driver = webdriver.Chrome()
    driver.get(url)
    content = driver.page_source
    driver.close()
    driver.quit()

    if "No matches found for" in content:
        return -1
    else:
        return content

def getEmployee(*employees):
    '''Craw data from internal people finder page, declare an instance using class Connector'''
    tablename = DecodeConfig("db.config").getConfig("tableConfig", "employeeTable")
    connString = DecodeConfig('db.config').getConfig()
    resultSet = {}

    for email in employees[0]:

        if len(email) == 0:
            continue

        valueSet = {}   # a container for any field-value to update, valueSet can be extended
        # generate sysaddkeys
        current_time = time.strftime("%Y-%m-%d %H:%M:%S")
        User_ID = str(uuid.uuid4()).replace('-', '')
        SysUpdateKey = str(uuid.uuid4()).replace('-', '')
        valueSet["Current Time:"] = current_time
        valueSet["Sys Update Key:"] = SysUpdateKey

        # page 1 to find email
        content1 = getContent(email, "url_peoplefind1", 0)
        if content1 == -1:
            if isInDB(email) > 0:  # exist in db but not in web
                if "@" in email:
                    valueSet["Primary Email1:"] = email
                else:
                    valueSet["NT User Domain ID:"] = email
                valueSet["Status:"] = 'Inactive'
                a = TableOperator(tablename)
                a._initTable()
                sqlstring = a.updateQuery(valueSet)
                resultSet[email] = 0
            elif isInDB(email) == 0:    # not in db and not in web
                resultSet[email] = 2
                continue 
        else:    
            if "@" in email:
                valueSet["Primary Email1:"] = email
                valueSet["Primary Email2:"] = email
            else:
                email = get_email(email, content1)
                valueSet["Primary Email1:"] = email
                valueSet["Primary Email2:"] = email
            
            # crawl page 2, find information
            content2 = getContent(email, "url_peoplefind2", 1)
            soup = BeautifulSoup(content2)
            soup_body = soup.body
            soup_label = soup_body.select('td[class="mpLabel"]')
            soup_val = soup_body.select('td[class="mpVal"]')

            for i in range(len(soup_label)):
                valueSet[str(soup_label[i].string)]  = str(soup_val[i].string)
            
            # crawl page 3
            content3 = getContent(email, "url_managerlist", 1)
            content3 = BeautifulSoup(content3)
            managers = content3.body
            managers = managers.select('div[class="managers"]')
            re_img = r'<img src="(.*?)"/>'
            managers_pictures = re.findall(re_img, str(managers), re.S | re.M)
            
            # realize level, manager pictures/emails
            valueSet["Employee Level:"] = int(len(managers_pictures) + 1)
            valueSet["Direct Manger Pic URL:"] = str(managers_pictures[-1]) 
            managers_pictures = str(managers_pictures)
            if "'" in managers_pictures:
                managers_pictures = managers_pictures.replace("'", "")
                managers_pictures = managers_pictures.replace(",", ";")
                managers_pictures = managers_pictures.replace("[", "")
                managers_pictures = managers_pictures.replace("]", "")
                managers_pictures = managers_pictures.replace(" ", "")
            else:
                managers_pictures = managers_pictures
            valueSet["Manager Pic URLs:"] = str(managers_pictures)

            # catch manager list
            re_email = r'<a href=.*?uid%3D(.*?)%2Cou.*? title.*?>'
            managers_emails = re.findall(re_email, str(managers), re.S | re.M)
            managers_emails = str(managers_emails)
            managers_emails = managers_emails.replace('%40', '@')
            Managers_Emails = str(managers_emails)
            if "'" in Managers_Emails:
                Managers_Emails = Managers_Emails.replace("'", "")
                Managers_Emails = Managers_Emails.replace(",", ";")
                Managers_Emails = Managers_Emails.replace(" ", "")
                Managers_Emails = Managers_Emails.replace("[", "")
                Managers_Emails = Managers_Emails.replace("]", "")
            else:
                Managers_Emails = Managers_Emails
            valueSet["Direct Manger Email:"] = str(Managers_Emails[-1])
            valueSet["Manager Emails:"] = str(Managers_Emails)
            a = TableOperator(tablename)
            a._initTable()

            if isInDB(email) > 0:  # in db and in web
                sqlstring = a.updateQuery(valueSet)
                resultSet[email] = 1
            elif isInDB(email) == 0:  # not in db but in web
                valueSet["User ID:"] = User_ID
                sqlstring = a.insertQuery(valueSet)
                resultSet[email] = 3

        # communicate with database
        b = Connector(connString)
        b.sqlQuery = sqlstring
        b.connOpen()
        b.execQuery()
        b.connClose()

    return resultSet
