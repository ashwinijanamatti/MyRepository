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

var column_index = {

    0: 'key',
    1: 'Delta Goals',
    2: 'label',
    3: 'Wins',
    4: 'Losses',
    5: 'TotalGames'

};

var sort = false;



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

   d3.selectAll('thead>tr:first-child>*')
        .on('click', function(e,i){



           collapseList();

           //console.log('before = ' + tableElements.length);

            //if(sort == false) {
                tableElements =
                    tableElements
                        .filter(function (d) {

                            return d.value.type == 'aggregate';
                        })
                        .sort(function (a, b) {


                            if(sort == false) {
                                if (i == 0) {

                                    if (a[column_index[i]] > b[column_index[i]])
                                        return -1;
                                    else if (a[column_index[i]] < b[column_index[i]])
                                        return 1;
                                    else
                                        return 0;
                                }
                                else if (i == 2) {

                                    if (a.value.Result[column_index[i]] > b.value.Result[column_index[i]])
                                        return -1;
                                    else if (a.value.Result[column_index[i]] < b.value.Result[column_index[i]])
                                        return 1;
                                    else
                                        return 0;


                                }
                                else {

                                    return b.value[column_index[i]] - a.value[column_index[i]];
                                }
                            }
                            else {

                                if (i == 0) {

                                    if (a[column_index[i]] < b[column_index[i]])
                                        return -1;
                                    else if (a[column_index[i]] > b[column_index[i]])
                                        return 1;
                                    else
                                        return 0;
                                }
                                else if (i == 2) {

                                    if (a.value.Result[column_index[i]] < b.value.Result[column_index[i]])
                                        return -1;
                                    else if (a.value.Result[column_index[i]] > b.value.Result[column_index[i]])
                                        return 1;
                                    else
                                        return 0;


                                }
                                else {

                                    return a.value[column_index[i]] - b.value[column_index[i]];
                                }
                            }

                        });
           
            if(sort == false)
                sort = true;
            else
                sort = false;

           //console.log('after click = ' + tableElements.length);

           updateTable();

       });


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

    tr.exit().remove();

    tr = tr.enter()
        .append('tr')
        .merge(tr)
        .on('mouseover', function(e){


            updateTree(e);
        })
        .on('mouseout', function(e,i) {

            clearTree();
        })
        .on('click', function(d, i){

            if(tableElements[i].value.type == 'aggregate')
                updateList(i);

        });

    var td = tr.selectAll('td')
        .data(function (d) {


            if(d.value.type == 'aggregate') {
                array = [
                    {value: d.key, vis: 'text', type: d.value.type, isName: true},
                    {value: [d.value['Goals Conceded'], d.value['Goals Made']], vis: 'goals', type: d.value.type},
                    {value: d.value.Result['label'], vis: 'text', type: d.value.type},
                    {value: d.value['Wins'], vis: 'bars', type: d.value.type},
                    {value: d.value['Losses'], vis: 'bars', type: d.value.type},
                    {value: d.value['TotalGames'], vis: 'bars', type: d.value.type}
                ];
            }
            else
            {
                array = [
                    {value: d.key, vis: 'text', type: d.value.type, isName: true},
                    {value: [d.value['Goals Conceded'], d.value['Goals Made']], vis: 'goals', type: d.value.type},
                    {value: d.value.Result['label'], vis: 'text', type: d.value.type},
                    {value: 0, vis: 'bars', type: d.value.type},
                    {value: 0, vis: 'bars', type: d.value.type},
                    {value: 0, vis: 'bars', type: d.value.type}
                ];


            }
           // console.log(array);

            return array;
        });

    td.exit().remove();

    var tdEnter = td.enter()
        .append('td');


    var svgEnter = tdEnter.filter(function(d) {
                        return d.vis != 'text';
                    }).append('svg');

    td = tdEnter.merge(td);

    var svg = td.select('svg')
        .attr('width', function(d){

            if(d.vis == 'bars')
                return cellWidth;
            else
                return 2 * cellWidth;
        })
        .attr('height', cellHeight)
        .attr('transform', function(d) {

            if(d.vis == 'goals')
                return 'translate ( 0 , ' + cellHeight/2 + ')';
            else
                return 'translate (0,0)';
        });




    // creating bar charts
    var newTdForBarChartEnter = svgEnter.filter(function (d) {

                                    return d.vis == 'bars' ;
                                });

    newTdForBarChartEnter .append('rect').attr('id','rect1');
    newTdForBarChartEnter .append('text').attr('id','text1');


    var newTdForBarChartSelection =  svg.select('#rect1');

    console.log(newTdForBarChartSelection.data().length);
    console.log(newTdForBarChartEnter.data().length);

    var xScale = d3.scaleLinear()
        .domain([0,d3.max(newTdForBarChartSelection.data(),function(d){

            return d.value;
        })])
        .range([0,cellWidth]);

    var colorScale = d3.scaleLinear()
        .domain([0,d3.max(newTdForBarChartSelection.data(),function(d){

            return d.value;
        })])
        .range(['lightgrey','teal']);


    newTdForBarChartSelection//.select('rect')
        .attr('x', 0)
        .attr('y', 5)
        .attr('height', barHeight)
        .attr('width', function (d) {

                return xScale(d.value);

        })
        .style('fill', function(d) {

              return colorScale(d.value);

        });


    newTdForBarChartSelection = svg.select('#text1');
       newTdForBarChartSelection//.select('text')
        .text(function(d){

            if(d.type == 'aggregate')
                return d.value;
        })
        .style('fill', 'white')
        .attr('x', function(d){

            if(d.type == 'aggregate')
                return xScale(d.value) - 10;
            else
                return 0;
        })
        .attr('y', barHeight - 1)
        ;

    //creating teams and round/result
    td.filter(function (d) {
        return d.vis == 'text';
        })
        .text(function (d) {

            if(d.type == 'game' && d.isName)
                return 'x'+d.value;

            return d.value;
        })
        .style('color', function(d){

            if(d.type == 'game' && d.isName)
                return 'grey';

        });

    //goal chart
    var newTdForGoalsChartEnter = svgEnter.filter(function (d) {

        return d.vis == 'goals';
    })
        .append('g')
        ;
    newTdForGoalsChartEnter.append('rect');
    newTdForGoalsChartEnter.append('circle').attr('id', function(d){
        return 'goalsmade0';
    });
    newTdForGoalsChartEnter.append('circle').attr('id', function(d){
        return 'goalsconceded1';
    });


    var newTdForGoalsChartSelect = svg.select('g');


    newTdForGoalsChartSelect
        .select('rect')
        .classed('goalBar', true)
        .attr('y', function(d){
            if(d.type == 'aggregate')
                return cellHeight/2 - 6;
            else
                return cellHeight/2;
        })
        .attr('x', function(d){

            if(d.value[1] < d.value[0])
                return goalScale(d.value[1]);
            return goalScale(d.value[0]);
        })
        .attr('width', function(d){


                if (goalScale(d.value[1]) - goalScale(d.value[0]) < 0)
                    return goalScale(d.value[0]) - goalScale(d.value[1]);
                return goalScale(d.value[1]) - goalScale(d.value[0]);

        })
        .attr('height', function(d) {

            if(d.type == 'aggregate')
                return 12;
            else
                return 2;
        })
        //.style('opacity', 0.6)
        .style('fill', function(d) {

             if (goalScale(d.value[1]) - goalScale(d.value[0]) < 0)
                    return '#A80000';
                else if (goalScale(d.value[1]) - goalScale(d.value[0]) > 0)
                    return '#0D4F8B';
                else
                    return 'grey';

        });



    newTdForGoalsChartSelect
        .select('#goalsmade0')
        .classed('goalCircle', true)
        .attr('cy', cellHeight/2)
        .attr('cx', function(d){
            return goalScale(d.value[0]);
        })
        .style('stroke', function(d){

            if(d.value[0] == d.value[1])
                return 'grey';
            return '#A80000';
        })
        .style('fill', function(d) {

            if(d.type == 'aggregate') {
                if (d.value[0] == d.value[1])
                    return 'grey';
                return '#A80000';
            }
            return '#fff';
        });



    newTdForGoalsChartSelect
        .select('#goalsconceded1')
        .classed('goalCircle', true)
        .attr('cy', cellHeight/2)
        .attr('cx', function(d){
            return goalScale(d.value[1]);
        })
        .style('stroke', function(d){

            if(d.value[0] == d.value[1])
                return 'grey';
            return '#0D4F8B';
        })
        .style('fill', function(d) {

            if(d.type == 'aggregate') {
                if(d.value[0] == d.value[1])
                    return 'grey';
                return '#0D4F8B';
            }
            return '#fff';
        });


}

