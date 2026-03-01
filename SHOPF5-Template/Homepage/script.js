const products = [
    {
        id:1,
        name:"gaitun",
        priceDisplay:"100฿",
        type:"view",
        type:"add",
        isSale:true,
        
        img:"D:\\lastproject\\SHOPF5-Template\\Homepage\\image\\ไก่ตันราคาถูก.png"

    },
    {
        id:2,
        name:"gaitun",
        priceDisplay:"100฿",
        type:"view",
        type:"add",
        isSale:true,
        
        img:"D:\\lastproject\\SHOPF5-Template\\Homepage\\image\\ไก่ตันราคาถูก (1).png"

    },
    
];

function renderProducts(data = products){
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    data.forEach(p => {
        const sale = p.isSale ? `<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>` : "";
        const button = p.type === "view" ? `<a class="btn btn-outline-dark mt-auto" href="#" onclick="addToCart(${p.id})">Add to cart</a>` : ""; 
        const buttonAdd = p.type === "add" ? `<a class="btn btn-outline-dark mt-auto" href="#" onclick="addToCart(${p.id})">Add to cart</a>` : ""; 
        const cardHTML = 
        `
            <div class="col mb-5">
                <div class="card h-100">
                    ${sale}
                    <img class="card-img-top" src="${p.img}" alt="${p.name}" />
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">${p.name}</h5>
                    
                            ${p.priceDisplay}
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">${button}</div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">${buttonAdd}</div>
                    </div>
                </div>
            </div>
        `;
        productContainer.innerHTML += cardHTML;

  
        
    });

}

function searchProducts(){
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const filtered = products.filter(item => item.name.toLowerCase().includes(keyword));
    

}

renderProducts();