

const fruits = [
    {name: "🍊", count: 25},
    {name: "🍇", count: 13},
    {name: "🍏", count: 8},
    {name: "🍌", count: 5},
    {name: "🍐", count: 3},
    {name: "🍋", count: 8},
    {name: "🍎", count: 5},
    {name: "🍉", count: 17}
  ]
  let dim = {
    'width': 720, 
   'height':500, 
   'margin':50   
};

let svg = d3.select('#chart').append('svg')  
     .attrs(dim);




document.querySelector("#chart").classList.add("center");

let scaleX = d3.scaleBand()
                .domain(fruits.map(d => d.name))
                .range([dim.margin, dim.width - dim.margin])
                .padding(0.1)
                .round(true)


let scaleY = d3.scaleLinear()
                .domain([0, d3.max(fruits, d => d.count)])
                .nice()
                .range([dim.height - dim.margin,dim.margin])
                .interpolate(d3.interpolateRound)


let color = d3.scaleSequential()
            .domain([0, d3.max(fruits, d=>d.count)])
            .interpolator(d3.interpolateBlues);


let axisX = d3.axisBottom(scaleX);
let axisY = d3.axisLeft(scaleY);

svg.append('g')
    .attr('transform', 'translate(-20,450)') 
    .call(axisX)


svg.append('g')
    .attr('transform', 'translate(50,0)')  
    .attr('color', '#fff')  
    .call(axisY);


//the reason scaleX(0) is being subtracted is because
//of translating of the Y scale and not starting
//Y scale at 0 but at  dim.margin added above

svg.selectAll('rect')    
    .data(fruits)
    .enter()
    .append('rect')
    .attrs({
          'x':(d) =>scaleX(d.name),
        'y':(d) => scaleY(d.count),
        'width':(d)=>  30,
        'height':(d)=>0,
        'fill':(d)=>color(d.count)

    })
    .transition().duration(1000).attr('height', (d)=>  scaleY(0) - scaleY(d.count))

