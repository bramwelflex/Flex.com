// ===================================
// BOOKING & CALENDAR SYSTEM
// ===================================

class BookingManager {
    constructor() {
        this.bookingForm = document.getElementById('bookingForm');
        this.unavailableDates = this.generateUnavailableDates();
        this.init();
    }

    init() {
        if (this.bookingForm) {
            this.setupDatePicker();
            this.setupFormValidation();
        }
    }

    setupDatePicker() {
        const dateInput = this.bookingForm?.querySelector('input[type="date"]');
        
        if (dateInput) {
            // Set minimum date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = this.formatDate(tomorrow);

            // Set maximum date to 60 days from now
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + 60);
            dateInput.max = this.formatDate(maxDate);

            dateInput.addEventListener('change', (e) => {
                this.validateDate(e.target.value);
            });
        }
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    validateDate(dateString) {
        const selectedDate = new Date(dateString);
        const day = selectedDate.getDay();

        // Check if it's a weekend (0 = Sunday, 6 = Saturday)
        if (day === 0 || day === 6) {
            alert('⚠️ Bookings are only available Monday to Friday');
            this.bookingForm?.querySelector('input[type="date"]').value = '';
            return false;
        }

        // Check if date is unavailable
        if (this.unavailableDates.includes(dateString)) {
            alert('❌ This date is not available. Please choose another date.');
            this.bookingForm?.querySelector('input[type="date"]').value = '';
            return false;
        }

        return true;
    }

    generateUnavailableDates() {
        // Example unavailable dates (in production, fetch from backend)
        const dates = [];
        const today = new Date();
        
        // Add some random unavailable dates
        for (let i = 0; i < 5; i++) {
            const randomDays = Math.floor(Math.random() * 60) + 1;
            const date = new Date(today);
            date.setDate(date.getDate() + randomDays);
            dates.push(this.formatDate(date));
        }
        
        return dates;
    }

