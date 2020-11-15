
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
        //vis.width = 500 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // Sophia keeps getting negative values for height, so I hard coded it in above.
        // vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
         vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
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
            .domain(["rap", "rock", "edm", "rb", "latin", "jazz", "country", "pop", "misc", "unclassified" ])
            .range([ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "black"]);

        // hardcoding dimensions
        let dimensions = ['acousticness', 'danceability', 'energy', 'instrumentalness'];

        // For each dimension, I build a linear scale. I store all in a y object
        let y = {}
        for (let i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain(d3.extent(vis.audioFeatures, function(d) { return +d[name]; }) )
                .range([vis.height-20, 0])
        }


        // Build the X scale -> it find the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width])
            .padding(1)
            .domain(dimensions);

        //highlight based on genre that is hovered
        vis.highlight = function(event, d){
            vis.selectedGenre = d.genre

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + vis.selectedGenre)
                .transition().duration(200)
                .style("stroke", vis.colorScale(vis.selectedGenre))
                .style("opacity", "1")
        }

        vis.unhighlight = function(d){
            d3.selectAll(".line")
                .transition().duration(200).delay(1000)
                .style("stroke", function(d){ return( vis.colorScale(d.genre))} )
                .style("opacity", "1")
        }

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) {
                return [vis.x(p), y[p](d[p])];
            }));
        }

        // Draw the lines
        vis.svg
            .selectAll("myPath")
            // First fifty songs in audio features
            .data(vis.audioFeatures.filter(function(d,i){ return i < 50 }))
            .enter().append("path")
            .attr("d",  path)
            .attr("class", d => {return "line " + d.genre})
            .style("fill", "none")
            .style("stroke", d => {return vis.colorScale(d.genre)})
            .style("opacity", 0.5)
            .on("mouseover", vis.highlight)
            .on("mouseout", vis.unhighlight)

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
            .attr("y", 10)
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