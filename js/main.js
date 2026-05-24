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
        if (header) {
            const height = header.getBoundingClientRect().height;
            document.documentElement.style.setProperty('--header-offset', height + 'px');
        }
        updateSubnavOffset();
    }

    function updateSubnavOffset() {
        const subnav = document.querySelector('.about-anchor-nav, .act-anchor-nav, .donations-subnav, .sede-nav');
        if (!subnav) return;
        document.documentElement.style.setProperty('--subnav-offset', subnav.offsetHeight + 'px');
    }

    function syncSubnavStuckStates() {
        document.querySelectorAll('.page-subnav-sentinel').forEach(function(sentinel) {
            const subnav = sentinel.nextElementSibling;
            if (!subnav || !subnav.matches('.about-anchor-nav, .donations-subnav, .sede-nav')) return;

            if (isBottomSubnavLayout()) {
                subnav.classList.add('is-stuck');
                return;
            }

            subnav.classList.toggle('is-stuck', sentinel.getBoundingClientRect().top < getHeaderOffsetPx());
        });
    }

    function initPageSubnav() {
        const subnavs = document.querySelectorAll('.about-anchor-nav, .donations-subnav, .sede-nav');
        if (!subnavs.length) return;

        subnavs.forEach(function(subnav) {
            if (subnav.previousElementSibling && subnav.previousElementSibling.classList.contains('page-subnav-sentinel')) {
                return;
            }

            const sentinel = document.createElement('div');
            sentinel.className = 'page-subnav-sentinel';
            sentinel.setAttribute('aria-hidden', 'true');
            subnav.parentNode.insertBefore(sentinel, subnav);

            const stuckObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (isBottomSubnavLayout()) return;
                    subnav.classList.toggle('is-stuck', !entry.isIntersecting);
                });
            }, {
                rootMargin: '-' + getHeaderOffsetPx() + 'px 0px 0px 0px',
                threshold: 0
            });

            stuckObserver.observe(sentinel);
        });

        syncSubnavStuckStates();
    }

    function isBottomSubnavLayout() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    function getHeaderOffsetPx() {
        return parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-offset'), 10) || 90;
    }

    function getAnchorScrollOffset(navEl) {
        const headerOffset = getHeaderOffsetPx();
        if (isBottomSubnavLayout()) {
            return headerOffset + 16;
        }
        const navHeight = navEl ? navEl.offsetHeight : 0;
        return headerOffset + navHeight + 12;
    }

    function getAnchorObserverRootMargin(navEl) {
        const topOffset = getHeaderOffsetPx() + (isBottomSubnavLayout() ? 16 : ((navEl ? navEl.offsetHeight : 0) + 16));
        return '-' + topOffset + 'px 0px -45% 0px';
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
        const heroSection = document.querySelector(
            'main > .hero:first-child, main > .sede-hero:first-child'
        );
        if (heroSection) {
            header.classList.add('header-over-hero');
        }
    }

    initScrollHeader();
    initActiveNavLink();
    initHeroHeader();
    initPageSubnav();
    updateHeaderOffset();
    window.addEventListener('resize', function() {
        updateHeaderOffset();
        syncSubnavStuckStates();
    });

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

    function initActivitiesShowcase() {
        const track = document.getElementById('activities-track');
        if (!track) return;

        const tabs = Array.from(document.querySelectorAll('.activities-nav-btn'));
        const cards = Array.from(track.querySelectorAll('.activities-card'));
        const dots = Array.from(document.querySelectorAll('.activities-dot'));
        const mobileQuery = window.matchMedia('(max-width: 900px)');

        function setActiveIndex(index) {
            const safeIndex = Math.max(0, Math.min(index, cards.length - 1));

            tabs.forEach((tab, i) => {
                const isActive = i === safeIndex;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                tab.tabIndex = isActive ? 0 : -1;
            });

            cards.forEach((card, i) => {
                card.classList.toggle('is-active', i === safeIndex);
            });

            dots.forEach((dot, i) => {
                const isActive = i === safeIndex;
                dot.classList.toggle('is-active', isActive);
                if (isActive) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });
        }

        function scrollToCard(index) {
            const card = cards[index];
            if (!card) return;

            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const behavior = reduceMotion ? 'auto' : 'smooth';

            if (mobileQuery.matches) {
                const offset = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
                track.scrollTo({ left: offset, behavior });
                return;
            }

            card.scrollIntoView({ behavior, block: 'nearest' });
        }

        function getIndexFromScroll() {
            const trackCenter = track.scrollLeft + track.clientWidth / 2;
            let closestIndex = 0;
            let closestDistance = Infinity;

            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.clientWidth / 2;
                const distance = Math.abs(trackCenter - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = i;
                }
            });

            return closestIndex;
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const index = Number(tab.dataset.activityIndex);
                setActiveIndex(index);
                scrollToCard(index);
            });

            tab.addEventListener('keydown', (event) => {
                const currentIndex = tabs.indexOf(tab);
                let nextIndex = currentIndex;

                if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabs.length;
                } else if (event.key === 'ArrowLeft') {
                    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                } else {
                    return;
                }

                event.preventDefault();
                tabs[nextIndex].focus();
                setActiveIndex(nextIndex);
                scrollToCard(nextIndex);
            });
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = Number(dot.dataset.activityIndex);
                setActiveIndex(index);
                scrollToCard(index);
            });
        });

        let scrollRaf = null;
        track.addEventListener('scroll', () => {
            if (!mobileQuery.matches) return;
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            scrollRaf = requestAnimationFrame(() => {
                setActiveIndex(getIndexFromScroll());
            });
        }, { passive: true });

        setActiveIndex(0);
    }

    initActivitiesShowcase();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initScrollReveal() {
        const reveals = document.querySelectorAll('[data-reveal]');
        if (!reveals.length) return;

        if (reduceMotion) {
            reveals.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach(el => observer.observe(el));
    }

    initScrollReveal();

    function initAboutPage() {
        if (!document.body.classList.contains('page-about')) return;

        function initStatCounters() {
            const statEls = document.querySelectorAll('.about-stat-value[data-count-to]');
            if (!statEls.length || reduceMotion) {
                statEls.forEach(el => {
                    const target = Number(el.dataset.countTo);
                    const suffix = el.dataset.countSuffix || '';
                    el.textContent = target + suffix;
                });
                return;
            }

            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    statsObserver.unobserve(el);

                    const target = Number(el.dataset.countTo);
                    const suffix = el.dataset.countSuffix || '';
                    const duration = 1400;
                    const start = performance.now();

                    function tick(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(target * eased) + suffix;
                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        }
                    }

                    requestAnimationFrame(tick);
                });
            }, { threshold: 0.5 });

            statEls.forEach(el => statsObserver.observe(el));
        }

        function initApproachTabs() {
            const root = document.getElementById('about-approach');
            if (!root) return;

            const tabs = Array.from(root.querySelectorAll('.about-approach-btn'));
            const panels = Array.from(root.querySelectorAll('.about-approach-panel'));

            function activate(index) {
                tabs.forEach((tab, i) => {
                    const isActive = i === index;
                    tab.classList.toggle('is-active', isActive);
                    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                    tab.tabIndex = isActive ? 0 : -1;
                });

                panels.forEach((panel, i) => {
                    const isActive = i === index;
                    panel.classList.toggle('is-active', isActive);
                    if (isActive) {
                        panel.removeAttribute('hidden');
                    } else {
                        panel.setAttribute('hidden', '');
                    }
                });
            }

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    activate(Number(tab.dataset.approachIndex));
                });

                tab.addEventListener('keydown', (event) => {
                    const currentIndex = tabs.indexOf(tab);
                    let nextIndex = currentIndex;

                    if (event.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % tabs.length;
                    } else if (event.key === 'ArrowLeft') {
                        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    } else {
                        return;
                    }

                    event.preventDefault();
                    tabs[nextIndex].focus();
                    activate(nextIndex);
                });
            });
        }

        function initAnchorNav() {
            const nav = document.querySelector('.about-anchor-nav');
            const links = Array.from(document.querySelectorAll('.about-anchor-link'));
            const sections = links
                .map(link => document.querySelector(link.getAttribute('href')))
                .filter(Boolean);

            if (!links.length || !sections.length) return;

            links.forEach(link => {
                link.addEventListener('click', (event) => {
                    const href = link.getAttribute('href');
                    if (!href || !href.startsWith('#')) return;

                    const target = document.querySelector(href);
                    if (!target) return;

                    event.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - getAnchorScrollOffset(nav);

                    window.scrollTo({
                        top,
                        behavior: reduceMotion ? 'auto' : 'smooth'
                    });
                });
            });

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
                    });
                });
            }, {
                threshold: 0.35,
                rootMargin: getAnchorObserverRootMargin(nav)
            });

            sections.forEach(section => sectionObserver.observe(section));
        }

        function initParallaxImages() {
            if (reduceMotion || window.matchMedia('(max-width: 768px)').matches) return;

            const wraps = document.querySelectorAll('.about-parallax-wrap');
            if (!wraps.length) return;

            wraps.forEach(wrap => {
                const img = wrap.querySelector('.about-parallax-img');
                if (!img) return;

                wrap.addEventListener('mousemove', (event) => {
                    const rect = wrap.getBoundingClientRect();
                    const x = (event.clientX - rect.left) / rect.width - 0.5;
                    const y = (event.clientY - rect.top) / rect.height - 0.5;
                    img.style.transform = 'scale(1.06) translate(' + (x * 8) + 'px, ' + (y * 8) + 'px)';
                });

                wrap.addEventListener('mouseleave', () => {
                    img.style.transform = '';
                });
            });
        }

        initStatCounters();
        initApproachTabs();
        initAnchorNav();
        initParallaxImages();
    }

    initAboutPage();

    function initActivitiesPage() {
        if (!document.body.classList.contains('page-activities')) return;

        function initAnchorNav() {
            const nav = document.querySelector('.act-anchor-nav');
            if (!nav) return;

            const links = Array.from(nav.querySelectorAll('.about-anchor-link'));
            const sections = links
                .map(link => document.querySelector(link.getAttribute('href')))
                .filter(Boolean);

            if (!links.length || !sections.length) return;

            links.forEach(link => {
                link.addEventListener('click', (event) => {
                    const href = link.getAttribute('href');
                    if (!href || !href.startsWith('#')) return;

                    const target = document.querySelector(href);
                    if (!target) return;

                    event.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - getAnchorScrollOffset(nav);

                    window.scrollTo({
                        top,
                        behavior: reduceMotion ? 'auto' : 'smooth'
                    });
                });
            });

            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const id = entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
                    });
                });
            }, {
                threshold: 0.35,
                rootMargin: getAnchorObserverRootMargin(nav)
            });

            sections.forEach(section => sectionObserver.observe(section));
        }

        function initParallaxImages() {
            if (reduceMotion || window.matchMedia('(max-width: 768px)').matches) return;

            const wraps = document.querySelectorAll('.about-parallax-wrap');
            if (!wraps.length) return;

            wraps.forEach(wrap => {
                const img = wrap.querySelector('.about-parallax-img');
                if (!img) return;

                wrap.addEventListener('mousemove', (event) => {
                    const rect = wrap.getBoundingClientRect();
                    const x = (event.clientX - rect.left) / rect.width - 0.5;
                    const y = (event.clientY - rect.top) / rect.height - 0.5;
                    img.style.transform = 'scale(1.06) translate(' + (x * 8) + 'px, ' + (y * 8) + 'px)';
                });

                wrap.addEventListener('mouseleave', () => {
                    img.style.transform = '';
                });
            });
        }

        initAnchorNav();
        initParallaxImages();
    }

    initActivitiesPage();

    function showCopyToast(message) {
        var toast = document.querySelector('.copy-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copy-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> ' + message;
        toast.classList.add('is-visible');
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(function() {
            toast.classList.remove('is-visible');
        }, 2500);
    }

    window.copyToClipboard = function(text) {
        if (!navigator.clipboard) {
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            showCopyToast('Copiato negli appunti!');
        }).catch(function(err) {
            console.error('Errore durante la copia:', err);
        });
    };

    document.addEventListener('click', function(event) {
        var btn = event.target.closest('[data-copy]');
        if (!btn) return;
        var text = btn.getAttribute('data-copy');
        if (text) copyToClipboard(text);
    });

    function initDonationsSubnav() {
        var subnav = document.querySelector('.donations-subnav');
        if (!subnav) return;

        var links = Array.from(subnav.querySelectorAll('.donations-subnav-link'));
        var sections = links
            .map(function(link) {
                var href = link.getAttribute('href');
                return href && href.charAt(0) === '#' ? document.querySelector(href) : null;
            })
            .filter(Boolean);

        if (!links.length || !sections.length) return;

        links.forEach(function(link) {
            link.addEventListener('click', function(event) {
                var href = link.getAttribute('href');
                if (!href || href.charAt(0) !== '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                event.preventDefault();
                var top = target.getBoundingClientRect().top + window.scrollY - getAnchorScrollOffset(subnav);

                window.scrollTo({
                    top: top,
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
            });
        });

        var sectionObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                links.forEach(function(link) {
                    link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
                });
            });
        }, {
            threshold: 0.35,
            rootMargin: getAnchorObserverRootMargin(subnav)
        });

        sections.forEach(function(section) {
            sectionObserver.observe(section);
        });
    }

    initDonationsSubnav();
});
