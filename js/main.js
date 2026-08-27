const languageButtons = [...document.querySelectorAll('.lang-option')];
const nav = document.querySelector('.section-nav');
const links = [...document.querySelectorAll('.section-link')];
const sections = [...document.querySelectorAll('.content section[id]')];
let preferredSection = location.hash.slice(1);

function setLanguage(language) {
    const lang = language === 'ko' ? 'ko' : 'en';
    document.querySelectorAll('[data-en]').forEach(element => {
        if (element.dataset[lang] != null) element.textContent = element.dataset[lang];
    });
    languageButtons.forEach(button => {
        const active = button.dataset.lang === lang;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem('lang', lang); } catch { /* Language switching also works without storage. */ }
    updateNavigation();
}

function updateActive() {
    if (!sections.length) return;
    const marker = Math.max(nav.getBoundingClientRect().bottom + 24, window.innerHeight * 0.3);
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
    let current = sections[0];
    let nearestTop = -Infinity;
    for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top > marker) continue;
        // Research and affiliations share a row on desktop. Honor the selected link within that row.
        if (top > nearestTop + 2 || (Math.abs(top - nearestTop) <= 2 && section.id === preferredSection)) {
            current = section;
            nearestTop = top;
        }
    }
    if (atBottom) {
        const preferred = sections.find(section => section.id === preferredSection);
        const preferredTop = preferred?.getBoundingClientRect().top;
        // A short section near the footer cannot always reach the scroll marker.
        current = preferred && preferredTop >= nav.getBoundingClientRect().bottom && preferredTop < window.innerHeight
            ? preferred
            : sections[sections.length - 1];
    }
    links.forEach(link => {
        const active = link.dataset.sec === current.id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}

function updateNavigation() {
    document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
    updateActive();
}

languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
links.forEach(link => link.addEventListener('click', () => {
    preferredSection = link.dataset.sec;
    requestAnimationFrame(updateActive);
}));
window.addEventListener('hashchange', () => {
    preferredSection = location.hash.slice(1);
    updateActive();
});
function resumeScrollTracking() {
    preferredSection = '';
    updateActive();
}
window.addEventListener('wheel', resumeScrollTracking, { passive: true });
window.addEventListener('touchstart', resumeScrollTracking, { passive: true });
window.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) resumeScrollTracking();
});
let scrollFrame = 0;
window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateActive();
    });
}, { passive: true });
window.addEventListener('resize', updateNavigation);
new ResizeObserver(updateNavigation).observe(nav);
document.fonts.ready.then(updateNavigation);

let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('lang') || 'en'; } catch { /* Use English by default. */ }
setLanguage(savedLanguage);
