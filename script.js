document.addEventListener('DOMContentLoaded', function () {

  // Sticky header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 12);
    });
  }

  // Mobile menu toggle
  var menuToggle = document.querySelector('.menu-toggle');
  var siteNav = document.querySelector('.site-nav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', function () {
      siteNav.classList.toggle('open');
    });
  }

  // Scroll-reveal
  var reveals = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(function (el) { revealObserver.observe(el); });

  // Count-up numbers
  var counters = document.querySelectorAll('.count');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseFloat(el.dataset.target);
        var suffix = el.dataset.suffix || '';
        var duration = 1400;
        var start = performance.now();
        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target < 10 ? (target * eased).toFixed(target % 1 !== 0 ? 1 : 0) : Math.round(target * eased);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(function (el) { countObserver.observe(el); });

  // Community photo slider (autoplay, arrows, dots, pause)
  var slider = document.querySelector('.slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.slider-dot'));
    var prevBtn = slider.querySelector('.slide-arrow.prev');
    var nextBtn = slider.querySelector('.slide-arrow.next');
    var pauseBtn = document.querySelector('.slider-pause');
    var progressFill = document.querySelector('.progress-fill');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DURATION = 5000;
    var index = 0;
    var hoverPaused = false;
    var manualPaused = false;

    function isPaused() { return hoverPaused || manualPaused; }

    function syncPausedVisual() {
      slider.classList.toggle('is-paused', isPaused());
    }

    function restartProgress() {
      if (!progressFill || reduceMotion) return;
      progressFill.classList.remove('animate');
      void progressFill.offsetWidth; // force reflow so the animation restarts
      progressFill.classList.add('animate');
      syncPausedVisual();
    }

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle('is-active', si === index); });
      dots.forEach(function (d, di) {
        d.classList.toggle('is-active', di === index);
        d.setAttribute('aria-current', di === index ? 'true' : 'false');
      });
      restartProgress();
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        manualPaused = !manualPaused;
        pauseBtn.setAttribute('aria-pressed', manualPaused ? 'true' : 'false');
        pauseBtn.setAttribute('aria-label', manualPaused ? 'Play slideshow' : 'Pause slideshow');
        syncPausedVisual();
      });
    }

    slider.addEventListener('mouseenter', function () { hoverPaused = true; syncPausedVisual(); });
    slider.addEventListener('mouseleave', function () { hoverPaused = false; syncPausedVisual(); });
    slider.addEventListener('focusin', function () { hoverPaused = true; syncPausedVisual(); });
    slider.addEventListener('focusout', function () { hoverPaused = false; syncPausedVisual(); });

    show(0);
    if (!reduceMotion) {
      setInterval(function () { if (!isPaused()) show(index + 1); }, DURATION);
    }
  }

});
