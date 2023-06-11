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
const w = div._groups[0][0]["clientWidth"] - 20; // TODO make responsive!
const h = div._groups[0][0]["clientHeight"] - 90;
const x_padding_left = 85;
const x_padding_right = 120;
const y_padding = 20;

// Update 
d3.select("#corr_variable").on("change", function() {
    // Get column and clean variable name and update plot
    const selector_element = d3.select(this).node()
    corr_var = selector_element.value;
    corr_var_clean = selector_element.options[selector_element.options.selectedIndex].text
    plotScatterHelper(corr_var, corr_var_clean, sel_countries, sel_colors)
})

function plotScatterHelper(corr_var, corr_var_clean, sel_countries, sel_colors) {
    d3.select("#bl_svg").remove();

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
    const xMinMax = d3.extent(data_sample, d => d["corr_var"])
    const xScale = d3.scaleLinear()
                    .domain([xMinMax[0]*0.8, xMinMax[1]*1.05])
                    .range([x_padding_left, w - x_padding_right]);

    const xAxis = d3.axisBottom(xScale)
                    .ticks().tickFormat(d => d.toLocaleString()) // TODO

    svg.append("g")
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
        .tickFormat(d3.format(",.0f"))

    svg.append("g")
        .attr("transform", "translate(" + (x_padding_left) + ",0)")
        .call(yAxis);


    // Circle size scaler
    const popMinMax = d3.extent(data_sample, d => d["population"])
    const circleScaler = d3.scaleSqrt()
                            .domain([popMinMax[0], popMinMax[1]])
                            .range([2, 10])

    // Add data
    svg.append("g")
        .selectAll("circle")
        .data(data_sample)
        .enter()
        .append("circle")
            .attr("cy", d => yScale(d["total_cases_per_million"]))
            .attr("cx", d => xScale(d["corr_var"]))
            .attr("r", d => circleScaler(d["population"]))
            .attr("fill", "#0d5f6f") // TODO make darker?
            .attr("fill-opacity", 0.6)
            .attr("stroke", function(d, i) {
                if (sel_countries.includes(d["country"])) {
                    return sel_colors[i]
                } else {
                    return null
                }
            })
            .attr("stroke-width", 1.5);

    function highlighting(d) {

    }


    // Add x axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", (x_padding_left + w - x_padding_right)/2)
        .attr("y", h - y_padding + 40)
        .text(corr_var_clean);


    // Add y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -h/2 - 10)
        .attr("y", x_padding_left - 55)
        .attr("transform", "rotate(-90)")
        .attr("font-size", 14)
        .text("Log total cases (per 1 mil.)"); // TODO

        
    // Add legend of circle size
    const yOffset = 30
    svg.append("g")
        .selectAll("circle")
        .data([[yOffset, 100_000], [yOffset+20, 10_000_000], [yOffset+40, 200_000_000]])
        .enter()
        .append("circle")
            .attr("cy", d => d[0])
            .attr("cx", w-90)
            .attr("r", d => circleScaler(d[1]))
            .attr("fill", "#0d5f6f")

    svg.append("g")
        .selectAll("text")
        .data([[yOffset, "100,000"], [yOffset+20, "10,000,000"], [yOffset+40, "200,000,000"]])
        .enter()
        .append("text")
            .attr("text-anchor", "end")
            // .attr("alignment-baseline", "middle")
            .attr("y", d => d[0]+5)
            .attr("x", w)
            .attr("font-size", 12)
            .text(d => d[1])

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", 12)
        .attr("x", w+5)
        .attr("font-size", 15)
        .text("Population size")
        

}

plotScatterHelper(corr_var, corr_var_clean, sel_countries, sel_colors)
})
}