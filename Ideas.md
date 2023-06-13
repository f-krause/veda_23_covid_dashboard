# Ideas & Nodes

## TODOs
- [ ] vertical slider to compare values
- [ ] h2 text align issue
- [ ] change file structure, one promise and call functions inside with loaded data (much more efficient)
- [ ] svg size issue (longer than it should be)
- [ ] (introduce brushing/filter transition (d3_transitions.html of tutorial))
- [ ] (Introduce zoom and pan for map)
- [ ] Uganda Anomaly: 2021-08-19 to 2021-08-25 --> also on OWID
- [x] add hover effects to scatter plot
- [x] custom scaling of range depending on corrvar
- [x] countries encoded wrongly
- [x] add button to reset view
- [x] introduce mouseover for map with country name
- [x] include a list of country colors (Custom color scheme for linecharts)
- [x] add legend to map
- [x] introduce links between plots (structure every plot into a function with list of countries to show/highlight)
- [x] scatter plot "append" issue when changing data - x owned by Alina
- [x] scatter yScale issue (labels below axis)


</br>


## Challenges
- How to assign colors to selected countries so that they do not change when adding new ones
- different country names in geojson and OWID data (Swaziland vs Eswatini, Cote d'Ivoire" vs "Ivory Coast)
- Some countries not available western sahara has no data at all, Mayotte not in geojson, etc.

</br>


## Notes
- **Overview first, zoom and filter, then details on demand**
- Plot titles, axis labels, legends
- Include instructions  (?)
- nice design
- Always metric per population size, e.g. vacc/cases per 1 mio (or eq)
- GEODATA for AFRICA: https://gist.github.com/1310aditya/35b939f63d9bf7fbafb0ab28eb878388#file-africa-json
- https://geojson-maps.ash.ms/

</br>


## Common pitfalls
- making the user scroll up/down
- making the user switch between tabs
- use of drop-down menus (without strong justification)
- [un]readable labels
- using "_" in labels
- missing axis labels
- human [un]readable numbers
- if NULL/missing values are shown as zero
- missing interactivity between charts
- animation that is not well justified (and which alternatives were considered and rejected for what reasons)
- using popup views (without strong justification)

