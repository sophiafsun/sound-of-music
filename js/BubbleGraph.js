
class BubbleGraph {

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
        vis.margin = {top: 30, right: 30, bottom: 10, left: 10};
        vis.width = 700 - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

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

        vis.svg.append("text")
            .text("Bubble Viz")
            .attr("class", "bubbletitle")
            .attr("transform",
                "translate(" + vis.width/2.5 + "," + 50 + ")");

        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;

        console.log(vis.billboard);



        vis.filtered = []

        // if (vis.sortedData["Peak Position"] === 1)

        vis.filtered = vis.billboard.filter(function (d) {return (d["Peak Position"] === 1) })
        console.log(vis.filtered)

        vis.sortedData = vis.filtered.sort((a,b) => d3.descending(a["Weeks on Chart"], b["Weeks on Chart"]));

        // console.log(vis.sortedData[0]["SongID"]); //

        vis.updateVis()
    }

    updateVis(){
        let vis = this;


        console.log("bubble viz class ran")
    }

}