
class RadarGraph {

    constructor(parentElement, billboard, audioFeatures, whichRadar) {
        this.parentElement = parentElement;
        this.billboard = billboard;
        this.audioFeatures = audioFeatures;
        this.whichRadar = whichRadar;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){
        let vis = this;

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 10, bottom: 30, left: 50};
        vis.width = 660 - vis.margin.left - vis.margin.right;
        vis.height = 480 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (0, ${vis.margin.top})`)

        //Wrapper for the grid & axes
        vis.axisGrid = vis.svg.append("g")
          .attr("class", "axisWrapper")
          .attr("transform",
            "translate(" + vis.width/2 + "," + vis.height/2 + ")");

        vis.radialScale = d3.scaleLinear()
            .domain([0,10])
            .range([0,150]);

        vis.ticks = [2,4,6,8,10];

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

        if (vis.whichRadar === 1) {
            vis.pickedGenre = selectedCategory2;
        } else if (vis.whichRadar === 2) {
            vis.pickedGenre = selectedCategory3;
        }


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

        vis.svg.append("circle")
            .attr("cx", 300)
            .attr("cy", 200)
            .attr("fill", "black")
            .attr("opacity", 1)
            .attr("r", vis.radialScale(10))

        //draw grid lines (circles)
        vis.ticks.forEach(t =>
            vis.svg.append("circle")
                .attr("cx", 300)
                .attr("cy", 200)
                .attr("fill", "none")
                .attr("opacity", 1)
                .attr("stroke", "white")
                .attr("r", vis.radialScale(t))
        );

        //draw tick labels
        vis.ticks.forEach(t =>
            vis.svg.append("text")
                .attr("fill", "white")
                .attr("text-size", 8)
                .attr("x", 305)
                .attr("y", 195 - vis.radialScale(t))
                .text(t.toString()+"0%")
        );

        //draw axis for each feature
        function angleToCoordinate(angle, value){
            let x = Math.cos(angle) * vis.radialScale(value);
            let y = Math.sin(angle) * vis.radialScale(value);
            return {"x": 300 + x, "y": 200 - y};
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
            let line_coordinate = angleToCoordinate(angle, 10);
            let label_coordinate = angleToCoordinate(angle, 13.2);
            vis.svg.append("line")
                .attr("x1", 300)
                .attr("y1", 200)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke","white");
            vis.svg.append("text")
                .attr("x", label_coordinate.x)
                .attr("y", label_coordinate.y+10)
                .attr("text-anchor", "middle")
                .attr("font-size", 14)
                .style("fill", "white")
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

        if (isNaN(vis.averageData[0].acousticness)) vis.averageData[0].acousticness = 0;
        if (isNaN(vis.averageData[0].liveness)) vis.averageData[0].liveness = 0;
        if (isNaN(vis.averageData[0].danceability)) vis.averageData[0].danceability = 0;
        if (isNaN(vis.averageData[0].valence)) vis.averageData[0].valence = 0;
        if (isNaN(vis.averageData[0].speechiness)) vis.averageData[0].speechiness = 0;
        if (isNaN(vis.averageData[0].energy)) vis.averageData[0].energy = 0;
        if (isNaN(vis.averageData[0].instrumentalness)) vis.averageData[0].instrumentalness = 0;

        // for (var i = 0; i < vis.averageData.length; i ++) {
        let d = vis.averageData[0];
        let coordinates = getPathCoordinates(d);


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

        // new genres - alpha
        vis.genres = ["top100", "country", "edm", "jazz", "latin", "pop", "rap", "rb", "rock"]
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range([ "lightgrey", "#fdbf6f", "#b2df8a", "#e31a1c", "#fb9a99", "#ff7f00", "#a6cee3", "#33a02c", "#1f78b4"]);

        vis.svg
            .append("path")
            .datum(coordinates)
            .attr("d", line)
            .attr("stroke-width", 3)
            .attr("stroke", d => {
                return vis.colorScale(vis.pickedGenre)
            })
            .attr("fill", d => {
                return vis.colorScale(vis.pickedGenre)
            })
            .transition()
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.7);

        vis.tooltip = d3.select('body').append('g')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        vis.svg.append('circle')
            .datum(vis.averageData[0])
            .attr("cx", 300)
            .attr("cy", 200)
            .attr("r", vis.radialScale(10))
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseover', function(event) {
                // append tooltip with category data
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                           <div style="border-radius: 5px; background: mintcream; padding: 10px">
                                     <h6>Valence: ${((vis.averageData[0].valence)*100).toFixed(0)}%<h6>
                                     <h6>Speechiness: ${((vis.averageData[0].speechiness)*100).toFixed(0)}%<h6>
                                     <h6>Liveness: ${((vis.averageData[0].liveness)*100).toFixed(0)}%<h6>
                                     <h6>Instrumentalness: ${((vis.averageData[0].instrumentalness)*100).toFixed(0)}%<h6>
                                     <h6>Energy: ${((vis.averageData[0].energy)*100).toFixed(0)}%<h6>
                                     <h6>Danceability: ${((vis.averageData[0].danceability)*100).toFixed(0)}%<h6>
                                     <h6>Acousticness: ${((vis.averageData[0].acousticness)*100).toFixed(0)}%<h6>
                            </div>`);
            })
            .on('mouseout', function(){
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });


        // }

        console.log("radar viz class ran and coordinates: ", coordinates)
    }

}
