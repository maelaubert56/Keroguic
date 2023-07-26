const header = `
    <link rel="stylesheet" href="../css/header.css">
    <header>
        <div class="top_header">
            <p class="top_header_text">Ce site est actuellement en cours de développement... Pour plus d'informations, redez vous sur le <a href="https://www.facebook.com/www.keroguic.fr" style ="">Facebook</a> de la fête</p>
        </div>
        <div class="bottom_header">
            <div class="logo">
                <a href="index.html">
                    <img src="../img/assets/logo.jpg" alt="logo">
                    <span class="logo-text">Fête<br>des vieux<br>métiers</span>
                </a>
            </div>
            <ul class="menu">
                <li><a href="index.html">Accueil</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="map.html">La carte du site</a></li>
                <li><a href="404.html">Programme</a></li>
                <li><a href="galery.html">Galerie</a></li>
                <li><a href="apropos.html">A propos</a></li>
                
            </ul>
        </div>
    </header>
    <input type="checkbox" class="openSidebarMenu" id="openSidebarMenu">
    <label for="openSidebarMenu" class="sidebarIconToggle">
        <span class="spinner diagonal part-1"></span>
        <span class="spinner horizontal"></span>
        <span class="spinner diagonal part-2"></span>
    </label>
    <div id="sidebarMenu">
        <ul class="sidebarMenuInner">
            <li onclick="window.location.href='apropos.html'">Keroguic <span>A propos</span></li>
            <li onclick="window.location.href='blog.html'">Blog</li>
            <li onclick="window.location.href='map.html'">La carte du site</li>
            <li onclick="window.location.href='404.html'">Programme</li>
            <li onclick="window.location.href='galery.html'">Galerie</li>
        </ul>
    </div>
`;


document.addEventListener("DOMContentLoaded", function() {
    load_header();
    // wait for the header to be loaded
    setTimeout(function() {
        update_header();
    }, 100);

    window.addEventListener("resize", function(){
        update_header();
    })

    // if .openSidebarMenu is checked, disable the scroll on the body
    document.querySelector(".openSidebarMenu").addEventListener("change", function() {
        if (this.checked) {
            document.querySelector("body").style.overflow = "hidden";
        } else {
            document.querySelector("body").style.overflow = "auto";
        }
    })
})




function update_header(){
    /* if the text is too long, hide the top header */
    /* we show the top header to be able to calculate the width */
    document.querySelector(".top_header").style.display = "flex";
    if (document.querySelector(".top_header_text").offsetWidth +20 > document.querySelector(".top_header").offsetWidth){
        document.querySelector(".top_header").style.display = "none";
    }

    /* set the position of the toggle icon */
    let top_header_height = document.querySelector(".top_header").offsetHeight;
    let bottom_header_height = document.querySelector(".bottom_header").offsetHeight;
    let sidebarIconToggle_height = document.querySelector(".sidebarIconToggle").offsetHeight;
    document.querySelector(".sidebarIconToggle").style.top = (top_header_height + bottom_header_height/2) - sidebarIconToggle_height/2 + "px";
}

function load_header(){

    document.querySelector("body").insertAdjacentHTML("afterbegin", header);
    // add the class "active" to the current page
    let current_page = window.location.pathname.split("/").pop();

    let menu = document.querySelector(`.menu a[href="${current_page}"]`)
     if (menu != null) menu.classList.add("active");
    

}



