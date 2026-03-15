import { updateCartBadge, showToast, addToCart } from "./cart.js";

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id") ? Number(params.get("id")) : null;

const grid = document.getElementById("product-grid");
const sectionTitle = document.getElementById("section-title");
const breadcrumbCurrent = document.getElementById("breadcrumb-current");
const categoryHeader = document.getElementById("category-header");
const searchInput = document.getElementById("search-input");

let allProducts = [];

async function init() {
	updateCartBadge();
	document.getElementById("cart-toast").hidePopover();

	const catRes = await fetch("scripts/categories.json");
	const categories = await catRes.json();

	if (categoryId) {
		const category = categories.find((c) => c.id === categoryId);
		if (!category) {
			grid.innerHTML = `<p class="text-[#9a9ab0] text-center col-span-full py-8">ไม่พบหมวดหมู่นี้</p>`;
			return;
		}

		// Show category header
		categoryHeader.classList.remove("hidden");
		document.getElementById("category-img").src = `images/thumbnails/${category.img}`;
		document.getElementById("category-name").textContent = category.name;
		document.getElementById("category-desc").textContent = category.description || "";
		breadcrumbCurrent.textContent = category.name;
		sectionTitle.textContent = `สินค้า ${category.name}`;
		document.title = `${category.name} - KAIYANG SHOP`;

		// Load products for this category
		const prodRes = await fetch(`scripts/products/${categoryId}.json`);
		allProducts = await prodRes.json();
		renderProducts(allProducts);
	} else {
		// No category selected — show all categories as cards
		renderCategoryList(categories);
        searchInput.style.display = "none"; // hide search when showing categories
	}
}

function renderCategoryList(categories) {
	grid.innerHTML = "";
	sectionTitle.textContent = "หมวดหมู่ทั้งหมด";

	categories.forEach((item) => {
		const card = document.createElement("div");
		card.className = "category-card";
		card.innerHTML = `
			<div class="card-img">
				<img src="images/thumbnails/${item.img}" alt="${item.name}" class="product-image" />
			</div>
			<div class="card-content">
				<h3 class="product-title">${item.name}</h3>
				<p class="product-description">${item.description || "บริการจำหน่ายแมพ"}</p>
				<a class="product-button" href="category.html?id=${item.id}">ดูสินค้าทั้งหมด</a>
			</div>`;
		grid.appendChild(card);
	});
}

function renderProducts(products) {
	grid.innerHTML = "";

	if (products.length === 0) {
		grid.innerHTML = `<p class="text-[#9a9ab0] text-center col-span-full py-8">ไม่พบสินค้า</p>`;
		return;
	}

	products.forEach((item) => {
		const card = document.createElement("div");
		card.className = "category-card";
		card.innerHTML = `
			<div class="card-img">
				<img src="images/thumbnails/${item.img}" alt="${item.name}" class="product-image" />
			</div>
			<div class="card-content">
				<h3 class="product-title">${item.name}</h3>
				<p class="product-description">${item.description}</p>
				<p class="product-price">฿${item.price}</p>
				<div class="flex gap-2 mt-2">
					<a class="product-button flex-1" href="product.html?catId=${categoryId}&id=${item.id}">ดูสินค้า</a>
					<button class="add-cart-btn flex-1 rounded-lg border border-[#ff6b35] text-[#ff6b35] text-sm font-semibold py-2 hover:bg-[rgba(255,107,53,0.12)] transition cursor-pointer">เพิ่มลงตะกร้า</button>
				</div>
			</div>`;

		card.querySelector(".add-cart-btn").addEventListener("click", () => {
			addToCart({ ...item, categoryId });
			showToast(`เพิ่ม "${item.name}" ลงตะกร้าแล้ว!`);
		});

		grid.appendChild(card);
	});
}

// Search
document.getElementById("search-input").addEventListener("input", (e) => {
	const keyword = e.target.value.toLowerCase();
	if (!categoryId) return; // search only works when viewing products
	if (!keyword) {
		renderProducts(allProducts);
		return;
	}
	const filtered = allProducts.filter((p) =>
		p.name.toLowerCase().includes(keyword),
	);
	renderProducts(filtered);
});

init();
