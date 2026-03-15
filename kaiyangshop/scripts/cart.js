// ===================== Cart Module (localStorage) =====================
const CART_KEY = "kaiyangshop_cart";

export function getCart() {
	try {
		return JSON.parse(localStorage.getItem(CART_KEY)) || [];
	} catch {
		return [];
	}
}

export function saveCart(cart) {
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product) {
	const cart = getCart();
	const existing = cart.find(
		(c) => c.id === product.id && c.categoryId === product.categoryId,
	);
	if (existing) {
		existing.qty += 1;
	} else {
		cart.push({
			id: product.id,
			categoryId: product.categoryId,
			name: product.name,
			price: product.price,
			img: product.img,
			qty: 1,
		});
	}
	saveCart(cart);
	updateCartBadge();
}

export function removeFromCart(productId, categoryId) {
	let cart = getCart();
	cart = cart.filter(
		(c) => !(c.id === productId && c.categoryId === categoryId),
	);
	saveCart(cart);
	updateCartBadge();
}

export function updateQty(productId, categoryId, delta) {
	const cart = getCart();
	const item = cart.find(
		(c) => c.id === productId && c.categoryId === categoryId,
	);
	if (!item) return;
	item.qty += delta;
	if (item.qty <= 0) {
		removeFromCart(productId, categoryId);
		return;
	}
	saveCart(cart);
	updateCartBadge();
}

export function clearCart() {
	localStorage.removeItem(CART_KEY);
	updateCartBadge();
}

export function getCartTotal() {
	return getCart().reduce((sum, c) => sum + c.price * c.qty, 0);
}

export function getCartCount() {
	return getCart().reduce((sum, c) => sum + c.qty, 0);
}

// ===================== Badge =====================
export function updateCartBadge() {
	const badge = document.getElementById("cart-badge");
	if (!badge) return;
	const total = getCartCount();
	badge.textContent = total;
	badge.classList.toggle("hidden", total === 0);
}

// ===================== Toast =====================
let toastTimer = null;
export function showToast(message) {
	const toast = document.getElementById("cart-toast");
	const text = document.getElementById("cart-toast-text");
	if (!toast || !text) return;
	text.textContent = message;
	toast.showPopover();
	if (toastTimer) clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.hidePopover(), 2500);
}

// ===================== Cart Dialog Renderer =====================
export function renderCartDialog() {
	const cartItemsEl = document.getElementById("cart-items");
	const cartTotalEl = document.getElementById("cart-total");
	const checkoutBtn = document.getElementById("checkout-btn");
	if (!cartItemsEl) return;

	const cart = getCart();

	if (cart.length === 0) {
		cartItemsEl.innerHTML = `
			<div class="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
				</svg>
				<p class="text-sm font-medium">ตะกร้าของคุณว่างเปล่า</p>
			</div>`;
		if (cartTotalEl) cartTotalEl.textContent = "฿0";
		if (checkoutBtn) checkoutBtn.disabled = true;
		return;
	}

	cartItemsEl.innerHTML = cart
		.map(
			(item) => `
		<div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3" data-id="${item.id}" data-cat="${item.categoryId}">
			<img src="images/thumbnails/${item.img}" alt="${item.name}"
				class="h-14 w-14 rounded-lg object-cover shrink-0 bg-gray-200" />
			<div class="flex-1 min-w-0">
				<p class="font-semibold text-gray-800 truncate">${item.name}</p>
				<p class="text-xs text-gray-500 mt-0.5">฿${item.price} ต่อชิ้น</p>
				<div class="flex items-center gap-3 mt-2">
					<button class="qty-btn w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition flex items-center justify-center" data-action="dec" data-id="${item.id}" data-cat="${item.categoryId}">−</button>
					<span class="text-sm font-semibold w-5 text-center">${item.qty}</span>
					<button class="qty-btn w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition flex items-center justify-center" data-action="inc" data-id="${item.id}" data-cat="${item.categoryId}">+</button>
				</div>
			</div>
			<div class="text-right shrink-0">
				<p class="font-bold text-gray-900">฿${item.price * item.qty}</p>
				<button class="remove-btn mt-2 text-xs text-red-400 hover:text-red-600 hover:underline transition" data-id="${item.id}" data-cat="${item.categoryId}">ลบ</button>
			</div>
		</div>`,
		)
		.join("");

	const total = getCartTotal();
	if (cartTotalEl) cartTotalEl.textContent = `฿${total}`;
	if (checkoutBtn) checkoutBtn.disabled = false;

	cartItemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const id = Number(btn.dataset.id);
			const cat = Number(btn.dataset.cat);
			const delta = btn.dataset.action === "inc" ? 1 : -1;
			updateQty(id, cat, delta);
			renderCartDialog();
		});
	});

	cartItemsEl.querySelectorAll(".remove-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			removeFromCart(Number(btn.dataset.id), Number(btn.dataset.cat));
			renderCartDialog();
		});
	});
}

// ===================== Wire Cart Dialog (call on any page with the dialog) =====================
export function initCartDialog() {
	const cartBtn = document.getElementById("cart-btn");
	const cartDialog = document.getElementById("cart-dialog");
	const cartDialogClose = document.getElementById("cart-dialog-close");
	const checkoutBtn = document.getElementById("checkout-btn");

	if (!cartDialog) return;

	if (cartBtn) {
		cartBtn.addEventListener("click", () => {
			renderCartDialog();
			cartDialog.showModal();
		});
	}

	if (cartDialogClose) {
		cartDialogClose.addEventListener("click", () => cartDialog.close());
	}

	cartDialog.addEventListener("click", (e) => {
		if (e.target === cartDialog) cartDialog.close();
	});

	if (checkoutBtn) {
		checkoutBtn.addEventListener("click", () => {
			clearCart();
			renderCartDialog();
			cartDialog.close();
			showToast("ชำระเงินสำเร็จ! ขอบคุณที่ซื้อสินค้า 🎉");
		});
	}

	updateCartBadge();
}
