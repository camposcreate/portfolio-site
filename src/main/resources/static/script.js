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