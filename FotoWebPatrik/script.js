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

    // Kód pro hamburger menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainMenu = document.querySelector('.main-menu');

    if (hamburgerBtn && mainMenu) {
        hamburgerBtn.addEventListener('click', function() {
            mainMenu.classList.toggle('mobile-menu-open');
            const icon = hamburgerBtn.querySelector('i');
            if (mainMenu.classList.contains('mobile-menu-open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                hamburgerBtn.setAttribute('aria-label', 'Zavřít menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                hamburgerBtn.setAttribute('aria-label', 'Otevřít menu');
            }
        });

        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainMenu.classList.contains('mobile-menu-open')) {
                    mainMenu.classList.remove('mobile-menu-open');
                    // Vrátíme ikonu hamburgeru
                    const icon = hamburgerBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    hamburgerBtn.setAttribute('aria-label', 'Otevřít menu');

                    // ZMĚNA: Skryjeme tlačítko, pokud nejsme scrolled (aby se schovalo po kliku na odkaz nahoře)
                    if (!navbar.classList.contains('scrolled')) {
                         // Můžeme nechat CSS, ať to řeší samo - není potřeba nic přidávat
                         // hamburgerBtn.style.opacity = '0';
                         // hamburgerBtn.style.pointerEvents = 'none';
                    }
                }
            });
        });
    } else {
        console.error("Hamburger button or main menu not found!");
    }


    // ======== HERO SLIDER LOGIKA (CROSS-FADE EFEKT) ========
    const slideImages = document.querySelectorAll('.hero-slide-img'); // Všechny obrázky
    const heroContent = document.querySelector('#hero .hero-content'); // Obsah
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');

    if (!slideImages.length || !prevBtn || !nextBtn) {
         console.error("Slider elements not found!");
         return; // Pokud něco chybí, nic neděláme
    }

    let currentSlideIndex = 0;
    const totalSlides = slideImages.length;
    let isTransitioning = false; // Zabrání rychlému klikání

    // Skryjeme/zobrazíme obsah podle toho, jestli je to první slide
    function updateContentVisibility(index) {
        if (heroContent) {
            heroContent.style.opacity = (index === 0) ? '1' : '0';
        }
    }

    function changeSlide(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        const previousSlideIndex = currentSlideIndex;
        currentSlideIndex += direction;

        // Zacyklení indexu
        if (currentSlideIndex < 0) {
            currentSlideIndex = totalSlides - 1;
        } else if (currentSlideIndex >= totalSlides) {
            currentSlideIndex = 0;
        }

        // Aktualizujeme viditelnost obsahu
        updateContentVisibility(currentSlideIndex);

        // Odebereme 'active' z předchozího obrázku
        slideImages[previousSlideIndex].classList.remove('active');
        // Přidáme 'active' na nový obrázek
        slideImages[currentSlideIndex].classList.add('active');

        // Povolíme další kliknutí po skončení CSS transition (cca 600ms)
        setTimeout(() => {
            isTransitioning = false;
        }, 600); // Musí odpovídat transition v .hero-slide-img
    }

    function initSlider() {
         // Zajistíme, že na začátku je vidět jen první slide a obsah
        slideImages.forEach((img, index) => {
            if (index === 0) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        updateContentVisibility(currentSlideIndex); // Zobrazíme obsah pro první slide

        // Přidání posluchačů na kliknutí
        prevBtn.addEventListener('click', () => changeSlide(-1));
        nextBtn.addEventListener('click', () => changeSlide(1));
    }

    // Inicializujeme slider
    initSlider();

}); // <-- Konec DOMContentLoaded


// Počkáme, až se načte CELÁ stránka (včetně obrázků)
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    setTimeout(function() {
        if (preloader) {
             preloader.classList.add('hidden');
        }
    }, 500);
    setTimeout(function() {
        if (preloader) {
           preloader.style.display = 'none';
        }
    }, 1500);
}); // <-- Konec load