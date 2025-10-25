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

// Set max date to today
document.getElementById('birthDate').max = new Date().toISOString().split('T')[0];

function calculateAge() {
    const birthDate = new Date(document.getElementById('birthDate').value);
    const now = new Date();

    if (!birthDate || birthDate > now) {
        alert('Please enter a valid birth date');
        return;
    }
    else{
        // Calculate age components
        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += lastMonth.getDate();
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total time
        const totalMs = now - birthDate;
        const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
        const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
        const totalMinutes = Math.floor(totalMs / (1000 * 60));
        const totalSeconds = Math.floor(totalMs / 1000);

        // Calculate additional time units
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentSeconds = now.getSeconds();

        // Estimate heartbeats (average 70 bpm)
        const heartbeats = Math.floor(totalMinutes * 70);

        // Update display
        document.getElementById('years').textContent = years.toLocaleString();
        document.getElementById('months').textContent = months.toLocaleString();
        document.getElementById('days').textContent = days.toLocaleString();
        document.getElementById('hours').textContent = currentHours.toLocaleString();
        document.getElementById('minutes').textContent = currentMinutes.toLocaleString();
        document.getElementById('seconds').textContent = currentSeconds.toLocaleString();

        document.getElementById('totalDays').textContent = totalDays.toLocaleString();
        document.getElementById('totalHours').textContent = totalHours.toLocaleString();
        document.getElementById('totalMinutes').textContent = totalMinutes.toLocaleString();
        document.getElementById('totalSeconds').textContent = totalSeconds.toLocaleString();
        document.getElementById('heartbeats').textContent = heartbeats.toLocaleString();

        // Update summary
        const summary = `You are exactly ${years} years, ${months} months, and ${days} days old. You have lived for a total of ${totalDays.toLocaleString()} days, which equals ${totalHours.toLocaleString()} hours or ${totalMinutes.toLocaleString()} minutes!`;
        document.getElementById('ageSummary').textContent = summary;

        // Generate milestones
        generateMilestones(years, totalDays, birthDate);

        // Show results
        document.getElementById('results').classList.remove('hidden');
    }


}

function generateMilestones(years, totalDays, birthDate) {
    const milestonesContainer = document.getElementById('milestones');
    const milestones = [];

    // Age-based milestones
    if (years >= 18) milestones.push('🎓 You are legally an adult');
    if (years >= 21) milestones.push('🍷 You can legally drink in the US');
    if (years >= 25) milestones.push('🧠 Your brain is fully developed');
    if (years >= 30) milestones.push('📈 Entered your thirties');
    if (years >= 40) milestones.push('🎯 Life begins at 40!');
    if (years >= 50) milestones.push('🏆 Half a century milestone');
    if (years >= 65) milestones.push('🌅 Golden years have begun');

    // Day-based milestones
    if (totalDays >= 1000) milestones.push(`🎉 You've lived over 1,000 days`);
    if (totalDays >= 5000) milestones.push(`🌟 You've lived over 5,000 days`);
    if (totalDays >= 10000) milestones.push(`💫 You've lived over 10,000 days`);
    if (totalDays >= 20000) milestones.push(`🎊 You've lived over 20,000 days`);

    // Next birthday
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    // If birthday already passed this year, set it to next year
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysToNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    milestones.push(`🎂 ${daysToNext} days until your next birthday`);

    // Season born
    const birthMonth = birthDate.getMonth();
    const seasons = ['❄️ Born in Winter', '🌸 Born in Spring', '☀️ Born in Summer', '🍂 Born in Fall'];
    let seasonIndex = 0;
    if (birthMonth === 11 || birthMonth <= 1) {
        seasonIndex = 0; // Winter
    } else if (birthMonth <= 4) {
        seasonIndex = 1; // Spring
    } else if (birthMonth <= 7) {
        seasonIndex = 2; // Summer
    } else {
        seasonIndex = 3; // Fall
    }
    milestones.push(seasons[seasonIndex]);

    // Day of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const birthDay = dayNames[birthDate.getDay()];
    milestones.push(`📅 You were born on a ${birthDay}`);

    // Populate milestones
    milestonesContainer.innerHTML = milestones
        .map(milestone => `<div class="milestone-item">${milestone}</div>`)
        .join('');
}

// Auto-calculate on date change
document.getElementById('birthDate').addEventListener('change', calculateAge);