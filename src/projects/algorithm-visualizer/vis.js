// capture original HTML content of grid
const originalGridHTML = document.querySelector(".grid").innerHTML;

// reset the grid to original state
function resetGrid() {
    document.querySelector(".grid").innerHTML = originalGridHTML;

    // reattach event listeners
    addDragAndDropListeners();
}

// add drag-and-drop functionality to cells
function addDragAndDropListeners() {
    const cell = document.querySelectorAll(".grid-item"),
        image = document.querySelector(".image");

    // loop through each cell element
    cell.forEach((gridItem) => {
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
