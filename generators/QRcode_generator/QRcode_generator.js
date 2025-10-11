function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}


let currentQR = null;

function changeQRType() {
    const type = document.getElementById('qrType').value;
    
    // Hide all specific input fields
    document.getElementById('textInput').classList.add('hidden');
    document.getElementById('wifiFields').classList.add('hidden');
    document.getElementById('emailFields').classList.add('hidden');
    document.getElementById('vcardFields').classList.add('hidden');
    
    // Show relevant fields based on type
    switch(type) {
        case 'text':
        case 'url':
        case 'phone':
        case 'sms':
            document.getElementById('textInput').classList.remove('hidden');
            updatePlaceholder(type);
            break;
        case 'wifi':
            document.getElementById('wifiFields').classList.remove('hidden');
            break;
        case 'email':
            document.getElementById('emailFields').classList.remove('hidden');
            break;
        case 'vcard':
            document.getElementById('vcardFields').classList.remove('hidden');
            break;
    }
}

function updatePlaceholder(type) {
    const textarea = document.getElementById('qrContent');
    const placeholders = {
        'text': 'Enter your text here...',
        'url': 'https://example.com',
        'phone': '+1234567890',
        'sms': '+1234567890'
    };
    textarea.placeholder = placeholders[type] || 'Enter your text here...';
}

function updateColorValue(colorType) {
    const picker = document.getElementById(colorType);
    const value = document.getElementById(colorType + 'Value');
    value.value = picker.value.toUpperCase();
}

function updateColorPicker(colorType) {
    const picker = document.getElementById(colorType);
    const value = document.getElementById(colorType + 'Value');
    if (/^#[0-9A-F]{6}$/i.test(value.value)) {
        picker.value = value.value;
    }
}

function generateQR() {
    const type = document.getElementById('qrType').value;
    let content = getContentByType(type);
    
    if (!content.trim()) {
        alert('Please enter content for your QR code');
        return;
    }

    const size = parseInt(document.getElementById('qrSize').value);
    const level = document.getElementById('qrLevel').value;
    const foreground = document.getElementById('qrForeground').value;
    const background = document.getElementById('qrBackground').value;

    // Create QR code
    try {
        const canvas = document.createElement('canvas');
        currentQR = new QRious({
            element: canvas,
            value: content,
            size: size,
            level: level,
            foreground: foreground,
            background: background
        });

        // Display the QR code
        const container = document.getElementById('qrCanvasContainer');
        container.innerHTML = '';
        canvas.classList.add('qr-canvas');
        container.appendChild(canvas);

        // Enable download buttons
        document.getElementById('downloadPNG').disabled = false;
        document.getElementById('downloadJPG').disabled = false;
        document.getElementById('downloadSVG').disabled = false;

    } catch (error) {
        alert('Error generating QR code: ' + error.message);
    }
}

