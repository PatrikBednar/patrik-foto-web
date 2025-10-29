// Počkáme, až se načte základní struktura DOM
document.addEventListener("DOMContentLoaded", function() {

    // Kód pro rolovací navigaci
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { 
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

});


// Počkáme, až se načte CELÁ stránka (včetně obrázků)
window.addEventListener('load', function() {
    
    // Najdeme si preloader
    const preloader = document.getElementById('preloader');
    
    // Po 1 sekundě spustíme mizení
    setTimeout(function() {
        preloader.classList.add('hidden');
    }, 500); // 1000ms = 1 sekunda

    // ZMĚNA ZDE: Po 2 sekundách preloader úplně skryjeme z DOM
    setTimeout(function() {
        preloader.style.display = 'none';
    }, 1500); // 2000ms = 2 sekundy (1s čekání + 1s mizení)

});