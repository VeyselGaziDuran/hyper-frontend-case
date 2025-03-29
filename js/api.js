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