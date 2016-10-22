/**
 * Constructor for the Vote Percentage Chart
 */
function VotePercentageChart(){

    var self = this;
    self.init();
}

/**
 * Initializes the svg elements required for this chart
 */
VotePercentageChart.prototype.init = function(){
    var self = this;
    self.margin = {top: 30, right: 20, bottom: 30, left: 50};
    var divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 200;

    //creates svg element within the div
    self.svg = divvotesPercentage.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
};

/**
 * Returns the class that needs to be assigned to an element.
 *
 * @param party an ID for the party that is being referred to.
 */
VotePercentageChart.prototype.chooseClass = function (party) {
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
};

/**
 * Renders the HTML content for tool tip
 *
 * @param tooltip_data information that needs to be populated in the tool tip
 * @return text HTML content for toop tip
 */
VotePercentageChart.prototype.tooltip_render = function (tooltip_data) {
    var self = this;
    var text = "<ul>";
    tooltip_data.result.forEach(function(row){
        text += "<li class = " + self.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
};

/**
 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
 *
 * @param electionResult election data for the year selected
 */
VotePercentageChart.prototype.update = function(electionResult,colorScale){
    var self = this;

    //for reference:https://github.com/Caged/d3-tip
    //Use this tool tip element to handle any hover over the chart
    var tip = d3.tip().attr('class', 'd3-tip')
        .direction('s')
        .offset(function() {
            return [0,0];
        })
        .html(function(d) {
            // populate data in the following format
              tooltip_data = {
              "result":[
              {"nominee": d.D_Nominee_prop,"votecount": d.D_Votes_Total,"percentage": d.D_PopularPercentage,"party":"D"} ,
              {"nominee": d.R_Nominee_prop,"votecount": d.R_Votes_Total,"percentage": d.R_PopularPercentage,"party":"R"} ,
              {"nominee": d.I_Nominee_prop,"votecount": d.I_Votes_Total,"percentage": d.I_PopularPercentage,"party":"I"}
              ]
             }
              //pass this as an argument to the tooltip_render function then,
             //return the HTML content returned from that method.

            return self.tooltip_render(tooltip_data);
        });


    // ******* TODO: PART III *******

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    var nextX = 0;

    var i_percentage = 0;

     if(electionResult[0].I_PopularPercentage.split("%").length > 0)

         i_percentage =  electionResult[0].I_PopularPercentage.split("%")[0];


    var data = [
        {
            "percentage" : i_percentage,
            "D_PopularPercentage"  : electionResult[0].D_PopularPercentage.split("%")[0],
            "D_Nominee_prop" : electionResult[0].D_Nominee_prop,
            "D_Votes_Total" :  electionResult[0].D_Votes_Total,
            "I_PopularPercentage"  : i_percentage,
            "I_Nominee_prop" : electionResult[0].I_Nominee_prop,
            "I_Votes_Total" :  electionResult[0].I_Votes_Total,
            "R_PopularPercentage"  : electionResult[0].R_PopularPercentage.split("%")[0],
            "R_Nominee_prop" : electionResult[0].R_Nominee_prop,
            "R_Votes_Total" :  electionResult[0].R_Votes_Total,
            "name": electionResult[0].I_Nominee_prop,
            "party" : "I"

        },
        {
            "percentage" : electionResult[0].D_PopularPercentage.split("%")[0],
            "D_PopularPercentage"  : electionResult[0].D_PopularPercentage.split("%")[0],
            "D_Nominee_prop" : electionResult[0].D_Nominee_prop,
            "D_Votes_Total" :  electionResult[0].D_Votes_Total,
            "I_PopularPercentage"  : i_percentage,
            "I_Nominee_prop" : electionResult[0].I_Nominee_prop,
            "I_Votes_Total" :  electionResult[0].I_Votes_Total,
            "R_PopularPercentage"  : electionResult[0].R_PopularPercentage.split("%")[0],
            "R_Nominee_prop" : electionResult[0].R_Nominee_prop,
            "R_Votes_Total" :  electionResult[0].R_Votes_Total,
            "name": electionResult[0].D_Nominee_prop,
            "party" : "D"
        },
        {
            "percentage" : electionResult[0].R_PopularPercentage.split("%")[0],
            "D_PopularPercentage"  : electionResult[0].D_PopularPercentage.split("%")[0],
            "D_Nominee_prop" : electionResult[0].D_Nominee_prop,
            "D_Votes_Total" :  electionResult[0].D_Votes_Total,
            "I_PopularPercentage"  : i_percentage,
            "I_Nominee_prop" : electionResult[0].I_Nominee_prop,
            "I_Votes_Total" :  electionResult[0].I_Votes_Total,
            "R_PopularPercentage"  : electionResult[0].R_PopularPercentage.split("%")[0],
            "R_Nominee_prop" : electionResult[0].R_Nominee_prop,
            "R_Votes_Total" :  electionResult[0].R_Votes_Total,
            "name": electionResult[0].R_Nominee_prop,
            "party" : "R"
        }
    ];


    var xscale = d3.scaleLinear()
        .rangeRound([0,self.svgWidth])
        .domain([0,d3.sum(data, function(d){

            return d.percentage;
        })]);


    var barsEnter = d3.select('#votes-percentage')
        .select('svg')
        .selectAll('.votePercentage')
        .data(data);

    barsEnter.exit().remove();

    barsEnter = barsEnter.enter()
        .append('rect')
        .merge(barsEnter);

    self.svg.call(tip);

    barsEnter
        .classed('votePercentage',true)
        .attr('x',function(d,i){

            nextX += xscale(d.percentage);

            if(i==0) {

                d.xscale = i;

                return i;
            }
            else {
                d.xscale = nextX - xscale(d.percentage);

                return nextX - xscale(d.percentage);
            }
        })
        .attr('y',self.svgHeight/2)
        .attr('width', function(d){

            return xscale(d.percentage);
        })
        .attr('height', 20)
        //.attr('class', 'votesPercentage')
        .attr('class',function(d){

            return self.chooseClass(d.party);
        })
        .on('mouseover',tip.show)
        .on('mouseout',tip.hide);

    var text1 = d3.select('#votes-percentage')
        .select('svg')
        .selectAll('.votesPercentageNote')
        .data(data);


    text1.exit().remove();


    text1 = text1.enter()
        .append('text')
        .merge(text1);


    text1.attr('x',function(d,i){

        if(d.percentage) {

            if(d.party == 'R')
                return ((self.svgWidth - d.xscale)/2) + d.xscale;
            else if(d.party == 'D')
                return d.xscale + ((data[i+1].xscale+d.xscale)/3);
            return d.xscale;
        }
        else
            return;
        })
        .attr('y', (0.3 * self.svgHeight))
        .attr('class',function(d){

            return 'votesPercentageNote ' + self.chooseClass(d.party);
        })
        .text(function(d){

            if(d.name)
                return d.name;
            else
                return;

        });



    var mid_point = [];

    mid_point.percentage = d3.sum(data,function(d){

        return d.percentage;
    });

    mid_point.percentage = Math.ceil(mid_point.percentage/2);

    mid_point.party = 'mid';

    mid_point.xscale = (self.svgWidth/2) - 50;


    for(var i=0;i<data.length;i++) {

        if(data[i].party == 'R')
            data[i].xscale = self.svgWidth - 50;
    }
    //var datafortext =  data;

    var datafortext = data.concat([mid_point]);


    var text = d3.select('#votes-percentage')
        .select('svg')
        .selectAll('.votesPercentageText')
        .data(datafortext);

    text.exit().remove();

    text = text.enter()
        .append('text')
        .merge(text);

    text.attr('x',function(d,i){

        if(i == 1)
            return d.xscale + 10 ;
        else
            return d.xscale;


    })
        .attr('y', (0.47 * self.svgHeight))
        .attr('class',function(d){

            if(d.party == 'mid')
                return 'votesPercentageText';

            return 'votesPercentageText ' + self.chooseClass(d.party);
        })
        .text(function(d){

            if(d.party == 'mid')
                return 'Popular Vote('+d.percentage+'%)';

            if(d.percentage)
                return d.percentage + '%';
            else
                return ;
        });






    var centerBar = d3.select('#votes-percentage')
        .select('svg')
        .selectAll('.middlePoint')
        .data([2]);

    centerBar.exit().remove();

    centerBar = centerBar.enter()
        .append('rect')
        .classed('middlePoint',true)
        .merge(centerBar);

    centerBar
        .attr('x', self.svgWidth/2)
        .attr('width', function(d){
            return d;
        })
        .attr('y', (0.45 * self.svgHeight))
        .attr('height', (0.65 * self.svgHeight) - (0.45 * self.svgHeight) );


    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

};
