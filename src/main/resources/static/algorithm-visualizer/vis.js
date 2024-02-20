// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

// sprite position (starting position)
let spritePosition = {
    row: 0,
    col: 0,
};
// end sprite position (starting position)
let endSpritePosition = {
    row: 9,
    col: 9,
};
// activeSprite as an HTML element
const activeSprite = document.querySelector(".image");
const activeEndSprite = document.querySelector(".image2");

var isClicked = false;

// cell as an HTML element
let cellElements = document.querySelectorAll(".grid-item:not(.visited-cell)");
const numRows = 10; // number of rows
const numColumns = cellElements.length / numRows; // number of columns

console.log("Number of rows: " + numRows);
console.log("Number of columns: " + numColumns);

// call initially
resetGrid();

function resetGrid() {
    console.log('Reset button clicked');
    isClicked = true;

    // clear grid
    const grid = document.querySelector(".grid");
    grid.innerHTML = originalGridHTML;

    // reset start sprite position after reset
    spritePosition = { row: 0, col: 0 };

    // reset end sprite position after reset
    endSpritePosition = { row: 9, col: 9 };

    // Remove original start sprite from its initial position
    const originalSpriteContainer = document.querySelector("#cell-0-0");
    originalSpriteContainer.innerHTML = '';
    originalSpriteContainer.appendChild(activeSprite);

    // remove original end sprite from its initial position
    const originalEndSpriteContainer = document.querySelector("#cell-9-9");
    originalEndSpriteContainer.innerHTML = '';
    originalEndSpriteContainer.appendChild(activeEndSprite);

    // add event listeners directly to the cells
    cellElements = document.querySelectorAll(".grid-item:not(.visited-cell)");
    cellElements.forEach((gridItem) => {
        // when elements are dragged over cells
        gridItem.addEventListener("dragover", (e) => {
            e.preventDefault();
            gridItem.classList.add("hovered");
        });

        // when elements are dragged out of cells
        gridItem.addEventListener("dragleave", () => {
            gridItem.classList.remove("hovered");
        });

        // when elements are dropped in a cell
        gridItem.addEventListener("drop", (e) => {
            e.preventDefault();
            //console.log("Dropped in cell:", gridItem);

            const draggedElement = document.querySelector(".dragging");
            if (!draggedElement) {
                return;
            }

            // check dropped element is not same as dragged element
            if (gridItem.contains(draggedElement)) {
                return;
            }

            if (draggedElement.classList.contains("image")) {
                // update the starting position
                spritePosition.row = parseInt(gridItem.id.split("-")[1]);
                spritePosition.col = parseInt(gridItem.id.split("-")[2]);
                gridItem.appendChild(activeSprite);
                console.log("Dropped 'starting' sprite in cell:", gridItem);
            } else if (draggedElement.classList.contains("image2")) {
                // update the ending position
                endSpritePosition.row = parseInt(gridItem.id.split("-")[1]);
                endSpritePosition.col = parseInt(gridItem.id.split("-")[2]);
                gridItem.appendChild(activeEndSprite);
                console.log("Dropped 'ending' sprite in cell:", gridItem);
            }
            //gridItem.appendChild(draggedElement);
            gridItem.classList.remove("hovered");

        });

        // cell click change color (obstacles)
        gridItem.addEventListener('click', handleCellClickForObstacle);
    });
    // attach dragstart event listeners to make sprites draggable
    document.querySelectorAll('.image, .image2').forEach((element) => {
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', ''); // for firefox
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            document.querySelectorAll('.grid-item').forEach((gridItem) => {
                gridItem.classList.remove('hovered');
            });

            element.classList.remove('dragging');
        });
    });

    // reattaching event listeners log
    console.log("event listeners reattached after reset");
}

// reset button functionality
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGrid);

// function to send grid data to backend
function sendGridData() {
    console.log("sending grid data to backend");

    // prepare grid data
    const gridData = {
        grid: getGrid(),
        spritePosition: spritePosition,
        endSpritePosition: endSpritePosition,
    };

    console.log("Grid data sent to backend:", gridData);

    // send grid data as JSON to the backend and handle the response
    return fetch('/Algorithms/visualize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gridData),
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            console.error('Server returned an error:', response.status, response.statusText);
            throw new Error('Network response was not ok');
        }
        return response.json(); // parse the response as JSON
    })
    .then(data => {
        console.log('Data:', data);
        return data; // resolve the promise with the received data
    })
    .catch(error => {
        console.error('Error:', error);
        // handle errors
        throw error;
    });
}

