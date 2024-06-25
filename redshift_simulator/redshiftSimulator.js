const canvas = document.getElementById('redshiftCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('redshiftSlider');
const currentZDisplay = document.getElementById('currentZ');
const explanationElement = document.getElementById('explanation');
let animationSpeed = 1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

function drawSimulation(redshift, sliderValue) {
  const maxWidth = canvas.width - 20;
  const lineLength = Math.min(maxWidth, 10 + redshift * maxWidth / 10);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  const blueComponent = Math.max(0, 255 - redshift * 50);
  const redComponent = Math.min(255, redshift * 50);
  ctx.strokeStyle = `rgb(${redComponent}, 0, ${blueComponent})`;

  ctx.beginPath();
  ctx.moveTo(10, canvas.height / 2);
  ctx.lineTo(10 + lineLength, canvas.height / 2);
  ctx.lineWidth = 3;
  ctx.stroke();

  animationSpeed = 1 + sliderValue * 5;
}

function updateRedshift() {
  const redshift = parseFloat(slider.value);
  currentZDisplay.textContent = redshift.toFixed(2);
  drawSimulation(redshift, redshift);
  updateExplanation(redshift);
}

function updateExplanation(redshift) {
  let explanationText = `As the universe expands, light from distant galaxies is stretched, causing a shift towards the red end of the spectrum. This phenomenon is known as redshift, and it indicates the expansion of the universe.`;

  if (redshift < 0.5) {
    explanationText += `\n\nAt lower redshifts (z < 0.5), we're looking at relatively nearby galaxies. These galaxies are part of the local universe, and their light has not been significantly stretched by the expansion of space.`;
  } else if (redshift >= 0.5 && redshift < 5) {
    explanationText += `\n\nAt medium redshifts (0.5 ≤ z < 5), we're observing galaxies from the early universe. This was a time when the universe was much younger, and these galaxies are often very different from those we see nearby.`;
  } else {
    explanationText += `\n\nAt high redshifts (z ≥ 5), we're looking back to the very early universe, close to the time of the Big Bang. Galaxies at these distances are seen as they were when the universe was less than a billion years old.`;
  }

  explanationText += `\n\nDrag the slider to see how light gets stretched in space!`;
  explanationElement.textContent = explanationText;
}

slider.value = 0.0;
updateRedshift();

slider.addEventListener('input', updateRedshift);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
  updateRedshift();
});