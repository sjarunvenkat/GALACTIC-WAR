window.addEventListener("load", () => {
  const canvas = document.querySelector("canvas");
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const c = canvas.getContext("2d");

  const shootSound = new Audio("./assets/shoot.mp3");
  const explosionSound = new Audio("./assets/explosion.mp3");
  const healthSound = new Audio("./assets/health.mp3");
  const ambientSound = new Audio("./assets/ambient.mp3");
  ambientSound.loop = true;

  const playerImg = new Image();
  playerImg.src = "./assets/spaceship.png";

  const enemyImg = new Image();
  enemyImg.src = "./assets/ufo.png";

  const healthkitImg = new Image();
  healthkitImg.src = "./assets/health.png";

  const mouse = { x: innerWidth / 2, y: innerHeight - 33 };
  const touch = { x: innerWidth / 2, y: innerHeight - 33 };

  const bullets = [];
  const enemies = [];
  const healthkits = [];

  const bulletWidth = 10;
  const bulletHeight = 10;
  const bulletSpeed = 10;
  const enemyWidth = 331;
  const enemyHeight = 331;
  const healthkitWidth = 128;
  const healthkitHeight = 128;

  let score = 0;
  let health = 100;

  const losingPhrases = [
    "The Dark Side has won this time.",
    "You were the chosen one! It was said you would destroy the Sith, not join them!",
    "Your lightsaber needs more training.",
    "The Force is not strong enough within you.",
    "A Jedi's path is not an easy one, young Padawan.",
    "Your journey to become a Jedi Master is not yet complete.",
    "The Sith have prevailed, but there is always another chance.",
    "Darkness has fallen, but hope will rise again.",
  ];

  function runGame() {
    ambientSound.play();

    canvas.addEventListener("mousemove", (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    canvas.addEventListener("touchmove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const touchEvent = event.changedTouches[0];
      const touchX = parseInt(touchEvent.clientX);
      const touchY = parseInt(touchEvent.clientY) - rect.top - root.scrollTop;
      event.preventDefault();
      touch.x = touchX;
      touch.y = touchY;
    });

    const fire = () => {
      const x = mouse.x - bulletWidth - 100;
      const y = mouse.y - player.height - 1;
      bullets.push(new Bullet(x, y));
      shootSound.currentTime = 0;
      shootSound.play();
    };

    const spawnEnemies = () => {
      for (let i = 0; i < 4; i++) {
        const x = Math.random() * (innerWidth - enemyWidth);
        const y = -enemyHeight;
        const speed = Math.random() * 2;
        enemies.push(new Enemy(x, y, speed));
      }
    };

    const spawnHealthkits = () => {
      for (let i = 0; i < 1; i++) {
        const x = Math.random() * (innerWidth - healthkitWidth);
        const y = -healthkitHeight;
        const speed = Math.random() * 2.6;
        healthkits.push(new Healthkit(x, y, speed));
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, innerWidth, innerHeight);
      c.fillText(`Health: ${health}`, 5, 20);
      c.fillText(`Score: ${score}`, innerWidth - 100, 20);
      player.update();
      bullets.forEach((bullet, i) => {
        bullet.update();
        if (bullet.y < 0) bullets.splice(i, 1);
      });
      enemies.forEach((enemy, k) => {
        enemy.update();
        if (enemy.y > innerHeight) {
          enemies.splice(k, 1);
          health -= 10;
          if (health === 0) {
            localStorage.setItem("Score", score);
            localStorage.setItem(
              "lostphrase",
              losingPhrases[Math.floor(Math.random() * losingPhrases.length)]
            );
            ambientSound.pause();
            location.href = "./gameover.html";
          }
        }
      });
      enemies.forEach((enemy, j) => {
        bullets.forEach((bullet, l) => {
          if (collision(enemy, bullet)) {
            enemies.splice(j, 1);
            bullets.splice(l, 1);
            score++;
            explosionSound.currentTime = 0;
            explosionSound.play();
          }
        });
      });
      healthkits.forEach((healthkit) => healthkit.update());
      healthkits.forEach((healthkit, h) => {
        bullets.forEach((bullet, hh) => {
          if (collision(healthkit, bullet)) {
            healthkits.splice(h, 1);
            bullets.splice(hh, 1);
            health += 10;
            healthSound.currentTime = 0;
            healthSound.play();
          }
        });
      });
    };

    c.font = "1.1em Courier";

    setInterval(spawnEnemies, 1400);
    setInterval(spawnHealthkits, 16000);
    setInterval(fire, 200);
    animate();
  }

  function Bullet(x, y) {
    this.x = x;
    this.y = y;
    this.width = bulletWidth;
    this.height = bulletHeight;
    this.speed = bulletSpeed;
  }

  Bullet.prototype.draw = function () {
    c.fillStyle = "white";
    c.fillRect(this.x, this.y, this.width, this.height);
  };

  Bullet.prototype.update = function () {
    this.y -= this.speed;
    this.draw();
    c.beginPath();
    c.arc(this.x + this.width / 2, this.y + this.height / 2, 2, 0, Math.PI * 2);
    c.fillStyle = "orange";
    c.fill();
  };

  function Enemy(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = enemyWidth;
    this.height = enemyHeight;
    this.speed = speed;
  }
  Enemy.prototype.draw = function () {
    c.drawImage(enemyImg, this.x, this.y);
  };
  Enemy.prototype.update = function () {
    this.y += this.speed;
    this.draw();
  };

  function Healthkit(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = healthkitWidth;
    this.height = healthkitHeight;
    this.speed = speed;
  }
  Healthkit.prototype.draw = function () {
    c.drawImage(healthkitImg, this.x, this.y);
  };
  Healthkit.prototype.update = function () {
    this.y += this.speed;
    this.draw();
  };

  const player = {
    width: 218,
    height: 221,
    draw() {
      c.drawImage(playerImg, mouse.x - this.width, mouse.y - this.height);
    },
    update() {
      this.draw();
    },
  };

  function collision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
  runGame();
});
