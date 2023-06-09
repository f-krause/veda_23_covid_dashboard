// Load data
Promise.all([
        d3.csv('usa_median_income_per_state.csv'),
        d3.json('us-states-geo.json')
    ]).then(([data, geodata]) => {
    
    // Define current year shown
    let curr_year = 2014;

    // Collect states selected to be shown in table
    sel_states = []

    // Change selected year and re-plot on change
    d3.select("#currentYear").on("change", function() {
            curr_year = d3.select(this).node().value
            plotMap(curr_year)
            sel_states = []
            plotTable()
        })

        
    // TABLE
    function plotTable() {
        // remove existing table
        d3.select("#table").remove()
        
        // Set up table header
        let table = d3.select('#tableDiv').append('table').attr("id", "table")
        let headers = ["State", "2004", "2014"]
        table.append("thead")
            .append("tr")
            .selectAll("th")
            .data(headers)
            .enter()
            .append("th")
            .text(d => d)
            .style("padding", "6px")
            .style("background-color", d3.hsl(215, 0.5, 0.7))
            .style("font-weight", "bold")

        // Add data rows, either full data or selection
        if (sel_states.length === 0) {
            table_data = data
        } else {
            table_data = []
            for (let i = 0; i < data.length; i++) {
                if (sel_states.includes(data[i]["State"])) {
                  table_data.push(data[i])
                }
            }
        }
        
        let row = table.append("tbody")
            .selectAll("tr")
            .data(table_data)
            .enter()
            .append("tr")
            .on("mouseover", function() {
                d3.select(this).style("background-color", d3.hsl(215, 0.5, 0.9))
            })
            .on("mouseout", function() {
                d3.select(this).style("background-color", "transparent")
            })

        // Add row content
        let text_padding = "6px"
        row.append("td")
            .text(d => d["State"])
            .style("padding", text_padding)
        row.append("td") // income 2004
            .text(d => d["2004"] + " $")
            .style("padding", text_padding)
        row.append("td") // income 2014
            .text(d => d["2014"] + " $")
            .style("padding", text_padding)
    }


    // MAP
    function plotMap(year) {
        // remove existing map
        d3.select("#mapSVG").remove()

        // Set up svg
        const h = 500
        const w = h * 1.5
        const y_padding_map = 40 // add some offset to top

        const svg = d3.select("#mapDiv")
            .append("svg")
            .attr("width",  w)
            .attr("height", h)
            .attr("id", "mapSVG")

        // Plot map of US states using Albers projection
        let maparea = svg.append("g").attr("transform", "translate(-30," + y_padding_map + ")")
        const projection = d3.geoAlbersUsa()
        const path = d3.geoPath(projection)
        const rescale_factor = d3.min([w/900, (h - y_padding_map)/500]) // Dynamically rescale map based on svg width
        const stroke_col = "orange"

        maparea.selectAll("path")
            .data(geodata.features)
            .enter()
            .append("path")
            .attr("d", path) // Add the projection
            .attr("transform", "scale(" + rescale_factor + ") translate(0,0)")
            .style("stroke-alignment", "inner")
            .style("stroke", "white")
            .style("stroke-width", 1)

        // Scaler to map income levels to appropriate lightness values
        const data_min = d3.min(d3.merge([data.map(d => d[2004]), data.map(d => d[2014])]))
        const data_max = d3.max(d3.merge([data.map(d => d[2004]), data.map(d => d[2014])]))

        const color_scale = d3.scaleLinear()
            .domain([data_min, data_max])
            .range([0.9, 0.25])

        // Fill states according to their median household income 
        maparea.selectAll("path")
            .data(data)
            .join("path")
            .attr("fill", d => d3.hsl(215, 0.5, color_scale(d[year])))
            .on("click", clickOn)

        // Click effect function
        function clickOn(event, d) {
            d3.select(this)
                .raise()
                .style("stroke-width", 2.5)
                .style("stroke", stroke_col)
                .transition().duration(90)

            sel_states.push(d.State)
            plotTable()
        }

        // Reset plotting when clicking on background html/svg
        d3.selectAll("html")
        .on("click", resetSelection)

        function resetSelection(event, d) {
            if (event.target.id === "mapSVG" | event.target.id === "document") {
                sel_states = []
                plotTable()
                plotMap(curr_year)
            }
            
        }
    }

    // Call functions to plot map and table
    plotMap(curr_year)
    plotTable()
})
    


