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

  // interval pouze na jednom místě
  var AUTO_INTERVAL_MS = 6000; // upravte dle potřeby
  var autoTransitionDuration = '1s';
  var manualTransitionDuration = '0.2s';

  if (heroSection && heroDotsContainer) {
    var currentImageIndex = 0;
    var intervalId;
    var heroCache = {};

    // přednačti všechny snímky (rychlejší reakce při kliknutí)
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
            intervalId = startAuto(); // znovu spustit auto interval
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
    intervalId = startAuto(); // setInterval s jednou konstantou (viz MDN) [citace v textu]

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
  // 2) SCHOVÁNÍ HLAVIČKY PŘI SCROLLU DOLŮ
  // =========================
  (function () {
    var header = document.querySelector('header');
    if (!header) return;
    header.classList.add('hide-on-scroll');

    var lastY = window.pageYOffset || document.documentElement.scrollTop || 0;
    var ticking = false;
    var tolerance = 10;

    function onScrollDir() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var delta = y - lastY;

      if (delta > tolerance) {
        header.classList.add('hidden');
        lastY = y;
      } else if (delta < -tolerance) {
        header.classList.remove('hidden');
        lastY = y;
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        (window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); })(onScrollDir);
        ticking = true;
      }
    }, { passive: true });
  })();

  // =========================
  // 3) SCROLLSPY NAVIGACE
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
        var topInViewport = section.getBoundingClientRect().top;
        if (topInViewport <= headerHeight + activationOffset) {
          currentSectionId = section.getAttribute('id');
          break;
        }
      }
      if (currentSectionId === '' && window.pageYOffset < headerHeight + activationOffset) {
        currentSectionId = 'uvod';
      }

      for (var j = 0; j < navLinks.length; j++) navLinks[j].classList.remove('active-link');
      for (var k = 0; k < navLinks.length; k++) {
        var hrefId = navLinks[k].getAttribute('href').substring(1);
        if (hrefId === currentSectionId) navLinks[k].classList.add('active-link');
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
        // grid-sizer a gutter-sizer z CSS/HTML určují přesnou šířku sloupce a mezeru
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

    // pokud wrapper existuje, vygeneruj tečky podle počtu karet
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
              // fallback výpočet: vycentrovat ručně
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

    // IntersectionObserver – root = horizontálně scrollovatelný kontejner
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
        threshold: 0.35,               // rychlejší přepínání
        rootMargin: '0px 12% 0px 12%'  // aktivace s mírným předstihem
      });

      for (var ob = 0; ob < items.length; ob++) io.observe(items[ob]);
    } else {
      // Fallback: rAF scroll handler – vybírá nejblíž středu
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
