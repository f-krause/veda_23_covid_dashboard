// ##################################
// View upper left: Map Total Cases
// ##################################

// Store values for svg creation
const div = d3.select("#left_row1")
// console.log(div._groups[0][0])
const w = div._groups[0][0]["clientWidth"] / 2; // FIXME weird issue of wrong value
const h = div._groups[0][0]["clientHeight"] - 90;
// console.log(w)


// Initialize selections and colors
sel_countries = ["Africa"]; // FIXME why does this not work if type specified?
// Other scales: d3.schemeCategory10, d3.schemeTableau10, d3.schemeCategory20
const custom_colors = ["#e41a1c","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf"].concat(d3.schemeCategory10)
var colors_stack = custom_colors.reverse().slice();
var sel_colors = {"Africa": "#0d5f6f"};

// console.log(colors_stack)

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
    const projection = d3.geoMercator().fitSize([4*w/5, h+25], geodata)
    const path = d3.geoPath(projection)
    const stroke_col = "orange"

    maparea.selectAll("path")
        .data(geodata.features)
        .enter()
        .append("path")
            .attr("d", path) // Add the projection
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
        sel_countries.push(d.country)
        if (colors_stack.length < 1) {
            sel_colors[d.country] = "red" // If colors exhausted only use red
        } else {
            sel_colors[d.country] = colors_stack.pop()
        }
        
        d3.select(this)
            .raise()
            .style("stroke-width", 2.5)
            .style("stroke", sel_colors[d.country])
            .transition().duration(90)
        updatePlots(sel_countries, sel_colors)
    }


    // Reset plotting when clicking on background html/svg // TODO ADD BUTTON
    d3.select("#left_row1")
        .on("click", resetSelection)

    function resetSelection(event, d) {
        if (event.target.id === "ul_svg" | event.target.id === "document") {
            sel_countries = ["Africa"]
            sel_colors = {"Africa": "#0d5f6f"}
            colors_stack = custom_colors.slice()
            plotMap()
            updatePlots(sel_countries, sel_colors)
        }
    }

    // Add legend
    const yOffset = h/2

    svg.append("g")
        .selectAll("rect")
        .data([[yOffset, 200], [yOffset+20, 20_000], [yOffset+40, 200_000]])
        .enter()
        .append("rect")
            .attr("x", w-130)
            .attr("y", d => d[0])
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => d3.hsl(190, 0.79, color_scale(d[1]))) // fill accordingly

    svg.append("g")
        .selectAll("text")
        .data([[yOffset, "200"], [yOffset+20, "20,000"], [yOffset+40, "200,000"]])
        .enter()
        .append("text")
            .attr("text-anchor", "end")
            .attr("y", d => d[0]+11)
            .attr("x", w-35)
            .attr("font-size", 12)
            .text(d => d[1])

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", yOffset-20)
        .attr("x", w-35)
        .attr("font-size", 15)
        .text("Million total cases")

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
//       .attr("fill", "#1F7A8C") 
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



