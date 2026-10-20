'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const opened = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(opened));
  nav.classList.toggle('is-open', opened);
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  }
});
const publications = [...document.querySelectorAll('.publication')];
const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.querySelector('#publication-search');
const showAll = document.querySelector('#show-all');
let selected = 'All';
let expanded = false;
function updatePublications() {
  const query = search.value.trim().toLowerCase();
  const matches = publications.filter(item =>
    (selected === 'All' || item.dataset.status === selected) &&
    (!query || item.dataset.search.includes(query))
  );
  const limit = selected === 'All' && !query && !expanded ? 6 : matches.length;
  const visible = new Set(matches.slice(0, limit));
  publications.forEach(item => { item.hidden = !visible.has(item); });
  document.querySelector('#results-label').textContent = `Showing ${visible.size} of ${matches.length} matching records`;
  document.querySelector('#no-results').hidden = matches.length !== 0;
  showAll.hidden = selected !== 'All' || !!query || matches.length <= 6;
  showAll.textContent = expanded ? 'Show fewer publications ↑' : `View all ${matches.length} records ↓`;
  showAll.setAttribute('aria-expanded', String(expanded));
}
filters.forEach(button => button.addEventListener('click', () => {
  selected = button.dataset.filter;
  expanded = false;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  updatePublications();
}));
search.addEventListener('input', updatePublications);
showAll.addEventListener('click', () => { expanded = !expanded; updatePublications(); });
updatePublications();
