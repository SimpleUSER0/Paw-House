'use strict';
(() => {
  const services = window.PAW_SERVICES, config = window.PAW_CONFIG;
  let language='ka', opener=null, infoMode='call', errorKey='', photos=[], photoIndex=0;
  try { if(localStorage.getItem('paw-house-language')==='en')language='en'; } catch(_) {}
  const form=document.getElementById('booking-form'), success=document.getElementById('booking-success');
  const pet=form.elements.petType, service=form.elements.service, error=document.getElementById('form-error');
  const nav=document.getElementById('navigation'), menu=document.querySelector('.menu-toggle');
  const gallery=document.getElementById('gallery-dialog'), galleryImage=document.getElementById('gallery-image');
  const info=document.getElementById('info-dialog');
  const waNumber=String(config.whatsappNumber||'').replace(/\D/g,''),callNumber=String(config.callNumber||'').replace(/\D/g,'');
  const validNumber=n=>n.length>=7&&n.length<=15;
  const messages={
    ownerName:{ka:'გთხოვთ, მიუთითოთ თქვენი სახელი.',en:'Please enter your name.'},
    phone:{ka:'გთხოვთ, მიუთითოთ ტელეფონი (7–15 ციფრი).',en:'Please enter a phone number (7–15 digits).'},
    petName:{ka:'გთხოვთ, მიუთითოთ ცხოველის სახელი.',en:'Please enter your pet’s name.'},
    petType:{ka:'გთხოვთ, აირჩიოთ ძაღლი ან კატა.',en:'Please choose dog or cat.'},
    service:{ka:'გთხოვთ, აირჩიოთ შესაბამისი სერვისი.',en:'Please choose a compatible service.'},
    date:{ka:'გთხოვთ, აირჩიოთ დღევანდელი ან მომავალი დღე.',en:'Please choose today or a future day.'}
  };
  const allPhotos=[...document.querySelectorAll('.gallery-item')].map(el=>({id:el.querySelector('[data-view]').dataset.view,category:el.dataset.category,ka:el.querySelector('figcaption>span').dataset.ka,en:el.querySelector('figcaption>span').dataset.en,altKa:el.querySelector('img').dataset.attrKa,altEn:el.querySelector('img').dataset.attrEn}));
  const today=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
  form.elements.date.min=today();
  const updateServices=()=>{
    const selected=service.value;service.replaceChildren();service.disabled=!pet.value;
    service.add(new Option(pet.value?(language==='ka'?'აირჩიეთ სერვისი':'Choose a service'):(language==='ka'?'აირჩიეთ ჯერ ცხოველის ტიპი':'Choose a pet type first'),''));
    services.filter(s=>s.pets.includes(pet.value)).forEach(s=>service.add(new Option(s[language],s.id)));
    if([...service.options].some(o=>o.value===selected))service.value=selected;
  };
  const updateWhatsApp=()=>{
    const choice=services.find(s=>s.id===service.value),petText=pet.value?(language==='ka'?(pet.value==='dog'?'ძაღლი':'კატა'):(pet.value==='dog'?'dog':'cat')):'';
    let text=language==='ka'?'გამარჯობა! მაინტერესებს PAW HOUSE-ის გრუმინგის დემო.':'Hello! I am interested in the PAW HOUSE grooming demo.';
    if(petText)text+=(language==='ka'?'\nცხოველი: ':'\nPet: ')+petText;
    if(choice)text+=(language==='ka'?'\nსერვისი: ':'\nService: ')+choice[language];
    text+=language==='ka'?'\nგთხოვთ, დამიზუსტოთ რეალური პირობები. ეს დემო ტექსტია და არა დადასტურებული ჯავშანი.':'\nPlease confirm the actual terms. This is a demo inquiry, not a confirmed booking.';
    document.querySelectorAll('.whatsapp').forEach(a=>{a.href=`https://wa.me/${validNumber(waNumber)?waNumber:''}?text=${encodeURIComponent(text)}`;});
  };
  const renderInfo=()=>{
    document.getElementById('info-title').textContent=infoMode==='call'?(language==='ka'?'ტელეფონის ნომერი დასაზუსტებელია.':'Phone number to be confirmed.'):(language==='ka'?'სოციალური პროფილი დასაზუსტებელია.':'Social profile to be confirmed.');
    document.getElementById('info-description').textContent=infoMode==='call'?(language==='ka'?'ეს გამოგონილი სტუდიის დემოა. რეალური ნომერი ჯერ არ არის დამატებული, ამიტომ ზარი არ იწყება.':'This is a fictional studio demo. No actual number has been added, so no call is started.'):(language==='ka'?'გამოგონილი ბრენდის რეალური სოციალური პროფილი ჯერ არ არის მითითებული.':'No actual social profile has been listed for this fictional brand.');
  };
  const renderPhotoCaption=()=>{
    const photo=photos[photoIndex];if(!photo)return;
    document.getElementById('gallery-title').textContent=photo[language];document.getElementById('gallery-count').textContent=`${photoIndex+1} / ${photos.length}`;
    galleryImage.alt=photo[language==='ka'?'altKa':'altEn'];
  };
  const translate=(lang,persist=true)=>{
    language=lang;document.documentElement.lang=lang;
    document.querySelectorAll('[data-ka][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});
    document.querySelectorAll('[data-attr]').forEach(el=>el.setAttribute(el.dataset.attr,el.dataset[lang==='ka'?'attrKa':'attrEn']));
    document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
    document.querySelectorAll('[data-price]').forEach(el=>{el.textContent=lang==='ka'?`${el.dataset.price} ₾`:`GEL ${el.dataset.price}`;});
    document.title=lang==='ka'?'PAW HOUSE — გრუმინგის სტუდიის დემო':'PAW HOUSE — Pet grooming studio demo';
    document.querySelector('meta[name="description"]').content=lang==='ka'?'PAW HOUSE — ძაღლისა და კატის მოვლის გამოგონილი, ორენოვანი გრუმინგის სტუდიის დემო.':'PAW HOUSE — a fictional bilingual dog and cat grooming studio demo.';
    document.querySelector('meta[property="og:title"]').content=document.title;document.querySelector('meta[property="og:description"]').content=document.querySelector('meta[name="description"]').content;document.querySelector('meta[property="og:locale"]').content=lang==='ka'?'ka_GE':'en_US';
    updateServices();updateWhatsApp();renderInfo();if(gallery.open)renderPhotoCaption();if(errorKey)error.textContent=messages[errorKey][lang];
    if(persist){try{localStorage.setItem('paw-house-language',lang);}catch(_){}}
  };
  translate(language,false);
  document.querySelectorAll('[data-lang]').forEach(el=>el.addEventListener('click',()=>translate(el.dataset.lang)));
  const closeMenu=(focus=false)=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');if(focus)menu.focus();};
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(el=>el.addEventListener('click',()=>closeMenu()));
  document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu();});
  window.matchMedia('(min-width:851px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
  pet.addEventListener('change',()=>{updateServices();updateWhatsApp();});service.addEventListener('change',updateWhatsApp);
  const clearErrors=()=>{errorKey='';error.textContent='';form.querySelectorAll('[aria-invalid]').forEach(el=>{el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');});};
  const reset=()=>{form.reset();clearErrors();form.hidden=false;success.hidden=true;updateServices();updateWhatsApp();};
  document.querySelectorAll('[data-book]').forEach(button=>button.addEventListener('click',()=>{
    if(form.hidden)reset();
    if(button.dataset.pet){pet.value=button.dataset.pet;updateServices();}
    if(button.dataset.service)service.value=button.dataset.service;
    updateWhatsApp();closeMenu();document.getElementById('booking').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
    pet.focus({preventScroll:true});
  }));
  form.querySelector('[type=submit]').disabled=false;
  form.addEventListener('submit',e=>{
    e.preventDefault();clearErrors();const phone=form.elements.phone.value.trim(),digits=phone.replace(/\D/g,'');
    if(!form.elements.ownerName.value.trim())errorKey='ownerName';
    else if(!/^[+\d\s().-]+$/.test(phone)||digits.length<7||digits.length>15)errorKey='phone';
    else if(!form.elements.petName.value.trim())errorKey='petName';
    else if(!pet.value)errorKey='petType';
    else if(!services.some(s=>s.id===service.value&&s.pets.includes(pet.value)))errorKey='service';
    else if(form.elements.date.value&&form.elements.date.value<today())errorKey='date';
    if(errorKey){const field=form.elements[errorKey];field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','form-error');error.textContent=messages[errorKey][language];field.focus();return;}
    form.reset();updateServices();updateWhatsApp();form.hidden=true;success.hidden=false;success.focus();
  });
  document.getElementById('reset-booking').addEventListener('click',()=>{reset();form.elements.ownerName.focus();});
  const openInfo=(mode,trigger)=>{opener=trigger;infoMode=mode;renderInfo();info.showModal();document.body.style.overflow='hidden';};
  document.querySelectorAll('[data-call]').forEach(el=>el.addEventListener('click',()=>{if(validNumber(callNumber))window.location.href='tel:+'+callNumber;else openInfo('call',el);}));
  document.querySelectorAll('[data-social]').forEach(el=>el.addEventListener('click',()=>openInfo('social',el)));
  document.querySelector('.info-close').addEventListener('click',()=>info.close());
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));document.querySelectorAll('.gallery-item').forEach(el=>{el.hidden=button.dataset.filter!=='all'&&el.dataset.category!==button.dataset.filter;});}));
  const showPhoto=index=>{photoIndex=(index+photos.length)%photos.length;renderPhotoCaption();galleryImage.src=`assets/images/${photos[photoIndex].id}-1400.webp`;};
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{photos=allPhotos.filter(photo=>!document.querySelector(`[data-view="${photo.id}"]`).closest('.gallery-item').hidden);opener=button;showPhoto(photos.findIndex(photo=>photo.id===button.dataset.view));gallery.showModal();document.body.style.overflow='hidden';}));
  document.querySelector('.gallery-close').addEventListener('click',()=>gallery.close());document.querySelector('.gallery-prev').addEventListener('click',()=>showPhoto(photoIndex-1));document.querySelector('.gallery-next').addEventListener('click',()=>showPhoto(photoIndex+1));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);if(gallery.open&&e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}if(gallery.open&&e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}});
  let touchX=0,touchY=0;galleryImage.addEventListener('touchstart',e=>{if(e.touches.length===1){touchX=e.touches[0].clientX;touchY=e.touches[0].clientY;}},{passive:true});galleryImage.addEventListener('touchend',e=>{const x=e.changedTouches[0].clientX-touchX,y=e.changedTouches[0].clientY-touchY;if(Math.abs(x)>50&&Math.abs(x)>Math.abs(y)*1.5)showPhoto(photoIndex+(x<0?1:-1));},{passive:true});
  [gallery,info].forEach(dialog=>{dialog.addEventListener('close',()=>{document.body.style.overflow='';if(opener)opener.focus({preventScroll:true});});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});});
  const slider=document.getElementById('comparison-slider');slider.addEventListener('input',()=>slider.closest('.comparison').style.setProperty('--position',slider.value+'%'));
  document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==item)other.open=false;});}));
})();
