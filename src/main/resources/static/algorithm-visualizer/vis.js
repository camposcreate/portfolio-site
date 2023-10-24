console.log("Script loaded. Starting debugging.");
// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

// sprite position (starting position)
let spritePosition = {
    row: 0,
    col: 0,
};

// activeSprite as an HTML element
const activeSprite = document.querySelector(".image");

// cell as an HTML element
let cellElements = document.querySelectorAll(".grid-item:not(.visited-cell)");
const numRows = 5; // number of rows
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

// Function to clear and reattach event listeners
function addDragAndDropListeners() {
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
            gridItem.appendChild(activeSprite);
            gridItem.classList.remove("hovered");
            // Update the spritePosition
            spritePosition.row = parseInt(gridItem.id.split("-")[1]);
            spritePosition.col = parseInt(gridItem.id.split("-")[2]);
        });
    });
}

// Call this function initially
addDragAndDropListeners();

// Reset the grid and reattach event listeners
function resetGrid() {
    console.log('Reset button clicked');
    document.querySelector(".grid").innerHTML = originalGridHTML;
    cellElements = document.querySelectorAll(".grid-item:not(.visited-cell)");
    addDragAndDropListeners();
    // Reset sprite position after reset
    spritePosition = { row: 0, col: 0 };
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
        if (isValid(row, col) && gridData[row][col] === 'V') {
            queue.push({ row, col });

            const cellId = `cell-${row}-${col}`;
            const cellElement = document.getElementById(cellId);

            if (cellElement) {
                cellElement.className = 'update-cell';
            }
        }
    }

    // Before BFS-like visualization starts
    console.log('Starting BFS-like visualization');

    // Start the BFS-like visualization
    processNextStep();
}

// Retrieve the current state of the grid as a 2D array
function getGrid() {
    const gridData = [];

    for (let row = 0; row < numRows; row++) {
        const rowData = [];
        for (let col = 0; col < numColumns; col++) {
            const cellId = `cell-${row}-${col}`;
            const gridItem = document.getElementById(cellId);
            const cellValue = gridItem.classList.contains("obstacle") ? "X" : "O";
            rowData.push(cellValue);
        }
        gridData.push(rowData);
    }
    return gridData;
}

// Retrieve the sprite's current position
function getSpritePosition() {
    const activeCell = document.querySelector(".grid-item .image");
    if (activeCell) {
        const row = activeCell.parentElement.rowIndex;
        const col = activeCell.cellIndex;
        return { row, col };
    }
    return null; // Return null if sprite is not present
}

// connect to the WebSocket and listen for updates
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
};

// Visualize button functionality
const visualizeButton = document.getElementById("start-button");
visualizeButton.addEventListener("click", () => {
    console.log("Visualize button clicked");
    //sendGridData();
    sendGridData().then(updatedGridData => {
        visualizeBFS(updatedGridData, spritePosition.row, spritePosition.col);
    });

});