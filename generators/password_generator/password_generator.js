function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

const settings = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false,
    startWithLetter: false,
    noRepeat: false
};

// Character sets
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similarChars: '0Ol1I',
    ambiguousChars: '{}[]()/\\\'"`~,;.<>'
};

let currentPassword = '';

function toggleOption(option) {
    settings[option] = !settings[option];
    const toggle = document.getElementById(option + 'Toggle');
    toggle.classList.toggle('active');
    
    // Ensure at least one character type is selected
    if (!settings.uppercase && !settings.lowercase && !settings.numbers && !settings.symbols) {
        settings[option] = true;
        toggle.classList.add('active');
        alert('At least one character type must be selected!');
    }
}

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    
    if (length < 4 || length > 128) {
        alert('Password length must be between 4 and 128 characters');
        return;
    }

    let charset = '';
    let requiredChars = '';

    // Build character set and required characters
    if (settings.uppercase) {
        charset += charSets.uppercase;
        requiredChars += getRandomChar(charSets.uppercase);
    }
    if (settings.lowercase) {
        charset += charSets.lowercase;
        requiredChars += getRandomChar(charSets.lowercase);
    }
    if (settings.numbers) {
        charset += charSets.numbers;
        requiredChars += getRandomChar(charSets.numbers);
    }
    if (settings.symbols) {
        charset += charSets.symbols;
        requiredChars += getRandomChar(charSets.symbols);
    }

    // Remove excluded characters
    if (settings.excludeSimilar) {
        charset = charset.split('').filter(char => !charSets.similarChars.includes(char)).join('');
    }
    if (settings.excludeAmbiguous) {
        charset = charset.split('').filter(char => !charSets.ambiguousChars.includes(char)).join('');
    }

    // Generate password
    let password = '';
    
    // Add required characters first
    if (!settings.noRepeat) {
        password += requiredChars;
    }

    // Fill remaining length
    for (let i = password.length; i < length; i++) {
        let char;
        do {
            char = getRandomChar(charset);
        } while (settings.noRepeat && password.includes(char));
        password += char;
    }

    // Shuffle the password
    password = shuffleString(password);

    // Ensure starts with letter if required
    if (settings.startWithLetter) {
        const letters = charSets.uppercase + charSets.lowercase;
        const validLetters = settings.excludeSimilar ? 
            letters.split('').filter(char => !charSets.similarChars.includes(char)).join('') : 
            letters;
        
        if (!/^[a-zA-Z]/.test(password)) {
            const firstLetter = getRandomChar(validLetters);
            password = firstLetter + password.slice(1);
        }
    }

    currentPassword = password;
    displayPassword(password);
    analyzePasswordStrength(password);
}

function getRandomChar(str) {
    return str.charAt(Math.floor(Math.random() * str.length));
}

function shuffleString(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}

function displayPassword(password) {
    const output = document.getElementById('passwordOutput');
    output.textContent = password;
    output.classList.add('has-password');
    
    // Enable action buttons
    document.getElementById('copyButton').disabled = false;
    document.getElementById('downloadButton').disabled = false;
}

function analyzePasswordStrength(password) {
    const length = password.length;
    let score = 0;
    let charTypes = 0;

    // Check character types
    if (/[a-z]/.test(password)) { score += 1; charTypes++; }
    if (/[A-Z]/.test(password)) { score += 1; charTypes++; }
    if (/[0-9]/.test(password)) { score += 1; charTypes++; }
    if (/[^a-zA-Z0-9]/.test(password)) { score += 1; charTypes++; }

    // Length bonus
    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;

    // Calculate entropy
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

    const entropy = Math.log2(Math.pow(charsetSize, length));
    
    // Estimate time to crack (assuming 1 billion guesses per second)
    const combinations = Math.pow(charsetSize, length);
    const secondsToCrack = combinations / 2 / 1000000000;
    
    let timeString = formatTime(secondsToCrack);
    let strengthLevel, strengthClass;

    if (score <= 2) {
        strengthLevel = 'Very Weak';
        strengthClass = 'very-weak';
    } else if (score <= 3) {
        strengthLevel = 'Weak';
        strengthClass = 'weak';
    } else if (score <= 5) {
        strengthLevel = 'Fair';
        strengthClass = 'fair';
    } else if (score <= 6) {
        strengthLevel = 'Good';
        strengthClass = 'good';
    } else {
        strengthLevel = 'Strong';
        strengthClass = 'strong';
    }

    // Update display
    document.getElementById('strengthFill').className = `strength-fill strength-${strengthClass}`;
    document.getElementById('strengthLabel').className = `strength-label strength-${strengthClass}-text`;
    document.getElementById('strengthLabel').textContent = strengthLevel;
    
    document.getElementById('strengthLength').textContent = length + ' characters';
    document.getElementById('strengthTypes').textContent = charTypes + '/4 types';
    document.getElementById('strengthEntropy').textContent = Math.round(entropy) + ' bits';
    document.getElementById('strengthTime').textContent = timeString;
}

function formatTime(seconds) {
    if (seconds < 1) return 'Instantly';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
    if (seconds < 31536000000) return Math.round(seconds / 31536000) + ' years';
    return 'Centuries';
}

function copyPassword() {
    if (!currentPassword) return;
    
    navigator.clipboard.writeText(currentPassword).then(() => {
        showCopiedMessage();
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentPassword;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopiedMessage();
    });
}

function showCopiedMessage() {
    const message = document.getElementById('copiedMessage');
    message.classList.add('show');
    setTimeout(() => {
        message.classList.remove('show');
    }, 1000);
}

function downloadPassword() {
    if (!currentPassword) return;
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const content = `Generated Password: ${currentPassword}\nGenerated on: ${new Date().toLocaleString()}\n\nPassword Settings:\n- Length: ${document.getElementById('passwordLength').value}\n- Uppercase: ${settings.uppercase}\n- Lowercase: ${settings.lowercase}\n- Numbers: ${settings.numbers}\n- Symbols: ${settings.symbols}\n- Exclude Similar: ${settings.excludeSimilar}\n- Exclude Ambiguous: ${settings.excludeAmbiguous}\n- Start with Letter: ${settings.startWithLetter}\n- No Repeat: ${settings.noRepeat}\n\nGenerated by VersaKit Password Generator`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `password-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearPassword() {
    currentPassword = '';
    const output = document.getElementById('passwordOutput');
    output.textContent = 'Click "Generate Password" to create a secure password';
    output.classList.remove('has-password');
    
    // Disable action buttons
    document.getElementById('copyButton').disabled = true;
    document.getElementById('downloadButton').disabled = true;
    
    // Reset strength meter
    document.getElementById('strengthFill').className = 'strength-fill';
    document.getElementById('strengthLabel').className = 'strength-label';
    document.getElementById('strengthLabel').textContent = 'No password generated';
    
    document.getElementById('strengthLength').textContent = '-';
    document.getElementById('strengthTypes').textContent = '-';
    document.getElementById('strengthEntropy').textContent = '-';
    document.getElementById('strengthTime').textContent = '-';
}

