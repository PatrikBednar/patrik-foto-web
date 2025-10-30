// Počkáme, až se načte základní struktura DOM
document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
    // Kód pro rolovací navigaci
const navbar = document.querySelector('.navbar');
const heroSection = document.getElementById('hero'); // Zkusíme najít hlavní "hero" sekci

// Tuto logiku pro změnu navigace při scrollu spustíme, POUZE pokud na stránce existuje #hero
// (Tzn. spustí se jen na index.html, ale ne na portfolio.html)
if (heroSection) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

    // Kód pro hamburger menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainMenu = document.querySelector('.main-menu');

    if (hamburgerBtn && mainMenu) {

        // Funkce pro zavření menu
        function closeMenu() {
            mainMenu.classList.remove('mobile-menu-open');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            hamburgerBtn.setAttribute('aria-label', 'Otevřít menu');
        }

        // Funkce pro otevření menu
        function openMenu() {
            mainMenu.classList.add('mobile-menu-open');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            hamburgerBtn.setAttribute('aria-label', 'Zavřít menu');
        }

        // Přepínání menu kliknutím na hamburger
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Zabráníme, aby se klik hned přenesl na document
            if (mainMenu.classList.contains('mobile-menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Zavření menu po kliknutí na odkaz
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainMenu.classList.contains('mobile-menu-open')) {
                    closeMenu();
                }
            });
        });

        // Zavření menu při kliknutí mimo (na 'main' nebo 'footer')
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mainMenu.contains(event.target);
            const isClickOnHamburger = hamburgerBtn.contains(event.target);

            if (mainMenu.classList.contains('mobile-menu-open') && !isClickInsideMenu && !isClickOnHamburger) {
                closeMenu();
            }
        });

        // NOVÉ: Zavření menu při scrollu
        window.addEventListener('scroll', function() {
            if (mainMenu.classList.contains('mobile-menu-open')) {
                closeMenu();
            }
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
         // return; // Můžeme pokračovat i bez slideru, pokud by chyběl
    } else { // Spustíme logiku slideru, jen pokud jsou všechny prvky nalezeny

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
            if (slideImages[previousSlideIndex]) { // Pojistka
                slideImages[previousSlideIndex].classList.remove('active');
            }
            // Přidáme 'active' na nový obrázek
            if (slideImages[currentSlideIndex]) { // Pojistka
                slideImages[currentSlideIndex].classList.add('active');
            }


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
    } // Konec bloku "else" pro slider logiku


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