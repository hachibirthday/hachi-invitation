(function(){
  // Fixed list of 30 photo slots. Just drop your own image files
  // named photo1.png, photo2.png ... photo30.png in the same folder
  // as this album, and they'll show up here automatically.
  const TOTAL_SLOTS = 39;

  const photos = Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
    src: `photo${i + 1}.png`,
    caption: `Photo ${i + 1}`
  }));

  let current = 0;

  const cardWell = document.getElementById('cardWell');
  const dotsEl = document.getElementById('dots');
  const curNumEl = document.getElementById('curNum');
  const totalNumEl = document.getElementById('totalNum');
  const fileTab = document.getElementById('fileTab');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function pad(n){ return n < 10 ? "0"+n : ""+n; }

  function render(){
    cardWell.innerHTML = "";
    dotsEl.innerHTML = "";

    if(current >= photos.length) current = photos.length - 1;
    if(current < 0) current = 0;

    photos.forEach((p, i) => {
      const offset = i - current;
      if(Math.abs(offset) > 1) return;

      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = i;

      let transform, opacity, z;
      if(offset === 0){
        transform = 'translateX(0) rotate(0deg) scale(1)';
        opacity = 1; z = 3;
      } else if(offset === 1){
        transform = 'translateX(60%) rotate(6deg) scale(0.92)';
        opacity = 0.55; z = 2;
      } else {
        transform = 'translateX(-60%) rotate(-6deg) scale(0.92)';
        opacity = 0.55; z = 2;
      }
      card.style.transform = transform;
      card.style.opacity = opacity;
      card.style.zIndex = z;

      card.innerHTML = `
        <span class="tape l"></span>
        <span class="tape r"></span>
        <div class="photo-frame">
          <img src="${p.src}" alt="${p.caption}"
               onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'empty',innerHTML:'Add<br>${p.src}<br>to this folder'}))">
          <span class="stamp">HERO</span>
        </div>
        <div class="caption-row">
          <span class="caption-text">${p.caption}</span>
        </div>
      `;

      if(offset === 0){
        attachDrag(card);
      } else {
        card.addEventListener('click', () => goTo(i));
      }

      cardWell.appendChild(card);
    });

    // dots
    photos.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === current ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });

    curNumEl.textContent = pad(current + 1);
    totalNumEl.textContent = pad(photos.length);
    fileTab.textContent = "FILE " + pad(current + 1);
  }

  function goTo(i){
    current = Math.max(0, Math.min(photos.length - 1, i));
    render();
  }

  function next(){ goTo(current + 1 >= photos.length ? 0 : current + 1); }
  function prev(){ goTo(current - 1 < 0 ? photos.length - 1 : current - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  // drag / swipe on active card
  function attachDrag(card){
    let startX = 0, dx = 0, dragging = false;

    function down(x){
      dragging = true; startX = x; dx = 0;
      card.style.transition = 'none';
    }
    function move(x){
      if(!dragging) return;
      dx = x - startX;
      card.style.transform = `translateX(${dx}px) rotate(${dx/20}deg) scale(1)`;
    }
    function up(){
      if(!dragging) return;
      dragging = false;
      card.style.transition = '';
      if(dx > 80){ prev(); }
      else if(dx < -80){ next(); }
      else { card.style.transform = 'translateX(0) rotate(0deg) scale(1)'; }
    }

    card.addEventListener('mousedown', e => down(e.clientX));
    window.addEventListener('mousemove', e => move(e.clientX));
    window.addEventListener('mouseup', up);

    card.addEventListener('touchstart', e => down(e.touches[0].clientX), {passive:true});
    card.addEventListener('touchmove', e => move(e.touches[0].clientX), {passive:true});
    card.addEventListener('touchend', up);
  }

  render();
})();