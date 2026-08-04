/*
 * Shared rendering helpers for car listing cards. Depends on window.CARS
 * (assets/cars-data.js) being loaded first.
 */
window.CarsShared = (function () {
  // T3: single configurable place for card preview length — change here, not per-card.
  const CARD_PREVIEW_MAX_PARAGRAPHS = 2;
  const CARD_PREVIEW_MAX_CHARS = 200;

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Owner's own copy (car.description), truncated to a uniform length — never the
  // hand-written marketing "hook" text. Short cars (e.g. few description
  // paragraphs) simply render their whole text unmodified.
  function cardPreviewText(car) {
    const paragraphs = (car.description || []).slice(0, CARD_PREVIEW_MAX_PARAGRAPHS);
    let text = paragraphs.join(' ');
    if (text.length > CARD_PREVIEW_MAX_CHARS) {
      const cut = text.slice(0, CARD_PREVIEW_MAX_CHARS);
      const lastSpace = cut.lastIndexOf(' ');
      text = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…';
    }
    return text;
  }

  // T5: available cars first, sold cars always last, each group ordered by
  // car.order. A newly added sold car needs no manual reordering — it is pushed
  // to the end purely because sold === true, regardless of its order value.
  function sortCarsForDisplay(entries) {
    return entries.slice().sort((a, b) => {
      const [, carA] = a, [, carB] = b;
      const soldA = carA.sold ? 1 : 0, soldB = carB.sold ? 1 : 0;
      if (soldA !== soldB) return soldA - soldB;
      return (carA.order || 0) - (carB.order || 0);
    });
  }

  function allCarsSorted() {
    return sortCarsForDisplay(Object.entries(window.CARS));
  }

  function featuredCarsSorted(limit) {
    const featured = Object.entries(window.CARS).filter(([, car]) => car.featured);
    const sorted = sortCarsForDisplay(featured);
    return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
  }

  function cardMetaChips(car) {
    return (car.heroSpecs || []).slice(0, 3).map(s => s.value);
  }

  return { esc, cardPreviewText, sortCarsForDisplay, allCarsSorted, featuredCarsSorted, cardMetaChips };
})();
