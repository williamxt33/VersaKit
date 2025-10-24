//file location: C:\Users\willi\OneDrive\文件\visual studio code\Html Css Java script\VersaKit

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

// Dictionary mapping tool names to paths and categories
const toolsDict = {
    // Converters
    'temperature_converter': { name: 'Temperature Converter', category: 'converters' },
    'morse_code_converter': { name: 'Morse Code Converter', category: 'converters' },
    'length_converter': { name: 'Length Converter', category: 'converters' },
    'weight_converter': { name: 'Weight Converter', category: 'converters' },
    'currency_converter': { name: 'Currency Converter', category: 'converters' },
    'file_converter': { name: 'File Converter', category: 'converters' },
    'speed_converter': { name: 'Speed Converter', category: 'converters' },
    'angle_converter': { name: 'Angle Converter', category: 'converters' },
    'area_converter': { name: 'Area Converter', category: 'converters' },
    'volume_converter': { name: 'Volume Converter', category: 'converters' },
    'density_converter': { name: 'Density Converter', category: 'converters' },
    'force_converter': { name: 'Force Converter', category: 'converters' },
    'pressure_converter': { name: 'Pressure Converter', category: 'converters' },
    'energy_converter': { name: 'Energy Converter', category: 'converters' },
    'power_converter': { name: 'Power Converter', category: 'converters' },
    'viscosity_converter': { name: 'Viscosity Converter', category: 'converters' },
    
    // Generators
    'password_generator': { name: 'Password Generator', category: 'generators' },
    'QRcode_generator': { name: 'QR Code Generator', category: 'generators' },
    'bar_code_generator': { name: 'Bar Code Generator', category: 'generators' },
    'group_generator': { name: 'Group Generator', category: 'generators' },
    'mock_data_generator': { name: 'Mock Data Generator', category: 'generators' },
    
    // Calculators
    'BMI_calculator': { name: 'BMI Calculator', category: 'calculators' },
    'age_converter': { name: 'Age Converter', category: 'calculators' },
    'mortgage_calculator': { name: 'Mortgage Calculator', category: 'calculators' },
    'comp_interest': { name: 'Compound Interest Calculator', category: 'calculators' },
    'retirement_calculator': { name: 'Retirement Calculator', category: 'calculators' },
    'EMI_calculator': { name: 'EMI Calculator', category: 'calculators' },
    'ROI_calculator': { name: 'ROI Calculator', category: 'calculators' },
    
    // Others
    'counter': { name: 'Counter', category: 'others' },
    'dice_roll': { name: 'Dice Roll', category: 'others' },
    'coin_flip': { name: 'Coin Flip', category: 'others' },
    'wheel_spinner': { name: 'Wheel Spinner', category: 'others' }
};

// Generate URL based on category and tool name
function getToolUrl(toolKey, category) {
    return `/${category}/${toolKey}/${toolKey}.html`;
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
    
    // Filter tools where key or name contains query
    const matches = [];
    
    for (const [key, value] of Object.entries(toolsDict)) {
        const keyLower = key.toLowerCase();
        const nameLower = value.name.toLowerCase();
        const categoryLower = value.category.toLowerCase();
        
        // Check if key, name, or category contains the query
        if (keyLower.includes(query) || nameLower.includes(query) || categoryLower.includes(query)) {
            matches.push({
                id: key,
                name: value.name,
                category: value.category,
                displayCategory: value.category.charAt(0).toUpperCase() + value.category.slice(1),
                url: getToolUrl(key, value.category)
            });
        }
    }
    
  
    const categoryColors = {
        'converters': '#007bff',    
        'generators': '#ffc107',    
        'calculators': '#28a745',     
        'others': '#6f42c1'      
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
                        ${tool.displayCategory}
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