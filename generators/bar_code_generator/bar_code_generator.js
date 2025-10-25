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

let currentBarcodeSVG = null;

const formatRequirements = {
    'CODE128': { type: 'alphanumeric', example: 'ABC123456', description: 'Enter alphanumeric text' },
    'CODE39': { type: 'alphanumeric', example: 'ABC-123', description: 'Letters, numbers, and -.*$/+%' },
    'EAN13': { type: 'numeric', length: 13, example: '5901234123457', description: 'Enter exactly 13 digits (or 12, check digit added automatically)' },
    'EAN8': { type: 'numeric', length: 8, example: '12345670', description: 'Enter exactly 8 digits (or 7, check digit added automatically)' },
    'UPC': { type: 'numeric', length: 12, example: '012345678905', description: 'Enter exactly 12 digits (or 11, check digit added automatically)' },
    'ITF14': { type: 'numeric', length: 14, example: '12345678901231', description: 'Enter exactly 14 digits' },
    'MSI': { type: 'numeric', example: '1234567890', description: 'Enter numeric digits only' },
    'pharmacode': { type: 'numeric', example: '1234', description: 'Enter number between 3 and 131070' },
    'codabar': { type: 'numeric', example: 'A123456B', description: 'Start/stop with A, B, C, or D' }
};

