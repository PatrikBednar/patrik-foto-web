// script.js (ES5)

document.addEventListener('DOMContentLoaded', function () {
  // =========================
  // 1) HERO SLIDER (ÚVOD)
  // =========================
  var heroImages = [
    'images/slide/slide-01.webp',
    'images/slide/slide-02.webp',
    'images/slide/slide-03.webp',
    'images/slide/slide-04.webp',
    'images/slide/slide-05.webp',
    'images/slide/slide-06.webp',
    'images/slide/slide-07.webp',
    'images/slide/slide-08.webp'
  ];

  var heroSection = document.querySelector('.hero-section');
  var heroDotsContainer = document.querySelector('.hero-dots');
  var prevArrow = document.getElementById('prevArrow');
  var nextArrow = document.getElementById('nextArrow');

  var AUTO_INTERVAL_MS = 6000;
  var autoTransitionDuration = '1s';
  var manualTransitionDuration = '0.2s';

  if (heroSection && heroDotsContainer) {
    var currentImageIndex = 0;
    var intervalId;
    var heroCache = {};

    for (var iPre = 0; iPre < heroImages.length; iPre++) {
      var im = new Image();
      im.src = heroImages[iPre];
      heroCache[heroImages[iPre]] = im;
    }

    function createHeroDots() {
      heroDotsContainer.innerHTML = '';
      for (var i = 0; i < heroImages.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'hero-dot';
        dot.setAttribute('data-index', i);
        (function (idx) {
          dot.addEventListener('click', function () {
            clearInterval(intervalId);
            currentImageIndex = idx;
            updateHeroSection('manual');
            intervalId = startAuto();
          }, false);
        })(i);
        heroDotsContainer.appendChild(dot);
      }
    }

    function updateHeroSection(source) {
      heroSection.style.transition =
        (source === 'manual')
          ? ('background-image ' + manualTransitionDuration + ' ease-in-out')
          : ('background-image ' + autoTransitionDuration + ' ease-in-out');

      if (currentImageIndex >= heroImages.length) currentImageIndex = 0;
      if (currentImageIndex < 0) currentImageIndex = heroImages.length - 1;

      var url = heroImages[currentImageIndex];
      var cached = heroCache[url];

      if (cached && cached.complete) {
        heroSection.style.backgroundImage = "url('" + url + "')";
      } else {
        cached = new Image();
        cached.src = url;
        cached.onload = function () {
          heroSection.style.backgroundImage = "url('" + url + "')";
        };
        heroCache[url] = cached;
      }

      var allDots = heroDotsContainer.querySelectorAll('.hero-dot');
      for (var i = 0; i < allDots.length; i++) {
        if (i === currentImageIndex) allDots[i].classList.add('active');
        else allDots[i].classList.remove('active');
      }
    }

    function changeBackgroundImage() {
      currentImageIndex = (currentImageIndex + 1) % heroImages.length;
      updateHeroSection('auto');
    }

    function startAuto() {
      return setInterval(changeBackgroundImage, AUTO_INTERVAL_MS);
    }

    createHeroDots();
    updateHeroSection('auto');
    intervalId = startAuto();

    if (prevArrow && nextArrow) {
      prevArrow.addEventListener('click', function () {
        clearInterval(intervalId);
        currentImageIndex--;
        updateHeroSection('manual');
        intervalId = startAuto();
      }, false);
      nextArrow.addEventListener('click', function () {
        clearInterval(intervalId);
        currentImageIndex++;
        updateHeroSection('manual');
        intervalId = startAuto();
      }, false);
    }
  }

  // =========================
  // 2) SCHOVÁNÍ HLAVIČKY A NAVIGACE (NOVÉ ŘEŠENÍ)
  // =========================
  (function () {
    var header = document.querySelector('header');
    if (!header) return;

    var lastY = window.pageYOffset;
    var manualScroll = false; // "Vlajka", která pozná, jestli skrolujeme po kliknutí
    
    // Funkce, která schovává lištu POUZE při ručním skrolování
    var handleManualScroll = function() {
        if (manualScroll) return; // Pokud bylo skrolování spuštěno klikem, nic nedělej

        var y = window.pageYOffset;
        if (y > lastY && y > header.offsetHeight) {
            header.classList.add('hidden');
        } else if (y < lastY) {
            header.classList.remove('hidden');
        }
        lastY = y;
    };

    window.addEventListener('scroll', handleManualScroll, { passive: true });

    // Funkce pro kliknutí na odkaz v menu
    var navLinks = document.querySelectorAll('nav a[href^="#"]');
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener('click', function(e) {
            e.preventDefault(); // Zastavíme výchozí chování odkazu

            var targetId = this.getAttribute('href');
            var targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            manualScroll = true; // Zvedneme "vlajku", že přebíráme kontrolu
            header.classList.remove('hidden'); // Zajistíme, že lišta je vidět

            // Plynule doskrolujeme na místo určení
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Počkáme, až animace doběhne, a vrátíme kontrolu zpět ručnímu skrolování
            setTimeout(function() {
                lastY = window.pageYOffset; // Důležité: aktualizujeme pozici
                manualScroll = false;
            }, 800);
        });
    }
  })();
  
  // =========================
  // 3) SCROLLSPY NAVIGACE (beze změny)
  // =========================
  (function () {
    var sections = document.querySelectorAll('section');
    var navLinks = document.querySelectorAll('nav ul li a');
    var headerHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
    var headerHeight = parseFloat(headerHeightVar) || 90;

    function highlightNavLink() {
      var currentSectionId = '';
      var activationOffset = 150;
      for (var i = sections.length - 1; i >= 0; i--) {
        var section = sections[i];
        if (section.getBoundingClientRect().top <= headerHeight + activationOffset) {
          currentSectionId = section.getAttribute('id');
          break;
        }
      }
      if (currentSectionId === '' && window.pageYOffset < headerHeight + activationOffset) {
        currentSectionId = 'uvod';
      }
      for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].classList.remove('active-link');
      }
      for (var k = 0; k < navLinks.length; k++) {
        var hrefId = navLinks[k].getAttribute('href').substring(1);
        if (hrefId === currentSectionId) {
          navLinks[k].classList.add('active-link');
        }
      }
    }

    highlightNavLink();
    window.addEventListener('scroll', highlightNavLink, { passive: true });
    window.addEventListener('resize', highlightNavLink, false);
    window.addEventListener('orientationchange', highlightNavLink, false);
    for (var iNav = 0; iNav < navLinks.length; iNav++) {
      navLinks[iNav].addEventListener('click', function () {
        setTimeout(highlightNavLink, 100);
      }, false);
    }
  })();

  // =========================
  // 4) MASONRY (PORTFOLIO) + imagesLoaded
  // =========================
  (function () {
    var gallery = document.querySelector('.gallery');
    if (gallery && typeof imagesLoaded !== 'undefined' && typeof Masonry !== 'undefined') {
      imagesLoaded(gallery, function () {
        var msnry = new Masonry(gallery, {
          itemSelector: '.gallery-item',
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer',
          percentPosition: true
        });

        imagesLoaded(gallery).on('progress', function () {
          msnry.layout();
        });
      });
    }
  })();

  // =========================
  // 5) HAMBURGER MENU (MOBIL)
  // =========================
  (function () {
    var menuToggle = document.getElementById('mobile-menu');
    var navList = document.getElementById('main-nav');
    if (!(menuToggle && navList)) return;

    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('open');
      navList.classList.toggle('open');
    }, false);

    var navLinksMobile = navList.querySelectorAll('a');
    for (var i = 0; i < navLinksMobile.length; i++) {
      navLinksMobile[i].addEventListener('click', function () {
        if (navList.classList.contains('open')) {
          menuToggle.classList.remove('open');
          navList.classList.remove('open');
        }
      }, false);
    }
  })();

  // =========================
  // 6) SLUŽBY – TEČKY (MOBILNÍ SLIDER)
  // =========================
  (function () {
    var list = document.querySelector('#sluzby .sluzby-list');
    var items = Array.prototype.slice.call(document.querySelectorAll('#sluzby .sluzba'));
    var dotsWrap = document.querySelector('#sluzby .slider-dots-mobile');

    if (!(list && items.length)) return;

    var dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (var d = 0; d < items.length; d++) {
        var dot = document.createElement('span');
        dot.className = 'slider-dot';
        (function (idx) {
          dot.addEventListener('click', function () {
            var target = items[idx];
            if (!target) return;
            try {
              target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } catch (e) {
              var targetCenter = target.offsetLeft + target.offsetWidth / 2;
              var containerCenter = list.clientWidth / 2;
              var to = targetCenter - containerCenter;
              if (list.scrollTo) list.scrollTo({ left: to, behavior: 'smooth' });
              else list.scrollLeft = to;
            }
          }, false);
        })(d);
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    }

    function setActive(index) {
      if (!dots.length) return;
      for (var i = 0; i < dots.length; i++) {
        if (i === index) dots[i].classList.add('active');
        else dots[i].classList.remove('active');
      }
    }
    setActive(0);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isIntersecting) {
            var idx = -1;
            for (var k = 0; k < items.length; k++) if (items[k] === entry.target) { idx = k; break; }
            if (idx > -1) setActive(idx);
          }
        }
      }, {
        root: list,
        threshold: 0.35,
        rootMargin: '0px 12% 0px 12%'
      });

      for (var ob = 0; ob < items.length; ob++) io.observe(items[ob]);
    } else {
      var ticking = false;
      list.addEventListener('scroll', function () {
        if (!ticking) {
          (window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); })(function () {
            var containerLeft = list.scrollLeft;
            var center = containerLeft + list.clientWidth / 2;
            var best = 0, min = Infinity;
            for (var i = 0; i < items.length; i++) {
              var c = items[i].offsetLeft + items[i].offsetWidth / 2;
              var d = Math.abs(c - center);
              if (d < min) { min = d; best = i; }
            }
            setActive(best);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  })();
});