// ##################################
// View upper left: Map Total Cases
// ##################################

// Store values for svg creation
const div = d3.select("#left_row1")
const w = div._groups[0][0]["clientWidth"] - 20; // TODO make responsive!
const h = div._groups[0][0]["clientHeight"] - 90;


// Load data
Promise.all([
    d3.csv('../data/scatter.csv'),
    d3.json('../data/geo_africa.json') // Geodata from: https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/africa.geojson
]).then(([data, geodata]) => {


// Collect countries selected
sel_countries = ["Africa"] // why does this not work if type specified?
sel_colors = Array(55).fill("red")
sel_colors[0] = "#0d5f6f"

// const baseColor = "#0d5f6f";
// const numSaturations = 55; // Number of different saturations

// // Generate a range of colors with varying saturations
// sel_colors = d3.scaleOrdinal()
//   .range(d3.quantize(d3.interpolateSpectral, numSaturations).map(s => d3.color(baseColor).brighter(s)));

// var colorScale = d3.scaleOrdinal()
//     .domain(countries)
//     .range(d3.schemeTableau10);

console.log(sel_colors[0])

// Map function
function plotMap() {
    // remove existing map
    d3.select("#ul_svg").remove()

    let svg = d3.select("#left_row1")
                .append("svg")
                .attr("id", "ul_svg")
                .attr("width", w)
                .attr("height", h);

    // Plot map of US states using Albers projection
    let maparea = svg.append("g")
    const projection = d3.geoMercator().fitSize([w/2, h+25], geodata)
    const path = d3.geoPath(projection)
    const stroke_col = "orange"

    maparea.selectAll("path")
        .data(geodata.features)
        .enter()
        .append("path")
        .attr("d", path) // Add the projection
        // .attr("transform", "scale(" + rescale_factor + ") translate(0,0)")
        .style("stroke-alignment", "inner")
        .style("stroke", "white")
        .style("stroke-width", 1)

    // Scaler to map income levels to appropriate lightness values
    const minMax = d3.extent(data, d => +d["total_cases_per_million"])

    const color_scale = d3.scaleLog()
        .domain([minMax[0], minMax[1]])
        .range([0.45, 0.15])

    // Fill states according to their median household income
    maparea.selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", d => d3.hsl(190, 0.79, color_scale(+d["total_cases_per_million"])))
        .on("click", clickOn)

    // Click effect function
    function clickOn(event, d) {
        d3.select(this)
            .raise()
            .style("stroke-width", 2.5)
            .style("stroke", stroke_col)
            .transition().duration(90)
        sel_countries.push(d.country)
        // sel_colors.push("red")
        updatePlots(sel_countries, sel_colors)
        // TODO update other plots!
    }


    // Reset plotting when clicking on background html/svg
    d3.select("#left_row1")
        .on("click", resetSelection) // TODO

    function resetSelection(event, d) {
        if (event.target.id === "ul_svg" | event.target.id === "document") {
            sel_countries = ["Africa"]
            // sel_colors = ["#0d5f6f"]
            plotMap()
            updatePlots(sel_countries, sel_colors)
            // TODO reset all plots
        }
    }
}

// Call functions to plot map
plotMap()
updatePlots(sel_countries, sel_colors)
})


function updatePlots(sel_countries) {
    plotUpperLineChart(sel_countries, sel_colors)
    plotBottomLineChart(sel_countries, sel_colors)
    plotScatterPlot(sel_countries, sel_colors)
}




// d3.json( "https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/africa.geojson"
// ).then(function (data) {

//   let projection = d3.geoMercator()
//   // .fitExtent([[0, 0],[w, h],], data)
//   .scale(220)
//   .translate([w / 5, h / 2.3]);


//   let geoGenerator = d3.geoPath().projection(projection);

//   // Draw the map
//   svg.append("g")
//     .selectAll("path")
//     .data(data.features)
//     .enter()
//       .append('g')
//       .attr("class", function(d){return d.properties.name; })
//       .append("path")
//       .attr("fill", "#1F7A8C") // TODO fill according to cases
//       .attr("d", geoGenerator)
//       .style("stroke", "#fff")
//     // .on("mouseover", handleMouseOver) // FIXME BROKEN
//     // .on("mouseout", function (d, i) {
//     //   d3.select(this).transition().duration(300).attr("fill", "#69b3a2");
//     //   d3.selectAll("text")
//     //     .transition()
//     //     .delay(function(d, i) {return 100; })
//     //     .text("");
//     // });



// });


// function handleMouseOver(e, d) {
//   let centroid = geoGenerator.centroid(d);

//   svg.append("text")
//     .text(d.properties.name)
//     .style("font-size", 30)
//     .style("font-weight", "bold")
//     .style("display", "inline")
//     .attr("transform", "translate(" + centroid + ")")
//     .style("fill", "black")
//     .transition()
//     .delay(function(d, i) { return 100; });
// }



