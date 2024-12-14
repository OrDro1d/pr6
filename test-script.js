const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const messageElement = document.getElementById("message");

const target = {
	x: 300,
	y: 200,
	size: 50,
	speedX: 2,
	speedY: 1,
	vertices: []
};

const bullets = [];
let score = 0;

const shooter = {
	x: canvas.width / 2,
	y: canvas.height
};

function calculateStarVertices(x, y, size) {
	const vertices = [];
	const step = Math.PI / 5;
	for (let i = 0; i < 10; i++) {
		const radius = i % 2 === 0 ? size : size / 2;
		const angle = step * i - Math.PI / 2;
		vertices.push({
			x: x + radius * Math.cos(angle),
			y: y + radius * Math.sin(angle)
		});
	}
	return vertices;
}

function drawStar(vertices) {
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.moveTo(vertices[0].x, vertices[0].y);
	vertices.forEach(v => ctx.lineTo(v.x, v.y));
	ctx.closePath();
	ctx.fill();
}

function pointInStar(point, vertices) {
	let intersections = 0;
	for (let i = 0; i < vertices.length; i++) {
		const v1 = vertices[i];
		const v2 = vertices[(i + 1) % vertices.length];
		if (
			point.y > Math.min(v1.y, v2.y) &&
			point.y <= Math.max(v1.y, v2.y) &&
			point.x <= Math.max(v1.x, v2.x) &&
			v1.y !== v2.y
		) {
			const xinters = ((point.y - v1.y) * (v2.x - v1.x)) / (v2.y - v1.y) + v1.x;
			if (v1.x === v2.x || point.x <= xinters) intersections++;
		}
	}
	return intersections % 2 !== 0;
}

function updateTarget() {
	if (target.x + target.size >= canvas.width || target.x - target.size <= 0) {
		target.speedX *= -1;
	}
	if (target.y + target.size >= canvas.height || target.y - target.size <= 0) {
		target.speedY *= -1;
	}
	target.x += target.speedX;
	target.y += target.speedY;
	target.vertices = calculateStarVertices(target.x, target.y, target.size);
}

function drawBullets() {
	ctx.fillStyle = "black";
	bullets.forEach(bullet => {
		ctx.beginPath();
		ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
		ctx.fill();
	});
}

function checkHits() {
	for (let i = bullets.length - 1; i >= 0; i--) {
		const bullet = bullets[i];

		if (
			bullet.x < 0 ||
			bullet.x > canvas.width ||
			bullet.y < 0 ||
			bullet.y > canvas.height
		) {
			const targetCenterX = target.x;
			if (bullet.x < targetCenterX) {
				messageElement.textContent = "Промах! Цель правее.";
			} else {
				messageElement.textContent = "Промах! Цель левее.";
			}
			bullets.splice(i, 1);
		} else if (pointInStar(bullet, target.vertices)) {
			score++;
			messageElement.textContent = "Попадание!";
			bullets.splice(i, 1);
		}
	}
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	updateTarget();
	drawStar(target.vertices);

	bullets.forEach(bullet => {
		bullet.x += bullet.speedX;
		bullet.y += bullet.speedY;
	});

	drawBullets();
	checkHits();

	ctx.fillStyle = "black";
	ctx.font = "20px Arial";
	ctx.fillText(`Счёт: ${score}`, 10, 20);

	requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", event => {
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;

	const dx = mouseX - shooter.x;
	const dy = mouseY - shooter.y;
	const magnitude = Math.sqrt(dx * dx + dy * dy);

	bullets.push({
		x: shooter.x,
		y: shooter.y,
		speedX: (dx / magnitude) * 5,
		speedY: (dy / magnitude) * 5
	});
});

target.vertices = calculateStarVertices(target.x, target.y, target.size);
gameLoop();
