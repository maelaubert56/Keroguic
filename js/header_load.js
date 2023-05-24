
document.addEventListener("DOMContentLoaded", function() {
    load_header();
})

window.addEventListener("resize", function(){
    load_header();
})


function load_header(){
    /* if the text is too long, hide the top header */
    /* we show the top header to be able to calculate the width */
    document.querySelector(".top_header").style.display = "flex";
    if (document.querySelector(".top_header_text").offsetWidth +20 > document.querySelector(".top_header").offsetWidth){
        document.querySelector(".top_header").style.display = "none";
    }

    /* set the height of the toggle icon */
    var top_header_height = document.querySelector(".top_header").offsetHeight;
    var bottom_header_height = document.querySelector(".bottom_header").offsetHeight;
    var sidebarIconToggle_height = document.querySelector(".sidebarIconToggle").offsetHeight;
    document.querySelector(".sidebarIconToggle").style.top = (top_header_height + bottom_header_height/2) - sidebarIconToggle_height/2 + "px";
}


