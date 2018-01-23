;
//debugger;
var caseid, packageid;
var localdata = document.getElementById('caseScript').getAttribute('local-data');
var index = localdata.split("&")[0];
var flag = localdata.split("&")[1];
if (flag == 1) { caseid = index; } else { packageid = index;}
var tatDataLen = 0;  // Control the display of xAxis
var themeColors = [
    //  pyecharts theme
            '#c23531', '#2f4554', '#61a0a8', '#d48265', '#749f83',
            '#ca8622', '#bda29a', '#6e7074', '#546570', '#1296db',
            '#f05b72', '#ef5b9c', '#f47920', '#905a3d', '#fab27b',
            '#2a5caa', '#444693', '#726930', '#b2d235', '#6d8346',
            '#ac6767', '#1d953f', '#6950a1', '#918597', '#5CB85C'
            ];

var fakeDbName = ["Fake.Name"];

var sankeyOption = {
    //title: {
    //    text: 'Dataflow Diagram',
    //    y: 10
    //},
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function (data) {
            var re = /\./;  // there is a dbname named 'E2.2'
            function washDbName(tarObj) {
                for (var i = 0; i < fakeDbName.length; i++) {
                    tarObj = tarObj.replace(fakeDbName[i], fakeDbName[i].replace(".", "_"));
                }
                return tarObj;
            }

            if (data.data.hasOwnProperty("source") || data.data.hasOwnProperty("target")) {  // actually, if there is source, there is target, they cocurrence
                var sourceStr = data.data.source;
                var targetStr = data.data.target;
                sourceStr = washDbName(sourceStr);
                targetStr = washDbName(targetStr);

                if (re.test(sourceStr) || re.test(targetStr)) {
                    if (re.test(sourceStr)) {
                        var tipstr = sourceStr.split(".");
                        var s1 = tipstr[tipstr.length - 2];
                        var s2 = tipstr[tipstr.length - 1];
                        var s0 = tipstr.slice(0, tipstr.length - 2).join(".");
                        return "<h3>From:</h3><strong>Server:</strong> \
                               " + s0 + "<br /><strong>Database:</strong> \
                               " + s1 + "<br /><strong>Table:</strong> " + s2 + "\
                               <h3>To:</h3>" + targetStr;
                    } else if (re.test(targetStr)) {
                        var tipstr = targetStr.split(".");
                        var s1 = tipstr[tipstr.length - 2];
                        var s2 = tipstr[tipstr.length - 1];
                        var s0 = tipstr.slice(0, tipstr.length - 2).join(".");
                        return "<h3>From:</h3>" + sourceStr + "<h3>To:</h3><strong>Server:</strong> \
                               " + s0 + "<br /><strong>Database:</strong> \
                               " + s1 + "<br /><strong>Table:</strong> " + s2;
                    }
                }
            } else if (data.data.hasOwnProperty("name")) {
                var getStr = data.data.name;
                if (re.test(getStr)) {
                    var tipstr = getStr.split(".");
                    var s1 = tipstr[tipstr.length - 2];
                    var s2 = tipstr[tipstr.length - 1];
                    var s0 = tipstr.slice(0, tipstr.length - 2).join(".");
                    return "<strong>Server:</strong> " + s0 + "<br /><strong>Database:</strong> \
                           " + s1 + "<br /><strong>Table:</strong> " + s2;
                } else {
                    return data.name;
                }
            } else {
                return data.name;
            }
        }
    },
    grid: {
        y: 100,
        y2: 100
    },
    series: [
        {
            type: 'sankey',
            layout: 'none',
            data: {},
            links: {},
            label: {
                normal:{
                    show: true,
                    position: 'right',
                    formatter: function (data) {
                        var patt = /\./;  // match the dot
                        if (patt.test(data.name)) {
                            var labelstr = data.name.split(".");  // include server, database and table
                            return labelstr[labelstr.length - 1];
                        } else {
                            return data.name;
                        }
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: '#aaa',
                    shadowColor: 'auto'
                }
            },
            lineStyle: {
                normal: {
                    color: 'source',  // the color of shadow line will follow the items
                    curveness: 0.5
                }
            }
        }
    ],
    color: themeColors
};

