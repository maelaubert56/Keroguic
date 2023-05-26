const footer = `
    <link rel="stylesheet" href="../css/footer.css">
    <footer class="footer">
        <div class = "text-footer">
            <h2>Copyright © 2023 - Fête des vieux métiers</h2>
            <h2>Site réalisé par Maël Aubert</h2>
        </div>
        <div class = "reseaux">
            <a href="https://www.facebook.com/www.keroguic.fr"><img src="../img/facebook.svg" alt="facebook"></a>
        </div>
    </footer>
`

function load_footer(){
    document.querySelector("body").insertAdjacentHTML("beforeend", footer);
}

document.addEventListener("DOMContentLoaded", function() {
    load_footer();
});