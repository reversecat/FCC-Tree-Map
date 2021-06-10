document.addEventListener('DOMContentLoaded', () => {
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
        .then(res => res.json())
        .then(data => {
            createViz(data);
        });
});

function createViz(data) {
    console.log(data);

    const width = 900;
    const height = 500;

    const svg = d3.select('#container')
                  .append('svg')
                  .attr('id', 'board')
                  .attr('width', width)
                  .attr('height', height);

    const tooltip = d3.select('#container')
                      .append('div')
                      .attr('id', 'tooltip')
                      .style('opacity', 0);

    const treemap = new d3.treemap()
                          .size([width, height])
                          .padding(1);
    const root = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
    console.log(root);
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    treemap(root);

    var cell = svg.selectAll('g')
                  .data(root.leaves())
                  .enter()
                  .append('g')
                  .attr('class', 'group')
                  .attr('transform', d => 'translate(' + d.x0 + ',' + d.y0 + ')');

    var tile = cell.append('rect')
                   .attr('class', 'tile')
                   .attr('data-name', d => d.data.name)
                   .attr('data-category', d => d.data.category)
                   .attr('data-value', d => d.data.value)
                   .attr('width', d => d.x1 - d.x0)
                   .attr('height', d => d.y1 - d.y0)
                   .attr('fill', d => color(d.data.category))
                   .on('mousemove', (d, i) => {
                       tooltip.style('opacity', 0.9)
                              .style('left', d3.event.pageX + 35 + 'px')
                              .style('top', d3.event.pageY + 'px')
                              .attr('data-value', d.data.value)
                              .html(`
                            <p>Name: ${d.data.name}</p>
                            <p>Category: ${d.data.category}</p>
                            <p>Value: ${d.data.value}</p>`);
                   })
                   .on('mouseout', () => {
                      tooltip.style('opacity', 0)
                   });

    cell.append('text')
        .attr('class', 'tile-text')
        .selectAll('tspan')
        .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan')
        .attr('x', 4)
        .attr('y', (d, i) => 12 * i + 13)
        .text(d => d);

    const legend = d3.select('#container')
                     .append('svg')
                     .attr('width', 400)
                     .attr('height', 150)
                     .attr('id', 'legend');
    legend.selectAll('rect')
          .data(root.children)
          .enter()
          .append('rect')
          .attr('width', '20px')
          .attr('height', '20px')
          .attr("class","legend-item")
          .attr('fill', d => color(d.data.name))
          .attr('x', (d, i) => {
              console.log(d.data)
              return Math.floor(i / 5) * 100;
          })
          .attr('y', (d, i) => {
              return i % 5 * 25;
          });
    legend.selectAll('text')
          .data(root.children)
          .enter()
          .append('text')
          .text(d => d.data.name)
          .attr('x', (d, i) => {
              console.log(d.data)
              return Math.floor(i / 5) * 100 + 25;
          })
          .attr('y', (d, i) => {
              return i % 5 * 25 + 14;
          });

}