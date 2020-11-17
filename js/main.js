/* main JS file */

console.log("Hello JS world!");

let myBubbleGraph,
    myParallelCoordinates,
    myRadarGraph,
    myStackedAreaChart,
    myTimeline,
    myTimelineParCoord;

let dateParser = d3.timeParse("%m-%d-%Y");
let selectedCategory = d3.select("#categorySelector").property("value");
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
    myTimelineParCoord = new Timeline('timeline-par-coord', dataArray[0], dataArray[1]);
    myStackedAreaChart = new StackedAreaChart('stackedAreaChart', dataArray[0], dataArray[1]);
    myRadarGraph = new RadarGraph('radarGraph', dataArray[0], dataArray[1]);
}

// update vis on category change
function categoryChange() {

    selectedCategory = d3.select("#categorySelector").property("value");

    // console.log(selectedCategory);

    myBubbleGraph.updateVis();

}