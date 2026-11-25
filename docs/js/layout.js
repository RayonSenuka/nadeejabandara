const pages = [
  { href: 'index.html', section: 'home', label: 'Home' },
  { href: 'about.html', section: 'about', label: 'About Me' },
  { href: 'content.html', section: 'content', label: 'Latest Content' },
  { href: 'contact.html', section: 'contact', label: 'Reach Out' }
];
const current = location.pathname.split('/').pop() || 'index.html';
const isHome = current === 'index.html';
const themeStorageKey = 'nadeeja-theme';
document.documentElement.dataset.theme =
  localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';

if (isHome) {
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation?.type === 'reload') {
    history.scrollRestoration = 'manual';
    window.addEventListener('pageshow', () => {
      history.replaceState(null, '', `${location.pathname}${location.search}`);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }, { once: true });
  }
}

document.getElementById('site-nav').innerHTML = `
  <a class="logo" href="${isHome ? '#home' : 'index.html'}">NADEEJA BANDARA</a>
  <div class="links">
    ${pages.map(p => {
      const href = isHome && p.section !== 'categories' ? `#${p.section}` : p.href;
      const active = isHome ? p.section === 'home' : p.href === current;
      return `<a href="${href}" class="${active ? 'on' : ''}">${p.label}</a>`;
    }).join('')}
  </div>
  <button class="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false">
    <svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
    <svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"></circle>
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
    </svg>
  </button>`;

const themeToggle = document.querySelector('.theme-toggle');
const updateThemeToggle = () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute(
    'aria-label',
    isDark ? 'Switch to light mode' : 'Switch to dark mode'
  );
};

updateThemeToggle();
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(themeStorageKey, nextTheme);
  updateThemeToggle();
});

if (isHome) {
  const nav = document.getElementById('site-nav');
  const updateSectionContentOffset = () => {
    const stickyTop = Number.parseFloat(getComputedStyle(nav).top) || 0;
    const navBounds = nav.getBoundingClientRect();
    const toggle = nav.querySelector('.theme-toggle');
    const toggleBottom = toggle
      ? toggle.getBoundingClientRect().bottom - navBounds.top
      : navBounds.height;
    const navContentHeight = Math.max(navBounds.height, toggleBottom);
    const contentOffset = Math.ceil(navContentHeight + stickyTop + 32);
    document.documentElement.style.setProperty(
      '--section-content-offset',
      `${contentOffset}px`
    );
  };
  updateSectionContentOffset();
  window.addEventListener('resize', updateSectionContentOffset);

  const links = document.querySelectorAll('#site-nav .links a');
  const sectionLinks = document.querySelectorAll('#site-nav a[href^="#"]');
  const sections = Array.from(links, link =>
    document.getElementById(link.hash.slice(1))
  ).filter(Boolean);
  const updateActiveSection = () => {
    const activationLine = window.innerHeight * 0.4;
    let activeSection = sections[0];

    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeSection = section;
      }
    });

    links.forEach(link => {
      link.classList.toggle('on', link.hash === `#${activeSection.id}`);
    });
  };
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);

  sectionLinks.forEach(link => link.addEventListener('click', event => {
    const sectionId = link.hash.slice(1);
    const target = document.getElementById(sectionId);
    if (!target) return;

    event.preventDefault();
    links.forEach(item => item.classList.toggle('on', item.hash === link.hash));
    history.pushState(null, '', link.hash);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }));
  updateActiveSection();

  const initialSection = location.hash
    ? document.getElementById(location.hash.slice(1))
    : null;
  if (initialSection) {
    links.forEach(link => link.classList.toggle('on', link.hash === location.hash));
    initialSection.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
}

document.getElementById('site-footer').textContent = '© 2026 NADEEJA · nadeejabandara';

const revealTargets = document.querySelectorAll(
  '.hero-photo, .hero-line, main > .page-section, main > h2, main > .sub, main > .about, main > .stats, .filters, main > .grid, main > .cgrid'
);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.body.classList.add('motion-enabled');
  revealTargets.forEach(target => {
    target.classList.add('reveal');
    if (!target.classList.contains('category-item')) {
      revealObserver.observe(target);
    }
  });

  const categoryItems = document.querySelectorAll('.category-item.reveal');
  const updateCategoryVisibility = () => {
    categoryItems.forEach(item => {
      const bounds = item.getBoundingClientRect();
      const inRevealZone = bounds.top < window.innerHeight * .88 &&
        bounds.bottom > window.innerHeight * .12;
      item.classList.toggle('is-visible', inRevealZone);
    });
  };

  updateCategoryVisibility();
  window.addEventListener('scroll', updateCategoryVisibility, { passive: true });
  window.addEventListener('resize', updateCategoryVisibility);
}
