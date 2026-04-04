const PRODUCTS = [
  {id:1, name:'Detergente Multiactivo', category:'limpieza', categoryLabel:'Limpieza', price:4500, icon:'🧴', badge:'Más vendido'},
  {id:2, name:'Desinfectante Concentrado', category:'quimica', categoryLabel:'Química', price:6800, icon:'⚗️', badge:'Profesional'},
  {id:3, name:'Fragancia Textil Premium', category:'perfumeria', categoryLabel:'Perfumería', price:5900, icon:'✨', badge:'Nuevo'},
  {id:4, name:'Cloro Granulado Pool', category:'piletas', categoryLabel:'Piletas', price:11900, icon:'💧', badge:'Temporada'},
  {id:5, name:'Lavandina x 5L', category:'limpieza', categoryLabel:'Limpieza', price:3900, icon:'🫧', badge:'Oferta'},
  {id:6, name:'Peróxido 1 Litro', category:'quimica', categoryLabel:'Química', price:7200, icon:'🧪', badge:'Laboratorio'},
  {id:7, name:'Difusor Ambiental', category:'perfumeria', categoryLabel:'Perfumería', price:8400, icon:'🌫️', badge:'Elegido'},
  {id:8, name:'Clarificador Premium', category:'piletas', categoryLabel:'Piletas', price:9800, icon:'🌊', badge:'Alto rendimiento'},
  {id:9, name:'Limpiador de Superficies', category:'limpieza', categoryLabel:'Limpieza', price:5100, icon:'🧽', badge:'Hogar'},
  {id:10, name:'Soda Cáustica Controlada', category:'quimica', categoryLabel:'Química', price:8600, icon:'🧫', badge:'Industrial'},
  {id:11, name:'Perfume de Ambiente', category:'perfumeria', categoryLabel:'Perfumería', price:6100, icon:'🌸', badge:'Delicado'},
  {id:12, name:'Pastillas de Cloro x 5kg', category:'piletas', categoryLabel:'Piletas', price:15500, icon:'🏊', badge:'Top ventas'}
];

const formatPrice = value => new Intl.NumberFormat('es-AR', {style:'currency', currency:'ARS', maximumFractionDigits:0}).format(value);
const getCart = () => JSON.parse(localStorage.getItem('limpio_cart') || '[]');
const saveCart = cart => localStorage.setItem('limpio_cart', JSON.stringify(cart));

function addToCart(id){
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if(existing){
    existing.qty += 1;
  }else{
    const product = PRODUCTS.find(p => p.id === id);
    if(!product) return;
    cart.push({id, qty:1});
  }
  saveCart(cart);
  updateCartCount();
}

function updateCartCount(){
  const count = getCart().reduce((acc, item) => acc + item.qty, 0);
  document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = count);
}

function productCard(product){
  return `
    <article class="product-card" data-category="${product.category}">
      <div class="product-media">
        <span class="product-badge">${product.badge}</span>
        <div class="product-icon">${product.icon}</div>
      </div>
      <div class="product-body">
        <div class="product-cat">${product.categoryLabel}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-actions">
          <button class="btn btn-primary" style="flex:1" onclick="addToCart(${product.id})">Agregar</button>
          <button class="icon-square" aria-label="Favorito">♡</button>
        </div>
      </div>
    </article>
  `;
}

function renderFeatured(selector, limit = 4){
  const target = document.querySelector(selector);
  if(!target) return;
  target.innerHTML = PRODUCTS.slice(0, limit).map(productCard).join('');
}

function renderProductsPage(){
  const grid = document.querySelector('#products-grid');
  if(!grid) return;
  const searchInput = document.querySelector('#search-input');
  const sortSelect = document.querySelector('#sort-select');
  const filterLinks = [...document.querySelectorAll('[data-filter]')];

  let activeCategory = 'all';
  let search = '';
  let sort = 'default';

  const draw = () => {
    let items = [...PRODUCTS];
    if(activeCategory !== 'all') items = items.filter(p => p.category === activeCategory);
    if(search) items = items.filter(p => `${p.name} ${p.categoryLabel}`.toLowerCase().includes(search.toLowerCase()));
    if(sort === 'price-asc') items.sort((a,b) => a.price - b.price);
    if(sort === 'price-desc') items.sort((a,b) => b.price - a.price);
    if(sort === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
    grid.innerHTML = items.map(productCard).join('');
    if(items.length === 0){
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No se encontraron productos con ese filtro.</div>`;
    }
  };

  filterLinks.forEach(link => link.addEventListener('click', e => {
    e.preventDefault();
    filterLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    activeCategory = link.dataset.filter;
    draw();
  }));

  searchInput?.addEventListener('input', e => { search = e.target.value.trim(); draw(); });
  sortSelect?.addEventListener('change', e => { sort = e.target.value; draw(); });
  draw();
}

function renderCart(){
  const list = document.querySelector('#cart-items');
  const subtotalEl = document.querySelector('#subtotal');
  const shippingEl = document.querySelector('#shipping');
  const totalEl = document.querySelector('#total');
  if(!list) return;

  const cart = getCart();
  if(cart.length === 0){
    list.innerHTML = `
      <div class="empty-state">
        <h3 style="margin-top:0;color:#fff">Tu carrito está vacío</h3>
        <p style="margin-bottom:22px">Agregá productos desde la tienda para continuar con el pedido.</p>
        <a href="productos.html" class="btn btn-primary">Ir a productos</a>
      </div>`;
    subtotalEl.textContent = formatPrice(0);
    shippingEl.textContent = formatPrice(0);
    totalEl.textContent = formatPrice(0);
    updateCartCount();
    return;
  }

  const items = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return {...product, qty:item.qty};
  }).filter(Boolean);

  list.innerHTML = items.map(item => `
    <article class="cart-item">
      <div class="cart-thumb"><span>${item.icon}</span></div>
      <div>
        <div class="product-cat">${item.categoryLabel}</div>
        <h3 class="product-title">${item.name}</h3>
        <div class="product-price" style="font-size:1.7rem">${formatPrice(item.price)}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <strong>${item.qty}</strong>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <span class="remove-link" onclick="removeItem(${item.id})">Eliminar producto</span>
      </div>
      <div style="font-size:1.45rem;font-weight:800">${formatPrice(item.price * item.qty)}</div>
    </article>
  `).join('');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal >= 30000 ? 0 : 4500;
  const total = subtotal + shipping;
  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = formatPrice(shipping);
  totalEl.textContent = formatPrice(total);
  updateCartCount();
}

function changeQty(id, delta){
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    saveCart(cart.filter(i => i.id !== id));
  }else{
    saveCart(cart);
  }
  renderCart();
}

function removeItem(id){
  saveCart(getCart().filter(item => item.id !== id));
  renderCart();
}

window.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderFeatured('#featured-grid', 4);
  renderProductsPage();
  renderCart();
});
