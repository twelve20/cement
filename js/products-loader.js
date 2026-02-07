/**
 * ARCHIN Products Loader
 * Загружает товары из products.json и рендерит их на страницы
 */

const ProductsLoader = {
    products: [],
    categories: new Set(),

    async init() {
        try {
            const response = await fetch('products.json');
            this.products = await response.json();
            this.extractCategories();
            console.log(`✓ Загружено ${this.products.length} товаров`);
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
        // Выбираем по одному товару из разных категорий для разнообразия
        const selected = [];
        const usedCategories = new Set();
        
        for (const product of this.products) {
            if (!usedCategories.has(product.category) && selected.length < count) {
                selected.push(product);
                usedCategories.add(product.category);
            }
        }
        
        // Если категорий меньше чем нужно товаров, добавляем ещё
        if (selected.length < count) {
            for (const product of this.products) {
                if (!selected.includes(product) && selected.length < count) {
                    selected.push(product);
                }
            }
        }
        
        return selected;
    },

    getCategoryIcon(category) {
        const icons = {
            'Штукатурки': '🏗️',
            'Шпатлевки': '🎨',
            'Декоративные шпатлевки': '✨',
            'Краски': '🖌️',
            'Грунты': '🧪',
            'Плиточные клеи': '🧱',
            'Гидроизоляция': '💧'
        };
        return icons[category] || '📦';
    },

    formatPrice(price) {
        return parseFloat(price).toLocaleString('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    },

    renderCard(product) {
        const price = this.formatPrice(product.price);
        const icon = this.getCategoryIcon(product.category);
        
        return `
            <article class="product-card" data-article="${product.article}">
                <div class="product-image">
                    ${icon}
                </div>
                <div class="product-body">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-footer">
                        <div class="product-price">${price} <span>₽</span></div>
                        <a href="mailto:olnast.ru@yandex.ru?subject=Заявка: ${encodeURIComponent(product.name)}&body=Товар: ${encodeURIComponent(product.name)}%0AЦена: ${price} ₽%0AАртикул: ${product.article}%0A%0AУкажите количество и контактные данные:" 
                           class="btn btn-primary btn-sm">
                            Заказать
                        </a>
                    </div>
                </div>
            </article>
        `;
    },

    renderFullCard(product) {
        const price = this.formatPrice(product.price);
        const icon = this.getCategoryIcon(product.category);
        
        // Убираем HTML теги из описания
        const cleanDescription = product.description
            .replace(/&nbsp;/g, ' ')
            .replace(/<[^>]*>/g, '')
            .trim();
        
        return `
            <article class="product-card product-card-full" data-article="${product.article}">
                <div class="product-image">
                    ${icon}
                </div>
                <div class="product-body">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-desc">${cleanDescription}</p>
                    <div class="product-footer">
                        <div class="product-price">${price} <span>₽</span></div>
                        <a href="mailto:olnast.ru@yandex.ru?subject=Заявка: ${encodeURIComponent(product.name)}&body=Товар: ${encodeURIComponent(product.name)}%0AЦена: ${price} ₽%0AАртикул: ${product.article}%0A%0AУкажите количество и контактные данные:" 
                           class="btn btn-primary">
                            Оставить заявку
                        </a>
                    </div>
                </div>
            </article>
        `;
    },

    renderGrid(products, container, fullCards = false) {
        if (!container) return;
        
        const html = products.map(p => 
            fullCards ? this.renderFullCard(p) : this.renderCard(p)
        ).join('');
        
        container.innerHTML = html;
    },

    renderCatalog(fullCards = true) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        this.renderGrid(this.products, grid, fullCards);
    },

    renderPopular() {
        const grid = document.getElementById('popular-products');
        if (!grid) return;

        const popular = this.getPopular(6);
        this.renderGrid(popular, grid, false);
    },

    filterByCategory(category) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const filtered = this.getByCategory(category);
        this.renderGrid(filtered, grid, true);
        
        // Обновляем активный фильтр
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
    },

    renderCategoryFilters(containerId = 'category-filters') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const categories = ['all', ...Array.from(this.categories)];
        const labels = {
            'all': 'Все товары',
            'Штукатурки': 'Штукатурки',
            'Шпатлевки': 'Шпатлевки',
            'Декоративные шпатлевки': 'Декоративные',
            'Краски': 'Краски',
            'Грунты': 'Грунты',
            'Плиточные клеи': 'Клеи',
            'Гидроизоляция': 'Гидроизоляция'
        };

        container.innerHTML = categories.map(cat => `
            <button 
                class="filter-btn ${cat === 'all' ? 'active' : ''}" 
                data-category="${cat}"
                onclick="ProductsLoader.filterByCategory('${cat}')"
            >
                ${labels[cat] || cat}
            </button>
        `).join('');
    }
};

// Автозапуск при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProductsLoader.init().then(() => {
            ProductsLoader.renderCatalog();
            ProductsLoader.renderPopular();
            ProductsLoader.renderCategoryFilters();
        });
    });
} else {
    ProductsLoader.init().then(() => {
        ProductsLoader.renderCatalog();
        ProductsLoader.renderPopular();
        ProductsLoader.renderCategoryFilters();
    });
}
