/* ============================================================
   Horizons5A — JavaScript
   Navbar, Dark Mode, Scroll Animations, Counter
   ============================================================ */

(function () {
    'use strict';

    // --- Dark Mode ---
    var themeToggle = document.querySelector('.theme-toggle');
    var savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    function updateToggleIcon() {
        if (!themeToggle) return;
        var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeToggle.textContent = isDark ? '\u2600' : '\u263D';
        themeToggle.setAttribute('aria-label', isDark ? 'Passa a tema chiaro' : 'Passa a tema scuro');
    }

    updateToggleIcon();

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            var newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateToggleIcon();
        });
    }

    // --- Navbar scroll effect ---
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Hamburger menu ---
    var hamburger = document.querySelector('.nav-hamburger');
    var navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Active nav link ---
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (!href) return;
        var hrefPage = href.split('/').pop();
        if (hrefPage === currentPage) {
            link.classList.add('active');
        }
    });

    // --- Scroll animations (IntersectionObserver) ---
    var fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // --- Animated counters ---
    var counters = document.querySelectorAll('[data-count]');

    if (counters.length > 0 && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(function (el) {
            counterObserver.observe(el);
        });
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 2000;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    // --- Cookie banner ---
    if (!localStorage.getItem('cookieConsent')) {
        var banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Informativa cookie');

        var isSubpage = window.location.pathname.indexOf('/pages/') !== -1;
        var policyPath = isSubpage ? 'cookie-policy.html' : 'pages/cookie-policy.html';

        banner.innerHTML =
            '<div class="container">' +
                '<div class="cookie-banner-inner">' +
                    '<div class="cookie-banner-text">' +
                        '<p>Questo sito utilizza il localStorage per salvare le tue preferenze (tema chiaro/scuro). ' +
                        'Non utilizziamo cookie di profilazione. ' +
                        '<a href="' + policyPath + '">Maggiori informazioni</a></p>' +
                    '</div>' +
                    '<div class="cookie-banner-actions">' +
                        '<button class="btn btn-primary" id="cookie-accept">Accetta</button>' +
                        '<button class="btn btn-outline" id="cookie-decline">Rifiuta</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

        document.body.appendChild(banner);

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                banner.classList.add('visible');
            });
        });

        document.getElementById('cookie-accept').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.remove('visible');
        });

        document.getElementById('cookie-decline').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'declined');
            banner.classList.remove('visible');
        });
    }

})();
