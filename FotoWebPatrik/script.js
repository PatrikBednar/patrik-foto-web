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

    // ======== HERO SLIDER LOGIKA ========
    const heroSection = document.getElementById('hero'); // Cílíme na celou sekci #hero
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');

    // Místo jednoho obrázku, pole obrázků pro slider
    const slides = [
        'images/slide/slide-01.webp',
        'images/slide/slide-02.webp', // nebo 'images/slide/slide-02.jpg' pokud preferuješ jpg
        'images/slide/slide-023.webp',
        'images/slide/slide-03.webp',
        'images/slide/slide-04.webp',
        'images/slide/slide-05.webp',
        'images/slide/slide-06.webp',
        'images/slide/slide-07.webp',
        'images/slide/slide-08.webp'
        // Můžeš si upravit pořadí nebo odstranit obrázky podle potřeby
    ];
    let currentSlideIndex = 0;

    function changeSlide(direction) {
        currentSlideIndex += direction;

        // Zacyklení indexu
        if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        } else if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }

        // Plynulá změna background-image na #hero s fade efektem
        if (heroSection) { // Kontrola, jestli heroSection existuje
             heroSection.style.opacity = 0; // Začne mizet

             setTimeout(() => {
                 heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${slides[currentSlideIndex]}')`;
                 heroSection.style.opacity = 1; // Zobrazí se nový obrázek
             }, 300); // 300ms = doba pro fade-out (musí odpovídat transition v CSS)
        }
    }

    function initSlider() {
        // Přidání posluchačů na kliknutí (až když prvky existují)
        if (prevBtn && nextBtn) { // Kontrola, jestli se šipky našly
            prevBtn.addEventListener('click', () => changeSlide(-1));
            nextBtn.addEventListener('click', () => changeSlide(1));
        } else {
            console.error("Slider buttons not found!"); // Výpis chyby, pokud se nenajdou
        }

        // Nastavení výchozího obrázku, pokud není v CSS (pro jistotu)
         if (heroSection) {
            // Zajistíme, že transition pro opacity je nastaveno
            heroSection.style.transition = 'background-image 0s 0.3s, opacity 0.3s ease-out';
            // Nastavíme výchozí obrázek
            heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${slides[currentSlideIndex]}')`;
         }
    }

    // Inicializujeme slider
    initSlider();

}); // <-- Konec DOMContentLoaded listeneru


// Počkáme, až se načte CELÁ stránka (včetně obrázků)
window.addEventListener('load', function() {

    // Najdeme si preloader
    const preloader = document.getElementById('preloader');

    // Po 0.5 sekundě spustíme mizení (podle tvého kódu)
    setTimeout(function() {
        if (preloader) {
             preloader.classList.add('hidden');
        }
    }, 500);

    // Po 1.5 sekundě preloader úplně skryjeme z DOM (podle tvého kódu)
    setTimeout(function() {
        if (preloader) {
           preloader.style.display = 'none';
        }
    }, 1500);

}); // <-- Konec load listeneru

//