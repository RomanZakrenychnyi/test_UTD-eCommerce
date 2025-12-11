document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------
  // 1. STATE: Product Collections
  // --------------------------------------------------
  const collectionsData = {
    "Mantra Rings": createProduct(
      "Mantra - Ring of Serenity",
      "₴2,150.00",
      "₴2,500.00",
      ["New"],
      false,
      {
        desktop1x: "/img/product-large-desktop-mantra-1x.webp",
        desktop2x: "/img/product-large-desktop-mantra-2x.webp",
        mobile991_1x: "/img/product-large-desktop-mantra-1x.webp",
        mobile991_2x: "/img/product-large-desktop-mantra-2x.webp",
        mobile420_1x: "/img/product-small-420w-mantra-1x.webp",
        mobile420_2x: "/img/product-small-420w-mantra-2x.webp",
      }
    ),

    "CharityBands®": createProduct(
      "Butterfly - Hope And Rebirth",
      "₴1,424.00",
      "₴1,424.00",
      ["New", "Sale"],
      false,
      {
        desktop1x: "/img/product-large-desktop-1x.webp",
        desktop2x: "/img/product-large-desktop-2x.webp",
        mobile991_1x: "/img/product-large-desktop-1x.webp",
        mobile991_2x: "/img/product-large-desktop-2x.webp",
        mobile420_1x: "/img/product-small-420w-1x.webp",
        mobile420_2x: "/img/product-small-420w-2x.webp",
      }
    ),

    "Statement Collection": createProduct(
      "Minimalist Cuff Bracelet",
      "₴950.00",
      null,
      ["Must Have"],
      false,
      {
        desktop1x: "/img/product-large-desktop-statement-1x.webp",
        desktop2x: "/img/product-large-desktop-statement-2x.webp",
        mobile991_1x: "/img/product-large-desktop-statement-1x.webp",
        mobile991_2x: "/img/product-large-desktop-statement-2x.webp",
        mobile420_1x: "/img/product-small-420w-statement-1x.webp",
        mobile420_2x: "/img/product-small-420w-statement-2x.webp",
      }
    ),
  };

  function createProduct(name, price, oldPrice, tags, wished, imgSrc) {
    return { productName: name, currentPrice: price, oldPrice, tags, isWished: wished, imgSrc };
  }

  // --------------------------------------------------
  // 2. DOM SELECTORS
  // --------------------------------------------------
  const collectionLinks = document.querySelectorAll(".collection-list__link");
  const productNameElement = document.querySelector(".product-card__name");
  const priceCurrentElement = document.querySelector(".product-card__price-current");
  const priceOldElement = document.querySelector(".product-card__price-old");
  const tagsContainer = document.querySelector(".product-card__tags");
  const pictureElement = document.querySelector(".product-card picture");

  const wishlistBtn = document.querySelector(".js-wishlist-toggle");
  const wishlistIcon = wishlistBtn?.querySelector(".js-wishlist-icon") || null;

  const ICON_OUTLINE_SRC = "./img/heart.svg";
  const ICON_FILLED_SRC = "./img/filled_heart.webp";

  // --------------------------------------------------
  // 3. WISHLIST UI UPDATE
  // --------------------------------------------------
  function updateWishlistUI(product) {
    if (!wishlistBtn || !wishlistIcon) return;

    wishlistBtn.classList.toggle("product-card__action-btn--active", product.isWished);
    wishlistBtn.setAttribute(
      "aria-label",
      product.isWished ? "Remove from wishlist" : "Add to wishlist"
    );
    wishlistIcon.src = product.isWished ? ICON_FILLED_SRC : ICON_OUTLINE_SRC;
  }

  // --------------------------------------------------
  // 4. PRODUCT RENDERING
  // --------------------------------------------------
  function updateProductContent(data) {
    renderText(data);
    renderTags(data.tags);
    renderImages(data.imgSrc);
    updateWishlistUI(data);
    setupQuickView(data);
  }

  function renderText(data) {
    productNameElement.textContent = data.productName;
    priceCurrentElement.textContent = data.currentPrice;

    priceOldElement.textContent = data.oldPrice || "";
    priceOldElement.style.display = data.oldPrice ? "inline" : "none";
  }

  function renderTags(tags) {
    tagsContainer.innerHTML = "";
    tags.forEach((tag) => {
      const tagSpan = document.createElement("span");
      tagSpan.className = "product-card__tag";
      if (tag.toLowerCase() === "sale") tagSpan.classList.add("product-card__tag--sale");
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });
  }

  function renderImages(img) {
    pictureElement.querySelectorAll("source").forEach((s) => s.remove());

    addSource("(max-width: 420px)", `${img.mobile420_1x} 1x, ${img.mobile420_2x} 2x`);
    addSource("(max-width: 991px)", `${img.mobile991_1x} 1x, ${img.mobile991_2x} 2x`);

    const imgElement = pictureElement.querySelector(".product-card__image");
    imgElement.src = img.desktop1x;
    imgElement.srcset = `${img.desktop2x} 2x`;
  }

  function addSource(media, srcset) {
    const source = document.createElement("source");
    source.media = media;
    source.srcset = srcset;
    pictureElement.prepend(source);
  }

  // --------------------------------------------------
  // 5. QUICK VIEW MODAL
  // --------------------------------------------------
  function setupQuickView(data) {
    const openBtn = document.querySelector(".js-quickview-open");
    const modal = document.querySelector(".js-quickview-modal");
    const overlay = document.querySelector(".js-modal-overlay");
    const modalText = document.querySelector(".quickview-modal__text");
    const closeBtn = document.querySelector(".js-modal-close");

    if (!openBtn || !modal || !overlay || !modalText) return;

    openBtn.onclick = (e) => {
      e.preventDefault();
      modalText.textContent = `${data.productName} has been added to your cart.`;
      modal.classList.add("quickview-modal--visible");
      overlay.classList.add("quickview-overlay--visible");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      modal.classList.remove("quickview-modal--visible");
      overlay.classList.remove("quickview-overlay--visible");
      document.body.style.overflow = "";
    };

    closeBtn && (closeBtn.onclick = closeModal);
    overlay.onclick = closeModal;

    document.onkeydown = (e) => {
      if (e.key === "Escape") closeModal();
    };
  }

  // --------------------------------------------------
  // 6. INITIALIZATION
  // --------------------------------------------------
  const initialLink = document.querySelector(".collection-list__link--active");
  let currentCollectionName = initialLink?.querySelector("span")?.textContent.trim();

  updateProductContent(collectionsData[currentCollectionName]);

  // --------------------------------------------------
  // 7. COLLECTION SWITCHING
  // --------------------------------------------------
  collectionLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const name = link.querySelector("span").textContent.trim();
      if (name === currentCollectionName) return;

      collectionLinks.forEach((l) => l.classList.remove("collection-list__link--active"));
      link.classList.add("collection-list__link--active");

      currentCollectionName = name;
      updateProductContent(collectionsData[name]);
    });
  });

  // --------------------------------------------------
  // 8. WISHLIST TOGGLE
  // --------------------------------------------------
  wishlistBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const product = collectionsData[currentCollectionName];
    product.isWished = !product.isWished;
    updateWishlistUI(product);
  });
});