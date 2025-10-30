// Počkáme, až se načte základní struktura DOM
document.addEventListener("DOMContentLoaded", function() {
    
    // --- KÓD PRO PATIČKU (Běží všude) ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
    
    // --- KÓD PRO NAVIGACI A SCROLL (Běží všude) ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Zjistíme, jestli jsme na hlavní stránce (má #hero) nebo jinde
        const heroSection = document.getElementById('hero');
        
        if (heroSection) {
            // Jsme na hlavní stránce -> měníme navigaci podle scrollu
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        } else {
            // Jsme na jiné stránce (portfolio.html) -> navigace je rovnou "scrolled"
            navbar.classList.add('scrolled');
        }
    }

    // --- KÓD PRO HAMBURGER MENU (Běží všude) ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainMenu = document.querySelector('.main-menu');

    if (hamburgerBtn && mainMenu) {

        function closeMenu() {
            mainMenu.classList.remove('mobile-menu-open');
            hamburgerBtn.classList.remove('is-active');
            hamburgerBtn.setAttribute('aria-label', 'Otevřít menu');
        }

        function openMenu() {
            mainMenu.classList.add('mobile-menu-open');
            hamburgerBtn.classList.add('is-active');
            hamburgerBtn.setAttribute('aria-label', 'Zavřít menu');
        }

        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mainMenu.classList.contains('mobile-menu-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainMenu.classList.contains('mobile-menu-open')) {
                    closeMenu();
                }
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mainMenu.contains(event.target);
            const isClickOnHamburger = hamburgerBtn.contains(event.target);
            if (mainMenu.classList.contains('mobile-menu-open') && !isClickInsideMenu && !isClickOnHamburger) {
                closeMenu();
            }
        });

        window.addEventListener('scroll', function() {
            if (mainMenu.classList.contains('mobile-menu-open')) {
                closeMenu();
            }
        });
    }

    // --- KÓD PRO HERO SLIDER (Spustí se jen na index.html) ---
    const slideImages = document.querySelectorAll('.hero-slide-img');
    const heroContent = document.querySelector('#hero .hero-content');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');

    // Spustíme logiku slideru, jen pokud jsou VŠECHNY prvky nalezeny
    if (slideImages.length > 0 && heroContent && prevBtn && nextBtn) {

        let currentSlideIndex = 0;
        const totalSlides = slideImages.length;
        let isTransitioning = false;

        function updateContentVisibility(index) {
            heroContent.style.opacity = (index === 0) ? '1' : '0';
        }

        function changeSlide(direction) {
            if (isTransitioning) return;
            isTransitioning = true;

            const previousSlideIndex = currentSlideIndex;
            currentSlideIndex += direction;

            if (currentSlideIndex < 0) {
                currentSlideIndex = totalSlides - 1;
            } else if (currentSlideIndex >= totalSlides) {
                currentSlideIndex = 0;
            }

            updateContentVisibility(currentSlideIndex);

            if (slideImages[previousSlideIndex]) {
                slideImages[previousSlideIndex].classList.remove('active');
            }
            if (slideImages[currentSlideIndex]) {
                slideImages[currentSlideIndex].classList.add('active');
            }

            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }

        function initSlider() {
            slideImages.forEach((img, index) => {
                if (index === 0) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
            updateContentVisibility(currentSlideIndex);
            prevBtn.addEventListener('click', () => changeSlide(-1));
            nextBtn.addEventListener('click', () => changeSlide(1));
        }

        initSlider();
    } // Konec bloku "if" pro slider logiku

    // --- KÓD PRO PORTFOLIO PAGE (Spustí se jen na portfolio.html) ---
    if (document.getElementById('portfolio-gallery')) {
        initPortfolioPage();
    }

}); // <-- Konec DOMContentLoaded

