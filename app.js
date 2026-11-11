const products = [
  {id:1,brand:'ESSENCE',name:'Lash Princess Mascara',category:'Makeup',price:2.500,size:'12 ml · Mascara',image:'essence-mascara-lash-princess.webp',badge:'THE EVERYDAY EDIT'},
  {id:2,brand:'BEAUTY EDIT',name:'Everyday Eyeshadow Palette',category:'Makeup',price:7.900,size:'9 shades · Eyeshadow',image:'eyeshadow-palette-with-mirror.webp',badge:'A LITTLE COLOUR'},
  {id:3,brand:'OLAY',name:'Ultra Moisture Body Wash',category:'Body care',price:3.250,size:'Shea butter · Body care',image:'olay-ultra-moisture-shea-butter-body-wash.webp',badge:'YOUR DAILY RITUAL'},
  {id:4,brand:'BEAUTY EDIT',name:'The Classic Red Lipstick',category:'Makeup',price:4.500,size:'Classic red · Lip colour',image:'red-lipstick.webp',badge:'MAKE A STATEMENT'},
  {id:5,brand:'CHANEL',name:'Coco Noir Eau de Parfum',category:'Fragrance',price:52.000,size:'100 ml · Eau de parfum',image:'chanel-coco-noir-eau-de.webp',badge:'THE FRAGRANCE EDIT'},
  {id:6,brand:'DIOR',name:'J’adore Eau de Parfum',category:'Fragrance',price:43.500,size:'100 ml · Eau de parfum',image:'dior-j%27adore.webp',badge:'AN ICONIC DISCOVERY'},
  {id:7,brand:'CALVIN KLEIN',name:'CK One Eau de Toilette',category:'Fragrance',price:14.900,size:'100 ml · Eau de toilette',image:'calvin-klein-ck-one.webp',badge:'THE FRAGRANCE EDIT'},
  {id:8,brand:'VASELINE',name:'Body & Face Lotion',category:'Skincare',price:2.900,size:'Daily care · Lotion',image:'vaseline-men-body-and-face-lotion.webp',badge:'EVERYDAY CARE'},
  {id:9,brand:'BEAUTY EDIT',name:'Soft Finish Face Powder',category:'Makeup',price:3.750,size:'Face · Finishing powder',image:'powder-canister.webp',badge:'THE FINISHING TOUCH'},
  {id:10,brand:'BEAUTY EDIT',name:'The Classic Red Nail Polish',category:'Makeup',price:2.250,size:'Classic red · Nail colour',image:'red-nail-polish.webp',badge:'SMALL JOYS'},
  {id:16,brand:'EARTH RHYTHM',name:'Rose PDRN Collagen Barrier Repair Capsule Cream',category:'Skincare',price:8.500,size:'50 g · Face moisturizer',image:'earth-rhythm-cream.jpg',concern:'Dryness'},
  {id:17,brand:'WISHCARE',name:'Super Bright Vitamin C16 Serum',category:'Skincare',price:10.750,size:'30 ml · Face serum',image:'wishcare-c16.png',concern:'Dullness'},
  {id:18,brand:'THE ORDINARY',name:'Lactic Acid 5% + HA',category:'Skincare',price:9.500,size:'30 ml · Exfoliating serum',image:'ordinary-lactic.jpg',concern:'Uneven texture'},
  {id:19,brand:'WISHCARE',name:'Vitamin C Pure Glow Milk Sunscreen',category:'Skincare',price:7.250,size:'SPF 50+',image:'wishcare-spf.jpg',concern:'Daily protection'},
  {id:20,brand:'ORIBE',name:'Gold Lust Repair & Restore Shampoo',category:'Hair care',price:17.500,size:'Shampoo',image:'oribe-shampoo.jpg'},
  {id:21,brand:'LAKMÉ',name:'9 to 5 Eyeconic Kajal Twin Pack',category:'Makeup',price:3.500,size:'Deep Black',image:'lakme-kajal.jpg'},
  {id:22,brand:'LAKMÉ',name:'Cushion Matte Lipstick',category:'Makeup',price:4.500,size:'Red Royale',image:'lakme-lips.jpg'},
  {id:23,brand:'PLUM',name:'Vanilla Vibes Body Wash',category:'Body care',price:4.750,size:'240 ml · Shower gel',image:'plum-body-wash.png'},
  {id:24,brand:'AVEENO',name:'Baby Daily Moisture Lotion',category:'Baby care',price:6.250,size:'532 ml · Baby lotion',image:'aveeno-baby.webp'},
  {id:25,brand:'DIOR',name:'Miss Dior Blooming Bouquet',category:'Fragrance',price:42.500,size:'Eau de toilette',image:'miss-dior.jpg'}
];
const kwd = new Intl.NumberFormat('en-KW', { style: 'currency', currency: 'KWD', currencyDisplay: 'code' });
const money = value => kwd.format(value);
const categoryPriority = ['Skincare', 'Fragrance', 'Body care', 'Hair care', 'Baby care', 'Makeup'];
function readStorage(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
const savedBag = readStorage('zyluna-bag', []);
let bag = Array.isArray(savedBag) ? savedBag.filter(item => item && products.some(p => p.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0).map(item => ({id:item.id,quantity:Math.min(item.quantity,99)})) : [];
const savedWishes = readStorage('zyluna-wishes', []);
let wishes = Array.isArray(savedWishes) ? savedWishes.filter(id => products.some(p => p.id === id)) : [];
let catalogueMode = 'all';
let catalogueConcern = '';
const $ = selector => document.querySelector(selector);
function persist() { try { localStorage.setItem('zyluna-bag',JSON.stringify(bag)); localStorage.setItem('zyluna-wishes',JSON.stringify(wishes)); } catch {} $('#bag-count').textContent = bag.reduce((sum,item) => sum + item.quantity,0); }
function productMedia(product, className = '') {
  return `<img class="${className}" src="assets/${product.image.replaceAll('%', '%25')}" alt="${product.name}" loading="lazy">`;
}
function card(p) { return `<article class="product-card"><div class="product-image"><button class="wish ${wishes.includes(p.id)?'saved':''}" data-wish="${p.id}" aria-label="${wishes.includes(p.id)?'Remove from':'Add to'} wishlist, ${p.name}" aria-pressed="${wishes.includes(p.id)}">${wishes.includes(p.id)?'♥':'♡'}</button><button class="product-open" data-product="${p.id}" aria-label="View ${p.name}">${productMedia(p)}</button><button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+</button></div><div class="product-meta"><p class="product-brand">${p.brand}</p><button class="product-name" data-product="${p.id}">${p.name}</button><p class="product-size">${p.size}</p><span class="product-price">${money(p.price)}</span></div></article>`; }
function renderFeatured(category = 'Skincare') {
  const featured = products.filter(product => product.category === category).sort((a, b) => Number(Boolean(b.concern)) - Number(Boolean(a.concern))).slice(0, 4);
  $('#beauty-products').innerHTML = featured.map(card).join('');
}
function refreshWishes() { document.querySelectorAll('[data-wish]').forEach(button => { const id=Number(button.dataset.wish), saved=wishes.includes(id), p=products.find(p=>p.id===id); button.classList.toggle('saved',saved); button.textContent=saved?'♥':'♡'; button.setAttribute('aria-pressed',String(saved)); button.setAttribute('aria-label',`${saved?'Remove from':'Add to'} wishlist, ${p.name}`); }); }
let toastTimer;
function toast(text) { $('#toast').textContent=text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800); }
function openDialog(dialog) { closeMenu(); if(!dialog.open) dialog.showModal(); document.body.classList.add('dialog-open'); }
document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();});});
function browse(category='All',query='',mode='all',concern='') { catalogueMode=mode; catalogueConcern=concern; $('#shop-title').textContent=mode==='wishlist'?'Your beauty wishlist':concern || (category==='Fragrance'?'Perfumes':category==='All'?'Explore beauty':category); $('#shop-filter').value=category; $('#shop-search').value=query; $('#shop-sort').value='featured'; renderCatalogue(); openDialog($('#shop-dialog')); }
function renderCatalogue() { const query=$('#shop-search').value.trim().toLowerCase(), category=$('#shop-filter').value, sort=$('#shop-sort').value; let list=products.filter(p=>(!catalogueConcern||p.concern===catalogueConcern)&&(catalogueMode!=='wishlist'||wishes.includes(p.id))&&(category==='All'||p.category===category)&&`${p.name} ${p.brand} ${p.category} ${p.size} ${p.category==='Fragrance'?'perfume':''}`.toLowerCase().includes(query)); if(sort==='featured')list.sort((a,b)=>categoryPriority.indexOf(a.category)-categoryPriority.indexOf(b.category));else list.sort((a,b)=>sort==='low'?a.price-b.price:b.price-a.price); $('#shop-products').innerHTML=list.length?list.map(card).join(''):`<div class="empty-state">${catalogueMode==='wishlist'?'Your saved favourites will appear here. Tap a heart on any product to start.':'No products match this search. Try another brand or category.'}<br><button class="button" data-browse="All">Explore all products <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div>`; }
function addToBag(id) { const item=bag.find(item=>item.id===id); if(item&&item.quantity>=99){toast('You’ve reached the preview quantity limit.');return;} if(item)item.quantity++;else bag.push({id,quantity:1});persist();renderBag();toast('A little beauty, added to your bag.'); }
function renderBag() { $('#bag-items').innerHTML=bag.length?bag.map(item=>{const p=products.find(p=>p.id===item.id);return `<div class="bag-line">${productMedia(p, 'bag-image')}<div><p class="product-brand">${p.brand}</p><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity"><button data-quantity="${p.id}" data-change="-1" aria-label="Decrease ${p.name} quantity">−</button><span>${item.quantity}</span><button data-quantity="${p.id}" data-change="1" aria-label="Increase ${p.name} quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}" aria-label="Remove ${p.name}">Remove</button></div>`;}).join(''):'<div class="empty-state">Your next favourite belongs here.<br><button class="button" data-continue>Explore the collection <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div>'; $('#bag-summary').innerHTML=bag.length?`<div class="bag-total"><span>Subtotal</span><strong>${money(bag.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0))}</strong></div><p class="sample-note">This is a shopping preview. Sample prices are shown in KWD. Orders and payments are not enabled.</p><button class="button" data-continue style="width:100%;margin-top:25px">Continue exploring <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`:''; }
function productDetail(id) { const p=products.find(p=>p.id===id); $('#info-content').innerHTML=`${productMedia(p, 'detail-image')}<p class="eyebrow">${p.brand} · ${p.category}</p><h2>${p.name}</h2><p>${p.size}</p><h3>${money(p.price)}</h3><p>Discover this product in the Zyluna collection preview. Final product details, ingredients, sizes and availability will be confirmed with the live catalogue.</p><button class="button" data-add="${p.id}">Add to beauty bag +</button><p class="sample-note">Illustrative listing · Sample price</p>`;openDialog($('#info-dialog')); }
const guides={routine:{title:'Your everyday ritual, simplified.',text:'A simple starting point makes it easier to find products that suit your skin.',steps:['Morning · Gentle cleanser, moisturiser, then sunscreen.','Evening · Remove makeup, cleanse, then moisturise.','Introduce one new product at a time and follow the brand’s directions.'],category:'Skincare'},scent:{title:'Find a scent that feels like you.',text:'Start with the feeling you want to carry through your day.',steps:['Fresh & airy · Explore citrus, green or aquatic notes.','Soft & romantic · Discover floral compositions.','Warm & expressive · Look for woody, amber or spice notes.','Try a fragrance on skin when possible and give it time to develop.'],category:'Fragrance'},makeup:{title:'A few essentials. Endless possibilities.',text:'Build a small collection around the look you love.',steps:['Your base · Choose a finish and shade that suit you.','Your eyes · Start with mascara or an easy everyday shadow.','Your finishing touch · Add a favourite lip colour.'],category:'Makeup'}};
function showGuide(key) {const g=guides[key];$('#info-content').innerHTML=`<p class="eyebrow">A LITTLE BEAUTY GUIDANCE</p><h2>${g.title}</h2><p>${g.text}</p><ul>${g.steps.map(s=>`<li>${s}</li>`).join('')}</ul><button class="button" data-guide-shop="${g.category}">Explore ${g.category.toLowerCase()} <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`;openDialog($('#info-dialog'));}
const menuGroups={Makeup:{Face:['Foundation','Concealer','Face powder','Blush & bronzer'],Eyes:['Mascara','Eyeshadow','Eyeliner','Brows'],Lips:['Lipstick','Lip gloss','Lip liner','Lip care'],'The beauty edit':['Makeup essentials','New discoveries','Beauty tools','Shop all makeup']},Skincare:{'Your daily routine':['Cleansers','Moisturisers','Serums','Sunscreen'],'Shop by concern':['Dryness','Dullness','Uneven texture','Daily protection'],'Body care':['Body wash','Body lotion','Hand care','Bath essentials'],'Discover more':['Build your routine','Everyday care','Shop all skincare']},Fragrance:{'Explore fragrance':['Eau de parfum','Eau de toilette','Everyday fragrances'],'Your scent mood':['Fresh & airy','Floral & romantic','Warm & woody'],'Featured brands':['CHANEL','DIOR','CALVIN KLEIN'],'Discover more':['Find your signature','Fragrance guide','Shop all fragrances']}};
let activeMenu = '';
let menuCloseTimer;
const hoverMenu = matchMedia('(hover: hover) and (pointer: fine)');
const menuImages = {Makeup: 'makeup.jpg', Skincare: 'hero.jpg', Fragrance: 'perfume.jpg'};

