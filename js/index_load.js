function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


document.addEventListener("DOMContentLoaded", function() {
    
    // animate the value counters
    const objs = document.getElementsByClassName("key_point");
    console.log(objs);
    for (let i = 0; i < objs.length; i++) {
        let max = parseInt(objs[i].getAttribute("data-max"));
        console.log(max);
        animateValue(objs[i].querySelector(".value"), 0, max, 1500)
    }
    
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

