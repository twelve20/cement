/**
 * CEMENT SITE - Главный JavaScript файл
 * Все модули собраны здесь для надёжной работы
 */

(function() {
    'use strict';

    // ===========================================
    // ГЛАВНОЕ ПРИЛОЖЕНИЕ
    // ===========================================
    const CementApp = {
        init: function() {
            console.log('CementApp: Инициализация...');
            
            // Ждём полной загрузки DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        },

        start: function() {
            // Инициализация всех модулей
            Slider.init();
            Search.init();
            Cart.init();
            TypingEffect.init();
            ScrollToTop.init();
            Promotions.init();
            CatalogDropdown.init();
            QuantitySelector.init();
            
            // Глобальные обработчики
            this.bindGlobalEvents();
            
            console.log('CementApp: Готово!');
        },

        bindGlobalEvents: function() {
            // Плавная прокрутка для якорных ссылок
            document.addEventListener('click', function(e) {
                const link = e.target.closest('a[href^="#"]');
                if (link) {
                    const targetId = link.getAttribute('href').substring(1);
                    if (targetId) {
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            e.preventDefault();
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });
        }
    };

    // ===========================================
    // СЛАЙДЕР
    // ===========================================
    const Slider = {
        currentSlide: 0,
        slides: [],
        dots: [],
        totalSlides: 0,
        interval: null,
        autoPlayDelay: 5000,

        init: function() {
            this.slides = document.querySelectorAll('.slider-item');
            this.dots = document.querySelectorAll('.pagination-dot');
            this.totalSlides = this.slides.length;

            if (this.totalSlides === 0) return;

            this.setupNavigation();
            this.showSlide(0);
            this.startAutoPlay();
            
            console.log('Slider: Инициализировано, слайдов:', this.totalSlides);
        },

        setupNavigation: function() {
            // Кнопки навигации
            const prevBtn = document.querySelector('.prev-side-btn');
            const nextBtn = document.querySelector('.next-side-btn');

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.prevSlide();
                    this.resetAutoPlay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoPlay();
                });
            }

            // Точки пагинации
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.goToSlide(index);
                    this.resetAutoPlay();
                });
            });

            // Пауза при наведении
            const container = document.querySelector('.slider-container');
            if (container) {
                container.addEventListener('mouseenter', () => this.stopAutoPlay());
                container.addEventListener('mouseleave', () => this.startAutoPlay());
            }

            // Свайп на мобильных
            this.setupTouchEvents();
        },

        setupTouchEvents: function() {
            const wrapper = document.querySelector('.slider-wrapper');
            if (!wrapper) return;

            let startX = 0;
            let endX = 0;

            wrapper.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            wrapper.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                const diff = startX - endX;

                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                    this.resetAutoPlay();
                }
            }, { passive: true });
        },

        showSlide: function(index) {
            // Обновляем слайды
            this.slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            // Обновляем точки
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });

            this.currentSlide = index;
        },

        nextSlide: function() {
            const next = (this.currentSlide + 1) % this.totalSlides;
            this.showSlide(next);
        },

        prevSlide: function() {
            const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.showSlide(prev);
        },

        goToSlide: function(index) {
            if (index >= 0 && index < this.totalSlides) {
                this.showSlide(index);
            }
        },

        startAutoPlay: function() {
            if (this.interval) return;
            this.interval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
        },

        stopAutoPlay: function() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },

        resetAutoPlay: function() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    };

    // ===========================================
    // ПОИСК
    // ===========================================
    const Search = {
        input: null,
        button: null,
        typingText: null,

        init: function() {
            this.input = document.getElementById('searchInput');
            this.button = document.getElementById('searchButton');
            this.typingText = document.getElementById('typingText');

            if (!this.input || !this.button) return;

            this.bindEvents();
            console.log('Search: Инициализирован');
        },

        bindEvents: function() {
            // Клик по кнопке поиска
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSearch();
            });

            // Enter в поле ввода
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch();
                }
            });

            // Скрытие placeholder при фокусе
            this.input.addEventListener('focus', () => {
                if (this.typingText) {
                    this.typingText.style.opacity = '0';
                }
            });

            this.input.addEventListener('blur', () => {
                if (!this.input.value && this.typingText) {
                    this.typingText.style.opacity = '0.7';
                }
            });

            // Скрываем typing text при вводе
            this.input.addEventListener('input', () => {
                if (this.typingText) {
                    this.typingText.style.opacity = this.input.value ? '0' : '0.7';
                }
            });
        },

        handleSearch: function() {
            const query = this.input.value.trim();

            if (query.length > 0) {
                // Переход на страницу результатов
                window.location.href = 'pages/search-results.html?q=' + encodeURIComponent(query);
            } else {
                this.input.focus();
                this.input.classList.add('shake');
                setTimeout(() => this.input.classList.remove('shake'), 500);
            }
        }
    };

    // ===========================================
    // КОРЗИНА
    // ===========================================
    const Cart = {
        count: 0,
        storageKey: 'cement_cart_count',

        init: function() {
            // Загружаем из localStorage
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                this.count = parseInt(saved, 10) || 0;
            }

            this.updateDisplay();
            this.bindEvents();
            console.log('Cart: Инициализирована, товаров:', this.count);
        },

        bindEvents: function() {
            // Делегирование событий для кнопок "В корзину"
            document.addEventListener('click', (e) => {
                const addBtn = e.target.closest('.btn-add-to-cart, .btn-add-to-cart-small');
                if (addBtn) {
                    e.preventDefault();
                    this.addItem();
                }
            });
        },

        addItem: function(qty = 1) {
            this.count += qty;
            this.save();
            this.updateDisplay();
            this.animateCart();
            this.showNotification('Товар добавлен в корзину');
        },

        save: function() {
            localStorage.setItem(this.storageKey, this.count.toString());
        },

        updateDisplay: function() {
            const cartCounts = document.querySelectorAll('.cart-count');
            cartCounts.forEach(el => {
                el.textContent = this.count;
                el.style.display = this.count > 0 ? 'flex' : 'none';
            });
        },

        animateCart: function() {
            const cartCounts = document.querySelectorAll('.cart-count');
            cartCounts.forEach(el => {
                el.classList.add('animate');
                setTimeout(() => el.classList.remove('animate'), 500);
            });
        },

        showNotification: function(message) {
            // Создаём уведомление
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    };

    // ===========================================
    // ЭФФЕКТ ПЕЧАТИ
    // ===========================================
    const TypingEffect = {
        texts: [
            "Портландцемент М500",
            "Сухие смеси для стяжки",
            "Гидрофобный цемент",
            "Клей для плитки",
            "Штукатурка гипсовая"
        ],
        element: null,
        currentIndex: 0,
        charIndex: 0,
        isDeleting: false,
        isPaused: false,

        init: function() {
            this.element = document.getElementById('typingText');
            if (!this.element) return;

            // Не запускаем, если есть фокус на поиске
            const searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement === searchInput) return;

            this.type();
            console.log('TypingEffect: Запущен');
        },

        type: function() {
            if (this.isPaused) return;

            const currentText = this.texts[this.currentIndex];
            
            if (this.isDeleting) {
                this.charIndex--;
            } else {
                this.charIndex++;
            }

            this.element.textContent = currentText.substring(0, this.charIndex);

            let delay = this.isDeleting ? 50 : 100;

            if (!this.isDeleting && this.charIndex === currentText.length) {
                delay = 2000;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.currentIndex = (this.currentIndex + 1) % this.texts.length;
                delay = 500;
            }

            setTimeout(() => this.type(), delay);
        },

        pause: function() {
            this.isPaused = true;
        },

        resume: function() {
            if (this.isPaused) {
                this.isPaused = false;
                this.type();
            }
        }
    };

    // ===========================================
    // КНОПКА НАВЕРХ
    // ===========================================
    const ScrollToTop = {
        button: null,
        threshold: 300,

        init: function() {
            this.button = document.getElementById('scrollToTop');
            if (!this.button) return;

            this.bindEvents();
            this.checkVisibility();
            console.log('ScrollToTop: Инициализирован');
        },

        bindEvents: function() {
            // Клик по кнопке
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Отслеживание скролла (с throttle)
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.checkVisibility();
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },

        checkVisibility: function() {
            if (window.scrollY > this.threshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }
    };

    // ===========================================
    // АКЦИИ
    // ===========================================
    const Promotions = {
        init: function() {
            const btn = document.querySelector('.promotions-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Прокрутка к секции акций
                    const section = document.querySelector('.promotions-section');
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                });
                console.log('Promotions: Кнопка инициализирована');
            }
        }
    };

    // ===========================================
    // КАТАЛОГ (Dropdown)
    // ===========================================
    const CatalogDropdown = {
        btn: null,
        menu: null,
        isOpen: false,

        init: function() {
            this.btn = document.querySelector('.catalog-btn');
            this.menu = document.querySelector('.categories-section.mini-catalog');

            if (!this.btn) return;

            this.btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Переход на страницу каталога
                window.location.href = 'pages/catalog.html';
            });

            console.log('CatalogDropdown: Инициализирован');
        },

        toggle: function() {
            this.isOpen = !this.isOpen;
            if (this.menu) {
                this.menu.classList.toggle('active', this.isOpen);
            }
        },

        close: function() {
            this.isOpen = false;
            if (this.menu) {
                this.menu.classList.remove('active');
            }
        }
    };

    // ===========================================
    // СЕЛЕКТОР КОЛИЧЕСТВА
    // ===========================================
    const QuantitySelector = {
        init: function() {
            document.addEventListener('click', (e) => {
                // Кнопка минус
                if (e.target.closest('.qty-btn.minus')) {
                    e.preventDefault();
                    const input = e.target.closest('.quantity-selector').querySelector('.qty-input');
                    if (input) {
                        const min = parseInt(input.min) || 1;
                        const current = parseInt(input.value) || 1;
                        if (current > min) {
                            input.value = current - 1;
                        }
                    }
                }

                // Кнопка плюс
                if (e.target.closest('.qty-btn.plus')) {
                    e.preventDefault();
                    const input = e.target.closest('.quantity-selector').querySelector('.qty-input');
                    if (input) {
                        const max = parseInt(input.max) || 9999;
                        const current = parseInt(input.value) || 1;
                        if (current < max) {
                            input.value = current + 1;
                        }
                    }
                }
            });

            console.log('QuantitySelector: Инициализирован');
        }
    };

    // ===========================================
    // CSS АНИМАЦИИ (добавляем динамически)
    // ===========================================
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }

        .shake {
            animation: shake 0.3s ease;
        }
    `;
    document.head.appendChild(styles);

    // ===========================================
    // ОБРАБОТКА ОШИБОК
    // ===========================================
    window.addEventListener('error', function(e) {
        console.error('JS Error:', e.message);
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promise Error:', e.reason);
    });

    // ===========================================
    // ЗАПУСК
    // ===========================================
    CementApp.init();

})();
