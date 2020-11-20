
class RadarGraph {

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
        vis.margin = {top: 20, right: 10, bottom: 30, left: 150};
        vis.width = 900 - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        vis.svg.append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        //Wrapper for the grid & axes
        vis.axisGrid = vis.svg.append("g")
            .attr("class", "axisWrapper")
            .attr("transform",
                "translate(" + vis.width/2 + "," + vis.height/2 + ")");

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
            vis.url = +vis.url;


            vis.audioFeatures.forEach(row => {
                if (row["Song"] === vis.song){
                    vis.genre = row["genre"];
                    vis.album = row["spotify_track_album"];
                    vis.acousticness = row["acousticness"];
                    vis.danceability = row["danceability"];
                    vis.energy = row["energy"];
                    vis.speechiness = row["speechiness"];
                    vis.instrumentalness = row["instrumentalness"]
                    vis.liveness = row["liveness"];
                    vis.key = row["key"];
                    vis.spotify_track_id = row["spotify_track_id"];
                    vis.valence = row["valence"];
                    vis.tempo = row["tempo"];
                }
            })

            // populate final array
            vis.displayData.push(
                {
                    song: vis.song,
                    performer: vis.performer,
                    weeks: vis.weeks,
                    genre: vis.genre,
                    date: vis.url,
                    spotify_track_album: vis.album,
                    acousticness: vis.acousticness,
                    danceability: vis.danceability,
                    energy: vis.energy,
                    speechiness: vis.speechiness,
                    instrumentalness: vis.instrumentalness,
                    liveness: vis.liveness,
                    valence: vis.valence,
                    tempo: vis.tempo,
                    key: vis.key,
                    spotify_track_id: vis.spotify_track_id
                })
        })

        console.log(vis.displayData);

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        var cfg = {
            w: 400,				//Width of the circle
            h: 400,				//Height of the circle
            margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 0, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        };

        var radius = Math.min(cfg.w/2, cfg.h/2);	//Radius of the outermost circle
        vis.format = d3.format(".0%");

        //Draw the background circles
        vis.axisGrid.selectAll(".levels")
            .data(d3.range(1,(cfg.levels+1)).reverse())
            .enter()
            .append("circle")
            .attr("class", "gridCircle")
            .attr("r", function(d, i){return radius/cfg.levels*d;})
            .attr("fill", "#969696")
            .attr("stroke", "#949494")
            .attr("stroke-width", 2)
            .attr("fill-opacity", 0.2);

        //Text indicating at what % each level is
        vis.axisGrid.selectAll(".axisLabel")
            .data(d3.range(1,(cfg.levels+1)).reverse())
            .enter().append("text")
            .attr("class", "axisLabel")
            .attr("x", 4)
            .attr("y", function(d){return -d*radius/cfg.levels;})
            .attr("dy", "0.4em")
            .style("font-size", "10px")
            .attr("fill", "#737373")
            .text(function(d,i) { return vis.format((d/cfg.levels)); });

        let total = 7;
        let angleSlice = Math.PI * 2 / total;
        let allAxis = [
            "VALENCE",
            "ACOUSTICNESS",
            "DANCEABILITY",
            "ENERGY",
            "INSTRUMENTALNESS",
            "LIVENESS",
            "SPEECHINESS"
        ];

        console.log(allAxis);

        //Create the straight lines radiating outward from the center
        let axis = vis.axisGrid.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function(d, i){ return (radius) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y2", function(d, i){ return (radius) * Math.sin(angleSlice*i - Math.PI/2); })
            .attr("stroke", "white")
            .attr("stroke-width", "2px");

        axis.append("text")
            .attr("class", "line")
            .style("fill", "black")
            .style("stroke", "black")
            .attr("text-anchor", "middle")
            .attr("text-size", 6)
            .attr("x", function(d, i){ return (230 * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
            .attr("y", function(d, i){ return ((200 * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2)) + 10; })
            .text(function(d){console.log(d); return d});


        console.log("radar viz class ran")
    }

}
