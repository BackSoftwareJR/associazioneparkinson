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
            if (linkPath === currentPath) {
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

    initScrollHeader();
    initActiveNavLink();
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
});
