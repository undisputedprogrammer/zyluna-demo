const filterForm = $('#catalogue-filters');
const searchField = $('#catalogue-search');
const brandSearch = $('#catalogue-brand-search');
const minimumPrice = $('#catalogue-min');
const maximumPrice = $('#catalogue-max');
const sortField = $('#catalogue-sort');
const filterToggle = $('#catalogue-toggle');
const resultsGrid = $('#catalogue-products');
const filterChips = $('#catalogue-chips');
const mobileFilters = matchMedia('(max-width: 760px)');

function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
    .replace(/moisturi[sz]er/g, 'moisturizer');
}

const searchText = new Map(products.map(product => [product.id, normalizeSearch([
  product.name, product.brand, product.category, product.size, product.concern,
  product.category === 'Fragrance' ? 'perfume perfumes fragrances' : '',
].join(' '))]));

const facets = {
  category: categoryPriority,
  brand: [...new Set(products.map(product => product.brand))].sort((a, b) => a.localeCompare(b)),
  concern: [...new Set(products.map(product => product.concern).filter(Boolean))],
};
const labels = { Fragrance: 'Perfumes' };
const facetRows = [];

for (const [key, values] of Object.entries(facets)) {
  const group = $(`#catalogue-${key}-options`);
  for (const value of values) {
    const label = document.createElement('label');
    label.className = 'facet-option';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = key;
    input.value = value;
    const name = document.createElement('span');
    name.textContent = labels[value] || value;
    const count = document.createElement('span');
    count.className = 'facet-count';
    count.setAttribute('aria-hidden', 'true');
    label.append(input, name, count);
    group.append(label);
    facetRows.push({ key, value, label, input, count });
  }
}

const sorters = {
  featured: (a, b) => categoryPriority.indexOf(a.category) - categoryPriority.indexOf(b.category),
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
  name: (a, b) => a.name.localeCompare(b.name),
  brand: (a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name),
};

function readFiltersFromUrl() {
  const params = new URLSearchParams(location.search);
  searchField.value = params.get('q') || '';
  minimumPrice.value = params.get('min') || '';
  maximumPrice.value = params.get('max') || '';
  const sort = params.get('sort');
  sortField.value = Object.hasOwn(sorters, sort) ? sort : 'featured';
  for (const { key, value, input } of facetRows) input.checked = params.getAll(key).includes(value);
  return params.get('focus') === 'search';
}

function updateBrandOptions() {
  const query = normalizeSearch(brandSearch.value);
  let visibleBrands = 0;
  for (const row of facetRows.filter(row => row.key === 'brand')) {
    row.label.hidden = !row.input.checked && !normalizeSearch(row.value).includes(query);
    if (!row.label.hidden) visibleBrands++;
  }
  $('#catalogue-brand-empty').hidden = visibleBrands > 0;
}

function addFilterChip(text, removeFilter) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'catalogue-chip';
  chip.textContent = `${text} ×`;
  chip.setAttribute('aria-label', `Remove filter: ${text}`);
  chip.addEventListener('click', () => {
    const index = [...filterChips.children].indexOf(chip);
    removeFilter();
    renderProducts();
    (filterChips.children[index] || filterChips.lastElementChild || (mobileFilters.matches ? filterToggle : searchField)).focus();
  });
  filterChips.append(chip);
}

function renderProducts() {
  const query = searchField.value.trim();
  const tokens = normalizeSearch(query).split(' ').filter(Boolean);
  const min = minimumPrice.valueAsNumber;
  const max = maximumPrice.valueAsNumber;
  const invalidPrice = !minimumPrice.validity.valid || !maximumPrice.validity.valid;
  const reversedPrice = min > max;
  $('#catalogue-price-error').textContent = invalidPrice
    ? 'Enter a non-negative KWD amount with up to three decimal places.'
    : reversedPrice ? 'Maximum price must be at least the minimum.' : '';

  const active = facetRows.filter(row => row.input.checked);
  const selected = Object.fromEntries(Object.keys(facets).map(key => [key, active.filter(row => row.key === key).map(row => row.value)]));
  function matches(product, excludedFacet) {
    return !invalidPrice && !reversedPrice
      && tokens.every(token => searchText.get(product.id).includes(token))
      && (Number.isNaN(min) || product.price >= min)
      && (Number.isNaN(max) || product.price <= max)
      && Object.entries(selected).every(([key, values]) => key === excludedFacet || !values.length || values.includes(product[key]));
  }

  const results = products.filter(product => matches(product)).sort(sorters[sortField.value]);
  const countText = `${results.length} ${results.length === 1 ? 'product' : 'products'}`;
  $('#catalogue-result-count').textContent = countText;
  $('#catalogue-apply').textContent = `Show ${countText}`;
  resultsGrid.innerHTML = results.length ? results.map(card).join('') : '';
  $('#catalogue-empty').hidden = results.length > 0;

  for (const row of facetRows) {
    const count = products.filter(product => product[row.key] === row.value && matches(product, row.key)).length;
    row.count.textContent = String(count);
  }
  updateBrandOptions();

  filterChips.replaceChildren();
  if (query) addFilterChip(`Search: ${query}`, () => { searchField.value = ''; });
  for (const row of active) addFilterChip(labels[row.value] || row.value, () => { row.input.checked = false; });
  if (minimumPrice.value !== '') addFilterChip(`From ${money(min)}`, () => { minimumPrice.value = ''; });
  if (maximumPrice.value !== '') addFilterChip(`Up to ${money(max)}`, () => { maximumPrice.value = ''; });
  const activeCount = filterChips.childElementCount;
  filterToggle.textContent = activeCount ? `Search & filters (${activeCount})` : 'Search & filters';
  $('#catalogue-clear').disabled = !activeCount && !invalidPrice;

  const params = new URLSearchParams();
  if (query) params.set('q', query);
  for (const { key, value } of active) params.append(key, value);
  if (!Number.isNaN(min)) params.set('min', String(min));
  if (!Number.isNaN(max)) params.set('max', String(max));
  if (sortField.value !== 'featured') params.set('sort', sortField.value);
  const queryString = params.toString();
  const url = `${location.pathname}${queryString ? `?${queryString}` : ''}${location.hash}`;
  history.replaceState(history.state, '', url);
}

function setFilterPanel(open) {
  filterForm.classList.toggle('is-open', open);
  filterToggle.setAttribute('aria-expanded', String(open));
}

function clearFilters() {
  filterForm.reset();
  renderProducts();
}

filterForm.addEventListener('input', event => {
  if (event.target === brandSearch) updateBrandOptions();
  else renderProducts();
});
filterForm.addEventListener('submit', event => { event.preventDefault(); renderProducts(); });
sortField.addEventListener('change', renderProducts);
filterToggle.addEventListener('click', () => setFilterPanel(!filterForm.classList.contains('is-open')));
$('#catalogue-apply').addEventListener('click', () => { setFilterPanel(false); filterToggle.focus(); });
$('#catalogue-clear').addEventListener('click', () => { clearFilters(); searchField.focus(); });
$('#catalogue-reset-empty').addEventListener('click', () => { clearFilters(); $('#catalogue-result-count').focus(); });
window.addEventListener('popstate', () => { readFiltersFromUrl(); renderProducts(); });

const focusSearch = readFiltersFromUrl();
if (mobileFilters.matches) {
  filterForm.querySelectorAll('.catalogue-facet').forEach(facet => { facet.open = false; });
}
renderProducts();
if (focusSearch) {
  if (mobileFilters.matches) setFilterPanel(true);
  searchField.focus();
}
