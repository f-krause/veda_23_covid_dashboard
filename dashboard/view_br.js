// ##################################
// View bottom right: Line Chart Vaccinations
// ##################################


function plotBottomLineChart(sel_countries, sel_colors) {
// Load data
d3.csv("../data/vacc.csv").then(data_raw => {

// Save list of countries for later use
// const countries = data_raw.map(d => d.country); // DELETE?

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
                date: timeParser(key),
                vacc: +value
            })
        );   
    }
});


// Group data by country
const data_grouped = d3.group(data, d => d.country);


// Store values for svg creation
const div = d3.select("#right_row2")
const w = div._groups[0][0]["clientWidth"] - 20;
const h = div._groups[0][0]["clientHeight"] - 90;
const x_padding_left = 80;
const x_padding_right = 20;
const y_padding = 0;

// remove existing plot
d3.selectAll("#br_svg").remove()

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
                .tickFormat(d3.timeFormat('%b %y'))
                .ticks(d3.timeMonth.every(1));

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - y_padding) + ")")
    .call(xAxis)


// Add y axis
const yScale = d3.scaleLinear()
                    .domain([0, d3.max(data.map(d => d.vacc)) * 1.05]) // increase max for aesthetics
                    .range([h-y_padding, y_padding]);

const yAxis = d3.axisLeft(yScale)
                .ticks().tickFormat(d => d.toLocaleString());

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (x_padding_left) + "," + 0 + ")")
    .call(yAxis);


// Plot lines
let line = d3.line()
    .x(function(d) {
        return xScale(d.date);
    })
    .y(function(d) {
        return yScale(d.vacc);
    });

svg.append("g")
    .selectAll("path")
    .data(data_grouped)
    .join("path")
        .attr("stroke", d => sel_colors[d[0]])
        .attr("fill", "none")
        .attr("stroke-width", 3)
        .attr("d", d => line(d[1]))
        // .on("click", clickOn)
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
const locale = d3.formatLocale({decimal: ","})
const formatDecimal = locale.format("$,")
function hoverOn(event, d) {
    d3.select(this)
        .transition().duration(50)
        .attr("stroke-width", 4.5)

    cursorX = event.clientX - w - x_padding_right + 345
    cursorY = event.clientY - h - 265
    let labelText = d[0] + ": " + formatDecimal(yScale.invert(cursorY).toFixed(2))

    svg.append("circle")
        .attr('cx', event.clientX)
        .attr('cy', event.clientY)
        .attr('r', 5)
        .style('fill', 'green')
        .raise();

    svg.append("text")
        .attr("class", "countryLabelLine")
        .text(labelText)
        .attr("text-anchor", "end")
        .attr("fill", "#F5F8FC")
        .attr("x", cursorX)
        .attr("y", cursorY)
        .each(function(d) {
            var bbox = this.getBBox()
            svg.append("rect")
                .attr("class", "rectBehindText")
                .attr("x", bbox.x - 4)
                .attr("y", bbox.y - 2) 
                .attr("width", bbox.width + 8)
                .attr("height", bbox.height + 4)
                .attr("opacity", 0)
                .transition().duration(70)
                .attr("opacity", 0.6)
        })
        .raise()
        .attr("opacity", 0)
        .transition().duration(50)
        .attr("opacity", 1)
}

function hoverOff(event, d) {
    d3.selectAll(".countryLabelLine, .rectBehindText")
        .transition().duration(300)
        .attr("opacity", 0)
        .remove()

    d3.select(this)
        .transition(100)
        .attr("stroke-width", 3)
}


// Click effect functions
// function clickOn(event, d) { 
//     svg.append("path")
//         .attr("stroke", "red")
//         .attr("fill", "none")
//         .attr("stroke-width", 4.5)
//         .attr("d", l => line(d[1]))
// }


// Add y axis label
svg.append("text")
    .attr("class", "axisLabel")
    .attr("x", -h/2 -10)
    .attr("y", x_padding_left - 50)
    .attr("transform", "rotate(-90)")
    .text("New vaccinations (per mil)");

});
}