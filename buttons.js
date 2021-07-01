let dim = {
    'width': 720, 
   'height':500, 
   'margin':50   
};

let svg = d3.select('#chart').append('svg')  
     .attrs(dim);




document.querySelector("#chart").classList.add("center");

let ageGroups = ["a", "b", "c", "d"];
let states = ["UT", "TX", "AK", "ID", "SD", "NE", "KS", "OK", "ND", "GA"];
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


const buttonGroup = document.querySelector(".buttonGroup").children;
const aButton = document.querySelector(".buttonGroup button:nth-child(1)");
const bButton = document.querySelector(".buttonGroup button:nth-child(2)");
const cButton = document.querySelector(".buttonGroup button:nth-child(3");
const dButton = document.querySelector(".buttonGroup button:nth-child(4)");





aButton.addEventListener('click', async(e) =>{

    runBoilerPlateColourChange(aButton);
    draw(processedData[0].data.slice().sort((a,b) => d3.descending(a.population, b.population)));

});


bButton.addEventListener('click', async(e) =>{    
    runBoilerPlateColourChange(bButton);  
    draw(processedData[1].data.slice().sort((a,b) => d3.descending(a.population, b.population)));
});

//Now it is just a matter of passing the right year along
//with the right button click
cButton.addEventListener('click', async(e) =>{
    runBoilerPlateColourChange(cButton);  
    draw(processedData[2].data.slice().sort((a,b) => d3.descending(a.population, b.population)));
});

dButton.addEventListener('click', async(e) =>{
    runBoilerPlateColourChange(dButton);
    draw(processedData[3].data.slice().sort((a,b) => d3.descending(a.population, b.population)));
});

async function runBoilerPlateColourChange (button){
    await removeSelected();

    //add the selected class
    button.classList.remove("unselected");
    button.classList.add("selected");
}

function removeSelected() {
    return new Promise(resolve => {
            Array.from(buttonGroup).forEach(item => {

                item.classList.remove("selected");
        
                item.classList.add("unselected");
        
             });
            resolve("Success");
    })
}







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


