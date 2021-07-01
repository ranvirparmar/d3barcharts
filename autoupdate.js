let dim = {
    'width': 720, 
   'height':500, 
   'margin':50   
};

let svg = d3.select('#chart').append('svg')  
     .attrs(dim);




document.querySelector("#chart").classList.add("center");

let ageGroups = ["a", "b", "c", "d"];
let states = ["Australia", "US", "China", "India", "UK", "Canada", "Sri Lanka", "NZ", "France", "Brazil"];
let processedData = [];
let sortedData = [];

let populationMax;

changeData();


function changeData(){
    

    for(let i = 0; i < ageGroups.length; i++){

        processedData.push({
            ageGroup: ageGroups[i],
            data: []
        })

        populationMax = Math.floor(Math.random() * 700);

        for(let j=0; j < states.length; j++){
            processedData[i].data.push({
                state:states[j],
                population:Math.floor(Math.random() * populationMax)
            })
        }

    }
         

    sortedData = processedData[0].data.slice().sort((a,b) =>d3.descending(a.population, b.population));

};


console.log(processedData[0].data);
let scaleX = d3.scaleLinear()
                .domain([0,d3.max(processedData[0].data, d =>d.population)])         
                .range([dim.margin, dim.width-dim.margin])
               
                
let scaleY = d3.scaleBand()
               .domain(sortedData.map(d => d.state))
               .range([dim.margin, dim.height-dim.margin]);

let colors = d3.scaleOrdinal()
                .domain(processedData[0].data.map(d =>d.state))           
                .range(d3.schemePaired);



let axisX = svg.append('g')
                .attr('transform', 'translate(0,50)')
                .attr('id', 'axisX')
                .attr('color', '#fff')
                .call(d3.axisTop(scaleX));

let axisY = svg.append('g')    
                .attr('transform', 'translate(50,0)')
                .attr('id', 'axisY')
                .attr('color', '#fff')
                .call(d3.axisLeft(scaleY));

draw(sortedData);


setInterval(function(){ 
    processedData = []
    changeData()
    draw(processedData[0].data.slice().sort((a,b) => d3.descending(a.population, b.population)));

}, 5000);





function draw(data) {



    console.log(data)

    let t = d3.transition().duration(2000);


    scaleX.domain([0,d3.max(data, d =>d.population)]).nice();
    axisX
        .transition(t)
        .call(d3.axisTop(scaleX));    

    scaleY.domain(data.map(d => d.state));
    axisY
        .transition(t)
        .call(d3.axisLeft(scaleY));



     function update() {
         
        let rects = svg.selectAll('rect')
                    .data(data, d =>d.state)
                    .join(enter => 
                                  enter.append('rect')
                                  .attr('x', (d) => scaleX(0))
                                  .attr('y', (d) => scaleY(d.state))
                                  .attr('width', (d) => scaleX(d.population) - scaleX(0))
                                  .attr('height', (d) =>30)
                                  .attr('fill', (d)=>colors(d.state)),                        
                        update => update  
                    )
                    rects.transition(t)
                            .attr('y', (d) => scaleY(d.state))
                            .attr('width', (d) => scaleX(d.population) - scaleX(0))

    }                        

    update();

}


