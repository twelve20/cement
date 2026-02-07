// Простой JavaScript для переключения вкладок
document.addEventListener('DOMContentLoaded', function() {
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Убираем активный класс у всех кнопок и контентов
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));

                    // Добавляем активный класс текущей кнопке
                    button.classList.add('active');
                    
                    // Показываем соответствующий контент
                    const tabId = button.getAttribute('data-tab');
                    const contentToShow = document.getElementById(`${tabId}-content`);
                    if (contentToShow) {
                        contentToShow.classList.add('active');
                    }
                });
            });

            // Простой JavaScript для галереи изображений
            const thumbnails = document.querySelectorAll('.thumbnail');
            const mainImage = document.querySelector('.main-image img');

            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    // Убираем активный класс у всех миниатюр
                    thumbnails.forEach(t => t.classList.remove('active'));
                    // Добавляем активный класс текущей миниатюре
                    thumb.classList.add('active');
                    // Меняем главное изображение
                    mainImage.src = thumb.src;
                    mainImage.alt = thumb.alt;
                });
            });
        });
