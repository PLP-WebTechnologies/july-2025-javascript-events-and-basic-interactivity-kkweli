// JavaScript Events & Basic Interactivity Demo
// This file contains event handlers for various interactive elements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all event listeners
    initializeMouseEvents();
    initializeClickEvents();
    initializeFormEvents();
    initializeKeyboardEvents();
    initializeFocusEvents();
    initializeWindowEvents();
    initializeInteractiveFeatures();  // Part 2: Building Interactive Elements (FAQ, Tabs, Dropdown)
    initializeDynamicContent();

    // Initialize window size display
    updateWindowSize();
    updateScrollPosition();
});

// Mouse Events Section
function initializeMouseEvents() {
    const mouseTarget = document.getElementById('mouse-target');
    const mouseLog = document.getElementById('mouse-log');

    function addMouseLogEntry(event) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('li');
        entry.textContent = `[${timestamp}] ${event.type} at (${event.clientX}, ${event.clientY})`;
        mouseLog.appendChild(entry);

        // Keep only last 10 entries
        while (mouseLog.children.length > 10) {
            mouseLog.removeChild(mouseLog.firstChild);
        }
    }

    mouseTarget.addEventListener('mouseenter', addMouseLogEntry);
    mouseTarget.addEventListener('mouseleave', addMouseLogEntry);
    mouseTarget.addEventListener('mousemove', throttle(addMouseLogEntry, 100));
}

// Click Events Section
function initializeClickEvents() {
    const clickButton = document.getElementById('click-button');
    const doubleClickButton = document.getElementById('double-click-button');
    const toggleButton = document.getElementById('toggle-button');
    const clickCount = document.getElementById('click-count');

    let count = 0;

    clickButton.addEventListener('click', function() {
        count++;
        clickCount.textContent = count;
        this.textContent = `Clicked ${count} time${count !== 1 ? 's' : ''}!`;
    });

    doubleClickButton.addEventListener('dblclick', function() {
        alert('Double-click detected! 🎯');
        this.style.background = 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)';
        setTimeout(() => {
            this.style.background = '';
        }, 500);
    });

    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ?
            'Switch to Light Mode' : 'Toggle Background';
    });
}

