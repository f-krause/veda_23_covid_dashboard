// ##################################
// View bottom right: Line Chart Vaccinations
// ##################################



function plotBottomLineChart(sel_countries, sel_colors) {
    // Load data
    d3.csv("../data/vacc.csv").then(data_raw => {
    
    // Save list of countries for later use
    const countries = data_raw.map(d => d.country); 
    
    // Date converter
    var timeParser = d3.timeParse("%Y-%m-%d");
    
    // Transform data to new format
    let data = [];
    
    data_raw.forEach(e => {    
        let currCountry = e.country;
        delete e.country;
    
        if (sel_countries.includes(currCountry)) {
            Object.entries(e).forEach(
                ([key, value]) => data.push({
                    country: currCountry,
                    date: timeParser(key),      // Change datatype to number
                    vacc: +value
                })
            );   
        }
    });
    // console.log(data)
    
    // Group data by country
    const data_grouped = d3.group(data, d => d.country);
    
    // Store values for svg creation
    const div = d3.select("#right_row2")
    const w = div._groups[0][0]["clientWidth"] - 20; // TODO make responsive!
    const h = div._groups[0][0]["clientHeight"] - 90;
    const x_padding_left = 80;
    const x_padding_right = 100;
    const y_padding = 0;
    
    // remove existing plot
    d3.select("#br_svg").remove()
    
    let svg = d3.select("#right_row2")
                  .append("svg")
                  .attr("id", "br_svg")
                  .attr("width", w)
                  .attr("height", h);
    
    
    // Add x axis
    const xScale = d3.scaleTime()
                     .domain(d3.extent(data, function(d){return d.date}))
                     .range([x_padding_left, w-x_padding_right]);
    
    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.timeFormat('%d %b %y'));
                    //.ticks(d3.timeMonth.every(1))
    
    svg.append("g")
        .attr("transform", "translate(0," + (h - y_padding) + ")")
        .call(xAxis);
    
    
    // Add y axis
    const yScale = d3.scaleLinear()
                        .domain([0, d3.max(data.map(d => d.vacc))*1.05]) // increase max for aesthetics
                        .range([h, y_padding]);
    
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
        .attr("transform", "translate(" + (x_padding_left) + "," + (-y_padding) + ")")
        .call(yAxis);
    
    
    // Plot lines
    let line = d3.line()
        .x(function(d) {
            return xScale(d.date);
        })
        .y(function(d) {
            return yScale(d.vacc);
        });
    
    var colorScale = d3.scaleOrdinal()
        .domain(countries)
        .range(d3.schemeTableau10);
    
    svg.append("g")
        .selectAll("path")
        .data(data_grouped)
        .join("path")
            .attr("stroke", (d, i) => sel_colors[i])
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("d", d => line(d[1]))
            .on("click", clickOn)
            .on("mouseover", hoverOn)
            .on("mouseout", hoverOff);
    
    // Add country to line
    svg.selectAll("text")
        .data(data_grouped)
        .enter()
            .append("text")
            .text(d => d.country)
            .attr("x", d => xScale(d[1].slice(-1)[0].date) + 12)
            .attr("y", d => yScale(d[1].slice(-1)[0].vacc) + 6)
        
    
    
    // Hover effect functions
    function hoverOn(event, d) {
        d3.select(this)
            .transition().duration(80)
            .attr("stroke-width", 4.5)
            // .attr("stroke", "red");
        }
    
    function hoverOff(event, d) {
        d3.select(this)
            .transition()
            .attr("stroke-width", 2)
            .attr("stroke", colorScale(d[0]));
        }
    
    
    // Click effect functions
    function clickOn(event, d) { 
        svg.append("path")
            .attr("stroke", "red")
            .attr("fill", "none")
            .attr("stroke-width", 4.5)
            .attr("d", l => line(d[1]))
    
        svg.append("text")
            .text(d[0])
            .attr("x", xScale(d[1].slice(-1)[0].date) + 12)
            .attr("y", yScale(d[1].slice(-1)[0].vacc) + 6)
    }
    
    
    // Add y axis label
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -h/2 -10)
    .attr("y", x_padding_left - 35)
    .attr("transform", "rotate(-90)")
    .attr("font-size", 14)
    .text("Smoothed new vaccinations (per 1 mil.)"); // TODO
    
    });
    }