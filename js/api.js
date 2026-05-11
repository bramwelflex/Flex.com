// ===================================
// FRONTEND API INTEGRATION
// ===================================

class PortfolioAPI {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Booking API
    async createBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async getBookings() {
        return this.request('/bookings');
    }

    // Contact API
    async submitContact(contactData) {
        return this.request('/contact', {
            method: 'POST',
            body: JSON.stringify(contactData)
        });
    }

    async getMessages() {
        return this.request('/contact');
    }

    // Newsletter API
    async subscribeNewsletter(email) {
        return this.request('/newsletter/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    }

    async getNewsletter() {
        return this.request('/newsletter');
    }

    // Payment API
    async createPaymentIntent(paymentData) {
        return this.request('/payments/create-intent', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    async confirmPayment(paymentData) {
        return this.request('/payments/confirm', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    async getPayments() {
        return this.request('/payments');
    }

    // Auth API
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async setupAdmin() {
        return this.request('/auth/setup-admin', {
            method: 'POST'
        });
    }
}

// Initialize API instance
const api = new PortfolioAPI('http://localhost:5000/api');

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioAPI;
}
