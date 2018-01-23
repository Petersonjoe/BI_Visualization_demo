;
var globalTabFlag = {
    unfixed: 0,
    errcategory: 0,
    accountwarning: 0,
    manualdelete: 0
}

$(".loading").hide();
//------ data loading ------//
function createChartTemplate(fname) {

    return {
        title: {
            text: 'Grouped By ' + fname + '(a week)'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            show: false,
            data: [fname]
        },
        grid: {
            x: 0,
            y2: 150
        },
        calculable: true,
        xAxis: [
            {
                type: 'value',
                boundaryGap: [0, 0.01]
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: [],
                axisLabel: {
                    rotate: 45
                }
            }
        ],
        series: [
            {
                name: 'Failed Count',
                type: 'bar',
                data: [],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'right',
                            formatter: '{c}'
                        }
                    }
                }
            }
        ]
    };
}

function unfixedUpdate() {
    // html value decode
    function htmlDecode(value) {
        return $('<div/>').html(value).text();
    }

    $('.loading:eq(0)').show();
    $(".table-responsive:eq(0)").hide();
    var tData = {};
    var tmpData = [];
    var eptTdFlag = 0;

    // get the column name
    $('table:first thead th').each(function (thIndex, thItem) {
        if (thIndex != 0) {
            tmpData[thIndex - 1] = $(thItem)[0].innerHTML;
        }
    })
    // get the value
    $('table:first tbody tr').each(function (trIndex, trItem) {
        var tRowData = new Array();

        eptTdFlag = 0;
        $(trItem).find("td").each(function (tdIndex, tdItem) {
            if ($(tdItem)[0].innerHTML.indexOf("<select") != -1) {
                if ($(this).parent().find("select").val() != " ") {
                    tRowData[tdIndex] = $(this).parent().find("select").val();
                    tRowData[tdIndex] = htmlDecode(tRowData[tdIndex]);
                } else {
                    eptTdFlag = 1;
                }
            } else {
                tRowData[tdIndex] = $(tdItem)[0].innerHTML;
                tRowData[tdIndex] = htmlDecode(tRowData[tdIndex]);
            }
        })
        console.log(tRowData);
        if (eptTdFlag != 1) {
            tRowData.forEach(function (v, i) {
                if (typeof tData[tmpData[i]] === "undefined") {
                    tData[tmpData[i]] = [];
                }
                tData[tmpData[i]].push(v);
            })
        }
        console.log(tData);
    })

    //if (tData[tmpData[tmpData.length - 2]].length < tData[tmpData[0]].length) {
    //    alert("Please complete all the Error Category!");
    //    return;
    //}
    // business logic
    $.ajax({
        url: "/dailymonitor",
        type: "POST",
        data: JSON.stringify(tData),
        cache: false,
        success: function (response) {
            $(".table-responsive:eq(0)").show();
            $(".loading:eq(0)").hide();

            unfixedRefresh();
            alert(response.msg);
        },
        error: function () {
            alert("Error: Server not respond!");
        },
        dataType: "json"
    });
}

//------ button click events ------//
function unfixedRefresh() {
    //$(".loading").fadeIn();
    //$(".table-responsive:first").fadeOut();
    $(".loading:eq(0)").show();
    $(".table-responsive:eq(0)").hide();
    // business logic
    $.ajax({
        url: "/dailymonitor/response",
        data: {
            "item": "unfixed"
        },
        success: function (data) {
            $(".table-responsive:eq(0)").show();
            $(".loading:eq(0)").hide();

            console.log("data response OK!");
            var $tbl = $('table tbody');

            // clean old data
            $tbl[0].innerHTML = "";

            for (var i = 0; i < data.PackageName.length; i++) {
                var j = i + 1;
                var $s1 = '<td> \
                                <select class="form-control" required>  \
                                    <option selected="selected">&nbsp;</option> \
                                    <option>Account Issue</option> \
                                    <option>Operation Issue</option> \
                                    <option>Testing Issue</option> \
                                    <option>Service Issue</option> \
                                    <option>System Issue</option> \
                                    <option>Runtime Issue</option> \
                                    <option>Connection Issue</option> \
                                    <option>Config Issue</option> \
                                    <option>Other Issue</option> \
                                </select> \
                            </td>';

                $tbl[0].innerHTML +=
                     "<tr>" +
                         "<th scope=\"row\">" + j + "</th>" +
                         "<td>" + data["PackageName"][i] + "</td>" +
                         "<td>" + data["PackageOwner"][i] + "</td>" +
                         "<td>" + data["TaskName"][i] + "</td>" +
                         "<td>" + data["TaskCategory"][i] + "</td>" +
                         "<td>" + data["DetailMessage"][i] + "</td>" +
                         "<td>" + data["Fixed"][i] + "</td>" + $s1 +
                         //"<td>" + data["Owner"][i] + "</td>" +
                         //"<td>" + data["Typical"][i] + "</td>" +
                         "<td>" + data["OperationDate"][i] + "</td>" +
                     "</tr>";
            }
        },
        dataType: "json"
    });
}

