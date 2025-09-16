// script.js
document.addEventListener('DOMContentLoaded', function () {
  // =========================
  // HERO SLIDER (ÚVODNÍ OBRÁZKY)
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
  var autoTransitionDuration = '1s';
  var manualTransitionDuration = '0.2s';

  if (heroSection && heroDotsContainer) {
    var currentImageIndex = 0;
    var intervalId;

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
            intervalId = setInterval(changeBackgroundImage, 10000);
          }, false);
        })(i);
        heroDotsContainer.appendChild(dot);
      }
    }

    function updateHeroSection(source) {
      if (source === 'manual') {
        heroSection.style.transition = 'background-image ' + manualTransitionDuration + ' ease-in-out';
      } else {
        heroSection.style.transition = 'background-image ' + autoTransitionDuration + ' ease-in-out';
      }
      if (currentImageIndex >= heroImages.length) currentImageIndex = 0;
      if (currentImageIndex < 0) currentImageIndex = heroImages.length - 1;

      var newImageUrl = heroImages[currentImageIndex];
      var img = new Image();
      img.src = newImageUrl;
      img.onload = function () {
        heroSection.style.backgroundImage = "url('" + img.src + "')";
      };
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

    createHeroDots();
    updateHeroSection('auto');
    intervalId = setInterval(changeBackgroundImage, 6000);

    if (prevArrow && nextArrow) {
      prevArrow.addEventListener('click', function () {
        clearInterval(intervalId);
        currentImageIndex--;
        updateHeroSection('manual');
        intervalId = setInterval(changeBackgroundImage, 6000);
      }, false);
      nextArrow.addEventListener('click', function () {
        clearInterval(intervalId);
        currentImageIndex++;
        updateHeroSection('manual');
        intervalId = setInterval(changeBackgroundImage, 6000);
      }, false);
    }
  }

  // =========================
  // SCROLLSPY NAVIGACE A MASONRY
  // =========================
  var sections = document.querySelectorAll('section');
  var navLinks = document.querySelectorAll('nav ul li a');
  var headerHeightVar = getComputedStyle(document.documentElement).getPropertyValue('--header-height');
  var headerHeight = parseFloat(headerHeightVar) || 90;

  function highlightNavLink() {
    var currentSectionId = '';
    var activationOffset = 150;

    for (var i = sections.length - 1; i >= 0; i--) {
      var section = sections[i];
      var sectionTopInViewport = section.getBoundingClientRect().top;
      if (sectionTopInViewport <= headerHeight + activationOffset) {
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

  var galleryContainer = document.querySelector('.gallery');
  var msnry;
  function initializeMasonry() {
    if (galleryContainer && typeof imagesLoaded !== 'undefined' && typeof Masonry !== 'undefined') {
      imagesLoaded(galleryContainer, function () {
        if (msnry && typeof msnry.destroy === 'function') {
          msnry.destroy();
        }
        msnry = new Masonry(galleryContainer, {
          itemSelector: '.gallery-item',
          columnWidth: '.gallery-item',
          gutter: 16,
          percentPosition: true,
          transitionDuration: '0.4s'
        });
        if (msnry && typeof msnry.layout === 'function') msnry.layout();
        highlightNavLink();
      });
    }
  }

  initializeMasonry();
  highlightNavLink();

  window.addEventListener('resize', function () {
    initializeMasonry();
    highlightNavLink();
  }, false);
  window.addEventListener('orientationchange', function () {
    initializeMasonry();
    highlightNavLink();
  }, false);
  window.addEventListener('scroll', highlightNavLink, { passive: true });

  for (var iNav = 0; iNav < navLinks.length; iNav++) {
    navLinks[iNav].addEventListener('click', function () {
      setTimeout(function () {
        highlightNavLink();
      }, 100);
    }, false);
  }

  // =========================
  // HAMBURGER MENU (MOBILNÍ NAVIGACE)
  // =========================
  var menuToggle = document.getElementById('mobile-menu');
  var navList = document.getElementById('main-nav');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('open');
      navList.classList.toggle('open');
    }, false);
    var navLinksMobile = navList.querySelectorAll('a');
    for (var iMob = 0; iMob < navLinksMobile.length; iMob++) {
      navLinksMobile[iMob].addEventListener('click', function () {
        if (navList.classList.contains('open')) {
          menuToggle.classList.remove('open');
          navList.classList.remove('open');
        }
      }, false);
    }
  }

  // =========================
  // SLUŽBY – TEČKY INDIKÁTORU (MOBIL)
  // =========================
  var list = document.querySelector('#sluzby .sluzby-list');
  var items = Array.prototype.slice.call(document.querySelectorAll('#sluzby .sluzba'));
  var dotsWrap = document.querySelector('#sluzby .slider-dots-mobile');

  if (list && items.length && dotsWrap) {
    // Vždy generuj tečky podle skutečného počtu karet
    dotsWrap.innerHTML = '';
    var dots = [];
    for (var d = 0; d < items.length; d++) {
      var dot = document.createElement('span');
      dot.className = 'slider-dot';
      dotsWrap.appendChild(dot);
      (function (idx) {
        dot.addEventListener('click', function () {
          var target = items[idx];
          if (!target) return;
          try {
            // Preferované, pokud prohlížeč podporuje options
            target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } catch (e) {
            // Fallback výpočet
            var targetCenter = target.offsetLeft + target.offsetWidth / 2;
            var containerCenter = list.clientWidth / 2;
            var to = targetCenter - containerCenter;
            if (list.scrollTo) list.scrollTo({ left: to, behavior: 'smooth' });
            else list.scrollLeft = to;
          }
        }, false);
      })(d);
      dots.push(dot);
    }

    function setActive(index) {
      for (var iDot = 0; iDot < dots.length; iDot++) {
        if (iDot === index) dots[iDot].classList.add('active');
        else dots[iDot].classList.remove('active');
      }
    }
    setActive(0);

    function indexOfMostCentered() {
      var containerLeft = list.scrollLeft;
      var containerCenter = containerLeft + list.clientWidth / 2;
      var minDist = Infinity;
      var best = 0;
      for (var k = 0; k < items.length; k++) {
        var left = items[k].offsetLeft;
        var center = left + items[k].offsetWidth / 2;
        var dist = Math.abs(center - containerCenter);
        if (dist < minDist) { minDist = dist; best = k; }
      }
      return best;
    }

    if ('IntersectionObserver' in window) {
      // IO funguje i pro horizontální root, když root je scrollující kontejner
      var io = new IntersectionObserver(function (entries) {
        for (var iEnt = 0; iEnt < entries.length; iEnt++) {
          var entry = entries[iEnt];
          if (entry.isIntersecting) {
            var idx = -1;
            for (var ix = 0; ix < items.length; ix++) if (items[ix] === entry.target) { idx = ix; break; }
            if (idx > -1) setActive(idx);
          }
        }
      }, { root: list, threshold: 0.6 });
      for (var ob = 0; ob < items.length; ob++) io.observe(items[ob]);
    } else {
      // Fallback: poslouchat scroll a určit nejvíc vystředěnou kartu
      var ticking = false;
      list.addEventListener('scroll', function () {
        if (!ticking) {
          (window.requestAnimationFrame || function (cb) { return setTimeout(cb, 16); })(function () {
            setActive(indexOfMostCentered());
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // =========================
  // VOLITELNĚ: ZPRÁVY PO ODESLÁNÍ FORMULÁŘE PODLE URL PARAMS
  // (pokud to již máte inline v HTML, tuto část můžete vynechat)
  // =========================
  var urlParams = new URLSearchParams(window.location.search);
  var status = urlParams.get('status');
  var messageContainer = document.querySelector('.kontakt-formular');
  if (status && messageContainer) {
    var messageDiv = document.createElement('div');
    messageDiv.style.padding = '15px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.marginTop = '20px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = 'bold';

    if (status === 'success') {
      messageDiv.style.backgroundColor = '#d4edda';
      messageDiv.style.color = '#155724';
      messageDiv.textContent = 'Vaše zpráva byla úspěšně odeslána! Děkujeme.';
    } else if (status === 'error') {
      var errorMsg = urlParams.get('msg');
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.color = '#721c24';
      if (errorMsg === 'missing_fields') {
        messageDiv.textContent = 'Chyba: Vyplňte prosím všechna povinná pole.';
      } else if (errorMsg === 'invalid_email') {
        messageDiv.textContent = 'Chyba: Zadejte prosím platnou e-mailovou adresu.';
      } else {
        messageDiv.textContent = 'Došlo k chybě při odesílání zprávy. Zkuste to prosím později.';
      }
    }
    var formTitle = messageContainer.querySelector('h3');
    if (formTitle) formTitle.after(messageDiv); else messageContainer.prepend(messageDiv);
    history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  }
});
