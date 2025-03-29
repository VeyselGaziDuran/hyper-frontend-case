const API_URL = "https://api.hyperteknoloji.com.tr/products/list"; 
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1NDE1MzQ0MSwiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9._bWpxRgVYWVjZ8qUnjoEUPuROdAHEOeRNAte_7bKouo";

async function fetchProducts() {
    const productList = document.getElementById('product-list');
    
    if (!productList) {
        console.error("Could not find element with ID 'product-list'");
        return;
    }
    
    productList.innerHTML = '<div class="col-12 text-center"><p>Yükleniyor...</p></div>';
    
    try {
        console.log("Fetching products from API...");
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({})
        });
        
        console.log("API response status:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log("Response received, length:", responseText.length);
        
        if (responseText.trim() !== "") {
            try {
                const data = JSON.parse(responseText);
                console.log("API data:", data);
                renderProducts(data);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                throw new Error(`Failed to parse API response: ${parseError.message}`);
            }
        } else {
            throw new Error("Empty response received from API");
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById('product-list').innerHTML = 
            `<div class="col-12 text-center p-5"><h3>Ürünler yüklenirken bir hata oluştu</h3>
            <p>Hata detayı: ${error.message}</p></div>`;
    }
}

function renderProducts(apiResponse) {
    const productList = document.getElementById('product-list');
    const products = apiResponse.data;
    
    if (!products || products.length === 0) {
        productList.innerHTML = '<div class="col-12 text-center"><p>Ürün bulunamadı</p></div>';
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        const name = product.productName || 'Ürün Adı';
        
        let productData = product.productData || {};
        if (typeof productData === 'string') {
            try {
                productData = JSON.parse(productData);
            } catch (e) {
                productData = {};
            }
        }
        
        const image = productData.productMainImage || 'https://via.placeholder.com/300x200?text=No+Image';
        const description = productData.productDescription || productData.productInfo || 'Ürün açıklaması bulunamadı';
        const url = product.productSlug || '#';
        
        let price = 'Fiyat bilgisi yok';
        if (product.salePrice) {
            price = product.salePrice;
        } else if (product.buyPrice) {
            price = product.buyPrice;
        } else if (product.marketPrice) {
            price = product.marketPrice;
        }
        
        if (!isNaN(parseFloat(price))) {
            price = parseFloat(price).toLocaleString('tr-TR') + ' ₺';
        }
        
        let rating;
        if (product.rating !== undefined) {
            rating = product.rating;
        } else if (productData && productData.rating !== undefined) {
            rating = productData.rating;
        } else {
            rating = (Math.random() * 4 + 1).toFixed(1);
        }
        
        rating = parseFloat(rating);
        
        html += `
        <div class="col-12 col-sm-6 col-md-4">
            <div class="product-card bg-white bg-opacity-10 rounded-4 shadow-sm h-100 position-relative">
                <span class="badge bg-danger">New</span>
                <div class="overflow-hidden">
                    <img src="${image}" class="product-image w-100" alt="${name}" 
                        onerror="this.src='https://picsum.photos/200';">
                </div>
                <div class="p-4">
                    <h5 class="fw-bold text-white mb-3">${name}</h5>
                    <div class="d-flex align-items-center mb-3">
                        <div class="me-2">
                            ${generateRatingStars(rating)}
                        </div>
                        <small class="text-light">(${rating}/5)</small>
                    </div>
                    <p class="text-white mb-4">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="price fs-5">${price}</span>
                        <div class="d-flex flex-row gap-1">
                            <button class="btn btn-custom-green text-white rounded-pill" onclick="addToCart('${product.productID}')">
                                <i class="fa-solid fa-basket-shopping"></i>
                            </button>
                            <button class="btn btn-custom-orange text-white rounded-pill" onclick="window.location.href='${url}'">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
    productList.innerHTML = html;
}

function generateRatingStars(rating) {
    const ratingNum = parseFloat(rating) || 0;
    const validRating = Math.max(0, Math.min(5, ratingNum));
    
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(validRating)) {
            starsHTML += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= validRating) {
            starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            starsHTML += '<i class="far fa-star text-warning"></i>';
        }
    }
    
    return starsHTML;
}

function addToCart(productId) {
    alert(`${productId} ID'li ürün sepete eklendi`);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing...");
    fetchProducts();
});