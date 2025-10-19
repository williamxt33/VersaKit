//file location:     C:\Users\willi\OneDrive\文件\visual studio code\Html Css Java script\VersaKit


function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}


// Search functionality with dictionary mapping
const searchBar = document.getElementById('searchBar');

// Create search results dropdown
const searchResults = document.createElement('div');
searchResults.id = 'searchResults';
searchResults.className = 'search-results';
if (searchBar) {
    searchBar.parentElement.appendChild(searchResults);
}

// Dictionary mapping tool IDs to display names and categories
const toolsDict = {
    // Converters
    'temperatureConverter': { name: 'Temperature Converter', category: 'Converters' },
    'morseCodeConverter': { name: 'Morse Code Converter', category: 'Converters' },
    'lengthConverter': { name: 'Length Converter', category: 'Converters' },
    'weightConverter': { name: 'Weight Converter', category: 'Converters' },
    'ageConverter': { name: 'Age Converter', category: 'Converters' },
    'currencyConverter': { name: 'Currency Converter', category: 'Converters' },
    'fileConverter': { name: 'File Converter', category: 'Converters' },
    'BMIConverter': { name: 'BMI Calculator', category: 'Converters' },
    'speedConverter': { name: 'Speed Converter', category: 'Converters' },
    'angleConverter': { name: 'Angle Converter', category: 'Converters' },
    'areaConverter': { name: 'Area Converter', category: 'Converters' },
    'volumeConverter': { name: 'Volume Converter', category: 'Converters' },
    'densityConverter': { name: 'Density Converter', category: 'Converters' },
    'forceConverter': { name: 'Force Converter', category: 'Converters' },
    'pressureConverter': { name: 'Pressure Converter', category: 'Converters' },
    'energyConverter': { name: 'Energy Converter', category: 'Converters' },
    'powerConverter': { name: 'Power Converter', category: 'Converters' },
    'viscosityConverter': { name: 'Viscosity Converter', category: 'Converters' },
    
    // Generators
    'passwordGenerator': { name: 'Password Generator', category: 'Generators' },
    'QRcodeGenerator': { name: 'QR Code Generator', category: 'Generators' },
    'barCodeGenerator': { name: 'Bar Code Generator', category: 'Generators' },
    'GroupGenerator': { name: 'Group Generator', category: 'Generators' },
    'mockDataGenerator': { name: 'Mock Data Generator', category: 'Generators' },
    
    // Finance
    'mortgageCalculator': { name: 'Mortgage Calculator', category: 'Finance' },
    'compoundInterestCalculator': { name: 'Compound Interest Calculator', category: 'Finance' },
    'retirementCalculator': { name: 'Retirement Calculator', category: 'Finance' },
    'EMICalculator': { name: 'EMI Calculator', category: 'Finance' },
    'ROICalculator': { name: 'ROI Calculator', category: 'Finance' },
    
    // Others
    'counter': { name: 'Counter', category: 'Others' },
    'diceRoll': { name: 'Dice Roll', category: 'Others' },
    'coinFlip': { name: 'Coin Flip', category: 'Others' },
    'wheelSpin': { name: 'Wheel Spin', category: 'Others' }
};

// Get URL for each tool from the DOM
function getToolUrl(toolId) {
    const box = document.getElementById(toolId);
    if (box) {
        const onclickAttr = box.getAttribute('onclick');
        const match = onclickAttr?.match(/href\s*=\s*['"]([^'"]+)['"]/);
        return match ? match[1] : '#';
    }
    return '#';
}

// Search and display results
function performSearch() {
    const query = searchBar.value.toLowerCase().trim();
    
    // Clear results if search is empty
    if (query === '') {
        searchResults.innerHTML = '';
        searchResults.classList.remove('visible');
        return;
    }
    
    // Filter tools where key or name starts with query
    const matches = [];
    
    for (const [key, value] of Object.entries(toolsDict)) {
        const keyLower = key.toLowerCase();
        const nameLower = value.name.toLowerCase();
        const categoryLower = value.category.toLowerCase();
        
        // Check if key, name, or category starts with the query
        if (keyLower.startsWith(query) || nameLower.startsWith(query) || categoryLower.startsWith(query)) {
            matches.push({
                id: key,
                name: value.name,
                category: value.category,
                url: getToolUrl(key)
            });
        }
    }
    
    // Category colors
    const categoryColors = {
        'Converters': '#007bffff',    
        'Generators': '#ffc107',    
        'Finance': '#28a745',     
        'Others': '#6f42c1'      
    };
    
    // Display results
    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-item no-result">No results found</div>';
        searchResults.classList.add('visible');
    } else {
        let html = '';
        matches.forEach(tool => {
            const color = categoryColors[tool.category] || '#666';
            html += `
                <div class="search-item" onclick="window.location.href='${tool.url}'">
                    <div class="search-item-title">${tool.name}</div>
                    <div class="search-item-category" style="color: ${color}; font-weight: 600;">
                        ${tool.category}
                    </div>
                </div>
            `;
        });
        searchResults.innerHTML = html;
        searchResults.classList.add('visible');
    }
}

// Event listeners
if (searchBar) {
    searchBar.addEventListener('input', performSearch);
    searchBar.addEventListener('focus', performSearch);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchBar.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('visible');
        }
    });
    
    // Clear search with Escape
    searchBar.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchBar.value = '';
            searchResults.innerHTML = '';
            searchResults.classList.remove('visible');
            searchBar.blur();
        }
    });
    
    // Navigate results with arrow keys
    let selectedIndex = -1;
    searchBar.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-item:not(.no-result)');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, 0);
            updateSelection(items);
        } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].click();
        }
    });
    
    function updateSelection(items) {
        items.forEach((item, i) => {
            if (i === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
}

// Keyboard shortcut (Ctrl/Cmd + K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchBar) {
            searchBar.focus();
        }
    }
});