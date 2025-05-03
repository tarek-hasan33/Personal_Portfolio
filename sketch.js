let particles = [];
let ringBands = 3;
let baseRingRadiusX = 120;
let baseRingRadiusY = 30;
let particlesPerBand = 400;

let rotationBase;
let rotationAngle;
let currentSaturnColor = 0;
let saturnColors = ["#CBD6E2", "#A3B3C2", "#7A8DA1"]; // progressively darker

let stars = [];
let numStars = 120;

let fallingStar = null;
let nextFallingStarTime = 0;

function setup() {
  let sketchHolder = document.querySelector(".sketch-holder");
  let canvas = createCanvas(
    sketchHolder.offsetWidth,
    sketchHolder.offsetHeight
  );
  canvas.parent(sketchHolder);
  //canvas.parent(".sketch-holder");
  rotationBase = radians(-28);
  rotationAngle = rotationBase;

  // Generate ring particles
  for (let band = 0; band < ringBands; band++) {
    let radiusX = baseRingRadiusX + band * 12;
    let radiusY = baseRingRadiusY + band * 4;
    for (let i = 0; i < particlesPerBand; i++) {
      particles.push({
        angle: random(TWO_PI),
        radiusOffset: (random() - 0.5) * 8,
        speed: 0.0015 + random() * 0.0005,
        radiusX,
        radiusY,
      });
    }
  }

  // Generate background stars
  for (let i = 0; i < numStars; i++) {
    let angle = random(TWO_PI);
    let distFromCenter = random(150, 350);
    let x = width / 2 + cos(angle) * distFromCenter;
    let y = height / 2 + sin(angle) * distFromCenter;
    stars.push({ x, y, size: random(1, 2), brightness: random(150, 255) });
  }

  nextFallingStarTime = millis() + random(3000, 8000);
}

function draw() {
  clear();
  //background(0);
  drawStars();
  updateFallingStar();

  let targetTilt = rotationBase + ((mouseX - width / 2) / width) * radians(10);
  rotationAngle += (targetTilt - rotationAngle) * 0.05;

  drawRingBack();
  drawSaturn();
  drawRingFront();
}

function drawStars() {
  noStroke();
  for (let star of stars) {
    fill(star.brightness);
    ellipse(star.x, star.y, star.size, star.size);
  }
}

function updateFallingStar() {
  if (fallingStar) {
    fallingStar.x += fallingStar.vx;
    fallingStar.y += fallingStar.vy;
    fallingStar.life--;

    stroke("#2EC4B6" + hex(fallingStar.life * 4, 2));
    strokeWeight(2);
    line(
      fallingStar.x,
      fallingStar.y,
      fallingStar.x - fallingStar.vx * 10,
      fallingStar.y - fallingStar.vy * 10
    );
    noStroke();

    if (fallingStar.life <= 0) {
      fallingStar = null;
      nextFallingStarTime = millis() + random(3000, 8000);
    }
  } else if (millis() > nextFallingStarTime) {
    let startX = random(width * 0.3, width * 0.7);
    let startY = random(height * 0.2, height * 0.5);
    fallingStar = {
      x: startX,
      y: startY,
      vx: random(4, 6),
      vy: random(2, 4),
      life: 60,
    };
  }
}

function drawRingBack() {
  noStroke();
  let centerX = width / 2;
  let centerY = height / 2;

  for (let p of particles) {
    p.angle += p.speed;

    let xLocal = (p.radiusX + p.radiusOffset) * cos(p.angle);
    let yLocal = (p.radiusY + p.radiusOffset) * sin(p.angle);

    if (yLocal >= 0) continue;

    let drift = sin(millis() * 0.0001) * radians(2);
    let dynamicTilt = rotationAngle + drift;

    let rotatedX = xLocal * cos(dynamicTilt) - yLocal * sin(dynamicTilt);
    let rotatedY = xLocal * sin(dynamicTilt) + yLocal * cos(dynamicTilt);

    let x = centerX + rotatedX;
    let y = centerY + rotatedY;

    fill("#CBD6E2");
    ellipse(x, y, 3, 3);
  }
}

function drawSaturn() {
  push();
  translate(width / 2, height / 2);
  noStroke();
  fill(saturnColors[currentSaturnColor]);
  drawingContext.shadowColor = "#ffffff22";
  drawingContext.shadowBlur = 25;
  ellipse(0, 0, 120, 120);
  pop();
}

function drawRingFront() {
  noStroke();
  let centerX = width / 2;
  let centerY = height / 2;
  let saturnRadius = 60;

  for (let p of particles) {
    let xLocal = (p.radiusX + p.radiusOffset) * cos(p.angle);
    let yLocal = (p.radiusY + p.radiusOffset) * sin(p.angle);

    if (yLocal < 0) continue;

    let drift = sin(millis() * 0.0001) * radians(2);
    let dynamicTilt = rotationAngle + drift;

    let rotatedX = xLocal * cos(dynamicTilt) - yLocal * sin(dynamicTilt);
    let rotatedY = xLocal * sin(dynamicTilt) + yLocal * cos(dynamicTilt);

    let x = centerX + rotatedX;
    let y = centerY + rotatedY;

    let dx = x - centerX;
    let dy = y - centerY;
    let isInsideSaturn = dx * dx + dy * dy < saturnRadius * saturnRadius;

    fill(isInsideSaturn ? 0 : "#CBD6E2");
    ellipse(x, y, 3, 3);
  }
}

function mouseClicked() {
  currentSaturnColor = (currentSaturnColor + 1) % saturnColors.length;
}

function windowResized() {
  let sketchHolder = document.querySelector(".sketch-holder");
  resizeCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight);
}
