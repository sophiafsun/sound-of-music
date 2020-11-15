
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


        // return a color based on genre
        vis.genres = ["rap", "rock", "edm", "rb", "latin", "jazz", "country", "pop", "misc", "unclassified"]
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range([ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "black"]);

        //legend
        vis.svg.selectAll("parallel-coord-legend-dots")
            .data(vis.genres)
            .enter()
            .append("circle")
            .attr("class", "legend-dots")
            .attr("cx", vis.width-100)
            .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return vis.colorScale(d)})
        vis.svg.selectAll("parallel-coord-legend-labels")
            .data(vis.genres)
            .enter()
            .append("text")
            .attr("class", "parallel-coord-legend-labels")
            .attr("x", vis.width-80)
            .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "black")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'parallel-coord-tooltip')


        // hardcoding dimensions, all but mode and loudness
        let dimensions = ['acousticness', 'danceability', 'energy', 'speechiness', 'instrumentalness', 'liveness', 'valence', 'tempo','key'];

        // For each dimension, I build a linear scale. I store all in a y object
        let y = {}
        for (let i in dimensions) {
            name = dimensions[i]
            y[name] = d3.scaleLinear()
                .domain(d3.extent(vis.audioFeatures, function(d) { return +d[name]; }) )
                .range([vis.height-50, 100])
        }


        // Build the X scale -> it find the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width-100])
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
            //.data(vis.audioFeatures)
            // First 500 songs in audio features
            .data(vis.audioFeatures.filter(function(d,i){ return i < 500 }))
            .enter().append("path")
            .attr("d",  path)
            .attr("class", d => {return "line " + d.genre + " A" + d.spotify_track_id})
            .attr("id", d => {return d.spotify_track_id})
            .style("fill", "none")
            .style("stroke", d => {return vis.colorScale(d.genre)})
            .style("stroke-width", "1.5px")
            .style("opacity", 0.5)
            .on("mouseover", (event, d) => {
                vis.selectedGenre = d.genre
                vis.selectedSong = d.spotify_track_id

                // first every group turns grey
                d3.selectAll(".line")
                    .transition().duration(200)
                    .style("stroke", "lightgrey")
                    .style("opacity", "0.2")
                    .style("stroke-width", "1.5px")
                // Second the hovered specie takes its color
                d3.selectAll("." + vis.selectedGenre)
                    .transition().duration(200)
                    .style("stroke", vis.colorScale(vis.selectedGenre))
                    .style("opacity", "1")

                console.log("tooltip", d)

                //tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>${d.Song}<h3>
                             <h4>Artist: ${d.Performer}</h4>  
                             <h4>Album: ${d.spotify_track_album}</h4>  
                             <h4>Genre: ${d.genre}</h4>
                             <h4>Acousticness: ${d.acousticness}</h4>  
                             <h4>Danceability: ${d.danceability}</h4>  
                             <h4>Energy: ${d.energy}</h4>  
                             <h4>Speechiness: ${d.speechiness}</h4>  
                             <h4>Instrumentalness: ${d.instrumentalness}</h4>  
                             <h4>Liveliness: ${d.liveliness}</h4>  
                             <h4>Valence: ${d.valence}</h4>  
                             <h4>Key: ${d.key}</h4>  
                         </div>`);
            })
            .on("mouseout", (event, d) => {
                //return lines to original color
                d3.selectAll(".line")
                    .transition().duration(200)
                    .style("stroke", function(d){ return( vis.colorScale(d.genre))} )
                    .style("opacity", "1")
                    .style("stroke-width", "1.5px")

                //remove tooltip
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .on("click", (event, d) => {

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


                console.log("click!")
            })

        // Draw the axis:
        vis.svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(dimensions).enter()
            .append("g")
            .attr("class", "parallel-coord-axis")
            // I translate this element to its right position on the x axis
            .attr("transform", function(d) { return "translate(" + vis.x(d) + ")"; })
            // And I build the axis with the call function
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", 90)
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