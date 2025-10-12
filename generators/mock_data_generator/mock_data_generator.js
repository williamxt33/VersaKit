function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}


let generatedData = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 5;


function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName() {
    return faker.name.findName();
}

function generateUsername() {
    return faker.internet.userName();
}

function generateEmail() {
    return faker.internet.email();
}

function generatePhone() {
    return faker.phone.phoneNumber();
}

function generateAddress() {
    return `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}`;
}

function generateCountry() {
    return faker.address.country();
}

function generateDOB() {
    const date = faker.date.between('1950-01-01', '2005-12-31');
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
}

function generateID() {
    let id = '';
    for (let i = 0; i < 9; i++) {
        id += randomNumber(0, 9);
    }
    return `${id.substr(0, 3)}-${id.substr(3, 2)}-${id.substr(5, 4)}`;
}

function generateCreditCard() {
    const prefixes = ['4', '51', '52', '53', '54', '55', '37'];
    let prefix = random(prefixes);
    let card = prefix;
    
    while (card.length < 15) {
        card += randomNumber(0, 9);
    }
    
    let sum = 0;
    let shouldDouble = true;
    for (let i = card.length - 1; i >= 0; i--) {
        let digit = parseInt(card[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    card += checkDigit;
    
    return card.match(/.{1,4}/g).join(' ');
}

function generateInfo() {
    const count = parseInt(document.getElementById('personCount').value);
    
    if (count < 1 || count > 1000) {
        alert('Please enter a number between 1 and 50');
        return;
    }

    const settings = {
        name: document.getElementById('genName').checked,
        email: document.getElementById('genEmail').checked,
        username: document.getElementById('genUsername').checked,
        phone: document.getElementById('genPhone').checked,
        address: document.getElementById('genAddress').checked,
        country: document.getElementById('genCountry').checked,
        dob: document.getElementById('genDOB').checked,
        id: document.getElementById('genID').checked,
        card: document.getElementById('genCard').checked
    };

    if (!Object.values(settings).some(v => v)) {
        alert('Please select at least one type of information to generate');
        return;
    }

    generatedData = [];

    for (let i = 0; i < count; i++) {
        const person = {};
        const name = generateName();
        
        if (settings.name) person.name = name;
        if (settings.email) person.email = generateEmail(name);
        if (settings.username) person.username = generateUsername(name);
        if (settings.phone) person.phone = generatePhone();
        if (settings.address) person.address = generateAddress();
        if (settings.country) person.country = generateCountry();
        if (settings.dob) person.dob = generateDOB();
        if (settings.id) person.id = generateID();
        if (settings.card) person.card = generateCreditCard();
        
        generatedData.push(person);
    }

    displayResults();
}

function displayResults() {
    const container = document.getElementById('resultsGrid');
    container.innerHTML = '';
    displayedCount = 0;

    const itemsToShow = Math.min(ITEMS_PER_PAGE, generatedData.length);
    
    for (let i = 0; i < itemsToShow; i++) {
        appendPersonCard(generatedData[i], i);
        displayedCount++;
    }

    updateResultsCount();
    updateShowMoreButton();
    document.getElementById('resultsSection').classList.remove('hidden');
}

function appendPersonCard(person, index) {
    const container = document.getElementById('resultsGrid');
    const card = document.createElement('div');
    card.className = 'person-card';

    const header = document.createElement('div');
    header.className = 'person-header';
    header.textContent = `Person ${index + 1}`;
    card.appendChild(header);

    const infoGrid = document.createElement('div');
    infoGrid.className = 'info-grid';

    const labels = {
        name: 'Full Name',
        email: 'Email Address',
        username: 'Username',
        phone: 'Phone Number',
        address: 'Address',
        country: 'Country',
        dob: 'Date of Birth',
        id: 'ID Number',
        card: 'Credit Card'
    };

    for (const [key, value] of Object.entries(person)) {
        const row = document.createElement('div');
        row.className = 'info-row';

        const label = document.createElement('div');
        label.className = 'info-label';
        label.textContent = labels[key];

        const val = document.createElement('div');
        val.className = 'info-value';
        val.textContent = value;

        row.appendChild(label);
        row.appendChild(val);
        infoGrid.appendChild(row);
    }

    card.appendChild(infoGrid);
    container.appendChild(card);
}

function showMoreResults() {
    const remaining = generatedData.length - displayedCount;
    const itemsToShow = Math.min(ITEMS_PER_PAGE, remaining);

    for (let i = 0; i < itemsToShow; i++) {
        appendPersonCard(generatedData[displayedCount], displayedCount);
        displayedCount++;
    }

    updateResultsCount();
    updateShowMoreButton();
}

function updateResultsCount() {
    const countEl = document.getElementById('resultsCount');
    countEl.textContent = `Showing ${displayedCount} of ${generatedData.length} people`;
}

function updateShowMoreButton() {
    const showMoreSection = document.getElementById('showMoreSection');
    const showMoreBtn = showMoreSection.querySelector('.show-more-button');
    const remaining = generatedData.length - displayedCount;

    if (remaining > 0) {
        showMoreSection.classList.remove('hidden');
        const nextBatch = Math.min(ITEMS_PER_PAGE, remaining);
        showMoreBtn.textContent = `Show More (${nextBatch})`;
    } else {
        showMoreSection.classList.add('hidden');
    }
}

function copyAllInfo() {
    if (generatedData.length === 0) {
        alert('No data to copy');
        return;
    }

    let text = 'Generated Personal Information\n' + '='.repeat(60) + '\n\n';
    
    generatedData.forEach((person, index) => {
        text += `Person ${index + 1}:\n`;
        const labels = {
            name: 'Name', email: 'Email', username: 'Username',
            phone: 'Phone', address: 'Address', country: 'country', dob: 'DOB',
            id: 'ID', card: 'Card'
        };
        for (const [key, value] of Object.entries(person)) {
            text += `  ${labels[key]}: ${value}\n`;
        }
        text += '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
        alert('Information copied to clipboard!');
    });
}

function downloadInfo() {
    if (generatedData.length === 0) {
        alert('No data to download');
        return;
    }

    let text = 'Generated Personal Information\n' + '='.repeat(60) + '\n';
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Total Records: ${generatedData.length}\n\n`;
    
    generatedData.forEach((person, index) => {
        text += `${'='.repeat(60)}\n`;
        text += `Person ${index + 1}:\n`;
        text += `${'-'.repeat(60)}\n`;
        
        const labels = {
            name: 'Full Name',
            email: 'Email Address',
            username: 'Username',
            phone: 'Phone Number',
            address: 'Address',
            country: 'country',
            dob: 'Date of Birth',
            id: 'ID Number',
            card: 'Credit Card'
        };
        
        for (const [key, value] of Object.entries(person)) {
            text += `${labels[key].padEnd(20)}: ${value}\n`;
        }
        text += '\n';
    });

    text += '\n' + '='.repeat(60) + '\n';
    text += 'DISCLAIMER: All data is fictional and for testing purposes only.\n';
    text += 'Generated by VersaKit Random Info Generator';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `random-info-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearResults() {
    generatedData = [];
    displayedCount = 0;
    document.getElementById('resultsGrid').innerHTML = '';
    document.getElementById('resultsSection').classList.add('hidden');
}