const ctx = document.querySelector("canvas").getContext("2d");

const target = {
	positionReal: { x: 100, y: 100 },
	positionStart: { x: 100, y: 100 },
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

	if (target.positionReal.x >= 700) isGoingRight = false;
	if (target.positionReal.x <= 0) isGoingRight = true;

	if (isGoingRight) {
		target.positionReal.x += stepX;
		target.positionReal.y += stepY;

		drawTarget(target.positionReal.x, target.positionReal.y);
	} else {
		target.positionReal.x -= stepX;
		target.positionReal.y -= stepY;

		drawTarget(target.positionReal.x, target.positionReal.y);
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
