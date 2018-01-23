;
//debugger;
var timerGap = 1000 * 60 * 5;  // 5 mins
var themeColors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#749f83", "#ca8622", "#bda29a",
                "#6e7074", "#546570", "#c4ccd3", "#f05b72", "#ef5b9c", "#f47920", "#905a3d",
                "#fab27b", "#2a5caa", "#444693", "#726930", "#b2d235", "#6d8346", "#ac6767",
                "#1d953f", "#6950a1", "#918597", "#f6f5ec"];
var bicwkr3cpu = echarts.init(document.getElementById('bicwkr3_cpu'));
var bicwkr4cpu = echarts.init(document.getElementById('bicwkr4_cpu'));
var bicwkr5cpu = echarts.init(document.getElementById('bicwkr5_cpu'));
var bicwkr6cpu = echarts.init(document.getElementById('bicwkr6_cpu'));
var cputrendChart = echarts.init(document.getElementById('cputrend'));

bicwkr3cpu.showLoading({
    text: 'Loading...',    
});
bicwkr4cpu.showLoading({
    text: 'Loading...',    
});
bicwkr5cpu.showLoading({
    text: 'Loading...',    
});
bicwkr6cpu.showLoading({
    text: 'Loading...',    
});
cputrendChart.showLoading({
    text: 'Loading...',    
});

var bicwkr3memory = echarts.init(document.getElementById('bicwkr3_memory'));
var bicwkr4memory = echarts.init(document.getElementById('bicwkr4_memory'));
var bicwkr5memory = echarts.init(document.getElementById('bicwkr5_memory'));
var bicwkr6memory = echarts.init(document.getElementById('bicwkr6_memory'));
var memorytrendChart = echarts.init(document.getElementById('memorytrend'));

var bicwkrdisk = echarts.init(document.getElementById('bicwkr_disks'));
var sysdisktrendChart = echarts.init(document.getElementById('sysdisktrend'));
var datadisktrendChart = echarts.init(document.getElementById('datadisktrend'));

var casechart_cpu = echarts.init(document.getElementById("case_summary_cpu"));
var casechart_mem = echarts.init(document.getElementById("case_summary_memory"));
var casechart_disk = echarts.init(document.getElementById("case_summary_disk"));

casechart_cpu.showLoading({
    text: 'Loading...',
});

// generate options
function createGaugeOption(wkrName, dataName, dataValue) {
    return {
        backgroundColor: "#fff",
        title: [
            {
                textStyle: {
                    color: "#000",
                    fontSize: 18
                },
                text: wkrName,
                top: "auto",
                left: "auto"
            }
        ],
        color: themeColors,
        series: [
            {
                endAngle: 0,
                name: wkrName,  // sample: "MACHINE4"
                min: 0,
                max: 100,
                axisLabel: {
                    show: false
                },
                startAngle: 180,
                type: "gauge",
                detail: {
                    formatter: "{value}%"
                },
                data: [
                    {
                        name: dataName,
                        value: dataValue
                    }
                ]
            }
        ],
        legend: [
            {
                show: false
            }
        ],
        tooltip: {
            axisPointer: {
                type: "line"
            },
            trigger: "item",
            formatter: "{a} <br/>{b} : {c}%",
            triggerOn: "mousemove|click",
            textStyle: {
                color: "#fff",
                fontSize: 14
            }
        }
    };
}

