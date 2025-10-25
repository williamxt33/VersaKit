function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

// Close side menu when clicking outside
document.addEventListener('click', function(event) {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    if (!sideMenu.contains(event.target) && !hamMenu.contains(event.target)) {
        sideMenu.classList.remove('show');
        hamMenu.classList.remove('active');
    }
});
// Morse code dictionary
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', ' ': '/'
};

// Reverse dictionary for morse to text
const textCode = {};
for (let key in morseCode) {
    textCode[morseCode[key]] = key;
}

const textInput = document.getElementById('textInput');
const morseOutput = document.getElementById('morseOutput');
const textCount = document.getElementById('textCount');
const morseCount = document.getElementById('morseCount');

// Update character counts
textInput.addEventListener('input', () => {
    textCount.textContent = `${textInput.value.length} characters`;
    textToMorse();
});

morseOutput.addEventListener('input', () => {
    morseCount.textContent = `${morseOutput.value.length} characters`;
    morseToText();
});

function textToMorse() {
    const text = textInput.value.toUpperCase();
    let morse = '';
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (morseCode[char]) {
            morse += morseCode[char] + ' ';
        } else if (char === ' ') {
            morse += '/ ';
        } else {
            morse += char + ' ';
        }
    }
    
    morseOutput.value = morse.trim();
    morseCount.textContent = `${morseOutput.value.length} characters`;
}

function morseToText() {
    const morse = morseOutput.value.trim();
    const words = morse.split(' / ');
    let text = '';
    
    for (let i = 0; i < words.length; i++) {
        const letters = words[i].split(' ');
        for (let j = 0; j < letters.length; j++) {
            const letter = letters[j];
            if (textCode[letter]) {
                text += textCode[letter];
            } else if (letter !== '') {
                text += letter;
            }
        }
        if (i < words.length - 1) {
            text += ' ';
        }
    }
    
    textInput.value = text;
    textCount.textContent = `${textInput.value.length} characters`;
}

function clearText() {
    textInput.value = '';
    textCount.textContent = '0 characters';
}

function clearMorse() {
    morseOutput.value = '';
    morseCount.textContent = '0 characters';
}


let audioContext;
let isPlaying = false;
let isPaused = false;
let stopRequested = false;
let currentIndex = 0;
let morseSequence = '';


let enableSound = true;
let enableLight = true;
let speedMultiplier = 1.0;
let pitchFrequency = 600;
let volumeLevel = 0.3;


const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const enableSoundCheckbox = document.getElementById('enableSound');
const enableLightCheckbox = document.getElementById('enableLight');
const speedSlider = document.getElementById('speedSlider');
const pitchSlider = document.getElementById('pitchSlider');
const volumeSlider = document.getElementById('volumeSlider');


enableSoundCheckbox.addEventListener('change', (e) => {
    enableSound = e.target.checked;
});

enableLightCheckbox.addEventListener('change', (e) => {
    enableLight = e.target.checked;
});

speedSlider.addEventListener('input', (e) => {
    speedMultiplier = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = `${speedMultiplier.toFixed(1)}x`;
});

pitchSlider.addEventListener('input', (e) => {
    pitchFrequency = parseInt(e.target.value);
    document.getElementById('pitchValue').textContent = `${pitchFrequency} Hz`;
});

volumeSlider.addEventListener('input', (e) => {
    volumeLevel = parseInt(e.target.value) / 100;
    document.getElementById('volumeValue').textContent = `${e.target.value}%`;
});

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(duration) {
    return new Promise((resolve) => {
        if (enableSound) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = pitchFrequency;
            oscillator.type = 'sine';
            
            // Smooth fade in/out to eliminate clicks and pops
            const now = audioContext.currentTime;
            const fadeTime = 0.005; // 5ms fade
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volumeLevel, now + fadeTime);
            gainNode.gain.setValueAtTime(volumeLevel, now + (duration / 1000) - fadeTime);
            gainNode.gain.linearRampToValueAtTime(0, now + (duration / 1000));
            
            oscillator.start(now);
            oscillator.stop(now + (duration / 1000));
        }
        
        setTimeout(resolve, duration);
    });
}

function updateButtonStates(playing, paused) {
    textInput.disabled = playing;
    morseOutput.disabled = playing;

    playBtn.disabled = playing && !paused;
    pauseBtn.disabled = !playing || paused;
    stopBtn.disabled = !playing && !paused;
    
    if (paused) {
        playBtn.textContent = 'Resume';
    } else {
        playBtn.textContent = 'Play';
    }
}

async function playMorse() {
    if (isPaused) {
        // Resume playback
        isPaused = false;
        updateButtonStates(true, false);
        await continueMorsePlayback();
        return;
    }
    
    if (isPlaying) return;
    
    initAudioContext();
    const morse = morseOutput.value.trim();
    if (!morse) return;
    
    isPlaying = true;
    isPaused = false;
    stopRequested = false;
    currentIndex = 0;
    morseSequence = morse;
    
    updateButtonStates(true, false);
    await continueMorsePlayback();
}

