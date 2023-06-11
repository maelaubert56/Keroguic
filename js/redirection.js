// when the page is loaded, redirect to the page 'index.html' in 5 seconds ( and modify the value of the counter every second )
document.addEventListener("DOMContentLoaded", function() {
    var counter = 5;
    var interval = setInterval(function() {
        counter--;
        document.querySelector("#counter").innerHTML = counter.toString();
        if (counter === 0) {
            clearInterval(interval);
            window.location.href = "index.html";
        }
    }, 1000);
})

