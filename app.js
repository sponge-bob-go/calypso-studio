const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.querySelector('.header').addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menu.focus();
  }
});

const lightbox = document.querySelector('#lightbox');
const works = Array.from(document.querySelectorAll('.work'));
const photo = lightbox.querySelector('img');
const title = document.querySelector('#photo-title');
let selected = 0;

function showWork(index) {
  selected = (index + works.length) % works.length;
  const work = works[selected];
  title.textContent = work.dataset.label;
  photo.src = work.querySelector('img').src;
  photo.alt = work.dataset.label;
}

works.forEach((work, index) => {
  work.addEventListener('click', () => {
    showWork(index);
    lightbox.showModal();
  });
});
document.querySelector('#prev').addEventListener('click', () => showWork(selected - 1));
document.querySelector('#next').addEventListener('click', () => showWork(selected + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') showWork(selected - 1);
  if (event.key === 'ArrowRight') showWork(selected + 1);
});
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

const cover = document.querySelector('.campaign');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let frame = 0;
function paintScroll() {
  frame = 0;
  const position = motion.matches ? 0 : Math.min(Math.max(0, -cover.getBoundingClientRect().top), cover.offsetHeight);
  cover.style.setProperty('--drift', position * .13 + 'px');
  cover.style.setProperty('--photo-drift', position * .055 + 'px');
  cover.style.setProperty('--glint', 25 + position * .11 + '%');
}
function queuePaint() {
  if (!frame) frame = requestAnimationFrame(paintScroll);
}
window.addEventListener('scroll', queuePaint, {passive:true});
motion.addEventListener('change', queuePaint);
queuePaint();
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('exposed');
      observer.unobserve(entry.target);
    }
  }), {threshold:.2});
  works.forEach(work => observer.observe(work));
}

const palette = document.querySelector('.palette');
const polishColors = ['#d89ba9', '#97a8bb', '#776e68', '#9bd647'];
works.forEach((work, index) => {
  const swatch = document.createElement('button');
  swatch.type = 'button';
  swatch.title = work.dataset.label;
  swatch.setAttribute('aria-label', 'Посмотреть ' + work.dataset.label);
  swatch.style.setProperty('--tone', polishColors[index]);
  swatch.addEventListener('click', () => {
    showWork(index);
    lightbox.showModal();
  });
  palette.append(swatch);
});
