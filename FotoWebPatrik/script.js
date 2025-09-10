document.addEventListener('DOMContentLoaded', function () {

    // --- KÓD PRO HERO SLIDER (ÚVODNÍ OBRÁZKY) ---
    const heroImages = [
        'images/slide/slide-01.webp',
        'images/slide/slide-03.webp',
        'images/slide/slide-05.webp',
        'images/slide/slide-04.webp',
        'images/slide/slide-02.webp',
        'images/slide/slide-06.webp',
        'images/slide/slide-07.webp'
    ];

    const heroSection = document.querySelector('.hero-section');
    const heroDotsContainer = document.querySelector('.hero-dots');
    const prevArrow = document.getElementById('prevArrow');
    const nextArrow = document.getElementById('nextArrow');

    // Define transition durations
    const autoTransitionDuration = '1s'; // Délka přechodu pro automatické střídání
    const manualTransitionDuration = '0.3s'; // Délka přechodu pro manuální kliknutí

    if (heroSection && heroDotsContainer) {
        let currentImageIndex = 0;
        let intervalId; // Pro uložení ID intervalu

        // Funkce pro vytvoření teček
        function createHeroDots() {
            heroDotsContainer.innerHTML = '';
            heroImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('hero-dot');
                dot.dataset.index = index;
                dot.addEventListener('click', () => {
                    clearInterval(intervalId); // Zastavíme automatické střídání
                    currentImageIndex = index;
                    updateHeroSection('manual'); // Voláme s parametrem 'manual'
                    intervalId = setInterval(changeBackgroundImage, 10000); // Znovu spustíme automatické střídání
                });
                heroDotsContainer.appendChild(dot);
            });
        }

        // Funkce pro aktualizaci pozadí a teček
        function updateHeroSection(source = 'auto') {
            // Nastavíme délku přechodu podle zdroje změny
            if (source === 'manual') {
                heroSection.style.transition = `background-image ${manualTransitionDuration} ease-in-out`;
            } else {
                heroSection.style.transition = `background-image ${autoTransitionDuration} ease-in-out`;
            }

            // Zajistíme, že index je v platném rozsahu
            if (currentImageIndex >= heroImages.length) {
                currentImageIndex = 0;
            } else if (currentImageIndex < 0) {
                currentImageIndex = heroImages.length - 1;
            }

            const newImageUrl = heroImages[currentImageIndex];

            // Vytvoříme dočasný obrázek, abychom zajistili jeho načtení
            const img = new Image();
            img.src = newImageUrl;

            // Až se obrázek načte, změníme pozadí
            img.onload = function () {
                heroSection.style.backgroundImage = `url('${img.src}')`;
            };
            img.onerror = function () {
                console.error(`Obrázek se nepodařilo načíst: ${newImageUrl}`);
            };

            // Aktualizujeme aktivní tečku
            const allDots = heroDotsContainer.querySelectorAll('.hero-dot');
            allDots.forEach((dot, idx) => {
                if (idx === currentImageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Funkce pro změnu pozadí (volaná intervalem)
        function changeBackgroundImage() {
            currentImageIndex = (currentImageIndex + 1) % heroImages.length;
            updateHeroSection('auto'); // Voláme s parametrem 'auto'
        }

        // Inicializace hero slideru:
        createHeroDots(); // Vytvoříme tečky
        updateHeroSection('auto'); // Nastavíme první obrázek a aktivní tečku

        // Spustíme automatické střídání
        intervalId = setInterval(changeBackgroundImage, 10000);

        // Kód pro klikání na šipky
        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                clearInterval(intervalId); // Zastavíme automatické střídání
                currentImageIndex--;
                updateHeroSection('manual');
                intervalId = setInterval(changeBackgroundImage, 10000); // Znovu spustíme automatické střídání
            });

            nextArrow.addEventListener('click', () => {
                clearInterval(intervalId); // Zastavíme automatické střídání
                currentImageIndex++;
                updateHeroSection('manual');
                intervalId = setInterval(changeBackgroundImage, 10000); // Znovu spustíme automatické střídání
            });
        }
    }


    // --- KÓD PRO SCROLLSPY NAVIGACI A MASONRY ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));

    // Funkce pro zvýraznění aktivního odkazu v navigaci
    function highlightNavLink() {
        let currentSectionId = '';
        const activationOffset = 150; // Offset pro dřívější aktivaci sekce

        // Procházíme sekce odspodu nahoru
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            // Pozice sekce vzhledem k viewportu
            const sectionTopInViewport = section.getBoundingClientRect().top;

            // Pokud je horní hrana sekce dostatečně blízko vrcholu viewportu (nebo už za ním)
            if (sectionTopInViewport <= headerHeight + activationOffset) {
                currentSectionId = section.getAttribute('id');
                break; // Najdeme první takovou sekci a skončíme
            }
        }

        // Speciální případ pro úplný začátek stránky (sekce "uvod")
        if (currentSectionId === '' && window.pageYOffset < headerHeight + activationOffset) {
            currentSectionId = 'uvod';
        }

        // Odebereme 'active-link' ze všech odkazů
        navLinks.forEach(link => {
            link.classList.remove('active-link');
        });

        // Přidáme 'active-link' k aktuálnímu aktivnímu odkazu
        navLinks.forEach(link => {
            const hrefId = link.getAttribute('href').substring(1); // Získá ID bez '#'
            if (hrefId === currentSectionId) {
                link.classList.add('active-link');
            }
        });
    }

    // --- KÓD PRO MASONRY GALERII ---
    const galleryContainer = document.querySelector('.gallery');
    let msnry; // Proměnná pro instanci Masonry

    // Funkce pro inicializaci/aktualizaci Masonry
    function initializeMasonry() {
        if (galleryContainer) {
            imagesLoaded(galleryContainer, function () {
                if (msnry) { // Pokud už Masonry existuje, zničíme ho, aby se správně inicializoval znovu
                    msnry.destroy();
                }
                msnry = new Masonry(galleryContainer, {
                    itemSelector: '.gallery-item',
                    columnWidth: '.gallery-item',
                    gutter: 16,
                    percentPosition: true,
                    transitionDuration: '0.4s'
                });
                msnry.layout(); // Přepočítáme rozvržení po inicializaci
                highlightNavLink(); // Aktualizujeme navigaci (protože se mohla změnit výška sekce)
            });
        }
    }

    // Inicializace Masonry a highlightNavLink při načtení stránky
    initializeMasonry(); // Vytvoří a rozvrhne Masonry
    highlightNavLink(); // Nastaví počáteční aktivní odkaz

    // Listenery pro události, které mohou ovlivnit rozložení nebo pozici scrollu
    window.addEventListener('resize', () => {
        initializeMasonry(); // Přepočítá Masonry při změně velikosti okna
        highlightNavLink(); // Aktualizuje navigaci
    });
    window.addEventListener('orientationchange', () => {
        initializeMasonry(); // Přepočítá Masonry při změně orientace mobilu
        highlightNavLink(); // Aktualizuje navigaci
    });

    // Spustíme funkci vždy, když uživatel scrolluje
    window.addEventListener('scroll', highlightNavLink);

    // Zajištění okamžitého zvýraznění po kliknutí na navigační odkaz
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            // Použijte setTimeout, aby se highlightNavLink spustil až po dokončení scrollu prohlížeče
            setTimeout(() => {
                highlightNavLink();
            }, 100); // Malá prodleva, aby se element stihl posunout
        });
    });


    // --- KÓD PRO HAMBURGER MENU (MOBILNÍ NAVIGACE) ---
    const menuToggle = document.getElementById('mobile-menu');
    const navList = document.getElementById('main-nav');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('open'); // Přepne třídu pro animaci hamburgeru
            navList.classList.toggle('open'); // Přepne třídu pro zobrazení/skrytí navigace
        });

        // Zavření menu po kliknutí na odkaz v mobilní navigaci
        const navLinksMobile = navList.querySelectorAll('a');
        navLinksMobile.forEach(link => {
            link.addEventListener('click', function() {
                if (navList.classList.contains('open')) { // Pokud je menu otevřené
                    menuToggle.classList.remove('open'); // Zavře hamburger animaci
                    navList.classList.remove('open'); // Skryje navigaci
                }
            });
        });
    }
});