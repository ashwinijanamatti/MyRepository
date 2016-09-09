/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {
    // ****** TODO: PART II ******
	
	var rectangles  = [];
	
	for (var i=0;i<11;i++) {
		rectangles[i] = parseInt(document.getElementById("barChart1rect" + i).getAttribute("height"));
	}
	
	rectangles.sort(function(a, b){return a-b});
	
	for (var i=0;i<11;i++) {
		
		//document.getElementById("barChart1rect" + i).removeAttribute("transform");
		//"barChart1rect" + i)
		document.getElementById("barChart1rect" + i).setAttribute("x",i*15);//.setAttribute("y",);
		document.getElementById("barChart1rect" + i).setAttribute("height",rectangles[i]);
	}
	//document.getElementById("group1").setAttribute("transform","translate(0,200) scale(1,-1)");
		
}

function update(error, data) {
    if (error !== null) {
        alert("Couldn't load the dataset!");
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()
        data.forEach(function (d) {
            d.a = parseInt(d.a);
            d.b = parseFloat(d.b);
        });
    }

    // Set up the scales
    var aScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.a;
        })])
        .range([0, 200]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 200]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 200]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
	
	var svg = d3.select("#barChart1");
	var selection = svg.selectAll("rect")
					.data(data);
	
	selection.on('mouseover',function(d,i) {
				this.setAttribute("fill","teal");
				});
				
	selection.on('mouseout',function(d,i) {
				this.setAttribute("fill","steelblue");
				});	
	
	selection
			
				.transition()
				.duration(3000)
                .attr("x", function(d,i) {
					return i*15;
				})
                .attr("y", 0)
                .attr("width", 15)
				
                .attr("height", function (d) {
                    return d.a*10;
                })
				.style("fill","steel blue");
	
	selection.exit()
			.remove();

    // TODO: Select and update the 'b' bar chart bars
	
	svg = d3.select("#barChart2");
	selection = svg.selectAll("rect")
				.data(data);
	
	selection.on('mouseover',function(d,i) {
				this.setAttribute("fill","teal");
				});	
				
	selection.on('mouseout',function(d,i) {
				this.setAttribute("fill","steelblue");
				});	
	selection
			
				.transition()
            .duration(3000)
                .attr("x", function(d,i) {
					return i*15;
				})
                .attr("y", 0)
                .attr("width", 15)
				//.attr("transform",function(d))
                .attr("height", function (d) {
                    return d.b*10;
				})
			.style("fill","steel blue");
	
	selection.exit()
			.remove();

    // TODO: Select and update the 'a' line chart path using this line generator
	
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });

	svg = d3.select("#lineChart1");
	selection = svg.select("path")
				.datum(data);
	
	selection
			.transition()
			.duration(3000)
			.attr("d", aLineGenerator);
	
	
    // TODO: Select and update the 'b' line chart path (create your own generator)
	
	svg = d3.select("#lineChart2");
	var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
		});
		
    selection = svg.select("path")
				.datum(data);
	
	selection
			.transition()
			.duration(3000)
			.attr("d", bLineGenerator);   
    
    
			
    // TODO: Select and update the 'a' area chart path using this line generator
    var aAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return aScale(d.a);
        });
		
	svg = d3.select("#areaChart1");
	selection = svg.select("path")
				.datum(data);
	selection
			.transition()
			.duration(3000)
			.attr("d", aAreaGenerator);

    // TODO: Select and update the 'b' area chart path (create your own generator)

	var bAreaGenerator = d3.area()
        .x(function (d, i) {
            return iScale(i);
        })
        .y0(0)
        .y1(function (d) {
            return bScale(d.b);
        });
		
	svg = d3.select("#areaChart2");
	selection = svg.select("path")
				.datum(data);
	selection
			.transition()
			.duration(3000)
			.attr("d", bAreaGenerator);
	
    // TODO: Select and update the scatterplot points
	
	svg = d3.select("#scatterplotChart");
	selection = svg.selectAll("circle")
				.data(data);
	
	selection
			
			.transition()
            .duration(3000)
			.style("fill", "steel blue")
            .attr("cx", function(d) {
				return d.a*10; })
            .attr("cy", function(d) {
				return d.b*10; })
            .attr("r", 5);
	
	

    // ****** TODO: PART IV ******
}

function changeData() {
    // // Load the file indicated by the select menu
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else{
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

function randomSubset() {
    // Load the file indicated by the select menu,
    // and then slice out a random chunk before
    // passing the data to update()
    var dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            var subset = [];
            data.forEach(function (d) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            });
            update(error, subset);
        });
    }
    else{
        changeData();
    }
}