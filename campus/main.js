// Campus Connect - Main JavaScript File
// Student: Hlompho Muzi Xolo
// Student Number: St10476575
// Course: WEDE5020 - Web Development (Introduction)

/**
 * Main application initialization and core functionality
 * Implements interactive elements, animations, and dynamic content
 */

// Application namespace
const CampusConnect = {
    // Configuration
    config: {
        apiBaseUrl: 'https://api.campusconnect.ac.za/v1',
        mapDefaults: {
            center: [-26.2041, 28.0473], // Johannesburg coordinates
            zoom: 13,
            maxZoom: 18
        },
        animation: {
            duration: 300,
            easing: 'ease-in-out'
        },
        localStorageKeys: {
            userPreferences: 'cc_user_preferences',
            formData: 'cc_form_data_',
            searchHistory: 'cc_search_history'
        }
    },

    // State management
    state: {
        currentUser: null,
        isMobile: false,
        isLoading: false,
        activeModals: [],
        searchResults: []
    },

    // Initialize application
    init() {
        console.log('🚀 Campus Connect Initializing...');
        
        this.detectEnvironment();
        this.initializeComponents();
        this.setupEventListeners();
        this.loadUserPreferences();
        this.initializeServiceWorker();
        
        console.log('✅ Campus Connect Initialized Successfully');
    },

    // Environment detection
    detectEnvironment() {
        this.state.isMobile = window.innerWidth <= 768;
        this.state.isTouchDevice = 'ontouchstart' in window;
        
        // Add environment classes to body
        if (this.state.isMobile) {
            document.body.classList.add('is-mobile');
        }
        if (this.state.isTouchDevice) {
            document.body.classList.add('is-touch-device');
        }
    },

    // Initialize all components
    initializeComponents() {
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeInteractiveElements();
        this.initializeForms();
        this.initializeSearch();
        this.initializeMaps();
        this.initializeGallery();
        this.initializeNotifications();
        this.initializeProgressTracking();
        this.initializeDynamicContent();
    },

    // Navigation functionality
    initializeNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu(hamburger, navMenu);
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Set active navigation based on current page
        this.setActiveNavigation();
    },

    toggleMobileMenu(hamburger, navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    },

    setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage) {
                link.classList.add('current');
                link.setAttribute('aria-current', 'page');
            }
        });
    },

    // Animation system
    initializeAnimations() {
        // Initialize AOS (Animate On Scroll) if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }

        // Custom scroll animations
        this.initializeScrollAnimations();
        
        // Progress bar animations
        this.animateProgressBars();
        
        // Loading animations
        this.initializeLoadingStates();
    },

    initializeScrollAnimations() {
        const animatedElements = document.querySelectorAll('.card, .service-item, .feature-card');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    },

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress') || '0';
            const duration = parseInt(bar.getAttribute('data-duration')) || 1000;
            
            setTimeout(() => {
                bar.style.width = progress + '%';
                bar.setAttribute('aria-valuenow', progress);
            }, 500);
        });
    },

    initializeLoadingStates() {
        // Add loading class to body during page transitions
        window.addEventListener('beforeunload', () => {
            document.body.classList.add('page-loading');
        });
        
        window.addEventListener('load', () => {
            document.body.classList.remove('page-loading');
        });
    },

    // Interactive elements
    initializeInteractiveElements() {
        this.initializeAccordions();
        this.initializeTabs();
        this.initializeModals();
        this.initializeTooltips();
    },

    initializeAccordions() {
        const accordions = document.querySelectorAll('.accordion');
        
        accordions.forEach(accordion => {
            const header = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            
            header.addEventListener('click', () => {
                const isActive = accordion.classList.contains('active');
                
                // Close all other accordions in the same group
                if (!accordion.hasAttribute('data-allow-multiple')) {
                    const group = accordion.closest('.accordion-group') || document;
                    group.querySelectorAll('.accordion').forEach(other => {
                        if (other !== accordion) {
                            other.classList.remove('active');
                            other.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
                
                // Toggle current accordion
                accordion.classList.toggle('active');
                const isNowActive = accordion.classList.contains('active');
                
                // Update ARIA attributes
                header.setAttribute('aria-expanded', isNowActive.toString());
                content.setAttribute('aria-hidden', (!isNowActive).toString());
                
                // Animate height
                if (isNowActive) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = '0';
                }
            });
            
            // Initialize ARIA attributes
            header.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
        });
    },

    initializeTabs() {
        const tabContainers = document.querySelectorAll('.tabs');
        
        tabContainers.forEach(container => {
            const headers = container.querySelectorAll('.tab-header');
            const contents = container.querySelectorAll('.tab-content');
            
            headers.forEach((header, index) => {
                header.addEventListener('click', () => {
                    // Update headers
                    headers.forEach(h => {
                        h.classList.remove('active');
                        h.setAttribute('aria-selected', 'false');
                    });
                    header.classList.add('active');
                    header.setAttribute('aria-selected', 'true');
                    
                    // Update contents
                    contents.forEach(content => content.classList.remove('active'));
                    if (contents[index]) {
                        contents[index].classList.add('active');
                    }
                    
                    // Dispatch custom event
                    container.dispatchEvent(new CustomEvent('tabChange', {
                        detail: { index, header: header.textContent }
                    }));
                });
                
                // Initialize ARIA attributes
                header.setAttribute('role', 'tab');
                header.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            });
            
            contents.forEach((content, index) => {
                content.setAttribute('role', 'tabpanel');
                content.setAttribute('aria-labelledby', headers[index]?.id || '');
            });
        });
    },

    initializeModals() {
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            const openTriggers = document.querySelectorAll(`[data-modal-target="${modal.id}"]`);
            
            // Open modal triggers
            openTriggers.forEach(trigger => {
                trigger.addEventListener('click', () => {
                    this.openModal(modal);
                });
            });
            
            // Close button
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }
            
            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.activeModals.length > 0) {
                this.closeModal(this.state.activeModals[this.state.activeModals.length - 1]);
            }
        });
    },

    openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.state.activeModals.push(modal);
        
        // Focus management
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        // Dispatch event
        modal.dispatchEvent(new CustomEvent('modalOpen'));
    },

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        this.state.activeModals = this.state.activeModals.filter(m => m !== modal);
        
        // Dispatch event
        modal.dispatchEvent(new CustomEvent('modalClose'));
    },

    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.setAttribute('role', 'tooltip');
            
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', () => {
                tooltip.classList.add('visible');
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
            
            element.addEventListener('focus', () => {
                tooltip.classList.add('visible');
            });
            
            element.addEventListener('blur', () => {
                tooltip.classList.remove('visible');
            });
        });
    },

    // Form handling
    initializeForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
            
            // Form submission
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e, form);
            });
            
            // Auto-save for longer forms
            if (form.hasAttribute('data-autosave')) {
                this.initializeFormAutoSave(form);
            }
        });
        
        // Character counters
        this.initializeCharacterCounters();
        
        // Password strength meters
        this.initializePasswordStrength();
    },

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        
        // Custom validation patterns
        if (field.hasAttribute('pattern') && value) {
            const pattern = new RegExp(field.getAttribute('pattern'));
            if (!pattern.test(value)) {
                isValid = false;
                errorMessage = field.getAttribute('data-error-message') || 'Invalid format';
            }
        }
        
        // Update field state
        if (!isValid) {
            this.setFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    },

    setFieldError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    },

    clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    },

    async handleFormSubmit(e, form) {
        e.preventDefault();
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('Please correct the errors in the form.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        this.setLoadingState(submitBtn, true);
        
        try {
            // Prepare form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Form-specific handling
            if (form.id === 'contactForm') {
                await this.handleContactForm(data);
            } else if (form.id === 'enquiryForm') {
                await this.handleEnquiryForm(data);
            } else if (form.id === 'signupForm') {
                await this.handleSignupForm(data);
            } else {
                await this.handleGenericForm(data, form);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('An error occurred. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false, originalText);
        }
    },

    setLoadingState(element, isLoading, originalText = null) {
        if (isLoading) {
            element.disabled = true;
            element.setAttribute('data-original-text', element.textContent);
            element.textContent = 'Processing...';
            element.classList.add('loading');
        } else {
            element.disabled = false;
            element.textContent = originalText || element.getAttribute('data-original-text') || 'Submit';
            element.classList.remove('loading');
        }
    },

    async handleContactForm(data) {
        // Simulate API call
        await this.simulateApiCall();
        
        // Compose email (in real implementation, this would send to server)
        const emailBody = this.generateEmailTemplate('contact', data);
        console.log('Contact email content:', emailBody);
        
        this.showNotification('Message sent successfully! We will get back to you soon.', 'success');
        document.getElementById('contactForm').reset();
    },

    async handleEnquiryForm(data) {
        await this.simulateApiCall();
        
        // Generate response based on service type
        const response = this.generateEnquiryResponse(data);
        
        // Show response in modal
        this.showModal('Enquiry Response', response);
        document.getElementById('enquiryForm').reset();
    },

    async handleSignupForm(data) {
        await this.simulateApiCall();
        
        // Store user data (in real app, this would be sent to backend)
        localStorage.setItem('cc_user_data', JSON.stringify(data));
        
        this.showNotification('Account created successfully! Welcome to Campus Connect.', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    },

    async handleGenericForm(data, form) {
        await this.simulateApiCall();
        this.showNotification('Form submitted successfully!', 'success');
        form.reset();
    },

    generateEmailTemplate(type, data) {
        const templates = {
            contact: `
                New Contact Form Submission
                ==========================
                Name: ${data.name}
                Email: ${data.email}
                Subject: ${data.subject}
                Message: ${data.message}
                
                Submitted: ${new Date().toLocaleString()}
            `,
            enquiry: `
                Service Enquiry
                ==============
                Name: ${data.name}
                Email: ${data.email}
                Service: ${data.service}
                Message: ${data.message}
                
                Submitted: ${new Date().toLocaleString()}
            `
        };
        
        return templates[type] || JSON.stringify(data, null, 2);
    },

    generateEnquiryResponse(data) {
        const responses = {
            'study-groups': {
                title: 'Study Groups Available',
                message: 'Study groups are available for your subject. Our next session is scheduled for Monday at 2 PM. You will receive an email with joining instructions.',
                cost: 'Free for registered students',
                availability: 'High'
            },
            'resources': {
                title: 'Resource Access Granted',
                message: 'You now have access to our comprehensive resource library with 10,000+ academic materials. Browse by subject or use the search functionality to find specific resources.',
                cost: 'Free access',
                availability: 'Immediate'
            },
            'quizzes': {
                title: 'Quiz Platform Activated',
                message: 'Your quiz account has been activated. Start with our beginner-level assessments and track your progress over time.',
                cost: 'Free',
                availability: '24/7 Access'
            },
            'mentorship': {
                title: 'Mentorship Application Received',
                message: 'Thank you for your interest in our mentorship program. A suitable mentor will contact you within 48 hours to schedule your first session.',
                cost: 'Free for first 3 sessions',
                availability: 'Based on mentor availability'
            }
        };
        
        const response = responses[data.service] || {
            title: 'Enquiry Received',
            message: 'Thank you for your enquiry. Our team will review your request and contact you within 24 hours.'
        };
        
        return `
            <div class="enquiry-response">
                <h3>${response.title}</h3>
                <p>${response.message}</p>
                ${response.cost ? `<p><strong>Cost:</strong> ${response.cost}</p>` : ''}
                ${response.availability ? `<p><strong>Availability:</strong> ${response.availability}</p>` : ''}
            </div>
        `;
    },

    simulateApiCall() {
        return new Promise(resolve => {
            setTimeout(resolve, 1500 + Math.random() * 1000);
        });
    },

    // Search functionality
    initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchForm = document.querySelector('.search-form');
        
        if (searchInput) {
            // Real-time search
            searchInput.addEventListener('input', this.debounce(() => {
                this.performSearch(searchInput.value);
            }, 300));
            
            // Search history
            this.initializeSearchHistory(searchInput);
        }
        
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch(searchInput.value, true);
            });
        }
        
        // Filter functionality
        this.initializeFilters();
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    async performSearch(query, isFormSubmit = false) {
        if (!query.trim()) {
            this.clearSearchResults();
            return;
        }
        
        this.showLoadingIndicator('.search-results');
        
        try {
            // Simulate API search
            const results = await this.simulateSearch(query);
            this.displaySearchResults(results, query);
            
            // Save to search history
            if (isFormSubmit) {
                this.saveToSearchHistory(query);
            }
            
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Search failed. Please try again.', 'error');
        } finally {
            this.hideLoadingIndicator('.search-results');
        }
    },

    async simulateSearch(query) {
        await this.simulateApiCall();
        
        // Mock search results
        const mockData = [
            { id: 1, title: 'Study Group: Computer Science 101', type: 'study-group', relevance: 0.95 },
            { id: 2, title: 'Resource: JavaScript Programming Guide', type: 'resource', relevance: 0.88 },
            { id: 3, title: 'Quiz: Web Development Fundamentals', type: 'quiz', relevance: 0.82 },
            { id: 4, title: 'Mentor: Senior Software Engineer Available', type: 'mentorship', relevance: 0.76 }
        ];
        
        return mockData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => b.relevance - a.relevance);
    },

    displaySearchResults(results, query) {
        const resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) return;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No results found for "${query}"</p>
                    <p>Try different keywords or browse our categories</p>
                </div>
            `;
            return;
        }
        
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item" data-type="${result.type}">
                <h4>${result.title}</h4>
                <span class="result-type">${this.formatResultType(result.type)}</span>
                <p>Relevance: ${Math.round(result.relevance * 100)}%</p>
                <button class="btn btn-small" onclick="CampusConnect.viewResult(${result.id})">
                    View Details
                </button>
            </div>
        `).join('');
        
        resultsContainer.classList.add('has-results');
    },

    formatResultType(type) {
        const types = {
            'study-group': 'Study Group',
            'resource': 'Resource',
            'quiz': 'Quiz',
            'mentorship': 'Mentorship'
        };
        return types[type] || type;
    },

    viewResult(resultId) {
        this.showModal('Result Details', `Details for result #${resultId} would appear here.`);
    },

    clearSearchResults() {
        const resultsContainer = document.querySelector('.search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            resultsContainer.classList.remove('has-results');
        }
    },

    initializeSearchHistory(input) {
        const history = this.getSearchHistory();
        
        input.addEventListener('focus', () => {
            this.showSearchHistory(history, input);
        });
        
        input.addEventListener('blur', () => {
            setTimeout(() => this.hideSearchHistory(), 200);
        });
    },

    getSearchHistory() {
        return JSON.parse(localStorage.getItem(this.config.localStorageKeys.searchHistory) || '[]');
    },

    saveToSearchHistory(query) {
        const history = this.getSearchHistory();
        const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
        localStorage.setItem(this.config.localStorageKeys.searchHistory, JSON.stringify(newHistory));
    },

    showSearchHistory(history, input) {
        // Implementation for showing search history dropdown
    },

    hideSearchHistory() {
        // Implementation for hiding search history dropdown
    },

    initializeFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.applyFilter(filter, btn);
            });
        });
    },

    applyFilter(filter, clickedBtn) {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
        
        // Filter content
        const items = document.querySelectorAll('.filterable-item');
        items.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('filterApplied', {
            detail: { filter }
        }));
    },

    // Map functionality
    initializeMaps() {
        if (typeof L !== 'undefined') {
            this.initializeCampusMaps();
        }
    },

    initializeCampusMaps() {
        const mapContainers = document.querySelectorAll('.map-container');
        
        mapContainers.forEach(container => {
            const mapId = container.id;
            const lat = parseFloat(container.getAttribute('data-lat')) || this.config.mapDefaults.center[0];
            const lng = parseFloat(container.getAttribute('data-lng')) || this.config.mapDefaults.center[1];
            const zoom = parseInt(container.getAttribute('data-zoom')) || this.config.mapDefaults.zoom;
            
            const map = L.map(mapId).setView([lat, lng], zoom);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: this.config.mapDefaults.maxZoom
            }).addTo(map);
            
            // Add campus markers
            this.addCampusMarkers(map);
        });
    },

    addCampusMarkers(map) {
        const campuses = [
            {
                name: 'Johannesburg Campus',
                position: [-26.2041, 28.0473],
                description: 'Student Hub, Parktown<br>Open: Mon-Fri 8:00-17:00'
            },
            {
                name: 'Cape Town Campus',
                position: [-33.9249, 18.4241],
                description: 'Learning Centre, Gardens<br>Open: Mon-Fri 8:00-17:00'
            }
        ];
        
        campuses.forEach(campus => {
            L.marker(campus.position).addTo(map)
                .bindPopup(`
                    <div class="map-popup">
                        <h4>${campus.name}</h4>
                        <p>${campus.description}</p>
                        <button class="btn btn-small" onclick="CampusConnect.getDirections(${campus.position[0]}, ${campus.position[1]})">
                            Get Directions
                        </button>
                    </div>
                `);
        });
    },

    getDirections(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    },

    // Gallery functionality
    initializeGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;
        
        this.initializeLightbox();
    },

    initializeLightbox() {
        // Implementation for lightbox functionality
    },

    // Notification system
    initializeNotifications() {
        // Notification container will be created on demand
    },

    showNotification(message, type = 'info', duration = 5000) {
        // Create notification container if it doesn't exist
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    &times;
                </button>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        }
        
        return notification;
    },

    // Progress tracking
    initializeProgressTracking() {
        // Implementation for user progress tracking
    },

    // Dynamic content loading
    initializeDynamicContent() {
        // Implementation for loading dynamic content
    },

    // Utility methods
    initializeFormAutoSave(form) {
        // Implementation for form auto-saving
    },

    initializeCharacterCounters() {
        // Implementation for character counters
    },

    initializePasswordStrength() {
        // Implementation for password strength meters
    },

    showLoadingIndicator(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('loading');
        }
    },

    hideLoadingIndicator(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.remove('loading');
        }
    },

    // User preferences
    loadUserPreferences() {
        const preferences = localStorage.getItem(this.config.localStorageKeys.userPreferences);
        if (preferences) {
            try {
                const prefs = JSON.parse(preferences);
                this.applyUserPreferences(prefs);
            } catch (error) {
                console.error('Error loading user preferences:', error);
            }
        }
    },

    applyUserPreferences(preferences) {
        // Apply theme
        if (preferences.theme) {
            document.documentElement.setAttribute('data-theme', preferences.theme);
        }
        
        // Apply other preferences
        if (preferences.reduceAnimations) {
            document.body.classList.add('reduce-motion');
        }
    },

    saveUserPreferences(preferences) {
        const current = JSON.parse(localStorage.getItem(this.config.localStorageKeys.userPreferences) || '{}');
        const updated = { ...current, ...preferences };
        localStorage.setItem(this.config.localStorageKeys.userPreferences, JSON.stringify(updated));
    },

    // Service worker for PWA functionality
    initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    },

    // Event listeners
    setupEventListeners() {
        // Window resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Online/offline detection
        window.addEventListener('online', () => {
            this.showNotification('Connection restored', 'success', 3000);
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('You are currently offline', 'warning', 0);
        });
        
        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });
    },

    handleResize() {
        this.state.isMobile = window.innerWidth <= 768;
        
        // Update body classes
        if (this.state.isMobile) {
            document.body.classList.add('is-mobile');
            document.body.classList.remove('is-desktop');
        } else {
            document.body.classList.add('is-desktop');
            document.body.classList.remove('is-mobile');
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('layoutChange', {
            detail: { isMobile: this.state.isMobile }
        }));
    },

    handlePageHidden() {
        // Pause animations or videos when page is not visible
    },

    handlePageVisible() {
        // Resume animations or videos when page becomes visible
    },

    // Public API methods
    openModalById(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.openModal(modal);
        }
    },

    closeAllModals() {
        this.state.activeModals.forEach(modal => {
            this.closeModal(modal);
        });
    },

    // Error handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        this.showNotification(
            'Something went wrong. Please try again.',
            'error',
            5000
        );
        
        // Log to analytics in production
        if (window.ga) {
            window.ga('send', 'exception', {
                exDescription: `${context}: ${error.message}`,
                exFatal: false
            });
        }
    }
};

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CampusConnect.init());
} else {
    CampusConnect.init();
}

// Make CampusConnect available globally
window.CampusConnect = CampusConnect;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CampusConnect;
}