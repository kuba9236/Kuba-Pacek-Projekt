'use strict';

const API = 'api';
const productsContainer = document.getElementById('productsContainer');
const favoritesContainer = document.getElementById('favoritesContainer');
const productsStatus = document.getElementById('productsStatus');
const favoritesStatus = document.getElementById('favoritesStatus');
const categoriesContainer = document.getElementById('categoriesContainer');
const searchInput = document.getElementById('searchInput');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cart = document.getElementById('cart');
const accountPanel = document.getElementById('accountPanel');
const overlay = document.getElementById('overlay');
const accountMessage = document.getElementById('accountMessage');

let products = [];
let favorites = [];
let currentUser = null;
let activeCategory = 'Wszystkie';
let cartData = JSON.parse(localStorage.getItem('brickstore_cart') || '[]');

async function api(path, options = {}) {
    const response = await fetch(`${API}/${path}`, {
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Wystąpił błąd serwera.');
    return result;
}

function escapeHtml(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}
function money(value) {
    return Number(value).toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' });
}
function imageUrl(filename) {
    // W bazie przechowywana jest nazwa pliku, np. hpdwa.png.
    // Umieść zdjęcia w folderze images/ lub zapisz w bazie pełny URL https://...
    const value = String(filename || '').trim();
    if (/^https?:\/\//i.test(value)) return value;
    return `images/${encodeURIComponent(value)}`;
}
function productCard(product, favoriteMode = false) {
    const id = Number(product.id);
    const isFavorite = favorites.some(item => Number(item.id) === id);
    return `<article class="product-card">
        <img src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Brak+zdjecia'">
        <div class="product-info"><span class="product-category">${escapeHtml(product.category || '')}</span>
        <h3>${escapeHtml(product.name)}</h3><p class="description">${escapeHtml(product.description || '')}</p>
        <p class="stock">Dostępne sztuki: ${Number(product.stock)}</p><p class="price">${money(product.price)}</p>
        <div class="product-buttons"><button class="add-cart" data-add="${id}" ${Number(product.stock) < 1 ? 'disabled' : ''}>Dodaj do koszyka</button>
        <button class="favorite-btn ${isFavorite ? 'is-favorite' : ''}" data-favorite="${id}" title="${isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}" aria-label="${isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}">${isFavorite ? '❤️' : '♡'}</button></div></div></article>`;
}
function renderProducts() {
    const query = searchInput.value.trim().toLocaleLowerCase('pl-PL');
    const filtered = products.filter(p => (activeCategory === 'Wszystkie' || p.category === activeCategory) && `${p.name} ${p.category} ${p.description || ''}`.toLocaleLowerCase('pl-PL').includes(query));
    productsContainer.innerHTML = filtered.map(p => productCard(p)).join('');
    productsStatus.textContent = filtered.length ? `Znaleziono zestawów: ${filtered.length}` : 'Brak produktów pasujących do wyszukiwania.';
    renderFavorites();
}
function renderCategories(categories) {
    categoriesContainer.innerHTML = `<button class="category ${activeCategory === 'Wszystkie' ? 'active' : ''}" data-category="Wszystkie">Wszystkie</button>` +
        categories.map(c => `<button class="category ${activeCategory === c.name ? 'active' : ''}" data-category="${escapeHtml(c.name)}">${escapeHtml(c.name)}</button>`).join('');
}
function renderFavorites() {
    if (!currentUser) {
        favoritesContainer.innerHTML = '';
        favoritesStatus.textContent = 'Zaloguj się, aby zobaczyć i zapisywać ulubione zestawy.';
        return;
    }
    favoritesContainer.innerHTML = favorites.map(p => productCard(p, true)).join('');
    favoritesStatus.textContent = favorites.length ? `Ulubione zestawy: ${favorites.length}` : 'Nie masz jeszcze ulubionych zestawów.';
}
async function loadFavorites() {
    if (!currentUser) { favorites = []; renderFavorites(); return; }
    const data = await api('favorites.php');
    favorites = data.products || [];
    renderProducts();
}
async function loadStore() {
    try {
        const [productData, categoryData, authData] = await Promise.all([
            api('products.php'), api('categories.php'), api('auth.php?action=me')
        ]);
        products = productData.products || [];
        currentUser = authData.user;
        renderCategories(categoryData.categories || []);
        renderProducts();
        updateAccountUI();
        if (currentUser) await loadFavorites();
    } catch (error) {
        productsStatus.textContent = `${error.message} Uruchom projekt przez serwer PHP i sprawdź api/db.php.`;
    }
    renderCart();
}
function updateAccountUI() {
    document.getElementById('loginForm').classList.toggle('hidden', !!currentUser);
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('userPanel').classList.toggle('hidden', !currentUser);
    document.getElementById('currentUser').textContent = currentUser?.username || '';
    document.getElementById('accountBtn').textContent = currentUser ? `👤 ${currentUser.username}` : '👤 Konto';
    renderFavorites();
}
function showPanel(panel) {
    cart.classList.remove('open'); accountPanel.classList.remove('open');
    panel.classList.add('open'); overlay.classList.add('show');
}
function closePanels() {
    cart.classList.remove('open'); accountPanel.classList.remove('open'); overlay.classList.remove('show');
}
function renderCart() {
    localStorage.setItem('brickstore_cart', JSON.stringify(cartData));
    cartCount.textContent = cartData.reduce((sum, item) => sum + item.quantity, 0);
    cartItems.innerHTML = cartData.length ? cartData.map(item => `<div class="cart-item"><img src="${escapeHtml(imageUrl(item.image))}" alt=""><div class="cart-info"><strong>${escapeHtml(item.name)}</strong><p>${money(item.price)} × ${item.quantity}</p><div class="quantity-controls"><button data-quantity="${item.id}" data-change="-1" aria-label="Zmniejsz ilość">−</button><button data-quantity="${item.id}" data-change="1" aria-label="Zwiększ ilość">+</button><button class="remove-item" data-remove="${item.id}">Usuń</button></div></div></div>`).join('') : '<p>Twój koszyk jest pusty.</p>';
    cartTotal.textContent = money(cartData.reduce((sum, item) => sum + item.price * item.quantity, 0));
}
function addToCart(id) {
    const product = products.find(p => Number(p.id) === id);
    if (!product) return;
    const existing = cartData.find(item => item.id === id);
    if ((existing?.quantity || 0) >= Number(product.stock)) { alert('Nie ma więcej sztuk tego produktu w magazynie.'); return; }
    if (existing) existing.quantity++;
    else cartData.push({ id, name: product.name, price: Number(product.price), image: product.image, quantity: 1, stock: Number(product.stock) });
    renderCart();
}
async function toggleFavorite(id) {
    if (!currentUser) {
        accountMessage.textContent = 'Zaloguj się, aby zapisywać ulubione zestawy.';
        showPanel(accountPanel); return;
    }
    const exists = favorites.some(p => Number(p.id) === id);
    try {
        await api('favorites.php', { method: exists ? 'DELETE' : 'POST', body: JSON.stringify({ product_id: id }) });
        await loadFavorites();
    } catch (error) { alert(error.message); }
}

searchInput.addEventListener('input', renderProducts);
categoriesContainer.addEventListener('click', event => {
    const button = event.target.closest('[data-category]'); if (!button) return;
    activeCategory = button.dataset.category;
    categoriesContainer.querySelectorAll('.category').forEach(b => b.classList.toggle('active', b === button));
    renderProducts();
});
document.addEventListener('click', event => {
    const add = event.target.closest('[data-add]'); if (add) addToCart(Number(add.dataset.add));
    const fav = event.target.closest('[data-favorite]'); if (fav) toggleFavorite(Number(fav.dataset.favorite));
    const remove = event.target.closest('[data-remove]');
    if (remove) { cartData = cartData.filter(item => item.id !== Number(remove.dataset.remove)); renderCart(); }
    const quantity = event.target.closest('[data-quantity]');
    if (quantity) {
        const item = cartData.find(p => p.id === Number(quantity.dataset.quantity));
        if (!item) return;
        const next = item.quantity + Number(quantity.dataset.change);
        if (next <= 0) cartData = cartData.filter(p => p.id !== item.id);
        else if (next <= item.stock) item.quantity = next;
        else alert('Nie ma więcej sztuk tego produktu w magazynie.');
        renderCart();
    }
});
document.getElementById('cartBtn').addEventListener('click', () => showPanel(cart));
document.getElementById('accountBtn').addEventListener('click', () => showPanel(accountPanel));
document.getElementById('closeCart').addEventListener('click', closePanels);
document.getElementById('closeAccount').addEventListener('click', closePanels);
overlay.addEventListener('click', closePanels);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closePanels(); });
document.getElementById('showRegister').addEventListener('click', () => { document.getElementById('loginForm').classList.add('hidden'); document.getElementById('registerForm').classList.remove('hidden'); accountMessage.textContent = ''; });
document.getElementById('showLogin').addEventListener('click', () => { document.getElementById('registerForm').classList.add('hidden'); document.getElementById('loginForm').classList.remove('hidden'); accountMessage.textContent = ''; });
document.getElementById('loginFields').addEventListener('submit', async event => {
    event.preventDefault(); accountMessage.textContent = '';
    try { const data = await api('auth.php?action=login', { method: 'POST', body: JSON.stringify({ username: document.getElementById('loginUsername').value.trim(), password: document.getElementById('loginPassword').value }) }); currentUser = data.user; updateAccountUI(); await loadFavorites(); accountMessage.textContent = 'Zalogowano pomyślnie.'; }
    catch (error) { accountMessage.textContent = error.message; }
});
document.getElementById('registerFields').addEventListener('submit', async event => {
    event.preventDefault(); accountMessage.textContent = '';
    try { const data = await api('auth.php?action=register', { method: 'POST', body: JSON.stringify({ username: document.getElementById('registerUsername').value.trim(), password: document.getElementById('registerPassword').value }) }); currentUser = data.user; updateAccountUI(); await loadFavorites(); accountMessage.textContent = 'Konto utworzone pomyślnie.'; }
    catch (error) { accountMessage.textContent = error.message; }
});
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try { await api('auth.php?action=logout', { method: 'POST', body: '{}' }); currentUser = null; favorites = []; updateAccountUI(); accountMessage.textContent = 'Wylogowano.'; }
    catch (error) { accountMessage.textContent = error.message; }
});
loadStore();
