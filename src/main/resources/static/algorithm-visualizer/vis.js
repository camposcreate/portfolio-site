// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

const spritePosition = {
    row: 0, // Initialize with a default value
    col: 0, // Initialize with a default value
};

const cellElements = document.querySelectorAll(".grid-item");

const colorChangeButton = document.getElementById("color-change-button");
const gridColumns = 10;
colorChangeButton.addEventListener("click", () => {
    changeCellColor(cellElements, spritePosition.row, spritePosition.col, "open-cell");
    // ^ Pass the existing 'cellElements' variable to the function
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

// send grid data to backend
function sendGridData() {
    console.log("Sending grid data to backend");
    const gridData = {
         grid: getGrid(),
         spritePosition: getSpritePosition(),
    };
    console.log("Grid data sent to backend:", gridData);
    // Send the grid data as JSON to the backend
    fetch('/Algorithms/visualize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gridData),
    })
    .then(response => response.json())
    .then(updatedGridData => {
        console.log("Received updated grid data:", updatedGridData);
        // Handle the response from the backend
        visualizeAlgorithm(updatedGridData);

        cellElements.forEach(gridItem => {
            gridItem.addEventListener("dragover", handleDragOver);
            gridItem.addEventListener("drop", handleDrop);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
    colorChangeButton.addEventListener("click", () => {
        changeCellColor(cellElements, spritePosition.row, spritePosition.col, "open-cell");
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

    // Convert the 1D array to a 2D array
    const numRows = 3;
    const numCols = 10;
    const gridData2D = [];
    for (let i = 0; i < numRows; i++) {
        const row = updatedGridData.slice(i * numCols, (i + 1) * numCols);
        gridData2D.push(row);
    }

    console.log("Structure of updatedGridData:");
    // Loop through the grid cells and update their appearance based on the updatedGridData
    for (let row = 0; row < gridData2D.length; row++) {
        console.log(updatedGridData[row]);
        for (let col = 0; col < gridData2D[row].length; col++) {
            const cellValue = gridData2D[row][col];
            console.log("Processing cell:", row, col, "with value:", cellValue);
            if (cellValue === 'X') {
                console.log("Row:", row, "Col:", col);
                changeCellColor(cellElements, row, col, "obstacle");
            } else if (cellValue === 'O') {
                console.log("Row:", row, "Col:", col);
                changeCellColor(cellElements, row, col, "open-cell");
            } else if (cellValue === 'V') {
                console.log("Row:", row, "Col:", col);
                changeCellColor(cellElements, row, col, "visited-cell");
            }
        }
    }
    console.log("Color changes applied");
}

function changeCellColor(cellElements, row, col, colorClass) {
    console.log("changeCellColor - Row:", row, "Col:", col);

    if (row < 0 || row >= 3 || col < 0 || col >= 10) {
        console.error(`Invalid row or column index: row=${row}, col=${col}`);
        return;
    }

    const cellIndex = row * 10 + col; // Assuming 10 columns
    const cell = cellElements[cellIndex];

    if (!cell) {
        console.error(`Cell element not found for row=${row}, col=${col}`);
        console.log("cellElements:", cellElements); // Log the cellElements array
        console.log("cellIndex:", cellIndex); // Log the calculated cellIndex
        return;
    }

    console.log(`Setting color at ${row} ${col}`);
    cell.classList.add(colorClass, "dynamic-color");
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

// Visualize button functionality
const visualizeButton = document.getElementById("start-button");
visualizeButton.addEventListener("click", () => {
    console.log("Visualize button clicked");
    sendGridData();
});