document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const excludeSimilarCheckbox = document.getElementById('exclude-similar');
    
    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'il1Lo0O';
    
    // Update length value display
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
    
    // Generate password
    generateBtn.addEventListener('click', function() {
        let charset = '';
        let password = '';
        
        if (uppercaseCheckbox.checked) {
            charset += uppercaseChars;
        }
        
        if (lowercaseCheckbox.checked) {
            charset += lowercaseChars;
        }
        
        if (numbersCheckbox.checked) {
            charset += numberChars;
        }
        
        if (symbolsCheckbox.checked) {
            charset += symbolChars;
        }
        
        // If no character sets are selected, use all
        if (charset === '') {
            charset = uppercaseChars + lowercaseChars + numberChars + symbolChars;
            uppercaseCheckbox.checked = true;
            lowercaseCheckbox.checked = true;
            numbersCheckbox.checked = true;
            symbolsCheckbox.checked = true;
        }
        
        // Remove similar characters if option is checked
        if (excludeSimilarCheckbox.checked) {
            for (const char of similarChars) {
                charset = charset.replace(char, '');
            }
        }
        
        // Generate password
        const length = parseInt(lengthSlider.value);
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        passwordField.value = password;
    });
    
    // Copy password to clipboard
    copyBtn.addEventListener('click', function() {
        if (!passwordField.value) return;
        
        passwordField.select();
        document.execCommand('copy');
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#2ecc71';
        
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '#3498db';
        }, 2000);
    });
    
    // Generate a password on page load
    generateBtn.click();
});