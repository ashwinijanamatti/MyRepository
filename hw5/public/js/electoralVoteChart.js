
/**
 * Constructor for the ElectoralVoteChart
 *
 * @param shiftChart an instance of the ShiftChart class
 */
function ElectoralVoteChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
ElectoralVoteChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    //Gets access to the div element created for this chart from HTML
    var divelectoralVotes = d3.select("#electoral-vote").classed("content", true);
    self.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 150;

    //creates svg element within the div
    self.svg = divelectoralVotes.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
ElectoralVoteChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party == "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Creates the stacked bar chart, text content and tool tips for electoral vote chart
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */

ElectoralVoteChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory

    function compareFunction(a,b) {

        return a.RD_Difference - b.RD_Difference;
    }

    var data = d3.nest()
        .key( function(d){

            if(d.RD_Difference == 0)
                return 0;
            else if (d.RD_Difference < 0)
                return 1;
            else
                return 2;
        })
        .sortKeys(d3.ascending)
        .sortValues(compareFunction)
        .entries(electionResult);


    var voteChartData = data[0].values;

    for(var i=1;i<data.length;i++){

        voteChartData = voteChartData.concat(data[i].values);
    }


    var xscale = d3.scaleLinear()
        .rangeRound([0,self.svgWidth])
        .domain([0,d3.sum(voteChartData, function(d){

            return d.Total_EV;
        })]);


    var nextX = 0;

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.

    var barsEnter = d3.select('#electoral-vote')
        .select('svg')
        .selectAll('rect')
        .data(voteChartData);

    barsEnter.exit().remove();

    barsEnter = barsEnter.enter()
        .append('rect')
        .merge(barsEnter);

    barsEnter
        .attr('x',function(d,i){

            nextX += xscale(d.Total_EV);

            if(i==0) {


                return i;

            }
            else {
                //previousX = xscale(voteChartData[i - 1].Total_EV);
                return nextX - xscale(voteChartData[i].Total_EV);
            }
        })
        .attr('y',self.svgHeight/2)
        .attr('width', function(d){

            return xscale(d.Total_EV);
        })
        .attr('height', 20)
        .attr('class', 'electoralVotes')
        .attr('fill',function(d){

            if(d.RD_Difference == 0)
                return "darkgreen";
            else
                return colorScale(d.RD_Difference);
        });


    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

};