function loadErrData() {
        var loadFlag = arguments[0] ? 0 : 1;
        $(".table-responsive:eq(1)").hide();
        $('.loading:eq(1)').show();

        $.ajax({
            url: '/dailymonitor/response',
            data: {
                'item': 'byPackageName'
            },
            dataType: 'json',
            success: function (data) {
                if (loadFlag == 1) {
                    $(".loading:eq(1)").hide();
                    $(".table-responsive:eq(1)").show();
                }

                if (data.byPackageName[0] == null) {
                    $("#errByPackage").width(800);
                    $("#errByPackage").height(100);
                    $("#errByPackage").empty();
                    $('#errByPackage').append('<h3>Good News:</h3><p><strong><em>No Failure Record</em></strong> was found, please go ahead to complete operations.</p>');
                    return;
                }
                var pkgErrOption = createChartTemplate('PackageName');
                var h = data.values.length * 50 + 200;
                var w = Math.max.apply(Math, data.values) * 100 + 200;
                if (h <= 200) { h = 200; };
                if (h >= 1000) { h = 1000; };
                if (w <= 300) { w = 300; };
                if (w >= 800) { w = 800; };

                var nameLen = data.byPackageName.map(
                    function (v) {
                        return v.length;
                    });
                var xw = Math.max.apply(Math, nameLen) * 8 + 20;
                if (xw >= 200) { xw = 200; }

                $("#errByPackage").width(w);
                $("#errByPackage").height(h);
                var errChart = echarts.init(document.getElementById("errByPackage"));

                pkgErrOption.grid.x = xw;
                pkgErrOption.series[0].data = data.values;
                pkgErrOption.yAxis[0].data = data.byPackageName;

                errChart.setOption(pkgErrOption);
                captureAjaxData(errChart, 0);
            }
        });

        $.ajax({
            url: '/dailymonitor/response',
            data: {
                'item': 'byErrCategory'
            },
            dataType: 'json',
            success: function (data) {
                if (loadFlag == 1) {
                    $(".loading:eq(1)").hide();
                    $(".table-responsive:eq(1)").show();
                }

                if (data.byErrCategory[0] == null) {
                    $("#errByCategory").width(800);
                    $("#errByCategory").height(100);
                    $('#errByCategory').empty();
                    $('#errByCategory').append('<h3 style="color: red">Warning:</h3><p style="color: red"><strong><em>Error Category</em></strong> has not been fully collected, please turn back to <em>the 2nd TAB</em> and complete operations.</p>');
                    return;
                }
                var catErrOption = createChartTemplate('Error Category');
                var h = data.values.length * 50 + 200;
                var w = Math.max.apply(Math, data.values) * 100 + 200;
                if (w >= 800) { w = 800; };

                var nameLen = data.byErrCategory.map(
                    function (v) {
                        return v.length;
                    });

                var xw = Math.max.apply(Math, nameLen) * 8 + 20;

                $("#errByCategory").width(w);
                $("#errByCategory").height(h);
                var errChart = echarts.init(document.getElementById("errByCategory"));

                catErrOption.grid.x = xw;
                catErrOption.series[0].data = data.values;
                catErrOption.yAxis[0].data = data.byErrCategory;

                errChart.setOption(catErrOption);
                captureAjaxData(errChart, 1);
            }
        });

}

function warningRefresh() {
        $('.loading:eq(2)').show();
        $(".table-responsive:eq(2)").hide();
        // business logic
        $.ajax({
            url: "/dailymonitor/response",
            data: {
                "item": "accountinfo"
            },
            success: function (data) {
                $(".table-responsive:eq(2)").show();
                $(".loading:eq(2)").hide();

                // accountinfo is the second table
                console.log("data response OK!");

                var $tbl = $('table tbody');
                console.log($tbl);

                // clean old data
                $tbl[1].innerHTML = "";

                for (var i = 0; i < data.Account.length; i++) {
                    var j = i + 1;
                    var h_cell;

                    if (data["RemaingDays"][i] <= 14 && data["RemaingDays"][i] > 7) {
                        h_cell = "<td style=\"background-color: yellow\">" + data["RemaingDays"][i] + "</td>";
                    } else if (data["RemaingDays"][i] <= 7 && data["RemaingDays"][i] > 0) {
                        h_cell = "<td style=\"background-color: red\">" + data["RemaingDays"][i] + "</td>";
                    } else {
                        h_cell = "<td>" + data["RemaingDays"][i] + "</td>";
                    }

                    $tbl[1].innerHTML +=
                         "<tr>" +
                             "<th scope=\"row\">" + j + "</th>" +
                             "<td>" + data["DataSourceName"][i] + "</td>" +
                             "<td>" + data["DatabaseName"][i] + "</td>" +
                             "<td>" + data["Owner"][i] + "</td>" +
                             "<td><a href=\"Mailto:" + data["Email"][i] + "?cc=sample.group@sample.com" +
                                     "&subject=!!!Your%20Account%20Will%20Expire" +
                                     "&body=Hi,%0a%0dThe%20PASSWORD%20of%20your%20account%20will%20expire,%20please%20reset!%0a%0dACCOUNTINFO%0aDataSourceName:%20" + data['DataSourceName'][i] + "%0aDatabaseName:%20" + data['DatabaseName'][i] + "%0aAccount:%20" + data['Account'][i] + "%0a%0dBest%20Regards,%0aBI%20Support\">" +
                                     data['Email'][i] +
                                 "</a>" +
                             "</td>" +
                             "<td>" + data["AccountCategory"][i] + "</td>" +
                             "<td>" + data["Account"][i] + "</td>" +
                             "<td>" + data["ExpireDate"][i] + "</td>" +
                             "<td>" + data["IsPeriodLimited"][i] + "</td>" +
                             h_cell +
                         "</tr>";
                }
            },
            dataType: "json"

        });
}

