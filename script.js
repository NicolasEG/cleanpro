function addToCart(name, price, image) {
  const cartContainer = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  const emptyEl = document.getElementById('empty-cart');

  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem('novaCleanCart') || '[]');

  if (cart.length === 0) {
    cartContainer.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (subtotalEl) subtotalEl.textContent = '$0';
    if (totalEl) totalEl.textContent = '$0';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  cartContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="product-line">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p class="small-muted">Producto para limpieza profesional y del hogar</p>
        </div>
      </div>
      <div>
        <div class="qty-box">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
      </div>
      <div>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </div>
      <div>
        <button class="remove-btn" onclick="removeItem(${index})">Quitar</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
}

function changeQty(index, delta) {
  const cart = JSON.parse(localStorage.getItem('novaCleanCart') || '[]');
  if (!cart[index]) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem('novaCleanCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('novaCleanCart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('novaCleanCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function clearCart() {
  localStorage.removeItem('novaCleanCart');
  updateCartCount();
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart();
});