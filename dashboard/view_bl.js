// ##################################
// View bottom left: Scatterplot
// ##################################

// Load data
d3.csv("../data/scatter.csv").then(data => {
// Pre-process data -> make empty strings null and else numeric



// Create svg
const div = d3.select("#left_col2")
const w = div._groups[0][0]["clientWidth"] - 20; // TODO make responsive!
const h = div._groups[0][0]["clientHeight"] - 80;
console.log(h)
const x_padding = 100;
const y_padding = 20;

// Change correlation variable on drop down change
let corr_var = "human_development_index"
let corr_var_clean = "HDI"

d3.select("#corr_variable").on("change", function() {
    // Get column and clean variable name and update plot
    const selector_element = d3.select(this).node()
    corr_var = selector_element.value;
    corr_var_clean = selector_element.options[selector_element.options.selectedIndex].text
    plotScatter(corr_var, corr_var_clean, "")
})

function plotScatter(corr_var, corr_var_clean, sel_countries) {
    d3.select("#bl_svg").remove();

    let svg = d3.selectAll("#left_col2")
                .append("svg")
                .attr("id", "#bl_svg")
                .attr("width", w)
                .attr("height", h);
                

    console.log(data)
    console.log(corr_var)


    // Add x axis
    const xScale = d3.scaleLinear()
                    .domain(d3.extent(data, d => d[corr_var]))
                    .range([x_padding, w]);
    console.log(data[34])

    const xAxis = d3.axisBottom(xScale)
                    .ticks().tickFormat((d, i) => d.toString()) // TODO

    svg.append("g")
        .attr("transform", "translate(0," + (h - y_padding) + ")")
        .call(xAxis);


    // Add y axis
    console.log(d3.extent(data, d => d["total_cases_per_million"]))
    const yScale = d3.scaleLinear()
                        .domain(d3.extent(data, d => d["total_cases_per_million"]))
                        .range([h - y_padding, y_padding]);

    const yAxis = d3.axisLeft(yScale)
                    .ticks().tickFormat(d => d.toString()); // TODO

    svg.append("g")
        .attr("transform", "translate(" + (x_padding) + ",0)")
        .call(yAxis);


    // Circle size scaler
    const circleScaler = d3.scaleLinear()
                            .domain(d3.extent(data, d => d["population"]))
                            .range([1.5,5])


    // Add data
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("cy", d => yScale(d["total_cases_per_million"]))
            .attr("cx", d => xScale(d[corr_var]))
            .attr("r", d => circleScaler(d["population"]))
            .attr("fill", "#1F7A8C") // TODO make darker
            .attr("fill-opacity", 0.75);


    // Add x axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", (x_padding + w)/2)
        .attr("y", h - y_padding + 40)
        .text(corr_var_clean);


    // Add y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "middle")
        .attr("x", -h/2 - 10)
        .attr("y", x_padding - 55)
        .attr("transform", "rotate(-90)")
        // .attr("font-size", 14)
        .text("Total cases (per 1 mil.)"); // TODO


}

plotScatter(corr_var, corr_var_clean, "")
})


