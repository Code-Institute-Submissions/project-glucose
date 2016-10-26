/**
 * Created by proto on 25/10/2016.
 */

queue()
    .defer(d3.json, "/glucose/projects")
    .await(makeGraphs);

function print_filter(filter){
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

function getBGrating(reading) {
    if (reading > 20)
        return "Very High";
    else if (reading > 10)
        return "High";
    else if (reading >= 4)
        return "Normal";
    else if (reading < 4)
        return "Low"
}

function getPeriod(time) {
   var period = time.getHours();
    if (period >=23)
        return "Overnight";
    else if (period <=7)
        return "Overnight";
    else if (period > 16)
        return "Evening";
    else if (period >11)
        return "Afternoon";
    else if (period >6)
        return "Morning";
}

function makeGraphs(error, projectsJson) {

    //Clean projectsJson data
    var glucoseProjects = projectsJson;
    var dateTimeFormat = d3.time.format("%d/%m/%Y %H:%M:%S");
    var timeFormat = d3.time.format("%H:%M:%S");
    var dateFormat=d3.time.format("%d/%m/%Y");
    glucoseProjects.forEach(function (d) {
        d["Timestamp"] = dateTimeFormat.parse(d["Timestamp"]);
        d["Date"] = dateFormat.parse(d["Date"]);
        d["Time"] = timeFormat.parse(d["Time"]);
        d["BG Rating"] = getBGrating(d["BG Reading"]);
        d["Time Period"] = getPeriod(d["Time"]);
        // d["Timestamp"].setDate(1);
        // d["total_donations"] = +d["total_donations"];
    });


    //Create a Crossfilter instance
    var ndx = crossfilter(glucoseProjects);

    //Define Dimensions

    var rawtypeDim = ndx.dimension(function (d) {
        return d["Raw-Type"];
    });

    var onlyBG = rawtypeDim.filter("BGReceived");
    print_filter(onlyBG);

    var ratingDim = ndx.dimension(function (d) {
        return d["BG Rating"];
    });

    var periodDim = ndx.dimension(function (d) {
        return d["Time Period"];
    });
    // var dateDim = ndx.dimension(function (d) {
    //     return d["Date"];
    // });


    var timeDim = ndx.dimension(function (d) {
        return d["Timestamp"];
    });

    var groupedBG = timeDim.group().reduceSum(function(d) {
        return d["BG Reading"];
    });
    function reduceAdd(p, v) {
        ++p.count;
        p.total += v.value;
        return p;
    }

    function reduceRemove(p, v) {
        --p.count;
        p.total -= v.value;
        return p;
    }

    function reduceInitial() {
        return {count: 0, total: 0};
    }

    var averageBG = timeDim.group().reduce(reduceAdd, reduceRemove, reduceInitial);




    //Calculate metrics
    var groupedRating = ratingDim.group();
    var groupedPeriod = periodDim.group();

    //Define values (to be used in charts)
    var minDate = timeDim.bottom(1)[0]["Timestamp"];
    var maxDate = timeDim.top(1)[0]["Timestamp"];

    //Charts
    var timeChart = dc.lineChart("#time-chart");
    var ratingChart = dc.pieChart("#rating-chart");
    var avgChart = dc.lineChart("#average-chart");
    var periodChart = dc.pieChart("#period-chart");

    // var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    // var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");


    timeChart
        .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(timeDim)
        .group(groupedBG)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .brushOn(true)
            .renderDataPoints(true)
        // .renderArea(false)
        .xAxisLabel("Date")
        .yAxisLabel ("BG Reading")
        .yAxis().ticks(4);

    ratingChart
        .height(220)
        .radius(90)
        .innerRadius(20)
        .transitionDuration(1000)
        .dimension(ratingDim)
        .group(groupedRating);

    periodChart
        .height(220)
        .radius(90)
        .innerRadius(20)
        .transitionDuration(1000)
        .dimension(periodDim)
        .group(groupedPeriod);

    avgChart
         .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(timeDim)
        .group(averageBG)
        .valueAccessor(function(p) { return p.value.count > 0 ? p.value.total / p.value.count : 0; })
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .brushOn(true)
            .renderDataPoints(true)
        // .renderArea(false)
        .xAxisLabel("Date")
        .yAxisLabel ("BG Reading")
        .yAxis().ticks(4);

    dc.renderAll();
}