// ##################################
// View upper left: Map Total Cases
// ##################################

// Store values for svg creation
const div = d3.select("#left_row1")
// console.log(div._groups[0][0])
const w = div._groups[0][0]["clientWidth"] / 2; // FIXME weird issue of wrong value
const h = div._groups[0][0]["clientHeight"] - 70;
// console.log(w)


// Initialize selections and colors
sel_countries = ["Africa"]; // FIXME why does this not work if type specified?
// Other scales: d3.schemeCategory10, d3.schemeTableau10
console.log(d3.schemeCategory10)
const custom_colors = ["#e41a1c","#31b831","#984ea3","#ff7f00","#f781bf", "#b25f30", "#7f7f7f", "#bcbd22", "#9467bd", "#8c564b", "#e377c2", "#ff7f0e"]
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
            // .style("stroke-alignment", "inner") // DELETE NOT WORKING
            .style("stroke", "white")
            .style("stroke-width", 1)
            .style("stroke-array", "100")
            .style("stroke-offset", "10")


    // Scaler to map total cases to color
    const minMax = d3.extent(data, d => +d["total_cases_per_million"])

    const color_scale = d3.scaleSymlog()
        .domain([minMax[0], minMax[1]])
        .range([0.55, 0.15])


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

        svg.append("text")
            .text(d["country"])
            .attr("text-anchor", "end")
            .attr("x", w-35)
            .attr("y", 150)
            .attr("font-size", 15)
            .attr("class", "countryLabelMap")
            .attr("opacity", 0)
            .transition().duration(100)
            .attr("opacity", 1)
        }

    function hoverOff(event, d) {
        if (! sel_countries.includes(d["country"])) {
            d3.select(this)
                .lower()
                .style("stroke-width", 1)
                .style("stroke", "white")
        }
    }

    svg.append("text")
        .attr("y", 120)
        .attr("x", w-35)
        .attr("class", "legendText")
        .text("Last country visited")


    // Reset plotting when clicking on background html/svg
    // d3.select("#left_row1")
    //     .on("click", resetHelper)

    // function resetHelper(event, d) {
    //     if (event.target.id === "ul_svg" | event.target.id === "document") {
    //         resetSelection()
    //     }
    // }

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
    const yOffset = 235
    const legendData = [[yOffset, 0, "no data"], [yOffset+20, 200, "200"], [yOffset+40, 20_000, "20.000"], [yOffset+60, 200_000, "200.000"]]

    svg.append("g")
        .selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
            .attr("x", w-130)
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
            .attr("y", d => d[0]+11)
            .attr("x", w-35)
            .attr("font-size", 12)
            .text(d => d[2])

    svg.append("text")
        .attr("class", "legendText")
        .attr("y", yOffset-20)
        .attr("x", w-35)
        .text("Total cases (per mil.)")
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

