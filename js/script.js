/**
 * 🎨 ARCHIN CEMENT - Premium JavaScript
 * Современные интерактивные эффекты
 */

(function() {
    'use strict';

    // ===========================================
    // 🚀 ГЛАВНОЕ ПРИЛОЖЕНИЕ
    // ===========================================
    const App = {
        init() {
            console.log('🚀 ARCHIN Premium: Инициализация...');
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        },

        start() {
            // Модули
            Slider.init();
            Search.init();
            Cart.init();
            TypingEffect.init();
            ScrollToTop.init();
            HeaderScroll.init();
            ScrollAnimations.init();
            QuantitySelector.init();
            CatalogButton.init();
            PromotionsButton.init();
            
            // Глобальные события
            this.bindGlobalEvents();
            
            console.log('✅ ARCHIN Premium: Готово!');
        },

        bindGlobalEvents() {
            // Плавный скролл для якорей
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (link) {
                    const targetId = link.getAttribute('href').substring(1);
                    if (targetId) {
                        const target = document.getElementById(targetId);
                        if (target) {
                            e.preventDefault();
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
            });

            // Предотвращение FOUC
            document.body.classList.add('loaded');
        }
    };

    // ===========================================
    // 🎠 ПРЕМИУМ СЛАЙДЕР
    // ===========================================
    const Slider = {
        current: 0,
        slides: [],
        dots: [],
        total: 0,
        interval: null,
        delay: 5000,

        init() {
            this.slides = document.querySelectorAll('.slider-item');
            this.dots = document.querySelectorAll('.pagination-dot');
            this.total = this.slides.length;

            if (!this.total) return;

            this.setupNavigation();
            this.showSlide(0);
            this.startAutoPlay();
            
            console.log('🎠 Slider: готов');
        },

        setupNavigation() {
            // Кнопки
            const prev = document.querySelector('.prev-side-btn');
            const next = document.querySelector('.next-side-btn');

            if (prev) prev.addEventListener('click', (e) => {
                e.preventDefault();
                this.prev();
                this.resetAutoPlay();
            });

            if (next) next.addEventListener('click', (e) => {
                e.preventDefault();
                this.next();
                this.resetAutoPlay();
            });

            // Точки
            this.dots.forEach((dot, i) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.goTo(i);
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
            this.setupSwipe();
        },

        setupSwipe() {
            const wrapper = document.querySelector('.slider-wrapper');
            if (!wrapper) return;

            let startX = 0;

            wrapper.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            wrapper.addEventListener('touchend', (e) => {
                const diff = startX - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? this.next() : this.prev();
                    this.resetAutoPlay();
                }
            }, { passive: true });
        },

        showSlide(index) {
            this.slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            this.current = index;
        },

        next() {
            this.showSlide((this.current + 1) % this.total);
        },

        prev() {
            this.showSlide((this.current - 1 + this.total) % this.total);
        },

        goTo(index) {
            if (index >= 0 && index < this.total) {
                this.showSlide(index);
            }
        },

        startAutoPlay() {
            if (this.interval) return;
            this.interval = setInterval(() => this.next(), this.delay);
        },

        stopAutoPlay() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    };

    // ===========================================
    // 🔍 ПОИСК С ЭФФЕКТАМИ
    // ===========================================
    const Search = {
        input: null,
        button: null,
        typing: null,

        init() {
            this.input = document.getElementById('searchInput');
            this.button = document.getElementById('searchButton');
            this.typing = document.getElementById('typingText');

            if (!this.input || !this.button) return;

            this.bindEvents();
            console.log('🔍 Search: готов');
        },

        bindEvents() {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                this.search();
            });

            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.search();
                }
            });

            this.input.addEventListener('focus', () => {
                if (this.typing) this.typing.style.opacity = '0';
            });

            this.input.addEventListener('blur', () => {
                if (!this.input.value && this.typing) {
                    this.typing.style.opacity = '0.8';
                }
            });

            this.input.addEventListener('input', () => {
                if (this.typing) {
                    this.typing.style.opacity = this.input.value ? '0' : '0.8';
                }
            });
        },

        search() {
            const query = this.input.value.trim();
            if (query) {
                window.location.href = 'pages/search-results.html?q=' + encodeURIComponent(query);
            } else {
                this.input.focus();
                this.input.style.animation = 'shake 0.5s ease';
                setTimeout(() => this.input.style.animation = '', 500);
            }
        }
    };

    // ===========================================
    // 🛒 КОРЗИНА С АНИМАЦИЯМИ
    // ===========================================
    const Cart = {
        count: 0,
        key: 'archin_cart',

        init() {
            const saved = localStorage.getItem(this.key);
            if (saved) this.count = parseInt(saved, 10) || 0;

            this.updateDisplay();
            this.bindEvents();
            console.log('🛒 Cart: готов, товаров:', this.count);
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-add-to-cart, .btn-add-to-cart-small');
                if (btn) {
                    e.preventDefault();
                    this.add();
                }
            });
        },

        add(qty = 1) {
            this.count += qty;
            this.save();
            this.updateDisplay();
            this.animate();
            this.notify('✓ Товар добавлен в корзину');
        },

        save() {
            localStorage.setItem(this.key, this.count.toString());
        },

        updateDisplay() {
            document.querySelectorAll('.cart-count').forEach(el => {
                el.textContent = this.count;
                el.style.display = this.count > 0 ? 'flex' : 'none';
            });
        },

        animate() {
            document.querySelectorAll('.cart-count').forEach(el => {
                el.classList.add('animate');
                setTimeout(() => el.classList.remove('animate'), 500);
            });
        },

        notify(message) {
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = message;
            notification.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 30px;
                background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
                animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }, 2500);
        }
    };

    // ===========================================
    // ✍️ ЭФФЕКТ ПЕЧАТИ
    // ===========================================
    const TypingEffect = {
        texts: [
            "Продукция ARCHIN 🏗️",
            "Сухие смеси премиум-класса",
            "Гарантия качества",
            "Доставка по Москве",
            "Официальный дилер"
        ],
        element: null,
        index: 0,
        charIndex: 0,
        isDeleting: false,
        isPaused: false,

        init() {
            this.element = document.getElementById('typingText');
            if (!this.element) return;

            const input = document.getElementById('searchInput');
            if (input && document.activeElement === input) return;

            this.type();
            console.log('✍️ TypingEffect: запущен');
        },

        type() {
            if (this.isPaused) return;

            const text = this.texts[this.index];
            
            if (this.isDeleting) {
                this.charIndex--;
            } else {
                this.charIndex++;
            }

            this.element.textContent = text.substring(0, this.charIndex);

            let delay = this.isDeleting ? 40 : 80;

            if (!this.isDeleting && this.charIndex === text.length) {
                delay = 2500;
                this.isDeleting = true;
            } else if (this.isDeleting && this.charIndex === 0) {
                this.isDeleting = false;
                this.index = (this.index + 1) % this.texts.length;
                delay = 400;
            }

            setTimeout(() => this.type(), delay);
        }
    };

    // ===========================================
    // ⬆️ КНОПКА НАВЕРХ
    // ===========================================
    const ScrollToTop = {
        button: null,
        threshold: 400,

        init() {
            this.button = document.getElementById('scrollToTop');
            if (!this.button) return;

            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.button.classList.toggle('visible', window.scrollY > this.threshold);
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            console.log('⬆️ ScrollToTop: готов');
        }
    };

    // ===========================================
    // 📜 ШАПКА ПРИ СКРОЛЛЕ
    // ===========================================
    const HeaderScroll = {
        header: null,
        threshold: 50,

        init() {
            this.header = document.querySelector('.main-header');
            if (!this.header) return;

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        this.header.classList.toggle('scrolled', window.scrollY > this.threshold);
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });

            console.log('📜 HeaderScroll: готов');
        }
    };

    // ===========================================
    // ✨ АНИМАЦИИ ПРИ СКРОЛЛЕ
    // ===========================================
    const ScrollAnimations = {
        elements: [],
        
        init() {
            // Добавляем класс для анимации к секциям
            const selectors = [
                '.category-item',
                '.product-card',
                '.promotion-item',
                '.news-item',
                '.section-header',
                '.certificate-image-wrapper'
            ];
            
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach((el, i) => {
                    el.classList.add('fade-in-up');
                    el.style.transitionDelay = `${i * 0.1}s`;
                    this.elements.push(el);
                });
            });

            if (!this.elements.length) return;

            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.elements.forEach(el => observer.observe(el));

            console.log('✨ ScrollAnimations: готов');
        }
    };

    // ===========================================
    // 🔢 СЕЛЕКТОР КОЛИЧЕСТВА
    // ===========================================
    const QuantitySelector = {
        init() {
            document.addEventListener('click', (e) => {
                const minus = e.target.closest('.qty-btn.minus');
                const plus = e.target.closest('.qty-btn.plus');

                if (minus) {
                    e.preventDefault();
                    const input = minus.closest('.quantity-selector')?.querySelector('.qty-input');
                    if (input) {
                        const min = parseInt(input.min) || 1;
                        const val = parseInt(input.value) || 1;
                        if (val > min) input.value = val - 1;
                    }
                }

                if (plus) {
                    e.preventDefault();
                    const input = plus.closest('.quantity-selector')?.querySelector('.qty-input');
                    if (input) {
                        const max = parseInt(input.max) || 9999;
                        const val = parseInt(input.value) || 1;
                        if (val < max) input.value = val + 1;
                    }
                }
            });

            console.log('🔢 QuantitySelector: готов');
        }
    };

    // ===========================================
    // 📦 КНОПКА КАТАЛОГА
    // ===========================================
    const CatalogButton = {
        init() {
            const btn = document.querySelector('.catalog-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'pages/catalog.html';
                });
            }
        }
    };

    // ===========================================
    // 🎁 КНОПКА АКЦИЙ
    // ===========================================
    const PromotionsButton = {
        init() {
            const btn = document.querySelector('.promotions-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const section = document.querySelector('.promotions-section');
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        }
    };

    // ===========================================
    // 🎬 CSS АНИМАЦИИ
    // ===========================================
    const styles = document.createElement('style');
    styles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
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
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-6px); }
            80% { transform: translateX(6px); }
        }

        body:not(.loaded) * {
            transition: none !important;
        }
    `;
    document.head.appendChild(styles);

    // ===========================================
    // 🚀 ЗАПУСК
    // ===========================================
    App.init();

})();
