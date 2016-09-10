/*globals alert, document, d3, console*/
// These keep JSHint quiet if you're using it (highly recommended!)

function staircase() {
    // ****** TODO: PART II ******
	
	var rectangles  = [];
	
	rectangles = document.getElementById('barChart1').children;
	
	
	for (var i=0;i<rectangles.length;i++) {
		
		
		rectangles[i].setAttribute('height',(i+1)*15);
	}
	
		
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
        .range([0, 190]);
    var bScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d.b;
        })])
        .range([0, 190]);
    var iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 190]);

    // ****** TODO: PART III (you will also edit in PART V) ******

    // TODO: Select and update the 'a' bar chart bars
	
	var svg1 = d3.select("#barChart1");
	var selection1 = svg1.selectAll("rect")
					.data(data);
	
	selection1
			
				.transition()
				.duration(3500)
                .attr("x", function(d,i) {
					return i*18;
				})
                .attr("y", 0)
                .attr("width", 18)
				.attr("height", function (d) {
                    return d.a*10;
                });
				
	selection1
				.enter()
				.append('rect')
				.attr("x", function(d,i) {
					return i*18;
				})
				.on('mouseover',function(d,i) {
				this.setAttribute("fill","darkred");
				})
				.on('mouseout',function(d,i) {
				this.setAttribute("fill","#FFC300");
				})
				.attr("y", 0)
				.attr('height', 0)
                .attr("width", 18)
				.transition()
				.duration(3500)
				.attr("height", function (d) {
                    return d.a*10;
                });
	
	selection1
				.exit()
				.attr("height", function(d) {
				return d.a*10;})
				.transition()
				.duration(3500)
				.attr("height", 0)
				.remove();

    // TODO: Select and update the 'b' bar chart bars
	
	var svg2 = d3.select("#barChart2");
	var selection2 = svg2.selectAll("rect")
				.data(data);
	
	selection2
				.transition()
				.duration(3500)
                .attr("x", function(d,i) {
					return i*18;
				})
                .attr("y", 0)
                .attr("width", 18)
				.attr("height", function (d) {
                    return d.b*10;
				});
				
	selection2
				.enter()
				.append('rect')
				.attr("x", function(d,i) {
					return i*18;
				})
				.on('mouseover',function(d,i) {
				this.setAttribute("fill","darkred");
				})
				.on('mouseout',function(d,i) {
				this.setAttribute("fill","#FFC300");
				})
                .attr("y", 0)
				.attr('height', 0)
                .attr("width", 18)
				.transition()
				.duration(3500)
				.attr("height", function (d) {
                    return d.b*10;
				});
	
	selection2
				.exit()
				.attr("height", function(d) {
				return d.b*10;})
				.transition()
				.duration(3500)
				.attr("height", 0)
				.remove();

    // TODO: Select and update the 'a' line chart path using this line generator
	
    var aLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return aScale(d.a);
        });

	var svg3 = d3.select("#lineChart1");
	var selection3 = svg3.select("path")
				.datum(data);

	
	selection3
			.transition()
			.duration(3500)
			.attr("d", aLineGenerator);   
	
	
    // TODO: Select and update the 'b' line chart path (create your own generator)
	
	var svg4 = d3.select("#lineChart2");
	var bLineGenerator = d3.line()
        .x(function (d, i) {
            return iScale(i);
        })
        .y(function (d) {
            return bScale(d.b);
		});
		
    var selection4 = svg4.select("path")
				.datum(data);
	
	selection4
			.transition()
			.duration(3500)
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
		
	var svg5 = d3.select("#areaChart1");
	var selection5 = svg5.select("path")
				.datum(data);
	selection5
			.transition()
			.duration(3500)
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
		
	var svg6 = d3.select("#areaChart2");
	var selection6 = svg6.select("path")
				.datum(data);
	selection6
			.transition()
			.duration(3500)
			.attr("d", bAreaGenerator);
	
    // TODO: Select and update the scatterplot points
	
	var svg7 = d3.select("#scatterplotChart");
	var selection7 = svg7.selectAll("circle")
				.data(data);
				
	var div = d3.select("body").append("div")   
			.attr("class", "tooltip")               
			.style("opacity", 0);
	
	selection7
			.on("mouseover", function(d) {   
			
			coordinates = d3.mouse(this);					
            div.transition()        
                .duration(200)  
				.style("opacity", .9);
				div .text(parseFloat(d3.select(this).attr("cx")).toFixed(2)+"," + parseFloat(d3.select(this).attr("cy")).toFixed(2))
				.style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY) + "px");
			
				div.transition() 			
				.delay(4000)
				.transition()
				.duration(500)
				.style("opacity", 0);
			})
			.on("mouseout", function(d) {       
				div.transition()        
                .duration(500)      
                .style("opacity", 0);   
			})
			.transition()
            .duration(3500)
			.style("fill", "steel blue")
            .attr("cx", function(d) {
				return d.a*10; })
            .attr("cy", function(d) {
				return d.b*10; })
            .attr("r", 5);
			
	selection7
			.enter()
			.append("circle")
			.on('click',function(evt){
		
				console.log(parseFloat(d3.select(this).attr("cx")).toFixed(2)+"," + parseFloat(d3.select(this).attr("cy")).toFixed(2));
			})
			.on("mouseover", function(d) {   
			
				coordinates = d3.mouse(this);			
				div.transition()        
					.duration(200)  
					.style("opacity", .8);
					div .text(parseFloat(d3.select(this).attr("cx")).toFixed(2)+"," + parseFloat(d3.select(this).attr("cy")).toFixed(2))
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY) + "px");
			
				div.transition() 			
				.delay(4000)
				.transition()
				.duration(500)
				.style("opacity", 0);
            })
			.on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
			})
			.style('opacity',0)
			.attr("cx", function(d) {
				return d.a*10; })
            .attr("cy", function(d) {
				return d.b*10; })
            .attr("r", 5)
			.transition()
			.duration(3500)
			.style('opacity',1);
			
	
	selection7
				.exit()
				.style("opacity", 1)
				.transition()
				.duration(3500)
				.style("opacity", 0)
				.remove();

    // ****** TODO: PART IV ******
	
	selection1.on('mouseover',function(d,i) {
				this.setAttribute("fill","darkred");
				});
				
	selection1.on('mouseout',function(d,i) {
				this.setAttribute("fill","#FFC300");
				});	
				
	selection2.on('mouseover',function(d,i) {
				this.setAttribute("fill","darkred");
				});	
				
	selection2.on('mouseout',function(d,i) {
				this.setAttribute("fill","#FFC300");
				});	
	
	
	selection7.on('click',function(evt){
		
		console.log(parseFloat(d3.select(this).attr("cx")).toFixed(2)+"," + parseFloat(d3.select(this).attr("cy")).toFixed(2));
	});
	
	
	
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

window.onload = function() {
	
	changeData();
}