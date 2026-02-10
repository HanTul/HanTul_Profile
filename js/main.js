// Language Toggle
const langToggle = document.getElementById('langToggle');
const langOptions = langToggle.querySelectorAll('.lang-option');

let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;

    // Update toggle UI
    langOptions.forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.dataset[lang];
        if (text) {
            // Support line breaks with | character
            el.innerHTML = text.replace(/\|/g, '<br>');
        }
    });

    // Save preference
    localStorage.setItem('lang', lang);
}

// Toggle on click
langToggle.addEventListener('click', () => {
    setLanguage(currentLang === 'en' ? 'ko' : 'en');
});

// Load saved preference
const savedLang = localStorage.getItem('lang');
if (savedLang) {
    setLanguage(savedLang);
} else {
    setLanguage('en');
}

// ===================================
// Scroll Animations
// ===================================

// Add fade-in class to sections
document.querySelectorAll('.section').forEach(section => {
    section.classList.add('fade-in');
});

// Intersection Observer for fade-in elements
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger animation for cards inside
            const cards = entry.target.querySelectorAll('.card, .project-card, .affiliation-card, .contact-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===================================
// Cursor Glow Effect
// ===================================

const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth follow animation
function animateCursor() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hide cursor glow on mobile
if (window.matchMedia('(max-width: 768px)').matches) {
    cursorGlow.style.display = 'none';
}

// ===================================
// Mobile Menu
// ===================================

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===================================
// Smooth Scroll for Navigation
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ===================================
// Nav background on scroll
// ===================================

const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(9, 9, 11, 0.95)';
    } else {
        nav.style.background = 'rgba(9, 9, 11, 0.8)';
    }

    lastScroll = currentScroll;
});

// ===================================
// Typing Effect for Bio (optional)
// ===================================

// Uncomment below to enable typing effect
/*
const bio = document.querySelector('.hero-bio');
const bioText = bio.textContent;
bio.textContent = '';
bio.style.opacity = '1';

let charIndex = 0;
function typeText() {
    if (charIndex < bioText.length) {
        bio.textContent += bioText[charIndex];
        charIndex++;
        setTimeout(typeText, 30);
    }
}
setTimeout(typeText, 1000);
*/
