;
//debugger;
var timerGap = 1000 * 60 * 5;
var themeColors = ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#749f83", "#ca8622", "#bda29a",
                "#6e7074", "#546570", "#c4ccd3", "#f05b72", "#ef5b9c", "#f47920", "#905a3d",
                "#fab27b", "#2a5caa", "#444693", "#726930", "#b2d235", "#6d8346", "#ac6767",
                "#1d953f", "#6950a1", "#918597", "#f6f5ec"];
var cpuChart = echarts.init(document.getElementById('cpu'));
var memoryChart = echarts.init(document.getElementById('memory'));
var diskChart = echarts.init(document.getElementById('disk'));
var caseChart = echarts.init(document.getElementById('casecate'));
var scriptArgs = document.getElementById('graphicScript').getAttribute('local-data');
var wkrname = scriptArgs.toLowerCase();
var wkrname_u = scriptArgs.toUpperCase();

cpuChart.showLoading({
    text: 'Loading...',
});
memoryChart.showLoading({
    text: 'Loading...',
});
diskChart.showLoading({
    text: 'Loading...',
});
caseChart.showLoading({
    text: 'Loading...',
});

// setting disk usage chart information
var radius = [40, 55];  //control the width of the ring
var colorList = ['#91c7ae', '#3B7386', '#DF6165'];
var labelTop = {
    normal: {
        label: {
            show: true,
            position: 'center',
            formatter: '{c}%',
            textStyle: {
                baseline: 'middle',
                align: 'center',
                fontSize: 18,
                fontWeight: 'bolder'
            }
        },
        labelLine: {
            show: false
        }
    }
};
var labelFromatter = {
    normal: {
        label: {
            formatter: function (params) {
                return 100 - params.value + '%'
            },
            textStyle: {
                baseline: 'top'
            }
        }
    }
}
var labelBottom = {
    normal: {
        color: '#ccc',
        label: {
            show: false
        },
        labelLine: {
            show: false
        }
    },
    emphasis: {
        color: 'rgba(0,0,0,0)'
    }
};
var diskOption = {
    legend: {
        x: 'center',
        y: '80%',
        data: [
            'Sys disk', 'Data disk'
        ]
    },
    title: {
        text: 'Disk usage rate',
        x: 'center'
    },
    series: [
        {
            type: 'pie',
            center: ['25%', '50%'],
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                { name: 'other', value: 88, itemStyle: labelBottom },
                {
                    name: 'Sys disk',
                    value: 12,
                    itemStyle: labelTop
                }
            ]
        },
        {
            type: 'pie',
            center: ['75%', '50%'],
            radius: radius,
            itemStyle: labelFromatter,
            data: [
                { name: 'other', value: 12, itemStyle: labelBottom },
                {
                    name: 'Data disk',
                    value: 88,
                    itemStyle: labelTop
                }
            ]
        }
    ],
    color: ['#fff', '#fff']
};

var casecateOption = {
    title: {
        text: scriptArgs + ' case summary',
        x: 'left',
        y: 'top'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        data: [
            '#Reject Case',
            '#Ready Case',
            '#Pending Case',
            '#Failed Case',
            '#Validation Failed Case',
            '#Cancelled Case',
            '#Processing Case',
            '#Completed Case',
        ],
        y: 'bottom',
        x: 'center'
    },
    grid: {
        x: 50,
        y: 100,
        y2: 135,
        width: 1000
    },
    xAxis: [
        {
            type: 'category',
            splitLine: { show: false },
            data: [
                '#Reject Case',
                '#Ready Case',
                '#Pending Case',
                '#Failed Case',
                '#Validation Failed Case',
                '#Cancelled Case',
                '#Processing Case',
                '#Completed Case',
            ],
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 45
            },
            axisTick: {
                show: false
            }

        }
    ],
    yAxis: [
        {
            type: 'value',
            position: 'left',
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            }
        }
    ],
    color: [
        '#fa646f',
        '#8ee1e0',
        '#f1908b',
        '#dc2730',
        '#feae6c',
        '#9dacb0',
        '#28c9cf',
        '#91C7AE'
    ],
    series: [
        {
            name: 'Case Category',
            type: 'bar',
            barWidth: 25,
            itemStyle: {
                normal: {
                    color: function (params) {
                        // build a color map as your need.
                        var colorList = [
                                   '#fa646f',
                                   '#8ee1e0',
                                   '#f1908b',
                                   '#dc2730',
                                   '#feae6c',
                                   '#9dacb0',
                                   '#28c9cf',
                                   '#91C7AE'
                        ];
                        return colorList[params.dataIndex];
                    },
                    label: {
                        show: true,
                        position: 'top',
                        formatter: '{c}'
                    }
                }

            },
            data: []
        },
        {
            name: 'Percentage',
            type: 'pie',
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            center: [300, 200],
            radius: [0, 80],
            itemStyle: {
                normal: {
                    labelLine: {
                        length: 20
                    }
                }
            },
            data: [
                { value: -1, name: '#Reject Case' },
                { value: -1, name: '#Ready Case' },
                { value: -1, name: '#Pending Case' },
                { value: -1, name: '#Failed Case' },
                { value: -1, name: '#Validation Failed Case' },
                { value: -1, name: '#Cancelled Case' },
                { value: -1, name: '#Processing Case' },
                { value: -1, name: '#Completed Case' }
            ]
        }
    ]
};

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
                name: wkrName,  // sample: "BICWKR5"
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