function closeMenu() {
  clearTimeout(menuCloseTimer);
  $('#mega-menu').hidden = true;
  activeMenu = '';
  document.querySelectorAll('[data-menu],.mobile-menu').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function showMenu(category) {
  clearTimeout(menuCloseTimer);
  if (activeMenu === category) return;
  activeMenu = category;
  const columns = Object.entries(menuGroups[category]).map(([title, links], index) => `
    <div class="mega-column">
      <span class="mega-number">0${index + 1}</span>
      <h3>${title}</h3>
      ${links.map(link => `<button data-menu-link="${link}" data-category="${category}">${link}<svg class="menu-link-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></button>`).join('')}
    </div>`).join('');
  $('#mega-menu').innerHTML = `
    <div class="mega-intro"><span class="eyebrow">THE ZYLUNA COLLECTION</span><button class="text-link" data-browse="${category}">Explore all ${category.toLowerCase()} <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div>
    <div class="mega-content">${columns}
      <button class="mega-promo" data-browse="${category}">
        <img src="assets/${menuImages[category]}" alt="Explore the ${category.toLowerCase()} edit">
        <span class="mega-promo-copy"><small>THE ${category.toUpperCase()} EDIT</small><strong>A new favourite<br>awaits.</strong><span>Discover the edit <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></span>
      </button>
    </div>
    <div class="mega-bottom"><span>Thoughtfully curated. Beautifully yours.</span><a href="#help" data-close-menu>Need a little guidance? Start here <svg class="arrow-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a></div>`;
  $('#mega-menu').hidden = false;
  document.querySelectorAll('[data-menu]').forEach(button => button.setAttribute('aria-expanded', String(button.dataset.menu === category)));
}

function scheduleMenuClose() {
  clearTimeout(menuCloseTimer);
  menuCloseTimer = setTimeout(closeMenu, 180);
}

document.querySelectorAll('[data-menu]').forEach(button => {
  button.addEventListener('pointerenter', () => { if (hoverMenu.matches) showMenu(button.dataset.menu); });
  button.addEventListener('pointerleave', () => { if (hoverMenu.matches) scheduleMenuClose(); });
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      showMenu(button.dataset.menu);
      $('#mega-menu button').focus();
    }
  });
});
$('#mega-menu').addEventListener('pointerenter', () => clearTimeout(menuCloseTimer));
$('#mega-menu').addEventListener('pointerleave', () => { if (hoverMenu.matches) scheduleMenuClose(); });
$('.header').addEventListener('focusout', event => { if (!event.currentTarget.contains(event.relatedTarget)) closeMenu(); });
$('#mega-menu').addEventListener('click', event => { if (event.target.closest('[data-close-menu]')) closeMenu(); });

