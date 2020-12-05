
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
        vis.margin = {top: 30, right: 50, bottom: 10, left: 20};
        //vis.width = 1000 - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

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


        // return a color based on genre (OLD)
        // vis.genres = ["rap", "rock", "edm", "rb", "latin", "jazz", "country", "pop", "misc", "unclassified", "top100"]
        // vis.colorScale = d3.scaleOrdinal()
        //     .domain(vis.genres)
        //     .range([ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "white", "lightgrey"]);

        // new genres - alpha
        vis.genres = ["top100", "country", "edm", "jazz", "latin", "pop", "rap", "rb", "rock"]
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range([ "lightgrey", "#fdbf6f", "#b2df8a", "#e31a1c", "#fb9a99", "#ff7f00", "#a6cee3", "#33a02c", "#1f78b4"]);

        /*//legend
        vis.svg.selectAll("parallel-coord-legend-dots")
            .data(vis.genres)
            .enter()
            .append("circle")
            .attr("class", "legend-dots")
            .attr("cx", vis.width-100)
            .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return vis.colorScale(d)})*/

        let legendLabels =   ["ALL", "Country", "EDM", "Jazz", "Latin", "Pop", "Rap", "R&B", "Rock"]

        //let legendLabels =   ["Rap", "Rock", "EDM", "R&B", "Latin", "Jazz", "Country", "Pop", "Misc", "Unclassified", "Reset"]
        vis.svg.selectAll("parallel-coord-legend-labels")
            .data(legendLabels)
            .enter()
            .append("text")
            .attr("class", "parallel-coord-legend-labels")
            .attr("x", vis.width-100)
            .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "white")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'parallel-coord-tooltip')


        // hardcoding dimensions, all but mode and loudness
        vis.dimensions = ['acousticness', 'danceability', 'energy', 'speechiness', 'instrumentalness', 'liveness', 'valence', 'tempo','key'];

        // For each dimension, I build a linear scale. I store all in a y object
        vis.y = {}
        for (let i in vis.dimensions) {
            name = vis.dimensions[i]
            vis.y[name] = d3.scaleLinear()
                .domain(d3.extent(vis.audioFeatures, function(d) { return +d[name]; }) )
                .range([vis.height-50, 100])
        }


        // Build the X scale -> it find the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width-100])
            .padding(1)
            .domain(vis.dimensions);

        // Draw the axis:
        vis.svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(vis.dimensions).enter()
            .append("g")
            .attr("class", "parallel-coord-axis")
            // I translate this element to its right position on the x axis
            .attr("transform", function(d) { return "translate(" + vis.x(d) + ")"; })
            // And I build the axis with the call function
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(vis.y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 90)
            .text(function(d) { return d; })
            .style("fill", "white")
            .style("font-size", "12px")

        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;

        vis.filtered = []

        vis.filtered = vis.billboard.filter(function (d) {return (d["Peak Position"] === 1)})
        //console.log("audioFeatures[1]", vis.audioFeatures[1]["spotify_track_preview_url"])
        vis.filtered = vis.audioFeatures.filter(function (d) {return (!!d["spotify_track_preview_url"])})

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
            // vis.url = row["url"].substr(row["url"].length - 10, 4);
            // vis.url = +vis.url;


            vis.audioFeatures.forEach(row => {
                if (row["Song"] === vis.song){
                    vis.album = row["spotify_track_album"];
                    vis.genre = row["genre"];
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
                    vis.spotify_track_preview_url = row["spotify_track_preview_url"];
                }
            })

            // populate final array
            vis.displayData.push(
                {
                    Song: vis.song,
                    Performer: vis.performer,
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
                    spotify_track_id: vis.spotify_track_id,
                    spotify_track_preview_url: vis.spotify_track_preview_url
                })
        })

        console.log("displayData", vis.displayData)
        console.log("audioFeatures", vis.audioFeatures)

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        function startAudio() {
            player.play();
            //player.currentTime = 0;
        }

        vis.timeData = vis.displayData //delete this when fixed
        //comment out timeline for now
        /*if (selectedTimeRange.length !== 0) {
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
        }*/
        vis.filteredData = vis.timeData.filter(function(d,i){ return i < 100 })

        console.log("time display data", vis.filteredData)


        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(vis.dimensions.map(function(p) {
                return [vis.x(p), vis.y[p](d[p])];
            }));
        }

        vis.svg.selectAll("line").remove();

        // Set boolean to if a song is clicked or not
        vis.songClicked = false
        // Draw the lines
        let lines = vis.svg
            .selectAll("myPath")
            // First 100 songs
            .data(vis.filteredData)
        lines.enter()
            .append("path")
            .attr("d",  d => path(d))
            .attr("class", d => {
                console.log("draw a song")
                return "myPath line " + d.genre + " A" + d.spotify_track_id})
            .attr("id", d => {return d.spotify_track_id})
            .style("fill", "none")
            .style("stroke", "lightgrey")
            .style("stroke-width", "1.5px")
            .style("opacity", 0.5)
            .style("cursor", function(d){
                if (vis.songClicked === false) {
                    return "pointer";
                } else {
                    if (vis.songIDClicked === vis.selectedSong) {
                        return "pointer";
                    } else {
                        return "default";
                    }
                }
            })
            .on("mouseover", (event, d) => {
                vis.selectedGenre = d.genre
                vis.selectedSong = d.spotify_track_id

                if (vis.songClicked === false && vis.legendClicked === false) {
                    // first every group turns grey
                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", "0.2")
                        .style("stroke-width", "1.5px")
                    // second the hovered genre takes its color
                    // d3.selectAll("." + vis.selectedGenre)
                    //     .transition().duration(200)
                    //     .style("stroke", vis.colorScale(vis.selectedGenre))
                    //     .style("opacity", "1")
                    // Second the clicked song takes its color
                    d3.selectAll(".A" + vis.selectedSong)
                        .transition().duration(200)
                        .style("stroke", d => vis.colorScale(vis.selectedGenre))
                        .style("opacity", "1")
                        .style("stroke-width", "4px")


                    //tooltip
                    vis.tooltip
                        .style("opacity", 1)
                        .style("left", event.pageX + 20 + "px")
                        .style("top", event.pageY + "px")
                        .html(`
                         <div style="border-radius: 5px; background: mintcream; padding: 10px">
                             <h4 id="tooltip-title">${d.Song}<h4>
                             <h4>Artist: ${d.Performer}</h4>  
                             <h4>Album: ${d.spotify_track_album}</h4>  
                             <h4>Weeks on Chart: ${d.weeks}</h4>
                             <h4>Genre: ${d.genre}</h4>
                             <h4>Acousticness: ${d.acousticness}</h4>  
                             <h4>Danceability: ${d.danceability}</h4>  
                             <h4>Energy: ${d.energy}</h4>  
                             <h4>Speechiness: ${d.speechiness}</h4>  
                             <h4>Instrumentalness: ${d.instrumentalness}</h4>  
                             <h4>Liveness: ${d.liveness}</h4>  
                             <h4>Valence: ${d.valence}</h4>  
                             <h4>Key: ${d.key}</h4>  
                         </div>`);
                } else if (vis.legendClicked === true) {
                    if (d.genre === vis.genreClicked) {
                        //tooltip
                        vis.tooltip
                            .style("opacity", 1)
                            .style("left", event.pageX + 20 + "px")
                            .style("top", event.pageY + "px")
                            .html(`
                         <div style="border-radius: 5px; background: mintcream; padding: 10px">
                             <h4 id="tooltip-title">${d.Song}<h4>
                             <h4>Artist: ${d.Performer}</h4>  
                             <h4>Album: ${d.spotify_track_album}</h4>  
                             <h4>Weeks on Chart: ${d.weeks}</h4>
                             <h4>Genre: ${d.genre}</h4>
                             <h4>Acousticness: ${d.acousticness}</h4>  
                             <h4>Danceability: ${d.danceability}</h4>  
                             <h4>Energy: ${d.energy}</h4>  
                             <h4>Speechiness: ${d.speechiness}</h4>  
                             <h4>Instrumentalness: ${d.instrumentalness}</h4>  
                             <h4>Liveness: ${d.liveness}</h4>  
                             <h4>Valence: ${d.valence}</h4>  
                             <h4>Key: ${d.key}</h4>  
                         </div>`);
                    }
                } else if (vis.songClicked === true) {
                    if (vis.songIDClicked === vis.selectedSong) {
                        //tooltip
                        vis.tooltip
                            .style("opacity", 1)
                            .style("left", event.pageX + 20 + "px")
                            .style("top", event.pageY + "px")
                            .html(`
                         <div style="border-radius: 5px; background: mintcream; padding: 10px">
                             <h4 id="tooltip-title">${d.Song}<h4>
                             <h4>Artist: ${d.Performer}</h4>  
                             <h4>Album: ${d.spotify_track_album}</h4>  
                             <h4>Weeks on Chart: ${d.weeks}</h4>
                             <h4>Genre: ${d.genre}</h4>
                             <h4>Acousticness: ${d.acousticness}</h4>  
                             <h4>Danceability: ${d.danceability}</h4>  
                             <h4>Energy: ${d.energy}</h4>  
                             <h4>Speechiness: ${d.speechiness}</h4>  
                             <h4>Instrumentalness: ${d.instrumentalness}</h4>  
                             <h4>Liveness: ${d.liveness}</h4>  
                             <h4>Valence: ${d.valence}</h4>  
                             <h4>Key: ${d.key}</h4>  
                         </div>`);
                    }
                }
                console.log("tooltip", d)
            })
            .on("mouseout", (event, d) => {
                if (vis.songClicked === false && vis.legendClicked === false) {
                    //return lines to original color
                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", "0.5")
                        .style("stroke-width", "1.5px")
                }

                //remove tooltip
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);

            })
            .on("click", (event, d) => {
                vis.songClicked = true;
                vis.songIDClicked = d.spotify_track_id;

                d3.selectAll(".line")
                    .transition().duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", "0.1")
                    .style("stroke-width", "1.5px")
                // Second the clicked song takes its color
                d3.selectAll(".A" + vis.selectedSong)
                    .transition().duration(200)
                    .style("stroke", d => vis.colorScale(vis.selectedGenre))
                    .style("opacity", "1")
                    .style("stroke-width", "4px")

                console.log("clicked songID:", vis.selectedSong)
                console.log("clicked color: ", vis.colorScale(vis.selectedGenre))

                d3.select("#player")
                    .attr("src", d.spotify_track_preview_url)

                console.log("click!")
            })
            .on("mousedown", (event, d) => {
                d3.select("#player")
                    .attr("src", d.spotify_track_preview_url)

                startAudio()
            });

        lines.exit().remove();


        // Set boolean for clicked genre
        vis.legendClicked = false;

        vis.svg.selectAll("parallel-coord-legend-dots")
            .data(vis.genres)
            .enter()
            .append("circle")
            .attr("class", "parallel-coord-legend-dots")
            .attr("id", d => {return "dot-" + d})
            .attr("cx", vis.width-120)
            .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return vis.colorScale(d)})
            .style("cursor", function(d){
                if (vis.legendClicked === false) {
                    return "pointer";
                } else {
                    return "default";
                }
            })
            .on("mouseover", (event, d) => {
                console.log("legend mouseover")
                vis.selectedGenre = d
                if (vis.legendClicked === false && vis.songClicked === false) {
                    // first every group turns grey
                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", "0.2")
                        .style("stroke-width", "1.5px")
                    // second the hovered genre takes its color
                    d3.selectAll("." + vis.selectedGenre)
                        .transition().duration(200)
                        .style("stroke", vis.colorScale(vis.selectedGenre))
                        .style("opacity", "1")

                    //d3.select(this).style("cursor", "pointer");
                    if (d === "top100") {
                        //return lines to original color
                        d3.selectAll(".line")
                            .transition().duration(200)
                            .style("stroke", "lightgrey")
                            .style("opacity", "0.5")
                            .style("stroke-width", "1.5px")
                    }
                }
            })
            .on("mouseout", (event, d) => {
                //d3.select(this).style("cursor", "default");

                if (vis.legendClicked === false && vis.songClicked === false) {
                    //return lines to original color
                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", "0.5")
                        .style("stroke-width", "1.5px")
                }

            })
            .on("click", (event, d) => {
                vis.legendClicked = true;
                vis.genreClicked = d;
                console.log("clicked d", d)

                if (d === "top100") {
                    //return lines to original color
                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", "0.5")
                        .style("stroke-width", "1.5px")

                    //reset
                    vis.legendClicked = false;
                    vis.songClicked = false;
                } else {
                    d3.selectAll(".line")
                        .transition().duration(200)
                        .style("stroke", "lightgrey")
                        .style("opacity", "0.3")
                        .style("stroke-width", "1.5px")
                    // Second the clicked genre takes its color
                    d3.selectAll("." + vis.selectedGenre)
                        .transition().duration(200)
                        .style("stroke", vis.colorScale(vis.selectedGenre))
                        .style("opacity", "1")
                        .style("stroke-width", "2px")
                }

                console.log("click!")
            })

        vis.resetButton = vis.svg.append("rect")
            .attr("style", "fill:lightgray")
            .attr("x", vis.width-120)
            .attr("y", 325)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("width", 80)
            .attr("height", 30)
            .text("Reset")



        console.log("parallel coordinates class ran")
    }

}