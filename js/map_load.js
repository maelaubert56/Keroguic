
document.addEventListener("DOMContentLoaded", function() {

    // animate the value counters
    const objs = document.getElementsByClassName("map_container");

    // animation when we scroll to the element
    // then check constantly if the element is on the screen
    setInterval(function() {
        // when an element is fully on the screen, show it with a fade in effect from left or right
        const elements = document.getElementsByClassName("fade_in");
        // remove from the list the elements that are already visible


        for (let i = 0; i < elements.length; i++) {
            if (elements[i].getBoundingClientRect().top < window.innerHeight) {
                elements[i].style.display = "flex";
                elements[i].classList.add("fadeinfromleft")
            }
        }
    }, 100);
});