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
            var activationOffset = 70;

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
});
