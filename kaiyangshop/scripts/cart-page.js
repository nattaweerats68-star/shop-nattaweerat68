import {
	getCart,
	updateQty,
	removeFromCart,
	clearCart,
	getCartTotal,
	getCartCount,
	updateCartBadge,
	showToast,
} from "./cart.js";

const cartItemsEl = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartSummary = document.getElementById("cart-summary");
const summaryCount = document.getElementById("summary-count");
const summaryTotal = document.getElementById("summary-total");
const cartCountLabel = document.getElementById("cart-count-label");
const checkoutBtn = document.getElementById("checkout-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");

function renderCart() {
	const cart = getCart();

	if (cart.length === 0) {
		cartItemsEl.innerHTML = "";
		cartEmpty.classList.remove("hidden");
		cartSummary.classList.add("hidden");
		cartCountLabel.textContent = "";
		updateCartBadge();
		return;
	}

	cartEmpty.classList.add("hidden");
	cartSummary.classList.remove("hidden");

	cartItemsEl.innerHTML = cart
		.map(
			(item) => `
		<div class="flex items-center gap-4 rounded-2xl p-4 border border-[rgba(255,255,255,0.08)] transition hover:border-[rgba(255,107,53,0.3)]" style="background: var(--gradient-card);">
			<a href="product.html?catId=${item.categoryId}&id=${item.id}" class="shrink-0">
				<img src="images/thumbnails/${item.img}" alt="${item.name}"
					class="w-20 h-20 rounded-xl object-cover border border-[rgba(255,255,255,0.08)]" />
			</a>
			<div class="flex-1 min-w-0">
				<a href="product.html?catId=${item.categoryId}&id=${item.id}" class="text-[#f0f0f0] font-semibold text-base truncate block no-underline hover:text-[#ff6b35] transition">${item.name}</a>
				<p class="text-[#9a9ab0] text-sm mt-1">฿${item.price} ต่อชิ้น</p>
				<div class="flex items-center gap-3 mt-3">
					<button class="qty-btn w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#ff6b35] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,107,53,0.15)] transition cursor-pointer" style="background: var(--bg-surface);" data-action="dec" data-id="${item.id}" data-cat="${item.categoryId}">−</button>
					<span class="text-[#f0f0f0] font-semibold w-6 text-center">${item.qty}</span>
					<button class="qty-btn w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#ff6b35] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,107,53,0.15)] transition cursor-pointer" style="background: var(--bg-surface);" data-action="inc" data-id="${item.id}" data-cat="${item.categoryId}">+</button>
				</div>
			</div>
			<div class="text-right shrink-0 flex flex-col items-end gap-2">
				<p class="text-[#ffd700] font-bold text-lg">฿${item.price * item.qty}</p>
				<button class="remove-btn text-xs text-red-400 hover:text-red-500 hover:underline transition cursor-pointer" data-id="${item.id}" data-cat="${item.categoryId}">ลบ</button>
			</div>
		</div>`,
		)
		.join("");

	// Summary
	const count = getCartCount();
	const total = getCartTotal();
	summaryCount.textContent = `${count} ชิ้น`;
	summaryTotal.textContent = `฿${total}`;
	cartCountLabel.textContent = `(${count} รายการ)`;
	checkoutBtn.disabled = false;

	// Wire buttons
	cartItemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			const id = Number(btn.dataset.id);
			const cat = Number(btn.dataset.cat);
			const delta = btn.dataset.action === "inc" ? 1 : -1;
			updateQty(id, cat, delta);
			renderCart();
		});
	});

	cartItemsEl.querySelectorAll(".remove-btn").forEach((btn) => {
		btn.addEventListener("click", () => {
			removeFromCart(Number(btn.dataset.id), Number(btn.dataset.cat));
			showToast("ลบสินค้าออกจากตะกร้าแล้ว");
			renderCart();
		});
	});

	updateCartBadge();
}

// Checkout
checkoutBtn.addEventListener("click", () => {
	clearCart();
	renderCart();
	showToast("ชำระเงินสำเร็จ! ขอบคุณที่ซื้อสินค้า 🎉");
});

// Clear cart
clearCartBtn.addEventListener("click", () => {
	if (getCart().length === 0) return;
	clearCart();
	renderCart();
	showToast("ล้างตะกร้าเรียบร้อยแล้ว");
});

// Init
updateCartBadge();
document.getElementById("cart-toast").hidePopover();
renderCart();
