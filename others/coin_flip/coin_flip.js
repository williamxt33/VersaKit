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


let stats = {
    total: 0,
    heads: 0,
    tails: 0,
    streak: 0,
    streakType: null,
    history: []
};

let currentRotation = 0;
let isFlipping = false;

function flipCoin() {
    if (isFlipping) {
        return;
    }
    let flipCount = parseInt(document.getElementById("flipCount").value);
    let speed = parseInt(document.getElementById("animSpeed").value);
    performFlips(flipCount, speed);
}

async function performFlips(count, speed) {
    isFlipping = true;
    document.getElementById('flipButton').disabled = true;
    
    for (let i = 0; i < count; i++) {
        await performSingleFlip(speed);
        if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between flips
        }
    }
    
    isFlipping = false;
    document.getElementById('flipButton').disabled = false;
}

function performSingleFlip(animSpeed) {
    return new Promise((resolve) => {
        const coin = document.getElementById('coin');
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        
        // Calculate target rotation based on result
        let targetRotation;
        if (result === 'heads') {
            targetRotation = currentRotation + 1800; // Add 5 full spins
            targetRotation = Math.ceil(targetRotation / 360) * 360;
        } else {
            targetRotation = currentRotation + 1980; // Add 5.5 spins
            targetRotation = Math.floor(targetRotation / 360) * 360 + 180;
        }
        
        // Update keyframes dynamically
        try {
            const styleSheet = document.styleSheets[0];
            
            // Remove old keyframes if they exist
            for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
                try {
                    if (styleSheet.cssRules[i].name === 'flipToHeadsCustom' || 
                        styleSheet.cssRules[i].name === 'flipToTailsCustom') {
                        styleSheet.deleteRule(i);
                    }
                } catch (e) {
                    // Skip if can't access rule
                }
            }

            // Use the animSpeed parameter for animation duration
            const duration = animSpeed / 1000; // Convert to seconds
            
            const animName = result === 'heads' ? 'flipToHeadsCustom' : 'flipToTailsCustom';
            
            styleSheet.insertRule(`
                @keyframes ${animName} {
                    from { transform: rotateY(${currentRotation}deg); }
                    to { transform: rotateY(${targetRotation}deg); }
                }
            `, styleSheet.cssRules.length);
            
            // Apply animation
            coin.style.animation = 'none';
            // Force reflow
            void coin.offsetWidth;
            coin.style.animation = `${animName} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        } catch (e) {
            console.error('Animation error:', e);
        }

        // Update current rotation for next flip
        currentRotation = targetRotation;
        
        setTimeout(() => {
            updateStats(result);
            displayResult(result);
            resolve();
        }, animSpeed);
    });
}

function updateStats(result) {
    stats.total++;
    
    if (result === 'heads') {
        stats.heads++;
        if (stats.streakType === 'heads') {
            stats.streak++;
        } else {
            stats.streak = 1;
            stats.streakType = 'heads';
        }
    } else {
        stats.tails++;
        if (stats.streakType === 'tails') {
            stats.streak++;
        } else {
            stats.streak = 1;
            stats.streakType = 'tails';
        }
    }

    // Add to history
    const now = new Date();
    stats.history.unshift({
        result: result,
        time: now.toLocaleTimeString(),
        total: stats.total
    });

    // Keep only last 10
    if (stats.history.length > 10) {
        stats.history.pop();
    }

    updateDisplay();
}

function displayResult(result) {
    const resultDisplay = document.getElementById('resultDisplay');
    if (result === 'heads') {
        resultDisplay.textContent = 'HEADS!';
        resultDisplay.style.color = '#ffc107';
    } else {
        resultDisplay.textContent = 'TAILS! ';
        resultDisplay.style.color = '#6c757d';
    }
}

function updateDisplay() {
    // Quick stats
    document.getElementById('totalFlips').textContent = stats.total;
    document.getElementById('headsCount').textContent = stats.heads;
    document.getElementById('tailsCount').textContent = stats.tails;

    // Detailed stats
    document.getElementById('statTotal').textContent = stats.total;
    
    const headsPercent = stats.total > 0 ? ((stats.heads / stats.total) * 100).toFixed(1) : 0;
    const tailsPercent = stats.total > 0 ? ((stats.tails / stats.total) * 100).toFixed(1) : 0;
    
    document.getElementById('headsPercent').textContent = headsPercent + '%';
    document.getElementById('tailsPercent').textContent = tailsPercent + '%';
    document.getElementById('currentStreak').textContent = stats.streak + ' ' + (stats.streakType || '-');

    // Pie chart
    updatePieChart();

    // History table
    updateHistoryTable();

    // Legend
    document.getElementById('headsLegend').textContent = stats.heads + ' flips';
    document.getElementById('tailsLegend').textContent = stats.tails + ' flips';
}

function updatePieChart() {
    const pieChart = document.getElementById('pieChart');
    
    if (stats.total === 0) {
        pieChart.style.background = '#e9ecef';
        return;
    }

    const headsPercent = (stats.heads / stats.total) * 100;
    
    pieChart.style.background = `conic-gradient(
        #ffc107 0% ${headsPercent}%,
        #6c757d ${headsPercent}% 100%
    )`;
}

function updateHistoryTable() {
    const tbody = document.getElementById('historyBody');
    
    if (stats.history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6c757d;">No flips yet</td></tr>';
        return;
    }

    tbody.innerHTML = '';
    stats.history.forEach((flip, index) => {
        const row = document.createElement('tr');
        const resultIcon = flip.result === 'heads' ? 'Heads' : 'Tails';
        const resultColor = flip.result === 'heads' ? '#ffc107' : '#6c757d';
        
        row.innerHTML = `
            <td>${stats.total - index}</td>
            <td style="color: ${resultColor}; font-weight: 600;">${resultIcon}</td>
            <td>${flip.time}</td>
            <td>H: ${calculateRunningHeads(index)} | T: ${calculateRunningTails(index)}</td>
        `;
        tbody.appendChild(row);
    });
}

function calculateRunningHeads(historyIndex) {
    let count = 0;
    for (let i = 0; i <= historyIndex; i++) {
        if (stats.history[i].result === 'heads') count++;
    }
    return stats.heads - count;
}

function calculateRunningTails(historyIndex) {
    let count = 0;
    for (let i = 0; i <= historyIndex; i++) {
        if (stats.history[i].result === 'tails') count++;
    }
    return stats.tails - count;
}

function clearStats() {
    if (confirm('Are you sure you want to clear all statistics?')) {
        stats = {
            total: 0,
            heads: 0,
            tails: 0,
            streak: 0,
            streakType: null,
            history: []
        };

        document.getElementById('resultDisplay').textContent = 'Click "Flip Coin" to start!';
        document.getElementById('resultDisplay').style.color = '#007bff';
        
        currentRotation = 0;
        const coin = document.getElementById('coin');
        coin.style.transform = 'rotateY(0deg)';
        coin.style.animation = 'none';

        updateDisplay();
    }
}

function applyCoinStyle() {
    const style = document.getElementById('coinStyle').value;
    const headsEl = document.querySelector('.coin-heads');
    const tailsEl = document.querySelector('.coin-tails');

    if (style === 'classic') {
        headsEl.style.background = 'linear-gradient(135deg, #ffd700, #ffed4e)';
        headsEl.style.color = '#8b6914';
        tailsEl.style.background = 'linear-gradient(135deg, #c0c0c0, #e8e8e8)';
        tailsEl.style.color = '#505050';
    } else if (style === 'modern') {
        headsEl.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
        headsEl.style.color = 'white';
        tailsEl.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
        tailsEl.style.color = 'white';
    } else if (style === 'dark') {
        headsEl.style.background = 'linear-gradient(135deg, #343a40, #23272b)';
        headsEl.style.color = '#ffc107';
        tailsEl.style.background = 'linear-gradient(135deg, #495057, #343a40)';
        tailsEl.style.color = '#17a2b8';
    }
}

// Initialize display on load
window.onload = function() {
    updateDisplay();
};

document.addEventListener("keydown", (event) => {
    if (event.code === "Space" || event.key === " ") {
        event.preventDefault(); // Prevent scrolling
        flipCoin();
    }
});