function createTrendOption(dataName) {
    return {
        backgroundColor: "#fff",
        title: [
            {
                textStyle: {
                    color: "#000",
                    "fontSize": 18
                },
                text: dataName + " usage trend",
                top: "auto",
                left: "auto"
            }
        ],
        color: themeColors,
        series: [
            {
                symbol: "emptyCircle",
                data: [],
                showSymbol: true,
                name: "MACHINE2",
                type: "line",
                smooth: true,
                label: {
                    emphasis: {
                        show: true
                    },
                    normal: {
                        position: "top",
                        textStyle: {
                            color: "#000",
                            fontSize: 12
                        },
                        formatter: null,
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        opacity: 1,
                        width: 1,
                        type: "solid",
                        curveness: 0,
                        color: null
                    }
                }
            },
            {
                symbol: "emptyCircle",
                data: [],
                showSymbol: true,
                name: "MACHINE3",
                type: "line",
                smooth: true,
                label: {
                    emphasis: {
                        show: true
                    },
                    normal: {
                        position: "top",
                        textStyle: {
                            color: "#000",
                            fontSize: 12
                        },
                        formatter: null,
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        opacity: 1,
                        width: 1,
                        type: "solid",
                        curveness: 0,
                        color: null
                    }
                }
            },
            {
                symbol: "emptyCircle",
                data: [],
                showSymbol: true,
                name: "MACHINE4",
                type: "line",
                smooth: true,
                label: {
                    emphasis: {
                        show: true
                    },
                    normal: {
                        position: "top",
                        textStyle: {
                            color: "#000",
                            fontSize: 12
                        },
                        formatter: null,
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        opacity: 1,
                        width: 1,
                        type: "solid",
                        curveness: 0,
                        color: null
                    }
                }
            },
            {
                symbol: "emptyCircle",
                data: [],
                showSymbol: true,
                name: "MACHINE5",
                type: "line",
                smooth: true,
                label: {
                    emphasis: {
                        show: true
                    },
                    normal: {
                        position: "top",
                        textStyle: {
                            color: "#000",
                            fontSize: 12
                        },
                        formatter: null,
                        show: false
                    }
                },
                lineStyle: {
                    normal: {
                        opacity: 1,
                        width: 1,
                        type: "solid",
                        curveness: 0,
                        color: null
                    }
                }
            }
        ],
        "yAxis": [
            {
                axisLabel: {
                    show: false
                },
                boundaryGap: true,
                nameTextStyle: {
                    fontSize: 14
                },
                nameGap: 25,
                nameLocation: "middle",
                inverse: false,
                type: "value"
            }
        ],
        tooltip: {
            axisPointer: {
                type: "line"
            },
            trigger: "item",
            formatter: null,
            triggerOn: "mousemove|click",
            textStyle: {
                color: "#fff",
                fontSize: 14
            }
        },
        xAxis: [
            {
                axisLabel: {
                    interval: 2,
                    show: false
                },
                boundaryGap: true,
                nameTextStyle: {
                    fontSize: 14
                },
                nameGap: 25,
                data: [],
                nameLocation: "middle",
                axisTick: {
                    alignWithLabel: false
                },
                inverse: false,
                type: "category"
            }
        ],
        legend: [
            {
                textStyle: {
                    color: "#333",
                    fontSize: 12
                },
                show: true,
                selectedMode: "multiple",
                y: "bottom",
                x: "center",
                data: ["MACHINE2", "MACHINE3", "MACHINE4", "MACHINE5"],
                orient: "horizontal"
            }
        ]
    };
} 

// for timer control
var timercpu, timermemory, timerdisk;

var casetrendOption = {
    title: {
        x: 'left',
        text: 'RIT case summary'
    },
    tooltip: {
        trigger: 'item'
    },
    calculable: true,
    grid: {
        borderWidth: 0,
        y: 60,
        y2: 60
    },
    yAxis: [
        {
            type: 'category',
            show: false,
            data: ['#Processing Case', '#Pending Case', '#Failed Case', '#Case']
        }
    ],
    xAxis: [
        {
            type: 'value',
            show: false
        }
    ],
    series: [
        {
            name: 'RIT case summary',
            type: 'bar',
            barCategoryGap: '60%',
            itemStyle: {
                normal: {
                    color: function (params) {
                        // build a color map as your need.
                        var colorList = [
                         '#F4E001', '#B5C334', '#C1232B', '#F0805A'
                        ];
                        return colorList[params.dataIndex];
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}:{c}'
                    }
                }
            },
            data: []
        }
    ]
};

var dataStyle = { 
    normal: {
        label : {
            show: true,
            position: 'insideRight',
            formatter: '{a}: {c}%'
        },
        color: function(params){
            var colorList = ['#91c7ae', '#3B7386', '#DF6165']; 
            if(params.data>0 && params.data<=20){
                return colorList[0];
            }else if(params.data>20 && params.data<=80){
                return colorList[1];
            }else{
                return colorList[2];
            }
        }
    }
};