// --- KÓD PRO STRÁNKU PORTFOLIA (Spustí se jen na portfolio.html) ---
function initPortfolioPage() {
    // --- ČÁST 1: LOGIKA FILTROVÁNÍ GALERIE ---
            
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Pokud nenajdeme tlačítka, nemá smysl pokračovat
    if (filterButtons.length === 0 || galleryItems.length === 0) {
        return;
    }

    function filterGallery(filter) {
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function setActiveButton(filter) {
        filterButtons.forEach(button => {
            if (button.getAttribute('data-filter') === filter) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const filter = button.getAttribute('data-filter');
            const newHash = button.getAttribute('href');

            if (history.pushState) {
                history.pushState(null, null, newHash);
            } else {
                location.hash = newHash;
            }

            setActiveButton(filter);
            filterGallery(filter);
        });
    });

    const currentHash = window.location.hash || '#vse';
    const correspondingButton = document.querySelector(`.filter-btn[href="${currentHash}"]`);
    
    if (correspondingButton) {
        const filter = correspondingButton.getAttribute('data-filter');
        setActiveButton(filter);
        filterGallery(filter);
    }

    // --- ČÁST 2: LOGIKA PRO LIGHTBOX ---

    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const lightboxCounter = lightbox.querySelector('.lightbox-counter');
        const lightboxPlay = lightbox.querySelector('.lightbox-play');

        let currentImageIndex = 0;
        let currentGallery = [];
        let isAnimating = false; // Zabrání překlikávání během animace
        let slideshowInterval = null; // Pro ukládání intervalu prezentace

        function updateCurrentGallery() {
            currentGallery = [];
            document.querySelectorAll('.gallery-item').forEach((item) => {
                if (item.style.display !== 'none') { // Zpracujeme jen viditelné položky
                    const link = item.querySelector('a'); // Cílíme na jakýkoliv odkaz uvnitř
                    if (link) {
                        currentGallery.push({
                            src: link.getAttribute('href'),
                            alt: link.getAttribute('data-alt') || 'Fotografie z portfolia'
                        });
                    }
                }
            });
        }

        function showImage(index) {
            if (index < 0 || index >= currentGallery.length) return;
            
            const imgData = currentGallery[index];
            lightboxImg.setAttribute('src', imgData.src);
            lightboxImg.setAttribute('alt', imgData.alt);
            currentImageIndex = index;
            lightboxImg.classList.remove('zoomed');
            updateCounter();
        }

        function openLightbox(index) {
            updateCurrentGallery();
            if (index >= 0 && index < currentGallery.length) {
                showImage(index);
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden'; // Zabrání scrollování stránky pod lightboxem
            }
        }

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; // Obnoví scrollování
            lightboxImg.setAttribute('src', '');
            lightboxImg.classList.remove('zoomed');
            stopSlideshow(); // Zastaví prezentaci při zavření
        };

        function updateCounter() {
            if (lightboxCounter) {
                lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
            }
        }

        function toggleSlideshow() {
            if (slideshowInterval) {
                stopSlideshow();
            } else {
                startSlideshow();
            }
        }

        function startSlideshow() {
            const icon = lightboxPlay.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            lightboxPlay.setAttribute('aria-label', 'Pozastavit prezentaci');
            
            // Počkáme 2 sekundy, než se spustí první přechod
            slideshowInterval = setTimeout(() => {
                slideshowNext(); // První přechod
                slideshowInterval = setInterval(slideshowNext, 5000); // Další přechody každých 5s
            }, 2000); // 2 sekundy prodleva
        }
        function slideshowNext() {
            animateAndChangeImage((currentImageIndex + 1) % currentGallery.length, 'slide-out-left', 'slide-in-from-right');
        }

        function stopSlideshow() {
            if (!slideshowInterval) return;
            clearInterval(slideshowInterval);
            slideshowInterval = null;
            const icon = lightboxPlay.querySelector('i');
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            lightboxPlay.setAttribute('aria-label', 'Spustit prezentaci');
        }
        
        function animateAndChangeImage(newIndex, outClass, inClass) {
            if (isAnimating) return;
            isAnimating = true;

            lightboxImg.classList.add(outClass);

            const onAnimationEnd = () => {
                lightboxImg.classList.remove(outClass, inClass);
                showImage(newIndex);
                lightboxImg.classList.add(inClass);

                lightboxImg.addEventListener('animationend', () => {
                    lightboxImg.classList.remove(inClass);
                    isAnimating = false;
                }, { once: true });
            };

            lightboxImg.addEventListener('animationend', onAnimationEnd, { once: true });
        }

        const showNext = (e) => {
            e.stopPropagation();
            stopSlideshow(); // Ruční proklik zastaví automatickou prezentaci
            const nextIndex = (currentImageIndex + 1) % currentGallery.length;
            animateAndChangeImage(nextIndex, 'slide-out-left', 'slide-in-from-right');
        };
        
        const showPrev = (e) => {
            e.stopPropagation();
            stopSlideshow(); // Ruční proklik zastaví automatickou prezentaci
            const prevIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            animateAndChangeImage(prevIndex, 'slide-out-right', 'slide-in-from-left');
        };

        const toggleZoom = (e) => {
            e.stopPropagation(); // Zabrání zavření lightboxu
            lightboxImg.classList.toggle('zoomed');
        };

        document.querySelectorAll('.gallery-item a').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                updateCurrentGallery(); 
                const galleryIndex = currentGallery.findIndex(item => item.src === link.getAttribute('href'));
                if (galleryIndex !== -1) openLightbox(galleryIndex);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNext);
        lightboxPrev.addEventListener('click', showPrev);
        lightbox.addEventListener('click', closeLightbox);
        lightboxPlay.addEventListener('click', (e) => { e.stopPropagation(); toggleSlideshow(); });
        lightboxImg.addEventListener('click', toggleZoom);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                // Vytvoříme falešný event objekt, abychom mohli znovu použít existující funkce
                const fakeEvent = { stopPropagation: () => {} };

                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowRight') {
                    showNext(fakeEvent);
                }
                else if (e.key === 'ArrowLeft') {
                    showPrev(fakeEvent);
                }
            }
        });
    }
}

// --- KÓD PRO PRELOADER (Běží všude) ---
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if(preloader) { // Ověření, zda preloader existuje
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 500);
        setTimeout(function() {
           preloader.style.display = 'none';
        }, 1500);
    }
}); // <-- Konec load