function updateFormatInfo() {
    const format = document.getElementById('barcodeFormat').value;
    const info = formatRequirements[format];
    document.getElementById('formatInfo').textContent = info.description;
    document.getElementById('barcodeData').placeholder = info.example;
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

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function validateBarcodeData(format, data) {
    const requirements = formatRequirements[format];
    
    if (!data || data.length === 0) {
        return { valid: false, message: 'Please enter barcode data' };
    }
    
    // Numeric-only formats
    if (requirements.type === 'numeric' && !/^\d+$/.test(data)) {
        return { valid: false, message: 'This format only accepts numeric digits' };
    }
    
    // Length validation for specific formats
    if (requirements.length) {
        // EAN and UPC can accept one digit less (check digit will be calculated)
        if (format === 'EAN13' && data.length !== 12 && data.length !== 13) {
            return { valid: false, message: 'EAN-13 requires exactly 12 or 13 digits. You entered ' + data.length + ' digits.' };
        }
        if (format === 'EAN8' && data.length !== 7 && data.length !== 8) {
            return { valid: false, message: 'EAN-8 requires exactly 7 or 8 digits. You entered ' + data.length + ' digits.' };
        }
        if (format === 'UPC' && data.length !== 11 && data.length !== 12) {
            return { valid: false, message: 'UPC-A requires exactly 11 or 12 digits. You entered ' + data.length + ' digits.' };
        }
        if (format === 'ITF14' && data.length !== 13 && data.length !== 14) {
            return { valid: false, message: 'ITF-14 requires exactly 14 digits. You entered ' + data.length + ' digits.' };
        }
    }
    
    // Pharmacode validation
    if (format === 'pharmacode') {
        const num = parseInt(data);
        if (isNaN(num) || num < 3 || num > 131070) {
            return { valid: false, message: 'Pharmacode must be a number between 3 and 131070' };
        }
    }
    
    // Code 39 special characters
    if (format === 'CODE39') {
        if (!/^[0-9A-Z\-\.\ \$\/\+\%]+$/.test(data)) {
            return { valid: false, message: 'Code 39 only accepts: 0-9, A-Z, and special characters (- . $ / + %)' };
        }
    }
    
    return { valid: true };
}

function generateBarcode() {
    const format = document.getElementById('barcodeFormat').value;
    const data = document.getElementById('barcodeData').value.trim();
    
    // Validate data
    const validation = validateBarcodeData(format, data);
    if (!validation.valid) {
        alert(validation.message);
        showError(validation.message);
        return;
    }

    const displayValue = document.getElementById('displayValue').value || data;
    const width = parseInt(document.getElementById('barcodeWidth').value);
    const height = parseInt(document.getElementById('barcodeHeight').value);
    const fontSize = parseInt(document.getElementById('fontSize').value);
    const lineColor = document.getElementById('lineColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const showText = document.getElementById('showText').checked;

    try {
        const container = document.getElementById('barcodeContainer');
        container.innerHTML = '';
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        
        const options = {
            format: format,
            width: width,
            height: height,
            displayValue: showText,
            text: displayValue,
            fontSize: fontSize,
            lineColor: lineColor,
            background: bgColor,
            margin: 10
        };

        // For formats that need it, enable valid check digit calculation
        if (['EAN13', 'EAN8', 'UPC'].includes(format)) {
            options.valid = function(d) { return true; };
        }

        JsBarcode(svg, data, options);

        svg.classList.add('barcode-canvas');
        container.appendChild(svg);
        currentBarcodeSVG = svg;

        document.getElementById('downloadPNG').disabled = false;
        document.getElementById('downloadSVG').disabled = false;

    } catch (error) {
        alert('Error generating barcode: ' + error.message);
        showError('Error generating barcode: ' + error.message);
        console.error(error);
    }
}

function downloadBarcode(format) {
    if (!currentBarcodeSVG) {
        showError('Please generate a barcode first');
        return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

    if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(currentBarcodeSVG);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `barcode-${timestamp}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else if (format === 'png') {
        const svgData = new XMLSerializer().serializeToString(currentBarcodeSVG);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `barcode-${timestamp}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
}

function clearBarcode() {
    document.getElementById('barcodeData').value = '';
    document.getElementById('displayValue').value = '';
    document.getElementById('barcodeFormat').value = 'CODE128';
    document.getElementById('barcodeWidth').value = '2';
    document.getElementById('barcodeHeight').value = '100';
    document.getElementById('fontSize').value = '20';
    document.getElementById('lineColor').value = '#000000';
    document.getElementById('bgColor').value = '#FFFFFF';
    document.getElementById('lineColorValue').value = '#000000';
    document.getElementById('bgColorValue').value = '#FFFFFF';
    document.getElementById('showText').checked = true;
    
    const container = document.getElementById('barcodeContainer');
    container.innerHTML = '<div class="barcode-placeholder">Enter data and click "Generate Barcode" to create your barcode</div>';
    
    document.getElementById('downloadPNG').disabled = true;
    document.getElementById('downloadSVG').disabled = true;
    
    currentBarcodeSVG = null;
    updateFormatInfo();
}

function loadPreset(preset) {
    clearBarcode();
    
    switch(preset) {
        case 'code128':
            document.getElementById('barcodeFormat').value = 'CODE128';
            document.getElementById('barcodeData').value = 'ABC123456';
            break;
        case 'ean13':
            document.getElementById('barcodeFormat').value = 'EAN13';
            document.getElementById('barcodeData').value = '5901234123457';
            break;
        case 'upc':
            document.getElementById('barcodeFormat').value = 'UPC';
            document.getElementById('barcodeData').value = '012345678905';
            break;
        case 'code39':
            document.getElementById('barcodeFormat').value = 'CODE39';
            document.getElementById('barcodeData').value = 'ABC-123';
            break;
        case 'itf14':
            document.getElementById('barcodeFormat').value = 'ITF14';
            document.getElementById('barcodeData').value = '12345678901231';
            break;
        case 'pharmacode':
            document.getElementById('barcodeFormat').value = 'pharmacode';
            document.getElementById('barcodeData').value = '1234';
            break;
    }
    
    updateFormatInfo();
    generateBarcode();
}

// Auto-generate on input change with debounce
let generateTimeout;
function autoGenerate() {
    clearTimeout(generateTimeout);
    generateTimeout = setTimeout(() => {
        const data = document.getElementById('barcodeData').value.trim();
        if (data) {
            generateBarcode();
        }
    }, 800);
}



// Initialize
window.addEventListener('load', () => {
    updateFormatInfo();
});