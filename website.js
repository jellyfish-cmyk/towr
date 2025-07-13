// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .step, .tower-item, .download-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Download game functionality
function downloadGame() {
    // Create a zip file with all game files
    const files = [
        { name: 'tower-defense.html', content: getFileContent('tower-defense.html') },
        { name: 'tower-defense.css', content: getFileContent('tower-defense.css') },
        { name: 'tower-defense.js', content: getFileContent('tower-defense.js') },
        { name: 'TOWER_DEFENSE_README.md', content: getFileContent('TOWER_DEFENSE_README.md') },
        { name: 'index.html', content: getFileContent('index.html') },
        { name: 'website.css', content: getFileContent('website.css') },
        { name: 'website.js', content: getFileContent('website.js') }
    ];
    
    // For now, just show a message since we can't create actual zip files
    showDownloadMessage();
}

function getFileContent(filename) {
    // This would normally fetch the file content
    // For now, return a placeholder
    return `Content of ${filename}`;
}

function showDownloadMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #00d4ff;
            z-index: 10000;
            text-align: center;
            max-width: 400px;
        ">
            <h3 style="color: #00d4ff; margin-bottom: 15px;">Download Ready!</h3>
            <p style="margin-bottom: 20px;">To download the game files:</p>
            <ol style="text-align: left; margin-bottom: 20px;">
                <li>Right-click on each file below</li>
                <li>Select "Save As" or "Download"</li>
                <li>Save all files in the same folder</li>
                <li>Open tower-defense.html to play!</li>
            </ol>
            <div style="margin-bottom: 20px;">
                <a href="tower-defense.html" download style="color: #00d4ff; text-decoration: none; margin: 5px;">📄 tower-defense.html</a><br>
                <a href="tower-defense.css" download style="color: #00d4ff; text-decoration: none; margin: 5px;">📄 tower-defense.css</a><br>
                <a href="tower-defense.js" download style="color: #00d4ff; text-decoration: none; margin: 5px;">📄 tower-defense.js</a><br>
                <a href="TOWER_DEFENSE_README.md" download style="color: #00d4ff; text-decoration: none; margin: 5px;">📄 TOWER_DEFENSE_README.md</a>
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: #00d4ff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    document.body.appendChild(message);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add some interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to game preview
    const gameScreen = document.querySelector('.game-screen');
    if (gameScreen) {
        gameScreen.addEventListener('mouseenter', () => {
            gameScreen.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.05)';
        });
        
        gameScreen.addEventListener('mouseleave', () => {
            gameScreen.style.transform = 'rotateY(-5deg) rotateX(5deg) scale(1)';
        });
    }
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals or menus
        const modals = document.querySelectorAll('[style*="position: fixed"]');
        modals.forEach(modal => modal.remove());
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    if (e.key === 'Enter' && e.target.matches('.download-card')) {
        e.target.click();
    }
});

// Add some fun particle effects to the hero section
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 212, 255, 0.5);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s infinite linear;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        hero.appendChild(particle);
    }
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize particles when page loads
document.addEventListener('DOMContentLoaded', createParticles); 