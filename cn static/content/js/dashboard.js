/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.98787878787878, "KoPercent": 0.012121212121212121};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8744242424242424, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.998, 500, 1500, "cmsadaptor"], "isController": false}, {"data": [0.404, 500, 1500, "ent-se AEM"], "isController": false}, {"data": [0.902, 500, 1500, "navigation AEM"], "isController": false}, {"data": [1.0, 500, 1500, "countries AEM"], "isController": false}, {"data": [0.996, 500, 1500, "lp AEM"], "isController": false}, {"data": [0.944, 500, 1500, "app css"], "isController": false}, {"data": [0.29, 500, 1500, "version.json"], "isController": false}, {"data": [0.182, 500, 1500, "vendor"], "isController": false}, {"data": [0.998, 500, 1500, "service-updates AEM"], "isController": false}, {"data": [0.992, 500, 1500, "fu AEM"], "isController": false}, {"data": [0.998, 500, 1500, "dtcconfig"], "isController": false}, {"data": [1.0, 500, 1500, "rfd AEM"], "isController": false}, {"data": [0.93, 500, 1500, "error AEM"], "isController": false}, {"data": [0.958, 500, 1500, "ent-am AEM"], "isController": false}, {"data": [1.0, 500, 1500, "manifest"], "isController": false}, {"data": [0.856, 500, 1500, "sc AEM"], "isController": false}, {"data": [0.936, 500, 1500, "ph AEM"], "isController": false}, {"data": [0.984, 500, 1500, "bf AEM"], "isController": false}, {"data": [1.0, 500, 1500, "categories AEM"], "isController": false}, {"data": [1.0, 500, 1500, "emm AEM"], "isController": false}, {"data": [0.79, 500, 1500, "ai AEM"], "isController": false}, {"data": [0.996, 500, 1500, "i18n"], "isController": false}, {"data": [0.718, 500, 1500, "al AEM"], "isController": false}, {"data": [0.772, 500, 1500, "app-blessed4"], "isController": false}, {"data": [0.892, 500, 1500, "app-blessed2"], "isController": false}, {"data": [0.852, 500, 1500, "app-blessed3"], "isController": false}, {"data": [0.97, 500, 1500, "i18n_zh"], "isController": false}, {"data": [0.592, 500, 1500, "td AEM"], "isController": false}, {"data": [0.948, 500, 1500, "app-blessed1"], "isController": false}, {"data": [1.0, 500, 1500, "marketing-banner AEM"], "isController": false}, {"data": [1.0, 500, 1500, "ls AEM"], "isController": false}, {"data": [0.966, 500, 1500, "pa AEM"], "isController": false}, {"data": [0.992, 500, 1500, "sri AEM"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8250, 1, 0.012121212121212121, 353.35333333333347, 7, 21008, 819.0, 1511.0, 2714.3299999999963, 20.359059781602813, 8196.830100657813, 4.559732922296255], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["cmsadaptor", 250, 0, 0.0, 27.74000000000001, 8, 681, 41.900000000000006, 69.89999999999998, 326.43000000000006, 1.2471378187060698, 6.00306866054904, 0.3495396034850019], "isController": false}, {"data": ["ent-se AEM", 250, 0, 0.0, 1290.5559999999998, 256, 3891, 2597.6000000000004, 3169.099999999999, 3606.370000000001, 0.6255864873318737, 1338.081844307163, 0.12585040663121677], "isController": false}, {"data": ["navigation AEM", 250, 0, 0.0, 308.64799999999985, 53, 933, 643.3000000000001, 721.8499999999999, 897.5000000000005, 0.6219431494205978, 283.12504198116255, 0.127546934939771], "isController": false}, {"data": ["countries AEM", 250, 0, 0.0, 52.04800000000001, 11, 378, 90.0, 117.24999999999994, 319.45000000000005, 0.6225828221928362, 27.728647238035826, 0.12707012679521756], "isController": false}, {"data": ["lp AEM", 250, 0, 0.0, 70.54399999999988, 14, 1641, 117.60000000000002, 159.79999999999995, 345.74000000000024, 0.6313290739665143, 38.920450958357534, 0.12453952435667567], "isController": false}, {"data": ["app css", 250, 0, 0.0, 261.7399999999999, 112, 1261, 524.1, 706.4999999999999, 1077.7800000000002, 1.2446480135417706, 312.3288706219506, 0.33060962859703275], "isController": false}, {"data": ["version.json", 250, 1, 0.4, 1637.996, 533, 21008, 3787.3, 4740.65, 8746.260000000018, 0.6196677589343698, 0.5933149351393756, 0.1127093353877385], "isController": false}, {"data": ["vendor", 250, 0, 0.0, 1750.6960000000001, 415, 4290, 2545.8, 2744.3999999999996, 3050.1100000000015, 1.2446789972865997, 2079.7036322066915, 0.3439884338204177], "isController": false}, {"data": ["service-updates AEM", 250, 0, 0.0, 131.40399999999997, 30, 506, 263.9, 311.1499999999999, 464.4100000000001, 0.6217652662025811, 110.81083572868401, 0.130546418196831], "isController": false}, {"data": ["fu AEM", 250, 0, 0.0, 154.83599999999993, 33, 696, 325.8, 387.79999999999995, 613.1500000000012, 0.6312987836135037, 149.79844701288354, 0.12453354911125757], "isController": false}, {"data": ["dtcconfig", 250, 0, 0.0, 36.67999999999999, 8, 1478, 47.0, 136.19999999999868, 286.84000000000015, 1.252128618651708, 1.1408554699238707, 0.3448244828708805], "isController": false}, {"data": ["rfd AEM", 250, 0, 0.0, 64.19200000000001, 15, 364, 112.9, 156.0, 317.43000000000006, 0.6239969249431538, 39.734101065349954, 0.12370251539400415], "isController": false}, {"data": ["error AEM", 250, 0, 0.0, 271.25600000000026, 55, 1407, 570.2, 705.05, 1160.8600000000001, 0.6214298853089003, 259.00214498176723, 0.12501421520862643], "isController": false}, {"data": ["ent-am AEM", 250, 0, 0.0, 250.22400000000007, 58, 1205, 487.1, 611.9, 964.8000000000038, 0.6291571559076599, 273.34405541647686, 0.12656872472361125], "isController": false}, {"data": ["manifest", 250, 0, 0.0, 20.660000000000007, 8, 149, 33.0, 53.14999999999992, 117.35000000000014, 1.2471191547525216, 3.855839105416488, 0.3470985928754577], "isController": false}, {"data": ["sc AEM", 250, 0, 0.0, 421.16399999999993, 73, 2071, 860.6, 1042.05, 1393.5600000000013, 0.6226681079357805, 412.5437687033933, 0.1228310134795192], "isController": false}, {"data": ["ph AEM", 250, 0, 0.0, 295.99199999999985, 55, 1060, 595.3000000000001, 744.7499999999998, 884.1000000000008, 0.6234445059576357, 275.97149993578523, 0.12298417012054923], "isController": false}, {"data": ["bf AEM", 250, 0, 0.0, 188.22799999999998, 44, 899, 368.1, 429.84999999999985, 721.1400000000008, 0.6293884106935609, 210.10924943701207, 0.12415669820322196], "isController": false}, {"data": ["categories AEM", 250, 0, 0.0, 24.512, 8, 474, 38.900000000000006, 47.0, 272.0500000000004, 0.6219601696707342, 5.519289122849573, 0.12755042542075606], "isController": false}, {"data": ["emm AEM", 250, 0, 0.0, 22.640000000000004, 7, 346, 32.0, 70.79999999999995, 206.9700000000014, 0.6240841565003357, 3.3538428840052226, 0.1237198083687189], "isController": false}, {"data": ["ai AEM", 250, 0, 0.0, 560.9880000000002, 199, 2516, 1101.3, 1371.1, 2002.760000000002, 0.620640003972096, 707.0974596816737, 0.122430938283558], "isController": false}, {"data": ["i18n", 250, 0, 0.0, 34.603999999999985, 7, 2570, 47.0, 64.89999999999998, 309.74000000000115, 1.2529632581054193, 2.3199397825858155, 0.34383073781994417], "isController": false}, {"data": ["al AEM", 250, 0, 0.0, 631.5679999999998, 107, 1862, 1338.6000000000004, 1543.6, 1836.96, 0.6296610660413713, 633.4845352880951, 0.12421048373081738], "isController": false}, {"data": ["app-blessed4", 250, 0, 0.0, 477.58399999999995, 89, 1163, 779.0, 858.4999999999999, 1020.2000000000007, 1.2498000319948808, 570.5194395459226, 0.3307576256548952], "isController": false}, {"data": ["app-blessed2", 250, 0, 0.0, 347.12399999999985, 65, 1080, 613.0, 723.0, 941.8100000000006, 1.2490257599072723, 504.1384224211365, 0.33055271575670975], "isController": false}, {"data": ["app-blessed3", 250, 0, 0.0, 404.33199999999977, 91, 2667, 717.2, 795.0, 1136.5600000000022, 1.2489571208041286, 571.2430315998641, 0.3305345505253114], "isController": false}, {"data": ["i18n_zh", 250, 0, 0.0, 285.6680000000002, 66, 956, 457.8, 533.9999999999998, 870.940000000001, 1.2507379353818753, 304.9900320095106, 0.346884349266067], "isController": false}, {"data": ["td AEM", 250, 0, 0.0, 860.1600000000002, 132, 3635, 1767.0, 2046.9999999999995, 2826.360000000006, 0.6239050466431413, 779.5918992246732, 0.12307501896671341], "isController": false}, {"data": ["app-blessed1", 250, 0, 0.0, 293.94800000000004, 95, 1059, 509.9, 588.45, 996.6700000000008, 1.2487138247604967, 340.050529204919, 0.3304701626075143], "isController": false}, {"data": ["marketing-banner AEM", 250, 0, 0.0, 19.967999999999996, 8, 269, 37.900000000000006, 50.0, 69.43000000000006, 0.6317965514017038, 1.5356851723035554, 0.14375839499667675], "isController": false}, {"data": ["ls AEM", 250, 0, 0.0, 70.12800000000004, 18, 357, 136.8, 164.34999999999997, 320.1900000000003, 0.6226634553836728, 56.10234217193731, 0.12283009569091984], "isController": false}, {"data": ["pa AEM", 250, 0, 0.0, 241.2119999999999, 39, 1564, 455.70000000000005, 550.5999999999999, 941.5100000000018, 0.6237104785855244, 207.46413430856703, 0.12303663737722259], "isController": false}, {"data": ["sri AEM", 250, 0, 0.0, 151.61999999999995, 27, 976, 304.6, 385.0499999999999, 614.0400000000018, 0.6310836463508219, 135.70270532937516, 0.12510740254806332], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to www1.cn.secure.hsbcnet.com:443 [www1.cn.secure.hsbcnet.com\\\/203.112.93.220] failed: Connection timed out: connect", 1, 100.0, 0.012121212121212121], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8250, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to www1.cn.secure.hsbcnet.com:443 [www1.cn.secure.hsbcnet.com\\\/203.112.93.220] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["version.json", 250, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException\/Non HTTP response message: Connect to www1.cn.secure.hsbcnet.com:443 [www1.cn.secure.hsbcnet.com\\\/203.112.93.220] failed: Connection timed out: connect", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