function getcpudata() {
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "cpu"
        },
        success: function (data) {
            cpuChart.hideLoading();
            var cpuOption = createGaugeOption(wkrname_u, "CPU", data.cpudata[wkrname_u]);
            cpuChart.setOption(cpuOption);
        },
        dataType: "json"
    });
}

function getmemorydata() {
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "memory"
        },
        success: function (data) {
            memoryChart.hideLoading();
            var memoryOption = createGaugeOption(wkrname_u, "Memory", data.memorydata[wkrname_u]);
            memoryChart.setOption(memoryOption);
        },
        dataType: "json"
    });
}

function getdiskdata() {
    $.ajax({
        url: "/jsondata",
        data: {
            "matrice": "disk"
        },
        success: function (data) {
            diskChart.hideLoading();
            if (wkrname_u == 'MACHINE4') {
                diskOption.series[0].data[1].value = data.diskdata[wkrname_u].C;
                diskOption.series[0].data[0].value = 100 - data.diskdata[wkrname_u].C;
                diskOption.series[1].data[1].value = data.diskdata[wkrname_u].D;
                diskOption.series[1].data[0].value = 100 - data.diskdata[wkrname_u].D;
            } else {
                diskOption.series[0].data[1].value = data.diskdata[wkrname_u].C;
                diskOption.series[0].data[0].value = 100 - data.diskdata[wkrname_u].C;
                diskOption.series[1].data[1].value = data.diskdata[wkrname_u].E;
                diskOption.series[1].data[0].value = 100 - data.diskdata[wkrname_u].E;
            }

            for (var i = 0; i < 2; i++) {
                if (diskOption.series[i].data[1].value >= 0 && diskOption.series[i].data[1].value <= 20) {
                    diskOption.color[i] = colorList[0];
                } else if (diskOption.series[i].data[1].value > 20 && diskOption.series[i].data[1].value <= 80) {
                    diskOption.color[i] = colorList[1];
                } else if (diskOption.series[i].data[1].value > 80 && diskOption.series[i].data[1].value <= 100) {
                    diskOption.color[i] = colorList[2];
                }
            }
            diskChart.setOption(diskOption);
        },
        dataType: 'json'
    });
}

function getcasesummarydata() {
    $.ajax({
        url: "/wkrjsondata",
        data: {
            "name": wkrname,
            "matrice": "casesummary"
        },
        success: function (data) {
            caseChart.hideLoading();
            casecateOption.series[0].data = [];
            casecateOption.series[0].data.push(data.RejectCase);
            casecateOption.series[0].data.push(data.ReadyCase);
            casecateOption.series[0].data.push(data.PendingCase);
            casecateOption.series[0].data.push(data.FailedCase);
            casecateOption.series[0].data.push(data.ValidationFailedCase);
            casecateOption.series[0].data.push(data.CancelledCase);
            casecateOption.series[0].data.push(data.ProcessingCase);
            casecateOption.series[0].data.push(data.CompletedCase);

            for (var i = 0; i < casecateOption.series[1].data.length; i++) {
                var index = "";
                var str = casecateOption.series[1].data[i].name.split(" ");

                for (var j = 0; j < str.length; j++) {
                    index += str[j].replace("#", "");
                }
                casecateOption.series[1].data[i].value = data[index];
            }
            caseChart.setOption(casecateOption);
        },
        dataType: 'json'
    });
}

$(document).ready(function () {
    
    // fetch cpu data
    getcpudata();
    // auto refresh cpu data
    timercpu = setInterval(function () {
        getcpudata();
    }, timerGap);

    // fetch memory data
    getmemorydata();
    // auto refresh memory data
    timermemory = setInterval(function () {
        getmemorydata();
    }, timerGap);

    // fetch disk data
    getdiskdata();
    // auto refresh disk data
    timerdisk = setInterval(function () {
        getdiskdata();
    }, timerGap);

    // fetch case summary data
    getcasesummarydata();
    // auto refresh case summary data
    timercase = setInterval(function () {
        getcasesummarydata();
    }, timerGap);

});
