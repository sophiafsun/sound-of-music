/* main JS file */

console.log("Hello JS world!");

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

    // log data
    console.log('check out the data', dataArray);

    // init table
    myParallelCoordinates = new ParallelCoordinates('parallelCoordinatesViz', dataArray[1], dataArray[2]);

}