// drop sprite and record position (row, col)
function handleDrop(e, n) {
    e.preventDefault();
    n.preventDefault();
    const targetCell = e.target;
    const targetEndCell = n.target;

    // if contains grid item
    if (targetCell.classList.contains("grid-item")) {
        var start = targetCell.querySelector('.image');
        var end = targetEndCell.querySelector('.image2');
        // record dropped starting sprite
        if (start) {
            targetCell.appendChild(activeSprite);
            targetCell.classList.remove("hovered");

            // get row and column values of the dropped cell
            const row = targetCell.parentElement.rowIndex;
            const col = targetCell.cellIndex;

            // update the spritePosition
            spritePosition.row = row;
            spritePosition.col = col;

            console.log('Sprite dropped at row:', row, 'col:', col);
            console.log('Updated spritePosition:', spritePosition);
        }
        // record dropped ending sprite
        if (end) {
            targetEndCell.appendChild(activeEndSprite);
            targetEndCell.classList.remove("hovered");

            // get row and column values of the dropped cell
            const row = targetEndCell.parentElement.rowIndex;
            const col = targetEndCell.cellIndex;

            // update the endSpritePosition
            endSpritePosition.row = row;
            endSpritePosition.col = col;

            console.log('Sprite dropped at row:', row, 'col:', col);
            console.log('Updated spritePosition:', endSpritePosition);
        }
    }
}


// DFS
function visualizeDFS(updatedGridData, startRow, startCol, endRow, endCol) {
    // console.log('Visualize DFS');

    const ROW = updatedGridData.length;
    const COL = updatedGridData[0].length;
    const stack = [[startRow, startCol]];
    const visitedCells = Array.from(Array(ROW), () => Array(COL).fill(false));

    // direct path not found
    if (updatedGridData[endRow][endCol] === 'U') {
        alert('Direct path not found! Please try again!');
        return;
    }

    var dRow = [0, 1, 0, -1];
    var dCol = [-1, 0, 1, 0];

    // delay between painting cells
    const delay = 100;

    // collect shortest path
    const shortestPath = [];

    function isValid(row, col) {
        return row >= 0 && col >= 0 && row < ROW && col < COL && !visitedCells[row][col] && updatedGridData[row][col] !== 'X';
    }

    // start DFS
    function processNextStep() {
        // force reset if button is clicked
        if (isClicked) {
            //console.log('boolean marker true');
            return;
        }

        // stop DFS
        if (stack.length === 0) {
            // console.log('Length of Stack: ' + shortestPath.length);
            // paint shortest path
            let i = 0;
            while (i < shortestPath.length) {
                const { row, col } = shortestPath[i];
                const cellId = `cell-${row}-${col}`;
                const cellElement = document.getElementById(cellId);

                if (cellElement) {
                    cellElement.className = 'shortest-path-cell';
                }
                i++;
            }
            console.log('DFS visualization completed');
            return;
        }

        const [r, c] = stack.pop();

        if (!isValid(r, c) || visitedCells[r][c]) {
            processNextStep();
            return;
        }

        // mark cell as visited
        visitedCells[r][c] = true;

        // update cell color
        updateCellUI(r, c);

        // push incoming neighbors
        for (let i = 0; i < 4; i++) {
            const pathR = r + dRow[i];
            const pathC = c + dCol[i];
            stack.push([pathR, pathC]);
        }

        setTimeout(processNextStep, delay);
    }
    console.log('Starting DFS visualization');
    processNextStep();

    function updateCellUI(row, col) {
        // console.log(`Processing cell at row: ${row}, col: ${col}`);
        if (updatedGridData[row][col] === 'V' || updatedGridData[row][col] === 'W') {

            if (updatedGridData[row][col] === 'W') {
                shortestPath.push({ row, col });
            }

            const cellId = `cell-${row}-${col}`;
            const cellElement = document.getElementById(cellId);

            if (cellElement) {
                cellElement.className = 'update-cell';
            }
        }
    } // updateCellUI()
}

