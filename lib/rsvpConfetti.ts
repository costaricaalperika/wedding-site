import confetti from "canvas-confetti";

/** Sadece “katılıyorum” RSVP’si başarıyla gönderildiğinde çağırın (istemci). */
export function fireRsvpConfetti() {
  const end = Date.now() + 2_000;
  const colors = ["#7a2331", "#c9a227", "#5c1a24", "#f4efe8", "#ffffff"];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();

  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.62 },
    colors,
    scalar: 1.1,
  });
}
