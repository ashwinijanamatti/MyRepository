// Global var for FIFA world cup data
var allWorldCupData;
var data;

/**
 * Render and update the bar chart based on the selection of the data type in the drop-down box
 *
 * @param selectedDimension a string specifying which dimension to render in the bar chart
 */
function updateBarChart(selectedDimension) {


	var margin = {top: 7, right: 7, bottom: 35, left: 53};
	
    var svgBounds = d3.select("#barChart").node().getBoundingClientRect(),
        xAxisWidth = 450, //- margin.left - margin.right,
        yAxisHeight = 300;//- margin.top - margin.bottom;
		//var padding = 15;
	
	//var sortedData = allWorldCupData
		
	var svg = d3.select("#barChart");
    svg.attr("width", xAxisWidth + margin.left + margin.right)
        .attr("height", yAxisHeight + margin.top + margin.bottom);
	
	svg.select("#xAxis")
	   .attr("width", xAxisWidth + margin.left + margin.right)
       .attr("height", yAxisHeight + margin.top + margin.bottom);
       
	   
	svg.select("#yAxis")
	   .attr("width", xAxisWidth + margin.left + margin.right)
       .attr("height", yAxisHeight + margin.top + margin.bottom);
	   
	svg.select("#bars")
	   .attr("width", xAxisWidth + margin.left + margin.right)
       .attr("height", yAxisHeight + margin.top + margin.bottom)
       .attr("transform", "translate(" + margin.left + ", 0) ");
			
    // ******* TODO: PART I *******

    // Create the x and y scales; make
    // sure to leave room for the axes
	
	
	
	var xScale = d3.scaleBand()
				   .domain(allWorldCupData.map(function(d){
						return d.year;
						}))
				   .rangeRound([0,xAxisWidth - margin.right]);
				   
	
	var yScale = d3.scaleLinear()
				   .domain([0,d3.max(allWorldCupData, function(d) {
						return d[selectedDimension];
				   })])
				   .range([yAxisHeight , 0])
				   .nice();

    // Create colorScale
	
	var colorScale = d3.scaleLinear()
                       .domain([d3.min(allWorldCupData, function(d) {
						       return d[selectedDimension];
					   }), d3.max(allWorldCupData, function(d) {
							return d[selectedDimension];
						})])
                       .range(["lightblue","darkblue"]);
					   

    // Create the axes (hint: use #xAxis and #yAxis)

	var xAxis = d3.axisBottom();
        xAxis.scale(xScale);
		
	var yAxis = d3.axisLeft();
        yAxis.scale(yScale);
		
		
    // Create the bars (hint: use #bars)
	var bars = svg.select("#bars")
				.selectAll("rect")
				.data(allWorldCupData);
	
	bars = bars
	            .enter()
                .append("rect")
				.merge(bars);
                
	bars
	   .attr("opacity",0)
	   .transition()
	   .duration(3000)
	   .attr("x", function(d, i) {
		   
		   return xScale(d.year);
	   })	
	   .attr("y", function(d) {
		   return yScale(d[selectedDimension]);
	   })
	   
	   .attr("width", function(d, i) {
		   return 20;
	   })
	   .attr("height", function(d) {
		   return yAxisHeight - yScale(d[selectedDimension])
	   })
	   
       .style("fill", function (d) {
		   
		    if(this.style.fill == "orange")
				return "orange";
			
            return colorScale(d[selectedDimension]);
        })
		.style("opacity",1);
		
		
		
		svg.select("#xAxis")
		   .attr("transform", "translate(" + margin.left + ", " + (yAxisHeight)+")")
		   .call(xAxis)
		   .selectAll("text")  
           .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-90)" );
		   
		svg.select("#yAxis")
		   .transition()
		   .duration(3000)
		   .attr("transform", "translate(" + margin.left + ", 0)")
		   .call(yAxis);


    // ******* TODO: PART II *******

    // Implement how the bars respond to click events
    // Color the selected bar to indicate is has been selected.
    // Make sure only the selected bar has this new color.
	
	svg.selectAll("rect")
	   .data(allWorldCupData)
	   .on("click", function(d) {
		   
			svg.selectAll("rect")
				.data(allWorldCupData)
				.style("fill", function(d){
					return colorScale(d[selectedDimension]);
			});

			console.log(this);
			d3.select(this)
				.style("fill","orange");
			updateMap(d);
			updateInfo(d);
			
	   });

    // Call the necessary update functions for when a user clicks on a bar.
    // Note: think about what you want to update when a different bar is selected.


}

