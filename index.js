function typeEffect() {
  const text = "Welcome to my website!";
  const speed = 75; // Time delay between each character (in milliseconds)
  const typeInterval = setInterval(() => {
    const typedText = document.getElementById("typed").textContent;
    if (typedText === text) {
      clearInterval(typeInterval);
      setTimeout(() => {
        const removeInterval = setInterval(() => {
          const typedText = document.getElementById("typed").textContent;
          if (typedText.length === 0) {
            clearInterval(removeInterval);
            setTimeout(typeEffect, 1000); // Delay before retyping (in milliseconds)
          } else {
            document.getElementById("typed").textContent = typedText.slice(
              0,
              -1
            );
          }
        }, speed);
      }, 2000); // Delay before removing the text (in milliseconds)
    } else {
      document.getElementById("typed").textContent += text[typedText.length];
    }
  }, speed);
}

document.addEventListener("DOMContentLoaded", function (event) {
  typeEffect();
});




