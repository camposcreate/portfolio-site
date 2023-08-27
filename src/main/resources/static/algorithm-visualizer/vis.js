// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

const spritePosition = {
    row: 0, // Initialize with a default value
    col: 0, // Initialize with a default value
};

const cellElements = document.querySelectorAll(".grid-item"),
        image = document.querySelector(".image");

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

    // loop through each cell element
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
        // changeCellColor(0, 0, "open-cell"); - testing color change

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
    const grid = document.querySelectorAll(".grid-item");

    // Loop through the grid cells and update their appearance based on the updatedGridData
    for (let row = 0; row < updatedGridData.length; row++) {
        for (let col = 0; col < updatedGridData[row].length; col++) {
            const cellValue = updatedGridData[row][col];
            if (updatedGridData[row][col] === 'X') {
                changeCellColor(cellElements, row, col, "obstacle");  // Corrected here
            } else if (updatedGridData[row][col] === 'O') {
                changeCellColor(cellElements, row, col, "open-cell");
            } else if (cellValue === 'V') {
                changeCellColor(cellElements, row, col, "visited-cell");
            }
            // for adding additional conditions as needed
        }
    }
    console.log("Color changes applied");
}

function changeCellColor(cellElements, row, col, colorClass) {
    const cellIndex = row * gridColumns + col;
    const cell = cellElements[cellIndex];
    console.log("cell:", cell);
    console.log("colorClass:", colorClass);

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
visualizeButton.addEventListener("click", sendGridData);

visualizeButton.addEventListener("click", () => {
    console.log("Visualize button clicked");
    sendGridData();
});