// home section element
const homeSection = document.querySelector('#header');

// scroll animation for home button
const observer2 = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // user scroll away
        if (!entry.isIntersecting) {
            // add class to list item
            const navHome = document.querySelector('#nav-home');
            navHome.classList.add('visible');
        } else {
            // user scrolled back
            // remove class to hide list item
            const navHome = document.querySelector('#nav-home');
            navHome.classList.remove('visible');
        }
    });
}, { threshold: 0.5 }); // threshold

// observe home section
observer2.observe(homeSection);

// scroll animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
}, { threshold: 0.5 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// open/close side menu for mobile view
function openmenu() {
    sidemenu.classList.add("menu-open");
}
function closemenu() {
    sidemenu.classList.remove("menu-open");
}

// contact form
document.addEventListener('DOMContentLoaded', function () {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwpAgKQRx-iSv9C7LEIhiey-h6HGEDa8Sk8ZaKz-BnWIJohVk4t642AywpOU1DTYpqu8A/exec';
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById("message-pop-up")

  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        msg.innerHTML = "Message sent successfully!"
        setTimeout(function(){
            console.log('Success!', response)
            msg.innerHTML = ""
        },4000) // 4 secs
        form.reset()
      })
      .catch(error => console.error('Error!', error.message));
  });
});