/**
 * Collapses all expanded countries, leaving only rows for aggregate values per country.
 *
 */
function collapseList() {

    // ******* TODO: PART IV *******

    var start = 0;
    var end = 0;
    var count = 0;
    //var newArray = [];
    for(var j=0;j<tableElements.length;j++){

        if(tableElements[j].value.type == 'game') {

            if(count == 0){
                start = j;
            }

            count++;
            end = j;
        }
    }

    if(count != 0) {

        var newArray = tableElements.slice(0, start);
        tableElements = newArray.concat(tableElements.slice(end + 1));
        updateTable();
    }


}

/**
 * Updates the global tableElements variable, with a row for each row to be rendered in the table.
 *
 */
function updateList(i) {

    // ******* TODO: PART IV *******


    if(i == tableElements.length-1) {

        var gamesToAppend = tableElements[i].value.games;


        tableElements = tableElements.concat(gamesToAppend);


    }

    else if(tableElements[i+1].value.type == 'aggregate') {
        var gamesToAppend = tableElements[i].value.games;
        var startArray = tableElements.slice(0, i + 1);

        var endArray = tableElements.slice(i + 1);


        tableElements = startArray.concat(gamesToAppend, endArray);
        //console.log(tableElements);

    }
    else if(tableElements[i+1].value.type == 'game'){

        var start = i+1;
        var end = 0;
        var count = 0;

        for(var j=i+1;j<tableElements.length;j++){


            if(tableElements[j].value.type == 'aggregate') {

                break;
            }
            count++;
            end = j;
        }

           var newArray = tableElements.slice(0, start);
            tableElements = newArray.concat(tableElements.slice(end + 1));
        //console.log(tableElements);

    }

    updateTable();


}

