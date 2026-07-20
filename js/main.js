// ===== Language toggle (EN / KR) =====
const langToggle = document.getElementById('langToggle');
const langOptions = langToggle.querySelectorAll('.lang-option');
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    langOptions.forEach(opt => opt.classList.toggle('active', opt.dataset.lang === lang));
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.dataset[lang];
        if (text != null) el.innerHTML = text.replace(/\|/g, '<br>');
    });
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
}

langToggle.addEventListener('click', () => setLanguage(currentLang === 'en' ? 'ko' : 'en'));
setLanguage(localStorage.getItem('lang') || 'en');

// ===== Scroll-spy: highlight active section in sidebar nav =====
const links = Array.from(document.querySelectorAll('.side-link'));
const sections = Array.from(document.querySelectorAll('.content section[id]'));

function updateActive() {
    if (!sections.length) return;
    const marker = window.innerHeight * 0.32;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    let currentId = sections[0].id;
    if (atBottom) {
        currentId = sections[sections.length - 1].id;   // last section wins at page bottom
    } else {
        for (const s of sections) {
            if (s.getBoundingClientRect().top <= marker) currentId = s.id;
        }
    }
    links.forEach(l => l.classList.toggle('active', l.dataset.sec === currentId));
}

window.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('resize', updateActive);
updateActive();
