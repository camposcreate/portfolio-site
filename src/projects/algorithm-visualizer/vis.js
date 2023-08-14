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
});
