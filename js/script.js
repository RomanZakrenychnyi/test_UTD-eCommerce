document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  // 1. Данные о продуктах (STATE)
  // Добавлен ключ isWished: false/true для хранения состояния вишлиста
  // ==========================================================
  const collectionsData = {
    "Mantra Rings": {
      productName: "Mantra - Ring of Serenity",
      currentPrice: "₴2,150.00",
      oldPrice: "₴2,500.00",
      tags: ["New"],
      isWished: false, // СОСТОЯНИЕ: не в вишлисте
      imgSrc: {
        desktop1x: "/img/product-large-desktop-mantra-1x.webp",
        desktop2x: "/img/product-large-desktop-mantra-2x.webp",
        mobile991_1x: "/img/product-large-desktop-mantra-1x.webp",
        mobile991_2x: "/img/product-large-desktop-mantra-2x.webp",
        mobile420_1x: "/img/product-small-420w-mantra-1x.webp",
        mobile420_2x: "/img/product-small-420w-mantra-2x.webp",
      },
    },
    "CharityBands®": {
      productName: "Butterfly - Hope And Rebirth",
      currentPrice: "₴1,424.00",
      oldPrice: "₴1,424.00",
      tags: ["New", "Sale"],
      isWished: false, // СОСТОЯНИЕ: в вишлисте (для примера)
      imgSrc: {
        desktop1x: "/img/product-large-desktop-1x.webp",
        desktop2x: "/img/product-large-desktop-2x.webp",
        mobile991_1x: "/img/product-large-desktop-1x.webp",
        mobile991_2x: "/img/product-large-desktop-2x.webp",
        mobile420_1x: "/img/product-small-420w-1x.webp",
        mobile420_2x: "/img/product-small-420w-2x.webp",
      },
    },
    "Statement Collection": {
      productName: "Minimalist Cuff Bracelet",
      currentPrice: "₴950.00",
      oldPrice: null,
      tags: ["Must Have"],
      isWished: false, // СОСТОЯНИЕ: не в вишлисте
      imgSrc: {
        desktop1x: "/img/product-large-desktop-statement-1x.webp",
        desktop2x: "/img/product-large-desktop-statement-2x.webp",
        mobile991_1x: "/img/product-large-desktop-statement-1x.webp",
        mobile991_2x: "/img/product-large-desktop-statement-2x.webp",
        mobile420_1x: "/img/product-small-420w-statement-1x.webp",
        mobile420_2x: "/img/product-small-420w-statement-2x.webp",
      },
    },
  };

  // ==========================================================
  // 2. DOM-элементы и Константы
  // ==========================================================
  const collectionLinks = document.querySelectorAll(".collection-list__link");
  const productNameElement = document.querySelector(".product-card__name");
  const priceCurrentElement = document.querySelector(
    ".product-card__price-current"
  );
  const priceOldElement = document.querySelector(".product-card__price-old");
  const tagsContainer = document.querySelector(".product-card__tags");
  const pictureElement = document.querySelector(".product-card picture");

  const wishlistBtn = document.querySelector(".js-wishlist-toggle");
  const wishlistIcon = wishlistBtn
    ? wishlistBtn.querySelector(".js-wishlist-icon")
    : null; // img элемент внутри кнопки

  // Шляхи до файлів
  const ICON_OUTLINE_SRC = "./img/heart.svg";
  const ICON_FILLED_SRC = "./img/filled_heart.webp"; // WebP для заповненого

  // ==========================================================
  // 3. Функции
  // ==========================================================

  /**
   * Обновляет состояние кнопки вишлиста (UI) на основе данных продукта
   * @param {object} data - Данные текущего продукта
   */
  const updateWishlistUI = (data) => {
    if (!wishlistBtn || !wishlistIcon) return;

    const isWished = data.isWished;

    wishlistBtn.classList.toggle("product-card__action-btn--active", isWished);
    wishlistBtn.setAttribute(
      "aria-label",
      isWished ? "Remove from wishlist" : "Add to wishlist"
    );
    wishlistIcon.src = isWished ? ICON_FILLED_SRC : ICON_OUTLINE_SRC;
  };

  /**
   * Обновляет весь контент карточки продукта
   * @param {object} data - Данные текущего продукта
   */
  const updateProductContent = (data) => {
    // 1. Обновление имени, цен и тегов (Логика из предыдущего шага)
    productNameElement.textContent = data.productName;
    priceCurrentElement.textContent = data.currentPrice;
    priceOldElement.textContent = data.oldPrice ? data.oldPrice : "";
    priceOldElement.style.display = data.oldPrice ? "inline" : "none";

    tagsContainer.innerHTML = "";
    data.tags.forEach((tag) => {
      const tagSpan = document.createElement("span");
      tagSpan.className = "product-card__tag";
      if (tag.toLowerCase() === "sale") {
        tagSpan.classList.add("product-card__tag--sale");
      }
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });

    // 2. Обновление <picture> элементов (Изображения)
    pictureElement
      .querySelectorAll("source")
      .forEach((source) => source.remove());

    const source420 = document.createElement("source");
    source420.media = "(max-width: 420px)";
    source420.srcset = `${data.imgSrc.mobile420_1x} 1x, ${data.imgSrc.mobile420_2x} 2x`;
    source420.className = "product-card__source";
    pictureElement.prepend(source420);

    const source991 = document.createElement("source");
    source991.media = "(max-width: 991px)";
    source991.srcset = `${data.imgSrc.mobile991_1x} 1x, ${data.imgSrc.mobile991_2x} 2x`;
    source991.className = "product-card__source";
    pictureElement.prepend(source991);

    const imgElement = pictureElement.querySelector(".product-card__image");
    imgElement.src = data.imgSrc.desktop1x;
    imgElement.srcset = `${data.imgSrc.desktop2x} 2x`;

    // 3. Обновление состояния кнопки вишлиста
    updateWishlistUI(data);

    const quickViewOpenBtn = document.querySelector(".js-quickview-open");
    const modal = document.querySelector(".js-quickview-modal");
    const overlay = document.querySelector(".js-modal-overlay");
    const modalText = document.querySelector(".quickview-modal__text");
    const closeButton = document.querySelector(".js-modal-close");

    // Елемент <body> для блокування скролу
    const body = document.body;

    // ==========================================================
    // ФУНКЦІЇ МОДАЛЬНОГО ВІКНА
    // ==========================================================

    const openModal = () => {
      // Отримуємо назву активного продукту
      const currentProductName =
        collectionsData[currentCollectionName].productName;

      // Встановлюємо динамічний текст попапу
      modalText.textContent = `${currentProductName} has been added to the your cart.`;

      // Відображаємо модальне вікно та оверлей
      overlay.classList.add("quickview-overlay--visible");
      modal.classList.add("quickview-modal--visible");
      modal.setAttribute("aria-hidden", "false");

      // Блокуємо скрол сторінки
      body.style.overflow = "hidden";
    };

    const closeModal = () => {
      // Приховуємо модальне вікно та оверлей
      overlay.classList.remove("quickview-overlay--visible");
      modal.classList.remove("quickview-modal--visible");
      modal.setAttribute("aria-hidden", "true");

      // Відновлюємо скрол сторінки
      body.style.overflow = "";
    };

    // ==========================================================
    // ОБРОБНИКИ ПОДІЙ
    // ==========================================================

    // 1. Відкриття по кліку на кнопку "Око"
    if (quickViewOpenBtn) {
      quickViewOpenBtn.addEventListener("click", (event) => {
        event.preventDefault();
        openModal();
      });
    }

    // 2. Закриття по кліку на кнопку-хрестик
    if (closeButton) {
      closeButton.addEventListener("click", closeModal);
    }

    // 3. Закриття по кліку на оверлей
    if (overlay) {
      overlay.addEventListener("click", closeModal);
    }

    // 4. Закриття по натисканню Esc
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        modal.classList.contains("quickview-modal--visible")
      ) {
        closeModal();
      }
    });
  };

  // ==========================================================
  // 4. Инициализация при загрузке страницы
  // ==========================================================
  const initialLink = document.querySelector(".collection-list__link--active");
  let currentCollectionName = initialLink
    .querySelector("span")
    .textContent.trim();

  // Инициализируем контент для активной по умолчанию коллекции
  updateProductContent(collectionsData[currentCollectionName]);

  // ==========================================================
  // 5. Обработчик переключения коллекций
  // ==========================================================
  collectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const newCollectionName = link.querySelector("span").textContent.trim();

      // Если коллекция уже активна, выходим
      if (newCollectionName === currentCollectionName) {
        return;
      }

      // Обновляем активный класс в списке
      collectionLinks.forEach((l) =>
        l.classList.remove("collection-list__link--active")
      );
      link.classList.add("collection-list__link--active");

      // Обновляем текущую активную коллекцию
      currentCollectionName = newCollectionName;

      // Обновляем контент
      const productData = collectionsData[currentCollectionName];
      if (productData) {
        updateProductContent(productData);
      }
    });
  });

  // ==========================================================
  // 6. Обработчик нажатия на кнопку "Сердце"
  // ==========================================================
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", (event) => {
      event.preventDefault();

      const currentProductData = collectionsData[currentCollectionName];

      // 1. ТОГГЛИМ СОСТОЯНИЕ В ДАННЫХ (STATE)
      currentProductData.isWished = !currentProductData.isWished;

      // 2. Обновляем UI на основе НОВОГО состояния из данных
      updateWishlistUI(currentProductData);

      console.log(
        `Продукт "${currentProductData.productName}" в вишлисте: ${currentProductData.isWished}`
      );
    });
  }

  // 7. Заглушка для кнопки "Quick view" (если нужна)
  const quickViewOpenBtn = document.querySelector(".js-quickview-open");
  if (quickViewOpenBtn) {
    quickViewOpenBtn.addEventListener("click", (event) => {
      event.preventDefault();
      console.log("Quick View clicked - functionality disabled per request.");
    });
  }
});
