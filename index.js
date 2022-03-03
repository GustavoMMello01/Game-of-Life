const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

const resolution = 10;
canvas.width = 800;
canvas.height = 800;

const COLS = canvas.width / resolution
const ROWS = canvas.height / resolution

// build the grid with cols and rows with 0 value
function buildGrid(){
    return new Array(COLS).fill(null)
        .map( () => new Array(ROWS).fill(null)  // create the cels with null values
            .map( () => Math.floor(Math.random() * 2 ))) //returns the largest integer less than 2
}

let grid = buildGrid(); 

requestAnimationFrame(updated)

function updated() {
   grid = nextGen(grid) 
   render(grid)
   requestAnimationFrame(updated)
}

/*
Rules
1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
function nextGen(grid){
    const nextGen = grid.map(arr => [...arr]); // create a new array identical to the old one

    for(let col = 0; col < grid.length; col++){
        for(let row = 0; row < grid[col].length; row++){
            const cell = grid[col][row]
            let numNeighbours = 0;
            for (let i = -1; i < 2; i++){
                for(let j = -1; j < 2; j++){
                    if(i === 0 && j===0) {continue;}

                    const x_cell = col + i;
                    const y_cell = row + j;

                    if(x_cell >= 0 && y_cell >=0 && x_cell < COLS && y_cell < ROWS ){
                        const currentNeighbor = grid[col + i][row +j]
                        numNeighbours += currentNeighbor                        
                    }
                }
            }

            //rules
            if(cell === 1 && numNeighbours < 2){ //1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                nextGen[col][row] = 0
            }
            else if(cell === 1 && numNeighbours > 3){ //3. Any live cell with more than three live neighbours dies, as if by overpopulation.
                nextGen[col][row] = 0
            }
            else if(cell === 0 && numNeighbours === 3){ //4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                nextGen[col][row] = 1
            }
            //2. Any live cell with two or three live neighbours lives on to the next generation.
            // so will be the same cell, it is not necessary to modify
        }
    }
    return nextGen; // return the next generation of grid following the game of life rules
}


function render(grid){
    for(let col = 0; col < grid.length; col++){
        for(let row = 0; row < grid[col].length; row++){
            const cell = grid[col][row]

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? 'black' : 'white';
            ctx.fill();
            ctx.stroke();
        }
    }
}

