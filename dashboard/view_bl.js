// ##################################
// View bottom left: Scatterplot
// ##################################

// Change correlation variable on drop down change
let corr_var = "human_development_index"
let corr_var_clean = "HDI"


function plotScatterPlot(sel_countries, sel_colors) {
// Load data
d3.csv("../data/scatter.csv").then(data => {

// Store values for svg creation
const div = d3.select("#left_row2")
const w = div._groups[0][0]["clientWidth"] - 20;
const h = div._groups[0][0]["clientHeight"] - 90;
const x_padding_left = 85;
const x_padding_right = 140;
const y_padding = 20;


// Update 
d3.select("#dropCorrVar").on("change", function() {
    // Get column and clean variable name and update plot
    const selector_element = d3.select(this).node()
    corr_var = selector_element.value;
    corr_var_clean = selector_element.options[selector_element.options.selectedIndex].text
    plotScatterHelper(corr_var, corr_var_clean, sel_countries, sel_colors)
})

function plotScatterHelper(corr_var, corr_var_clean, sel_countries, sel_colors) {
    d3.selectAll("#bl_svg").remove();

    let svg = d3.select("#left_row2")
                .append("svg")
                .attr("id", "bl_svg")
                .attr("width", w)
                .attr("height", h);
    
                
    let data_sample = []
    data.forEach(e => {
        if (e[corr_var]) {
            var dict = {
                "country": e["country"], 
                "population": +e["population"],
                "total_cases_per_million": +e["total_cases_per_million"],
                corr_var: +e[corr_var],
            }
            data_sample.push(dict)
        }
    });
    
    
    // Add x axis
    let minScaling = 0
    if (["human_development_index", "life_expectancy"].includes(corr_var)) {
        minScaling = 0.95
    }

    const xMinMax = d3.extent(data_sample, d => d["corr_var"])
    const xScale = d3.scaleLinear()
                    .domain([xMinMax[0] * minScaling, xMinMax[1]*1.05])
                    .range([x_padding_left, w - x_padding_right]);

    const xAxis = d3.axisBottom(xScale)
                    .ticks(8).tickFormat(d => d.toLocaleString()) // TODO add spaces as separators

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - y_padding) + ")")
        .call(xAxis);


    // Add y axis
    const yMinMax = d3.extent(data_sample, d => d["total_cases_per_million"]);
    const yScale = d3.scaleLog()
        .domain([100, yMinMax[1] * 1.1])
        .range([h - y_padding, y_padding]);
    
        const yAxis = d3.axisLeft(yScale)
        // .ticks(10)
        .tickValues([100, 1000, 10000, 50000])
        .tickFormat(d => d.toLocaleString())

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (x_padding_left) + ",0)")
        .call(yAxis);


    // Circle size scaler
    const popMinMax = d3.extent(data_sample, d => d["population"])
    const circleScaler = d3.scaleSqrt()
                            .domain([popMinMax[0], popMinMax[1]])
                            .range([3, 10])

    // Add data
    svg.append("g")
        .selectAll("circle")
        .data(data_sample)
        .enter()
        .append("circle")
            .attr("cy", d => yScale(d["total_cases_per_million"]))
            .attr("cx", d => xScale(d["corr_var"]))
            .attr("r", d => circleScaler(d["population"]))
            .attr("fill-opacity", function(d) {
                if (sel_countries.includes(d["country"])) {
                    return 0.85
                } else {
                    return 0.4
                }
            })
            .attr("fill", function(d) {
                if (sel_countries.includes(d["country"])) {
                    return sel_colors[d["country"]]
                } else {
                    return "#0d5f6f"
                }
            })
            .on("mouseover", hoverOn)
            .on("mouseout", hoverOff);


    // Hover effect functions
    function hoverOn(event, d) {        
        d3.select(this)
            .raise()
            .style("stroke-opacity", 1)
            .style("stroke", "#0d5f6f")
            .style("stroke-width", 2)
        
        d3.select(".countryLabelScatter")
            .html(d["country"])
            .attr("left", xScale(d["corr_var"]))
            .attr("top", yScale(d["total_cases_per_million"]))
            .style("visibility", "visible")    
            .attr("opacity", 0)
            .transition().duration(30)
            .attr("opacity", 1)
        }

    function hoverOff(event, d) {
        d3.select(this)
            // .lower()
            .transition().duration(200)
            .style("stroke-opacity", 0)

        d3.select(".countryLabelScatter")
            // .transition().duration(200)
            .style("visibility", "hidden")    
            // .attr("opacity", 0)
    }
    

    // Add x axis label
    svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", (x_padding_left + w - x_padding_right)/2)
        .attr("y", h - y_padding + 40)
        .text(corr_var_clean);


    // Add y axis label
    svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", -h/2 - 10)
        .attr("y", x_padding_left - 55)
        .attr("transform", "rotate(-90)")
        .text("Total cases (per mil.)");

        
    // Add legend of circle size
    const yOffset = h/2
    const legendData = [[yOffset, 100_000], [yOffset+20, 10_000_000], [yOffset+40, 100_000_000]]

    svg.append("g")
        .selectAll("circle")
        .data(legendData)
        .enter()
        .append("circle")
            .attr("cy", d => d[0])
            .attr("cx", w-110)
            .attr("r", d => circleScaler(d[1]))
            .attr("fill", "#0d5f6f")

    svg.append("g")
        .selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
            .attr("text-anchor", "end")
            // .attr("alignment-baseline", "middle")
            .attr("y", d => d[0]+5)
            .attr("x", w-5)
            .attr("font-size", 12)
            .text(d => d[1].toLocaleString())

    svg.append("text")
        .attr("class", "legendText")
        .attr("y", yOffset-25)
        .attr("x", w-5)
        .text("Population size")
        
}

plotScatterHelper(corr_var, corr_var_clean, sel_countries, sel_colors)
})
}