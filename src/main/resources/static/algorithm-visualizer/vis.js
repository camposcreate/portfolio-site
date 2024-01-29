console.log("Script loaded. Starting debugging.");
// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

// sprite position (starting position)
let spritePosition = {
    row: 0,
    col: 0,
};
// end sprite position (starting position)
let spriteEndPosition = {
    row: 9,
    col: 9,
};
// activeSprite as an HTML element
const activeSprite = document.querySelector(".image");
const activeEndSprite = document.querySelector(".image2");

// cell as an HTML element
let cellElements = document.querySelectorAll(".grid-item:not(.visited-cell)");
const numRows = 10; // number of rows
const numColumns = cellElements.length / numRows; // number of columns

console.log("Number of rows: " + numRows);
console.log("Number of columns: " + numColumns);

const socket = new SockJS('/Algorithms/websocket');
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
    stompClient.subscribe('/topic/updatedGrid', (message) => {
        const updatedGridData = JSON.parse(message.body);
        console.log('Received updated grid data:', updatedGridData);
        updateGrid(updatedGridData);
    });
});

// Call reset function initially
resetGrid();

function resetGrid() {
    console.log('Reset button clicked');

    // clear grid
    const grid = document.querySelector(".grid");
    grid.innerHTML = originalGridHTML;

    // Reset sprite position after reset
    spritePosition = { row: 0, col: 0 };

    // Remove the original sprite from its initial position
    const originalSpriteContainer = document.querySelector("#cell-0-0");
    originalSpriteContainer.innerHTML = '';
    originalSpriteContainer.appendChild(activeSprite);

    // Add event listeners directly to the cells
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
        gridItem.addEventListener("drop", () => {
            console.log("Dropped in cell:", gridItem);
            if (gridItem.contains(activeSprite)) {
                return;
            }

            gridItem.appendChild(activeSprite);
            gridItem.classList.remove("hovered");
            // Update the spritePosition
            spritePosition.row = parseInt(gridItem.id.split("-")[1]);
            spritePosition.col = parseInt(gridItem.id.split("-")[2]);
        });

        // cell click change color (obstacles)
        gridItem.addEventListener('click', handleCellClickForObstacle);
    });

    // Log after reattaching event listeners
    console.log("Event listeners reattached after resetting the grid");
}

// reset button functionality
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGrid);

// Function to send grid data to the backend
function sendGridData() {
    console.log("Sending grid data to backend");

    // Prepare grid data
    const gridData = {
        grid: getGrid(),
        spritePosition: spritePosition,
    };

    console.log("Grid data sent to backend:", gridData);

    // Send grid data as JSON to the backend and handle the response
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
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        console.log('Data:', data);
        return data; // Resolve the promise with the received data
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors
        throw error;
    });
}

// Drop sprite and record position (row, col)
function handleDrop(e) {
    e.preventDefault();
    const targetCell = e.target;
    if (targetCell.classList.contains("grid-item")) {
        targetCell.appendChild(activeSprite);
        targetCell.classList.remove("hovered");

        // Get the row and column values of the dropped cell
        const row = targetCell.parentElement.rowIndex;
        const col = targetCell.cellIndex;

        // Update the spritePosition
        spritePosition.row = row;
        spritePosition.col = col;

        console.log('Sprite dropped at row:', row, 'col:', col);
        console.log('Updated spritePosition:', spritePosition);

    }
}

// DFS
function visualizeDFS(updatedGridData, startRow, startCol) {
    console.log('Visualize DFS');

    const ROW = updatedGridData.length;
    const COL = updatedGridData[0].length;
    const stack = [[startRow, startCol]];
    const visitedCells = Array.from(Array(ROW), () => Array(COL).fill(false));

    var dRow = [0, 1, 0, -1];
    var dCol = [-1, 0, 1, 0];

    // delay between painting cells
    const delay = 100;

    function isValid(row, col) {
        return row >= 0 && col >= 0 && row < ROW && col < COL && !visitedCells[row][col] && updatedGridData[row][col] !== 'X';
    }

    function processNextStep() {
        if (stack.length === 0) {
            console.log('DFS visualization completed');
            return;
        }
        const [r, c] = stack.pop();

        if (!isValid(r, c) || visitedCells[r][c]) {
            processNextStep();
            return;
        }

        // Mark cell as visited
        visitedCells[r][c] = true;

        // Update cell color
        updateCellUI(r, c);

        // Push incoming neighbors
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
        console.log(`Processing cell at row: ${row}, col: ${col}`);
        if (updatedGridData[row][col] === 'V') {

            const cellId = `cell-${row}-${col}`;
            const cellElement = document.getElementById(cellId);

            if (cellElement) {
                cellElement.className = 'update-cell';
            }
        }
    } // updateCellUI()
}