var bicwkrdisksOption = {
    title: {
        text: 'Disk space usage of wkrs'
        //subtext: 'From ExcelHome',
        //sublink: 'http://e.weibo.com/1341556070/AiEscco0H'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            
            type : 'shadow'        
        },
        formatter : '{b}<br/>{a0}: {c0}%<br/>{a1}: {c1}%'
    },
    legend: {
        y: 55,
        itemGap: document.getElementById('bicwkr_disks').offsetWidth / 8,
        data: ['Data Disk', 'Sys Disk'],
        show: false
    },
    grid: {
        y: 80,
        y2: 30
    },
    xAxis : [
        {
            type : 'value',
            position: 'top',
            splitLine: {show: false},
            axisLabel: {show: false},
            axisLine:{show: false}
        }
    ],
    yAxis : [
        {
            type : 'category',
            splitLine: {show: true},
            data : ['MACHINE5', 'MACHINE4', 'MACHINE3', 'MACHINE2']
        }
    ],
    series: [
        {
            name:'Data Disk',
            type:'bar',
            itemStyle : dataStyle,
            data:[]
        },
        {
            name:'Sys Disk',
            type:'bar',
            itemStyle : dataStyle,
            data:[]
        }
    ]
};

var sysdiskOption = {
    title: {
        text: 'Sys disk usage trend'
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        },
        formatter: '{b}</br>{a} sys disk usage rate: {c}%'
    },
    legend: {
        data: ['MACHINE2', 'MACHINE3', 'MACHINE4', 'MACHINE5'],
        show: false
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLabel: {
                show: false,
                interval: 2
            },
            axisTick: { show: false }
        }
    ],
    yAxis: [
        {
            type: 'value',
            splitArea: { show: true },
            axisLabel: {
                show: false,
                interval: 2
            },
            axisTick: { show: false }
        }
    ],
    grid: {
        x: 40,
        width: 300,
        y2: 30
    },
    series: [
        {
            name: 'MACHINE2',
            type: 'line',
            data: []
        },
        {
            name: 'MACHINE3',
            type: 'line',
            data: []
        },
        {
            name: 'MACHINE4',
            type: 'line',
            data: []
        },
        {
            name: 'MACHINE5',
            type: 'line',
            data: []
        }
    ]
};

var datadiskOption = {
    title: {
        text: 'Data disk usage trend'
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        },
        formatter: '{b}</br>{a} data disk usage rate: {c}%'
    },
    legend: {
        data: ['MACHINE2', 'MACHINE3', 'MACHINE4', 'MACHINE5'],
        x: 'center',
        y: 'bottom'
    },
    calculable: true,
    xAxis: [
        {
            type: 'category',
            data: [],
            axisLabel: {
                show: false,
                interval: 2
            },
            axisTick: { show: false }
        }
    ],
    yAxis: [
        {
            type: 'value',
            splitArea: { show: true },
            axisLabel: {
                show: false,
                interval: 2
            },
            axisTick: { show: false }
        }
    ],
    grid: {
        x: 40,
        width: 300,
        y2: 30
    },
    series: [
        {
            name: 'MACHINE2',
            type: 'line',
            data: []
        },
        {
            name: 'MACHINE3',
            type: 'line',
            data: []
        },
        {
            name: 'MACHINE4',
            type: 'line',
            data: []
        },
        {
            name: 'MACHINE5',
            type: 'line',
            data: []
        }
    ]
};