async function continueMorsePlayback() {
    const lightIndicator = document.getElementById('lightIndicator');
    
    // Add a display element for highlighted morse
    let morseDisplay = document.getElementById('morseDisplay');
    if (!morseDisplay) {
        morseDisplay = document.createElement('div');
        morseDisplay.id = 'morseDisplay';
        morseDisplay.style.cssText = 'font-family: monospace; padding: 10px; font-size: 16px; min-height: 50px; background: #f5f5f5; border-radius: 4px; margin-top: 10px; white-space: pre-wrap; word-wrap: break-word;';
        morseOutput.parentNode.insertBefore(morseDisplay, morseOutput.nextSibling);
    }

    // Add a display element for highlighted text
    let textDisplay = document.getElementById('textDisplay');
    if (!textDisplay) {
        textDisplay = document.createElement('div');
        textDisplay.id = 'textDisplay';
        textDisplay.style.cssText = 'font-family: monospace; padding: 10px; font-size: 16px; min-height: 50px; background: #f5f5f5; border-radius: 4px; margin-top: 10px; white-space: pre-wrap; word-wrap: break-word;';
        textInput.parentNode.insertBefore(textDisplay, textInput.nextSibling);
    }
    
    const dotDuration = 100 / speedMultiplier;
    const dashDuration = 300 / speedMultiplier;
    const symbolGap = 100 / speedMultiplier;
    const letterGap = 300 / speedMultiplier;
    const wordGap = 700 / speedMultiplier;
    
    // Build mapping between morse and text positions
    const textValue = textInput.value.toUpperCase();
    let morseToTextMap = [];
    let morseIndex = 0;
    
    for (let i = 0; i < textValue.length; i++) {
        const char = textValue[i];
        if (morseCode[char]) {
            const morse = morseCode[char];
            for (let j = 0; j < morse.length; j++) {
                morseToTextMap[morseIndex] = i;
                morseIndex++;
            }
            morseIndex++; // space after morse letter
        } else if (char === ' ') {
            morseToTextMap[morseIndex] = i;
            morseIndex += 2; // '/ ' for word separator
        }
    }
    
    for (let i = currentIndex; i < morseSequence.length; i++) {
        if (stopRequested) break;
        if (isPaused) {
            currentIndex = i;
            return;
        }
        
        const char = morseSequence[i];
        
        // Update morse display with highlighted character
        morseDisplay.innerHTML = morseSequence
            .split('')
            .map((c, j) => j === i ? `<span style="color: #ffffff; font-weight: bold; background: #007bff; padding: 2px 4px; border-radius: 3px;">${c}</span>` : c)
            .join('');
        
        // Update text display with highlighted character
        const currentTextIndex = morseToTextMap[i];

        if (currentTextIndex !== undefined) {
            textDisplay.innerHTML = textValue
                .toLowerCase()
                .split('')
                .map((c, j) => j === currentTextIndex ? `<span style="color: #ffffff;; font-weight: bold; background: #007bff;padding: 2px 4px; border-radius: 3px;">${c}</span>` : c)
                .join(' ');
        }
        
        if (char === '.') {
            if (enableLight) lightIndicator.classList.add('active');
            await playTone(dotDuration);
            if (enableLight) lightIndicator.classList.remove('active');
            await new Promise(resolve => setTimeout(resolve, symbolGap));
        } else if (char === '-') {
            if (enableLight) lightIndicator.classList.add('active');
            await playTone(dashDuration);
            if (enableLight) lightIndicator.classList.remove('active');
            await new Promise(resolve => setTimeout(resolve, symbolGap));
        } else if (char === ' ') {
            await new Promise(resolve => setTimeout(resolve, letterGap));
        } else if (char === '/') {
            await new Promise(resolve => setTimeout(resolve, wordGap));
        }
        
        currentIndex = i + 1;
    }
    
    // Clear highlighting when done
    if (morseDisplay) {
        morseDisplay.remove();
    }

    if (textDisplay) {
        textDisplay.remove();
    }
    
    if (!stopRequested && !isPaused) {
        isPlaying = false;
        isPaused = false;
        currentIndex = 0;
        updateButtonStates(false, false);
    }
}

function pauseMorse() {
    if (!isPlaying || isPaused) return;
    
    isPaused = true;
    const lightIndicator = document.getElementById('lightIndicator');
    if (enableLight) lightIndicator.classList.remove('active');
    updateButtonStates(true, true);
}

function stopMorse() {
    stopRequested = true;
    isPlaying = false;
    isPaused = false;
    currentIndex = 0;
    const lightIndicator = document.getElementById('lightIndicator');
    if (enableLight) lightIndicator.classList.remove('active');
    updateButtonStates(false, false);
}