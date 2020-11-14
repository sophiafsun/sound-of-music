
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
            .range([ "#440154ff", "#21908dff", "#fde725ff"])

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