import { initCartDialog, updateCartBadge } from "./cart.js";

// ===================== DOM refs =====================
const productContainer = document.getElementById("product-grid");

// ===================== Load & Render Categories =====================
let categories = [];

async function loadCategories() {
	const res = await fetch("scripts/categories.json");
	categories = await res.json();
	renderCategories(categories);
}

function renderCategories(data) {
	productContainer.innerHTML = "";

	if (!data || data.length === 0) {
		productContainer.innerHTML = `<p class="text-[#9a9ab0] text-center col-span-full py-8">ไม่พบหมวดหมู่</p>`;
		return;
	}

	data.forEach((item) => {
		const card = document.createElement("div");
		card.className = "category-card";
		card.innerHTML = `
			<div class="card-img">
				<img src="images/thumbnails/${item.img}" alt="${item.name}" class="product-image" />
			</div>
			<div class="card-content">
				<h3 class="product-title">${item.name}</h3>
				<p class="product-description">${item.description || "บริการจำหน่ายแมพ"}</p>
				<a class="product-button" href="category.html?id=${item.id}">
					ดูสินค้าทั้งหมด
				</a>
			</div>`;
		productContainer.appendChild(card);
	});
}

// ===================== Search =====================
function searchCategories() {
	const keyword = document.getElementById("search-input").value.toLowerCase();
	if (!keyword) {
		renderCategories(categories);
		return;
	}
	const filtered = categories.filter((item) =>
		item.name.toLowerCase().includes(keyword),
	);
	renderCategories(filtered);
}

document
	.getElementById("search-input")
	.addEventListener("input", searchCategories);

// ===================== Init =====================
initCartDialog();
loadCategories();
document.getElementById("cart-toast").hidePopover();