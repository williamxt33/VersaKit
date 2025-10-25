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


let uploadedFile = null;
let convertedFile = null;

// Upload area interactions
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');


uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    uploadedFile = file;
    
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileType').textContent = file.type || 'Unknown';
    document.getElementById('fileInfo').style.display = 'block';
    
    // Auto-detect conversion type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    autoDetectConversionType(fileExtension);
}

function autoDetectConversionType(extension) {
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const documentFormats = ['txt', 'csv', 'doc', 'docx'];
    const dataFormats = ['csv', 'json'];
    
    const conversionTypeSelect = document.getElementById('conversionType');
    
    if (imageFormats.includes(extension)) {
        conversionTypeSelect.value = 'image';
    } else if (documentFormats.includes(extension)) {
        conversionTypeSelect.value = 'document';
    } else if (dataFormats.includes(extension)) {
        conversionTypeSelect.value = 'data';
    }
    
    updateOutputFormats();
}

function updateOutputFormats() {
    const conversionType = document.getElementById('conversionType').value;
    const outputFormat = document.getElementById('outputFormat');
    const qualityRow = document.getElementById('qualityRow');
    const resizeRow = document.getElementById('resizeRow');
    
    outputFormat.innerHTML = '<option value="">Select format</option>';
    
    if (conversionType === 'image') {
        outputFormat.innerHTML += `
            <option value="jpeg">JPEG (.jpg)</option>
            <option value="png">PNG (.png)</option>
            <option value="webp">WebP (.webp)</option>
        `;
        qualityRow.style.display = 'grid';
        resizeRow.style.display = 'grid';
    } else if (conversionType === 'document') {
        outputFormat.innerHTML += `
            <option value="txt">Plain Text (.txt)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="json">JSON (.json)</option>
        `;
        qualityRow.style.display = 'none';
        resizeRow.style.display = 'none';
    } else if (conversionType === 'data') {
        outputFormat.innerHTML += `
            <option value="csv">CSV (.csv)</option>
            <option value="json">JSON (.json)</option>
            <option value="txt">Plain Text (.txt)</option>
        `;
        qualityRow.style.display = 'none';
        resizeRow.style.display = 'none';
    } else {
        qualityRow.style.display = 'none';
        resizeRow.style.display = 'none';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function convertFile() {
    if (!uploadedFile) {
        alert('Please upload a file first!');
        return;
    }
    
    const conversionType = document.getElementById('conversionType').value;
    const outputFormat = document.getElementById('outputFormat').value;
    
    if (!conversionType || !outputFormat) {
        alert('Please select conversion type and output format!');
        return;
    }
    
    document.getElementById('conversionStatus').textContent = 'Converting...';
    document.getElementById('conversionStatus').style.color = '#ffc107';
    
    if (conversionType === 'image') {
        convertImage(uploadedFile, outputFormat);
    } else if (conversionType === 'document' || conversionType === 'data') {
        convertDocument(uploadedFile, outputFormat);
    }
}

function convertImage(file, format) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const resizePercent = parseInt(document.getElementById('resize').value);
            const scale = resizePercent === 'original' ? 1 : resizePercent / 100;
            
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const quality = getQualityValue();
            const mimeType = getMimeType(format);
            
            canvas.toBlob(function(blob) {
                convertedFile = new File([blob], `converted.${format}`, { type: mimeType });
                displayResults(file.size, blob.size);
                displayPreview(canvas.toDataURL(mimeType, quality));
            }, mimeType, quality);
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

function convertDocument(file, format) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        let convertedContent = '';
        let mimeType = 'text/plain';
        
        if (format === 'txt') {
            convertedContent = content;
            mimeType = 'text/plain';
        } else if (format === 'csv') {
            // Simple conversion - just ensure proper formatting
            convertedContent = content.trim();
            mimeType = 'text/csv';
        } else if (format === 'json') {
            // Try to convert CSV to JSON
            try {
                const lines = content.trim().split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                const data = [];
                
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = values[index] || '';
                    });
                    data.push(obj);
                }
                
                convertedContent = JSON.stringify(data, null, 2);
                mimeType = 'application/json';
            } catch (error) {
                convertedContent = JSON.stringify({ content: content }, null, 2);
                mimeType = 'application/json';
            }
        }
        
        const blob = new Blob([convertedContent], { type: mimeType });
        convertedFile = new File([blob], `converted.${format}`, { type: mimeType });
        
        displayResults(file.size, blob.size);
        displayTextPreview(convertedContent);
    };
    
    reader.readAsText(file);
}

function getQualityValue() {
    const quality = document.getElementById('quality').value;
    if (quality === 'high') return 0.95;
    if (quality === 'medium') return 0.85;
    return 0.75;
}

function getMimeType(format) {
    const mimeTypes = {
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'webp': 'image/webp',
        'txt': 'text/plain',
        'csv': 'text/csv',
        'json': 'application/json'
    };
    return mimeTypes[format] || 'application/octet-stream';
}

function displayResults(originalSize, convertedSize) {
    document.getElementById('originalSize').textContent = formatFileSize(originalSize);
    document.getElementById('convertedSize').textContent = formatFileSize(convertedSize);
    
    const sizeChange = ((convertedSize - originalSize) / originalSize * 100).toFixed(2);
    const sizeChangeElement = document.getElementById('sizeChange');
    sizeChangeElement.textContent = (sizeChange > 0 ? '+' : '') + sizeChange + '%';
    
    if (sizeChange < 0) {
        sizeChangeElement.style.color = '#28a745';
    } else if (sizeChange > 0) {
        sizeChangeElement.style.color = '#dc3545';
    } else {
        sizeChangeElement.style.color = '#495057';
    }
    
    document.getElementById('conversionStatus').textContent = 'Success';
    document.getElementById('conversionStatus').style.color = '#28a745';
    
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('downloadButton').style.display = 'block';
}

function displayPreview(dataUrl) {
    const previewArea = document.getElementById('previewArea');
    previewArea.innerHTML = `<img src="${dataUrl}" alt="Preview">`;
}

function displayTextPreview(content) {
    const previewArea = document.getElementById('previewArea');
    const preview = content.length > 500 ? content.substring(0, 500) + '...' : content;
    previewArea.innerHTML = `<pre style="text-align: left; overflow: auto; max-width: 100%; white-space: pre-wrap; word-wrap: break-word;">${preview}</pre>`;
}

function downloadFile() {
    if (!convertedFile) {
        alert('No converted file available!');
        return;
    }
    
    const url = URL.createObjectURL(convertedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = convertedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearForm() {
    uploadedFile = null;
    convertedFile = null;
    
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('conversionType').value = '';
    document.getElementById('outputFormat').innerHTML = '<option value="">Select format</option>';
    document.getElementById('quality').value = 'medium';
    document.getElementById('resize').value = 'original';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('downloadButton').style.display = 'none';
    
    const previewArea = document.getElementById('previewArea');
    previewArea.innerHTML = '<p class="preview-text">Preview will appear here after conversion</p>';
    
    updateOutputFormats();
}