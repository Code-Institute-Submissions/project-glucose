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

    // var onlyBG = rawtypeDim.filter("BGReceived");
    // print_filter(onlyBG);

    var ratingDim = ndx.dimension(function (d) {
        return d["BG Rating"];
    });

    var periodDim = ndx.dimension(function (d) {
        return d["Time Period"];
    });
    var dateDim = ndx.dimension(function (d) {
        return d["Date"];
    });

    var readingDim = ndx.dimension(function (d) {
        return d["BG Reading"];
    });

    var timeDim = ndx.dimension(function (d) {
        return d["Timestamp"];
    });



    var groupedBG = timeDim.group().reduceSum(function(d) {
        return d["BG Reading"];
    });

    // var all = ndx.groupAll();

    var overallAvgBG = ndx.groupAll().reduce(

        function reduceAdd(p, v) {
            ++p.count;
            p.total += v["BG Reading"];
            return p;
        },
        function reduceRemove(p, v) {
            --p.count;
            p.total -= v["BG Reading"];
            return p;
        },
        function reduceInitial() {
            return {count: 0, total: 0};
        });


    var averageBG = dateDim.group().reduce(

        function reduceAdd(p, v) {
            ++p.count;
            p.total += v["BG Reading"];
            return p;
        },
        function reduceRemove(p, v) {
            --p.count;
            p.total -= v["BG Reading"];
            return p;
        },
        function reduceInitial() {
            return {count: 0, total: 0};
        });

    var hypoCount = ratingDim.group().reduce(
        function reduceAdd(p, v) {
            if (v["BG Rating"] == "Low")
                ++p;
            return p;
        },
        function reduceRemove(p, v) {
            if (v["BG Rating"] == "Low")
                --p;
            return p;
        },
        function reduceInitial() {
            return 0;
        });


    //Calculate metrics
    var groupedRating = ratingDim.group();
    var groupedPeriod = periodDim.group();

    //Define values (to be used in charts)
    var minDate = timeDim.bottom(1)[0]["Timestamp"];
    var maxDate = timeDim.top(1)[0]["Timestamp"];

    //     var onlylow = ratingDim.filter("Low");
    //
    //     var hypos = onlylow.group().reduceCount( function (d){
    //     return d("BG Rating")
    // });

    //Charts
    var timeChart = dc.lineChart("#time-chart");
    var ratingChart = dc.pieChart("#rating-chart");
    var avgChart = dc.lineChart("#average-chart");
    var periodChart = dc.pieChart("#period-chart");
    var hyposND = dc.numberDisplay("#hypos-chart");
    var overallavgbgND = dc.numberDisplay("#overallavgbg-chart");

    // var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    // var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");


    timeChart
        .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(timeDim)
        .group(groupedBG)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .brushOn(true)
        .renderDataPoints(false)
        .yAxisLabel ("Blood Glucose (mmol/L)")
        .yAxis().ticks(4);

    ratingChart
        .height(200)
        .radius(90)
        .innerRadius(20)
        .transitionDuration(1000)
        .dimension(ratingDim)
        .group(groupedRating);

    periodChart
        .height(200)
        .radius(90)
        .innerRadius(20)
        .transitionDuration(1000)
        .dimension(periodDim)
        .group(groupedPeriod);

    hyposND
        .formatNumber(d3.format("d"))
        .group(hypoCount)
        .valueAccessor(function(d) {
            return d.value;
        })
        .formatNumber(d3.format("s"));

    avgChart
        .width(800)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(dateDim)
        .group(averageBG)
        .valueAccessor(function (p) {
            if (p.value.count == 0)
                return 0;
            else
                return p.value.total / p.value.count;
        })
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .elasticY(true)
        .brushOn(false)
        .renderDataPoints(true)
        .yAxisLabel ("Average BG (mmol/L)")
        .yAxis().ticks(4);

    overallavgbgND
        .formatNumber(d3.format("d"))
        .valueAccessor(function(p) {
            if (p.count == 0)
                return 0;
            else
                return p.total / p.count;
        })
        .group(overallAvgBG)
        .formatNumber(d3.format(".3s"));



    dc.renderAll();
}