document.addEventListener('click',event=>{const target=event.target.closest('button');if(!target)return;
 if(target.classList.contains('close-dialog'))target.closest('dialog').close();
 if(target.dataset.menu) { if (activeMenu === target.dataset.menu && !hoverMenu.matches) closeMenu(); else showMenu(target.dataset.menu); }
 if(target.classList.contains('mobile-menu')){if(activeMenu)closeMenu();else showMenu('Skincare');target.setAttribute('aria-expanded',String(!$('#mega-menu').hidden));}
 if(target.dataset.browse)browse(target.dataset.browse,target.dataset.query || '');
 if(target.dataset.brand)browse('All',target.dataset.brand);
 if(target.dataset.filter){document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===target));renderFeatured(target.dataset.filter);}
 if(target.dataset.add)addToBag(Number(target.dataset.add));
 if(target.dataset.product)productDetail(Number(target.dataset.product));
 if(target.dataset.wish){const id=Number(target.dataset.wish);wishes=wishes.includes(id)?wishes.filter(value=>value!==id):[...wishes,id];persist();refreshWishes();if(catalogueMode==='wishlist'&&$('#shop-dialog').open)renderCatalogue();}
 if(target.dataset.quantity){const item=bag.find(i=>i.id===Number(target.dataset.quantity));item.quantity=Math.min(99,item.quantity+Number(target.dataset.change));bag=bag.filter(i=>i.quantity>0);persist();renderBag();}
 if(target.dataset.remove){bag=bag.filter(i=>i.id!==Number(target.dataset.remove));persist();renderBag();}
 if(target.hasAttribute('data-continue')){$('#bag-dialog').close();browse();}
 if(target.dataset.guide)showGuide(target.dataset.guide);
 if(target.dataset.guideShop){$('#info-dialog').close();browse(target.dataset.guideShop);}
 if(target.dataset.concern) browse('Skincare', '', 'all', target.dataset.concern);
 if(target.dataset.info){$('#info-content').innerHTML=target.dataset.info==='privacy'?'<p class="eyebrow">YOUR PRIVACY</p><h2>A little transparency.</h2><p>This preview keeps shopping bag and wishlist selections in your browser’s local storage. The signup demonstration does not send or save your email address. Google Fonts may receive a request from your browser to load the typefaces.</p><p>The live store’s full privacy policy will be available before launch.</p>':'<p class="eyebrow">HERE TO HELP</p><h2>Delivery & returns.</h2><p>Shipping regions, delivery estimates, contact details and return conditions will be confirmed by Zyluna before the store launches.</p><p>This preview does not accept orders or payments.</p>';openDialog($('#info-dialog'));}
 if(target.dataset.menuLink){const label=target.dataset.menuLink; if(Object.values(menuGroups.Skincare['Shop by concern']).includes(label))browse('Skincare','','all',label);else if(['CHANEL','DIOR','CALVIN KLEIN'].includes(label))browse('Fragrance',label);else if(label.includes('guide')||label.includes('signature'))showGuide('scent');else if(label.includes('routine'))showGuide('routine');else { const query = /shop all|essentials|discoveries|everyday|care$/.test(label.toLowerCase()) ? '' : ({'Cleansers':'cleanser','Moisturisers':'moisturizer','Serums':'serum','Face powder':'powder','Body lotion':'lotion','Body wash':'body wash','Lipstick':'lipstick','Mascara':'mascara','Eyeshadow':'eyeshadow'}[label] || label); browse(target.dataset.category,query); }}
});
document.addEventListener('click',event=>{if(!event.target.closest('.header'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&activeMenu){const trigger=document.querySelector(`[data-menu="${activeMenu}"]`);closeMenu();trigger?.focus();}});
$('.search-trigger').addEventListener('click',()=>{browse();$('#shop-search').focus();});
$('#wishlist-button').addEventListener('click',()=>browse('All','','wishlist'));
$('#bag-button').addEventListener('click',()=>{renderBag();openDialog($('#bag-dialog'));});
$('#shop-search').addEventListener('input',renderCatalogue);$('#shop-filter').addEventListener('change', () => {
  catalogueConcern = '';
  $('#shop-title').textContent = catalogueMode === 'wishlist' ? 'Your beauty wishlist' : 'Explore beauty';
  renderCatalogue();
});$('#shop-sort').addEventListener('change',renderCatalogue);
$('#newsletter-form').addEventListener('submit',event=>{event.preventDefault();$('#newsletter-message').textContent='You’ve tried the signup preview. The mailing list opens with the store.';$('#newsletter-form').reset();});
$('#year').textContent=new Date().getFullYear();persist();renderFeatured();$('#fragrance-products').innerHTML=products.filter(p=>p.category==='Fragrance').sort((a,b)=>Number(b.id===25)-Number(a.id===25)).slice(0,3).map(card).join('');
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}

