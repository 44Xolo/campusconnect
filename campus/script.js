// Main JavaScript functionality for Campus Connect

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all functionality
function initializeApp() {
    initializeNavigation();
    initializeAnimations();
    initializeForms();
    initializeInteractiveElements();
    initializeMaps();
    initializeGallery();
    initializeSearch();
    
    // Auto-redirect from welcome page after delay
    if (window.location.pathname.includes('welcome.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 4000);
    }
}

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Set current page in navigation
    setCurrentPage();
}

// Set current page in navigation
function setCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('current');
        } else {
            link.classList.remove('current');
        }
    });
}

// Initialize animations
function initializeAnimations() {
    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress') || '0';
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, 500);
    });
    
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.card, section');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });
}

// Initialize all forms
function initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        initializeFormValidation(form);
    });
    
    // Contact form specific functionality
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Enquiry form specific functionality
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', handleEnquiryForm);
    }
    
    // Signup form specific functionality
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupForm);
    }
}

// Form validation
function initializeFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
            showNotification('Please correct the errors in the form.', 'error');
        }
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        setFieldError(field, `${getFieldLabel(field)} is required.`);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setFieldError(field, 'Please enter a valid email address.');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            setFieldError(field, 'Please enter a valid phone number.');
            return false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            setFieldError(field, 'Password must be at least 6 characters long.');
            return false;
        }
    }
    
    // Confirm password validation
    if (field.id === 'confirmPassword' && value) {
        const password = document.getElementById('password');
        if (password && password.value !== value) {
            setFieldError(field, 'Passwords do not match.');
            return false;
        }
    }
    
    return true;
}

// Set field error
function setFieldError(field, message) {
    field.style.borderColor = 'var(--danger)';
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger)';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Get field label
function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : 'This field';
}

// Validate entire form
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    if (!validateForm(this)) return;
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Compose email (in real implementation, this would send to server)
        const emailBody = `
            Name: ${data.name}
            Email: ${data.email}
            Subject: ${data.subject}
            Message: ${data.message}
        `;
        
        console.log('Email would be sent with content:', emailBody);
        
        // Show success message
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Handle enquiry form submission
function handleEnquiryForm(e) {
    e.preventDefault();
    
    if (!validateForm(this)) return;
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate response based on service type
        let response = '';
        switch(data.service) {
            case 'study-groups':
                response = 'Study groups are available for your subject. Cost: Free for students. Next session: Next Monday at 2 PM.';
                break;
            case 'resources':
                response = 'Resource library access granted. You can now browse our collection of 10,000+ resources.';
                break;
            case 'quizzes':
                response = 'Quiz platform activated. You can start with our beginner-level assessments.';
                break;
            case 'mentorship':
                response = 'Mentorship program application received. A mentor will contact you within 48 hours.';
                break;
            default:
                response = 'Thank you for your enquiry. Our team will contact you with more information.';
        }
        
        // Show response in modal
        showModal('Enquiry Response', response);
        
        // Reset form
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Handle signup form submission
function handleSignupForm(e) {
    e.preventDefault();
    
    if (!validateForm(this)) return;
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success animation
        showNotification('Account created successfully! Welcome to Campus Connect.', 'success');
        
        // Redirect to dashboard after delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
        // Reset form
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Initialize interactive elements
function initializeInteractiveElements() {
    initializeAccordions();
    initializeTabs();
    initializeModals();
}

// Accordion functionality
function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        
        header.addEventListener('click', function() {
            // Close all other accordions
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    otherAccordion.classList.remove('active');
                }
            });
            
            // Toggle current accordion
            accordion.classList.toggle('active');
        });
    });
}

// Tab functionality
function initializeTabs() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const headers = container.querySelectorAll('.tab-header');
        const contents = container.querySelectorAll('.tab-content');
        
        headers.forEach((header, index) => {
            header.addEventListener('click', function() {
                // Remove active class from all headers and contents
                headers.forEach(h => h.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked header and corresponding content
                header.classList.add('active');
                if (contents[index]) {
                    contents[index].classList.add('active');
                }
            });
        });
    });
}

// Modal functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    // Close modal when clicking close button
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Show modal function
function showModal(title, content) {
    const modal = document.getElementById('genericModal');
    if (!modal) return;
    
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = content;
    
    modal.style.display = 'flex';
}

// Initialize maps
function initializeMaps() {
    const mapContainers = document.querySelectorAll('.map-container');
    
    if (mapContainers.length > 0 && typeof L !== 'undefined') {
        mapContainers.forEach(container => {
            const mapId = container.getAttribute('id');
            const lat = parseFloat(container.getAttribute('data-lat')) || -26.2041;
            const lng = parseFloat(container.getAttribute('data-lng')) || 28.0473;
            const zoom = parseInt(container.getAttribute('data-zoom')) || 13;
            
            const map = L.map(mapId).setView([lat, lng], zoom);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
            
            // Add marker
            L.marker([lat, lng]).addTo(map)
                .bindPopup('Campus Connect Main Office')
                .openPopup();
        });
    }
}

// Initialize gallery
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (!lightbox) return;
    
    let currentIndex = 0;
    const images = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            images.push(img.src);
            
            item.addEventListener('click', function() {
                currentIndex = index;
                openLightbox();
            });
        }
    });
    
    function openLightbox() {
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        if (lightboxImg && images[currentIndex]) {
            lightboxImg.src = images[currentIndex];
            lightbox.style.display = 'flex';
        }
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
    }
    
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox();
    }
    
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox();
    }
    
    // Lightbox controls
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterContent(searchTerm);
        });
    }
    
    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                filterByCategory(filter);
            });
        });
    }
}

// Filter content by search term
function filterContent(searchTerm) {
    const contentItems = document.querySelectorAll('.card, .service-item');
    
    contentItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter by category
function filterByCategory(category) {
    const contentItems = document.querySelectorAll('.card, .service-item');
    
    contentItems.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            const itemCategory = item.getAttribute('data-category');
            if (itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Utility function for AJAX requests
function makeRequest(url, options = {}) {
    return fetch(url, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : null
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}

// Export functions for global access (if needed)
window.CampusConnect = {
    showNotification,
    showModal,
    validateForm,
    makeRequest
};