/**
 *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
 *
 *  There are 4 attributes that can be selected:
 *  goals, matches, attendance and teams.
 */
function chooseData() {

    // ******* TODO: PART I *******
    //Changed the selected data when a user selects a different
    // menu item from the drop down.
	var dataFile = document.getElementById('dataset').value;
	updateBarChart(dataFile);
        
    
}

/**
 * Update the info panel to show info about the currently selected world cup
 *
 * @param oneWorldCup the currently selected world cup
 */
function updateInfo(oneWorldCup) {

    // ******* TODO: PART III *******

    // Update the text elements in the infoBox to reflect:
    // World Cup Title, host, winner, runner_up, and all participating teams that year

	var edition = d3.select("#edition")
					.text(function() {
						return oneWorldCup.EDITION;
					});
					
					
    // Hint: For the list of teams, you can create an list element for each team.
    // Hint: Select the appropriate ids to update the text content.
	
	var host = d3.select("#host")
	             .text(function(){
					   
						return oneWorldCup.host;
				   });
				   
	var winner = d3.select("#winner")
	               .text(function(){
					   
						return oneWorldCup.winner;
				   });
				   
	var runnerup = d3.select("#silver")
	               .text(function(){
					   
						return oneWorldCup.runner_up;
				   });
				   
	var Selection = d3.select("#teams")
						   .selectAll("li")
						   .data(oneWorldCup.teams_names);
		
	Selection .text(function(d){
					return d;
				});
						   
	Selection
				.enter()
				.append("li")
				.text(function(d){
					return d;
				});
				
	var exitSelection = Selection
					  .exit()
					  .remove();
				//.style("opacity",1);


}

/**
 * Renders and updated the map and the highlights on top of it
 *
 * @param the json data with the shape of all countries
 */
function drawMap(world) {

    //(note that projection is global!
    // updateMap() will need it to add the winner/runner_up markers.)

    projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    // ******* TODO: PART IV *******

    // Draw the background (country outlines; hint: use #map)
    // Make sure and add gridlines to the map
	
	var path = d3.geoPath().projection(projection);
	
	
	data = topojson.feature(world , world.objects.countries);
	
	
	var graticule = d3.geoGraticule();
                    
    // Hint: assign an id to each country path to make it easier to select afterwards
    // we suggest you use the variable in the data element's .id field to set the id

    // Make sure and give your paths the appropriate class (see the .css selectors at
    // the top of the provided html file)

	d3.select("#map")
		  .append("path")
		  .datum(graticule)
		  .attr("class","grat")
		  .attr("d",path);
		  
	
		d3.select("#map")
				.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
				.attr("class", "countries")
				.attr("id", function(d) {
					return d.id;
				})
				.attr("d", path)
				//extra credit
				.on("click", function(d) {
					
					
					var list = [];
					
					for(var j=0;j<allWorldCupData.length;j++) {
						
						for(var i=0;i<allWorldCupData[j].teams_iso.length;i++) {
							
							if(allWorldCupData[j].teams_iso[i] == this.id){
								list.push(allWorldCupData[j].year);
								break;
							}
							
						}
						
					}
					
					
					
					d3.select("#worldcupsParticipated")
					  .text(
							this.id + " Participated In World Cup"
					  );
					
					
					
					var selection = d3.select("#worldcupsParticipated")
					  .selectAll("li")
					  .data(list);
					  
					selection.exit().remove();
					  
					selection =   selection.enter()
					  .append("li")
					  .merge(selection);
					  
					selection  
					  .text( function(d) {		
							return d;
					  });
					  
					

				});
				
}

