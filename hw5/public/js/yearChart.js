/**
 * Constructor for the Year Chart
 *
 * @param electoralVoteChart instance of ElectoralVoteChart
 * @param tileChart instance of TileChart
 * @param votePercentageChart instance of Vote Percentage Chart
 * @param electionInfo instance of ElectionInfo
 * @param electionWinners data corresponding to the winning parties over mutiple election years
 */
function YearChart(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {
    var self = this;

    self.electoralVoteChart = electoralVoteChart;
    self.tileChart = tileChart;
    self.votePercentageChart = votePercentageChart;
    self.electionWinners = electionWinners;
    self.init();
};

/**
 * Initializes the svg elements required for this chart
 */
YearChart.prototype.init = function(){

    var self = this;
    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divyearChart = d3.select("#year-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divyearChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 100;

    //creates svg element within the div
    self.svg = divyearChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
YearChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R") {
        return "yearChart republican";
    }
    else if (party == "D") {
        return "yearChart democrat";
    }
    else if (party == "I") {
        return "yearChart independent";
    }
};


/**
 * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
 */
YearChart.prototype.update = function(){
    var self = this;

    //Domain definition for global color scale
    var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60 ];

    //Color range for global color scale
    var range = ["#0066CC", "#0080FF", "#3399FF", "#66B2FF", "#99ccff", "#CCE5FF", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#FF0000", "#CC0000"];

    //Global colorScale to be used consistently by all the charts
    self.colorScale = d3.scaleQuantile()
        .domain(domain).range(range);


    self.xscale =  d3.scaleLinear()
        .domain([0,self.electionWinners.length])
        .range([self.margin.left, self.svgWidth]);

    // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.


    var lineGenerator = d3.line()
        .x(function (d) {
            return d;
        })
        .y(function (d) {
            return self.svgHeight/2;
        });


    var createLine = d3.select('#year-chart')
        .select('svg')
        .append('path')
        .datum([0,self.svgWidth]);

    createLine.attr('d', lineGenerator)
        .attr('class','path');

    var circleEnterSelection = d3.select('#year-chart')
        .select('svg')
        .selectAll('g')
        .data(self.electionWinners);


    circleEnterSelection.exit().remove();

    circleEnterSelection = circleEnterSelection
        .enter()
        .append('g')
        .merge(circleEnterSelection);



    circleEnterSelection.append('circle')
        .attr('class','yearChart')
        .attr('class', function(d){

            return self.chooseClass(d.PARTY);
        })
        .attr('r',15)
        .attr('cx', function(d,i){

            return self.xscale(i);
        })
        .attr('cy', self.svgHeight/2)
        .on('click', function(d){

            d3.select('.highlighted').classed('highlighted',false);
            this.setAttribute('class','highlighted');

            //console.log(d);

            d3.csv("data/Year_Timeline_"+d.YEAR+".csv",function(error,dataSelection){

                self.electoralVoteChart.update(dataSelection,self.colorScale);
                self.votePercentageChart.update(dataSelection,self.colorScale);
                self.tileChart.update(dataSelection,self.colorScale);

            });

        });




    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    circleEnterSelection.append('text')
        .attr('x',function(d,i){

            return self.xscale(i);
        })
        .attr('y', self.svgHeight/2+45)
        .attr('class','yeartext')
        .text(function(d){
            return d.YEAR;

        });

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
};
