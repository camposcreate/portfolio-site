window.addEventListener("scroll", function () {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(function (link) {
    const sectionId = link.getAttribute("href");
    const section = document.querySelector(sectionId);

    const rect = section.getBoundingClientRect();
    if (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
