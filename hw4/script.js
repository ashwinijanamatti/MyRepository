/** Global var to store all match data for the 2014 Fifa cup */
var teamData;

/** Global var for list of all elements that will populate the table.*/
var tableElements;


/** Variables to be used when sizing the svgs in the table cells.*/
var cellWidth = 70,
    cellHeight = 30,
    cellBuffer = 8,
    barHeight = 20;

/**Set variables for commonly accessed data columns*/
var goalsMadeHeader = 'Goals Made',
    goalsConcededHeader = 'Goals Conceded';

/** Setup the scales*/
var goalScale = d3.scaleLinear()
    .range([cellBuffer, 2 * cellWidth - cellBuffer]);

/**Used for games/wins/losses*/
var gameScale = d3.scaleLinear()
    .range([0, cellWidth - cellBuffer]);

/**Color scales*/
/**For aggregate columns*/
var aggregateColorScale = d3.scaleLinear()
    .range(['#ece2f0', '#016450']);

/**For goal Column*/
var goalColorScale = d3.scaleQuantize()
    .domain([-1, 1])
    .range(['#cb181d', '#034e7b']);

/**json Object to convert between rounds/results and ranking value*/
var rank = {
    "Winner": 7,
    "Runner-Up": 6,
    'Third Place': 5,
    'Fourth Place': 4,
    'Semi Finals': 3,
    'Quarter Finals': 2,
    'Round of Sixteen': 1,
    'Group': 0
};



//For the HACKER version, comment out this call to d3.json and implement the commented out
// d3.csv call below.

d3.json('data/fifa-matches.json',function(error,data){
    teamData = data;
    createTable();
    updateTable();
});


// // ********************** HACKER VERSION ***************************
// /**
//  * Loads in fifa-matches.csv file, aggregates the data into the correct format,
//  * then calls the appropriate functions to create and populate the table.
//  *
//  */
// d3.csv("data/fifa-matches.csv", function (error, csvData) {
//
//    // ******* TODO: PART I *******
//
//
// });
// // ********************** END HACKER VERSION ***************************

/**
 * Loads in the tree information from fifa-tree.csv and calls createTree(csvData) to render the tree.
 *
 */
d3.csv("data/fifa-tree.csv", function (error, csvData) {

    //Create a unique "id" field for each game
    csvData.forEach(function (d, i) {
        d.id = d.Team + d.Opponent + i;
    });

    createTree(csvData);
});

/**
 * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
 * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
 *
 */
function createTable() {

// ******* TODO: PART II *******



    goalScale.domain([0,d3.max(teamData, function(d){

                        return d3.max([d.value['Goals Made'],d.value['Goals Conceded']]);
                    })]);

    var xAxis = d3.axisTop();
    xAxis.scale(goalScale);


    d3.select('#goalHeader')
        .append('svg')
        .attr('height', cellHeight)
        .attr('width', 2 * cellWidth)
        .append('g')
        .attr('transform','translate(' + 0 + ',' + (cellHeight - 2) + ')')
        .call(xAxis);

    //populating teams
    tableElements = teamData;
// ******* TODO: PART V *******

}

/**
 * Updates the table contents with a row for each element in the global variable tableElements.
 *
 */
