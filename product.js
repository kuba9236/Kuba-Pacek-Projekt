"use strict";
const el = id => document.getElementById(id);
const money = n => Number(n).toLocaleString('pl-PL', {style:'currency',currency:'PLN'});
const imageUrl = name => /^https?:\/\//i.test(String(name||'')) ? String(name) : `images/${encodeURIComponent(String(name||''))}`;
let product = null;
let user = null;
let favorite = false;
let cart = [];
try { const saved = JSON.parse(localStorage.getItem('brickstore_cart') || '[]'); cart = Array.isArray(saved) ? saved : []; } catch { cart = []; }
function count() { el('cartCount').textContent = cart.reduce((sum, item) => sum + (Number(item.quantity)||0), 0); }
function message(text) { el('detailMessage').textContent = text; }
async function request(url, options) { const response = await fetch(url, {credentials:'same-origin',...options}); const data = await response.json().catch(()=>({})); if(!response.ok) throw Error(data.error||'Błąd serwera.'); return data; }
async function init() {
    count();
    const id = Number(new URLSearchParams(location.search).get('id'));
    if (!Number.isSafeInteger(id) || id < 1) { el('detailStatus').textContent = 'Nieprawidłowy adres produktu.'; return; }
    try {
        const result = await request(`api/product.php?id=${id}`);
        product = result.product;
        document.title = `${product.name} | BrickStore`;
        el('detailName').textContent = product.name;
        el('detailCategory').textContent = product.category;
        el('detailPrice').textContent = money(product.price);
        el('detailDescription').textContent = product.description || 'Brak dodatkowego opisu zestawu.';
        el('detailImage').src = imageUrl(product.image);
        el('detailImage').alt = product.name;
        el('detailImage').onerror = () => { el('detailImage').onerror = null; el('detailImage').src='https://placehold.co/700x700?text=Brak+zdjecia'; };
        const stock = Number(product.stock);
        const available = Number(product.is_available) === 1 && stock > 0;
        el('detailStock').textContent = available ? `✓ Dostępne: ${stock} szt.` : 'Produkt niedostępny';
        el('detailStock').classList.toggle('unavailable', !available);
        el('stockBar').style.width = `${Math.max(0,Math.min(100,stock/12*100))}%`;
        el('stockHint').textContent = !available ? 'Aktualnie brak w magazynie' : stock <= 3 ? 'Ostatnie sztuki w magazynie!' : 'Produkt dostępny w magazynie';
        saveRecentlyViewed(id);
        loadRecommendations(id);
        el('detailQuantity').max = String(stock);
        el('detailQuantity').disabled = !available;
        el('detailAdd').disabled = !available;
        el('detailStatus').classList.add('hidden');
        el('productDetail').classList.remove('hidden');
        try {
            const auth = await request('api/auth.php?action=me'); user = auth.user;
            if (user) { const fav = await request('api/favorites.php'); favorite = (fav.products||[]).some(p=>Number(p.id)===id); updateFavorite(); }
        } catch { /* Szczegóły pozostają dostępne bez logowania. */ }
    } catch (error) { el('detailStatus').textContent = error.message; }
}
function updateFavorite() { el('detailFavorite').textContent = favorite ? '❤️ Usuń z ulubionych' : '♡ Dodaj do ulubionych'; }
el('detailAdd').addEventListener('click', () => {
    if (!product) return;
    const quantity = Number(el('detailQuantity').value);
    const stock = Number(product.stock);
    if (!Number.isSafeInteger(quantity) || quantity < 1) { message('Podaj poprawną liczbę sztuk.'); return; }
    const id = Number(product.id);
    const existing = cart.find(item=>Number(item.id)===id);
    if (quantity + (Number(existing?.quantity)||0) > stock) { message(`Nie możesz dodać więcej niż ${stock} szt. łącznie.`); return; }
    if (existing) { existing.quantity += quantity; existing.stock = stock; }
    else cart.push({id,name:product.name,price:Number(product.price),image:product.image,quantity,stock});
    localStorage.setItem('brickstore_cart',JSON.stringify(cart)); count(); message(`Dodano ${quantity} szt. do koszyka! Koszyk otworzysz na stronie głównej.`);
});
el('detailFavorite').addEventListener('click', async () => {
    if (!product) return;
    if (!user) { message('Aby zapisać ulubione, zaloguj się na stronie głównej.'); return; }
    try {
        await request('api/favorites.php',{method:favorite?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({product_id:Number(product.id)})});
        favorite=!favorite;updateFavorite();message(favorite?'Dodano do ulubionych.':'Usunięto z ulubionych.');
    } catch (error) { message(error.message); }
});
init();

// Produkty podobne i ostatnio oglądane: korzystają z istniejącego API oraz bazy skleplego.
function saveRecentlyViewed(id) {
    let recent = [];
    try { recent = JSON.parse(localStorage.getItem('brickstore_recent') || '[]'); } catch {}
    if (!Array.isArray(recent)) recent = [];
    recent = [id, ...recent.filter(x => Number(x) !== id)].slice(0, 6);
    localStorage.setItem('brickstore_recent', JSON.stringify(recent));
}
function createMiniCard(p) {
    const a = document.createElement('a');
    a.className = 'mini-product';
    a.href = `product.html?id=${encodeURIComponent(p.id)}`;
    const img = document.createElement('img');
    img.src = imageUrl(p.image);
    img.alt = p.name;
    img.loading = 'lazy';
    const title = document.createElement('strong'); title.textContent = p.name;
    const price = document.createElement('span'); price.textContent = money(p.price);
    a.append(img, title, price);
    return a;
}
async function loadRecommendations(id) {
    const related = el('relatedProducts');
    const recentBox = el('recentProducts');
    try {
        const result = await request('api/products.php');
        const all = result.products || [];
        const similar = all.filter(p => Number(p.id) !== id && Number(p.category_id) === Number(product.category_id)).slice(0, 4);
        if (similar.length) similar.forEach(p => related.append(createMiniCard(p)));
        else related.textContent = 'Na razie brak innych dostępnych zestawów w tej kategorii.';
        let recent = [];
        try { recent = JSON.parse(localStorage.getItem('brickstore_recent') || '[]'); } catch {}
        const history = (Array.isArray(recent) ? recent : []).filter(x => Number(x) !== id).map(x => all.find(p => Number(p.id) === Number(x))).filter(Boolean).slice(0,4);
        if (history.length) history.forEach(p => recentBox.append(createMiniCard(p)));
        else recentBox.textContent = 'Odwiedź kilka produktów, a pojawią się tutaj.';
    } catch {
        related.textContent = 'Nie udało się wczytać rekomendacji.';
        recentBox.textContent = 'Historia przeglądania jest chwilowo niedostępna.';
    }
}
el('shareProduct').addEventListener('click', async () => {
    const url = location.href;
    try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(url);
        else {
            const field = document.createElement('textarea'); field.value = url;
            field.style.position = 'fixed'; field.style.opacity = '0';
            document.body.append(field); field.select();
            if (!document.execCommand('copy')) throw new Error('copy failed');
            field.remove();
        }
        message('Skopiowano link do produktu.');
    } catch { message(`Link do skopiowania: ${url}`); }
});
