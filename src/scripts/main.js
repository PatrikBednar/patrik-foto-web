// Počkáme, až se načte základní struktura DOM
document.addEventListener("DOMContentLoaded", function() {
    
    // --- KÓD PRO PATIČKU ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
    
    // --- KÓD PRO NAVIGACI A SCROLL ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            });
        } else {
            navbar.classList.add('scrolled');
        }
    }

    // --- KÓD PRO HAMBURGER MENU ---
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
            if (mainMenu.classList.contains('mobile-menu-open')) closeMenu();
            else openMenu();
        });
        const menuLinks = mainMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainMenu.classList.contains('mobile-menu-open')) closeMenu();
            });
        });
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mainMenu.contains(event.target);
            const isClickOnHamburger = hamburgerBtn.contains(event.target);
            if (mainMenu.classList.contains('mobile-menu-open') && !isClickInsideMenu && !isClickOnHamburger) closeMenu();
        });
        window.addEventListener('scroll', function() {
            if (mainMenu.classList.contains('mobile-menu-open')) closeMenu();
        });
    }

    // --- KÓD PRO HERO SLIDER ---
    const slideImages = document.querySelectorAll('.hero-slide-img');
    const heroContent = document.querySelector('#hero .hero-content');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');

    if (slideImages.length > 0 && heroContent && prevBtn && nextBtn) {
        let currentSlideIndex = 0;
        const totalSlides = slideImages.length;
        let isTransitioning = false;
        let slideInterval; 

        function updateContentVisibility(index) {
            heroContent.style.opacity = (index === 0) ? '1' : '0';
        }
        function changeSlide(direction) {
            if (isTransitioning) return;
            isTransitioning = true;
            stopAutoSlide();
            const previousSlideIndex = currentSlideIndex;
            currentSlideIndex += direction;
            if (currentSlideIndex < 0) currentSlideIndex = totalSlides - 1;
            else if (currentSlideIndex >= totalSlides) currentSlideIndex = 0;
            updateContentVisibility(currentSlideIndex);
            if (slideImages[previousSlideIndex]) slideImages[previousSlideIndex].classList.remove('active');
            if (slideImages[currentSlideIndex]) slideImages[currentSlideIndex].classList.add('active');
            setTimeout(() => {
                isTransitioning = false;
                startAutoSlide(); 
            }, 600);
        }
        function startAutoSlide() {
            stopAutoSlide(); 
            slideInterval = setInterval(() => changeSlide(1), 5000); 
        }
        function stopAutoSlide() { clearInterval(slideInterval); }
        function initSlider() {
            slideImages.forEach((img, index) => {
                if (index === 0) img.classList.add('active');
                else img.classList.remove('active');
            });
            updateContentVisibility(currentSlideIndex);
            prevBtn.addEventListener('click', () => changeSlide(-1));
            nextBtn.addEventListener('click', () => changeSlide(1));
            startAutoSlide(); 
        }
        initSlider();
    } 

    // --- SPUŠTĚNÍ PORTFOLIA ---
    if (document.getElementById('portfolio-gallery')) {
        initPortfolioPage();
    }

}); // <-- Konec DOMContentLoaded