// BFS
function visualizeBFS(updatedGridData, startRow, startCol) {
    console.log('Visualizing BFS');

    // create new 2D array to represent the grid without original class information
    const gridData = JSON.parse(JSON.stringify(updatedGridData));

    // delay between painting cells
    const delay = 100;

    // BFS traversal queue
    const queue = [{ row: startRow, col: startCol }];

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
        if (queue.length === 0 || iterationCount >= maxIterations) {
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

            console.log(`Processing cell at row: ${row}, col: ${col}`); // Log current cell

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
        // if starting position
        if (isValid(row, col) && gridData[row][col] === 'S') {
            queue.push({ row, col });

            const cellId = `cell-${row}-${col}`;
            const cellElement = document.getElementById(cellId);

            if (cellElement) {
                cellElement.className = 'start-cell';
            }
        }
        if (isValid(row, col) && gridData[row][col] === 'V') {
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

    // Start the BFS visualization
    processNextStep();
}

// Retrieve the current state of the grid as a 2D array
// S -> starting position
// O -> open cells
// X -> blocked cells
function getGrid() {
    const gridData = [];

    for (let row = 0; row < numRows; row++) {
        const rowData = [];
        for (let col = 0; col < numColumns; col++) {
            const cellId = `cell-${row}-${col}`;
            const gridItem = document.getElementById(cellId);
            if (spritePosition.row == row && spritePosition.col == col) { // mark starting position
                const cellValue = "S";
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
let startItem;
// Retrieve the sprite's current position
function getSpritePosition() {
    const activeCell = document.querySelector(".grid-item .image");
    if (activeCell) {
        const row = activeCell.parentElement.rowIndex;
        const col = activeCell.cellIndex;
        return { row, col };
    }
    return null; // if sprite is not present
}
// Retrieve end sprite's current position
function getEndSpritePosition() {
    const activeCell = document.querySelector(".grid-item .image2");
    if (activeCell) {
        const row = activeCell.parentElement.rowIndex;
        const col = activeCell.cellIndex;
        return { row, col };
    }
    return null; // if sprite is not present
}

// Default to BFS
let selectedAlgorithm = "BFS";

// Controls selection of algorithm
function getAlgorithm() {
    selectedAlgorithm = document.getElementById("algo").value;
    console.log(selectedAlgorithm);
}

/* connect to the WebSocket and listen for updates
function connectWebSocket() {
    const socket = new SockJS('/Algorithms/websocket'); // Use the correct WebSocket endpoint
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/updatedGrid', function (response) {
            const updatedGridData = JSON.parse(response.body);
            console.log('Received updated grid data:', updatedGridData);

        });
    });
}

// WebSocket message handler
stompClient.connect({}, (frame) => {
    // Subscription code goes here
    stompClient.subscribe('/topic/updatedGrid', (message) => {
        console.log('Received WebSocket message:', message.body);
        try {
            const data = message.body;
            if (data && typeof data === 'string') {
                const updatedGridData = JSON.parse(data);
                console.log('Received updated grid data:', updatedGridData);

                // Update the grid on the frontend with the updatedGridData
                updateGrid(updatedGridData);

            } else {
                console.error('Received invalid data:', data);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
});

// Call the connectWebSocket function when the page loads
window.onload = function () {
    connectWebSocket();
};*/

// Visualize button functionality
function visualize() {
    console.log("Visualize button clicked");

    sendGridData().then(updatedGridData => {
        if (selectedAlgorithm === "BFS") {
            visualizeBFS(updatedGridData, spritePosition.row, spritePosition.col);
        } else if (selectedAlgorithm === "DFS") {
            visualizeDFS(updatedGridData, spritePosition.row, spritePosition.col);
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