function updateTable() {

// ******* TODO: PART III *******
    var array = [];
    var tr = d3.select('tbody')
        .selectAll('tr')
        .data(tableElements);

    var td = tr.enter()
        .append('tr')
        .selectAll('td')
        .data(function (d) {

            array = [
                {value: d.key, vis: 'text', type: d.type },
                {value: [d.value['Goals Conceded'], d.value['Goals Made']], vis: 'goals', type: d.type },
                {value: d.value.Result['label'], vis: 'text', type: d.type },
                {value: d.value['Wins'], vis: 'bars', type: d.type },
                {value: d.value['Losses'], vis: 'bars', type: d.type },
                {value: d.value['TotalGames'], vis: 'bars', type: d.type }
            ];

            return array;
        })
        .enter()
        .append('td');

    // creating bar charts
    var newTdForBarChart = td.filter(function (d) {

            return d.vis == 'bars';
        });

    var xScale = d3.scaleLinear()
        .domain([0,d3.max(newTdForBarChart.data(),function(d){

            return d.value;
        })])
        .range([0,cellWidth]);

    var colorScale = d3.scaleLinear()
        .domain([0,d3.max(newTdForBarChart.data(),function(d){

            return d.value;
        })])
        .range(['lightgrey','teal']);

    newTdForBarChart.append('svg')
        .attr('height', cellHeight)
        .attr('width', cellWidth)
        .style('float', 'left')
        .attr('transform', 'translate(' + cellHeight + ', 0) rotate(-90)')
        .append('rect')
        .attr('x', 0)
        .attr('y', 5)
        .attr('height', barHeight)
        .attr('width', function (d) {
            //console.log(d);
            return xScale(d.value);
        })
        .style('opacity', 1)
        .style('fill', function(d) {
            return colorScale(d.value);
        });


    //creating teams and round/result
    td.filter(function (d) {
        return d.vis == 'text';
        })
        .text(function (d) {
            return d.value;
        });

    //goal chart
    var newTdForGoalsChart = td.filter(function (d) {
        //console.log(d)
        return d.vis == 'goals';
    });

    newTdForGoalsChart.append('svg')
        .attr('height', cellHeight )
        .attr('width', 2 * cellWidth)
        .attr('transform','translate(' + 0 + ',' + (cellHeight - 2) + ')')
        .style('float', 'left')
        .append('g')
        .append('rect')
        .classed('goalBar', true)
        .attr('y', cellHeight/2 - 5)
        .attr('x', function(d){

            if(d.value[1] < d.value[0])
                return goalScale(d.value[1]);
            return goalScale(d.value[0]);
        })
        .attr('width', function(d){

            if(goalScale(d.value[1]) - goalScale(d.value[0]) < 0)
                return goalScale(d.value[0]) - goalScale(d.value[1]);
            return goalScale(d.value[1]) - goalScale(d.value[0]);
        })
        .attr('height', 10)
        //.style('opacity', 0.6)
        .style('fill', function(d) {

            if(goalScale(d.value[1]) - goalScale(d.value[0]) < 0)
                return '#A80000';
            else if(goalScale(d.value[1]) - goalScale(d.value[0]) > 0)
                return '#0D4F8B';
            else
                return 'grey';
            //return ;
        });

    newTdForGoalsChart.selectAll('g')
        .append('circle')
        .classed('goalCircle', true)
        .attr('cy', cellHeight/2)
        .attr('cx', function(d){
            return goalScale(d.value[0]);
        })
        //.style('opacity', 1)
        .style('fill', function(d) {

            if(d.value[0] == d.value[1])
                return 'grey';
            return '#A80000';
        })

    newTdForGoalsChart.selectAll('g')
        .append('circle')
        .classed('goalCircle', true)
        .attr('cy', cellHeight/2)
        .attr('cx', function(d){
            return goalScale(d.value[1]);
        })
        //.style('opacity', 1)
        .style('fill', function(d) {
            if(d.value[0] == d.value[1])
                return 'grey';
            return '#0D4F8B';
        });



}

/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******


}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******

    //console.log(treeData);

    var root = d3.stratify()
                    .id(function(d) {
                        return d.id;
                    })
                    .parentId(function(d){
                        return d.ParentGame;
                    });

    var tree = d3.tree()
                    .size(500, 900);

    var svg = d3.select('#tree');

    var g = svg.append('g');

    var nodes = tree(root);

    var link = g.selectAll('.link')
                .data(nodes.descendants().slice(1))
                .enter()
                .append('path')
                .attr('class','link')
                .attr("d", function(d) {
                    return "M" + d.y + "," + d.x
                            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                            + " " + d.parent.y + "," + d.parent.x;
                });

    var node = g.selectAll('.node')
                .data(nodes.descendants())
        .enter()
        .append('path')
        .attr("d", d3.symbol()
            .size(function(d) { return d.data.value * 30; } )
            .type(function(d) { if
            (d.data.value >= 9) { return d3.key; } else if
            (d.data.value <= 9) { return d3.id;}
            }));




};

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******


}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******
    

}



