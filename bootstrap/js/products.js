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
        const id = product.productId || product.id || Math.random().toString(36).substring(2, 15);
        
        let price = 'Fiyat bilgisi yok';
        let numericPrice = null;
        
        if (product.salePrice) {
            price = product.salePrice;
            numericPrice = product.salePrice;
        } else if (product.buyPrice) {
            price = product.buyPrice;
            numericPrice = product.buyPrice;
        } else if (product.marketPrice) {
            price = product.marketPrice;
            numericPrice = product.marketPrice;
        }
        
        let formattedPrice = price;
        if (!isNaN(parseFloat(price))) {
            formattedPrice = parseFloat(price).toLocaleString('tr-TR') + ' ₺';
        }
        
        let rating = product.rating !== undefined ? product.rating : (Math.random() * 4 + 1).toFixed(1);
        
        html += `
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 mb-4">
            <div class="product-card bg-white bg-opacity-10 rounded-4 shadow-sm h-100 position-relative" data-product-id="${id}">
                <span class="badge bg-danger">New</span>
                <div class="overflow-hidden">
                    <img src="${image}" class="product-image w-100" alt="${name}" 
                        onerror="this.src='https://picsum.photos/200';">
                </div>
                <div class="p-4">
                    <h5 class="fw-bold text-white mb-3">${name}</h5>
                    <p class="text-white mb-4">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="price fs-5">${formattedPrice}</span>
                        <div>
                            <button class="btn btn-custom-green text-white rounded-pill me-2 add-to-cart-btn" 
                                data-id="${id}" 
                                data-name="${name}" 
                                data-price="${numericPrice}" 
                                data-image="${image}">
                                <i class="fas fa-shopping-cart"></i>
                            </button>
                            <button class="btn btn-custom-orange text-white rounded-pill" onclick="window.open('${url}', '_blank')">
                                <i class="fa-solid fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
    productList.innerHTML = html;
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id: this.getAttribute('data-id'),
                name: this.getAttribute('data-name'),
                price: this.getAttribute('data-price'),
                image: this.getAttribute('data-image')
            };
            addToCart(product);
        });
    });
}
