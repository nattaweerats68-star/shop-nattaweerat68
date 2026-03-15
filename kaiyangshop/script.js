const products = [
	{
		id: 1,
		name: "99 Nights in the Forest",
		description: "บริการจำหน่ายแมพ",
		price: 150,
		isSale: false,
		img: "99_nights.webp",
	},
	{
		id: 2,
		name: "Grow A Garden",
		description: "บริการจำหน่ายแมพ",
		price: 200,
		isSale: true,
		img: "grow_a_garden.jpg",
	},
	{
		id: 3,
		name: "Blox Fruits",
		description: "บริการจำหน่ายแมพ",
		price: 100,
		isSale: true,
		img: "blox_fruits.webp",
	},
	{
		id: 4,
		name: "Hypershot",
		description: "บริการจำหน่ายแมพ",
		price: 250,
		isSale: true,
		img: "hypershot.webp",
	},
	{
		id: 5,
		name: "Escape Tsunami",
		description: "บริการจำหน่ายแมพ",
		price: 300,
		isSale: false,
		img: "escape_tsunami.webp",
	},
];

// ===================== Cart State =====================
let cart = [];

// ===================== DOM refs =====================
const productContainer = document.getElementById("product-grid");
const template = productContainer.firstElementChild.cloneNode(true);
const cartDialog = document.getElementById("cart-dialog");
const cartDialogClose = document.getElementById("cart-dialog-close");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartBadge = document.getElementById("cart-badge");
const cartToast = document.getElementById("cart-toast");
const cartToastText = document.getElementById("cart-toast-text");
const checkoutBtn = document.getElementById("checkout-btn");

// ===================== Cart Logic =====================
function addToCart(id) {
	const product = products.find((p) => p.id === id);
	if (!product) return;

	const existing = cart.find((c) => c.id === id);
	if (existing) {
		existing.qty += 1;
	} else {
		cart.push({ ...product, qty: 1 });
	}

	updateCartBadge();
	showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`);
}

function removeFromCart(id) {
	cart = cart.filter((c) => c.id !== id);
	updateCartBadge();
	renderCart();
}

function updateCartBadge() {
	const total = cart.reduce((sum, c) => sum + c.qty, 0);
	cartBadge.textContent = total;
	cartBadge.classList.toggle("hidden", total === 0);
}

let toastTimer = null;
function showToast(message) {
	cartToastText.textContent = message;
	cartToast.showPopover();
	if (toastTimer) clearTimeout(toastTimer);
	toastTimer = setTimeout(() => cartToast.hidePopover(), 2500);
}

function renderCart() {
	if (cart.length === 0) {
		cartItemsEl.innerHTML = `
			<div class="flex flex-col items-center justify-center h-40 text-gray-400 gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13L5.4 5M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
				</svg>
				<p class="text-sm font-medium">ตะกร้าของคุณว่างเปล่า</p>
			</div>`;
		cartTotalEl.textContent = "฿0";
		checkoutBtn.disabled = true;
		return;
	}

	cartItemsEl.innerHTML = cart
		.map(
			(item) => `
		<div class="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3" data-id="${item.id}">
			<img src="images/thumbnails/${item.img}" alt="${item.name}"
				class="h-14 w-14 rounded-lg object-cover shrink-0 bg-gray-200" />
			<div class="flex-1 min-w-0">
				<p class="font-semibold text-gray-800 truncate">${item.name}</p>
				<p class="text-xs text-gray-500 mt-0.5">${item.description}</p>
				<div class="flex items-center gap-3 mt-2">
					<button class="qty-btn w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition flex items-center justify-center" data-action="dec" data-id="${item.id}">−</button>
					<span class="text-sm font-semibold w-5 text-center">${item.qty}</span>
					<button class="qty-btn w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition flex items-center justify-center" data-action="inc" data-id="${item.id}">+</button>
				</div>
			</div>
			<div class="text-right shrink-0">
				<p class="font-bold text-gray-900">฿${item.price * item.qty}</p>
				<button class="remove-btn mt-2 text-xs text-red-400 hover:text-red-600 hover:underline transition" data-id="${item.id}">ลบ</button>
			</div>
		</div>`,
		)
		.join("");

	const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
	cartTotalEl.textContent = `฿${total}`;
	checkoutBtn.disabled = false;

	// Quantity & remove button events
	cartItemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const id = Number(btn.dataset.id);
			const item = cart.find((c) => c.id === id);
			if (!item) return;
			if (btn.dataset.action === "inc") {
				item.qty += 1;
			} else {
				item.qty -= 1;
				if (item.qty <= 0) {
					removeFromCart(id);
					return;
				}
			}
			updateCartBadge();
			renderCart();
		});
	});

	cartItemsEl.querySelectorAll(".remove-btn").forEach((btn) => {
		btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
	});
}

// ===================== Dialog wiring =====================
document.getElementById("cart-btn").addEventListener("click", () => {
	renderCart();
	cartDialog.showModal();
});

cartDialogClose.addEventListener("click", () => cartDialog.close());

cartDialog.addEventListener("click", (e) => {
	if (e.target === cartDialog) cartDialog.close();
});

checkoutBtn.addEventListener("click", () => {
	cart = [];
	updateCartBadge();
	renderCart();
	cartDialog.close();
	showToast("ชำระเงินสำเร็จ! ขอบคุณที่ซื้อสินค้า 🎉");
});

// ===================== Products =====================
function renderProducts(data = products) {
	if (!Array.isArray(data)) {
		return;
	}
	productContainer.innerHTML = "";

	data.forEach((item) => {
		const newNode = template.cloneNode(true);
		newNode.querySelector(".card-img img").src =
			`images/thumbnails/${item.img}`;
		newNode.querySelector(".product-title").textContent = item.name;
		newNode.querySelector(".product-description").textContent =
			item.description;
		newNode.querySelector(".product-price").textContent = item.price;
		const btn = newNode.querySelector(".product-button");
		btn.dataset.id = item.id;
		btn.addEventListener("click", () => addToCart(item.id));
		productContainer.appendChild(newNode);
	});
}

function searchProducts() {
	const keyword = document.getElementById("search-input").value.toLowerCase();
	if (!keyword) {
		renderProducts();
		return;
	}
	const filtered = products.filter((item) =>
		item.name.toLowerCase().includes(keyword),
	);
	renderProducts(filtered.length > 0 ? filtered : []);
}

document
	.getElementById("search-input")
	.addEventListener("input", searchProducts);

renderProducts();
cartToast.hidePopover();