
document.addEventListener("DOMContentLoaded", function() {

    setInterval(function() {
        const elements = document.getElementsByClassName("fade_in");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getBoundingClientRect().top < window.innerHeight) {
                elements[i].style.display = "flex";
                elements[i].classList.add("fadeinfromleft")
            }
        }
    }, 100);
});