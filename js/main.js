/* main JS file */

console.log("Hello JS world!");

let myBubbleGraph,
    myParallelCoordinates,
    myRadarGraph,
    myStackedAreaChart,
    myTimeline,
    myRadarSong,
    myTimelineParCoord;

let dateParser = d3.timeParse("%m-%d-%Y");
let selectedCategory = d3.select("#categorySelector").property("value");
let selectedCategory2 = d3.select("#categorySelector2").property("value")
let selectedCategory3 = d3.select("#categorySelector3").property("value")
let selectedSong = d3.select("#songSelector").property("value");

let selectedTimeRange = [];

// load data using promises
let promises = [

    d3.csv("data/Hot_Stuff.csv"),
    d3.csv("data/Hot_100_Audio_Features.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // Convert data types of billboard data
    dataArray[0].forEach(function(data){
        data.Instance = +data.Instance;
        data.WeekID = dateParser(data.WeekID);
        data['Peak Position'] = +data['Peak Position'];
        data['Week Position'] = +data['Week Position'];
        data['Weeks on Chart'] = +data['Weeks on Chart'];
    })

    // Convert data types of audio features data
    dataArray[1].forEach(function(data){
        data.acousticness = +data.acousticness;
        data.danceability = +data.danceability;
        data.energy = +data.energy;
        data.key = +data.key;
        data.instrumentalness = +data.instrumentalness;
        data.liveness = +data.liveness;
        data.loudness = +data.loudness;
        data.mode = +data.mode;
        data.speechiness = +data.speechiness;
        data.spotify_track_duration_ms = +data.spotify_track_duration_ms;
        data.spotify_track_popularity = +data.spotify_track_popularity;
        data.tempo = +data.tempo;
        data.time_signature = +data.time_signature;
        data.valence = +data.valence;
    })

    // log data
    console.log('check out the data', dataArray);

    // init table
    myParallelCoordinates = new ParallelCoordinates('parallelCoordinatesViz', dataArray[0], dataArray[1]);
    myBubbleGraph = new BubbleGraph('bubbleViz', dataArray[0], dataArray[1]);
    myTimeline = new Timeline('timeline', dataArray[0], dataArray[1]);
    //myTimelineParCoord = new Timeline('timeline-par-coord', dataArray[0], dataArray[1]);
    myRadarGraph = new RadarGraph('radarGraph', dataArray[0], dataArray[1], 1);
    myRadarGraph2 = new RadarGraph('radarGraph2', dataArray[0], dataArray[1], 2);
    myRadarSong = new RadarSong('radarSong', dataArray[0], dataArray[1]);
    myStackedAreaChart = new StackedAreaChart('stackedAreaChart', dataArray[0], dataArray[1]);
    myTimelineStacked = new Timeline2('timeline-stacked', dataArray[0], dataArray[1]);
}

// update vis on category change
function categoryChange() {

    selectedCategory = d3.select("#categorySelector").property("value");

    // console.log(selectedCategory);

    myBubbleGraph.updateVis();

}

// update vis on category change
function categoryChange2() {

    selectedCategory2 = d3.select("#categorySelector2").property("value");

    d3.select("#categorySelector3").selectAll(".option3").attr("disabled", null)
    d3.select("#categorySelector3").select("#"+selectedCategory2+"3").attr("disabled", "disabled")

    console.log(selectedCategory2);

    myRadarGraph.wrangleData();

}

// update vis on category change
function categoryChange3() {

    selectedCategory3 = d3.select("#categorySelector3").property("value");

    d3.select("#categorySelector2").selectAll(".option2").attr("disabled", null)
    d3.select("#categorySelector2").select("#"+selectedCategory3+"2").attr("disabled", "disabled")

    console.log(selectedCategory3);

    myRadarGraph2.wrangleData();

}

// input correct song
function songSelector() {

    selectedSong = d3.select("#songSelector").property("value");
    console.log("Selected a song", songSelector);

    myRadarSong.updateVis();

}