// BFS
function visualizeBFS(updatedGridData, startRow, startCol, endRow, endCol) {
    // console.log('Visualizing BFS');

    // create new 2D array to represent the grid without original class information
    const gridData = JSON.parse(JSON.stringify(updatedGridData));

    // direct path not found
    if (gridData[endRow][endCol] === 'U') {
        alert('Direct path not found! Please try again!');
        return;
    }

    // delay between painting cells
    const delay = 100;

    // BFS traversal queue
    const queue = [{ row: startRow, col: startCol }];

    // collect shortest path
    const shortestPath = [];

    // check if cell is within grid boundaries
    function isValid(row, col) {
        return row >= 0 && row < gridData.length && col >= 0 && col < gridData[0].length;
    }

    // count iterations
    let iterationCount = 0;

    // maximum iteration limit (prevent infinite loops)
    const maxIterations = gridData.length * gridData[0].length;

    // store visited cells
    const visitedCells = [];

    // start BFS
    function processNextStep() {
        console.log('Count: ', iterationCount);

        // force reset if button is clicked
        if (isClicked) {
            //console.log('boolean marker true');
            return;
        }

        // stop BFS
        if (queue.length === 0 || iterationCount >= maxIterations) {
            // console.log('Length of Queue: ' + shortestPath.length);
            // paint shortest path
            let i = 0;
            while (i < shortestPath.length) {
                const { row, col } = shortestPath[i];
                const cellId = `cell-${row}-${col}`;
                const cellElement = document.getElementById(cellId);

                if (cellElement) {
                    cellElement.className = 'shortest-path-cell';
                }
                i++;
            }
            console.log('BFS visualization completed');
            return;
        }

        // process current queue
        const queueLength = queue.length;
        for (let i = 0; i < queueLength; i++) {
            const { row, col } = queue.shift(); // Dequeue

            // check if cell has previously been visited
            if (visitedCells.some(cell => cell.row === row && cell.col === col)) {
                continue;
            }

            // log current cell
            // console.log(`Processing cell at row: ${row}, col: ${col}`);

            // mark visited cell
            visitedCells.push({ row, col });

            // add neighboring cells (unvisited) to queue
            enqueue(row - 1, col); // Top
            enqueue(row + 1, col); // Bottom
            enqueue(row, col - 1); // Left
            enqueue(row, col + 1); // Right
        }

        iterationCount++;

        // continue with delay
        setTimeout(processNextStep, delay);
    }

    // add a neighboring cells to the queue for traversal
    function enqueue(row, col) {

        // avoid blocked paths
        if (isValid(row, col) && gridData[row][col] === 'V' ||
                isValid(row, col) && gridData[row][col] === 'W') {

            // push cells for shortest path
            if (gridData[row][col] === 'W') {
                shortestPath.push({ row, col });
            }
            queue.push({ row, col });

            const cellId = `cell-${row}-${col}`;
            const cellElement = document.getElementById(cellId);

            if (cellElement) {
                cellElement.className = 'update-cell';
            }
        }
    } // end enqueue()

    // for debugging
    console.log('Starting BFS visualization');

    // start bfs
    processNextStep();
}

// retrieve the current state of the grid as a 2D array
// S -> starting position
// O -> open cells
// X -> blocked cells
// E -> ending position
function getGrid() {
    const gridData = [];

    for (let row = 0; row < numRows; row++) {
        const rowData = [];
        for (let col = 0; col < numColumns; col++) {
            const cellId = `cell-${row}-${col}`;
            const gridItem = document.getElementById(cellId);
            // mark starting position
            if (spritePosition.row == row && spritePosition.col == col) {
                const cellValue = "S";
                rowData.push(cellValue);
                continue;
            }
            // mark ending position
            if (endSpritePosition.row == row && endSpritePosition.col == col) {
                const cellValue = "E";
                rowData.push(cellValue);
                continue;
            }
            const cellValue = gridItem.classList.contains("obstacle") ? "X" : "O";
            rowData.push(cellValue);
        }
        gridData.push(rowData);
    }
    return gridData;
}

// retrieve starting sprite's current position
function getSpritePosition() {
    const activeCell = document.querySelector(".grid-item .image");
    if (activeCell) {
        const row = activeCell.parentElement.rowIndex;
        const col = activeCell.cellIndex;
        return { row, col };
    }
    return null; // if starting sprite is not present
}
// retrieve end sprite's current position
function getEndSpritePosition() {
    const activeEndCell = document.querySelector(".grid-item .image2");
    if (activeEndCell) {
        const row = activeEndCell.parentElement.rowIndex;
        const col = activeEndCell.cellIndex;
        return { row, col };
    }
    return null; // if ending sprite is not present
}

// Default to BFS
let selectedAlgorithm = "BFS";

// Controls selection of algorithm
function getAlgorithm() {
    selectedAlgorithm = document.getElementById("algo").value;
    console.log(selectedAlgorithm);
}

// 'Visualize' button functionality
function visualize() {
    console.log("Visualize button clicked");
    isClicked = false;
    // call algorithm function
    sendGridData().then(updatedGridData => {
        if (selectedAlgorithm === "BFS") {
            visualizeBFS(updatedGridData, spritePosition.row, spritePosition.col, endSpritePosition.row, endSpritePosition.col);
        } else if (selectedAlgorithm === "DFS") {
            visualizeDFS(updatedGridData, spritePosition.row, spritePosition.col, endSpritePosition.row, endSpritePosition.col);
        }
    });
}

// cell click handler function for obstacles
function handleCellClickForObstacle(e) {
    const clickedCell = e.target;
    if (clickedCell.classList.contains("grid-item")) {
        clickedCell.classList.toggle('obstacle');
        clickedCell.style.backgroundColor = '#000';
    }
}
// cell click change color (obstacles)
cellElements.forEach((cell) => {
    cell.addEventListener('click', handleCellClickForObstacle);
});