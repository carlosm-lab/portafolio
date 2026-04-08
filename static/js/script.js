/**
 * ════════════════════════════════════════════════════════════════════════════
 * DARK LUXURY PORTFOLIO - ANIMATION SYSTEM
 * Scroll-triggered animations using IntersectionObserver
 * ════════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ════════════════════════════════════════════════════════════════════════
    const CONFIG = {
        // IntersectionObserver options - trigger immediately when entering viewport
        observerOptions: {
            root: null,
            rootMargin: '50px 0px 0px 0px', // Pre-load 50px before entering from bottom
            threshold: 0 // Trigger as soon as any part is visible
        },
        // Default animation delay increment for staggered items
        staggerDelay: 50, // Faster stagger for quicker reveal
        // Check for reduced motion preference
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // ════════════════════════════════════════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ════════════════════════════════════════════════════════════════════════
    class ScrollReveal {
        constructor() {
            this.elements = [];
            this.observer = null;
            this.init();
        }

        init() {
            // Skip if user prefers reduced motion
            if (CONFIG.prefersReducedMotion) {
                this.showAllElements();
                return;
            }

            this.setupObserver();
            this.observeElements();
        }

        setupObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.revealElement(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, CONFIG.observerOptions);
        }

        observeElements() {
            const elements = document.querySelectorAll('.reveal');
            elements.forEach(el => {
                this.observer.observe(el);
            });
        }

        revealElement(element) {
            // Reveal immediately without delay
            element.classList.add('revealed');
        }

        showAllElements() {
            // For reduced motion: show all elements immediately
            const elements = document.querySelectorAll('.reveal');
            elements.forEach(el => {
                el.classList.add('revealed');
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // STAGGER ANIMATION SYSTEM
    // ════════════════════════════════════════════════════════════════════════
    class StaggerAnimation {
        constructor() {
            this.init();
        }

        init() {
            if (CONFIG.prefersReducedMotion) return;

            this.setupStaggerObserver();
        }

        setupStaggerObserver() {
            const staggerContainers = document.querySelectorAll('.skills-bento-grid, .projects-grid');

            staggerContainers.forEach(container => {
                const staggerItems = container.querySelectorAll('.stagger');

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateStaggerItems(staggerItems);
                            observer.unobserve(entry.target);
                        }
                    });
                }, {
                    root: null,
                    rootMargin: '50px 0px 0px 0px', // Pre-load before entering
                    threshold: 0 // Trigger immediately
                });

                observer.observe(container);
            });
        }

        animateStaggerItems(items) {
            items.forEach((item, index) => {
                const baseDelay = parseInt(item.dataset.delay) || 0;
                const staggerDelay = index * CONFIG.staggerDelay;

                setTimeout(() => {
                    item.classList.add('revealed');
                }, baseDelay + staggerDelay);
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // HEADER SCROLL BEHAVIOR
    // ════════════════════════════════════════════════════════════════════════
    class HeaderController {
        constructor() {
            this.header = document.querySelector('.site-header');
            this.logo = document.getElementById('mainLogo');
            this.hero = document.getElementById('hero');
            this.navContainer = document.querySelector('.nav-container');
            this.navMenu = document.querySelector('.nav-menu');
            this.mobileToggle = document.getElementById('mobileMenuToggle');
            this.scrollThreshold = 100;
            this.lastScrollY = 0;
            this.heroVisible = true;
            // Approximate width of "Carlos Molina" text in pixels
            this.fullNameWidth = 0;
            this.init();
        }

        init() {
            if (!this.header) return;

            // Calculate the width of "Carlos Molina" for space comparison
            this.calculateNameWidth();

            this.handleScroll();
            this.checkLogoSpace();

            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            window.addEventListener('resize', () => {
                this.calculateNameWidth();
                this.checkLogoSpace();
            }, { passive: true });

            // Set up IntersectionObserver for hero visibility
            if (this.hero && this.logo) {
                this.setupHeroObserver();
            }
        }

        calculateNameWidth() {
            // Create a hidden element to measure "Carlos Molina" width
            const logoFull = this.logo?.querySelector('.logo-full');
            if (logoFull) {
                // Temporarily make it visible to measure
                const originalDisplay = logoFull.style.display;
                const originalPosition = logoFull.style.position;
                const originalOpacity = logoFull.style.opacity;
                const originalVisibility = logoFull.style.visibility;

                logoFull.style.display = 'inline';
                logoFull.style.position = 'absolute';
                logoFull.style.opacity = '0';
                logoFull.style.visibility = 'hidden';

                this.fullNameWidth = logoFull.offsetWidth;

                // Restore original styles
                logoFull.style.display = originalDisplay || '';
                logoFull.style.position = originalPosition || '';
                logoFull.style.opacity = originalOpacity || '';
                logoFull.style.visibility = originalVisibility || '';
            }

            // Fallback: estimate based on font size (approximately 8.5em)
            if (!this.fullNameWidth || this.fullNameWidth < 50) {
                const fontSize = parseFloat(getComputedStyle(this.logo).fontSize) || 20;
                this.fullNameWidth = fontSize * 8.5;
            }
        }

        checkLogoSpace() {
            if (!this.logo || !this.navContainer) return;

            // Use viewport width directly - this is STABLE and doesn't depend on current state
            const viewportWidth = window.innerWidth;

            // Calculate breakpoints once based on measured widths (or use reasonable defaults)
            // These are the content widths that need to fit in the nav-container:
            // - Logo accent (diamond): ~20px
            // - Gap: 8px  
            // - "Carlos Molina": ~135px (measured at text-xl size)
            // - "CM": ~35px
            // - Minimum gap: 40px
            // - Full menu (8 items): ~550px
            // - Container padding: 80px total (40px each side)

            const logoAccentWidth = 20;
            const gapAfterAccent = 8;
            const fullNameWidth = this.fullNameWidth || 135;
            const cmWidth = 35;
            const minGap = 50; // Good spacing
            const menuWidth = 750; // Increased further to ensure full name only appears when there's true space
            const containerPadding = 80;

            // Calculate minimum widths needed for each configuration:
            // 1. Full name + full menu
            const minForFullNameAndMenu = logoAccentWidth + gapAfterAccent + fullNameWidth + minGap + menuWidth + containerPadding;
            // ~833px

            // 2. CM + full menu  
            const minForCMAndMenu = logoAccentWidth + gapAfterAccent + cmWidth + minGap + menuWidth + containerPadding;
            // ~733px

            // 3. CM + hamburger (always works)
            // Just needs to be above 768px (mobile breakpoint)

            // CSS handles below 768px (mobile breakpoint)
            if (viewportWidth <= 768) {
                // Let CSS handle mobile layout
                this.logo.classList.remove('use-initials');
                document.body.classList.remove('force-hamburger');
                return;
            }

            // Decision logic based on viewport width with hysteresis
            // Use slightly different thresholds for switching in each direction
            const isUsingInitials = this.logo.classList.contains('use-initials');
            const isForceHamburger = document.body.classList.contains('force-hamburger');

            // Hysteresis buffer - require extra 30px to switch BACK to expanded mode
            const hysteresis = isUsingInitials ? 30 : 0;
            const hamburgerHysteresis = isForceHamburger ? 30 : 0;

            // Determine which configuration to use
            if (viewportWidth >= minForFullNameAndMenu + hysteresis) {
                // Full name + full menu
                this.logo.classList.remove('use-initials');
                document.body.classList.remove('force-hamburger');
            } else if (viewportWidth >= minForCMAndMenu + hamburgerHysteresis) {
                // CM + full menu
                this.logo.classList.add('use-initials');
                document.body.classList.remove('force-hamburger');
            } else {
                // CM + hamburger
                this.logo.classList.add('use-initials');
                document.body.classList.add('force-hamburger');
            }
        }

        setupHeroObserver() {
            // Observe when the hero title (name) goes out of view
            const heroTitle = this.hero.querySelector('.hero-title');
            const targetElement = heroTitle || this.hero;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const wasVisible = this.heroVisible;
                    this.heroVisible = entry.isIntersecting;

                    // Only animate if state actually changed
                    if (wasVisible !== this.heroVisible) {
                        this.updateLogoState();
                    }
                });
            }, {
                root: null,
                rootMargin: '-80px 0px 0px 0px', // Account for header height
                threshold: 0
            });

            observer.observe(targetElement);
        }

        updateLogoState() {
            if (!this.logo) return;

            // Remove previous animation classes
            this.logo.classList.remove('show-name', 'show-initial');

            if (this.heroVisible) {
                // Hero is visible, show "Inicio"
                this.logo.classList.add('show-initial');
            } else {
                // Hero is not visible, show name with typewriter animation
                this.logo.classList.add('show-name');
            }

            // Recheck space after state change
            requestAnimationFrame(() => this.checkLogoSpace());
        }

        handleScroll() {
            const currentScrollY = window.scrollY;

            // Add/remove scrolled class based on scroll position
            if (currentScrollY > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            this.lastScrollY = currentScrollY;
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // MOBILE NAVIGATION
    // ════════════════════════════════════════════════════════════════════════
    class MobileNav {
        constructor() {
            this.toggle = document.getElementById('mobileMenuToggle');
            this.nav = document.getElementById('mobileNav');
            this.links = document.querySelectorAll('.mobile-nav-menu a');
            this.isOpen = false;
            this.focusableElements = [];
            this.firstFocusable = null;
            this.lastFocusable = null;
            this.init();
        }

        init() {
            if (!this.toggle || !this.nav) return;

            this.toggle.addEventListener('click', () => this.toggleNav());

            // Close button inside nav
            const closeBtn = document.getElementById('mobileNavClose');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeNav());
            }

            // Close nav when clicking a link
            this.links.forEach(link => {
                link.addEventListener('click', () => this.closeNav());
            });

            // Close nav on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.closeNav();
                    this.toggle.focus();
                }
                // Focus trap
                if (e.key === 'Tab' && this.isOpen) {
                    this.handleTabKey(e);
                }
            });

            // Set up focusable elements
            this.focusableElements = this.nav.querySelectorAll('a, button');
            if (this.focusableElements.length > 0) {
                this.firstFocusable = this.focusableElements[0];
                this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
            }
        }

        handleTabKey(e) {
            if (e.shiftKey) {
                if (document.activeElement === this.firstFocusable) {
                    e.preventDefault();
                    this.lastFocusable.focus();
                }
            } else {
                if (document.activeElement === this.lastFocusable) {
                    e.preventDefault();
                    this.firstFocusable.focus();
                }
            }
        }

        toggleNav() {
            this.isOpen = !this.isOpen;
            this.toggle.classList.toggle('active');
            this.nav.classList.toggle('active');
            this.toggle.setAttribute('aria-expanded', this.isOpen);

            // Prevent body scroll when nav is open
            document.body.style.overflow = this.isOpen ? 'hidden' : '';

            // Focus first link when opening
            if (this.isOpen && this.firstFocusable) {
                setTimeout(() => this.firstFocusable.focus(), 100);
            }
        }

        closeNav() {
            this.isOpen = false;
            this.toggle.classList.remove('active');
            this.nav.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ════════════════════════════════════════════════════════════════════════
    class SmoothScroll {
        constructor() {
            // Altura fija del header scrolled (más pequeña) para cálculos consistentes
            // Esto evita el problema donde el header cambia de tamaño durante el scroll
            this.scrolledHeaderHeight = 72; // Altura aproximada del header en estado scrolled
            this.init();
        }

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const target = document.querySelector(targetId);
                    if (!target) return;

                    e.preventDefault();

                    // Usar la altura del header scrolled para cálculo consistente
                    // ya que cuando llegues a la sección, el header estará en estado scrolled
                    const header = document.querySelector('.site-header');
                    const isCurrentlyScrolled = header?.classList.contains('scrolled');

                    // Si ya estamos en estado scrolled, usar la altura actual
                    // Si no, usar la altura estimada del header scrolled
                    const headerOffset = isCurrentlyScrolled
                        ? (header?.offsetHeight || this.scrolledHeaderHeight)
                        : this.scrolledHeaderHeight;

                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                });
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // PARALLAX EFFECT FOR DECORATIVE ELEMENTS
    // ════════════════════════════════════════════════════════════════════════
    class ParallaxEffect {
        constructor() {
            this.orbs = document.querySelectorAll('.hero-gradient-orb');
            this.init();
        }

        init() {
            if (this.orbs.length === 0 || CONFIG.prefersReducedMotion) return;

            // Use requestAnimationFrame for smooth performance
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.updateParallax();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }

        updateParallax() {
            const scrollY = window.scrollY;

            this.orbs.forEach((orb, index) => {
                const speed = index === 0 ? 0.1 : 0.05;
                const yPos = scrollY * speed;
                orb.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CURSOR GLOW EFFECT (DESKTOP ONLY)
    // ════════════════════════════════════════════════════════════════════════
    class CursorGlow {
        constructor() {
            this.cards = document.querySelectorAll('.glass-card, .project-card');
            this.init();
        }

        init() {
            // Skip on touch devices
            if ('ontouchstart' in window || CONFIG.prefersReducedMotion) return;

            this.cards.forEach(card => {
                card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
                card.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, card));
            });
        }

        handleMouseMove(e, card) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.setProperty('--glow-opacity', '1');
        }

        handleMouseLeave(e, card) {
            card.style.setProperty('--glow-opacity', '0');
        }
    }

    // TextSplit class removed - was empty placeholder for future enhancement

    // ════════════════════════════════════════════════════════════════════════
    // COOKIE CONSENT BANNER
    // ════════════════════════════════════════════════════════════════════════
    class CookieConsent {
        constructor() {
            this.banner = document.getElementById('cookieBanner');
            this.acceptBtn = document.getElementById('acceptCookies');
            this.storageKey = 'cookieConsent';
            this.init();
        }

        init() {
            if (!this.banner || !this.acceptBtn) return;

            // Check if consent was already given
            if (this.hasConsent()) {
                this.hideBanner();
                return;
            }

            // Show banner
            this.showBanner();

            // Handle accept
            this.acceptBtn.addEventListener('click', () => {
                this.setConsent();
                this.hideBanner();
            });
        }

        hasConsent() {
            return localStorage.getItem(this.storageKey) === 'true';
        }

        setConsent() {
            localStorage.setItem(this.storageKey, 'true');
        }

        showBanner() {
            this.banner.classList.remove('hidden');
        }

        hideBanner() {
            this.banner.classList.add('hidden');
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // TYPEWRITER EFFECT
    // ════════════════════════════════════════════════════════════════════════
    class TypewriterEffect {
        constructor() {
            this.element = document.getElementById('heroTypewriter');
            this.textElement = null;
            this.roles = [
                { text: 'Estudiante de Psicología', accent: true },
                { text: ' · ', accent: true },
                { text: 'Desarrollador Web', accent: false },
                { text: ' · ', accent: true },
                { text: 'Técnico de TI', accent: false },
                { text: ' · ', accent: true },
                { text: 'OSINT Specialist', accent: false }
            ];
            this.typeSpeed = 25; // ms per character (faster)
            this.startDelay = 400; // Wait before starting
            this.init();
        }

        init() {
            if (!this.element) return;

            this.textElement = this.element.querySelector('.typewriter-text');
            if (!this.textElement) return;

            // If reduced motion, show all text immediately
            if (CONFIG.prefersReducedMotion) {
                this.showAllText();
                return;
            }

            // Start typing after delay
            setTimeout(() => this.typeAllRoles(), this.startDelay);
        }

        showAllText() {
            let html = '';
            this.roles.forEach(role => {
                if (role.accent) {
                    html += `<strong style="color: var(--color-accent);">${role.text}</strong>`;
                } else {
                    html += role.text;
                }
            });
            this.textElement.innerHTML = html;
            this.element.classList.add('typewriter-done');
        }

        async typeAllRoles() {
            for (const role of this.roles) {
                await this.typeRole(role);
            }
            // Optionally hide cursor when done
            // this.element.classList.add('typewriter-done');
        }

        typeRole(role) {
            return new Promise(resolve => {
                let charIndex = 0;
                const text = role.text;

                // Create span for this role
                const span = document.createElement('span');
                if (role.accent) {
                    span.style.color = 'var(--color-accent)';
                    span.style.fontWeight = role.text.includes('·') ? 'normal' : 'bold';
                }
                this.textElement.appendChild(span);

                const typeChar = () => {
                    if (charIndex < text.length) {
                        span.textContent += text.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeChar, this.typeSpeed);
                    } else {
                        resolve();
                    }
                };

                typeChar();
            });
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // SKELETON LOADER
    // ════════════════════════════════════════════════════════════════════════
    class SkeletonLoader {
        constructor() {
            this.skeleton = document.getElementById('skeletonLoader');
            this.minDisplayTime = 300; // Minimum time to show skeleton (ms)
            this.startTime = Date.now();
            this.init();
        }

        init() {
            if (!this.skeleton) return;

            // Hide skeleton when page is fully loaded
            if (document.readyState === 'complete') {
                this.hideSkeleton();
            } else {
                window.addEventListener('load', () => this.hideSkeleton());
            }

            // Fallback: Hide after max time to prevent infinite loading
            setTimeout(() => this.hideSkeleton(), 5000);
        }

        hideSkeleton() {
            if (!this.skeleton || this.skeleton.classList.contains('hidden')) return;

            const elapsedTime = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

            // Wait for minimum display time, then hide with smooth transition
            setTimeout(() => {
                this.skeleton.classList.add('hidden');

                // Remove from DOM after transition completes
                setTimeout(() => {
                    if (this.skeleton && this.skeleton.parentNode) {
                        this.skeleton.parentNode.removeChild(this.skeleton);
                    }
                }, 500); // Match CSS transition duration
            }, remainingTime);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // CONTACT FORM HANDLER
    // ════════════════════════════════════════════════════════════════════════
    class ContactForm {
        constructor() {
            this.form = document.getElementById('contactForm');
            this.submitBtn = document.getElementById('submitBtn');
            this.messageDiv = document.getElementById('formMessage');
            this.init();
        }

        init() {
            if (!this.form) return;

            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        async handleSubmit(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || data.name.trim().length < 2) {
                this.showMessage('Por favor ingresa tu nombre', 'error');
                return;
            }
            if (!data.email || !this.validateEmail(data.email)) {
                this.showMessage('Por favor ingresa un correo válido', 'error');
                return;
            }
            if (!data.message || data.message.trim().length < 10) {
                this.showMessage('El mensaje debe tener al menos 10 caracteres', 'error');
                return;
            }

            // Show loading state
            this.setLoading(true);

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    this.showMessage(result.message || '¡Mensaje enviado con éxito!', 'success');
                    this.form.reset();
                    // Track successful submission
                    if (typeof trackContactClick === 'function') {
                        trackContactClick('form_submission');
                    }
                } else {
                    const errorMsg = result.errors ? result.errors.join(', ') : 'Error al enviar el mensaje';
                    this.showMessage(errorMsg, 'error');
                }
            } catch (error) {
                this.showMessage('Error de conexión. Por favor intenta de nuevo.', 'error');
            } finally {
                this.setLoading(false);
            }
        }

        validateEmail(email) {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        setLoading(loading) {
            if (this.submitBtn) {
                this.submitBtn.disabled = loading;
                this.submitBtn.classList.toggle('loading', loading);
            }
        }

        showMessage(text, type) {
            if (this.messageDiv) {
                this.messageDiv.textContent = text;
                this.messageDiv.className = `form-message show ${type}`;

                // Auto-hide after 5 seconds
                setTimeout(() => {
                    this.messageDiv.classList.remove('show');
                }, 5000);
            }
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    // MOBILE AUTO-ANIMATION - Trigger hover effects on visibility for touch devices
    // ════════════════════════════════════════════════════════════════════════
    class MobileAutoAnimation {
        constructor() {
            this.isTouchDevice = window.matchMedia('(hover: none)').matches;
            this.observer = null;
            this.activatedElements = new Set();
            this.init();
        }

        init() {
            // Only run on touch devices
            if (!this.isTouchDevice || CONFIG.prefersReducedMotion) return;

            this.setupObserver();
            this.observeAllElements();
        }

        setupObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.activatedElements.has(entry.target)) {
                        this.activateElement(entry.target);
                        this.activatedElements.add(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1 // Trigger when 10% visible
            });
        }

        observeAllElements() {
            // ALL elements with hover effects
            const selectors = [
                // Cards
                '.project-card',
                '.dev-project-card',
                '.glass-card',
                '.skill-card',
                '.skill-card-platzi',
                '.competency-item',
                '.stat-item',
                // Buttons
                '.btn',
                '.btn-primary',
                '.btn-ghost',
                '.btn-outline',
                '.nav-cta',
                '.cookie-btn',
                '.form-submit',
                // Links
                '.social-link',
                '.contact-link',
                '.hero-social-mobile a',
                '.footer-links a',
                '.cookie-link',
                // Navigation (excluding mobile nav menu)
                '.nav-menu a',
                // Other interactive elements
                '.role-tag',
                '.scroll-indicator',
                '.about-image-frame',
                '.project-view',
                '.education-badge'
            ];

            const elements = document.querySelectorAll(selectors.join(', '));
            elements.forEach(el => {
                this.observer.observe(el);
            });
        }

        activateElement(element) {
            // Small staggered delay
            const delay = Math.random() * 100;
            setTimeout(() => {
                element.classList.add('mobile-activated');
            }, delay);
        }
    }


    // ════════════════════════════════════════════════════════════════════════
    // INITIALIZE ALL MODULES
    // ════════════════════════════════════════════════════════════════════════
    function init() {
        // Hide skeleton loader first
        new SkeletonLoader();

        // Wait for DOM to be fully ready
        new ScrollReveal();
        new StaggerAnimation();
        new HeaderController();
        new MobileNav();
        new SmoothScroll();
        new ParallaxEffect();
        new CursorGlow();
        new CookieConsent();
        new TypewriterEffect();
        new ContactForm();
        new MobileAutoAnimation(); // Auto-activate hover effects on mobile visibility
    }


    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ════════════════════════════════════════════════════════════════════════
    // PERFORMANCE: Lazy load images when they come into view
    // ════════════════════════════════════════════════════════════════════════
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

})();
