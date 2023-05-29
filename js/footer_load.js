const footer = `
    <link rel="stylesheet" href="../css/footer.css">
    <div class="partenaires">
        <h2>Nos Partenaires</h2>
        <div class = "partenaires-img fade_in">
                <a href="html://www.ouest-france.fr"><img src="../img/assets/logo-ouest-france.png" alt="logo ouest france"></a>
                <a href="https://www.mairie-baud.fr/"><img src="../img/assets/logo-baud.png" alt="logo mairie de baud"></a>
                <a href="https://www.letelegramme.fr/"><img src="../img/assets/logo-le-telegramme.jpg" alt="logo du telegramme"></a>
            </div>
    </div>
    <footer class="footer">
        <div class = "text-footer">
            <h2>Copyright © 2023 - Fête des vieux métiers</h2>
            <h2>Site réalisé par Maël Aubert</h2>
        </div>
        <div class = "reseaux">
            <a href="https://www.facebook.com/www.keroguic.fr"><img src="../img/assets/facebook.svg" alt="facebook"></a>
        </div>
    </footer>
`

function load_footer(){
    document.querySelector("body").insertAdjacentHTML("beforeend", footer);
}

document.addEventListener("DOMContentLoaded", function() {
    load_footer();
});