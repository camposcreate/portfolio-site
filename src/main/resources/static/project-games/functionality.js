// scroll to top
let topButton = document.getElementById("scrollUp");
window.onscroll = function() {
    scrollFunction();
};
function scrollFunction() {
    if (document.body.scrollTop > 300 ||
        document.documentElement.scrollTop > 300) {
        topButton.style.display = "block";
    } else {
        topButton.style.display = "none";
    }
}
function scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// if enter is clicked --> submit
var input = document.getElementById("game-input");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});

// search buttons (stylizing)
const buttonList = document.querySelectorAll('.search-tools button');
const searchButton = document.querySelector('.search button');
const searchImage = document.getElementById('search-image');
const results = document.getElementById('results');
buttonList.forEach(button => {
    button.addEventListener('click', () => {
        buttonList.forEach(btn => btn.classList.remove('special'));
        searchImage.classList.remove('special');
        results.classList.remove('user-input');
        button.classList.add('special');
    });
});
searchButton.addEventListener('click', () => {
    buttonList.forEach(button => {
        button.classList.remove('special');
    });
    searchImage.classList.add('special');
    results.classList.add('user-input');
});

// reset the slider position
function resetSliderPosition() {
    const modalVideos = document.querySelector('.modal-videos');
    const scrollbarThumb = document.querySelector('.scrollbar-thumb');
    // reset currentIndex and scrollbar position
    currentIndex = 0;
    scrollbarThumb.style.width = '0%';
    modalVideos.style.transform = 'translateX(0)';
}

// initialize slider
function initializeSlider() {
    const modalVideos = document.querySelector('.modal-videos');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    const scrollbarThumb = document.querySelector('.scrollbar-thumb');

    let currentIndex = 0;
    let isTransitioning = false;

    function updateScrollbar() {
        const percent = (currentIndex / (modalVideos.children.length - 1)) * 100;
        scrollbarThumb.style.transition = 'width 0.5s ease';
        scrollbarThumb.style.width = percent + '%';
    }
    function nextSlide() {
        if (!isTransitioning && currentIndex < modalVideos.children.length - 1) {
            currentIndex += 1;
            slideToCurrentIndex();
        }
    }
    function prevSlide() {
        if (!isTransitioning && currentIndex > 0) {
            currentIndex -= 1;
            slideToCurrentIndex();
        }
    }

    function slideToCurrentIndex() {
        isTransitioning = true;
        const slideWidth = modalVideos.children[currentIndex].clientWidth;
        const transformValue = `translateX(-${currentIndex * (slideWidth-50)}px)`;
        modalVideos.style.transition = 'transform 0.5s ease';
        modalVideos.style.transform = transformValue;

        modalVideos.addEventListener('transitionend', function transitionEndHandler() {
            isTransitioning = false;
            modalVideos.style.transition = '';
            modalVideos.removeEventListener('transitionend', transitionEndHandler);
            updateScrollbar();
        });
    }
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
    updateScrollbar();
}

