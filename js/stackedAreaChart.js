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

        // set the dimensions and margins of the graph
        vis.margin = {top: 20, right: 10, bottom: 30, left: 150};
        vis.width = 700 - vis.margin.left - vis.margin.right;
        vis.height = 700 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // return a color based on genre
        // new genres - alpha
        vis.genres = ["country", "edm", "jazz", "latin", "pop", "rap", "rb", "rock"]
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range(["#fdbf6f", "#b2df8a", "#e31a1c", "#fb9a99", "#ff7f00", "#a6cee3", "#33a02c", "#1f78b4"]);

        // TO-DO (Activity IV): Add Tooltip placeholder
        vis.svg.append("text")
            .attr("class","tip")
            .attr("fill","white")
            .attr("x",20)
            .attr("y", 10);

        let legendLabels =   ["Country", "EDM", "Jazz", "Latin", "Pop", "Rap", "R&B", "Rock"]

        vis.svg.selectAll("stacked-legend-labels")
            .data(legendLabels)
            .enter()
            .append("text")
            .attr("class", "stacked-legend-labels")
            .attr("x", -100)
            .attr("y", function(d,i){ return 10 + i*25})
            .style("fill", "white")
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        vis.svg.selectAll("stacked-legend-dots")
            .data(vis.genres)
            .enter()
            .append("circle")
            .attr("class", "stacked-legend-dots")
            .attr("id", d => {return "dot-" + d})
            .attr("cx", -120)
            .attr("cy", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return vis.colorScale(d)})

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'stacked-area-tooltip')

        // TO-DO: (Filter, aggregate, modify data)
        vis.wrangleData();

    }

    /*
     * Data wrangling
     */
    wrangleData(){
        let vis = this;

        // Songs that have hit the #1 Billboard chart
        vis.filtered = []

        vis.filtered = vis.billboard.filter(function (d) {return (d["Peak Position"] === 1) })

        vis.names = [];
        vis.result = [];
        let indx = -1;
        for(let i=0; i< vis.filtered.length; i++){
            indx = vis.names.indexOf(vis.filtered[i]["SongID"]);
            if(indx === -1){
                vis.names.push(vis.filtered[i]["SongID"]);
                vis.result.push(vis.filtered[i]);
            }
        }
        vis.topData = vis.result;

        // Number of songs per genre
        vis.categories = [];

        vis.topData.forEach( row => {

            vis.song = row["Song"];
            vis.url = row["url"].substr(row["url"].length - 10, 4);
            vis.url = +vis.url;

            vis.audioFeatures.forEach(row => {
                if (row["Song"] === vis.song){
                    vis.genre = row["genre"];
                }
            })

            // populate final array
            vis.categories.push(
                {
                    // song: vis.song,
                    //performer: vis.performer,
                    // weeks: vis.weeks,
                    genre: vis.genre,
                    date: vis.url
                })
        })


        // console.log("stacked data", vis.categories);

        // Count number of songs per genre
        vis.grouped = d3.rollups(vis.categories, v => v.length, d => d['date'], d => d['genre'])
        vis.grouped = Array.from(vis.grouped, ([key, value]) => ({key, value}))

        vis.grouped.sort(function(x, y){
            return d3.ascending(x.key, y.key);
        })

        // console.log("grouped", vis.grouped);

        // Rearrange data
        vis.grouped.forEach( row => {
            vis.year = row['key']

            vis.rap = 0
            vis.rock = 0
            vis.edm = 0
            vis.rb = 0
            vis.latin = 0
            vis.jazz = 0
            vis.country = 0
            vis.pop = 0
            vis.misc = 0
            vis.unclassified = 0

            row['value'].forEach(genre => {
                // console.log(genre[0]);

                if (genre[0] == "rap") {
                    vis.rap = genre[1];
                }
                if (genre[0] == "rock") {
                    vis.rock = genre[1];
                }
                if (genre[0] == "edm") {
                    vis.edm = genre[1];
                }
                if (genre[0] == "rb") {
                    vis.rb = genre[1];
                }
                if (genre[0] == "latin") {
                    vis.latin = genre[1];
                }
                if (genre[0] == "jazz") {
                    vis.jazz = genre[1];
                }
                if (genre[0] == "country") {
                    vis.country = genre[1];
                }
                if (genre[0] == "pop") {
                    vis.pop = genre[1];
                }
            })

            // populate final array
            vis.displayData.push(
                {
                    year: vis.year,
                    rap: vis.rap,
                    rock: vis.rock,
                    edm: vis.edm,
                    rb: vis.rb,
                    latin: vis.latin,
                    jazz: vis.jazz,
                    country: vis.country,
                    pop: vis.pop,
                })

        })

        // console.log("display data", vis.displayData);

        // Update the visualization
        vis.updateVis();
    }

    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */
    updateVis(){
        let vis = this;


        // console.log("selected time range", selectedTimeRange[0]);

        if (selectedTimeRange.length !== 0) {
            console.log("user has selected a time range")

            vis.rangeData = [];

            // iterate over all rows the csv (dataFill)
            vis.displayData.forEach(row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0] <= row.year && row.year <= selectedTimeRange[1]) {
                    vis.rangeData.push(row);
                }
            });
        } else {
            vis.rangeData = vis.displayData;
            console.log("user has NOT selected a time range");
        }

        // console.log("rangeData", vis.rangeData);

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width])
            .domain(d3.extent(vis.rangeData, function(d) { return d.year }));

        // console.log("extent", d3.extent(vis.rangeData, d=> d.year));

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d3.format("d"));

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // add title
        vis.svg.append('g')
            .attr('class', 'y-axis axistitle')
            .append('text')
            .text('Number of Times a Genre Hit #1')
            .attr('x', 0)
            .attr('y', -10)
            // .attr("transform", "rotate(-90)")
            .attr('text-anchor', 'front');

        // TO-DO (Activity II): Initialize stack layout
        let stack = d3.stack()
            .keys(vis.genres);

        // TO-DO (Activity II) Stack data
        vis.stackedData = stack(vis.rangeData);

        // console.log("Stacked data", vis.stackedData);

        // TO-DO (Activity II) Stacked area layout
        vis.area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d => vis.x(d.data.year))
            .y0(d => vis.y(d[0]))
            .y1(d => vis.y(d[1]));

        ///////////

        // Update domain
        // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
        vis.y.domain([0, d3.max(vis.stackedData, function (d) {
            return d3.max(d, function (e) {
                return e[1];
            });
        })
        ]);

        // Draw the layers
        let categories = vis.svg.selectAll(".area")
            .data(vis.stackedData);

        categories.enter().append("path")
            .attr("class", "area")
            .merge(categories)
            .style("fill", d => {
                return vis.colorScale(d.key)
            })
            .attr("d", d => vis.area(d))


            // TO-DO (Activity IV): update tooltip text on hover
            .on("mouseover", function(event, d) {

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                           <div style="border-radius: 5px; background: mintcream; padding: 10px">
                                     <h5> Genre: ${d.key} <h5>
                            </div>`);

                // vis.svg.selectAll(".tip")
                //     .text(d.key)
            })

            .on("mouseout", function(event, d) {
                //remove tooltip
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);

            })

        categories.exit().remove();

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

        ///////////

        console.log("in update vis for area chart")


    }
}