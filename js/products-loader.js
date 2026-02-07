// ЗАГРУЗЧИК ТОВАРОВ ИЗ products.json

const ProductsLoader = {
    products: [],
    categories: new Set(),

    async init() {
        try {
            const response = await fetch('products.json');
            this.products = await response.json();
            this.extractCategories();
            console.log(`Загружено ${this.products.length} товаров`);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    },

    extractCategories() {
        this.products.forEach(p => this.categories.add(p.category));
    },

    getByCategory(category) {
        if (!category || category === 'all') return this.products;
        return this.products.filter(p => p.category === category);
    },

    getPopular(count = 6) {
        // Возвращаем первые N товаров (можно по цене, рейтингу)
        return this.products.slice(0, count);
    },

    renderCard(product, minimal = false) {
        const price = parseFloat(product.price).toLocaleString('ru-RU');
        
        if (minimal) {
            return `
                <div class="product-card-minimal" data-article="${product.article}">
                    <div class="product-image">
                        <img src="https://via.placeholder.com/300x300/4CAF50/ffffff?text=${encodeURIComponent(product.name.split(' ')[0])}" 
                             alt="${product.name}" 
                             loading="lazy">
                    </div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${price} ₽</p>
                    <a href="mailto:olnast.ru@yandex.ru?subject=Заявка на ${encodeURIComponent(product.name)}" 
                       class="btn-primary btn-sm">
                        Оставить заявку
                    </a>
                </div>
            `;
        }

        return `
            <div class="product-card" data-article="${product.article}">
                <div class="product-image">
                    <img src="https://via.placeholder.com/400x400/4CAF50/ffffff?text=${encodeURIComponent(product.name.split(' ')[0])}" 
                         alt="${product.name}"
                         loading="lazy">
                    <div class="product-badge">${product.category}</div>
                </div>
                <div class="product-content">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">${price} ₽</span>
                        <a href="mailto:olnast.ru@yandex.ru?subject=Заявка на ${encodeURIComponent(product.name)}&body=Товар: ${encodeURIComponent(product.name)}%0AЦена: ${price} ₽%0AАртикул: ${product.article}%0A%0AУкажите количество и контактные данные:" 
                           class="btn-primary">
                            Заявка
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    renderGrid(products, container, minimal = false) {
        if (!container) return;
        
        const html = products.map(p => this.renderCard(p, minimal)).join('');
        container.innerHTML = html;
    },

    renderCatalog() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        this.renderGrid(this.products, grid, false);
    },

    renderPopular() {
        const grid = document.getElementById('popular-products');
        if (!grid) return;

        const popular = this.getPopular(6);
        this.renderGrid(popular, grid, true);
    },

    filterByCategory(category) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const filtered = this.getByCategory(category);
        this.renderGrid(filtered, grid, false);
    }
};

// Автозапуск при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProductsLoader.init().then(() => {
            ProductsLoader.renderCatalog();
            ProductsLoader.renderPopular();
        });
    });
} else {
    ProductsLoader.init().then(() => {
        ProductsLoader.renderCatalog();
        ProductsLoader.renderPopular();
    });
}
