function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.getElementById('ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

document.addEventListener('click', function(event) {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.getElementById('ham-menu');
    
    if (!sideMenu.contains(event.target) && !hamMenu.contains(event.target)) {
        sideMenu.classList.remove('show');
        hamMenu.classList.remove('active');
    }
});

emailjs.init("30xesYcBp-9kYcTL0");

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // 使用 EmailJS 發送
    emailjs.sendForm('service_fhth5fd', 'template_fcrh3tt', this)
        .then(() => {
            alert('Message sent successfully! We will get back to you soon.');
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send message. Please email us directly at versakit.official@gmail.com');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
});
