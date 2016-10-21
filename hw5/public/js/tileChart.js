/**
 * Constructor for the TileChart
 */
function TileChart(){

    var self = this;
    self.init();
};

/**
 * Initializes the svg elements required to lay the tiles
 * and to populate the legend.
 */
TileChart.prototype.init = function(){
    var self = this;

    //Gets access to the div element created for this chart and legend element from HTML
    var divTileChart = d3.select("#tiles").classed("content", true);
    var legend = d3.select("#legend").classed("content",true);
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};

    var svgBounds = divTileChart.node().getBoundingClientRect();
    self.svgWidth = svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = self.svgWidth/2;
    var legendHeight = 150;

    //creates svg elements within the div
    self.legendSvg = legend.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",legendHeight)
        .attr("transform", "translate(" + self.margin.left + ",0)")

    self.svg = divTileChart.append("svg")
                        .attr("width",self.svgWidth)
                        .attr("height",self.svgHeight)
                        .attr("transform", "translate(" + self.margin.left + ",0)")
                        .style("bgcolor","green");
                        //.attr("transform","");

};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
TileChart.prototype.chooseClass = function (party) {
    var self = this;
    if (party == "R"){
        return "republican";
    }
    else if (party== "D"){
        return "democrat";
    }
    else if (party == "I"){
        return "independent";
    }
}

/**
 * Renders the HTML content for tool tip.
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for tool tip
 */
TileChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<h2 class ="  + self.chooseClass(tooltip_data.winner) + " >" + tooltip_data.state + "</h2>";
    text +=  "Electoral Votes: " + tooltip_data.electoralVotes;
    text += "<ul>"
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });
    text += "</ul>";
    return text;
}

/**
 * Creates tiles and tool tip for each state, legend for encoding the color scale information.
 *
 * @param electionResult election data for the year selected
 * @param colorScale global quantile scale based on the winning margin between republicans and democrats
 */
TileChart.prototype.update = function(electionResult, colorScale){
    var self = this;

    //Calculates the maximum number of columns to be laid out on the svg
    self.maxColumns = d3.max(electionResult,function(d){
                                return parseInt(d["Space"]);
                            });

    //Calculates the maximum number of rows to be laid out on the svg
    self.maxRows = d3.max(electionResult,function(d){
                                return parseInt(d["Row"]);
                        });
    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            // populate data in the following format
              var tooltip_data = {
              "state": d.State,
              "winner": d.State_Winner,
              "electoralVotes" : d.Total_EV,
              "result":[
              {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes,"percentage": d.D_Percentage,"party":"D"} ,
              {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes,"percentage": d.R_Percentage,"party":"R"} ,
              {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes,"percentage": d.I_Percentage,"party":"I"}
              ]
              };
             // pass this as an argument to the tooltip_render function then,
             // return the HTML content returned from that method.
            return tooltip_data;
        });

    //Creates a legend element and assigns a scale that needs to be visualized
    self.legendSvg.append("g")
        .attr("class", "legendQuantile")
        ;

    var legendQuantile = d3.legendColor()
        .shapeWidth(120)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);

    // ******* TODO: PART IV *******
    //Transform the legend element to appear in the center and make a call to this element for it to display.


    //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.

    var square = 50;


       // create each set of rows
        var rows = self.svg.append('g')
            .attr("transform","scale(1,-1) rotate(-90)")
            .selectAll('rect')
            .data(electionResult);

    rows.exit().remove();

    //rows;

    rows =    rows.enter()
            .append('rect')


    //rows .append('text');
            .merge(rows);

    //rows.append('text');

    rows.call(tip);

    rows
            .attr('class', 'tile')
            .attr('width', square)
            .attr('height', square)
            .attr('x', function(d) {
                    return d.Row * square;
            })
            .attr('y', function(d) {
                return d.Space * square;
            })
            .attr('fill', function(d){

                if(d.RD_Difference == 0)
                    return 'darkgreen';
                else
                    return colorScale(d.RD_Difference);
            })
            .attr('stroke', '#000')
            .on('mouseover',tip.show)
            .on('mouseout',tip.hide);

    /*rows
            .text(function(d){

                return d.Abbreviation;
            })
            .attr('x', function(d){

                return (d.Row * square + square)/2;
            })
            .attr('y', function (d) {

                return (d.Space * square + square)/2;
            });

*/

    //Display the state abbreviation and number of electoral votes on each of these rectangles

    //Use global color scale to color code the tiles.

    //HINT: Use .tile class to style your tiles;
    // .tilestext to style the text corresponding to tiles

    //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
    //then, vote percentage and number of votes won by each party.
    //HINT: Use the .republican, .democrat and .independent classes to style your elements.
};
