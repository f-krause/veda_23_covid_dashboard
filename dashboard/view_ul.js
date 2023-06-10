// ##################################
// View upper left: Map Total Cases
// ##################################

// Create svg
const div = d3.select("#left_col1")
const w = div._groups[0][0]["clientWidth"];
const h = div._groups[0][0]["clientHeight"];

const svg = d3.select("#ul_svg")
              .attr("width", w)
              .attr("height", h)

d3.json( "https://raw.githubusercontent.com/codeforgermany/click_that_hood/master/public/data/africa.geojson"
).then(function (data) {
  
  let projection = d3.geoMercator()
  // .fitExtent([[0, 0],[w, h],], data)
  .scale(220)
  .translate([w / 5, h / 2.3]);
  
  
  let geoGenerator = d3.geoPath().projection(projection);
  
  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append('g')
    .attr("class", function(d){return d.properties.name; })
    .append("path")
    .attr("fill", "#1F7A8C") // TODO fill according to cases
    .attr("d", geoGenerator)
    .style("stroke", "#fff")
    // .on("mouseover", handleMouseOver) // FIXME BROKEN
    // .on("mouseout", function (d, i) {
    //   d3.select(this).transition().duration(300).attr("fill", "#69b3a2");
    //   d3.selectAll("text")
    //     .transition()
    //     .delay(function(d, i) {return 100; })
    //     .text("");
    // });



});


function handleMouseOver(e, d) {
  let centroid = geoGenerator.centroid(d);

  svg.append("text")
    .text(d.properties.name)
    .style("font-size", 30)
    .style("font-weight", "bold")
    .style("display", "inline")
    .attr("transform", "translate(" + centroid + ")")
    .style("fill", "black")
    .transition()
    .delay(function(d, i) { return 100; });

  d3.select(this).transition().duration(300).attr("fill", "yellow");
}