// Form Events Section
function initializeFormEvents() {
    const form = document.getElementById('demo-form');
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const messageTextarea = document.getElementById('message-textarea');
    const formLog = document.getElementById('form-log');

    // Custom validation functions (no HTML5 validation)
    function validateEmail(email) {
        // Custom email validation regex pattern
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email.trim());
    }

    function validateName(name) {
        // Name must be at least 2 characters and contain only letters and spaces
        const namePattern = /^[a-zA-Z\s]{2,}$/;
        return name.trim().length >= 2 && namePattern.test(name.trim());
    }

    function validateMessage(message) {
        // Message must be between 10 and 100 characters
        const trimmed = message.trim();
        return trimmed.length >= 10 && trimmed.length <= 100;
    }

    function addFormLogEntry(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('li');
        entry.textContent = `[${timestamp}] ${message}`;
        formLog.appendChild(entry);

        // Auto-scroll to bottom
        formLog.scrollTop = formLog.scrollHeight;
    }

    nameInput.addEventListener('input', function() {
        addFormLogEntry(`Name changed to: "${this.value}"`);

        // Real-time name validation
        if (this.value && !validateName(this.value)) {
            this.style.borderColor = '#dc3545';
            addFormLogEntry('⚠️ Name must be at least 2 characters (letters only)');
        } else if (this.value && validateName(this.value)) {
            this.style.borderColor = '#28a745';
        }
    });

    emailInput.addEventListener('blur', function() {
        if (this.value) {
            if (validateEmail(this.value)) {
                addFormLogEntry('✅ Valid email format');
                this.style.borderColor = '#28a745';
            } else {
                addFormLogEntry('❌ Invalid email format (must be user@domain.com)');
                this.style.borderColor = '#dc3545';
            }
        }
    });

    emailInput.addEventListener('input', function() {
        // Clear validation styling when user starts typing again
        this.style.borderColor = '';
    });

    messageTextarea.addEventListener('input', function() {
        const charCount = this.value.trim().length;
        addFormLogEntry(`Message length: ${charCount}/100 characters`);

        if (this.value && !validateMessage(this.value)) {
            if (charCount < 10) {
                addFormLogEntry('⚠️ Message must be at least 10 characters');
                this.style.borderColor = '#dc3545';
            } else if (charCount > 100) {
                addFormLogEntry('⚠️ Message must be less than 100 characters');
                this.style.borderColor = '#dc3545';
            }
        } else if (this.value && validateMessage(this.value)) {
            this.style.borderColor = '#28a745';
            addFormLogEntry('✅ Message length is valid');
        }
    });

    messageTextarea.addEventListener('keydown', function(e) {
        const length = this.value.length;
        if (length > 100 && e.key !== 'Backspace' && e.key !== 'Delete') {
            e.preventDefault();
            addFormLogEntry('⚠️ Maximum 100 characters reached');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Custom validation for all fields
        let isValid = true;
        let errors = [];

        if (!data.name || !validateName(data.name)) {
            errors.push('❌ Name is required and must be at least 2 characters');
            nameInput.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            nameInput.style.borderColor = '#28a745';
        }

        if (!data.email || !validateEmail(data.email)) {
            errors.push('❌ Valid email is required');
            emailInput.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            emailInput.style.borderColor = '#28a745';
        }

        if (!data.message || !validateMessage(data.message)) {
            errors.push('❌ Message is required (10-100 characters)');
            messageTextarea.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            messageTextarea.style.borderColor = '#28a745';
        }

        if (isValid) {
            addFormLogEntry('✅ Form submitted successfully!');
            addFormLogEntry('📧 Data validated with custom JavaScript validation');
            alert('Form submitted successfully! All custom validations passed.');
            console.log('Validated Form Data:', data);
            this.reset();

            // Reset border colors
            nameInput.style.borderColor = '';
            emailInput.style.borderColor = '';
            messageTextarea.style.borderColor = '';
        } else {
            errors.forEach(error => addFormLogEntry(error));
            addFormLogEntry('❌ Please fix validation errors and try again');
        }
    });
}

// Keyboard Events Section
function initializeKeyboardEvents() {
    const keyboardInput = document.getElementById('keyboard-input');
    const lastKey = document.getElementById('last-key');
    const keyCode = document.getElementById('key-code');
    const keyCount = document.getElementById('key-count');

    let keyPressCount = 0;

    keyboardInput.addEventListener('keydown', function(e) {
        keyCode.textContent = e.keyCode;
        lastKey.textContent = e.key;

        // Special handling for certain keys
        if (e.key === 'Enter') {
            this.value += ' (Enter pressed!) ';
        } else if (e.key === 'Backspace') {
            // Prevent backspace from clearing everything
            e.preventDefault();
            const currentValue = this.value;
            this.value = currentValue.slice(0, -1) + ' (Backspace used) ';
        }
    });

    keyboardInput.addEventListener('keyup', function(e) {
        keyPressCount++;
        keyCount.textContent = keyPressCount;
    });

    keyboardInput.addEventListener('keypress', function(e) {
        // Convert to uppercase
        if (e.key >= 'a' && e.key <= 'z') {
            e.preventDefault();
            this.value += e.key.toUpperCase();
        }
    });
}

// Focus & Blur Events Section
function initializeFocusEvents() {
    const focusInput = document.getElementById('focus-input');
    const focusStatus = document.getElementById('focus-status');

    focusInput.addEventListener('focus', function() {
        focusStatus.textContent = 'Focused';
        focusStatus.className = 'status focused';
        focusInput.style.borderColor = '#28a745';
    });

    focusInput.addEventListener('blur', function() {
        focusStatus.textContent = 'Not Focused';
        focusStatus.className = 'status blurred';
        focusInput.style.borderColor = '#ddd';
    });

    // Additional focus events for visual feedback
    focusInput.addEventListener('focusin', function() {
        console.log('Focus in event triggered');
    });

    focusInput.addEventListener('focusout', function() {
        console.log('Focus out event triggered');
    });
}

