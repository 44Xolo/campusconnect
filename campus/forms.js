// Enhanced form functionality for Campus Connect

// Form data persistence
function saveFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

function loadFormData(formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    const form = document.getElementById(formId);
    
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && data[key]) {
            input.value = data[key];
        }
    });
}

// Auto-save form data
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form[data-autosave]');
    forms.forEach(form => {
        const formId = form.id || `form_${Date.now()}`;
        form.id = formId;
        
        // Load saved data
        loadFormData(formId);
        
        // Auto-save on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                saveFormData(formId);
            });
        });
    });
});

// Character counter for textareas
function initializeCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[data-maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('data-maxlength'));
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.fontSize = '0.875rem';
        counter.style.color = '#6c757d';
        counter.style.marginTop = '0.25rem';
        
        textarea.parentNode.appendChild(counter);
        
        function updateCounter() {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = 'var(--warning)';
            } else if (currentLength > maxLength) {
                counter.style.color = 'var(--danger)';
            } else {
                counter.style.color = '#6c757d';
            }
        }
        
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    });
}

// Password strength meter
function initializePasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        const meter = document.createElement('div');
        meter.className = 'password-strength';
        meter.style.height = '4px';
        meter.style.marginTop = '0.5rem';
        meter.style.borderRadius = '2px';
        meter.style.transition = 'all 0.3s ease';
        
        input.parentNode.appendChild(meter);
        
        input.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updatePasswordMeter(meter, strength);
        });
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    return strength;
}

function updatePasswordMeter(meter, strength) {
    const colors = ['#dc3545', '#ffc107', '#17a2b8', '#28a745'];
    const width = (strength / 4) * 100;
    
    meter.style.width = `${width}%`;
    meter.style.backgroundColor = colors[Math.min(strength, colors.length - 1)];
}

// Initialize enhanced form features
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCounters();
    initializePasswordStrength();
});