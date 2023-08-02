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


window.addEventListener('DOMContentLoaded', function() {
    // Get the navigation links
    var navLinks = document.querySelectorAll('.nav-link');

    // Handle scroll event
    window.addEventListener('scroll', function() {
        // Get the current scroll position
        var scrollPosition = window.scrollY;

        // Loop through the sections
        document.querySelectorAll('section').forEach(function(section) {
            var sectionId = section.getAttribute('id');
            var sectionOffset = section.offsetTop;
            var sectionHeight = section.offsetHeight;

            // Add a slight offset to the section activation
            // var activationOffset = 100;

            // Check if the scroll position is within the section with the offset
            if (
                scrollPosition >= sectionOffset - activationOffset &&
                scrollPosition < sectionOffset + sectionHeight - activationOffset
            ) {
                // Activate the corresponding navigation item
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

      // Add event listener to the 'Home' link
      // Clicking 'Home' correctly sets user to top of page
      var homeLink = document.querySelector('.nav-link.home-link');
      homeLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        var homeSection = document.querySelector('#home');
        var scrollToPosition = homeSection.offsetTop;
        // Smoothly scroll to the top of the 'Home' section
        (window.scrollTo({
          top: scrollToPosition
        }));
      });

});