// Window Events Section
function initializeWindowEvents() {
    const windowWidth = document.getElementById('window-width');
    const windowHeight = document.getElementById('window-height');
    const scrollPos = document.getElementById('scroll-pos');
    const scrollTopBtn = document.getElementById('scroll-top');

    function updateWindowSize() {
        windowWidth.textContent = window.innerWidth;
        windowHeight.textContent = window.innerHeight;
    }

    function updateScrollPosition() {
        scrollPos.textContent = Math.round(window.scrollY);
    }

    window.addEventListener('resize', throttle(updateWindowSize, 250));
    window.addEventListener('scroll', throttle(updateScrollPosition, 50));

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Load and unload events
    window.addEventListener('load', function() {
        console.log('Page fully loaded');
    });

    window.addEventListener('unload', function() {
        console.log('Page unloading');
    });

    // Page visibility API
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = '👀 Come back!';
        } else {
            document.title = 'JavaScript Events - Basic Interactivity';
        }
    });
}

// Interactive Features Section (FAQ, Tabs, Dropdown)
// Part 3 of Assignment: Building Interactive Elements
function initializeInteractiveFeatures() {
    // FAQ Section - Collapsible components
    initializeFAQ();

    // Tabbed Interface - Switching between content panels
    initializeTabs();

    // Dropdown Menu - Simple dropdown with selection
    initializeDropdown();

    console.log('Interactive Features initialized: FAQ, Tabs, and Dropdown');
}

// Initialize Collapsible FAQ Section
function initializeFAQ() {
    // Get all FAQ toggle buttons
    const faqToggles = document.querySelectorAll('.faq-toggle');

    // Add click event listeners to each FAQ toggle
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Toggle 'active' class on the button
            this.classList.toggle('active');

            // Find the corresponding FAQ content
            const faqContent = this.nextElementSibling;

            // Toggle the 'show' class to expand/collapse content
            faqContent.classList.toggle('show');

            // Log the interaction for learning purposes
            console.log('FAQ toggled:', this.textContent.split(' ')[0]);
        });
    });
}

// Initialize Tabbed Interface
function initializeTabs() {
    // Get tab buttons and panels
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));

            // Add 'active' class to clicked button
            this.classList.add('active');

            // Get the tab ID from the data attribute
            const tabId = this.getAttribute('data-tab');

            // Show the corresponding panel
            const activePanel = document.getElementById(tabId);
            if (activePanel) {
                activePanel.classList.add('active');
            }

            // Log the tab switching for learning
            console.log('Tab switched to:', tabId);
        });
    });

    // Initialize mini interactions within tabs
    initializeMiniMouseDemo();
    initializeMiniClickDemo();
    initializeMiniEmailValidation();
}

// Mini mouse demo inside tabs
function initializeMiniMouseDemo() {
    const miniMouseTarget = document.getElementById('mini-mouse-target');

    if (miniMouseTarget) {
        miniMouseTarget.addEventListener('mouseenter', function() {
            this.textContent = 'Mouse Enter! 🎯';
            console.log('Mini mouse demo: mouseenter event');
        });

        miniMouseTarget.addEventListener('mouseleave', function() {
            this.textContent = 'Hover over me!';
            console.log('Mini mouse demo: mouseleave event');
        });
    }
}

// Mini click demo inside tabs
function initializeMiniClickDemo() {
    const miniClickBtn = document.getElementById('mini-click-demo');
    const miniClickCount = document.getElementById('mini-click-count');

    let miniCount = 0;

    if (miniClickBtn && miniClickCount) {
        miniClickBtn.addEventListener('click', function() {
            miniCount++;
            miniClickCount.textContent = miniCount;
            this.textContent = `Clicked! (${miniCount})`;
            console.log('Mini click demo count:', miniCount);
        });
    }
}

