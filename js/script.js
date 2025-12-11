document.addEventListener('DOMContentLoaded', () => {
    // 1. Дані про продукти для різних колекцій
    const collectionsData = {
        'Mantra Rings': {
            productName: 'Mantra - Ring of Serenity',
            currentPrice: '₴2,150.00',
            oldPrice: '₴2,500.00',
            tags: ['New'],
            imgSrc: {
                desktop1x: '/img/product-large-desktop-mantra-1x.webp',
                desktop2x: '/img/product-large-desktop-mantra-2x.webp',
                mobile991_1x: '/img/product-large-desktop-mantra-1x.webp',
                mobile991_2x: '/img/product-large-desktop-mantra-2x.webp',
                mobile420_1x: '/img/product-small-420w-mantra-1x.webp',
                mobile420_2x: '/img/product-small-420w-mantra-2x.webp'
            }
        },
        'CharityBands®': {
            productName: 'Butterfly - Hope And Rebirth', // Активний за замовчуванням
            currentPrice: '₴1,424.00',
            oldPrice: '₴1,424.00',
            tags: ['New', 'Sale'],
            imgSrc: {
                desktop1x: '/img/product-large-desktop-1x.webp',
                desktop2x: '/img/product-large-desktop-2x.webp',
                mobile991_1x: '/img/product-large-desktop-1x.webp',
                mobile991_2x: '/img/product-large-desktop-2x.webp',
                mobile420_1x: '/img/product-small-420w-1x.webp',
                mobile420_2x: '/img/product-small-420w-2x.webp'
            }
        },
        'Statement Collection': {
            productName: 'Minimalist Cuff Bracelet',
            currentPrice: '₴950.00',
            oldPrice: null, // null, якщо немає старої ціни
            tags: ['Must Have'],
            imgSrc: {
                desktop1x: '/img/product-large-desktop-statement-1x.webp',
                desktop2x: '/img/product-large-desktop-statement-2x.webp',
                mobile991_1x: '/img/product-large-desktop-statement-1x.webp',
                mobile991_2x: '/img/product-large-desktop-statement-2x.webp',
                mobile420_1x: '/img/product-small-420w-statement-1x.webp',
                mobile420_2x: '/img/product-small-420w-statement-2x.webp'
            }
        }
    };

    // 2. Об'єкти DOM-елементів, які потрібно оновлювати
    const collectionLinks = document.querySelectorAll('.collection-list__link');
    const productNameElement = document.querySelector('.product-card__name');
    const priceCurrentElement = document.querySelector('.product-card__price-current');
    const priceOldElement = document.querySelector('.product-card__price-old');
    const tagsContainer = document.querySelector('.product-card__tags');
    const pictureElement = document.querySelector('.product-card picture');

    // 3. Функція оновлення контенту продукту
    const updateProductContent = (data) => {
        // Оновлення імені продукту
        productNameElement.textContent = data.productName;

        // Оновлення цін
        priceCurrentElement.textContent = data.currentPrice;
        
        // Відображення старої ціни лише за її наявності
        priceOldElement.textContent = data.oldPrice ? data.oldPrice : '';
        priceOldElement.style.display = data.oldPrice ? 'inline' : 'none'; 

        // Оновлення тегів
        tagsContainer.innerHTML = '';
        data.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'product-card__tag';
            // Використовуємо модифікатор BEM для тегу "Sale"
            if (tag.toLowerCase() === 'sale') {
                tagSpan.classList.add('product-card__tag--sale');
            }
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });

        // Оновлення <picture> елемента (src/srcset)
        // Видаляємо всі існуючі <source> елементи для коректного оновлення
        pictureElement.querySelectorAll('source').forEach(source => source.remove());
        
        // Додаємо нові <source> елементи для адаптивності
        
        // 1. mobile: max-width: 420px (з 1x, 2x)
        const source420 = document.createElement('source');
        source420.media = "(max-width: 420px)";
        source420.srcset = `${data.imgSrc.mobile420_1x} 1x, ${data.imgSrc.mobile420_2x} 2x`;
        source420.className = "product-card__source";
        pictureElement.prepend(source420);

        // 2. tablet/mobile: max-width: 991px (з 1x, 2x)
        const source991 = document.createElement('source');
        source991.media = "(max-width: 991px)";
        source991.srcset = `${data.imgSrc.mobile991_1x} 1x, ${data.imgSrc.mobile991_2x} 2x`;
        source991.className = "product-card__source";
        pictureElement.prepend(source991);
        
        // 3. Оновлюємо img (основний десктопний/fallback)
        const imgElement = pictureElement.querySelector('.product-card__image');
        imgElement.src = data.imgSrc.desktop1x;
        imgElement.srcset = `${data.imgSrc.desktop2x} 2x`;
    };

    // Ініціалізація: встановлення контенту активної колекції при завантаженні сторінки
    // Ми знаємо, що 'CharityBands®' активний за замовчуванням у HTML
    const initialCollection = document.querySelector('.collection-list__link--active span').textContent.trim();
    updateProductContent(collectionsData[initialCollection]);

    // 4. Обробник кліків на колекції
    collectionLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            // Отримуємо назву колекції з тегу <span> всередині <a>
            const collectionName = link.querySelector('span').textContent.trim();
            const productData = collectionsData[collectionName];
            
            // Якщо обрана колекція вже активна, нічого не робимо (завжди повинен бути активний один блок)
            if (link.classList.contains('collection-list__link--active')) {
                return;
            }

            // Знімаємо клас активності з усіх посилань
            collectionLinks.forEach(l => l.classList.remove('collection-list__link--active'));
            
            // Додаємо клас активності до обраного посилання
            link.classList.add('collection-list__link--active');
            
            // Оновлюємо контент продукту
            if (productData) {
                updateProductContent(productData);
            }
        });
    });

    // 5. Заглушка для кнопки "Quick view"
    // Кнопка все одно має бути у HTML, але функціонал її не потрібен, тому додамо пустий обробник,
    // щоб не виникало помилок, якщо вона залишилася у розмітці.
    const quickViewOpenBtn = document.querySelector('.js-quickview-open');
    if (quickViewOpenBtn) {
        quickViewOpenBtn.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Quick View clicked - functionality disabled per request.');
        });
    }
});