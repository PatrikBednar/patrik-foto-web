// Počkáme, až se načte celá stránka
document.addEventListener("DOMContentLoaded", function() {

    // Najdeme si naši navigaci (header)
    const navbar = document.querySelector('.navbar');

    // Přidáme "posluchače" na událost rolování
    window.addEventListener('scroll', function() {
        
        // Zjistíme, jak moc je odrolováno shora
        if (window.scrollY > 50) { 
            // Pokud je to víc než 50px, přidáme třídu .scrolled
            navbar.classList.add('scrolled');
        } else {
            // Jinak ji odebereme
            navbar.classList.remove('scrolled');
        }
    });
});