function getcpudata() {
    if (timermemory) {
        clearInterval(timermemory);
    };

    timercpu = setInterval(function () {
        $.ajax({
            url: "/jsondata",
            data: {
                "matrice": "cpu"
            },
            success: function (data) {
                bicwkr3cpu.hideLoading();
                bicwkr4cpu.hideLoading();
                bicwkr5cpu.hideLoading();
                bicwkr6cpu.hideLoading();
                cputrendChart.hideLoading();
               
                var bicwkr3Option = createGaugeOption("MACHINE2", "CPU", data.cpudata["MACHINE2"]);
                var bicwkr4Option = createGaugeOption("MACHINE3", "CPU", data.cpudata["MACHINE3"]);
                var bicwkr5Option = createGaugeOption("MACHINE4", "CPU", data.cpudata["MACHINE4"]);
                var bicwkr6Option = createGaugeOption("MACHINE5", "CPU", data.cpudata["MACHINE5"]);
                var cpuTrendOption = createTrendOption("CPU");

                cpuTrendOption.xAxis[0].data = data.cputrend.xdata;
                for (var i = 0; i < cpuTrendOption.series.length; i++) {
                    cpuTrendOption.series[i].data = data.cputrend.ydata[cpuTrendOption.series[i].name];
                }

                bicwkr3cpu.setOption(bicwkr3Option);
                bicwkr4cpu.setOption(bicwkr4Option);
                bicwkr5cpu.setOption(bicwkr5Option);
                bicwkr6cpu.setOption(bicwkr6Option);
                cputrendChart.setOption(cpuTrendOption);
            },
            dataType: "json"
        });
    }, timerGap);
};

function getmemorydata() {
    if (timercpu) {
        clearInterval(timercpu);
    };

    timermemory = setInterval(function () {
        $.ajax({
            url: "/jsondata",
            data: {
                "matrice": "memory"
            },
            success: function (data) {
                var bicwkr3Option = createGaugeOption("MACHINE2", "Memory", data.memorydata["MACHINE2"]);
                var bicwkr4Option = createGaugeOption("MACHINE3", "Memory", data.memorydata["MACHINE3"]);
                var bicwkr5Option = createGaugeOption("MACHINE4", "Memory", data.memorydata["MACHINE4"]);
                var bicwkr6Option = createGaugeOption("MACHINE5", "Memory", data.memorydata["MACHINE5"]);
                var memoryTrendOption = createTrendOption("Memory");

                memoryTrendOption.xAxis[0].data = data.memorytrend.xdata;
                for (var i = 0; i < memoryTrendOption.series.length; i++) {
                    memoryTrendOption.series[i].data = data.memorytrend.ydata[memoryTrendOption.series[i].name];
                }

                bicwkr3memory.setOption(bicwkr3Option);
                bicwkr4memory.setOption(bicwkr4Option);
                bicwkr5memory.setOption(bicwkr5Option);
                bicwkr6memory.setOption(bicwkr6Option);
                memorytrendChart.setOption(memoryTrendOption);
            },
            dataType: "json"
        });
    }, timerGap);
};

