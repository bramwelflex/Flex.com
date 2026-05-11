// ===================================
// ANIMATIONS HANDLER
// ===================================

class AnimationController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupElementAnimations();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, options);

        // Observe all elements with animation attributes
        document.querySelectorAll('[data-aos]').forEach(el => {
            this.observer.observe(el);
        });
    }

    triggerAnimation(element) {
        const animationType = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || '0';
        
        element.style.animationDelay = (parseInt(delay) / 1000) + 's';
        element.style.animation = 'none';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 10);
    }

    setupScrollAnimations() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Parallax effect
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax'));
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Sticky header effect
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (scrolled > 50) {
                    navbar.style.boxShadow = '0 0 20px rgba(0, 119, 255, 0.2)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
            }
        });
    }

    setupElementAnimations() {
        // Button hover animations
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.animation = 'buttonHover 0.4s ease-out forwards';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.animation = 'none';
            });

            btn.addEventListener('click', () => {
                btn.style.animation = 'buttonClick 0.3s ease-out';
            });
        });

        // Card hover animations
        document.querySelectorAll('.service-card, .testimonial-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 0 30px rgba(0, 119, 255, 0.6)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 0 15px rgba(0, 119, 255, 0.2)';
            });
        });

        // Portfolio item animations
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });

            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Form input animations
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.animation = 'inputFocus 0.3s ease-out forwards';
            });

            input.addEventListener('blur', () => {
                input.style.animation = 'none';
            });
        });
    }

    // Trigger animation on specific element
    triggerElementAnimation(element, animationType = 'fadeUp') {
        element.style.animation = `${animationType} 0.6s ease-out forwards`;
    }

    // Batch animate elements with stagger
    staggerElements(elements, animationType = 'fadeUp', delay = 100) {
        elements.forEach((el, index) => {
            setTimeout(() => {
                this.triggerElementAnimation(el, animationType);
            }, delay * index);
        });
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Lazy load images with animation
class LazyLoadImages {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

const lazyLoader = new LazyLoadImages();

// Page transition animations
class PageTransition {
    constructor() {
        this.init();
    }

    init() {
        // Fade in on page load
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
        });
    }

    fadeOut() {
        document.body.style.animation = 'fadeIn 0.5s ease-in reverse';
    }

    fadeIn() {
        document.body.style.animation = 'fadeIn 0.5s ease-out';
    }
}

const pageTransition = new PageTransition();

// Custom scroll behavior with easing
class SmoothScroller {
    constructor() {
        this.isScrolling = false;
    }

    smoothScroll(target, duration = 1000) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const startPosition = window.pageYOffset;
        const targetPosition = target instanceof Element ? 
            target.getBoundingClientRect().top + window.pageYOffset : 
            target;
        const distance = targetPosition - startPosition;
        let start = null;

        const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const scroll = (currentTime) => {
            if (start === null) start = currentTime;
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = easeInOutQuad(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else {
                this.isScrolling = false;
            }
        };

        requestAnimationFrame(scroll);
    }
}

const smoothScroller = new SmoothScroller();

// Particle effects background
class ParticleEffect {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (this.container) {
            this.createParticles();
        }
    }

    createParticles() {
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 5 + 2}px;
                height: ${Math.random() * 5 + 2}px;
                background: rgba(0, 119, 255, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 5}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            this.container.appendChild(particle);
        }
    }
}

// Initialize particle effects (optional - check if container exists)
const particleEffect = new ParticleEffect('.particles');

// Ripple effect on click
class RippleEffect {
    static init() {
        document.querySelectorAll('.btn, .filter-btn, .carousel-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

RippleEffect.init();

// Glitch effect on hover (premium feature)
class GlitchEffect {
    static applyToElement(element) {
        element.addEventListener('mouseenter', function() {
            this.style.textShadow = `
                2px 0 #0077FF,
                -2px 0 #00D4FF,
                0 2px #FF00FF
            `;
        });

        element.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    }
}

// Apply glitch to hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    GlitchEffect.applyToElement(heroTitle);
}

// Scroll percentage indicator (optional feature)
class ScrollIndicator {
    constructor() {
        this.indicator = this.createIndicator();
        this.update();
        window.addEventListener('scroll', () => this.update());
    }

    createIndicator() {
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #0077FF, #00D4FF);
            z-index: 2001;
            box-shadow: 0 0 10px rgba(0, 119, 255, 0.8);
        `;
        document.body.appendChild(div);
        return div;
    }

    update() {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        this.indicator.style.width = scrollPercentage + '%';
    }
}

// Initialize scroll indicator
// const scrollIndicator = new ScrollIndicator(); // Uncomment to enable

console.log('%c✨ Animations Initialized', 'color: #0077FF; font-size: 14px; font-weight: bold;');
