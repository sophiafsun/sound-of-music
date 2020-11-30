
class Timeline2 {

    constructor(parentElement, billboard, audioFeatures) {
        this.parentElement = parentElement;
        this.billboard = billboard;
        this.audioFeatures = audioFeatures;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%Y-%m");

        this.initVis()
    }

    initVis(){
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 10, bottom: 50, left: 0};
        vis.width = 500 - vis.margin.left - vis.margin.right;
        vis.height = 200 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", 190)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        vis.svg.append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // init scales
        vis.x = d3.scaleLinear().range([0, vis.width/1.1]);
        vis.y = d3.scaleLinear().range([vis.height, 0]);

        // init x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + 20 + "," + 150 + ")");
        vis.yAxis = vis.svg.append("g")
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + 20 + " ," + 20 + ")");

        // init pathGroup
        vis.pathGroup = vis.svg.append('g')
            .attr('class','pathGroup')
            .attr("transform", "translate(" + 20 + " ," + 20 + ")");

        // init path generator
        vis.area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return vis.x(d.date); })
            .y0(vis.y(0))
            .y1(function(d) { return vis.y(d.amount); });

        // init brushGroup:
        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush");

        // init brush
        vis.brush = d3.brushX()
            .extent([[20, 20], [vis.width/1.1+20, vis.height+20]])
            .on("brush end", function(event){
                selectedTimeRange =
                    [Math.trunc(vis.x.invert(event.selection[0])), Math.trunc(vis.x.invert(event.selection[1]))];
                //myBubbleGraph.updateVis();
                //myParallelCoordinates.updateVis();
                myStackedAreaChart.updateVis();
            });

        // add title
        vis.svg.append('g')
            .attr('class', 'axistitle')
            .append('text')
            .text('#1 Songs')
            .attr('x', 0)
            .attr('y', 10)
            .attr('text-anchor', 'front');


        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;

        // console.log(vis.billboard);
        // console.log(vis.audioFeatures);

        vis.filtered = []

        vis.filtered = vis.billboard.filter(function (d) {return (d["Peak Position"] === 1) })

        vis.sortedData = vis.filtered.sort((a,b) => d3.descending(a["Weeks on Chart"], b["Weeks on Chart"]));

        vis.names = [];
        vis.result = [];
        let indx = -1;
        for(let i=0; i< vis.sortedData.length; i++){
            indx = vis.names.indexOf(vis.sortedData[i]["SongID"]);
            if(indx === -1){
                vis.names.push(vis.sortedData[i]["SongID"]);
                vis.result.push(vis.sortedData[i]);

            }
        }
        vis.topData = vis.result;


        vis.topData.forEach( row => {

            vis.song = row["Song"];
            vis.performer = row["Performer"];
            vis.weeks = row["Weeks on Chart"];
            vis.url = row["url"].substr(row["url"].length - 10, 4);

            // console.log(vis.url);

            vis.audioFeatures.forEach(row => {
                if (row["Song"] === vis.song){
                    vis.genre = row["genre"];
                }
            })

            // populate final array
            vis.displayData.push(
                {
                    song: vis.song,
                    performer: vis.performer,
                    weeks: vis.weeks,
                    genre: vis.genre,
                    date: vis.url
                })
        })

        // console.log(vis.displayData);

        // rearrange data structure and group by state
        vis.dataByDate = Array.from(d3.group(vis.displayData, d =>d.date), ([key, value]) => ({key, value}))

        // console.log(vis.dataByDate);

        vis.preProcessedData = [];

        // iterate over each year
        vis.dataByDate.forEach( year => {
            let tmpSum = year.value.length;

            vis.preProcessedData.push (
                {date: year.key, amount: tmpSum}
            )
        });

        console.log(vis.preProcessedData);

        vis.preProcessedData = vis.preProcessedData.sort((a,b) => d3.ascending(a.date, b.date));

        vis.updateVis()
    }

    updateVis(){
        let vis = this;
        vis.x.domain( d3.extent(vis.preProcessedData, function(d) { return d.date }) );
        vis.y.domain( d3.extent(vis.preProcessedData, function(d) { return d.amount }) );

        // draw x & y axis
        vis.xAxis.call(d3.axisBottom(vis.x).tickFormat(d3.format("d")));
        vis.yAxis.call(d3.axisLeft(vis.y).ticks(5));

        // Draw the area
        vis.pathGroup.append("path")
            .datum(vis.preProcessedData)
            .attr("class", "area")
            .attr("d", vis.area);

        // Add the line
        vis.svg.append("path")
            .datum(vis.preProcessedData)
            .attr("fill", "none")
            .attr("stroke", "#e31a1c")
            .attr("stroke-dasharray", 5.5)
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => vis.x(d.date)+20)
                .y(vis.y(12))
            );

        vis.svg.append("linearGradient")
            .attr("id", "area-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", vis.y(35))
            .attr("x2", 0).attr("y2", vis.y(-1))
            .selectAll("stop")
            .data([
                {offset: "0%", color: "#a0a3ae"},
                {offset: "49%", color: "#a0a3ae"},
                {offset: "50%", color: "#6b6d75"},
                {offset: "100%", color: "#6b6d75"}
            ])
            .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; });

        // Draw the title
        vis.svg.append("text")
            .attr("class", "average")
            .attr('text-anchor', 'end')
            .attr('fill', '#e31a1c')
            .attr('font-size', '12')
            .attr("x", vis.width-25)
            .attr("y", vis.height/1.5)
            .text("Avg. Amount of #1 Songs");

        vis.brushGroup
            .call(vis.brush);

        console.log("timeline viz class ran")
    }

}