# BI Visualization Demo #
Edit on: 1/23/2018 1:31:45 PM  

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

If you want to customize your owner dashboard via this demo, please continue the following section.


> **Coding Structure**

To be continued...
