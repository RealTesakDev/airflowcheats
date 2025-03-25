// Product Loader for Sell.app Integration
(function() {
    // IMPORTANT: Replace these with your actual Sell.app credentials
    const STORE_ID = '136111';
    const API_KEY = '4986520|GSRAR3KgiYHKZXvyIOs4BSsYGAOWpT5OGF1ddF4Hce651e03';

    // Function to create product card HTML
    function createProductCard(product) {
        return `
        <div class="col-lg-3 col-md-6 col-12" style="padding: 0.5%;">
            <div class="single-table wow fadeInUp">
                <div class="table-head">
                    <h4 class="title">${product.name} <span style="font-size: 60%;">${product.description}</span></h4>
                    <p>${product.short_description || 'Great for trying out Airflow or if you\'re on a budget.'}</p>
                    <div class="price">
                        <h2 class="amount">$${product.price}<span class="duration">/${product.duration || 'mo'}</span></h2>
                    </div>
                    <div class="button">
                        <button class="btn" 
                            data-sell-store="${STORE_ID}" 
                            data-sell-product="${product.id}" 
                            data-sell-theme="" 
                            data-sell-darkmode="true">
                            Buy now!
                        </button>
                    </div>
                </div>
                <div class="table-content">
                    <h4 class="middle-title">What's Included</h4>
                    <ul class="table-list">
                        ${product.features.map(feature => `
                            <li><i class="lni lni-checkmark-circle"></i> ${feature}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
        `;
    }

    // Function to fetch products from Sell.app
    async function fetchProducts() {
        try {
            const response = await fetch(`https://sell.app/api/v1/stores/${STORE_ID}/products`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();
            
            // Prepare product container
            const productContainer = document.getElementById('productContainer');
            const productLoaderContainer = document.getElementById('productLoader');
            
            // Clear loader
            productLoaderContainer.innerHTML = '';

            // Render products
            const productsHTML = data.products.map(product => createProductCard({
                id: product.id,
                name: product.name,
                price: product.variants[0].price,
                description: product.variants[0].name,
                duration: product.variants[0].duration || 'mo',
                features: [
                    'Premium Support',
                    'Frequent Updates', 
                    'Advanced Internal',
                    'Undetected'
                ]
            })).join('');

            // Add products to container
            productContainer.innerHTML += productsHTML;

            // Reinitialize Sell.app buttons
            if (window.SellApp) {
                window.SellApp.init();
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            const productContainer = document.getElementById('productContainer');
            productContainer.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load products. Please try again later.
                </div>
            `;
        }
    }

    // Fetch products when page loads
    document.addEventListener('DOMContentLoaded', fetchProducts);
})();
