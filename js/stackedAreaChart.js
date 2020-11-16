class StackedAreaChart {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, billboard, audioFeatures) {
        this.parentElement = parentElement;
        this.billboard = billboard;
        this.audioFeatures = audioFeatures;
        this.displayData = [];
        this.displayData1 = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }


    /*
     * Method that initializes the visualization (static content, e.g. SVG area or axes)
     */
    initVis(){
        let vis = this;

        // vis.margin = {top: 40, right: 40, bottom: 60, left: 40};
        //
        // vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        // vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;


        // set the dimensions and margins of the graph
        vis.margin = {top: 30, right: 50, bottom: 10, left: 50};
        //vis.width = 1000 - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

        // Sophia keeps getting negative values for height, so I hard coded it in above.
        // vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        // vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        console.log("data:", vis.data);

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // return a color based on genre
        vis.genres = ["rap", "rock", "edm", "rb", "latin", "jazz", "country", "pop", "misc", "unclassified"]

        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range([ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "gray"]);




        // TO-DO: (Filter, aggregate, modify data)
        vis.wrangleData();

    }

    /*
     * Data wrangling
     */
    wrangleData(){
        let vis = this;

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


        console.log("topData", vis.topData);

        vis.topData.forEach( row => {

            vis.song = row["Song"];
            vis.performer = row["Performer"];
            vis.weeks = row["Weeks on Chart"];
            vis.url = row["url"].substr(row["url"].length - 10, 4);
            vis.url = +vis.url;

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


        console.log("stacked display data", vis.displayData);

        //vis.hello = d3.groups(vis.displayData, d => d['date'], d => d['genre']);

        vis.hello = d3.rollups(vis.displayData, v => v.length, d => d['date'], d => d['genre'])
        // vis.hello = d3.rollup(vis.displayData, leaves => leaves.length, d => d['date'])
        vis.hello = Array.from(vis.hello, ([key, value]) => ({key, value}))

        vis.hello.sort(function(x, y){
            return d3.ascending(x.key, y.key);
        })

        console.log("hello", vis.hello);

        // Update the visualization
        vis.updateVis();
    }

    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */
    updateVis(){
        let vis = this;


        console.log("in update vis for area chart")


    }
}