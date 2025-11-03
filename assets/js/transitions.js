// Lightweight page transition for /docs/ pages
(function(){
  const contentSelector = '.docs-content';
  const container = document.querySelector(contentSelector);
  if(!container) return;
  if(!('fetch' in window) || !('history' in window)) return;
  const cache = new Map();
  let duration = 420; // make transitions a bit longer so they're visible

  // ensure the container has transition styles even if CSS not loaded or overridden
  try{
    container.style.transition = 'opacity ' + duration + 'ms ease, transform ' + duration + 'ms ease';
    container.style.willChange = 'opacity, transform';
  }catch(e){}

  async function fetchContent(url){
    if(cache.has(url)) return Promise.resolve(cache.get(url));
    const resp = await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
		if (!resp.ok) throw new Error('Network response was not ok');
		const html = await resp.text();
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const newContent = doc.querySelector(contentSelector);
		const title = doc.querySelector('title') ? doc.querySelector('title').innerText : document.title;
		const canonical = { content: newContent ? newContent.innerHTML : null, title };
		cache.set(url, canonical);
		return canonical;
  }

  function replaceContent(html, title, url){
    console.log('Replacing content for', url);
    container.innerHTML = html;
    document.title = title;
    window.scrollTo(0,0);
    // update active states in sidebar and top nav
    try {
      updateActiveLinks(url);
    } catch(e) {
      /* ignore */
    }
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function transitionTo(url, push=true){
  console.log('Transitioning to', url);
  console.log('Before animate: computed transitionDuration=', getComputedStyle(container).transitionDuration, 'opacity=', getComputedStyle(container).opacity);
    // ensure inline transition is set
    container.style.transition = 'opacity ' + duration + 'ms ease, transform ' + duration + 'ms ease';

    try{
  // start exit animation
  container.style.opacity = '0';
  container.style.transform = 'translateY(8px)';
  console.log('After setting exit styles: inline transition=', container.style.transition, 'inline opacity=', container.style.opacity);
  // wait the exit duration
  await sleep(duration + 20);

      const result = await fetchContent(url).catch(()=>null);
      if(!result || !result.content){ location.href = url; return; }

  // prepare entering initial state (hidden)
  container.style.opacity = '0';
  container.style.transform = 'translateY(8px)';

      // replace content while hidden
      replaceContent(result.content, result.title, url);

  // force reflow then animate in
  // eslint-disable-next-line no-unused-expressions
  container.offsetWidth;
  console.log('Animating in: transitionDuration=', getComputedStyle(container).transitionDuration);
  container.style.opacity = '1';
  container.style.transform = 'none';

      // update active links
      updateActiveLinks(url);

    }catch(err){
      console.error('transition failed, falling back to full navigation', err);
      location.href = url;
    }

    if(push) history.pushState({url},'',url);
  }

  function updateActiveLinks(url){
    const u = new URL(url, location.href);
    // sidebar
    document.querySelectorAll('.docs-sidebar a').forEach(a=>{
      const li = a.closest('li');
      if(!li) return;
      try{
        const ap = new URL(a.getAttribute('href'), location.href).pathname.replace(/index.html$/, '');
        const up = u.pathname.replace(/index.html$/, '');
        if(ap === up || (ap === '/' && up === '/docs/')){
          li.classList.add('active');
        } else {
          li.classList.remove('active');
        }
      }catch(e){}
    });
    // top nav
    document.querySelectorAll('.main-nav a').forEach(a=>{
      const li = a.closest('li');
      if(!li) return;
      try{
        const ap = new URL(a.getAttribute('href'), location.href).pathname.replace(/index.html$/, '');
        const up = u.pathname.replace(/index.html$/, '');
        if(ap === up){ li.classList.add('active'); } else { li.classList.remove('active'); }
      }catch(e){}
    });
  }

  document.addEventListener('click', e=>{
    if(e.defaultPrevented) return;
    const a = e.target.closest('a');
    if(!a) return;
    const href = a.getAttribute('href');
    if(!href) return;
    // ignore external links and anchors
    if(href.startsWith('#')) return;
    const url = new URL(href, window.location.href);
    if(url.origin !== window.location.origin) return;
    // Only intercept docs pages
    if(!url.pathname.startsWith('/docs/')) return;
    e.preventDefault();
    if(url.pathname === window.location.pathname) return;
    transitionTo(url.href, true);
  });

  window.addEventListener('popstate', e=>{
    const url = location.href;
    transitionTo(url, false);
  });
})();
