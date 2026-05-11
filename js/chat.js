// ===================================
// AI CHAT ASSISTANT
// ===================================

class ChatAssistant {
    constructor() {
        this.chatToggle = document.querySelector('.chat-toggle');
        this.chatPanel = document.querySelector('.chat-panel');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.chatClose = document.querySelector('.chat-close');
        this.isOpen = false;
        
        this.predefinedResponses = {
            greeting: [
                "Hey there! 👋 How can I help you today?",
                "Welcome! What can I assist you with?",
                "Hi! Feel free to ask me anything about our services.",
            ],
            services: [
                "I offer a range of services including:\n• Brand Design & Logo Creation\n• Web Design & Development\n• UI/UX Design\n• Digital Consulting",
                "My main services are:\n✨ Brand Identity Design\n🌐 Web Design\n📱 Mobile UI/UX\n💼 Consulting",
            ],
            portfolio: [
                "I have completed over 150 projects across various industries. You can explore my portfolio in the Portfolio section above!",
                "Check out my featured work in the Portfolio section. I specialize in modern, innovative design solutions.",
            ],
            pricing: [
                "My pricing varies based on project scope:\n• Brand Design: $1,500+\n• Web Design: $2,000+\n• UI/UX: $1,800+\n• Consultation: $500/hour",
                "Pricing depends on your specific needs. Would you like to schedule a consultation to discuss your project?",
            ],
            booking: [
                "You can book a service directly using the booking form in the Services section, or feel free to reach out!",
                "I'd love to work with you! Use the booking form to schedule a consultation.",
            ],
            contact: [
                "You can reach me at:\n📧 hello@designer.com\n📞 +1 (555) 123-4567\n📍 San Francisco, CA",
                "Feel free to contact me through the contact form or reach out directly via email!",
            ],
            about: [
                "I'm a designer and creative technologist with 8+ years of experience in crafting beautiful digital experiences.",
                "I specialize in modern UI/UX design, web design, and branding. Passionate about creating meaningful digital experiences.",
            ],
            time: [
                "I'm available for projects! Let's discuss your needs.",
                "I'm actively taking new projects. When would you like to start?",
            ],
            skills: [
                "My key skills include:\n• UI/UX Design\n• Web Design\n• Brand Identity\n• Figma\n• Adobe Creative Suite\n• Interaction Design",
                "I'm proficient in modern design tools and have expertise in user-centered design principles.",
            ],
            help: [
                "I can help with:\n• Questions about services\n• Portfolio inquiries\n• Booking information\n• General design advice\n• Contact details",
                "Feel free to ask me anything! I'm here to help with any questions.",
            ]
        };

        this.init();
    }

    init() {
        if (this.chatToggle) {
            this.chatToggle.addEventListener('click', () => this.toggle());
        }

        if (this.chatClose) {
            this.chatClose.addEventListener('click', () => this.close());
        }

        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => this.handleMessage(e));
        }

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.chatPanel?.contains(e.target) && 
                !this.chatToggle?.contains(e.target) && 
                this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.chatPanel.classList.add('open');
        this.isOpen = true;
        this.chatForm?.querySelector('input')?.focus();
        
        // Add animation
        this.chatPanel.style.animation = 'modalSlideIn 0.4s ease-out';
    }

    close() {
        this.chatPanel.classList.remove('open');
        this.isOpen = false;
        this.chatPanel.style.animation = 'slideUp 0.4s ease-in reverse';
    }

    handleMessage(e) {
        e.preventDefault();
        const input = this.chatForm?.querySelector('input');
        
        if (!input || !input.value.trim()) return;

        const userMessage = input.value.trim();
        
        // Add user message to chat
        this.addMessage(userMessage, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Generate bot response after a delay
        setTimeout(() => {
            this.removeTypingIndicator();
            const botResponse = this.generateResponse(userMessage);
            this.addMessage(botResponse, 'bot');
        }, 1000 + Math.random() * 500);
    }

    addMessage(text, sender) {
        if (!this.chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.style.animation = 'slideUp 0.3s ease-out';

        const p = document.createElement('p');
        p.textContent = text;
        messageDiv.appendChild(p);

        this.chatMessages.appendChild(messageDiv);
        
        // Auto scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        if (!this.chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const p = document.createElement('p');
        p.innerHTML = '<span></span><span></span><span></span>';
        p.style.cssText = `
            display: flex;
            gap: 4px;
        `;
        
        p.querySelectorAll('span').forEach((span, i) => {
            span.style.cssText = `
                width: 8px;
                height: 8px;
                background: #0077FF;
                border-radius: 50%;
                animation: pulse 1.4s infinite;
                animation-delay: ${i * 0.2}s;
            `;
        });

        typingDiv.appendChild(p);
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.style.animation = 'fadeIn 0.3s ease-in reverse';
            setTimeout(() => indicator.remove(), 300);
        }
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Check for keywords
        if (this.matchesKeywords(message, ['hi', 'hello', 'hey', 'greetings'])) {
            return this.getRandomResponse('greeting');
        }
        
        if (this.matchesKeywords(message, ['service', 'services', 'offer', 'what can', 'do you'])) {
            return this.getRandomResponse('services');
        }
        
        if (this.matchesKeywords(message, ['portfolio', 'projects', 'work', 'case', 'examples'])) {
            return this.getRandomResponse('portfolio');
        }
        
        if (this.matchesKeywords(message, ['price', 'pricing', 'cost', 'rate', 'how much'])) {
            return this.getRandomResponse('pricing');
        }
        
        if (this.matchesKeywords(message, ['book', 'booking', 'reserve', 'schedule', 'appointment'])) {
            return this.getRandomResponse('booking');
        }
        
        if (this.matchesKeywords(message, ['contact', 'email', 'phone', 'reach', 'connect'])) {
            return this.getRandomResponse('contact');
        }
        
        if (this.matchesKeywords(message, ['about', 'who', 'tell me', 'yourself', 'experience'])) {
            return this.getRandomResponse('about');
        }
        
        if (this.matchesKeywords(message, ['available', 'busy', 'time', 'when'])) {
            return this.getRandomResponse('time');
        }
        
        if (this.matchesKeywords(message, ['skill', 'tool', 'software', 'use', 'know'])) {
            return this.getRandomResponse('skills');
        }
        
        if (this.matchesKeywords(message, ['help', 'assist', 'support', 'question'])) {
            return this.getRandomResponse('help');
        }
        
        // Default responses for unknown queries
        const defaultResponses = [
            "That's an interesting question! I'm still learning, but feel free to reach out through the contact form for more details.",
            "I appreciate the question! For more information, check out the portfolio or contact me directly.",
            "Great question! You might find the answer in the portfolio or services section above.",
            "Hmm, I'm not sure about that one. Would you like to schedule a consultation to discuss it further?",
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    matchesKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getRandomResponse(category) {
        const responses = this.predefinedResponses[category] || ['Thanks for reaching out!'];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize chat assistant when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const chatAssistant = new ChatAssistant();
});

console.log('%c💬 Chat Assistant Loaded', 'color: #0077FF; font-size: 14px; font-weight: bold;');