/**
 * Clears the map
 */
function clearMap() {

    // ******* TODO: PART V*******
    //Clear the map of any colors/markers; You can do this with inline styling or by
    //defining a class style in styles.css

    //Hint: If you followed our suggestion of using classes to style
    //the colors and markers for hosts/teams/winners, you can use
    //d3 selection and .classed to set these classes on and off here.
	
	d3.select("path.host")
	  .classed("host", false);
	  
	d3.selectAll("path.team")
	  .classed("team", false);
	  
	  
	//easier to remove with id
	
	d3.select("#winner_circle")
		.remove();
		
	d3.select("#silver_circle")
		.remove();
	

}


/**
 * Update Map with info for a specific FIFA World Cup
 * @param the data for one specific world cup
 */
function updateMap(worldcupData) {

    //Clear any previous selections;
    clearMap();

    // ******* TODO: PART V *******

    // Add a marker for the winner and runner up to the map.

    //Hint: remember we have a conveniently labeled class called .winner
    // as well as a .silver. These have styling attributes for the two
    //markers.
	var host_code = worldcupData.host_country_code;
	var runner_up = worldcupData.runner_up;
	var winner = worldcupData.winner;
	var teams_list = worldcupData.teams_iso;
	var teams_names_list = worldcupData.teams_names;
	//var data = topojson.feature(world , world.objects.countries);

	
    //Select the host country and change it's color accordingly.
	
	d3.select("#"+host_code)
	  .classed("host", true);

    //Iterate through all participating teams and change their color as well.
	
	for(var i=0;i<teams_list.length;i++) {
		
		d3.select("#"+teams_list[i])
		  .classed("team",true);
	}
    //We strongly suggest using classes to style the selected countries.
	
	//adding id for easier removal
	d3.select("#points")
	  .selectAll("circle")
	  .data([worldcupData])
	  .enter()
	  .append("circle")
	  .attr("class","gold")
	  .attr("id","winner_circle")
	  .attr("cx", function (d) {
                        return projection([d.win_pos[0], d.win_pos[1]])[0];
      })
      .attr("cy", function (d) {
                        return projection([d.win_pos[0], d.win_pos[1]])[1];
      })
      .attr("r", 8);
	  
	d3.select("#points")
	  //.selectAll("circle")
	  .data([worldcupData])
	  //.enter()
	  .append("circle")
	  .attr("class","silver")
	  .attr("id","silver_circle")
	  .attr("cx", function (d) {
						
                        return projection([d.ru_pos[0], d.ru_pos[1]])[0];
      })
      .attr("cy", function (d) {
                        return projection([d.ru_pos[0], d.ru_pos[1]])[1];
      })
      .attr("r", 8);
	  
	
}

/* DATA LOADING */

// This is where execution begins; everything
// above this is just function definitions
// (nothing actually happens)

//Load in json data to make map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});

// Load CSV file
d3.csv("data/fifa-world-cup.csv", function (error, csv) {

    csv.forEach(function (d) {

        // Convert numeric values to 'numbers'
		
		//d.host = +d.host;
        d.year = +d.YEAR;
        d.teams = +d.TEAMS;
        d.matches = +d.MATCHES;
        d.goals = +d.GOALS;
        d.avg_goals = +d.AVERAGE_GOALS;
        d.attendance = +d.AVERAGE_ATTENDANCE;
        //Lat and Lons of gold and silver medals teams
        d.win_pos = [+d.WIN_LON, +d.WIN_LAT];
        d.ru_pos = [+d.RUP_LON, +d.RUP_LAT];

        //Break up lists into javascript arrays
        d.teams_iso = d3.csvParse(d.TEAM_LIST).columns;
        d.teams_names = d3.csvParse(d.TEAM_NAMES).columns;
		
    });

    // Store csv data in a global variable
    allWorldCupData = csv;
	
	allWorldCupData = allWorldCupData.sort(function(a,b) {
							return d3.ascending(a.year,b.year);
					});
			
    // Draw the Bar chart for the first time
    updateBarChart('attendance');
});
