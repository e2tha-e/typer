/* global canvas ctx animation:writable gameLoop label loop paintCircle isIntersectingRectangleWithCircle generateRandomNumber generateRandomCharCode paintParticles createParticles processParticles then */
let score = 0;
let lives = 10;
let caseSensitive = false;

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  color: '#FF0000'
};

const letter = {
  font: '25px Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
  color: '#0095DD',
  width: 15,
  height: 20,
  lowestSpeed: 0.1, // Low cap on the range 0.1 - 0.5. High range is 1.6 - 2.
  probability: 0.005
};

let letters = [];

ctx.font = label.font;
letter.width = ctx.measureText('0').width;
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
window.addEventListener('resize', resizeHandler);

loop(function (frames) {
console.warn(then)
  paintCircle(center.x, center.y, center.radius, center.color);
  ctx.font = letter.font;
  ctx.fillStyle = letter.color;
  for (const l of letters) {
    ctx.fillText(String.fromCharCode(l.code), l.x, l.y);
  }
  paintParticles();
  ctx.font = label.font;
  ctx.fillStyle = label.color;
  ctx.fillText('Score: ' + score, label.left, label.margin);
  ctx.fillText('Lives: ' + lives, label.right, label.margin);
  processParticles(frames);
  createLetters();
  removeLetters(frames);
});

function createLetters () {
  if (Math.random() < letter.probability) {
    const x = Math.random() < 0.5 ? 0 : canvas.width;
    const y = Math.random() * canvas.height;
    const dX = center.x - x;
    const dY = center.y - y;
    const norm = Math.sqrt(dX ** 2 + dY ** 2);
    let lowSpeed = letter.lowestSpeed;
    if (then < 900000) { // 15 minutes
      difficulty = Math.floor(then / (60 * 1000)) / 10;
      lowSpeed += difficulty;
    } else {
      lowSpeed += 1.5;
    }
    const highSpeed = lowSpeed + 0.4;
    const speed = generateRandomNumber(lowSpeed, highSpeed);
    letters.push({
      x,
      y,
      code: generateRandomCharCode(caseSensitive),
      speedX: dX / norm * speed,
      speedY: dY / norm * speed
    });
  }
}

function removeLetters (frames) {
  for (const l of letters) {
    if (isIntersectingRectangleWithCircle({ x: l.x, y: l.y - letter.height }, letter.width, letter.height, center, center.radius)) {
      if (--lives === 0) {
        window.alert('GAME OVER!');
        window.location.reload(false);
      } else if (lives > 0) {
        window.alert('START AGAIN!');
        letters = [];
      }
      break;
    } else {
      l.x += l.speedX * frames;
      l.y += l.speedY * frames;
    }
  }
}

function type (i, l) {
  letters.splice(i, 1);
  score++;
  createParticles(l.x, l.y);
}

window.changeCase = function () {
  caseSensitive = !caseSensitive;
  if (caseSensitive) {
    document.getElementById('change-case-text').innerHTML = '';
  } else {
    document.getElementById('change-case-text').innerHTML = 'in';
  }
};

function keyDownHandler (e) {
  let keyCode;
  // Adjust top-row keyCodes if keyboard layout is right-handed Dvorak.
  // For whatever reason, JS events register top-row keyCodes as number keys even if the layout says otherwise.
  switch (e.keyCode) {
    case 53:
      keyCode = 74;
      break;
    case 54:
      keyCode = 76;
      break;
    case 55:
      keyCode = 77;
      break;
    case 56:
      keyCode = 70;
      break;
    case 57:
      keyCode = 80;
      break;
    default:
      keyCode = e.keyCode;
  }
  if (animation !== undefined && keyCode >= 65 && keyCode <= 90) {
    for (let i = letters.length - 1; i >= 0; i--) {
      const l = letters[i];
      if (caseSensitive) {
        if (e.shiftKey) {
          if (keyCode === l.code) {
            type(i, l);
            return;
          }
        } else {
          if (keyCode + 32 === l.code) {
            type(i, l);
            return;
          }
        }
      } else {
        if (keyCode === l.code || keyCode + 32 === l.code) {
          type(i, l);
          return;
        }
      }
    }
    score--;
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 27) {
    if (animation === undefined) {
      animation = window.requestAnimationFrame(gameLoop);
    } else {
      window.cancelAnimationFrame(animation);
      animation = undefined;
    }
  }
}

function resizeHandler () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = canvas.width / 2;
  center.y = canvas.height / 2;
}
