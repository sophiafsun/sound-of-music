
class ParallelCoordinates {

    constructor(parentElement, billboard, audioFeatures) {
        this.parentElement = parentElement;
        this.billboard = billboard;
        this.audioFeatures = audioFeatures;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 30, right: 50, bottom: 10, left: 50};
        vis.width = 460 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // Sophia keeps getting negative values for height, so I hard coded it in above.
        // vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        // vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        // vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        vis.svg.append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");


        // return a color based on genre
        vis.colorScale = d3.scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica" ])
            .range([ "#440154ff", "#21908dff", "#fde725ff"]);

        // hardcoding dimensions
        let dimensions = ['acousticness', 'danceability', 'energy', 'instrumentalness'];

        // For each dimension, I build a linear scale. I store all in a y object
        let y = {}
        for (let i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain( d3.extent(vis.audioFeatures, function(d) { return +d[name]; }) )
                .range([vis.height, 0])
        }


        // Build the X scale -> it find the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width])
            .padding(1)
            .domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) { return [vis.x(p), y[p](d[p])]; }));
        }

        // Draw the lines
        vis.svg
            .selectAll("myPath")
            .data(vis.audioFeatures)
            .enter().append("path")
            .attr("d",  path)
            .style("fill", "none")
            .style("stroke", "#69b3a2")
            .style("opacity", 0.5)

        // Draw the axis:
        vis.svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", function(d) { return "translate(" + vis.x(d) + ")"; })
            // And I build the axis with the call function
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")




    vis.wrangleData()
    }

    wrangleData(){
        let vis = this;

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        console.log("parallel coordinates class ran")
    }

}