// Move lettering along the same curve as the ribbon, with a seamless repeated phrase.
const waveText = $('#wave-text');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let waveFrame;
let waveOffset = 0;
let previousWaveTime = 0;
let wavePaused = false;
function animateWave(time) {
  if (previousWaveTime && !wavePaused) waveOffset = (waveOffset + Math.min(time - previousWaveTime, 50) * 0.035) % 1800;
  previousWaveTime = time;
  waveText.setAttribute('startOffset', String(-waveOffset));
  waveFrame = requestAnimationFrame(animateWave);
}
function updateWaveMotion() {
  cancelAnimationFrame(waveFrame);
  previousWaveTime = 0;
  if (!reducedMotion.matches && !document.hidden) waveFrame = requestAnimationFrame(animateWave);
}
$('.wave-marquee').addEventListener('pointerenter', () => { wavePaused = true; });
$('.wave-marquee').addEventListener('pointerleave', () => { wavePaused = false; });
reducedMotion.addEventListener('change', updateWaveMotion);
document.addEventListener('visibilitychange', updateWaveMotion);
updateWaveMotion();

document.querySelectorAll('.carousel-controls').forEach(controls => {
  const [previous, next] = controls.querySelectorAll('button');
  const track = document.getElementById(next.dataset.carousel);
  const updateControls = () => {
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  for (const button of [previous, next]) {
    button.addEventListener('click', () => {
      const gap = parseFloat(getComputedStyle(track).columnGap);
      const step = track.firstElementChild.offsetWidth + gap;
      track.scrollBy({ left: Number(button.dataset.step) * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    });
  }
  track.addEventListener('scroll', updateControls, { passive: true });
  new ResizeObserver(updateControls).observe(track);
  updateControls();
});
