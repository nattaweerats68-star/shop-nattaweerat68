import { updateCartBadge, addToCart, showToast } from "./cart.js";

const params = new URLSearchParams(window.location.search);
const categoryId = Number(params.get("catId"));
const productId = Number(params.get("id"));

const detailEl = document.getElementById("product-detail");
const loadingEl = document.getElementById("product-loading");
const errorEl = document.getElementById("product-error");

async function init() {
	updateCartBadge();
	document.getElementById("cart-toast").hidePopover();

	if (!categoryId || !productId) {
		showError();
		return;
	}

	try {
		// Fetch category info for breadcrumb
		const catRes = await fetch("scripts/categories.json");
		const categories = await catRes.json();
		const category = categories.find((c) => c.id === categoryId);

		if (category) {
			const breadcrumbCat = document.getElementById("breadcrumb-cat");
			breadcrumbCat.textContent = category.name;
			breadcrumbCat.href = `category.html?id=${categoryId}`;
		}

		// Fetch product data
		const prodRes = await fetch(`scripts/products/${categoryId}.json`);
		if (!prodRes.ok) {
			showError();
			return;
		}

		const products = await prodRes.json();
		const product = products.find((p) => p.id === productId);

		if (!product) {
			showError();
			return;
		}

		// Populate the detail view
		document.getElementById("product-img").src = `images/thumbnails/${product.img}`;
		document.getElementById("product-img").alt = product.name;
		document.getElementById("product-name").textContent = product.name;
		document.getElementById("product-desc").textContent = product.description;
		document.getElementById("product-price").textContent = `฿${product.price}`;
		document.getElementById("product-stock").textContent = product.stock;
		document.getElementById("product-sold").textContent = product.sold;
		document.getElementById("breadcrumb-current").textContent = product.name;
		document.title = `${product.name} - BAMBOO SHOP`;

		// Show detail, hide loading
		loadingEl.classList.add("hidden");
		detailEl.classList.remove("hidden");

		// Add to cart button
		document.getElementById("add-to-cart-btn").addEventListener("click", () => {
			addToCart({ ...product, categoryId });
			showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว!`);
		});
	} catch {
		showError();
	}
}

function showError() {
	loadingEl.classList.add("hidden");
	detailEl.classList.add("hidden");
	errorEl.classList.remove("hidden");
}

// Initially hide detail, show loading
detailEl.classList.add("hidden");

init();
