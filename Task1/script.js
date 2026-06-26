// ---- Data: 32 frames across 4 categories ----
// loremflickr.com returns real photos matching a keyword.
// If it ever fails to load, picsum.photos is used as an automatic fallback.
const categories = ['nature','city','people','animals'];
const keywordFor = { nature: 'nature', city: 'city', people: 'people', animals: 'animal' };
const locksPerCategory = [1,2,3,4,5,6,7,8];

const images = [];
let counter = 1;
categories.forEach(cat => {
  locksPerCategory.forEach(lock => {
    images.push({
      id: counter++,
      category: cat,
      url: `https://loremflickr.com/700/700/${keywordFor[cat]}?lock=${cat}${lock}`,
      fallback: `https://picsum.photos/seed/${cat}${lock}/700/700`,
      caption: `${cat.charAt(0).toUpperCase()+cat.slice(1)} — Frame ${String(counter-1).padStart(2,'0')}`
    });
  });
});

const gallery = document.getElementById('gallery');
const filters = document.getElementById('filters');

function renderGallery(){
  gallery.innerHTML = '';
  images.forEach((img, i) => {
    const frame = document.createElement('div');
    frame.className = 'frame';
    frame.dataset.category = img.category;
    frame.dataset.index = i;
    frame.style.animationDelay = (i * 0.03) + 's';
    frame.innerHTML = `
      <span class="frame-number">#${String(img.id).padStart(2,'0')}</span>
      <img src="${img.url}" alt="${img.caption}" loading="lazy" onerror="this.onerror=null;this.src='${img.fallback}';">
      <span class="tag">${img.category}</span>
    `;
    frame.addEventListener('click', () => openLightbox(i));
    gallery.appendChild(frame);
  });
}

// ---- Filtering ----
filters.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if(!btn) return;
  filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;
  document.querySelectorAll('.frame').forEach(frame => {
    const match = filter === 'all' || frame.dataset.category === filter;
    frame.classList.toggle('hidden', !match);
  });
});

// ---- Lightbox ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const caption = document.getElementById('caption');
let currentIndex = 0;

function visibleIndices(){
  return Array.from(document.querySelectorAll('.frame'))
    .filter(f => !f.classList.contains('hidden'))
    .map(f => parseInt(f.dataset.index));
}

function openLightbox(index){
  currentIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox(){
  const img = images[currentIndex];
  lightboxImg.onerror = () => { lightboxImg.onerror = null; lightboxImg.src = img.fallback; };
  lightboxImg.src = img.url.replace('/700/700/','/1100/1100/');
  lightboxImg.alt = img.caption;
  caption.textContent = img.caption;
}

function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function step(dir){
  const visible = visibleIndices();
  if(visible.length === 0) return;
  let pos = visible.indexOf(currentIndex);
  if(pos === -1) pos = 0;
  pos = (pos + dir + visible.length) % visible.length;
  currentIndex = visible[pos];
  updateLightbox();
}

document.getElementById('closeBtn').addEventListener('click', closeLightbox);
document.getElementById('prevBtn').addEventListener('click', () => step(-1));
document.getElementById('nextBtn').addEventListener('click', () => step(1));

lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowRight') step(1);
  if(e.key === 'ArrowLeft') step(-1);
});

renderGallery();