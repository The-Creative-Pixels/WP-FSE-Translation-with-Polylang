document.addEventListener('DOMContentLoaded', function() {
    if (typeof PolylangLanguages === 'undefined') return;

    // === Determine current language once
    const currentLang = Object.keys(PolylangLanguages).find(key => PolylangLanguages[key].current_lang);

    // === Update .lang-btn links
    document.querySelectorAll('.lang-btn').forEach(el => {
        const langClass = Array.from(el.classList).find(c => c.startsWith('lang-') && c !== 'lang-btn');
        if (!langClass) return;

        const lang = langClass.replace('lang-', '');
        const link = el.querySelector('a');
        if (link && PolylangLanguages[lang]) {
            link.href = PolylangLanguages[lang].url;
        }
    });

    // === Filter template parts based on language
if (currentLang) {
  document.querySelectorAll('.wp-block-template-part').forEach(part => {
    part.querySelectorAll('[class*="lang-part-"]').forEach(child => {
      if (child.classList.contains('lang-part-' + currentLang)) {
        child.classList.remove('lang-hidden'); 
      } else {
        child.classList.add('lang-hidden'); 
      }
    });
  });
}


    // === Operate only on the ACTIVE template part
    const activePart = document.querySelector('.wp-block-template-part [class*="lang-part-' + currentLang + '"]');
    if (activePart) {
        // Update the "LAN" placeholder
        const switcher = activePart.querySelector('.lang-switcher');
        if (switcher) {
            const label = switcher.querySelector('span.wp-block-navigation-item__label');
            if (label) {
                label.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = currentLang.toUpperCase();
                    }
                });
            }
        }

    
    }

    console.log('PolylangLanguages applied to links, switcher, and template parts');
});
