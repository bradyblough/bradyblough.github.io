// redshiftSimulator.js

const canvas = document.getElementById('redshiftCanvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('redshiftSlider');
let animationSpeed = 1;
let isExplanationVisible = false;
const explanationElement = document.getElementById('explanation');
const showExplanationBtn = document.getElementById('showExplanationBtn');

// Set canvas size to fit the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;

function drawSimulation(redshift, sliderValue) {
  const maxWidth = canvas.width - 20;
  const lineLength = Math.min(maxWidth, 10 + redshift * maxWidth);

  // Draw background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  ctx.fillStyle = 'white';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }

  const progress = lineLength / maxWidth;
  const blueComponent = Math.max(0, 255 - progress * 255);
  const redComponent = Math.min(255, progress * 255);
  ctx.strokeStyle = `rgb(${redComponent}, 0, ${blueComponent})`;

  ctx.beginPath();
  ctx.moveTo(10, canvas.height / 2);
  ctx.lineTo(10 + lineLength, canvas.height / 2);

  ctx.lineWidth = 3;
  ctx.stroke();

  // Update animation 
  animationSpeed = 1 + sliderValue * 5;
}

function updateRedshift() {
  const redshift = parseFloat(slider.value);
  const sliderValue = parseFloat(slider.value);
  drawSimulation(redshift, sliderValue);
}

// Function to move stars
function moveStars() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.fillRect(x, y, 2, 2);
  }
}

// Function to update the explanation text
function updateExplanation(redshift) {
  explanationElement.textContent = `As the universe expands, light from distant galaxies is stretched, causing a shift towards the red end of the spectrum. This phenomenon is known as redshift, and it indicates the expansion of the universe. Higher redshift values correspond to greater distances and earlier cosmic times.\n Drag the slider to see how light gets stretched in space!`;
}

// Toggle explanation visibility
function toggleExplanation() {
  isExplanationVisible = !isExplanationVisible;
  explanationElement.style.display = isExplanationVisible ? 'block' : 'none';
  showExplanationBtn.textContent = isExplanationVisible ? 'Hide Explanation' : 'Show Explanation';
}


isExplanationVisible = true;

// Show explanation button click event listener
showExplanationBtn.addEventListener('click', () => {
  toggleExplanation();
  if (isExplanationVisible) {
    updateExplanation(parseFloat(slider.value));
  }
});


toggleExplanation();

// Attach event listener to the slider
slider.addEventListener('input', () => {
  updateRedshift();
  if (isExplanationVisible) {
    updateExplanation(parseFloat(slider.value));
  }
});

drawSimulation(0, 0);


window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 60;
  drawSimulation(parseFloat(slider.value), parseFloat(slider.value));
});