// Mini email validation demo inside tabs
function initializeMiniEmailValidation() {
    const emailInput = document.getElementById('mini-email-validation');
    const validationResult = document.getElementById('validation-result');

    // Custom email validation function (demonstrates Part 3 validation)
    function validateMiniEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    if (emailInput && validationResult) {
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            let message = '';
            let color = '#666';

            if (email === '') {
                message = 'Please enter an email address';
            } else if (validateMiniEmail(email)) {
                message = '✓ Valid email format';
                color = '#28a745';
            } else {
                message = '✗ Invalid email format';
                color = '#dc3545';
            }

            validationResult.textContent = message;
            validationResult.style.color = color;
        });
    }
}

// Initialize Dropdown Menu
function initializeDropdown() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const dropdownSelection = document.getElementById('dropdown-selection');

    // Toggle dropdown visibility
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function() {
            dropdownMenu.classList.toggle('show');
            console.log('Dropdown toggled:', dropdownMenu.classList.contains('show'));
        });

        // Handle dropdown item selection
        dropdownItems.forEach(item => {
            item.addEventListener('click', function() {
                // Update the toggle button text
                dropdownToggle.textContent = this.textContent;

                // Update selection display
                dropdownSelection.textContent = `Selected: ${this.textContent}`;

                // Hide the dropdown
                dropdownMenu.classList.remove('show');

                console.log('Dropdown item selected:', this.textContent);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

// Dynamic Content Section
function initializeDynamicContent() {
    const addItemBtn = document.getElementById('add-item');
    const removeItemBtn = document.getElementById('remove-item');
    const clearAllBtn = document.getElementById('clear-all');
    const dynamicList = document.getElementById('dynamic-list');

    let itemCount = dynamicList.children.length;

    addItemBtn.addEventListener('click', function() {
        itemCount++;
        const li = document.createElement('li');
        li.innerHTML = `Item ${itemCount} <button class="delete-item">❌</button>`;

        // Add delete event to the new button
        const deleteBtn = li.querySelector('.delete-item');
        deleteBtn.addEventListener('click', function() {
            li.remove();
        });

        dynamicList.appendChild(li);

        // Smooth animation
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, 10);
    });

    removeItemBtn.addEventListener('click', function() {
        const lastItem = dynamicList.lastElementChild;
        if (lastItem) {
            lastItem.style.transition = 'all 0.3s ease';
            lastItem.style.opacity = '0';
            lastItem.style.transform = 'translateX(20px)';
            setTimeout(() => lastItem.remove(), 300);
        }
    });

    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all items?')) {
            Array.from(dynamicList.children).forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => item.remove(), 300);
                }, index * 50);
            });
        }
    });

    // Add delete functionality to existing items
    document.querySelectorAll('.delete-item').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.remove();
        });
    });
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update functions called on initialization
function updateWindowSize() {
    const windowWidth = document.getElementById('window-width');
    const windowHeight = document.getElementById('window-height');
    if (windowWidth && windowHeight) {
        windowWidth.textContent = window.innerWidth;
        windowHeight.textContent = window.innerHeight;
    }
}

function updateScrollPosition() {
    const scrollPos = document.getElementById('scroll-pos');
    if (scrollPos) {
        scrollPos.textContent = Math.round(window.scrollY);
    }
}

// Additional features demonstration
console.log('JavaScript Events Demo Loaded!');
console.log('Available features:');
console.log('- Mouse events: hover, move tracking');
console.log('- Click events: single, double-click, counters');
console.log('- Form validation and submission');
console.log('- Keyboard event handling');
console.log('- Focus/blur state management');
console.log('- Window resize and scroll tracking');
console.log('- Dynamic content creation/removal');
console.log('- Event logging and debugging');

// Easter egg
let konamiCode = [];
document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }

    if (konamiCode.join('') === 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') {
        alert('🎉 Konami Code activated! You found the easter egg!');
        document.body.style.background = 'linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff)';
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.background = '';
            document.body.style.animation = '';
        }, 5000);
    }
});
