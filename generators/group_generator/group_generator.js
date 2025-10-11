function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.querySelector('.ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

let currentGroups = [];

document.getElementById('namesList').addEventListener('input', updateNameCount);

function updateNameCount() {
    const names = getNames();
    const count = names.length;
    document.getElementById('nameCount').textContent = `${count} name${count !== 1 ? 's' : ''} entered`;
}

function updateMethodUI() {
    const method = document.getElementById('groupMethod').value;
    
    if (method === 'numGroups') {
        document.getElementById('numGroupsInput').classList.remove('hidden');
        document.getElementById('groupSizeInput').classList.add('hidden');
    } else {
        document.getElementById('numGroupsInput').classList.add('hidden');
        document.getElementById('groupSizeInput').classList.remove('hidden');
    }
}

function getNames() {
    const text = document.getElementById('namesList').value;
    return text
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function sortNames(names, order) {
    const sorted = [...names];
    
    if (order === 'alphabetical') {
        sorted.sort((a, b) => a.localeCompare(b));
    } else if (order === 'reverse') {
        sorted.sort((a, b) => b.localeCompare(a));
    }
    
    return sorted;
}

function generateGroups() {
    const names = getNames();
    
    if (names.length === 0) {
        alert('Please enter at least one name');
        return;
    }

    const method = document.getElementById('groupMethod').value;
    const sortOrder = document.getElementById('sortOrder').value;
    
    let numGroups;
    
    if (method === 'numGroups') {
        numGroups = parseInt(document.getElementById('numberOfGroups').value);
        if (numGroups < 1 || numGroups > names.length) {
            alert(`Please enter a number between 1 and ${names.length}`);
            return;
        }
    } else {
        const groupSize = parseInt(document.getElementById('peoplePerGroup').value);
        if (groupSize < 1) {
            alert('Group size must be at least 1');
            return;
        }
        numGroups = Math.ceil(names.length / groupSize);
    }

    let shuffledNames = shuffleArray(names);
    currentGroups = [];
    

    const baseSize = Math.floor(names.length / numGroups);
    const remainder = names.length % numGroups;
    
    let index = 0;
    for (let i = 0; i < numGroups; i++) {
        const groupSize = baseSize + (i < remainder ? 1 : 0);
        const group = shuffledNames.slice(index, index + groupSize);
        currentGroups.push(group);
        index += groupSize;
    }


    if (sortOrder !== 'random') {
        currentGroups = currentGroups.map(group => sortNames(group, sortOrder));
    }

    displayGroups();
    updateStats();
}

function displayGroups() {
    const container = document.getElementById('groupsContainer');
    container.innerHTML = '';

    currentGroups.forEach((group, index) => {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        groupHeader.textContent = `Group ${index + 1}`;
        groupCard.appendChild(groupHeader);

        const membersList = document.createElement('ul');
        membersList.className = 'group-members';

        group.forEach((name, memberIndex) => {
            const memberItem = document.createElement('li');
            memberItem.className = 'group-member';

            const memberNumber = document.createElement('div');
            memberNumber.className = 'member-number';
            memberNumber.textContent = memberIndex + 1;

            const memberName = document.createElement('div');
            memberName.className = 'member-name';
            memberName.textContent = name;

            memberItem.appendChild(memberNumber);
            memberItem.appendChild(memberName);
            membersList.appendChild(memberItem);
        });

        groupCard.appendChild(membersList);
        container.appendChild(groupCard);
    });

    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('statsSection').classList.remove('hidden');
}

function updateStats() {
    const totalPeople = currentGroups.reduce((sum, group) => sum + group.length, 0);
    const numGroups = currentGroups.length;
    const average = (totalPeople / numGroups).toFixed(1);

    document.getElementById('statTotal').textContent = totalPeople;
    document.getElementById('statGroups').textContent = numGroups;
    document.getElementById('statAverage').textContent = average;
}

function copyGroups() {
    if (currentGroups.length === 0) {
        alert('No groups to copy');
        return;
    }

    let text = 'Generated Groups\n' + '='.repeat(50) + '\n\n';
    
    currentGroups.forEach((group, index) => {
        text += `Group ${index + 1}:\n`;
        group.forEach((name, memberIndex) => {
            text += `  ${memberIndex + 1}. ${name}\n`;
        });
        text += '\n';
    });

navigator.clipboard.writeText(text).then(() => {
        alert('Groups copied to clipboard!');
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Groups copied to clipboard!');
    });
}

function downloadGroups() {
    if (currentGroups.length === 0) {
        alert('No groups to download');
        return;
    }

    let text = 'Generated Groups\n' + '='.repeat(50) + '\n\n';
    text += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    currentGroups.forEach((group, index) => {
        text += `Group ${index + 1} (${group.length} members):\n`;
        group.forEach((name, memberIndex) => {
            text += `  ${memberIndex + 1}. ${name}\n`;
        });
        text += '\n';
    });

    text += '\n' + '='.repeat(50) + '\n';
    text += `Total: ${currentGroups.reduce((sum, g) => sum + g.length, 0)} people in ${currentGroups.length} groups\n`;
    text += 'Generated by VersaKit Group Generator';

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `groups-${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function regenerateGroups() {
    if (getNames().length === 0) {
        alert('Please enter names first');
        return;
    }
    generateGroups();
}

function clearNames() {
    document.getElementById('namesList').value = '';
    updateNameCount();
}

function clearResults() {
    currentGroups = [];
    document.getElementById('groupsContainer').innerHTML = '';
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('statsSection').classList.add('hidden');
}

function addSampleNames() {
    const sampleNames = [
        'John Doe',
        'Jane Smith',
        'Alice Johnson',
        'Bob Wilson',
        'Charlie Brown',
        'Diana Prince',
        'Edward Norton',
        'Fiona Green',
        'George Miller',
        'Hannah Lee',
        'Isaac Newton',
        'Julia Roberts',
        'Kevin Hart',
        'Laura Palmer',
        'Michael Scott',
        'Nancy Drew',
        'Oliver Twist',
        'Patricia Hill',
        'Quincy Jones',
        'Rachel Green'
    ];
    
    const currentText = document.getElementById('namesList').value.trim();
    const newText = currentText ? currentText + '\n' + sampleNames.join('\n') : sampleNames.join('\n');
    document.getElementById('namesList').value = newText;
    updateNameCount();
}

window.addEventListener('load', () => {
    updateNameCount();
    updateMethodUI();
});