$(document).ready(function () {
    // process cpu
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "cpu"
        },
        success: function (data) {
            console.log(data);
            bicwkr3cpu.hideLoading();
            bicwkr4cpu.hideLoading();
            bicwkr5cpu.hideLoading();
            bicwkr6cpu.hideLoading();
            cputrendChart.hideLoading();

            var bicwkr3Option = createGaugeOption("MACHINE2", "CPU", data.cpudata["MACHINE2"]);
            var bicwkr4Option = createGaugeOption("MACHINE3", "CPU", data.cpudata["MACHINE3"]);
            var bicwkr5Option = createGaugeOption("MACHINE4", "CPU", data.cpudata["MACHINE4"]);
            var bicwkr6Option = createGaugeOption("MACHINE5", "CPU", data.cpudata["MACHINE5"]);
            var cpuTrendOption = createTrendOption("CPU");

            cpuTrendOption.xAxis[0].data = data.cputrend.xdata;
            for (var i = 0; i < cpuTrendOption.series.length; i++) {
                cpuTrendOption.series[i].data = data.cputrend.ydata[cpuTrendOption.series[i].name];
            }

            bicwkr3cpu.setOption(bicwkr3Option);
            bicwkr4cpu.setOption(bicwkr4Option);
            bicwkr5cpu.setOption(bicwkr5Option);
            bicwkr6cpu.setOption(bicwkr6Option);
            cputrendChart.setOption(cpuTrendOption);

            getcpudata();
        },
        dataType: "json"
    });

    //preload memory data
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "memory"
        },
        success: function (data) {
            var bicwkr3Option = createGaugeOption("MACHINE2", "Memory", data.memorydata["MACHINE2"]);
            var bicwkr4Option = createGaugeOption("MACHINE3", "Memory", data.memorydata["MACHINE3"]);
            var bicwkr5Option = createGaugeOption("MACHINE4", "Memory", data.memorydata["MACHINE4"]);
            var bicwkr6Option = createGaugeOption("MACHINE5", "Memory", data.memorydata["MACHINE5"]);
            var memoryTrendOption = createTrendOption("Memory");

            memoryTrendOption.xAxis[0].data = data.memorytrend.xdata;
            for (var i = 0; i < memoryTrendOption.series.length; i++) {
                memoryTrendOption.series[i].data = data.memorytrend.ydata[memoryTrendOption.series[i].name];
            }

            bicwkr3memory.setOption(bicwkr3Option);
            bicwkr4memory.setOption(bicwkr4Option);
            bicwkr5memory.setOption(bicwkr5Option);
            bicwkr6memory.setOption(bicwkr6Option);
            memorytrendChart.setOption(memoryTrendOption);
        },
        dataType: "json"
    });

    // process disk
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "disk"
        },
        success: function (data) {

            bicwkrdisksOption.series[1].data[3] = data.diskdata['MACHINE2'].C;
            bicwkrdisksOption.series[0].data[3] = data.diskdata['MACHINE2'].E;

            bicwkrdisksOption.series[1].data[2] = data.diskdata['MACHINE3'].C;
            bicwkrdisksOption.series[0].data[2] = data.diskdata['MACHINE3'].E;

            bicwkrdisksOption.series[1].data[1] = data.diskdata['MACHINE4'].C;
            bicwkrdisksOption.series[0].data[1] = data.diskdata['MACHINE4'].D;

            bicwkrdisksOption.series[1].data[0] = data.diskdata['MACHINE5'].C;
            bicwkrdisksOption.series[0].data[0] = data.diskdata['MACHINE5'].E;

            sysdiskOption.xAxis[0].data = data.xAxisData;
            datadiskOption.xAxis[0].data = data.xAxisData;

            for (var i=0; i<sysdiskOption.series.length; i++) {
                if (sysdiskOption.series[i].name.toUpperCase() == 'MACHINE2') {
                    sysdiskOption.series[i].data = data.seriesData.MACHINE2.C
                } else if (sysdiskOption.series[i].name.toUpperCase() == 'MACHINE3') {
                    sysdiskOption.series[i].data = data.seriesData.MACHINE3.C
                } else if (sysdiskOption.series[i].name.toUpperCase() == 'MACHINE4') {
                    sysdiskOption.series[i].data = data.seriesData.MACHINE4.C
                } else if (sysdiskOption.series[i].name.toUpperCase() == 'MACHINE5') {
                    sysdiskOption.series[i].data = data.seriesData.MACHINE5.C
                }

                if (datadiskOption.series[i].name.toUpperCase() == 'MACHINE2') {
                    datadiskOption.series[i].data = data.seriesData.MACHINE2.E
                } else if (datadiskOption.series[i].name.toUpperCase() == 'MACHINE3') {
                    datadiskOption.series[i].data = data.seriesData.MACHINE3.E
                } else if (datadiskOption.series[i].name.toUpperCase() == 'MACHINE4') {
                    datadiskOption.series[i].data = data.seriesData.MACHINE4.D
                } else if (sysdiskOption.series[i].name.toUpperCase() == 'MACHINE5') {
                    datadiskOption.series[i].data = data.seriesData.MACHINE5.E
                }
            }

            sysdisktrendChart.setOption(sysdiskOption);
            datadisktrendChart.setOption(datadiskOption);
            echarts.connect([sysdisktrendChart, datadisktrendChart]);

            bicwkrdisk.setOption(bicwkrdisksOption);
        },
        dataType: "json"
    });

    // process case chart in cpu & mem tab
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "casesummary"
        },
        success: function (data) {
            casechart_cpu.hideLoading();

            casetrendOption.series[0].data = data;
            casechart_cpu.setOption(casetrendOption);
            casechart_mem.setOption(casetrendOption);
            casechart_disk.setOption(casetrendOption);
        },
        dataType: "json"
    });
});