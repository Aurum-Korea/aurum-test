// Attach cursor tracking to any .magnetic-card element
export function initMagneticCards() {
  const cards = document.querySelectorAll('.magnetic-card');
  cards.forEach(card => {
    // Remove previous listener if any (for route changes)
    const handler = (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    card._magneticHandler = handler;
    card.addEventListener('mousemove', handler);
  });
  // Return cleanup function
  return () => {
    cards.forEach(card => {
      if (card._magneticHandler) {
        card.removeEventListener('mousemove', card._magneticHandler);
      }
    });
  };
}
