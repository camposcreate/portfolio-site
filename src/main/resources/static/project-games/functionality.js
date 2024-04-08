// function to reset the slider position
function resetSliderPosition() {
    const modalVideos = document.querySelector('.modal-videos');
    const scrollbarThumb = document.querySelector('.scrollbar-thumb');

    // reset currentIndex and scrollbar position
    currentIndex = 0;
    scrollbarThumb.style.width = '0%';
    modalVideos.style.transform = 'translateX(0)';
}

// function to initialize the slider
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