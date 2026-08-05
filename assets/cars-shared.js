/*
 * Shared rendering helpers for car listing cards. Depends on window.CARS
 * (assets/cars-data.js) being loaded first.
 */
window.CarsShared = (function () {
  // Safety net only — the real rule (owner, 2026-08-05) is "first sentence of
  // special[0], full stop." This just guards against one absurdly long sentence
  // blowing out a card's height.
  const CARD_PREVIEW_MAX_CHARS = 240;

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function firstSentence(text) {
    const match = /^[\s\S]*?[.!?](?=\s|$)/.exec(text);
    return (match ? match[0] : text).trim();
  }

  // Card preview = first sentence of car.special[0] only. There is no separate
  // "description"/"tagline" copy anymore — the owner explicitly wants ONLY the
  // special/caution text used anywhere in the listings (2026-08-05).
  function cardPreviewText(car) {
    const source = (car.special && car.special[0]) || '';
    let text = firstSentence(source);
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
