// ##################################
// View upper left: Map Total Cases
// ##################################

// Store values for svg creation
const div = d3.select("#left_row1")
const w = div._groups[0][0]["clientWidth"];
const h = div._groups[0][0]["clientHeight"] - 70;


// Initialize selections and colors
var sel_countries = ["Africa"];
const custom_colors = ["#e41a1c", "#9467bd", "#ff7f00", "#bcbd22", "#f781bf", "#e15759", "#b25f30", 
    "#af7aa1", "#7f7f7f", "#8c564b", "#31b831", "#ff9da7"]
var colors_stack = custom_colors.reverse().slice();
var sel_colors = {"Africa": "#0d5f6f"};


// Load data
Promise.all([
    d3.csv('../data/scatter.csv'),
    d3.json('../data/geo_africa.json') // Geodata from: https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/africa.geojson
]).then(([data, geodata]) => {


// Map function
function plotMap() {
    // remove existing map
    d3.selectAll("#ul_svg").remove()

    let svg = d3.select("#left_row1")
                .append("svg")
                .attr("id", "ul_svg")
                .attr("width", w)
                .attr("height", h);

                
    // Plot map of US states using Albers projection
    let maparea = svg.append("g")
    const projection = d3.geoMercator().fitSize([3/4*w, h], geodata)
    const path = d3.geoPath(projection)

    maparea.selectAll("path")
        .data(geodata.features)
        .enter()
        .append("path")
            .attr("d", path) // Add the projection
            .style("stroke", "white")
            .style("stroke-width", 1)
            .style("stroke-array", "100")
            .style("stroke-offset", "10")


    // Scaler to map total cases to color
    const minMax = d3.extent(data, d => +d["total_cases_per_million"])

    const color_scale = d3.scaleSymlog()
        .domain([minMax[0], minMax[1]])
        .range([0.6, 0.1])


    // Fill states according log total cases
    maparea.selectAll("path")
        .data(data)
        .join("path")
            .attr("fill", d => d3.hsl(190, 0.79, color_scale(+d["total_cases_per_million"])))
            .on("click", clickOn)
            .on("mouseover", hoverOn)
            .on("mouseout", hoverOff)


    // Click effect function
    function clickOn(event, d) {
        if (! sel_countries.includes(d["country"])) {
            sel_countries.push(d.country)
            if (colors_stack.length < 1) {
                sel_colors[d.country] = "#e41a1c" // If colors exhausted only use red
            } else {
                sel_colors[d.country] = colors_stack.pop()
            }
            d3.select(this)
                .raise()
                .style("stroke-width", 3)
                .style("stroke", sel_colors[d.country])
                .transition().duration(90)
            updatePlots(sel_countries, sel_colors)
        }
    }


    // Hover effect functions
    function hoverOn(event, d) {
        if (! sel_countries.includes(d["country"])) {
            let next_col = null
            if (colors_stack.length < 1) {
                next_col = "#e41a1c" // If colors exhausted only use red
            } else {
                next_col = colors_stack.slice(-1)
            }
        
            d3.select(this)
                .raise()
                .style("stroke", next_col)
                .style("stroke-width", 3)
        }

        d3.selectAll(".countryLabelMap")
            .remove()

        // Add country name at curser position
        let cursorX = event.clientX
        let cursorY = event.clientY - 170
       
        svg.append("text")
            .attr("class", "countryLabelMap")
            .text(d["country"])
            .attr("text-anchor", "middle")
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
                    .attr("opacity", 0.8)
            })
            .raise()
            .attr("opacity", 0)
            .transition().duration(50)
            .attr("opacity", 1)
        }

    function hoverOff(event, d) {
        if (!sel_countries.includes(d["country"])) {
            d3.select(this)
                .lower()
                .style("stroke-width", 1)
                .style("stroke", "white")
        }

        d3.selectAll(".countryLabelMap, .rectBehindText")
            .transition().duration(30)
            .attr("opacity", 0)
            .remove()
    }

    d3.select("#resetButton")
        .on("click", resetSelection)

    function resetSelection() {
        sel_countries = ["Africa"]
        sel_colors = {"Africa": "#0d5f6f"}
        colors_stack = custom_colors.slice()
        plotMap()
        updatePlots(sel_countries, sel_colors)
    }


    // Add legend
    const yOffset = 160
    const legendData = [[yOffset, 0, "no data"], [yOffset + 20, 200, "200"], [yOffset + 40, 20_000, "20.000"], [yOffset+60, 200_000, "200.000"]]

    svg.append("text")
        .attr("class", "legendText")
        .attr("y", yOffset - 20)
        .attr("x", w - 25)
        .text("Total cases (per mil.)")

    svg.append("g")
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
            .attr("x", w - 130)
            .attr("y", d => d[0])
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => d3.hsl(190, 0.79, color_scale(d[1]))) // fill accordingly

    svg.append("g")
        .selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
            .attr("text-anchor", "end")
            .attr("y", d => d[0] + 11)
            .attr("x", w - 25)
            .attr("font-size", 12)
            .text(d => d[2])
}


// Call functions to plot map
plotMap()
updatePlots(sel_countries, sel_colors)
})

function updatePlots(sel_countries, sel_colors) {
    plotUpperLineChart(sel_countries, sel_colors)
    plotBottomLineChart(sel_countries, sel_colors)
    plotScatterPlot(sel_countries, sel_colors)
}

