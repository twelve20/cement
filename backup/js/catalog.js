// ==================== ОСНОВНОЕ ПРИЛОЖЕНИЕ ДЛЯ КАТАЛОГА ====================
const CementCatalogApp = {
    init: function () {
        // Инициализация компонентов, нужных на странице каталога
        Cart.init(); // Корзина
        Catalog.init(); // Каталог (бургер-меню)
        Promotions.init(); // Акции
        Search.init(); // Поиск
        ScrollToTop.init(); // Кнопка "наверх"
        TypingEffect.init(); // Эффект печати (если используется в поиске)
        Filter.init(); // Инициализация фильтров каталога
        ProductCard.init(); // Инициализация карточек товаров

        // Привязка общих событий
        this.bindGlobalEvents();
    },

    bindGlobalEvents: function () {
        // Плавная прокрутка для якорных ссылок
        document.addEventListener('click', function (e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
};

// ==================== ФИЛЬТРЫ КАТАЛОГА ====================
const Filter = {
    priceMinInput: null,
    priceMaxInput: null,
    filterButtons: [],
    sortSelect: null,
    paginationContainer: null,
    allProducts: [], // Будем хранить все карточки товаров
    currentPage: 1,
    itemsPerPage: 6, // Количество товаров на странице
    activeFilters: {
        minPrice: null,
        maxPrice: null
    },

    init: function () {
        // Инициализация элементов фильтрации
        this.priceMinInput = document.getElementById('min-price');
        this.priceMaxInput = document.getElementById('max-price');
        this.filterButtons = document.querySelectorAll('.btn-filter');
        this.sortSelect = document.getElementById('sort-select');
        this.paginationContainer = document.querySelector('.pagination');

        // Получаем все карточки товаров
        this.allProducts = Array.from(document.querySelectorAll('.product-card'));

        // Инициализируем отображение
        this.showPage(1);

        this.bindEvents();
    },

    bindEvents: function () {
        // Применение фильтра по цене
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyPriceFilter();
            });
        });

        // Сортировка
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => {
                this.applySorting();
            });
        }
    },

    // Извлекает числовое значение цены из текста
    extractPrice: function (priceText) {
        if (!priceText) return NaN;
        // Удаляем все нецифровые символы, кроме точки и запятой, затем заменяем запятую на точку
        const cleanedText = priceText.replace(/[^\d.,\s]/g, '').replace(',', '.').replace(/\s+/g, '');
        // Берем последнее число (если есть старая цена)
        const numbers = cleanedText.match(/[\d.]+/g);
        if (numbers && numbers.length > 0) {
            return parseFloat(numbers[numbers.length - 1]);
        }
        return NaN;
    },

    getFilteredProducts: function () {
        let minPrice = this.activeFilters.minPrice;
        let maxPrice = this.activeFilters.maxPrice;

        return this.allProducts.filter(card => {
            // Получаем цену из карточки
            const priceElement = card.querySelector('.product-price');
            let productPrice = NaN;

            if (priceElement) {
                // Проверяем, есть ли внутри старая цена, тогда берем новую
                const newPriceElement = priceElement.querySelector('.new-price');
                const priceText = newPriceElement ? newPriceElement.textContent : priceElement.textContent;
                productPrice = this.extractPrice(priceText);
            }

            // Фильтрация по цене
            if (!isNaN(minPrice) && (isNaN(productPrice) || productPrice < minPrice)) {
                return false;
            }
            if (!isNaN(maxPrice) && (isNaN(productPrice) || productPrice > maxPrice)) {
                return false;
            }

            return true;
        });
    },

    applyPriceFilter: function () {
        // Получаем значения из полей ввода
        let minPrice = this.priceMinInput ? parseFloat(this.priceMinInput.value) : NaN;
        let maxPrice = this.priceMaxInput ? parseFloat(this.priceMaxInput.value) : NaN;

        // Сохраняем активные фильтры
        this.activeFilters.minPrice = isNaN(minPrice) ? null : minPrice;
        this.activeFilters.maxPrice = isNaN(maxPrice) ? null : maxPrice;

        // Сбрасываем пагинацию и показываем первую страницу
        this.currentPage = 1;
        this.showPage(1);
    },

    applySorting: function () {
        const sortBy = this.sortSelect ? this.sortSelect.value : 'popular';
        // Получаем отфильтрованные товары
        let filteredProducts = this.getFilteredProducts();

        // Сортируем копию массива, не трогая оригинальный порядок в allProducts
        let sortedProducts = [...filteredProducts];

        sortedProducts.sort((a, b) => {
            // Получаем цены для сравнения
            const getPrice = (card) => {
                const priceElement = card.querySelector('.product-price');
                if (!priceElement) return 0;
                const newPriceElement = priceElement.querySelector('.new-price');
                const priceText = newPriceElement ? newPriceElement.textContent : priceElement.textContent;
                return this.extractPrice(priceText) || 0;
            };

            // Получаем названия для сравнения по имени
            const getName = (card) => {
                const titleElement = card.querySelector('h3');
                return titleElement ? titleElement.textContent.trim() : '';
            };

            switch (sortBy) {
                case 'price-asc':
                    return getPrice(a) - getPrice(b);
                case 'price-desc':
                    return getPrice(b) - getPrice(a);
                case 'name':
                    return getName(a).localeCompare(getName(b));
                case 'popular':
                default:
                    // Для "популярности" сохраняем исходный порядок из allProducts
                    const indexA = this.allProducts.indexOf(a);
                    const indexB = this.allProducts.indexOf(b);
                    return indexA - indexB;
            }
        });

        // Обновляем порядок элементов в DOM
        const container = document.querySelector('.products-grid');
        if (container) {
            // Очищаем контейнер
            container.innerHTML = '';
            // Добавляем отсортированные элементы
            sortedProducts.forEach(card => container.appendChild(card));
        }

        // Сбрасываем пагинацию и показываем первую страницу
        this.currentPage = 1;
        this.updatePaginationUI();
    },

    showPage: function (page) {
        const filteredProducts = this.getFilteredProducts();
        const totalPages = Math.ceil(filteredProducts.length / this.itemsPerPage);

        if (page < 1) page = 1;
        if (page > totalPages && totalPages > 0) page = totalPages;
        if (totalPages === 0) page = 1;

        this.currentPage = page;

        // Скрываем все товары
        this.allProducts.forEach(card => card.style.display = 'none');

        // Показываем товары для текущей страницы
        const startIndex = (page - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = filteredProducts.slice(startIndex, endIndex);

        pageProducts.forEach(card => {
            // Убедимся, что элемент находится в DOM перед показом
            if (card.parentElement) {
                card.style.display = 'flex'; // Используем flex, как в CSS
            }
        });

        // Обновляем UI пагинации
        this.updatePaginationUI(totalPages);
    },

    updatePaginationUI: function (totalPages) {
        if (!this.paginationContainer) return;

        // Очищаем пагинацию
        this.paginationContainer.innerHTML = '';

        if (totalPages <= 1) return; // Не показываем пагинацию, если страница одна

        // Создаем элементы пагинации
        for (let i = 1; i <= totalPages; i++) {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'pagination-link';
            if (i === this.currentPage) {
                link.classList.add('active');
            }
            link.textContent = i;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(i);
            });
            this.paginationContainer.appendChild(link);
        }

        // Добавляем кнопку "Далее" (SVG стрелка)
        if (this.currentPage < totalPages) {
            const nextLink = document.createElement('a');
            nextLink.href = '#';
            nextLink.className = 'pagination-link';
            nextLink.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"></polyline>
            </svg>`;
            nextLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToPage(this.currentPage + 1);
            });
            this.paginationContainer.appendChild(nextLink);
        }
    },

    goToPage: function (page) {
        this.showPage(page);
    }
};

// ==================== КАРТОЧКИ ТОВАРОВ ====================
const ProductCard = {
    init: function () {
        // Привязываем события к карточкам товаров
        this.bindAddToCartEvents();
        this.bindQuickViewEvents();
    },

    bindAddToCartEvents: function () {
        const addToCartButtons = document.querySelectorAll('.btn-add-to-cart-small');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                const productName = productCard ? productCard.querySelector('h3').textContent : 'Товар';
                this.addToCart(productName);
            });
        });
    },

    bindQuickViewEvents: function () {
        const quickViewButtons = document.querySelectorAll('.btn-quick-view');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                const productName = productCard ? productCard.querySelector('h3').textContent : 'Товар';
                this.showQuickView(productName);
            });
        });
    },

    addToCart: function (productName) {
        // Делегируем добавление в корзину основному объекту Cart
        if (typeof Cart !== 'undefined' && Cart.addToCart) {
            Cart.addToCart();
        } else {
            // Если Cart не определен, просто увеличиваем счетчик вручную
            const cartCountElements = document.querySelectorAll('.cart-count');
            let count = 0;
            if (cartCountElements.length > 0) {
                count = parseInt(cartCountElements[0].textContent) || 0;
            }
            count++;
            cartCountElements.forEach(element => {
                element.textContent = count;
                element.style.display = 'flex';
                // Анимация
                element.classList.add('animate');
                setTimeout(() => {
                    element.classList.remove('animate');
                }, 600);
            });
        }
        console.log(`Товар "${productName}" добавлен в корзину`);
        // Можно показать уведомление пользователю, например, с помощью toast
    },

    showQuickView: function (productName) {
        // Логика быстрого просмотра товара
        console.log(`Быстрый просмотр товара: ${productName}`);
        // Для демонстрации просто покажем alert, в реальном проекте это будет модальное окно
        alert(`Быстрый просмотр: ${productName}`);
    }
};

// ==================== КОРЗИНА ====================
// Проверяем, определена ли корзина, если нет - создаем заглушку
if (typeof Cart === 'undefined') {
    var Cart = {
        count: 0,

        init: function () {
            this.updateDisplay();
        },

        addToCart: function () {
            this.count++;
            this.updateDisplay();
            this.animateCart();
            console.log('Товар добавлен в корзину');
        },

        updateDisplay: function () {
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.textContent = this.count;
                element.style.display = this.count > 0 ? 'flex' : 'none';
            });
        },

        animateCart: function () {
            const cartCountElements = document.querySelectorAll('.cart-count');
            cartCountElements.forEach(element => {
                element.classList.add('animate');
                setTimeout(() => {
                    element.classList.remove('animate');
                }, 600);
            });
        }
    };
}

// ==================== КАТАЛОГ ====================
if (typeof Catalog === 'undefined') {
    var Catalog = {
        isOpen: false,

        init: function () {
            const catalogBtn = document.querySelector('.catalog-btn');
            if (catalogBtn) {
                catalogBtn.addEventListener('click', () => this.toggle());
            }
        },

        toggle: function () {
            this.isOpen = !this.isOpen;
            console.log(this.isOpen ? 'Каталог открыт' : 'Каталог закрыт');
            // В реальном проекте здесь будет логика открытия/закрытия меню каталога
        }
    };
}

// ==================== АКЦИИ ====================
if (typeof Promotions === 'undefined') {
    var Promotions = {
        init: function () {
            const promotionsBtn = document.querySelector('.promotions-btn');
            if (promotionsBtn) {
                promotionsBtn.addEventListener('click', () => this.show());
            }
        },

        show: function () {
            console.log('Акции и специальные предложения');
            // В реальном проекте здесь будет логика показа акций
        }
    };
}

// ==================== ПОИСК ====================
if (typeof Search === 'undefined') {
    var Search = {
        searchInput: null,
        searchButton: null,
        typingText: null,

        init: function () {
            this.searchInput = document.getElementById('searchInput');
            this.searchButton = document.getElementById('searchButton');
            this.typingText = document.getElementById('typingText');

            if (this.searchInput && this.searchButton) {
                this.bindEvents();
            }
        },

        bindEvents: function () {
            this.searchButton.addEventListener('click', () => this.handleSearch());
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });

            this.searchInput.addEventListener('focus', () => {
                if (this.typingText) {
                    this.typingText.style.opacity = '0';
                }
            });

            this.searchInput.addEventListener('blur', () => {
                if (!this.searchInput.value && this.typingText) {
                    this.typingText.style.opacity = '0.7';
                }
            });
        },

        handleSearch: function () {
            const query = this.searchInput.value.trim();

            if (query.length > 0) {
                this.performSearch(query);
            } else {
                this.showError('Пожалуйста, введите поисковый запрос');
            }
        },

        performSearch: function (query) {
            console.log('Поиск:', query);
            // В реальном проекте здесь будет логика поиска
            alert(`Поиск по запросу: ${query}`);
        },

        showError: function (message) {
            alert(message);
            if (this.searchInput) this.searchInput.focus();
        }
    };
}

// ==================== ЭФФЕКТ ПЕЧАТИ ====================
if (typeof TypingEffect === 'undefined') {
    var TypingEffect = {
        texts: [
            "Портландцемент М500",
            "Сухие смеси для стяжки",
            "Гидрофобный цемент",
            "Клей для плитки",
            "Штукатурка гипсовая"
        ],
        currentText: '',
        currentTextIndex: 0,
        charIndex: 0,
        isDeleting: false,
        typingElement: null,

        init: function () {
            this.typingElement = document.getElementById('typingText');
            if (this.typingElement) {
                this.start();
            }
        },

        start: function () {
            const currentText = this.texts[this.currentTextIndex];

            if (!this.isDeleting && this.charIndex < currentText.length) {
                this.currentText = currentText.substring(0, this.charIndex + 1);
                this.charIndex++;
                setTimeout(() => this.start(), 100);
            } else if (this.isDeleting && this.charIndex > 0) {
                this.currentText = currentText.substring(0, this.charIndex - 1);
                this.charIndex--;
                setTimeout(() => this.start(), 50);
            } else if (!this.isDeleting && this.charIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.start(), 2000);
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.start(), 500);
            }

            this.updateDisplay();
        },

        updateDisplay: function () {
            if (this.typingElement) {
                this.typingElement.textContent = this.currentText;
            }
        }
    };
}

// ==================== КНОПКА НАВЕРХ ====================
if (typeof ScrollToTop === 'undefined') {
    var ScrollToTop = {
        button: null,

        init: function () {
            this.button = document.getElementById('scrollToTop');
            if (this.button) {
                this.bindEvents();
                this.checkVisibility();
            }
        },

        bindEvents: function () {
            this.button.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('scroll', () => {
                this.checkVisibility();
            });
        },

        checkVisibility: function () {
            if (this.button) {
                this.button.classList.toggle('visible', window.scrollY > 300);
            }
        }
    };
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function () {
    CementCatalogApp.init();
});

// ==================== ОБРАБОТКА ОШИБОК ====================
window.addEventListener('error', function (e) {
    console.error('Application error:', e.error);
});

window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled promise rejection:', e.reason);
});