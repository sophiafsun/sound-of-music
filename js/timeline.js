
class Timeline {

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
        vis.x = d3.scaleLinear()
            .domain([1950, 2020])
            .range([0, vis.width/1.1]);

        // init x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + 20 + "," + vis.height/2 + ")");

        // init brushGroup:
        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush");

        // init brush
        vis.brush = d3.brushX()
            .extent([[20, 20], [vis.width/1.1+20, vis.height/2]])
            .on("brush end", function(event){
                selectedTimeRange =
                    [Math.trunc(vis.x.invert(event.selection[0])), Math.trunc(vis.x.invert(event.selection[1]))];
                myBubbleGraph.updateVis();
                // myParallelCoordinates.updateVis();
                // myStackedAreaChart.updateVis();
            });


        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;
        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // draw axis
        vis.xAxis.call(d3.axisBottom(vis.x).ticks(8).tickFormat(d3.format("d")));

        vis.brushGroup.call(vis.brush);

        console.log("timeline viz class ran")
    }

}