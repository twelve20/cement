// ==================== ОСНОВНОЕ ПРИЛОЖЕНИЕ ====================
const CementApp = {
    init: function() {
        // Инициализация всех компонентов
        Slider.init();
        Search.init();
        Cart.init();
        Catalog.init();
        Promotions.init();
        TypingEffect.init();
        ScrollToTop.init();
        
        // Привязка общих событий
        this.bindGlobalEvents();
    },
    
    bindGlobalEvents: function() {
        // Плавная прокрутка для якорных ссылок
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
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

// Слайдер с кнопками по бокам
const Slider = {
    currentSlide: 0,
    slides: [],
    dots: [],
    progressElement: null,
    totalSlides: 0,
    interval: null,
    prevBtn: null,
    nextBtn: null,
    
    init: function() {
        this.slides = document.querySelectorAll('.slider-item');
        this.dots = document.querySelectorAll('.pagination-dot');
        this.progressElement = document.querySelector('.pagination-progress');
        this.totalSlides = this.slides.length;
        this.prevBtn = document.querySelector('.prev-side-btn');
        this.nextBtn = document.querySelector('.next-side-btn');
        
        if (this.slides.length > 0) {
            this.setupNavigation();
            this.updatePagination();
            this.startAutoPlay();
        }
    },
    
    setupNavigation: function() {
        // Кнопки по бокам
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Точки пагинации
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    },
    
    nextSlide: function() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.updatePagination();
    },
    
    prevSlide: function() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
        this.updatePagination();
    },
    
    goToSlide: function(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.updatePagination();
    },
    
    updateSlider: function() {
        // Обновление слайдов
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[this.currentSlide].classList.add('active');
    },
    
    updatePagination: function() {
        // Обновление точек
        this.dots.forEach(dot => dot.classList.remove('active'));
        this.dots[this.currentSlide].classList.add('active');
        
        // Обновление прогресс-бара
        if (this.progressElement) {
            const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
            this.progressElement.style.width = `${progress}%`;
        }
    },
    
    startAutoPlay: function() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }
};

// ==================== ПОИСК ====================
const Search = {
    searchInput: null,
    searchButton: null,
    typingText: null,
    
    init: function() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.typingText = document.getElementById('typingText');
        
        if (this.searchInput && this.searchButton) {
            this.bindEvents();
        }
    },
    
    bindEvents: function() {
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
    
    handleSearch: function() {
        const query = this.searchInput.value.trim();
        
        if (query.length > 0) {
            this.performSearch(query);
        } else {
            this.showError('Пожалуйста, введите поисковый запрос');
        }
    },
    
    performSearch: function(query) {
        console.log('Поиск:', query);
        
        // Имитация результатов
        const results = this.getMockResults(query);
        this.showResults(results, query);
    },
    
    getMockResults: function(query) {
        const mockData = [
            'Портландцемент М500',
            'Сухая смесь для стяжки',
            'Гидрофобный цемент',
            'Клей для плитки',
            'Штукатурка гипсовая',
            'Пескобетон М300',
            'Цемент белый М400',
            'Самовыравнивающаяся смесь'
        ];
        
        return mockData.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        );
    },
    
    showResults: function(results, query) {
        if (results.length > 0) {
            alert(`Найдено ${results.length} результатов по запросу "${query}"`);
        } else {
            alert(`По запросу "${query}" ничего не найдено`);
        }
    },
    
    showError: function(message) {
        alert(message);
        if (this.searchInput) this.searchInput.focus();
    }
};

// ==================== КОРЗИНА ====================
// Обновите функцию Cart в вашем JS файле:
const Cart = {
    count: 0,
    
    init: function() {
        this.updateDisplay();
        this.bindEvents();
    },
    
    bindEvents: function() {
        const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
        const buyButtons = document.querySelectorAll('.btn-buy');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.addToCart();
            });
        });
        
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.buyNow();
            });
        });
    },
    
    addToCart: function() {
        this.count++;
        this.updateDisplay();
        this.animateCart();
        this.showNotification('Товар добавлен в корзину');
    },
    
    buyNow: function() {
        this.showNotification('Оформление заказа');
    },
    
    updateDisplay: function() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = this.count;
            element.style.display = this.count > 0 ? 'flex' : 'none';
        });
    },
    
    animateCart: function() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.classList.add('animate');
            setTimeout(() => {
                element.classList.remove('animate');
            }, 600);
        });
    },
    
    showNotification: function(message) {
        console.log(message);
    }
};

// ==================== КАТАЛОГ ====================
const Catalog = {
    isOpen: false,
    
    init: function() {
        const catalogBtn = document.querySelector('.catalog-btn');
        if (catalogBtn) {
            catalogBtn.addEventListener('click', () => this.toggle());
        }
    },
    
    toggle: function() {
        this.isOpen = !this.isOpen;
        alert(this.isOpen ? 'Каталог открыт' : 'Каталог закрыт');
    }
};

// ==================== АКЦИИ ====================
const Promotions = {
    init: function() {
        const promotionsBtn = document.querySelector('.promotions-btn');
        if (promotionsBtn) {
            promotionsBtn.addEventListener('click', () => this.show());
        }
    },
    
    show: function() {
        alert('Акции и специальные предложения');
    }
};

// ==================== ЭФФЕКТ ПЕЧАТИ ====================
const TypingEffect = {
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
    
    init: function() {
        this.typingElement = document.getElementById('typingText');
        if (this.typingElement) {
            this.start();
        }
    },
    
    start: function() {
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
    
    updateDisplay: function() {
        if (this.typingElement) {
            this.typingElement.textContent = this.currentText;
        }
    }
};

// ==================== КНОПКА НАВЕРХ ====================
const ScrollToTop = {
    button: null,
    
    init: function() {
        this.button = document.getElementById('scrollToTop');
        if (this.button) {
            this.bindEvents();
            this.checkVisibility();
        }
    },
    
    bindEvents: function() {
        this.button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            this.checkVisibility();
        });
    },
    
    checkVisibility: function() {
        if (this.button) {
            this.button.classList.toggle('visible', window.scrollY > 300);
        }
    }
};

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    CementApp.init();
});

// ==================== ОБРАБОТКА ОШИБОК ====================
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Динамическая компенсация высоты шапки
const HeaderManager = {
    init: function() {
        this.updateBodyPadding();
        this.bindEvents();
    },
    
    updateBodyPadding: function() {
        const miniHeader = document.querySelector('.mini-header');
        const mainHeader = document.querySelector('.main-header');
        
        if (miniHeader && mainHeader) {
            const miniHeight = miniHeader.offsetHeight;
            const mainHeight = mainHeader.offsetHeight;
            const totalHeight = miniHeight + mainHeight;
            
            document.body.style.paddingTop = totalHeight + 'px';
        }
    },
    
    bindEvents: function() {
        // Обновление при изменении размера окна
        window.addEventListener('resize', () => {
            setTimeout(() => this.updateBodyPadding(), 100);
        });
        
        // Обновление после загрузки всех изображений
        window.addEventListener('load', () => {
            this.updateBodyPadding();
        });
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    HeaderManager.init();
    
    // Также инициализируем через небольшую задержку
    setTimeout(() => HeaderManager.init(), 500);
});