
// Create svg
// const div = d3.select("#left_row2")
// const w = div._groups[0][0]["clientWidth"]; // TODO make responsive!
// const h = div._groups[0][0]["clientHeight"];

d3.select("#bl_svg")
              .attr("width", w)
              .attr("height", h-80)


let data = [], width = w, height = h, numPoints = 100;

let zoom = d3.zoom()
	.on('zoom', handleZoom);

function handleZoom(e) {
	d3.select('#bl_svg g')
		.attr('transform', e.transform);
}

function initZoom() {
	d3.select('#bl_svg')
		.call(zoom);
}

function updateData() {
	data = [];
	for(let i=0; i<numPoints; i++) {
		data.push({
			id: i,
			x: Math.random() * width,
			y: Math.random() * height
		});
	}
}

function update() {
	d3.select('#bl_svg g')
		.selectAll('circle')
		.data(data)
		.join('circle')
		.attr('cx', function(d) { return d.x; })
		.attr('cy', function(d) { return d.y; })
		.attr('r', 3);
}

initZoom();
updateData();
update();
