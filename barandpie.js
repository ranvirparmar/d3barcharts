let dim = {
    'width': 720, 
   'height':500, 
   'margin':50   
};

let svg = d3.select('#chart').append('svg')  
     .attrs(dim);




document.querySelector("#chart").classList.add("left");

let dimPie = {
    'width': 520, 
'height':500, 
'margin':50   
};

let svgPie = d3.select('#chart').append('svg')  
    .attrs(dimPie);

document.querySelector("#pie").classList.add("right");


let ageGroups = ["a"];
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
                population:Math.floor(Math.random() * populationMax),
                stateBoundary: []
            });
        }



    }
         

    sortedData = processedData[0].data.slice().sort((a,b) =>d3.descending(a.population, b.population));

};




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

let colorTracker = [];

let currentPieColor = 'green';

draw(sortedData);


setInterval(function(){ 
    processedData = []
    changeData()

    let topState = processedData[0].data.slice().sort((a,b) => d3.descending(a.population, b.population))[0].state;
 
    var result = colorTracker.filter(obj => {
        return obj.state == topState
      });

      currentPieColor = result[0].color;
    draw(processedData[0].data.slice().sort((a,b) => d3.descending(a.population, b.population)));

}, 5000);





function draw(data) {

    //add state data for the hightest number country 
    let statelength = Math.floor(Math.random()*10) + 2;

    for(let k=0; k < statelength; k++) {
        data[0].stateBoundary.push({
                stateChild: "State"+k,
                stateCount: Math.floor(Math.random()*populationMax)
        })
    }

  

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
                                  .attr('fill', (d)=>{
                      
                                    colorTracker.push({
                                        state:d.state,
                                        color: colors(d.state)
                                    });

                                 
                                    return colors(d.state);
                                  }),                        
                        update => update  
                    )
                    rects.transition(t)
                            .attr('y', (d) => scaleY(d.state))
                            .attr('width', (d) => scaleX(d.population) - scaleX(0))

            setTimeout(function(){ 
                createPieChart(data[0].stateBoundary);              
            }, 2000);        
         
    }                        

    update();
   
}

//create pie chart

function createPieChart(data) {

        let local = d3.local();
        //first create an arc generator
        let arcGen = d3.arc()
                        .innerRadius(130)
                        .outerRadius(200)             
                        .padRadius(300)
                        .padAngle(5/300)
                        .cornerRadius(1);


        //then create a pie chart                
        let pieArcData = d3.pie()
                            .value(d=>d.stateCount);


        function update() {
            let paths = svgPie.selectAll('path')
                        .data(pieArcData(data), d=> d.data.stateChild)
                        .join(enter => 
                                        enter.append('path')
                                        .each(function(d) {
                                            local.set(this, d)
                                          })
                                        .attr('d', arcGen)
                                        .attr('stroke', 'black')
                                        .attr('fill', currentPieColor)
                                        .attr('transform', 'translate(300,250)'),             
                            update => update.call(path =>path.transition().duration(300).attrTween('d', function(d) {
                                var i = d3.interpolate(local.get(this), d);
                                local.set(this, i(0));
                                return function(t) {
                                  return arcGen(i(t));
                                };
                              })).attr('fill', currentPieColor),
                            exit => exit.call(path => path.transition().duration(300).remove().attr('fill', 'white'))  
                        );

                svgPie.selectAll('text')
                        .data(pieArcData(data), d=> d.data.stateChild)
                        .join(enter => 
                                        enter.append('text')
                                        .each(function(d) {
                                            local.set(this, d)
                                          })                                     
                                          .attrs({
                                                'x':(d)=>arcGen.centroid(d)[0],
                                                'y':(d)=>arcGen.centroid(d)[1],
                                                'font-size':10,
                                                'transform':'translate(300,250)'
                                          })
                                          .text((d) =>d.data.stateChild),
                            update => update.call(text =>text.transition().duration(300).attrTween('d', function(d) {
                                var i = d3.interpolate(local.get(this), d);
                                local.set(this, i(0));
                                return function(t) {
                                  return arcGen(i(t));
                                };
                              })).attrs({
                                'x':(d)=>arcGen.centroid(d)[0],
                                'y':(d)=>arcGen.centroid(d)[1],
                                'font-size':10,
                                'transform':'translate(300,250)'
                          }),
                            exit => exit.call(text => text.transition().duration(300).remove().attr('fill', 'white'))  
                        )           

                       
         
        }                        
    
        update();


}