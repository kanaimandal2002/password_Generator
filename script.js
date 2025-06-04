document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordField = document.getElementById('password');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const excludeSimilarCheckbox = document.getElementById('exclude-similar');
    const excludeAmbiguousCheckbox = document.getElementById('exclude-ambiguous');
    const strengthMeterFill = document.getElementById('strength-meter-fill');
    const strengthText = document.getElementById('strength-text').querySelector('span');

    // Character sets
    const characterSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*',
        similar: 'il1Lo0O',
        ambiguous: '{}[]()/\'"`~,;:.<>'
    };

    // Password strength levels
    const strengthLevels = [
        { text: 'Very Weak', color: '#ef233c', width: '20%' },
        { text: 'Weak', color: '#f77f00', width: '40%' },
        { text: 'Medium', color: '#fcbf49', width: '60%' },
        { text: 'Strong', color: '#4cc9f0', width: '80%' },
        { text: 'Very Strong', color: '#2ecc71', width: '100%' }
    ];

    // Initialize app
    function init() {
        // Set initial length value display
        updateLengthDisplay();
        
        // Generate first password
        generatePassword();
        
        // Set up event listeners
        setupEventListeners();
    }

    // Update length value display
    function updateLengthDisplay() {
        lengthValue.textContent = lengthSlider.value;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Slider input
        lengthSlider.addEventListener('input', function() {
            updateLengthDisplay();
            generatePassword();
        });

        // Checkbox changes
        const checkboxes = [
            uppercaseCheckbox, 
            lowercaseCheckbox, 
            numbersCheckbox, 
            symbolsCheckbox,
            excludeSimilarCheckbox,
            excludeAmbiguousCheckbox
        ];
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Ensure at least one character set is selected
                if (!uppercaseCheckbox.checked && 
                    !lowercaseCheckbox.checked && 
                    !numbersCheckbox.checked && 
                    !symbolsCheckbox.checked) {
                    // Default to lowercase if nothing selected
                    lowercaseCheckbox.checked = true;
                }
                generatePassword();
            });
        });

        // Generate button
        generateBtn.addEventListener('click', generatePassword);

        // Copy button
        copyBtn.addEventListener('click', copyToClipboard);

        // Refresh button
        refreshBtn.addEventListener('click', generatePassword);

        // Click on password field to select all
        passwordField.addEventListener('click', function() {
            this.select();
        });
    }

    // Generate password
    function generatePassword() {
        let charset = '';
        let password = '';
        
        // Build character set based on selected options
        if (uppercaseCheckbox.checked) {
            charset += characterSets.uppercase;
        }
        if (lowercaseCheckbox.checked) {
            charset += characterSets.lowercase;
        }
        if (numbersCheckbox.checked) {
            charset += characterSets.numbers;
        }
        if (symbolsCheckbox.checked) {
            charset += characterSets.symbols;
        }
        
        // Remove excluded characters
        if (excludeSimilarCheckbox.checked) {
            for (const char of characterSets.similar) {
                charset = charset.replace(char, '');
            }
        }
        
        if (excludeAmbiguousCheckbox.checked) {
            for (const char of characterSets.ambiguous) {
                charset = charset.replace(char, '');
            }
        }
        
        // Generate password
        const length = parseInt(lengthSlider.value);
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        passwordField.value = password;
        updatePasswordStrength(password);
    }

    // Copy password to clipboard
    function copyToClipboard() {
        if (!passwordField.value) return;
        
        passwordField.select();
        document.execCommand('copy');
        
        // Visual feedback
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.classList.add('copied');
        
        setTimeout(function() {
            copyBtn.innerHTML = '<i class="far fa-copy"></i>';
            copyBtn.classList.remove('copied');
        }, 2000);
    }

    // Calculate password strength
    function updatePasswordStrength(password) {
        let score = 0;
        
        // Length score
        if (password.length >= 12) score += 2;
        else if (password.length >= 8) score += 1;
        
        // Character variety score
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        
        if (hasUppercase) score += 1;
        if (hasLowercase) score += 1;
        if (hasNumbers) score += 1;
        if (hasSymbols) score += 1;
        
        // Cap score at 4 (array index)
        score = Math.min(score, 4);
        
        // Update strength meter
        const strength = strengthLevels[score];
        strengthMeterFill.style.width = strength.width;
        strengthMeterFill.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    }

    // Initialize the app
    init();
});