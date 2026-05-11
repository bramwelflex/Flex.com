// ===================================
// DESIGNER PORTFOLIO - MAIN SCRIPT
// ===================================

// Smooth scrolling and page interactions

// Navigation & Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            updateActiveNav();
        }
    });
});

// Update active navigation link
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}
updateActiveNav();

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        mobileToggle.style.transform = navMenu.style.display === 'flex' ? 'rotate(180deg)' : 'rotate(0)';
    });
}

// Portfolio Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Scroll-triggered animations
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Add scroll-reveal class to elements
document.querySelectorAll('.portfolio-item, .service-card, .testimonial-card').forEach((el, index) => {
    el.classList.add('scroll-reveal');
    if (index <= 5) {
        el.classList.add(`stagger-${index % 5 + 1}`);
    }
});

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Check on page load

// Hero Button Actions
document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', function () {
        const action = this.getAttribute('data-action');
        if (action === 'scroll-portfolio') {
            document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'scroll-services') {
            document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Testimonials Carousel
const testimonialCarousel = {
    currentIndex: 0,
    items: [],
    
    init: function() {
        this.items = document.querySelectorAll('.testimonial-card');
        if (this.items.length === 0) return;
        
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());
        
        this.showItem(0);
    },
    
    showItem: function(index) {
        this.items.forEach((item, i) => {
            if (i === index) {
                item.style.animation = 'slideUp 0.5s ease-out forwards';
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        this.currentIndex = index;
    },
    
    next: function() {
        this.showItem((this.currentIndex + 1) % this.items.length);
    },
    
    prev: function() {
        this.showItem((this.currentIndex - 1 + this.items.length) % this.items.length);
    }
};

// Auto-rotate testimonials every 8 seconds
setInterval(() => {
    if (testimonialCarousel.items.length > 0) {
        testimonialCarousel.next();
    }
}, 8000);

testimonialCarousel.init();

// Form Validations & Submissions
const bookingForm = document.getElementById('bookingForm');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(bookingForm, 'Booking confirmed! We will contact you shortly.');
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(contactForm, 'Message sent! Thank you for reaching out.');
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(newsletterForm, 'Successfully subscribed!');
    });
}

async function handleFormSubmit(form, message) {
    const formType = form.id;
    
    try {
        // Collect form data
        const inputs = form.querySelectorAll('input, textarea');
        const data = {};
        
        inputs.forEach(input => {
            if (input.name || input.placeholder) {
                const key = input.name || input.placeholder.toLowerCase().replace(/[^a-z]/g, '');
                data[key] = input.value;
            }
        });

        // Submit based on form type
        if (formType === 'bookingForm') {
            const booking = {
                name: form.querySelector('input[placeholder="Your Name"]')?.value,
                email: form.querySelector('input[placeholder="Your Email"]')?.value,
                service: form.querySelector('select')?.value,
                date: form.querySelector('input[type="date"]')?.value
            };
            await api.createBooking(booking);
        } else if (formType === 'contactForm') {
            const contact = {
                name: form.querySelector('input[placeholder="Your Name"]')?.value,
                email: form.querySelector('input[placeholder="Your Email"]')?.value,
                subject: form.querySelector('input[placeholder="Project Subject"]')?.value,
                message: form.querySelector('textarea')?.value
            };
            await api.submitContact(contact);
        } else if (formType === 'newsletterForm') {
            const email = form.querySelector('input[type="email"]')?.value;
            await api.subscribeNewsletter(email);
        }

        // Add success animation
        const formElements = form.querySelectorAll('input, textarea, select, button');
        formElements.forEach(el => {
            if (el.type !== 'submit') {
                el.style.borderColor = 'var(--primary)';
                el.style.backgroundColor = 'rgba(0, 119, 255, 0.1)';
            }
        });

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00aa00, #00dd00);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 0 25px rgba(0, 200, 0, 0.6);
            font-weight: 600;
            z-index: 9999;
            animation: slideDown 0.5s ease-out;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'slideUp 0.5s ease-in reverse';
            setTimeout(() => successDiv.remove(), 500);
        }, 3000);

        // Reset form after 1 second
        setTimeout(() => {
            form.reset();
            formElements.forEach(el => {
                if (el.type !== 'submit') {
                    el.style.borderColor = 'rgba(0, 119, 255, 0.3)';
                    el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
            });
        }, 1000);
    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #aa0000, #dd0000);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 0 25px rgba(255, 0, 0, 0.6);
            font-weight: 600;
            z-index: 9999;
            animation: slideDown 0.5s ease-out;
        `;
        errorDiv.textContent = error.message || 'An error occurred. Please try again.';
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.style.animation = 'slideUp 0.5s ease-in reverse';
            setTimeout(() => errorDiv.remove(), 500);
        }, 4000);
    }
}

// Parallax scrolling effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(el => {
        const speed = el.getAttribute('data-parallax') || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Mouse follow effect for cursor (optional luxury touch)
const customCursor = document.createElement('div');
customCursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 119, 255, 0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    display: none;
    box-shadow: 0 0 10px rgba(0, 119, 255, 0.4);
`;
document.body.appendChild(customCursor);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    customCursor.style.display = 'block';
    customCursor.style.left = (mouseX - 10) + 'px';
    customCursor.style.top = (mouseY - 10) + 'px';
});

document.addEventListener('mouseleave', () => {
    customCursor.style.display = 'none';
});

// Hover effect on interactive elements
document.querySelectorAll('a, button, .portfolio-item, .service-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        customCursor.style.borderColor = 'rgba(0, 119, 255, 1)';
        customCursor.style.boxShadow = '0 0 20px rgba(0, 119, 255, 0.8)';
        customCursor.style.width = '30px';
        customCursor.style.height = '30px';
    });
    
    el.addEventListener('mouseleave', () => {
        customCursor.style.borderColor = 'rgba(0, 119, 255, 0.6)';
        customCursor.style.boxShadow = '0 0 10px rgba(0, 119, 255, 0.4)';
        customCursor.style.width = '20px';
        customCursor.style.height = '20px';
    });
});

// Page load animations
window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.6s ease-out';
});

// Preload images for smoother experience
function preloadImages() {
    const placeholderImages = document.querySelectorAll('.placeholder-image');
    let loaded = 0;
    
    placeholderImages.forEach(img => {
        img.style.opacity = '1';
        loaded++;
    });
}

setTimeout(preloadImages, 1000);

// Log page performance
console.log('%c🎨 Designer Portfolio Loaded', 'color: #0077FF; font-size: 16px; font-weight: bold;');
console.log('%cEnjoy the smooth interactions and animations!', 'color: #C0C0C0; font-size: 12px;');
