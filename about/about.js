function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.getElementById('ham-menu');
    
    sideMenu.classList.toggle('show');
    hamMenu.classList.toggle('active');
}

// Close side menu when clicking outside
document.addEventListener('click', function(event) {
    const sideMenu = document.getElementById('side-menu');
    const hamMenu = document.getElementById('ham-menu');
    
    if (!sideMenu.contains(event.target) && !hamMenu.contains(event.target)) {
        sideMenu.classList.remove('show');
        hamMenu.classList.remove('active');
    }
});