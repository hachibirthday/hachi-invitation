(function(){
  const STORAGE_KEY = "heroAlbumPhotos";

  function loadPhotos(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return [
      { src:"", caption:"Case #01 — add your first photo" },
      { src:"", caption:"Case #02 — add another memory" },
      { src:"", caption:"Case #03 — keep the file growing" }
    ];
  }

  function savePhotos(){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
      return true;
    }catch(e){
      console.warn("Could not save photos:", e);
      return false;
    }
  }

  // Resize + compress an image before storing, so many photos can fit.
  function compressImage(file, maxDim, quality){
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => { img.src = reader.result; };
      reader.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if(width > maxDim || height > maxDim){
          if(width > height){
            height = Math.round(height * (maxDim / width));
            width = maxDim;
          } else {
            width = Math.round(width * (maxDim / height));
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  let photos = loadPhotos();
  let current = 0;

  const cardWell = document.getElementById('cardWell');
  const dotsEl = document.getElementById('dots');
  const curNumEl = document.getElementById('curNum');
  const totalNumEl = document.getElementById('totalNum');
  const fileTab = document.getElementById('fileTab');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const addBtn = document.getElementById('addBtn');
  const fileInput = document.getElementById('fileInput');

  function pad(n){ return n < 10 ? "0"+n : ""+n; }

  function render(){
    cardWell.innerHTML = "";
    dotsEl.innerHTML = "";

    if(photos.length === 0){
      photos = [{ src:"", caption:"Case #01 — add your first photo" }];
    }

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
          ${p.src
            ? `<img src="${p.src}" alt="Hero photo ${i+1}">`
            : `<div class="empty">No photo yet<br>tap "Add Photo" below</div>`}
          <span class="stamp">HERO</span>
        </div>
        <div class="caption-row">
          <input type="text" value="${p.caption ? p.caption.replace(/"/g,'&quot;') : ''}" placeholder="Add a caption..." data-idx="${i}">
          <button class="del-btn" data-idx="${i}">DELETE</button>
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

    // caption + delete listeners
    cardWell.querySelectorAll('input[data-idx]').forEach(inp => {
      inp.addEventListener('input', e => {
        const idx = parseInt(e.target.dataset.idx, 10);
        photos[idx].caption = e.target.value;
        savePhotos();
      });
    });
    cardWell.querySelectorAll('.del-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.idx, 10);
        photos.splice(idx, 1);
        savePhotos();
        render();
      });
    });
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

  addBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async () => {
    const files = Array.from(fileInput.files);
    if(files.length === 0) return;

    addBtn.disabled = true;
    addBtn.textContent = "ADDING...";

    let addedCount = 0;
    let ranOutOfSpace = false;

    for(const file of files){
      let dataUrl;
      try{
        dataUrl = await compressImage(file, 1000, 0.75);
      }catch(e){
        console.warn("Could not process photo:", file.name, e);
        continue;
      }

      const emptyIdx = photos.findIndex(p => !p.src);
      const entry = { src: dataUrl, caption: "" };
      const backup = photos.slice();

      if(emptyIdx !== -1){
        photos[emptyIdx].src = dataUrl;
      } else {
        photos.push(entry);
      }

      if(savePhotos()){
        addedCount++;
      } else {
        // roll back this photo, storage is full
        photos = backup;
        ranOutOfSpace = true;
        break;
      }
    }

    current = photos.length - 1;
    render();

    addBtn.disabled = false;
    addBtn.textContent = "+ ADD PHOTO TO FILE";

    if(ranOutOfSpace){
      alert(
        "Naabot na ang storage limit ng browser dito.\n\n" +
        "Na-save ang " + addedCount + " sa mga bagong litrato mo. " +
        "Para makapagdagdag pa, subukan mong mag-delete muna ng ilang lumang litrato, " +
        "o gumamit ng mas maliliit na image files."
      );
    }

    fileInput.value = "";
  });

  render();
})();