// Toggle behavior for docs sidebar submenus
(function(){
  if(!('querySelector' in document)) return;

  function openSubmenu(submenu){
    submenu.classList.add('open');
    submenu.removeAttribute('hidden');
    submenu.removeAttribute('aria-hidden');
    // ensure layout is updated before animating
    submenu.style.maxHeight = '0px';
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    submenu.offsetHeight;
    submenu.style.maxHeight = submenu.scrollHeight + 'px';
    // clear inline maxHeight after transition so the element can grow/shrink naturally
    setTimeout(()=>{ submenu.style.maxHeight = ''; }, 420);
  }

  function closeSubmenu(submenu){
    // animate from current height to 0, then hide when transition finishes
    const startHeight = submenu.scrollHeight;
    submenu.style.maxHeight = startHeight + 'px';
    // force reflow
    // eslint-disable-next-line no-unused-expressions
    submenu.offsetHeight;
    // set to 0 to trigger transition
    submenu.style.maxHeight = '0px';
    // when transition ends, set hidden and cleanup
    const onTransitionEnd = (ev) => {
      if(ev.propertyName !== 'max-height') return;
      submenu.classList.remove('open');
      submenu.setAttribute('hidden','');
      submenu.setAttribute('aria-hidden','true');
      submenu.style.maxHeight = '';
      submenu.removeEventListener('transitionend', onTransitionEnd);
    };
    submenu.addEventListener('transitionend', onTransitionEnd);
  }

  document.addEventListener('click', function(e){
    const a = e.target.closest('.nav-parent');
    if(!a) return;
    const li = a.closest('.nav-group');
    if(!li || !li.classList.contains('has-children')) return;
    const submenu = li.querySelector('.nav-submenu');
    if(!submenu) return;

    // allow modifier clicks to open in new tab
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    const isOpen = submenu.classList.contains('open') && !submenu.hasAttribute('hidden');
    if(isOpen){ closeSubmenu(submenu); }
    else { openSubmenu(submenu); }
  });

  // on load auto-open any group that contains an active child
  document.addEventListener('DOMContentLoaded', function(){
    try{
      const cur = location.pathname.replace(/index.html$/, '');
      // don't auto-open groups when on the docs index itself
      if(cur === '/docs/' || cur === '/docs') return;
    }catch(e){ /* ignore */ }
    document.querySelectorAll('.nav-group.has-children').forEach(group=>{
      if(group.querySelector('li.active')){
        const submenu = group.querySelector('.nav-submenu');
        if(submenu) openSubmenu(submenu);
      }
    });
  });
})();