// --- FUNKCE PRO STRÁNKU PORTFOLIA ---
function initPortfolioPage() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const grid = document.querySelector('.gallery-grid'); 

    if (filterButtons.length === 0 || galleryItems.length === 0) return;

    // --- 1. MASONRY LAYOUT ---
    // Funkce pro náhodné přeházení prvků (Fisher-Yates shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Výměna prvků
        }
    }

    // Náhodně přeházet fotky při načtení stránky
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        const itemsArray = Array.from(galleryItems);
        shuffleArray(itemsArray);
        itemsArray.forEach(item => galleryGrid.appendChild(item));
    }

    function updateMasonryLayout() {
        const items = Array.from(document.querySelectorAll('.gallery-item')).filter(item => item.style.display !== 'none');
        
        if (!grid || items.length === 0) {
            if(grid) grid.style.height = 'auto';
            return;
        }

        const width = window.innerWidth;
        let colCount = 1; // Mobil
        if (width > 992) colCount = 3; // Desktop
        else if (width > 768) colCount = 2; // Tablet

        const gap = 15; 
        const colWidth = (grid.offsetWidth - ((colCount - 1) * gap)) / colCount;
        let colHeights = new Array(colCount).fill(0);

        items.forEach(item => {
            item.style.width = colWidth + 'px';
            
            const minHeight = Math.min(...colHeights);
            const colIndex = colHeights.indexOf(minHeight);

            item.style.top = minHeight + 'px';
            item.style.left = (colIndex * (colWidth + gap)) + 'px';

            colHeights[colIndex] += item.offsetHeight + gap;
        });

        grid.style.height = Math.max(...colHeights) + 'px';
    }

    // --- 2. FILTROVÁNÍ ---
    function filterGallery(filter) {
        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = ''; 
            } else {
                item.style.display = 'none'; 
            }
        });
    }

    function setActiveButton(filter) {
        filterButtons.forEach(button => {
            if (button.getAttribute('data-filter') === filter) button.classList.add('active');
            else button.classList.remove('active');
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            const filter = button.getAttribute('data-filter');
            const newHash = button.getAttribute('href');

            if (history.pushState) history.pushState(null, null, newHash);
            else location.hash = newHash;

            setActiveButton(filter);
            filterGallery(filter);
            
            // Přeuspořádat po krátké prodlevě (aby se stihlo překreslit DOM)
            setTimeout(updateMasonryLayout, 50); 
        });
    });

    const currentHash = window.location.hash || '#vse';
    const correspondingButton = document.querySelector(`.filter-btn[href="${currentHash}"]`);
    if (correspondingButton) {
        const filter = correspondingButton.getAttribute('data-filter');
        setActiveButton(filter);
        filterGallery(filter);
    }

    // --- SPUŠTĚNÍ MASONRY ---
    
    // 1. Ihned při startu (pro jistotu)
    updateMasonryLayout();

    // 2. Při změně velikosti okna
    window.addEventListener('resize', updateMasonryLayout);

    // 3. Až se načtou obrázky (DŮLEŽITÉ: Toto opraví překryvy, protože známe výšku)
    window.addEventListener('load', updateMasonryLayout);
    
    // 4. Pojistka: sledovat načítání jednotlivých obrázků v galerii
    const images = grid.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            updateMasonryLayout();
        } else {
            img.addEventListener('load', updateMasonryLayout);
        }
    });


    // --- 3. SCROLL FADES ---
    const filterButtonsContainer = document.querySelector('.filter-buttons');
    const filterButtonsWrapper = document.querySelector('.filter-buttons-wrapper');

    function checkScrollFades() {
        if (!filterButtonsContainer || !filterButtonsWrapper) return;
        const scrollLeft = filterButtonsContainer.scrollLeft;
        const scrollWidth = filterButtonsContainer.scrollWidth;
        const clientWidth = filterButtonsContainer.clientWidth;
        const scrollEndThreshold = 5; 

        if (scrollLeft > 0) filterButtonsWrapper.classList.add('is-scrollable-left');
        else filterButtonsWrapper.classList.remove('is-scrollable-left');

        if (scrollWidth - scrollLeft - clientWidth > scrollEndThreshold) filterButtonsWrapper.classList.add('is-scrollable-right');
        else filterButtonsWrapper.classList.remove('is-scrollable-right');
    }

    if (filterButtonsContainer) {
        filterButtonsContainer.addEventListener('scroll', checkScrollFades);
        window.addEventListener('resize', checkScrollFades);
        checkScrollFades();
    }

    // --- 4. LIGHTBOX ---
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
        let isAnimating = false; 
        let slideshowInterval = null; 
        let isPanning = false;
        let startX, startY, lastX, lastY;
        let transformX = 0, transformY = 0;
        let wasDragged = false; 

        function updateCurrentGallery() {
            currentGallery = [];
            document.querySelectorAll('.gallery-item').forEach((item) => {
                if (item.style.display !== 'none') { 
                    const link = item.querySelector('a'); 
                    if (link) {
                        currentGallery.push({
                            src: link.getAttribute('href'),
                            alt: link.getAttribute('data-alt') || 'Fotografie z portfolia'
                        });
                    }
                }
            });
        }

        function preloadImages(index) {
            for (let i = 1; i <= 5; i++) {
                const nextIndex = (index + i) % currentGallery.length;
                if (currentGallery[nextIndex]) { const imgNext = new Image(); imgNext.src = currentGallery[nextIndex].src; }
                const prevIndex = (index - i + currentGallery.length) % currentGallery.length;
                if (currentGallery[prevIndex]) { const imgPrev = new Image(); imgPrev.src = currentGallery[prevIndex].src; }
            }
        }

        function showImage(index) {
            if (index < 0 || index >= currentGallery.length) return;
            resetImageTransform();
            const imgData = currentGallery[index];
            lightboxImg.setAttribute('src', imgData.src);
            lightboxImg.setAttribute('alt', imgData.alt);
            currentImageIndex = index;
            updateCounter();
            preloadImages(index);
        }

        function openLightbox(index) {
            updateCurrentGallery();
            if (index >= 0 && index < currentGallery.length) {
                showImage(index);
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden'; 
            }
        }

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; 
            resetImageTransform(); 
            stopSlideshow(); 
        };

        function updateCounter() {
            if (lightboxCounter) lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
        }

        function toggleSlideshow() {
            if (slideshowInterval) stopSlideshow();
            else startSlideshow();
        }

        function startSlideshow() {
            const icon = lightboxPlay.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            lightboxPlay.setAttribute('aria-label', 'Pozastavit prezentaci');
            slideshowInterval = setTimeout(() => {
                slideshowNext(); 
                slideshowInterval = setInterval(slideshowNext, 5000); 
            }, 2000); 
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
            const onOutAnimationEnd = () => {
                showImage(newIndex);
                lightboxImg.classList.remove(outClass);
                lightboxImg.classList.add(inClass);
                const onInAnimationEnd = () => {
                    lightboxImg.classList.remove(inClass);
                    isAnimating = false;
                    lightboxImg.removeEventListener('animationend', onInAnimationEnd);
                };
                lightboxImg.addEventListener('animationend', onInAnimationEnd);
            };
            lightboxImg.addEventListener('animationend', onOutAnimationEnd, { once: true });
        }

        const showNext = (e) => { e.stopPropagation(); stopSlideshow(); const nextIndex = (currentImageIndex + 1) % currentGallery.length; animateAndChangeImage(nextIndex, 'slide-out-left', 'slide-in-from-right'); };
        const showPrev = (e) => { e.stopPropagation(); stopSlideshow(); const prevIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length; animateAndChangeImage(prevIndex, 'slide-out-right', 'slide-in-from-left'); };

        function resetImageTransform() {
            lightboxImg.classList.remove('zoomed');
            lightboxImg.style.transition = 'transform 0.3s ease'; 
            lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
            lightboxImg.style.cursor = 'zoom-in';
            transformX = 0; transformY = 0;
        }

        const toggleZoom = (e) => {
            e.stopPropagation(); 
            if (wasDragged) return;
            if (lightboxImg.classList.contains('zoomed')) { resetImageTransform(); } 
            else { lightboxImg.classList.add('zoomed'); lightboxImg.style.transform = 'scale(2)'; lightboxImg.style.cursor = 'grab'; }
        };

        const startPan = (e) => {
            if (!lightboxImg.classList.contains('zoomed')) return;
            e.preventDefault();
            isPanning = true;
            wasDragged = false; 
            startX = e.clientX - transformX;
            startY = e.clientY - transformY;
            lightboxImg.style.cursor = 'grabbing';
            lightboxImg.style.transition = 'none'; 
        };

        const pan = (e) => {
            if (!isPanning) return;
            e.preventDefault();
            wasDragged = true; 
            transformX = e.clientX - startX;
            transformY = e.clientY - startY;
            lightboxImg.style.transform = `scale(2) translate(${transformX}px, ${transformY}px)`;
        };

        const endPan = () => {
            if (!isPanning) return;
            isPanning = false;
            lightboxImg.style.cursor = 'grab';
            lightboxImg.style.transition = 'transform 0.3s ease'; 
            setTimeout(() => { wasDragged = false; }, 0);
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
        
        lightboxImg.addEventListener('mousedown', startPan);
        document.addEventListener('mousemove', pan); 
        document.addEventListener('mouseup', endPan);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                const fakeEvent = { stopPropagation: () => {} };
                if (e.key === 'Escape') closeLightbox();
                else if (e.key === 'ArrowRight') showNext(fakeEvent);
                else if (e.key === 'ArrowLeft') showPrev(fakeEvent);
            }
        });
    }
}

// --- KÓD PRO PRELOADER ---
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if(preloader) { 
        setTimeout(function() { preloader.classList.add('hidden'); }, 500);
        setTimeout(function() { preloader.style.display = 'none'; }, 1500);
    }
});