document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navWrapper = document.querySelector('.nav-wrapper');
    const sediLinks = document.querySelectorAll('#sedi-dropdown-trigger');
    const dropdown = document.getElementById('sedi-dropdown');
    const overlay = document.querySelector('.dropdown-overlay');

    function initCookieBanner() {
        if (localStorage.getItem('cookieConsent')) {
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-text">
                    <h4>Utilizziamo i cookie</h4>
                    <p>Questo sito utilizza cookie tecnici e analitici per migliorare la tua esperienza di navigazione.
                    Continuando a navigare accetti l'utilizzo dei cookie.
                    <a href="cookie-policy.html" target="_blank">Leggi la nostra Cookie Policy</a></p>
                </div>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="cookie-btn accept">Accetta</button>
                    <button id="reject-cookies" class="cookie-btn reject">Rifiuta</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);

        document.getElementById('accept-cookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        });

        document.getElementById('reject-cookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        });
    }

    initCookieBanner();

    function updateHeaderOffset() {
        if (!header) return;
        const height = header.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--header-offset', height + 'px');
    }

    function initScrollHeader() {
        if (!header) return;

        function onScroll() {
            header.classList.toggle('scrolled', window.scrollY > 24);
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    function initActiveNavLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const linkPath = href.split('/').pop();
            const isHome = (currentPath === '' || currentPath === 'index.html') && linkPath === 'index.html';
            if (linkPath === currentPath || isHome) {
                link.classList.add('active');
            }
        });

        const ctaLink = document.querySelector('.nav-cta');
        if (ctaLink) {
            const ctaPath = ctaLink.getAttribute('href').split('/').pop();
            if (ctaPath === currentPath) {
                ctaLink.classList.add('active');
            }
        }
    }

    function closeMenu() {
        if (!navWrapper || !mobileMenuBtn) return;

        navWrapper.classList.add('closing');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        setTimeout(() => {
            navWrapper.classList.remove('active');
            navWrapper.classList.remove('closing');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }, 300);
    }

    function closeDropdown() {
        if (!dropdown || !overlay) return;
        dropdown.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function initHeroHeader() {
        if (!header) return;
        const heroSection = document.querySelector('main > .hero:first-child');
        if (heroSection) {
            header.classList.add('header-over-hero');
        }
    }

    initScrollHeader();
    initActiveNavLink();
    initHeroHeader();
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);

    if (mobileMenuBtn && navWrapper) {
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = navWrapper.classList.toggle('active');
            this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    sediLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (!dropdown || !overlay) return;
            dropdown.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (navWrapper && navWrapper.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    if (overlay) {
        overlay.addEventListener('click', closeDropdown);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (dropdown && dropdown.classList.contains('active')) {
                closeDropdown();
            }
            if (navWrapper && navWrapper.classList.contains('active')) {
                closeMenu();
            }
        }
    });

    document.addEventListener('click', function(event) {
        if (!navWrapper || !mobileMenuBtn) return;

        const headerActions = document.querySelector('.header-actions');
        const isClickInside = navWrapper.contains(event.target)
            || mobileMenuBtn.contains(event.target)
            || (headerActions && headerActions.contains(event.target));

        if (!isClickInside && navWrapper.classList.contains('active')) {
            closeMenu();
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navWrapper && navWrapper.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', closeDropdown);
    });

    document.querySelectorAll('.nav-cta').forEach(link => {
        link.addEventListener('click', () => {
            if (navWrapper && navWrapper.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    function initHeroCarousel() {
        const carousel = document.getElementById('hero-carousel');
        if (!carousel) return;

        const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
        const prevBtn = carousel.querySelector('.hero-carousel-prev');
        const nextBtn = carousel.querySelector('.hero-carousel-next');
        const dotsContainer = carousel.querySelector('.hero-carousel-dots');
        const statusEl = document.getElementById('hero-carousel-status');
        const counterEl = document.getElementById('hero-carousel-counter');
        const progressBar = document.getElementById('hero-carousel-progress');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!slides.length || !dotsContainer) return;

        let currentIndex = slides.findIndex(slide => slide.classList.contains('is-active'));
        if (currentIndex < 0) currentIndex = 0;

        let autoplayTimer = null;
        let progressTimer = null;
        let progressStart = 0;
        const autoplayDelay = 6000;

        function getSlideLabel(slide) {
            const tag = slide.querySelector('.hero-slide-tag');
            const text = slide.querySelector('.hero-slide-text');
            return [tag ? tag.textContent.trim() : '', text ? text.textContent.trim() : '']
                .filter(Boolean)
                .join(': ');
        }

        function announceSlide(index) {
            if (!statusEl) return;
            statusEl.textContent = 'Foto ' + (index + 1) + ' di ' + slides.length + '. ' + getSlideLabel(slides[index]);
        }

        function updateCounter(index) {
            if (counterEl) {
                counterEl.textContent = (index + 1) + ' / ' + slides.length;
            }
        }

        function resetProgressBar() {
            if (!progressBar) return;
            progressBar.style.width = '0%';
            progressStart = Date.now();
        }

        function stopProgressBar() {
            if (progressTimer) {
                cancelAnimationFrame(progressTimer);
                progressTimer = null;
            }
        }

        function animateProgressBar() {
            if (!progressBar || reducedMotion) return;

            stopProgressBar();

            function tick() {
                const elapsed = Date.now() - progressStart;
                const pct = Math.min((elapsed / autoplayDelay) * 100, 100);
                progressBar.style.width = pct + '%';

                if (pct < 100) {
                    progressTimer = requestAnimationFrame(tick);
                }
            }

            resetProgressBar();
            progressTimer = requestAnimationFrame(tick);
        }

        function setActiveSlide(index) {
            currentIndex = (index + slides.length) % slides.length;

            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === currentIndex);
            });

            dotsContainer.querySelectorAll('.hero-carousel-dot').forEach((dot, i) => {
                const isActive = i === currentIndex;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
                dot.tabIndex = isActive ? 0 : -1;
            });

            updateCounter(currentIndex);
            announceSlide(currentIndex);
            animateProgressBar();
        }

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-carousel-dot' + (index === currentIndex ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Mostra foto ' + (index + 1) + ': ' + getSlideLabel(slide));
            dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
            dot.tabIndex = index === currentIndex ? 0 : -1;

            dot.addEventListener('click', function() {
                setActiveSlide(index);
                restartAutoplay();
            });

            dotsContainer.appendChild(dot);
        });

        function nextSlide() {
            setActiveSlide(currentIndex + 1);
        }

        function prevSlide() {
            setActiveSlide(currentIndex - 1);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
            stopProgressBar();
        }

        function startAutoplay() {
            if (reducedMotion || slides.length < 2) return;
            stopAutoplay();
            autoplayTimer = setInterval(nextSlide, autoplayDelay);
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                restartAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                nextSlide();
                restartAutoplay();
            });
        }

        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('focusout', function(event) {
            if (!carousel.contains(event.relatedTarget)) {
                startAutoplay();
            }
        });

        carousel.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                prevSlide();
                restartAutoplay();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                nextSlide();
                restartAutoplay();
            }
        });

        setActiveSlide(currentIndex);
        startAutoplay();
    }

    initHeroCarousel();
});
