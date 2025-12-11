export function defineLinkForInstallApp(targetId, device) {
  if (device === "desktop") {
    return `${targetId}`;
  } else {
    return `${targetId}`;
  }
}

export function defineBehaviorToInstallAppButton(buttonClass, url) {
  const buttons = document.querySelectorAll(buttonClass);
  if (!buttons.length) return;

  buttons.forEach((button) => {
    // 1) логіка: просто виставляємо href
    button.setAttribute("href", url);

    // 2) плавний скрол тільки для якорів
    if (!url.startsWith("#")) return;

    button.addEventListener("click", (e) => {
      const target = document.querySelector(url);
      if (!target) return;

      e.preventDefault();

      // Поточна адреса (з урахуванням /es/, /de/, пошуку тощо)
      const current = new URL(window.location.href);

      // Якщо хеш уже той самий — приберемо тільки ХЕШ (без зміни шляху)
      if (current.hash === url) {
        current.hash = ""; // видалили хеш
        history.replaceState(null, "", current.toString());
      }

      // Плавний скрол (візуал вирішує CSS: html{scroll-behavior:smooth})
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Повертаємо хеш, зберігаючи той самий шлях (/es/...) і пошук
      const after = new URL(window.location.href);
      after.hash = url.slice(1); // без '#'
      history.replaceState(null, "", after.toString());
    });
  });
}

