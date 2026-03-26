/* ============================================
   TREPPCO — Electromecánica Industrial — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Hero Slider ----
    initHeroSlider();

    // ---- Navbar scroll ----
    const navbar = document.getElementById('navbar');
    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // ---- Mobile menu ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    let backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active', isActive);
        backdrop.classList.toggle('active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Intersection Observer for scroll animations ----
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.animate-on-scroll');
                let delay = 0;

                siblings.forEach((sib, i) => {
                    if (sib === entry.target) {
                        delay = i * 80;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, Math.min(delay, 400));

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ---- FAQ Accordion ----
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ---- Form Handling ----
    const handleFormSubmit = (formId, btnId, wrapSelector) => {
        const form = document.getElementById(formId);
        const submitBtn = document.getElementById(btnId);

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const btnText = submitBtn.querySelector('.btn-text');
                const btnLoader = submitBtn.querySelector('.btn-loader');

                btnText.style.display = 'none';
                btnLoader.style.display = 'inline-flex';
                submitBtn.disabled = true;

                setTimeout(() => {
                    const formWrap = submitBtn.closest(wrapSelector);
                    formWrap.innerHTML = `
                        <div class="form-success">
                            <div class="form-success-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3>¡Solicitud enviada!</h3>
                            <p>Nuestro equipo técnico se pondrá en contacto con usted dentro de las próximas 24 horas hábiles.</p>
                        </div>
                    `;
                }, 1500);
            });
        }
    };

    handleFormSubmit('presupuestoForm', 'presSubmitBtn', '.presupuesto-form-wrap');
    handleFormSubmit('contactForm', 'submitBtn', '.cta-form-wrap');

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const highlightNav = () => {
        const scrollPos = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

});

/* ---- Hero Slider Logic ---- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const progressBar = document.querySelector('.slider-progress-bar');
    const heroSlider = document.querySelector('.hero-slider');

    if (!slides.length) return;

    let currentSlide = 0;
    let progressInterval = null;
    let progress = 0;
    const SLIDE_DURATION = 6000;
    const TICK = 50;

    function goToSlide(index) {
        // Remove active from current
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

        currentSlide = index;

        // Activate new slide
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');

        // Reset progress
        progress = 0;
        if (progressBar) progressBar.style.width = '0%';
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoplay() {
        stopAutoplay();
        progressInterval = setInterval(() => {
            progress += TICK;
            const pct = (progress / SLIDE_DURATION) * 100;
            if (progressBar) progressBar.style.width = pct + '%';

            if (progress >= SLIDE_DURATION) {
                nextSlide();
            }
        }, TICK);
    }

    function stopAutoplay() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.slide);
            if (index !== currentSlide) {
                goToSlide(index);
            }
            startAutoplay();
        });
    });

    // Hover pause
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoplay);
        heroSlider.addEventListener('mouseleave', startAutoplay);
    }

    // Touch swipe support
    let touchStartX = 0;

    if (heroSlider) {
        heroSlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSlider.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide((currentSlide + 1) % slides.length);
                } else {
                    goToSlide((currentSlide - 1 + slides.length) % slides.length);
                }
                startAutoplay();
            }
        }, { passive: true });
    }

    // Start autoplay
    startAutoplay();
}