    setupFormValidation() {
        const inputs = this.bookingForm?.querySelectorAll('input, select');
        
        inputs?.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('focus', () => {
                input.style.borderColor = 'var(--primary)';
                input.style.boxShadow = '0 0 15px var(--glow)';
            });
        });

        this.bookingForm?.addEventListener('submit', (e) => {
            this.handleBookingSubmit(e);
        });
    }

    validateField(field) {
        let isValid = true;
        const value = field.value.trim();

        if (field.type === 'text' && field.name === '') {
            isValid = value.length >= 2;
        } else if (field.type === 'email') {
            isValid = this.isValidEmail(value);
        } else if (field.type === 'date') {
            isValid = this.validateDate(value);
        } else if (field.tagName === 'SELECT') {
            isValid = value !== '';
        }

        if (!isValid) {
            field.style.borderColor = '#FF4444';
            field.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.3)';
        } else {
            field.style.borderColor = 'rgba(0, 119, 255, 0.3)';
            field.style.boxShadow = 'none';
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleBookingSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.bookingForm?.querySelectorAll('input, select');
        let allValid = true;

        inputs?.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showNotification('❌ Please fill in all fields correctly', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.bookingForm);
        const name = this.bookingForm?.querySelector('input[placeholder="Your Name"]').value;
        const email = this.bookingForm?.querySelector('input[placeholder="Your Email"]').value;
        const service = this.bookingForm?.querySelector('select').value;
        const date = this.bookingForm?.querySelector('input[type="date"]').value;

        // Submit to backend
        try {
            const response = await api.createBooking({
                name,
                email,
                service,
                date
            });

            this.confirmBooking({
                name,
                email,
                service,
                date
            });
        } catch (error) {
            console.error('Booking error:', error);
            this.showNotification('❌ Error submitting booking. Please try again.', 'error');
        }
    }

    confirmBooking(bookingData) {
        // Create confirmation modal
        const modal = this.createConfirmationModal(bookingData);
        document.body.appendChild(modal);

        // Show modal with animation
        setTimeout(() => {
            modal.style.animation = 'modalSlideIn 0.4s ease-out forwards';
        }, 10);

        // Handle confirmation
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            this.processBooking(bookingData, modal);
        });

        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.style.animation = 'fadeIn 0.3s ease-in reverse';
            setTimeout(() => modal.remove(), 300);
        });
    }

    createConfirmationModal(data) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            opacity: 0;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(10, 14, 39, 0.95);
            border: 1px solid rgba(0, 119, 255, 0.3);
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 0 30px rgba(0, 119, 255, 0.3);
        `;

        content.innerHTML = `
            <h2 style="color: #0077FF; margin-bottom: 1rem;">✨ Booking Confirmation</h2>
            <div style="text-align: left; margin: 1.5rem 0; color: #E0E0E0;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Service:</strong> ${data.service}</p>
                <p><strong>Date:</strong> ${new Date(data.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
            </div>
            <p style="color: #A0A0A0; margin-bottom: 1.5rem; font-size: 0.9rem;">
                Please confirm your booking. We'll send you a confirmation email shortly.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="confirm-btn" style="
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(135deg, #00aa00, #00dd00);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                ">Confirm</button>
                <button class="cancel-btn" style="
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    color: #0077FF;
                    border: 2px solid #0077FF;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s;
                ">Cancel</button>
            </div>
        `;

        modal.appendChild(content);
        return modal;
    }

    processBooking(data, modal) {
        // Add success animation
        const content = modal.querySelector('div:last-child');
        content.style.animation = 'pulse 0.5s ease-out';

        // Simulate sending to backend
        setTimeout(() => {
            // Show success message
            this.showNotification('✅ Booking confirmed! Check your email for details.', 'success');

            // Reset form
            this.bookingForm?.reset();

            // Close modal
            modal.style.animation = 'fadeIn 0.4s ease-in reverse';
            setTimeout(() => modal.remove(), 400);

            // Optional: redirect or perform other actions
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1000);
        }, 1000);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        
        const bgColor = type === 'success' ? 
            'linear-gradient(135deg, #00aa00, #00dd00)' : 
            'linear-gradient(135deg, #aa0000, #dd0000)';
        
        const glow = type === 'success' ? 
            'rgba(0, 200, 0, 0.6)' : 
            'rgba(200, 0, 0, 0.6)';

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 0 25px ${glow};
            font-weight: 600;
            z-index: 9999;
            animation: slideDown 0.5s ease-out;
            max-width: 300px;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.5s ease-in reverse';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }
}

// Initialize booking manager
document.addEventListener('DOMContentLoaded', () => {
    const bookingManager = new BookingManager();
});

// Service Package Info
const serviceInfo = {
    branding: {
        name: "Brand Design",
        duration: "2-3 weeks",
        description: "Complete visual identity and logo design",
        includes: ["Logo Design", "Brand Guidelines", "Color Palette", "Typography System"]
    },
    web: {
        name: "Web Design",
        duration: "3-4 weeks",
        description: "Responsive website design and optimization",
        includes: ["Responsive Design", "UI Components", "Prototyping", "Performance Optimization"]
    },
    ui: {
        name: "UI/UX Design",
        duration: "2-3 weeks",
        description: "User interface and experience design",
        includes: ["User Research", "Wireframing", "UI Design", "User Testing"]
    },
    consultation: {
        name: "Design Consultation",
        duration: "1 hour session",
        description: "Strategic design guidance and advice",
        includes: ["Design Review", "Strategy Discussion", "Recommendations", "Next Steps Planning"]
    }
};

// Add service selection visual feedback
document.addEventListener('DOMContentLoaded', () => {
    const serviceSelect = document.querySelector('select');
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            if (this.value && serviceInfo[this.value]) {
                const service = serviceInfo[this.value];
                console.log(`Selected: ${service.name} (${service.duration})`);
            }
        });
    }
});

console.log('%c📅 Booking System Loaded', 'color: #0077FF; font-size: 14px; font-weight: bold;');
