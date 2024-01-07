document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('vectorCanvas');
  const ctx = canvas.getContext('2d');
  const vectors = [];
  const vectorInfo = document.getElementById('vectorInfo');
  const calculateButton = document.getElementById('calculateButton');
  const deleteButton = document.getElementById('deleteButton');
  const gridSize = 40;

  let isDrawing = false;
  let isMoving = false;
  let selectedVector = null;
  let moveStartPoint, moveEndPoint;
  const tolerance = 0;

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('contextmenu', handleContextMenu);
  canvas.addEventListener('click', handleClick);
  calculateButton.addEventListener('click', displayVectorSum);
  deleteButton.addEventListener('click', deleteSelectedVector);
  window.addEventListener('keydown', handleKeyDown);

  // Handle mouse down event
  function handleMouseDown(e) {
    const mousePos = getMousePosition(e);
    const snappedPos = snapToGrid(mousePos);

    for (const vector of vectors) {
      if (isPointInsideVector(snappedPos, vector)) {
        isMoving = true;
        selectedVector = vector;
        moveStartPoint = snappedPos;
        moveEndPoint = { x: vector.end.x - vector.start.x, y: vector.end.y - vector.start.y };
        deleteButton.removeAttribute('disabled');
        redrawCanvas();
        return;
      }
    }

    isDrawing = true;
    vectors.push({
      start: snappedPos,
      end: snappedPos,
      length: 0
    });

    displayVectorLength(vectors[vectors.length - 1]);
    deleteButton.setAttribute('disabled', 'true');
  }

  // Handle mouse move event
  function handleMouseMove(e) {
    const mousePos = getMousePosition(e);
    const snappedPos = snapToGrid(mousePos);

    if (isMoving && selectedVector) {
      const dx = snappedPos.x - moveStartPoint.x;
      const dy = snappedPos.y - moveStartPoint.y;

      selectedVector.start.x += dx;
      selectedVector.start.y += dy;
      selectedVector.end.x += dx;
      selectedVector.end.y += dy;

      moveStartPoint = snappedPos;
      redrawCanvas();
    } else if (isDrawing) {
      vectors[vectors.length - 1].end = snappedPos;
      redrawCanvas();
      displayVectorLength(vectors[vectors.length - 1]);
      displayVectorLengthDynamic(snappedPos, vectors[vectors.length - 1]);
    }
  }

  // Handle mouse up event
  function handleMouseUp() {
    isDrawing = false;
    isMoving = false;
    calculateVectorLengths();
    redrawCanvas();
    if (!selectedVector) {
      deleteButton.setAttribute('disabled', 'true');
    }
  }

  // Handle context menu event
  function handleContextMenu(e) {
    e.preventDefault();
    const mousePos = getMousePosition(e);
    const snappedPos = snapToGrid(mousePos);

    for (let i = vectors.length - 1; i >= 0; i--) {
      if (isPointInsideVector(snappedPos, vectors[i])) {
        // Ask for confirmation before deleting
        const confirmDelete = confirm("Are you sure you want to delete this vector?");
        if (confirmDelete) {
          vectors.splice(i, 1);
          redrawCanvas();
        }
        break;
      }
    }
  }

  // Handle click event
  function handleClick(e) {
    const mousePos = getMousePosition(e);
    const snappedPos = snapToGrid(mousePos);

    for (const vector of vectors) {
      if (isPointInsideVector(snappedPos, vector)) {
        displayVectorLength(vector);
        break;
      }
    }
  }

  // Handle key down event
  function handleKeyDown(e) {
    if (e.key === 'Delete' && selectedVector) {
      const index = vectors.indexOf(selectedVector);
      vectors.splice(index, 1);
      redrawCanvas();

      if (vectors.length === 0) {
        deleteButton.setAttribute('disabled', 'true');
      }
    }
  }

  // Delete selected vector
  function deleteSelectedVector() {
    if (selectedVector) {
      const index = vectors.indexOf(selectedVector);
      vectors.splice(index, 1);
      redrawCanvas();

      if (vectors.length === 0) {
        deleteButton.setAttribute('disabled', 'true');
      }
    }
  }

  // Draw grid on the canvas
  function drawGrid() {
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.strokeRect(x, y, gridSize, gridSize);
      }
    }
  }

  // Draw a vector on the canvas
  function drawVector(vector) {
    if (vector === selectedVector) {
      ctx.strokeStyle = '#e74c3c';
      deleteButton.removeAttribute('disabled'); // Enable delete button when vector is selected
    } else {
      ctx.strokeStyle = '#3498db';
    }

    drawArrow(vector.start.x, vector.start.y, vector.end.x, vector.end.y);
    ctx.strokeStyle = '#3498db'; // Reset stroke style to default

    if (!selectedVector) {
      deleteButton.setAttribute('disabled', 'true'); // Disable delete button if no vector is selected
    }
  }

  // Draw an arrow on the canvas
  function drawArrow(fromX, fromY, toX, toY) {
    const headLength = 10;
    const lineWidth = 5;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);

    ctx.lineWidth = lineWidth;
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));

    ctx.stroke();
    ctx.lineWidth = 1;
  }

  // Redraw the canvas
  function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    vectors.forEach(drawVector);
  }

  // Calculate the length of a vector
  function calculateVectorLength(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy) / gridSize;
  }

  // Calculate lengths of all vectors
  function calculateVectorLengths() {
    vectors.forEach((vector) => {
      vector.length = calculateVectorLength(vector.start, vector.end);
    });
  }

  // Display the length of a vector
  function displayVectorLength(vector) {
    const lengthInfo = `Length: ${vector.length.toFixed(2)} units`;
    vectorInfo.innerText = lengthInfo;
  }

  // Display dynamic length information while drawing
  function displayVectorLengthDynamic(mousePos, vector) {
    const length = calculateVectorLength(vector.start, mousePos);
    const lengthInfo = `Length: ${length.toFixed(2)} units`;
    vectorInfo.innerText = lengthInfo;
  }

  // Display the sum of vector lengths
  function displayVectorSum() {
    const sumVector = calculateVectorSum(vectors);
    alert(`Sum of Vectors Length: ${sumVector.length.toFixed(2)} units`);
  }

  // Calculate the sum of all vectors
  function calculateVectorSum(vectors) {
    let sumVector = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      length: 0
    };

    vectors.forEach((vector) => {
      sumVector.end.x += vector.end.x - vector.start.x;
      sumVector.end.y += vector.end.y - vector.start.y;
    });

    sumVector.length = calculateVectorLength(sumVector.start, sumVector.end);
    return sumVector;
  }

  // Check if a point is inside a vector with some tolerance
  function isPointInsideVector(point, vector) {
    const { start, end } = vector;

    const minX = Math.min(start.x, end.x) - tolerance;
    const minY = Math.min(start.y, end.y) - tolerance;
    const maxX = Math.max(start.x, end.x) + tolerance;
    const maxY = Math.max(start.y, end.y) + tolerance;

    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
  }

  // Get the mouse position relative to the canvas
  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  // Snap the position to the grid
  function snapToGrid(pos) {
    const x = Math.round(pos.x / gridSize) * gridSize;
    const y = Math.round(pos.y / gridSize) * gridSize;
    return { x, y };
  }

  // Draw the initial grid
  drawGrid();
});
