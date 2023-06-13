
function plot_vert_line(x, value) {
    const h = d3.select("#right_row1")._groups[0][0]["clientHeight"] - 70

    d3.select("#ur_svg")
        .append("line")
        .style("stroke", "grey")
        .style("stroke-width", 2)
        .attr("x1", x-45)
        .attr("y1", 0)
        .attr("x2", x-45)
        .attr("y2", h-18)
        .style("stroke-dasharray", "8,8")
        .attr("id", "verticalLineUR")

    d3.select("#br_svg")
        .append("line")
        .style("stroke", "grey")
        .style("stroke-width", 2)
        .attr("x1", x-45)
        .attr("y1", 0)
        .attr("x2", x-45)
        .attr("y2", h-18)
        .style("stroke-dasharray", "8,8")
        .attr("id", "verticalLineBR")

    console.log(value)
}