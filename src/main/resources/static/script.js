// function updates scroll progress bar
function updateProgressBar() {
    const documentHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollProgress = window.scrollY / (documentHeight - viewportHeight);
    const progressBarWidth = scrollProgress * 100;
    const progressBar = document.querySelector('.filled');
    progressBar.style.width = progressBarWidth + '%';
}
window.addEventListener('scroll', updateProgressBar);

// Open/close side menu for mobile view
function openmenu() {
    sidemenu.classList.add("menu-open");
}

function closemenu() {
    sidemenu.classList.remove("menu-open");
}