/**
 * Creates a node/edge structure and renders a tree layout based on the input data
 *
 * @param treeData an array of objects that contain parent/child information.
 */
function createTree(treeData) {

    // ******* TODO: PART VI *******

    var margin = {top: 20, right: 110, bottom: 30, left: 90},
        width = 700 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    var root = d3.stratify()
                    .id(function(d) {

                        var id = d.id.search(/[0-9]/);


                        return d.id.substr(id);
                    })
                    .parentId(function(d){


                        return d.ParentGame;
                    })(treeData);

    var tree = d3.tree()
                    .size([height, width]);

    var nodes = d3.hierarchy(root, function(d) {

        return d.children;
    });

   nodes = tree(nodes);


    var svg = d3.select('#tree')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append('g')
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

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
        .append("g")
        .attr("class", function(d){

            var classname = 'node';
            if(d.data.data.Wins == 1)
                classname += ' winner';
            return classname;

        })
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")"; })

        ;


    node.append('circle')
        .attr('r', 6);


    node.append("text")
        .attr("dy", ".35em")
        .attr("x", function(d) { return d.children ?
        (d.data.height + 10) * -1 : d.data.height + 10 })
        .style("text-anchor", function(d) {

            if(d.data.depth != 4)
                return 'end';
            else
            return 'start';
        })
        .text(function(d) { return d.data.data.Team; });



}

/**
 * Updates the highlighting in the tree based on the selected team.
 * Highlights the appropriate team nodes and labels.
 *
 * @param team a string specifying which team was selected in the table.
 */
function updateTree(row) {

    // ******* TODO: PART VII *******




    if(row.value.type == 'aggregate'){

        d3.selectAll('.node')
            .filter(function(d) {

                //console.log(d);
                return d.data.data.Team == row.key;
            })
            .classed('selectedLabel',true);
        var d = d3.selectAll('.link')
                    .filter(function(d){

                        return d.data.data.Team == row.key && d.data.data.Wins == 1;
                    })
                .classed('selected',true);

    }
    else {


        d3.selectAll('.node')
            .filter(function(d) {


                return (d.data.data.Team == row.key && d.data.data.Opponent == row.value.Opponent) || (d.data.data.Team == row.value.Opponent && d.data.data.Opponent == row.key);
            })
            .classed('selectedLabel',true);

        d3.selectAll('.link')
            .filter(function(d){

                return (d.data.data.Team == row.key && d.data.data.Opponent == row.value.Opponent) || (d.data.data.Team == row.value.Opponent && d.data.data.Opponent == row.key);
            })
            .classed('selected',true);

    }

}

/**
 * Removes all highlighting from the tree.
 */
function clearTree() {

    // ******* TODO: PART VII *******

    //if()

    d3.selectAll('.selectedLabel')
                .classed('selectedLabel',false);

    d3.selectAll('.selected')
                .classed('selected',false);


}



