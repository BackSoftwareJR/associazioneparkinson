document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const sediLinks = document.querySelectorAll('#sedi-dropdown-trigger');
    const dropdown = document.getElementById('sedi-dropdown');
    const overlay = document.querySelector('.dropdown-overlay');
    
    // Cookie Banner Management
    function initCookieBanner() {
        if (localStorage.getItem('cookieConsent')) {
            return; // User has already made a choice
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
        
        // Show banner after a short delay
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
        
        // Handle accept button
        document.getElementById('accept-cookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        });
        
        // Handle reject button
        document.getElementById('reject-cookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'rejected');
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        });
    }
    
    // Initialize cookie banner
    initCookieBanner();
    
    function closeMenu() {
        navMenu.classList.add('closing');
        setTimeout(() => {
            navMenu.classList.remove('active');
            navMenu.classList.remove('closing');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        }, 300);
    }

    function closeDropdown() {
        dropdown.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toggle menu on mobile
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Gestione dropdown sedi
    sediLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Chiudi dropdown quando si clicca sull'overlay
    overlay.addEventListener('click', closeDropdown);

    // Chiudi dropdown quando si preme ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdown.classList.contains('active')) {
            closeDropdown();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || mobileMenuBtn.contains(event.target);
        
        if (!isClickInside && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Chiudi il menu quando si clicca su un link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Chiudi il dropdown quando si clicca su un link al suo interno
    document.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('click', closeDropdown);
    });


});
