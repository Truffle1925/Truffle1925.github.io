(() => {
    const header = document.querySelector('.brand-header');
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.getElementById('site-menu');
    const footer = document.querySelector('.brand-footer');

    /* ---------- Footer: keep page padding in sync with the footer's height ---------- */

    if (footer) {
        const setFooterHeight = () => {
            document.documentElement.style.setProperty('--footer-h', footer.offsetHeight + 'px');
        };
        setFooterHeight();

        if ('ResizeObserver' in window) {
            new ResizeObserver(setFooterHeight).observe(footer);
        } else {
            window.addEventListener('resize', setFooterHeight);
        }

        // The footer sits behind the page until you reach the bottom, so if a
        // keyboard user tabs into it, scroll down to uncover it.
        footer.addEventListener('focusin', () => {
            window.scrollTo({ top: document.documentElement.scrollHeight });
        });
    }

    if (!header || !toggle || !menu) return;

    /* ---------- Hamburger menu ---------- */

    const isMenuOpen = () => menu.classList.contains('is-open');

    function setMenu(open) {
        menu.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        if (open) showHeader();
    }

    toggle.addEventListener('click', () => setMenu(!isMenuOpen()));

    // Click anywhere outside the header closes the menu
    document.addEventListener('click', (e) => {
        if (isMenuOpen() && !header.contains(e.target)) setMenu(false);
    });

    // Escape closes the menu and returns focus to the button
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen()) {
            setMenu(false);
            toggle.focus();
        }
    });

    menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });

    /* ---------- Header: hide on scroll down, show on scroll up ---------- */

    const THRESHOLD = 8; // ignore tiny scroll movements
    let lastY = Math.max(0, window.scrollY);
    let ticking = false;

    function showHeader() {
        header.classList.remove('is-hidden');
    }

    function hideHeader() {
        header.classList.add('is-hidden');
    }

    function update() {
        const y = Math.max(0, window.scrollY); // clamp iOS overscroll bounce
        const delta = y - lastY;

        if (Math.abs(delta) >= THRESHOLD) {
            if (y <= header.offsetHeight || isMenuOpen() || delta < 0) {
                showHeader();
            } else {
                hideHeader();
            }
            lastY = y;
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    // Keyboard users tabbing into the header should always see it
    header.addEventListener('focusin', showHeader);

    /* ---------- Fade in the overlay text as it scrolls into view ---------- */

    const revealItems = document.querySelectorAll('.guide-text');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.35 });

        revealItems.forEach((el) => observer.observe(el));
    } else {
        revealItems.forEach((el) => el.classList.add('is-visible'));
    }
})();
