
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

        // return a color based on genre
        vis.genres = ["rap", "rock", "edm", "rb", "latin", "jazz", "country", "pop", "misc", "unclassified"]
        vis.colorScale = d3.scaleOrdinal()
            .domain(vis.genres)
            .range([ "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "gray"]);




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

        vis.updateVis()
    }

    updateVis() {
        let vis = this;





            console.log("radar viz class ran")
        }

}