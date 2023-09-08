console.log("Script loaded. Starting debugging.");
// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

const spritePosition = {
    row: 0, // Initialize with a default value
    col: 0,
};

const cellElements = document.querySelectorAll(".grid-item");
const numRows = 3; // Define the number of rows
const numColumns = cellElements.length / numRows; // Calculate the number of columns

console.log("Number of rows: " + numRows);
console.log("Number of columns: " + numColumns);

const colorChangeButton = document.getElementById("color-change-button");
const gridColumns = 10;
colorChangeButton.addEventListener("click", () => {
    changeCellColor(cellElements, spritePosition.row, spritePosition.col, "open-cell");
    // ^ Pass the existing 'cellElements' variable to the function
});

const socket = new SockJS('/Algorithms/websocket');
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
    stompClient.subscribe('/topic/updatedGrid', (message) => {
        const updatedGridData = JSON.parse(message.body);
        console.log('Received updated grid data:', updatedGridData);
        updateGrid(updatedGridData);
    });
});

// reset the grid to original state
function resetGrid() {
    document.querySelector(".grid").innerHTML = originalGridHTML;
    // reattach event listeners
    addDragAndDropListeners();
}

// add drag-and-drop functionality to cells
function addDragAndDropListeners() {
    cellElements.forEach((gridItem) => {
        // when elements are dragged over cells
        gridItem.addEventListener("dragover", (e) => {
            e.preventDefault();
            gridItem.classList.add("hovered");
            console.log("Dragged over cell:", gridItem);
        });

        // when elements are dragged out of cells
        gridItem.addEventListener("dragleave", () => {
            gridItem.classList.remove("hovered");
        });

        // when elements are dropped in a cell
        gridItem.addEventListener("drop", () => {
            gridItem.appendChild(image);
            gridItem.classList.remove("hovered");
        });
    });
}

// call function initially
addDragAndDropListeners();

// reset button functionality
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", resetGrid);

// Define handleDragOver function
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

// Function to send grid data to the backend
function sendGridData() {
    console.log("Sending grid data to backend");

    // Prepare grid data
    const gridData = {
        grid: getGrid(),
        spritePosition: getSpritePosition(),
    };

    console.log("Grid data sent to backend:", gridData);

    // Send grid data as JSON to the backend
    fetch('/Algorithms/visualize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gridData),
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Read the response as text
    })
    .then(data => {
        console.log('Data:', data);
        try {
            const jsonData = data; // Use the response data directly
            console.log('Parsed JSON Data:', jsonData);
            updateGrid(jsonData); // Update the grid on the frontend
        } catch (error) {
            console.error('Error parsing JSON:', error);
            // Handle the error or empty response here
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors here
    });
}

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
    }
}

function visualizeAlgorithm(updatedGridData) {
    console.log("Received updated grid data:", updatedGridData);
    console.log("Is updatedGridData an object?", typeof updatedGridData === "object");
    console.log("Is grid an array?", Array.isArray(updatedGridData.grid));

    if (updatedGridData && Array.isArray(updatedGridData.grid)) {
        console.log("Grid structure appears valid.");
        processBFSStep(updatedGridData, 0, 0);
    } else {
        console.error("Invalid grid data structure.");
    }
}

function processBFSStep(updatedGridData, row, col) {
    console.log("Processing step for row:", row, "col:", col);

    if (updatedGridData && updatedGridData.grid && Array.isArray(updatedGridData.grid)) {
        const gridRow = updatedGridData.grid[row];

        console.log("Is gridRow a string?", typeof gridRow === "string");
        console.log("Is col within bounds?", col >= 0 && col < gridRow.length);

        if (gridRow && typeof gridRow === 'string' && col >= 0 && col < gridRow.length) {
            const cellValue = gridRow[col];
            console.log("Cell value:", cellValue);

            if (cellValue === 'V') {
                changeCellColor(cellElements, row, col, "visited-cell");
            } else if (cellValue === 'O') {
                changeCellColor(cellElements, row, col, "open-cell");
            } else if (cellValue === 'X') {
                changeCellColor(cellElements, row, col, "obstacle");
            } else {
                console.error("Invalid cell value");
            }
        } else {
            console.error("Invalid grid data structure or index.");
        }

        // Move to the next cell or row if necessary
        col++;
        if (col >= gridColumns) {
            col = 0;
            row++;
            console.log("Moving to the next row");
        }

        if (row < gridRows) {
            setTimeout(() => {
                processBFSStep(updatedGridData, row, col);
            }, 100); // Adjust the delay as needed
        } else {
            console.log("BFS visualization completed");
        }
    } else {
        console.error("Invalid grid data structure.");
    }
}