function getContentByType(type) {
    switch(type) {
        case 'text':
            return document.getElementById('qrContent').value;
        case 'url':
            const url = document.getElementById('qrContent').value;
            return url.startsWith('http') ? url : 'https://' + url;
        case 'wifi':
            const ssid = document.getElementById('wifiSSID').value;
            const password = document.getElementById('wifiPassword').value;
            const security = document.getElementById('wifiSecurity').value;
            return `WIFI:T:${security};S:${ssid};P:${password};;`;
        case 'email':
            const email = document.getElementById('emailTo').value;
            const subject = document.getElementById('emailSubject').value;
            const body = document.getElementById('emailBody').value;
            return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        case 'phone':
            return 'tel:' + document.getElementById('qrContent').value;
        case 'sms':
            return 'smsto:' + document.getElementById('qrContent').value;
        case 'vcard':
            const name = document.getElementById('vcardName').value;
            const phone = document.getElementById('vcardPhone').value;
            const vcardEmail = document.getElementById('vcardEmail').value;
            const org = document.getElementById('vcardOrg').value;
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${vcardEmail}\nORG:${org}\nEND:VCARD`;
        default:
            return document.getElementById('qrContent').value;
    }
}

function downloadQR(format) {
    if (!currentQR) {
        alert('Please generate a QR code first');
        return;
    }

    const canvas = document.querySelector('.qr-canvas');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    if (format === 'svg') {
        // Generate SVG version
        const svgCanvas = document.createElement('canvas');
        const svgQR = new QRious({
            element: svgCanvas,
            value: currentQR.value,
            size: currentQR.size,
            level: currentQR.level,
            foreground: currentQR.foreground,
            background: currentQR.background
        });
        
        // Convert canvas to SVG (simplified approach)
        const svgContent = canvasToSVG(svgCanvas, currentQR.size);
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-${timestamp}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        // PNG or JPG download
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const dataURL = canvas.toDataURL(mimeType, 0.9);
        
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `qrcode-${timestamp}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function canvasToSVG(canvas, size) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    svg += `<rect width="100%" height="100%" fill="${currentQR.background}"/>`;
    
    // Simple pixel-to-rectangle conversion
    const pixelSize = 1;
    for (let y = 0; y < size; y += pixelSize) {
        for (let x = 0; x < size; x += pixelSize) {
            const index = (y * size + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            if (r < 128 && g < 128 && b < 128) { // Dark pixel
                svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${currentQR.foreground}"/>`;
            }
        }
    }
    
    svg += '</svg>';
    return svg;
}

function clearQR() {
    // Clear all inputs
    document.getElementById('qrContent').value = '';
    document.getElementById('wifiSSID').value = '';
    document.getElementById('wifiPassword').value = '';
    document.getElementById('emailTo').value = '';
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailBody').value = '';
    document.getElementById('vcardName').value = '';
    document.getElementById('vcardPhone').value = '';
    document.getElementById('vcardEmail').value = '';
    document.getElementById('vcardOrg').value = '';
    
    // Reset to defaults
    document.getElementById('qrType').value = 'text';
    document.getElementById('qrSize').value = '256';
    document.getElementById('qrLevel').value = 'M';
    document.getElementById('qrForeground').value = '#000000';
    document.getElementById('qrBackground').value = '#FFFFFF';
    document.getElementById('qrForegroundValue').value = '#000000';
    document.getElementById('qrBackgroundValue').value = '#FFFFFF';
    
    // Reset display
    const container = document.getElementById('qrCanvasContainer');
    container.innerHTML = '<div class="qr-placeholder">Enter content and click "Generate QR Code" to create your QR code</div>';
    
    // Disable download buttons
    document.getElementById('downloadPNG').disabled = true;
    document.getElementById('downloadJPG').disabled = true;
    document.getElementById('downloadSVG').disabled = true;
    
    currentQR = null;
    
    // Reset input visibility
    changeQRType();
}

function loadPreset(preset) {
    clearQR();
    
    switch(preset) {
        case 'website':
            document.getElementById('qrType').value = 'url';
            document.getElementById('qrContent').value = 'https://example.com';
            break;
        case 'wifi':
            document.getElementById('qrType').value = 'wifi';
            document.getElementById('wifiSSID').value = 'MyWiFiNetwork';
            document.getElementById('wifiPassword').value = 'password123';
            document.getElementById('wifiSecurity').value = 'WPA';
            break;
        case 'contact':
            document.getElementById('qrType').value = 'vcard';
            document.getElementById('vcardName').value = 'John Doe';
            document.getElementById('vcardPhone').value = '+1234567890';
            document.getElementById('vcardEmail').value = 'john@example.com';
            document.getElementById('vcardOrg').value = 'Example Company';
            break;
        case 'email':
            document.getElementById('qrType').value = 'email';
            document.getElementById('emailTo').value = 'contact@example.com';
            document.getElementById('emailSubject').value = 'Hello from QR Code';
            document.getElementById('emailBody').value = 'This email was sent from a QR code!';
            break;
        case 'phone':
            document.getElementById('qrType').value = 'phone';
            document.getElementById('qrContent').value = '+1234567890';
            break;
        case 'location':
            document.getElementById('qrType').value = 'text';
            document.getElementById('qrContent').value = 'geo:37.7749,-122.4194';
            break;
    }
    
    changeQRType();
}

// Initialize the page
window.addEventListener('load', () => {
    changeQRType();
});

// Auto-generate when content changes (with debounce)
let generateTimeout;
function autoGenerate() {
    clearTimeout(generateTimeout);
    generateTimeout = setTimeout(() => {
        const type = document.getElementById('qrType').value;
        const content = getContentByType(type);
        if (content.trim()) {
            generateQR();
        }
    }, 1000);
}

// Add auto-generation listeners for WiFi fields
document.getElementById('wifiSSID').addEventListener('input', autoGenerate);
document.getElementById('wifiPassword').addEventListener('input', autoGenerate);
document.getElementById('wifiSecurity').addEventListener('change', autoGenerate);

// Add auto-generation listeners for email fields
document.getElementById('emailTo').addEventListener('input', autoGenerate);
document.getElementById('emailSubject').addEventListener('input', autoGenerate);
document.getElementById('emailBody').addEventListener('input', autoGenerate);

// Add auto-generation listeners for vCard fields
document.getElementById('vcardName').addEventListener('input', autoGenerate);
document.getElementById('vcardPhone').addEventListener('input', autoGenerate);
document.getElementById('vcardEmail').addEventListener('input', autoGenerate);
document.getElementById('vcardOrg').addEventListener('input', autoGenerate);

