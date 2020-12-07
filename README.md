# sound-of-music

## So You Want To Be A Popstar: Your Guide to Creating the Next Hit Single

### Code

The bulk of our project is implemented in the `index.html` file, the `css/` folder, and the `js/` folder. We created separate classes for each of the major visualizations that we included in our webpage: `BubbleGraph.js`, `parallelCoordinates.js`, `radarGraph.js`, `stackedAreaChart.js`, and `timeline.js`. 

### Libraries

We borrowed the scrolling webpage layout from some examples we found online, but the design of the webpage, including the neon lights, brick background, and choices for font, were largely of our own creative choices.

### Features

Every visualization on our webpage includes a list of instructions explaining how to interact with the visualization. However, here are a few highlights from the site:

#### Bubble Chart: Top 100 Songs that Hit #1

This visualization shows how songs from different genres have populated the Billboard Top 100 throughout the years. The default view shows the top 100 songs that have taken the #1 spot on the Billboard Top 100 for the longest time. From here, users can choose a specific genre and time period they're interested in and gain a sense of how often songs from each genre top the Billboard Chart. For example, there are many pop and rap songs that hit the #1 spot on the charts, but only six jazz pieces. 

#### Stacked Area: Top Genres that Hit #1

This chart shows the frequency with which a genre hit the top spot on the Billboard Top 100. The user can "zoom-in" by brushing the timeline and seeing a closer view of the trends. The user can also hover over a section of the area chart to see which genre is being displayed. Essentially, we see that the mid-1970s seemed to be a time for experimentation, as people listened to over 35 songs that hit the #1 spot. In contrast, fewer and fewer songs seem to hit the #1 spot in more recent years. This could signify that listeners are getting pickier and less experimental with their music preferences.

#### Parallel Coordinates: Audio Features for Top 100 Songs that Hit #1

Now, this visualization dives deeper into individual songs and what audio features they comprise of. In this parallel coordinates chart, users can mouse over the grey lines to highlight a specific song. Clicking on the line will make the highlighted song stick so that the user can mouse away and still see the trend in audio features for that particular song. The user can also click and hold down to hear a short snippet of the track. Note that once a user has clicked a song, they can only see the tooltip details for the song that they clicked. This allows the user to explore that particular song without being distracted by all of the other lines.

In addition to viewing one single song, the user can also explore trends in entire genres by clicking the dots in the legend. This highlights all of the songs in the selected genre. Note again that once a genre is selected in the legend, the tooltip will only appear for those lines that are selected. Again, this allows the user to focus specifically on the songs of the chosen genre rather than being bombarded with too much information about too many songs.

#### Radar Chart: Average Audio Feature Breakdown By Genre

These radar charts give the user a way to compare the average audio feature makeup of different genres. The default view shows the spread of All Genres on the left, and the dropdown on the right encourages the user to choose a different genre to compare it to. Note that the user cannot select the same genre that is already depicted in the other radar chart, since the purpose of this visualization is to compare different genres. The user can mouseover the radar chart shape to see more specifically the numerical statistics of the average audio features for each genre.

### Supplemental Links
You can find our website here:

You can find our walkthrough video here:

### Authors
Amanda Stetz

Rucha Joshi

Sophia Sun