function manualRefresh() {
        $('.loading:eq(3)').show();
        $(".table-responsive:eq(3)").hide();// business logic
        $.ajax({
            url: "/dailymonitor/response",
            data: {
                "item": "manualdelete"
            },
            success: function (data) {
                $(".table-responsive:eq(3)").show();
                $(".loading:eq(3)").hide();
                console.log("data response OK!");
                var $tbl = $('table tbody');

                // clean old data
                $tbl[2].innerHTML = "";

                for (var i = 0; i < data.WorkerName.length; i++) {
                    var j = i + 1;

                    $tbl[2].innerHTML +=
                         "<tr>" +
                             "<th scope=\"row\">" + j + "</th>" +
                             "<td>" + data["WorkerName"][i] + "</td>" +
                             "<td>" + data["Name"][i] + "</td>" +
                             "<td>" + data["PackageName"][i] + "</td>" +
                             "<td>" + data["CaseCreatedDate"][i] + "</td>" +
                             "<td>" + data["DeletedDate"][i] + "</td>" +
                             "<td>" + data["CaseStatus"][i] + "</td>" +
                         "</tr>";
                }
            },
            dataType: "json"

        });
    }

$('#unfixedRefresh').on('click', function () {
    unfixedRefresh();
})

$('#unfixedUpdate').on('click', function () {
    unfixedUpdate();
})

$('#warningRefresh').on('click', function () {
    warningRefresh();
})

$('#manualRefresh').on('click', function () {
    manualRefresh();
})

$('#errRefresh').on('click', function () {
    loadErrData();
})

//------ predefine the modal event ------//
$('#modalHolder').on('hidden.bs.modal', function () {
    $(this).removeData('bs.modal');
});

//------ charts click events ------//
function captureAjaxData(chartObj, cateFlag) {
    var itemCate = '';
    if (cateFlag == 0) {
        itemCate = "pkgName";
    } else if (cateFlag == 1) {
        itemCate = "cateName";
    }

    chartObj.on('click', function (params) {
        // data preparation
        if (params.componentType === 'series') {

            $.ajax({
                url: "/dailymonitor/response",
                data: {
                    "item": itemCate,
                    "value": params.name
                },
                success: function (rawdata) {
                    var data = rawdata.unfixed;
                    // clean old data
                    $('#holdertitle').html('');
                    $('#holdertitle').html('Error detail of <strong>' + data["PackageName"][0] + '</strong>');
                    $('#modalTableHolder>tbody>tr').remove();

                    var $tbl = $('#modalTableHolder>tbody');

                    for (var i = 0; i < data.PackageName.length; i++) {
                        var j = i + 1;

                        $tbl.append(
                             "<tr>" +
                                 "<th scope=\"row\">" + j + "</th>" +
                                 "<td>" + data["PackageName"][i] + "</td>" +
                                 "<td>" + data["PackageOwner"][i] + "</td>" +
                                 "<td>" + data["TaskName"][i] + "</td>" +
                                 "<td>" + data["TaskCategory"][i] + "</td>" +
                                 "<td>" + data["DetailMessage"][i] + "</td>" +
                                 "<td>" + data["Fixed"][i] + "</td>" +
                                 "<td>" + data["ErrorCategory"][i] + "</td>" +
                                 "<td>" + data["OperationDate"][i] + "</td>" +
                             "</tr>");
                    }
                    $('#modalHolder').modal('show');
                },
                dataType: "json"
            });
        }
    });
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var currTab = e.target;
    var preTab = e.relatedTarget;
    var currTabId = currTab.hash.slice(1,currTab.hash.length);  // e.g., "#unfixed"
    var preTabId = preTab.hash.slice(1,preTab.hash.length);
    
    if (!globalTabFlag[currTabId]) {
        globalTabFlag[currTabId] = 1;
        if (currTabId == "unfixed") {
            unfixedRefresh();
        } else if (currTabId == "errcategory") {
            loadErrData();
        } else if (currTabId == "accountwarning") {
            warningRefresh();
        } else if (currTabId == "manualdelete") {
            manualRefresh();
        }
    }
})





