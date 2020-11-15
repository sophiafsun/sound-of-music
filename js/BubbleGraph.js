
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
        vis.margin = {top: 30, right: 10, bottom: 30, left: 10};
        vis.width = 1000 - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`)

        vis.svg.append("g")
            .attr("transform",
                "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.tooltip = d3.select('body').append('g')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // return a color based on genre
        vis.genres = ["rap", "rock", "edm", "rb", "latin", "jazz", "country", "pop", "misc", "unclassified"]
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range([ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "black"]);


        //legend
        vis.svg.selectAll("bubble-legend-dots")
            .data(vis.genres)
            .enter()
            .append("rect")
            .attr("class", "legend-squares")
            .attr("x", vis.width-120)
            .attr("y", function(d,i){ return vis.width/6 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d){ return vis.colorScale(d)})

        vis.svg.selectAll("bubble-legend-labels")
            .data(vis.genres)
            .enter()
            .append("text")
            .attr("class", "bubble-legend-labels")
            .attr("x", vis.width-100)
            .attr("y", function(d,i){ return vis.width/6 + 5 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "black")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")


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
            // console.log(vis.song);

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

                })
        })

        console.log(vis.displayData);

        vis.updateVis()
    }

    updateVis(){
        let vis = this;
        console.log(selectedCategory);

        // sort by user selected category
        if (selectedCategory === "default") {
            vis.filteredData = vis.displayData.slice(0, 100);
        }
        else {
            vis.temp = vis.displayData.filter(function (d) {return (d["genre"] === selectedCategory) })
            vis.filteredData = vis.temp.slice(0, 100);
        }

        console.log(vis.filteredData);

        let numNodes = vis.filteredData.length
        vis.nodes = d3.range(numNodes).map(function(d) {
            return {radius: vis.filteredData[d].weeks * 0.4}
        })

        console.log(vis.nodes);

        d3.forceSimulation(vis.nodes)
            .force('x', d3.forceX().strength(-0.016))
            .force('y', d3.forceY().strength(-0.016))
            .force('collide', d3.forceCollide(-1))
            .force('center', d3.forceCenter(vis.width / 5, vis.height / 4))
            .on('tick', ticked);


        function ticked() {
            let dots = d3.select('svg')
                .selectAll('circle')
                .data(vis.nodes)

            dots.enter()
                .append('circle')
                .merge(dots)
                .attr('r', function(d) {
                    return d.radius
                })
                .attr('cx', function(d) {
                    return d.x
                })
                .attr('cy', function(d) {
                    return d.y
                })
                .attr("fill", function(d) {
                   return vis.colorScale(vis.filteredData[d.index].genre)
                })
                .attr("transform", "translate(" + vis.width/4 + "," + vis.height/4 + ")")
                .on('mouseover', function(event, object){

                     // grab hovered state
                     let hoveredState = vis.filteredData[object.index];
                     console.log(hoveredState);


                // change color of hovered state
                d3.select(this)
                    .attr('opacity', 0.3);

                // append tooltip with hovered state data
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                           <div style="border-radius: 5px; background: mintcream; padding: 10px">
                                     <h5>${hoveredState.song}<h5>
                                     <h6>${hoveredState.performer}
                                     <br>Weeks on Top Chart: ${hoveredState.weeks}<h6>
                            </div>`);
            })
                .on('mouseout', function(event, object){

                    d3.select(this)
                        .attr("opacity", 1);

                    vis.tooltip
                        .style("opacity", 0)
                        .style("left", 0)
                        .style("top", 0)
                        .html(``);
                });

            dots.exit().remove()
        }

        console.log("bubble viz class ran")
    }

}