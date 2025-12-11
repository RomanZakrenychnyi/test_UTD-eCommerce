(function () {

  const segments = document.querySelectorAll(".cashback-levels__segment");
  const singleFillDuration = 0.25;
  const waitTime = 0.2;

  let currentTimeout;
  let isRunning = false;

  const topItems = document.querySelectorAll(".cashback-levels__item-top");
  const bottomItems = document.querySelectorAll(
    ".cashback-levels__item-bottom"
  );
  const triggers = document.querySelectorAll(".cashback-levels__svg-trigger");

  function getVisibleSegmentCount() {
    let visibleCount = 0;
    segments.forEach((segment) => {
      if (window.getComputedStyle(segment).display !== "none") {
        visibleCount++;
      }
    });
    return visibleCount;
  }

  function activateLevelByIndex(index) {
    if (topItems[index]) topItems[index].classList.add("is-active");
    if (bottomItems[index]) bottomItems[index].classList.add("is-active");
    if (triggers[index]) triggers[index].classList.add("is-active");
  }

  function activateStepsByTime(actualDurationMs) {
    activateLevelByIndex(0);

    const delayStep2 = actualDurationMs * 0.35;
    setTimeout(() => activateLevelByIndex(1), delayStep2);

    const delayStep3 = actualDurationMs * 0.7;
    setTimeout(() => activateLevelByIndex(2), delayStep3);
  }

  function startFullCycle(totalSegments) {
    if (isRunning) return;
    isRunning = true;

    const totalFillDuration = totalSegments * singleFillDuration;
    const cycleDuration = totalFillDuration + waitTime;

    segments.forEach((segment) => {
      segment.classList.add("is-active");
    });

    activateStepsByTime(totalFillDuration * 1200);

    currentTimeout = setTimeout(() => {
      // Одноразове виконання
      isRunning = false;
    }, cycleDuration * 1000);
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
        isRunning = false;
      }
      segments.forEach((segment) => segment.classList.remove("is-active"));
      startFullCycle(getVisibleSegmentCount());
    }, 150);
  });

  startFullCycle(getVisibleSegmentCount());
})();