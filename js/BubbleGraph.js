
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

        vis.svg.append("text")
            .text("Bubble Viz")
            .attr("class", "bubbletitle")
            .attr("transform",
                "translate(" + vis.width/2.5 + "," + 50 + ")");

        // let bubbles = null;
        // let labels = null;
        // let nodes = [];
        //
        // // location to centre the bubbles
        // const centre = { x: width/2, y: height/2 };
        //
        // // charge is dependent on size of the bubble, so bigger towards the middle
        // function charge(d) {
        //     return Math.pow(d.radius, 2.0) * 0.01
        // }
        //
        // // strength to apply to the position forces
        // const forceStrength = 0.03;
        //
        // // create a force simulation and add forces to it
        // const simulation = d3.forceSimulation()
        //     .force('charge', d3.forceManyBody().strength(charge))
        //     // .force('center', d3.forceCenter(centre.x, centre.y))
        //     .force('x', d3.forceX().strength(forceStrength).x(centre.x))
        //     .force('y', d3.forceY().strength(forceStrength).y(centre.y))
        //     .force('collision', d3.forceCollide().radius(d => d.radius + 1));
        //
        // // force simulation starts up automatically, which we don't want as there aren't any nodes yet
        // simulation.stop();
        //
        //
        // // set up colour scale
        // const fillColour = d3.scaleOrdinal()
        //     .domain(["1", "2", "3", "5", "99"])
        //     .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);

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

        // Add dots
        vis.dots = vis.svg.append('g')
            .selectAll("dot")
            .data(vis.filteredData)
            .enter()
            .append("circle")
            .attr("cx", 10)
            .attr("cy", 10)
            .attr("r", 10)
            .style("fill", "#69b3a2")
            .style("opacity", "0.7")
            .attr("stroke", "black")

        vis.dots.exit().remove();



        console.log("bubble viz class ran")
    }

}