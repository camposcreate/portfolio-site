/*
// toggle item color and reset board
document.addEventListener('DOMContentLoaded', () => {
    const gridItems = document.querySelectorAll('.grid a');
    const resetButton = document.getElementById('clear-button');

    // toggle
    gridItems.forEach(item => {
        item.addEventListener('click', () => {
            console.log("Clicked!");
            item.parentElement.classList.toggle('clicked');
        });
    });

    // reset board
    resetButton.addEventListener('click', () => {
        gridItems.forEach(item => {
            item.parentElement.classList.remove('clicked');
        });
    });
});*/

const cell = document.querySelectorAll(".grid-item"),
    image = document.querySelector(".image");

console.log(cell, image);

// loop each cell element
cell.forEach((gridItem) => {
    // When elements are dragged over cells
    gridItem.addEventListener("dragover", (e) => {
        e.preventDefault();
        gridItem.classList.add("hovered");
    });

    // When elements are dragged out of cells
    gridItem.addEventListener("dragleave", () => {
        gridItem.classList.remove("hovered");
    });

    // When elements are dropped in a cell
    gridItem.addEventListener("drop", () => {
        gridItem.appendChild(image);
        gridItem.classList.remove("hovered");
    });
});






