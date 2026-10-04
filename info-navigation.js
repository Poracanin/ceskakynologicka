// Standalone information pages use ordinary links into the main application.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.menu-button');
  const navigation = header.querySelector('.mobile-nav');
  const content = document.querySelector('main');
  const footer = document.querySelector('footer');

  function closeMenu(restoreFocus = false) {
    navigation.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otevřít menu');
    document.body.classList.remove('mobile-menu-open');
    content.inert = false;
    footer.inert = false;
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    if (!navigation.hidden) return closeMenu(true);
    navigation.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Zavřít menu');
    document.body.classList.add('mobile-menu-open');
    content.inert = true;
    footer.inert = true;
    navigation.querySelector('.mobile-nav-close').focus();
  });

  navigation.addEventListener('click', (event) => {
    if (event.target === navigation || event.target.closest('.mobile-nav-close')) closeMenu(true);
    else if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (navigation.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === 'Tab') {
      const items = [...navigation.querySelectorAll('a, button')];
      const first = items[0];
      const last = items[items.length - 1];
      if (!navigation.contains(document.activeElement) ||
          (event.shiftKey && document.activeElement === first) ||
          (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
  });

  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });
  window.addEventListener('pageshow', () => closeMenu());
})();