function changeCellColor(cellElements, row, col, colorClass) {
    console.log(`changeCellColor - Row: ${row}, Col: ${col}, Class: ${colorClass}`);

    if (row < 0 || row >= 3 || col < 0 || col >= gridColumns) {
        console.error(`Invalid row or column index: row=${row}, col=${col}`);
        return;
    }

    const cellIndex = row * gridColumns + col;
    const cell = cellElements[cellIndex];

    if (!cell) {
        console.error(`Cell element not found for row=${row}, col=${col}`);
        return;
    }

    if (!cell.classList.contains("visited-cell")) { // Only change color if not visited
        console.log(`Setting color at ${row} ${col}`);
        cell.classList.add(colorClass, "dynamic-color");
        console.log(`Color changed successfully at ${row} ${col}`);
    }
}

function updateGrid(updatedGridData) {
    console.log('updateGrid called');
    console.log('Received grid data:', updatedGridData);

    try {
        // Attempt to parse the received JSON data
        const parsedData = JSON.parse(updatedGridData);

        if (Array.isArray(parsedData.grid)) {
            const grid = parsedData.grid;

            for (let row = 0; row < grid.length; row++) {
                for (let col = 0; col < grid[row].length; col++) {
                    const cellValue = grid[row][col];
                    const cellElement = document.getElementById(`cell-${row}-${col}`);

                    if (cellElement) {
                        cellElement.className = '';

                        if (cellValue === 'V') {
                            cellElement.classList.add('visited-cell');
                            console.log(`Setting cell-${row}-${col} to visited-cell`);
                        } else if (cellValue === 'O') {
                            cellElement.classList.add('open-cell');
                            console.log(`Setting cell-${row}-${col} to open-cell`);
                        } else if (cellValue === 'X') {
                            cellElement.classList.add('obstacle');
                            console.log(`Setting cell-${row}-${col} to obstacle`);
                        }
                    }
                }
            }
        } else {
            console.error('Invalid grid data format:', parsedData);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}

// Retrieve the current state of the grid
function getGrid() {
    const grid = document.querySelectorAll(".grid-item");
    const gridData = [];

    grid.forEach((gridItem) => {
        const cellValue = gridItem.classList.contains("obstacle") ? "X" : "O";
        gridData.push(cellValue);
    });

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

// Function to connect to the WebSocket and listen for updates
function connectWebSocket() {
    const socket = new SockJS('/Algorithms/websocket'); // Use the correct WebSocket endpoint
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/updatedGrid', function (response) {
            const updatedGridData = JSON.parse(response.body);
            console.log('Received updated grid data:', updatedGridData);

            // Update the grid on the frontend with the updatedGridData
            // Implement this logic based on your frontend framework (e.g., React, Vue.js, plain JavaScript)
        });
    });
}

// Function to handle incoming grid data as a byte array
function handleGridDataAsByteArray(byteArray) {
    if (byteArray.length > 0) {
        // Handle the binary data here based on your application's logic.
        // For example, you can convert it to a string, process it, or display it as is.
        // In this example, we're simply logging it as a string.
        const decoder = new TextDecoder('utf-8');
        const gridDataString = decoder.decode(byteArray);
        console.log('Received binary data:', gridDataString);
    } else {
        console.error('Received empty byte array.');
    }
}

// WebSocket message handler
stompClient.connect({}, (frame) => {
    // Subscription code goes here
    stompClient.subscribe('/topic/updatedGrid', (message) => {
        // Handle incoming messages
        const byteArray = new Uint8Array(message.body);
        handleGridDataAsByteArray(byteArray);
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
    sendGridData();
});
