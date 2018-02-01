# BI Visualization Demo #
Edit on: 1/24/2018 1:34:20 PM   

----------

**BI Visualization Demo** is targeting to release a runnable demo, which makes you can directly operate on it to address your business.

> **How To Use** 

This web app demo is a python based web application, powered by [web.py](http://webpy.org/). The technical set front-end used: CSS - [Bootstrap](http://www.runoob.com/bootstrap/bootstrap-tab-plugin.html), Javascript - [jQuery](http://jquery.com/), Visualization libs - [Echarts](http://echarts.baidu.com/). And the back-end database is the python built-in sqlite3.

Enviroment configuration:

- Python==2.7.13
- jQuery==3.2.1
- Bootstrap==3.3.7 
- Echarts==3.6.2

and jQuery, Bootstrap, and Echarts components are already in this repo. The only thing you need to make sure is Python and the library dependency. See the [*requirements.txt*](./requirements.txt), type the codes:

	pip install -r path/to/requirements.txt

After the dependency installed, then you just need to type commands to let the web app started.

	cd path/to/the_repo_folder
	python webService.py xxxx  # if leave xxxx blank, the default port will be 8080
	
if the screen shows [http://0.0.0.0:8080](http://localhost:8080), means you has successfully running the web app.

> **The App's Content**

This demo is a integral project from back-end to front-end. There is a sample database you should put in your repo's root - [test.db](https://pan.baidu.com/s/1dkqUJ0), the access password is: **w75r**.

Here shows the content of **the logon page** of the website, the default user email address is *admin@sample.com* and default password is *123456*:

![Logon Page](https://i.imgur.com/ueLmXH5.gif)

You can find the main dashboard page which gives the cpu usage in default view. There is a dropdown button which can shift the indexes that monitored.

![Index Shift](https://i.imgur.com/YpfcN2X.gif)

If you are interested in exploring more detail for each machine, just click the gauge of CPU/Memory,

![Case Page](https://i.imgur.com/tjwkeqt.gif)

For each sample ETL case, you can browse the dashboard that analyzes whether this case is health, diving into the execution consumption of each step. See below pic to jump to ETL case detail.

![Dashboard](https://i.imgur.com/54g5inp.gif)

If you want to customize your own dashboard via this demo, please continue the following section.


> **Coding Structure**

The project directory tree:

	.
	|   change.log
	|   ReadMe.md
	|   requirements.txt
	|   settings.py
	|   test.db
	|   test.py
	|   urls.py
	|   webService.py
	|   <br />
	+---configurations
	|   |   db.config
	|   |   url.config
	|   <br />            
	+---static
	|   +---css
	|   |       bootstrap-theme.css
	|   |       bootstrap-theme.css.map
	|   |       bootstrap-theme.min.css
	|   |       bootstrap-theme.min.css.map
	|   |       bootstrap.css
	|   |       bootstrap.css.map
	|   |       bootstrap.min.css
	|   |       bootstrap.min.css.map
	|   |       tutorial.css
	|   |       xmlstyle.css
	|   |       
	|   +---data
	|   |       casepageSankey.json
	|   |       
	|   +---fonts
	|   |       glyphicons-halflings-regular.eot
	|   |       glyphicons-halflings-regular.svg
	|   |       glyphicons-halflings-regular.ttf
	|   |       glyphicons-halflings-regular.woff
	|   |       glyphicons-halflings-regular.woff2
	|   |       
	|   +---img
	|   |       danger0.png
	|   |       danger1.png
	|   |       gc_logo.png
	|   |       glyphicons-halflings-white.png
	|   |       glyphicons-halflings.png
	|   |       home.jpg
	|   |       home1.jpg
	|   |       home2.jpg
	|   |       info.png
	|   |       Loading.gif
	|   |       logo.png
	|   |       sizeinfo.png
	|   |       success.png
	|   |       warning.png
	|   |       webinput.jpg
	|   |       
	|   \---js
	|       |   bootstrap.js
	|       |   bootstrap.min.js
	|       |   bootstrap.validator.js
	|       |   jquery.min.js
	|       |   json.js
	|       |   npm.js
	|       |   
	|       +---echarts
	|       |       echarts.api.map.js
	|       |       echarts.api.mapfull.js
	|       |       echarts.bmap.min.js
	|       |       echarts.min.js
	|       |       
	|       \---misc
	|               casepage.js
	|               dailytracking.js
	|               mainpage.js
	|               wkrpage.js
	|   <br />            
	+---templates
	|       casepage.html
	|       dailymonitor.html
	|       email_input.html
	|       home.html
	|       login.html
	|       logout.html
	|       mainpage.html
	|       output.html
	|       subpage.html
	|       testdemo.html
	|   <br />       
	+---utils
	        dataRequest.py
	        dbAccess.py
	        querySettings.py
	        readConfig.py
	        sqlserver2sqlite.py
	        webCrawl.py
	        __init__.py
	        
There are 4 folders and 8 files in root directory. 

### configurations ###

In this folder, we defined two config files, respectively for the database and urls for crawling web data (currently not supported in this demo).

### statics ###

The static files for front-end web pages, such as CSS, JS and images are stored here. Since this demo aims to give a executable website with web.py framework, we will target the mainstream at how the frame applied, those front-end files will be introduced at a glimpse to support the understanding the frame, not the main points.

### templates ###

HTML files for displaying the contents are listed in this folder. You can customize your own pages and put it in this folder.

### utils ###

Containing main functions on back-end system, including data re-structuring and response module, database access module, data query module and read configuration files module.

   