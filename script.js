const ctx = document.querySelector("canvas").getContext("2d");

const target = {
	position: { x: 100, y: 300 },
	body: { x: 100, y: 150 },
	head: { x: 50, y: 50 }
};

let stepX = 2;
let stepY = 0;

let isGoingRight = true;
let requestId;

gameLoop();

function draw() {
	clear();

	if (target.position.x >= 700) isGoingRight = false;
	if (target.position.x <= 0) isGoingRight = true;

	if (isGoingRight) {
		target.position.x += stepX;
		target.position.y += stepY;

		drawTarget(target.position.x, target.position.y);
	} else {
		target.position.x -= stepX;
		target.position.y -= stepY;

		drawTarget(target.position.x, target.position.y);
	}

	requestId = requestAnimationFrame(draw);

	function clear() {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 800, 600);
	}

	function drawTarget(x, y) {
		ctx.fillStyle = "black";
		ctx.fillRect(x, y, target.body.x, target.body.y);
		ctx.fillRect(
			x + (target.body.x - target.head.x) / 2,
			y - target.head.y,
			target.head.x,
			target.head.y
		);
	}
}

function gameLoop() {
	requestId = requestAnimationFrame(draw);
}
