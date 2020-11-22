
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

        // //Wrapper for the grid & axes
        // vis.axisGrid = vis.svg.append("g")
        //   .attr("class", "axisWrapper")
        //   .attr("transform",
        //     "translate(" + vis.width/2 + "," + vis.height/2 + ")");

        vis.radialScale = d3.scaleLinear()
            .domain([0,10])
            .range([0,250]);

        vis.ticks = [2,4,6,8];

        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;

        // console.log(vis.billboard);
        // console.log(vis.audioFeatures);

        console.log(selectedTimeRange);

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

        if (selectedTimeRange.length !== 0) {
            console.log("Yes")

            vis.timeData = [];

            // iterate over all rows the csv (dataFill)
            vis.displayData.forEach(row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0] <= row.date && row.date <= selectedTimeRange[1]) {
                    vis.timeData.push(row);
                }
            });
        } else {
            vis.timeData = vis.displayData;
        }

        console.log(vis.timeData)

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.pickedGenre = selectedCategory2;


        if (vis.pickedGenre === "default") {

            vis.averageData = []
            vis.averageData.push(
                {
                    valence: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.valence)) / v.length),
                    acousticness: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.acousticness)) / v.length),
                    danceability: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.danceability)) / v.length),
                    energy: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.energy)) / v.length),
                    instrumentalness: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.instrumentalness)) / v.length),
                    liveness: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.liveness)) / v.length),
                    speechiness: d3.rollup(vis.timeData, v => (d3.sum(v, d => d.speechiness)) / v.length)
                })

            console.log(vis.averageData);
        }
        else if (vis.pickedGenre !== "default") {
            vis.filteredData = vis.displayData.filter(function (d) {return (d.genre === vis.pickedGenre) })
            vis.averageData = []
            vis.averageData.push(
                {
                    valence: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.valence)) / v.length),
                    acousticness: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.acousticness)) / v.length),
                    danceability: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.danceability)) / v.length),
                    energy: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.energy)) / v.length),
                    instrumentalness: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.instrumentalness)) / v.length),
                    liveness: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.liveness)) / v.length),
                    speechiness: d3.rollup(vis.filteredData, v => (d3.sum(v, d => d.speechiness)) / v.length)
                })
            console.log(vis.averageData);
        }

        console.log(vis.averageData);

        // d3.selectAll("svg > *").remove();

        //draw grid lines (circles)
        vis.ticks.forEach(t =>
            vis.svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 300)
                .attr("fill", "none")
                .attr("opacity", 1)
                .attr("stroke", "black")
                .attr("r", vis.radialScale(t))
        );

        //draw tick labels
        vis.ticks.forEach(t =>
            vis.svg.append("text")
                .attr("x", 305)
                .attr("y", 300 - vis.radialScale(t))
                .text(t.toString())
        );

        //draw axis for each feature
        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * vis.radialScale(value);
            let y = Math.sin(angle) * vis.radialScale(value);
            return {"x": 300 + x, "y": 300 - y};
        }

        vis.features =  [
            "valence",
            "acousticness",
            "danceability",
            "energy",
            "instrumentalness",
            "liveness",
            "speechiness"
        ];

        vis.allAxis = [
            "VALENCE",
            "ACOUSTICNESS",
            "DANCEABILITY",
            "ENERGY",
            "INSTRUMENTALNESS",
            "LIVENESS",
            "SPEECHINESS"
        ];

        for (var i = 0; i < vis.allAxis.length; i++) {
            let ft_name = vis.allAxis[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.allAxis.length);
            let line_coordinate = angleToCoordinate(angle, 8);
            let label_coordinate = angleToCoordinate(angle, 10.5);
            vis.svg.append("line")
                .attr("x1", 300)
                .attr("y1", 300)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke","black");
            vis.svg.append("text")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y+20)
                .attr("text-anchor", "middle")
                .attr("font-size", 14)
                .style("fill", "black")
                .style("stroke", "black")
                .text(ft_name);
        }

        //draw line for the radar chart
        let line = d3.line()
            .x(d => d.x)
            .y(d => d.y);

        //get coordinates for a data point
        function getPathCoordinates(d){
            let coordinates = [];
            for (var i = 0; i < vis.features.length; i++){
                let ft = vis.features[i];
                let angle = (Math.PI / 2) + (2 * Math.PI * i / vis.features.length);
                coordinates.push(angleToCoordinate(angle, (d[ft] * 10)));
            }
            console.log(coordinates)
            return coordinates;
        }

        console.log(vis.displayData[0])
        console.log(vis.averageData[0])

        // for (var i = 0; i < vis.averageData.length; i ++) {
        let d = vis.averageData[0];
        let coordinates = getPathCoordinates(d);

        // This is not working
        // vis.svg.selectAll(".path")
        //   .datum(coordinates)
        //   .enter()
        //   .append("path")
        //   .attr("d", line)
        //   .attr("stroke-width", 3)
        //   .attr("stroke", "blue")
        //   .attr("fill", "blue")
        //   .transition()
        //   .attr("stroke-opacity", 1)
        //   .attr("opacity", 0.5);

        // This is
        vis.svg.append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("stroke-width", 3)
            .attr("stroke", "blue")
            .attr("fill", "blue")
            .transition()
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.5);

        // }


        console.log("radar viz class ran")
    }

}
