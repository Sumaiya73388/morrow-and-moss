const products = [
  { id: "sunday-vase", name: "The Sunday Vessel", category: "Home", label: "HOME & LIVING", price: 42, rating: "4.9", reviews: 28, badge: "A LITTLE FAVOURITE", color: "#e5e3d6", art: "vase" },
  { id: "quiet-candle", name: "Quiet Hours Candle", category: "Rituals", label: "SLOW RITUALS", price: 28, rating: "4.8", reviews: 36, badge: "SLOW-MADE", color: "#e9ddd0", art: "candle" },
  { id: "everyday-tote", name: "The Everyday Tote", category: "Accessories", label: "LITTLE EXTRAS", price: 36, rating: "4.9", reviews: 19, badge: "", color: "#e4e6dc", art: "tote" },
  { id: "soft-knit", name: "Soft Landing Socks", category: "Wearables", label: "WEARABLES", price: 18, rating: "4.7", reviews: 42, badge: "MADE TO LINGER", color: "#e9e3da", art: "socks" },
  { id: "clay-mug", name: "A Slow Morning Mug", category: "Home", label: "HOME & LIVING", price: 32, rating: "5.0", reviews: 14, badge: "NEW LITTLE THING", color: "#e6ddd3", art: "mug" },
  { id: "face-oil", name: "Sunday Skin Oil", category: "Rituals", label: "SLOW RITUALS", price: 34, rating: "4.8", reviews: 31, badge: "", color: "#e1e5d9", art: "oil" },
  { id: "linen-pouch", name: "The Keepsake Pouch", category: "Accessories", label: "LITTLE EXTRAS", price: 24, rating: "4.9", reviews: 22, badge: "", color: "#e9e5d8", art: "pouch" },
  { id: "tea-towel", name: "Sunday Linen Towel", category: "Home", label: "HOME & LIVING", price: 26, rating: "4.8", reviews: 17, badge: "A GOOD GIFT", color: "#dfe4dc", art: "towel" }
];

const CART_KEY = "morrow-moss-cart";
const WISHLIST_KEY = "morrow-moss-wishlist";
const SHIPPING_THRESHOLD = 75;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const resultsLabel = document.querySelector("#results-label");
const emptyState = document.querySelector("#empty-state");
const overlay = document.querySelector("#overlay");
const drawer = document.querySelector("#cart-drawer");
const toast = document.querySelector("#toast");
let activeCategory = "All";
let cart = loadStoredValue(CART_KEY, {});
let wishlist = new Set(loadStoredValue(WISHLIST_KEY, []));
let toastTimer;

function loadStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
}

function saveStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    showToast("Your browser couldn't save this change.");
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function artSvg(type) {
  const illustrations = {
    vase: '<ellipse cx="100" cy="177" rx="43" ry="8" fill="#79735f" opacity=".14"/><path d="M91 68h18v15c0 6 3 10 8 15 13 13 20 28 16 48-3 17-17 26-33 26s-30-9-33-26c-4-20 4-36 17-49 5-5 7-9 7-14V68Z" fill="#c6b696"/><path d="M92 70h16v7H92z" fill="#a89878"/><path d="M96 68h8v5h-8z" fill="#827b65"/><path d="M99 68 85 28m15 40 14-50m-14 40 31-23" fill="none" stroke="#737862" stroke-width="2"/><path d="M80 31c-13 3-17-7-17-15 12 0 18 5 17 15Zm23-10c-2-12 5-19 14-21 2 12-4 19-14 21Zm14 14c2-12 10-16 20-15-2 12-10 17-20 15Zm-28 2c-10 1-15-5-16-13 10-1 16 4 16 13Z" fill="#879077"/>',
    candle: '<ellipse cx="100" cy="177" rx="37" ry="7" fill="#6f5c4d" opacity=".12"/><rect x="67" y="69" width="66" height="101" rx="9" fill="#d0b59b"/><ellipse cx="100" cy="70" rx="33" ry="8" fill="#ead7c1"/><ellipse cx="100" cy="72" rx="26" ry="5" fill="#d7c3ac"/><path d="M100 67c-7-10 5-17 3-26 13 13 4 19 1 26Z" fill="#c38a58"/><path d="M100 66c-3-7 4-10 4-14 5 7 1 11-1 14Z" fill="#f3d9a1"/><path d="M80 96h40m-40 5h40" stroke="#b09a81" stroke-width="1"/>',
    tote: '<path d="M55 79h90l-7 91H62l-7-91Z" fill="#c8cbbb"/><path d="M76 84V63c0-15 7-24 24-24s24 9 24 24v21" fill="none" stroke="#a1a78f" stroke-width="7"/><path d="M72 106h56" stroke="#b1b8a2" stroke-width="2"/><path d="M87 128c5-7 10-7 15 0 5-7 10-7 15 0-5 6-10 6-15 0-5 6-10 6-15 0Z" fill="#e7e6da"/>',
    socks: '<path d="M79 40h29v61c0 12 8 17 20 20 10 3 15 10 12 20-3 13-13 20-27 20H68c-10 0-15-6-13-15 2-10 11-13 18-21 5-6 6-12 6-22V40Z" fill="#d3c4b0"/><path d="M81 53h26m-26 10h26m-26 10h26" stroke="#b7a792" stroke-width="2"/><path d="M65 148h57" stroke="#e8dccb" stroke-width="4"/>',
    mug: '<ellipse cx="94" cy="164" rx="45" ry="8" fill="#655b4b" opacity=".12"/><path d="M60 75h73v68c0 18-14 27-36 27s-37-9-37-27V75Z" fill="#c8a992"/><ellipse cx="96.5" cy="76" rx="36.5" ry="9" fill="#e1cbbb"/><ellipse cx="96.5" cy="78" rx="27" ry="5" fill="#8a6e58"/><path d="M132 91h11c13 0 18 8 18 20 0 13-7 20-19 20h-10" fill="none" stroke="#b99176" stroke-width="9"/><path d="M75 113c10-4 20-4 31 0" fill="none" stroke="#e5d4c6" stroke-width="2"/>',
    oil: '<ellipse cx="100" cy="177" rx="35" ry="7" fill="#62674f" opacity=".13"/><path d="M82 61h36l9 23v83H73V84l9-23Z" fill="#aeb496"/><path d="M88 46h24v19H88z" fill="#c9b99a"/><path d="M90 36h20v12H90z" fill="#a99573"/><rect x="80" y="107" width="40" height="38" rx="3" fill="#e8e4d5"/><path d="M88 119h24m-20 8h16" stroke="#90967e" stroke-width="2"/><path d="M91 30h18" stroke="#766e5b" stroke-width="4" stroke-linecap="round"/>',
    pouch: '<path d="M56 77h88l-6 78c-1 10-9 16-20 16H82c-11 0-19-6-20-16l-6-78Z" fill="#cfc8ad"/><path d="M59 83h82" stroke="#a79d80" stroke-width="3"/><path d="M71 100h58" stroke="#e7e2d0" stroke-width="2"/><path d="M91 130c4-5 8-5 12 0 4-5 8-5 12 0-4 5-8 5-12 0-4 5-8 5-12 0Z" fill="#9b9b7f"/><path d="M70 76c10 6 49 6 60 0" fill="none" stroke="#a99e83" stroke-width="3"/>',
    towel: '<path d="M58 48h85v119H58z" fill="#c3cdbf"/><path d="M71 48v119m59-119v119" stroke="#e5e8dc" stroke-width="2"/><path d="M58 66h85m-85 82h85" stroke="#a9b5a3" stroke-width="2"/><path d="M75 90c5-7 10-7 15 0 5-7 10-7 15 0-5 7-10 7-15 0-5 7-10 7-15 0Z" fill="#f0eee4"/><path d="M79 108h43" stroke="#e5e8dc" stroke-width="2"/>'
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${illustrations[type]}</svg>`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    const matchesQuery = `${product.name} ${product.category} ${product.label}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
  const sort = sortSelect.value;
  if (sort === "price-low") visibleProducts = [...visibleProducts].sort((a, b) => a.price - b.price);
  if (sort === "price-high") visibleProducts = [...visibleProducts].sort((a, b) => b.price - a.price);
  if (sort === "rating") visibleProducts = [...visibleProducts].sort((a, b) => Number(b.rating) - Number(a.rating));

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-art" style="--art-bg:${product.color}">
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
        <button class="wishlist-button" type="button" data-wishlist="${product.id}" aria-label="${wishlist.has(product.id) ? "Remove" : "Add"} ${escapeHtml(product.name)} ${wishlist.has(product.id) ? "from" : "to"} wishlist" aria-pressed="${wishlist.has(product.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 8.5c0 5-8.4 11-8.4 11s-8.4-6-8.4-11a4.4 4.4 0 0 1 8.4-1.7 4.4 4.4 0 0 1 8.4 1.7Z"/></svg>
        </button>
        ${artSvg(product.art)}
        <div class="art-caption"><span>M&amp;M OBJECTS</span><span>№ 0${products.indexOf(product) + 1}</span></div>
      </div>
      <div class="product-info">
        <div class="product-meta"><span class="product-category">${escapeHtml(product.label)}</span><span class="product-rating"><span aria-hidden="true">★</span> ${product.rating} <span>(${product.reviews})</span></span></div>
        <div class="product-title-row"><h3 class="product-title">${escapeHtml(product.name)}</h3><span class="product-price">${money.format(product.price)}</span></div>
        <button class="add-button" type="button" data-add="${product.id}"><span>Add to your everyday</span><span aria-hidden="true">＋</span></button>
      </div>
    </article>`).join("");

  emptyState.hidden = visibleProducts.length > 0;
  productGrid.hidden = visibleProducts.length === 0;
  const description = query ? `Results for “${escapeHtml(searchInput.value.trim())}”` : activeCategory === "All" ? "A few things we think you'll love" : `${escapeHtml(activeCategory)} things to love`;
  resultsLabel.innerHTML = `${description} <span>·</span> <b>${String(visibleProducts.length).padStart(2, "0")} ${visibleProducts.length === 1 ? "piece" : "pieces"}</b>`;
}

function cartEntries() {
  return Object.entries(cart).filter(([id, quantity]) => products.some((product) => product.id === id) && Number.isInteger(quantity) && quantity > 0);
}

function cartTotal() {
  return cartEntries().reduce((total, [id, quantity]) => total + products.find((product) => product.id === id).price * quantity, 0);
}

function updateCart() {
  const entries = cartEntries();
  const itemCount = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = cartTotal();
  document.querySelector("#cart-count").textContent = String(itemCount);
  document.querySelector("#cart-trigger").setAttribute("aria-label", `Open shopping bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`);
  document.querySelector("#drawer-count").textContent = `(${itemCount})`;
  document.querySelector("#cart-subtotal").textContent = money.format(total);
  document.querySelector("#shipping-remaining").textContent = money.format(Math.max(0, SHIPPING_THRESHOLD - total));
  document.querySelector("#cart-empty").hidden = itemCount > 0;
  document.querySelector("#drawer-footer").hidden = itemCount === 0;
  document.querySelector("#cart-items").innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `<article class="cart-line">
      <div class="cart-thumb" style="--art-bg:${product.color}">${artSvg(product.art)}</div>
      <div class="cart-line-main"><h3>${escapeHtml(product.name)}</h3><p>${money.format(product.price)}</p>
        <div class="quantity-control" aria-label="Quantity for ${escapeHtml(product.name)}">
          <button type="button" data-quantity="${id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${quantity}</span><button type="button" data-quantity="${id}" data-change="1" aria-label="Increase quantity">＋</button>
        </div>
      </div>
      <div class="cart-line-end"><b>${money.format(product.price * quantity)}</b><button class="remove-item" type="button" data-remove="${id}">Remove</button></div>
    </article>`;
  }).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function setOverlay(isOpen) {
  overlay.hidden = !isOpen;
  document.body.classList.toggle("has-overlay", isOpen);
  requestAnimationFrame(() => overlay.classList.toggle("is-visible", isOpen));
}

function openCart() {
  updateCart();
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  setOverlay(true);
  document.querySelector("#close-drawer").focus();
}

function closeCart() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  if (!checkoutModal.classList.contains("is-open")) setOverlay(false);
}

const checkoutModal = document.querySelector("#checkout-modal");
function openCheckout() {
  if (cartEntries().length === 0) return;
  closeCart();
  document.querySelector("#modal-total").textContent = money.format(cartTotal());
  document.querySelector("#modal-copy").textContent = `Your considered collection is ready to find a home. ${cartEntries().reduce((sum, [, count]) => sum + count, 0)} lovely thing(s), all yours.`;
  checkoutModal.classList.add("is-open");
  checkoutModal.setAttribute("aria-hidden", "false");
  setOverlay(true);
  document.querySelector("#close-modal").focus();
}

function closeCheckout() {
  checkoutModal.classList.remove("is-open");
  checkoutModal.setAttribute("aria-hidden", "true");
  setOverlay(false);
}

document.querySelector("#category-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category-pill").forEach((pill) => {
    const selected = pill === button;
    pill.classList.toggle("is-active", selected);
    pill.setAttribute("aria-pressed", String(selected));
  });
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
document.querySelector("#clear-filters").addEventListener("click", () => {
  activeCategory = "All";
  searchInput.value = "";
  document.querySelectorAll(".category-pill").forEach((pill, index) => {
    pill.classList.toggle("is-active", index === 0);
    pill.setAttribute("aria-pressed", String(index === 0));
  });
  renderProducts();
});

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    const product = products.find((item) => item.id === addButton.dataset.add);
    cart[product.id] = (cart[product.id] || 0) + 1;
    saveStoredValue(CART_KEY, cart);
    updateCart();
    showToast(`${product.name} added to your bag.`);
    return;
  }
  const wishlistButton = event.target.closest("[data-wishlist]");
  if (wishlistButton) {
    const id = wishlistButton.dataset.wishlist;
    if (wishlist.has(id)) wishlist.delete(id);
    else wishlist.add(id);
    saveStoredValue(WISHLIST_KEY, [...wishlist]);
    renderProducts();
    showToast(wishlist.has(id) ? "Tucked away in your wishlist." : "Removed from your wishlist.");
  }
});

document.querySelector("#cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) {
    const id = quantityButton.dataset.quantity;
    cart[id] += Number(quantityButton.dataset.change);
    if (cart[id] <= 0) delete cart[id];
  } else if (removeButton) {
    delete cart[removeButton.dataset.remove];
  } else return;
  saveStoredValue(CART_KEY, cart);
  updateCart();
});

document.querySelector("#cart-trigger").addEventListener("click", openCart);
document.querySelector("#close-drawer").addEventListener("click", closeCart);
document.querySelector("#continue-shopping").addEventListener("click", closeCart);
document.querySelector("#checkout-button").addEventListener("click", openCheckout);
document.querySelector("#close-modal").addEventListener("click", closeCheckout);
overlay.addEventListener("click", () => {
  if (checkoutModal.classList.contains("is-open")) closeCheckout();
  else closeCart();
});
document.querySelector("#confirm-checkout").addEventListener("click", () => {
  cart = {};
  saveStoredValue(CART_KEY, cart);
  updateCart();
  closeCheckout();
  showToast("Your pretend order is placed. Thanks for stopping by!");
});
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
  if (event.key === "Escape") {
    if (checkoutModal.classList.contains("is-open")) closeCheckout();
    else if (drawer.classList.contains("is-open")) closeCart();
    else if (document.activeElement === searchInput) searchInput.blur();
  }
});

renderProducts();
updateCart();

if ("serviceWorker" in navigator && (location.protocol === "http:" || location.protocol === "https:")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Offline caching could not be enabled.", error);
    });
  });
}