var tatMatrixOption = {
    title: {
        text: 'TAT trend for case with specific tasks',
        x: 'center'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: [],
        show: false,
        x: 'center',
        //y: 'bottom',
        y2: 150
    },
    dataZoom: {
        show: true,
        realtime: true,
        y2: 30,
        height: 30,
    },
    grid: {
        y: 50,
        y2: 150
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                rotate: 45,
                interval: function (index, data) {
                    //console.log(index);

                    var interval = Math.ceil(tatDataLen / 6.0);  // only display 6 points
                    if (tatDataLen >= 6) {
                        if (index == 1) {  // display from the six point
                            return true;
                        } else if ((index + 1) % interval == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        //{  // this is a sample for the series data
        //    name: 'task0',
        //    type: 'line',
        //    stack: true,
        //    smooth: true,
        //    itemStyle: { normal: { areaStyle: { type: 'default' } } },
        //    data: [120, 132, 101, 134, 90, 230, 210]
        //}
    ],
    color: themeColors.slice(Math.floor(Math.random()*10), Math.floor(Math.random()*10) + 9)
};

var tatRankOption = {
    title: {
        text: "TOP 10 most \ntime-consumed tasks",
        wrap: true
    },
    tooltip: {
        trigger: 'axis'
    },
    grid:{
        x: 10,
        y: 100
    },
    xAxis: [
        {
            type: 'value',
            show: false
        }
    ],
    yAxis: [
        {
            type: 'category',
            show: false,
            boundaryGap: false,
            data: []
        }
    ],
    series: [
        {
            name: 'Time-used',
            type: 'bar',
            data: [],  // initial this data with the value average over the whole data
            barWidth: 25,
            barGap: 25,
            //barCategoryGap: 25
        }
    ],
    calculable: false,
    color: themeColors.slice(Math.floor(Math.random()*10), Math.floor(Math.random()*10) + 9)
};

var failMatrixOption = {
    title: {
        text: 'Case failure trend on specific tasks',
        x: 'center'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: [],
        show: false,
        x: 'center',
        //y: 'bottom',
        y2: 150
    },
    dataZoom: {
        show: true,
        realtime: true,
        y2: 30,
        height: 30,
    },
    grid: {
        y: 50,
        y2: 150
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
                rotate: 45,
                interval: function (index, data) {
                    //console.log(index);

                    var interval = Math.ceil(tatDataLen / 6.0);  // only display 6 points
                    if (tatDataLen >= 6) {
                        if (index == 1) {  // display from the six point
                            return true;
                        } else if ((index + 1) % interval == 0) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        //{  // this is a sample for the series data
        //    name:'Step Start',
        //    type:'line',
        //    step: 'start',
        //    stack: true,
        //    data:[120, 132, 101, 134, 90, 230, 210]
        //}
    ],
    color: themeColors.slice(Math.floor(Math.random()*10), Math.floor(Math.random()*10) + 9)
};

var failRankOption = {
    title: {
        text: "TOP 10 most \nfragile tasks",
        wrap: true
    },
    tooltip: {
        trigger: 'axis'
    },
    grid:{
        x: 10,
        y: 100
    },
    xAxis: [
        {
            type: 'value',
            show: false
        }
    ],
    yAxis: [
        {
            type: 'category',
            show: false,
            boundaryGap: false,
            data: []
        }
    ],
    series: [
        {
            name: 'Failed Times',
            type: 'bar',
            data: [],  // initial this data with the value average over the whole data
            barWidth: 25,
            barGap: 25,
            //barCategoryGap: 25
        }
    ],
    calculable: false,
    color: themeColors.slice(Math.floor(Math.random()*10), Math.floor(Math.random()*10) + 9)
};

$(document).ready(function () {

    //--------------- general functions clarification ---------------//
    function arrAvg(list) {
        var data = list;
        var res = 0.0;
        if (!data.length) {
            console.log("Empty list provided!");
            return false;
        } else {
            for (var i = 0; i < data.length; i++) {
                res += data[i] / data.length * 1.0;
            }
            return +res.toFixed(2);  //  transfer str to number
        }
    }

    function sortByValue(a, b) {
        /*
            a: the task list
            b: the time consumed by specific task
            3 steps to get the result:
                first, packet a, b as a Object c
                second, sort c by b using js sort by b
                third, return c and unpack c in the main codes 
        */
        // pack data
        var c = [];
        for (var i = 0; i < a.length; i++) {
            exo = new Object();
            exo.name = a[i];
            exo.value = b[i];
            c.push(exo);
        }

        // sort data
        function compare(attr) {
            return function (obj1, obj2) {
                var v1 = obj1[attr];
                var v2 = obj2[attr];
                return v1 - v2;
            }
        }
        c.sort(compare("value"));

        //return c
        return c;
    }

    //--------------- variables and event clarification ---------------//
    var showLen = 10;
    var dataZoomFlag = false;
    var failZoomFlag = false;
    var dataContainer = new Object;

    // instantiate the DOMs for echart object
    $("#sankeydom").width(1000);
    $("#tat_matrix").height(500);
    $("#tat_matrix").width(800);
    $("#tat_rank").height(500);
    $("#tat_rank").width(225);
    $("#failrate").height(500);
    $("#failrate").width(800);
    $("#failraterank").height(500);
    $("#failraterank").width(225);

    var tatChart = echarts.init(document.getElementById("tat_matrix"));
    var tatRank = echarts.init(document.getElementById("tat_rank"));
    var failChart = echarts.init(document.getElementById("failrate"));
    var failRank = echarts.init(document.getElementById("failraterank"));
    tatChart.showLoading({
        text: "Loading...",
    });
    tatRank.showLoading({
        text: "Loading...",
    });
    failChart.showLoading({
        text: "Loading...",
    });
    failRank.showLoading({
        text: "Loading...",
    })

    tatChart.on('datazoom', function (params) {
        if (!dataZoomFlag) {
            dataZoomFlag = true;
            setTimeout(function () {
                console.log(params);
                var sLen = tatMatrixOption.xAxis[0].data.length - 1;
                var s_point = Math.ceil(params.start * sLen / 100.0);
                var e_point = Math.floor(params.end * sLen / 100.0) + 1;
                var dz_y_data = [];
                var dz_s_data = [];
                var tLen = dataContainer.tasklist.length;

                tatDataLen = e_point - s_point;

                if (tLen <= showLen) {
                    for (var i = 0; i < tLen; i++) {
                        dz_y_data.push(tatMatrixOption.series[i].name);
                        dz_s_data.push(arrAvg(tatMatrixOption.series[i].data.slice(s_point, e_point)));
                    }

                    sortRes = sortByValue(dz_y_data, dz_s_data);
                    dz_y_data = sortRes.map(function (v) { return v.name; });
                    dz_s_data = sortRes.map(function (v) { return v.value; });
                    tatRankOption.yAxis[0].data = dz_y_data;
                    tatRankOption.series[0].data = dz_s_data;

                    tatRank.setOption(tatRankOption);
                } else if (tLen > showLen) {  
                    dz_y_data = dataContainer.tasklist;
                    for (var i = 0; i < dataContainer.tasklist.length; i++) {
                        dz_s_data.push(arrAvg(dataContainer.tatdata[dataContainer.tasklist[i]].slice(s_point, e_point)));
                    }

                    sortRes = sortByValue(dz_y_data, dz_s_data);
                    dz_y_data = sortRes.map(function (v) { return v.name; });
                    dz_s_data = sortRes.map(function (v) { return v.value; });
                    tatRankOption.yAxis[0].data = dz_y_data.slice(dz_y_data.length - 10, dz_y_data.length);
                    tatRankOption.series[0].data = dz_s_data.slice(dz_y_data.length - 10, dz_y_data.length);

                    tatRank.setOption(tatRankOption);
                } else {
                    alert("No data available!");
                }

                dataZoomFlag = false;
            }, 300);
        }
    });

    failChart.on('datazoom', function (params) {
        if (!failZoomFlag) {
            failZoomFlag = true;
            setTimeout(function () {
                console.log(params);
                var sLen = failMatrixOption.xAxis[0].data.length - 1;
                var s_point = Math.ceil(params.start * sLen / 100.0);
                var e_point = Math.floor(params.end * sLen / 100.0) + 1;
                var df_y_data = [];
                var df_s_data = [];
                var tLen = dataContainer.tasklist.length;

                tatDataLen = e_point - s_point;

                if (tLen <= showLen) {
                    for (var i = 0; i < tLen; i++) {
                        df_y_data.push(failMatrixOption.series[i].name);
                        df_s_data.push(failMatrixOption.series[i].data.slice(s_point, e_point).reduce(function (v1, v2) { return v1 + v2; }, 0));
                    }

                    sortRes = sortByValue(df_y_data, df_s_data);
                    df_y_data = sortRes.map(function (v) { return v.name; });
                    df_s_data = sortRes.map(function (v) { return v.value; });
                    failRankOption.yAxis[0].data = df_y_data;
                    failRankOption.series[0].data = df_s_data;

                    failRank.setOption(failRankOption);
                } else if (tLen > showLen) {
                    df_y_data = dataContainer.tasklist;
                    for (var i = 0; i < dataContainer.tasklist.length; i++) {
                        df_s_data.push(dataContainer.faildata[dataContainer.tasklist[i]].slice(s_point, e_point).reduce(function (v1, v2) { return v1 + v2; },0));
                    }

                    sortRes = sortByValue(df_y_data, df_s_data);
                    df_y_data = sortRes.map(function (v) { return v.name; });
                    df_s_data = sortRes.map(function (v) { return v.value; });
                    failRankOption.yAxis[0].data = df_y_data.slice(df_y_data.length - 10, df_y_data.length);
                    failRankOption.series[0].data = df_s_data.slice(df_s_data.length - 10, df_s_data.length);

                    failRank.setOption(failRankOption);
                } else {
                    alert("No data available!");
                }

                failZoomFlag = false;
            }, 300);
        }
    });

    //--------------- load data ---------------//
    $.ajax({
        url: "/casejsondata",
        data: {
            "cid": caseid,
            "matrice": "sankey"
        },
        success: function (data) {
            //--- init dom height ---//
            var s_count = 0;
            var t_count = 0;
            var sourceSet = [];
            var targetSet = [];
            var unitHeight = 25;  // the base pixel number for the height of Sankey is 22.5, round to 25
            var maxCount = 0;

            sourceSet = data.links.map(function (v) { if (v.source != data.nodes[0].name) { return v.source; } });
            targetSet = data.links.map(function (v) { if (v.target != data.nodes[0].name) { return v.target; } });
            if (sourceSet) { $.each(sourceSet, function (v) { if (typeof (v) !== "undefined") { s_count++; } }); }
            if (targetSet) { $.each(targetSet, function (v) { if (typeof (v) !== "undefined") { t_count++; } }); }
            if (sourceSet && targetSet) { maxCount = (s_count >= t_count) ? s_count : t_count; } else { alert("Data validation failed!") }
            $("#sankeydom").height(unitHeight * maxCount);
            var sankeyChart = echarts.init(document.getElementById('sankeydom'));
            sankeyChart.showLoading({
                text: 'Loading...',
            });

            sankeyOption.series[0].data = data.nodes;
            sankeyOption.series[0].links = data.links;

            sankeyChart.hideLoading();
            sankeyChart.setOption(sankeyOption);
        },
        dataType: "json"
    });

    // serve data from caseid
    if (caseid) {
        $.ajax({
            url: "/casejsondata",
            data: {
                "cid": caseid,
                "matrice": "kpi"
            },
            success: function (data) {
                console.log(data);

                $("#casesizedata").text(data.Csize);
                $("#tablevolsdata").text(data.TskMaxVols);
                $("#tableamountdata").text(data.TblNum);
                $("#failedimg").text("");
                if (data.FailedTskNum > 0) {
                    $("#failedimg").html("<img src=\"../static/img/danger1.png\" alt=\"failedtask\">");
                } else if (data.FailedTskNum == 0) {
                    $("#failedimg").html("<img src=\"../static/img/danger0.png\" alt=\"failedtask\">");
                }
                $("#failedtaskdata").text(data.FailedTskNum);
            },
            dataType: 'json'
        });
    
        $.ajax({
            url: "/casejsondata",
            data: {
                "cid": caseid,
                "matrice": "tat"
            },
            success: function (data) {
                console.log("data response success");
                tatChart.hideLoading();
                tatRank.hideLoading();
                failChart.hideLoading();
                failRank.hideLoading();

                var dz_y_data = [];
                var dz_s_data = [];
                var df_y_data = [];
                var df_s_data = [];
                var sortRes = new Object();  // has attributes: name & value

                dataContainer = data;  // keep the data for later usage
                tatDataLen = data.timelist.length;
                tatMatrixOption.series = [];
                tatMatrixOption.xAxis[0].data = data.timelist;
                failMatrixOption.series = [];
                failMatrixOption.xAxis[0].data = data.timelist;

                dz_y_data = data.tasklist;
                df_y_data = data.tasklist;
            
                if(data.tasklist.length <= showLen){  // number of tasks <= 10
                    tatMatrixOption.legend.data = data.tasklist;
                    failMatrixOption.legend.data = data.tasklist;

                    for (var i = 0; i < data.tasklist.length; i++) {
                        o1 = new Object();
                        o1.name = data.tasklist[i];
                        o1.type = "line";
                        o1.stack = true;
                        o1.smooth = true;
                        o1.itemStyle = { normal: { areaStyle: { type: 'default' } } };
                        o1.data = data.tatdata[data.tasklist[i]];
                        tatMatrixOption.series.push(o1);
                        dz_s_data.push(arrAvg(data.tatdata[data.tasklist[i]]));

                        o2 = new Object();
                        o2.name = data.tasklist[i];
                        o2.type = "line";
                        o2.stack = true;
                        o2.step = true;
                        o2.data = data.faildata[data.tasklist[i]];
                        failMatrixOption.series.push(o2);
                        df_s_data.push(data.faildata[data.tasklist[i]].reduce(function (v1, v2) { return v1 + v2; }, 0));
                    }

                    sortRes = sortByValue(dz_y_data, dz_s_data);
                    dz_y_data = sortRes.map(function (v) { return v.name; });
                    dz_s_data = sortRes.map(function (v) { return v.value; });
                    tatRankOption.yAxis[0].data = dz_y_data;
                    tatRankOption.series[0].data = dz_s_data;

                    sortRes = sortByValue(df_y_data, df_s_data);
                    df_y_data = sortRes.map(function (v) { return v.name; });
                    df_s_data = sortRes.map(function (v) { return v.value; });
                    failRankOption.yAxis[0].data = df_y_data;
                    failRankOption.series[0].data = df_s_data;
                } else if (data.tasklist.length > showLen) {  // number of tasks > 10
                    // handle TAT, the rank chart is powered by average calculation
                    tatMatrixOption.legend.data = ["Total TAT of Case"];
                    o1 = new Object();
                    o1.name = "Total TAT of Case";
                    o1.type = "line";
                    o1.stack = true;
                    o1.smooth = true;
                    o1.itemStyle = { normal: { areaStyle: { type: 'default' } } };
                    o1.data = data.tatdata[data.tasklist[0]].map(function(i){return 0.0;});  // generate a list that length equals to the time Axis

                    for (var i = 0; i < data.tasklist.length; i++) {
                        o1.data = o1.data.map(function (value, j) { return value + data.tatdata[data.tasklist[i]][j]; });
                        dz_s_data.push(arrAvg(data.tatdata[data.tasklist[i]]));
                    }
                    o1.data = o1.data.map(function (value) { return +value.toFixed(2); });
                    tatMatrixOption.series.push(o1);
                
                    sortRes = sortByValue(dz_y_data, dz_s_data);
                    dz_y_data = sortRes.map(function (v) { return v.name; });
                    dz_s_data = sortRes.map(function (v) { return v.value; });
                    tatRankOption.yAxis[0].data = dz_y_data.slice(dz_y_data.length - 10, dz_y_data.length);
                    tatRankOption.series[0].data = dz_s_data.slice(dz_y_data.length - 10, dz_y_data.length);

                    // handle failure rate, the rank chart is powered by sum calculation
                    failMatrixOption.legend.data = ["Total No. of Failure"];
                    o2 = new Object();
                    o2.name = "Total No. of Failure";
                    o2.type = "line";
                    o2.stack = true;
                    o2.step = true;
                    o2.itemStyle = { normal: { areaStyle: { type: 'default' } } };
                    o2.data = data.faildata[data.tasklist[0]].map(function (i) { return 0.0; });

                    for (var i = 0; i < data.tasklist.length; i++) {
                        o2.data = o2.data.map(function (value, j) { return value + data.faildata[data.tasklist[i]][j]; });
                        df_s_data.push(data.faildata[data.tasklist[i]].reduce(function (v1, v2) { return v1 + v2; }, 0));
                    }
                    failMatrixOption.series.push(o2);

                    sortRes = sortByValue(df_y_data, df_s_data);
                    df_y_data = sortRes.map(function (v) { return v.name; });
                    df_s_data = sortRes.map(function (v) { return v.value; });
                    failRankOption.yAxis[0].data = df_y_data.slice(df_y_data.length - 10, df_y_data.length);
                    failRankOption.series[0].data = df_s_data.slice(df_s_data.length - 10, df_s_data.length);

                } else {
                    alert("No data available!");
                }
                tatChart.setOption(tatMatrixOption);
                tatRank.setOption(tatRankOption);

                failChart.setOption(failMatrixOption);
                failRank.setOption(failRankOption);
            },
            dataType: "json"
        });
    }
    // serve data from packageid, need optimization
    if (packageid) {
        $.ajax({
            url: "/casejsondata",
            data: {
                "pid": packageid,
                "matrice": "tat"
            },
            success: function (data) {
                console.log("data response success");
                tatChart.hideLoading();
                tatRank.hideLoading();
                failChart.hideLoading();
                failRank.hideLoading();

                var dz_y_data = [];
                var dz_s_data = [];
                var df_y_data = [];
                var df_s_data = [];
                var sortRes = new Object();  // has attributes: name & value

                dataContainer = data;  // keep the data for later usage
                tatDataLen = data.timelist.length;
                tatMatrixOption.series = [];
                tatMatrixOption.xAxis[0].data = data.timelist;
                failMatrixOption.series = [];
                failMatrixOption.xAxis[0].data = data.timelist;

                dz_y_data = data.tasklist;
                df_y_data = data.tasklist;

                if (data.tasklist.length <= showLen) {  // number of tasks <= 10
                    tatMatrixOption.legend.data = data.tasklist;
                    failMatrixOption.legend.data = data.tasklist;

                    for (var i = 0; i < data.tasklist.length; i++) {
                        o1 = new Object();
                        o1.name = data.tasklist[i];
                        o1.type = "line";
                        o1.stack = true;
                        o1.smooth = true;
                        o1.itemStyle = { normal: { areaStyle: { type: 'default' } } };
                        o1.data = data.tatdata[data.tasklist[i]];
                        tatMatrixOption.series.push(o1);
                        dz_s_data.push(arrAvg(data.tatdata[data.tasklist[i]]));

                        o2 = new Object();
                        o2.type = "line";
                        o2.stack = true;
                        o2.step = true;
                        o2.data = data.faildata[data.tasklist[i]];
                        failMatrixOption.series.push(o2);
                        df_s_data.push(data.faildata[data.tasklist[i]].reduce(function (v1, v2) { return v1 + v2; }, 0));
                    }

                    sortRes = sortByValue(dz_y_data, dz_s_data);
                    dz_y_data = sortRes.map(function (v) { return v.name; });
                    dz_s_data = sortRes.map(function (v) { return v.value; });
                    tatRankOption.yAxis[0].data = dz_y_data;
                    tatRankOption.series[0].data = dz_s_data;

                    sortRes = sortByValue(df_y_data, df_s_data);
                    df_y_data = sortRes.map(function (v) { return v.name; });
                    df_s_data = sortRes.map(function (v) { return v.value; });
                    failRankOption.yAxis[0].data = df_y_data;
                    failRankOption.series[0].data = df_s_data;
                } else if (data.tasklist.length > showLen) {  // number of tasks > 10

                    tatMatrixOption.legend.data = ["Total TAT of Case"];
                    o1 = new Object();
                    o1.name = "Total TAT of Case";
                    o1.type = "line";
                    o1.stack = true;
                    o1.smooth = true;
                    o1.itemStyle = { normal: { areaStyle: { type: 'default' } } };
                    o1.data = data.tatdata[data.tasklist[0]].map(function (i) { return 0.0; });  // generate a list that length equals to the time Axis

                    for (var i = 0; i < data.tasklist.length; i++) {
                        o1.data = o1.data.map(function (value, j) { return value + data.tatdata[data.tasklist[i]][j]; });
                        dz_s_data.push(arrAvg(data.tatdata[data.tasklist[i]]));
                    }
                    o1.data = o1.data.map(function (value) { return +value.toFixed(2); });
                    tatMatrixOption.series.push(o1);

                    sortRes = sortByValue(dz_y_data, dz_s_data);
                    dz_y_data = sortRes.map(function (v) { return v.name; });
                    dz_s_data = sortRes.map(function (v) { return v.value; });
                    tatRankOption.yAxis[0].data = dz_y_data.slice(dz_y_data.length - 10, dz_y_data.length);
                    tatRankOption.series[0].data = dz_s_data.slice(dz_s_data.length - 10, dz_s_data.length);

                    failMatrixOption.legend.data = ["Total No. of Failure"];
                    o2 = new Object();
                    o2.name = "Total No. of Failure";
                    o2.type = "line";
                    o2.stack = true;
                    o2.step = true;
                    o2.itemStyle = { normal: { areaStyle: { type: 'default' } } };
                    o2.data = data.faildata[data.tasklist[0]].map(function (i) { return 0.0; });

                    for (var i = 0; i < data.tasklist.length; i++) {
                        o2.data = o2.data.map(function (value, j) { return value + data.faildata[data.tasklist[i]][j]; });
                        df_s_data.push(data.faildata[data.tasklist[i]].reduce(function (v1, v2) { return v1 + v2; }, 0));
                    }
                    failMatrixOption.series.push(o2);

                    sortRes = sortByValue(df_y_data, df_s_data);
                    df_y_data = sortRes.map(function (v) { return v.name; });
                    df_s_data = sortRes.map(function (v) { return v.value; });
                    failRankOption.yAxis[0].data = df_y_data.slice(df_y_data.length - 10, df_y_data.length);
                    failRankOption.series[0].data = df_s_data.slice(df_s_data.length - 10, df_s_data.length);

                } else {
                    alert("No data available!");
                }
                tatChart.setOption(tatMatrixOption);
                tatRank.setOption(tatRankOption);

                failChart.setOption(failMatrixOption);
                failRank.setOption(failRankOption);
            },
            dataType: "json"
        });
    }
});