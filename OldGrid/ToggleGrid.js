var gridSize = 9;
var colors = ["#DC143C", "#00008B", "#8B008B", "#008000"]
var cssStyle = document.styleSheets[0];

function gridTile(xcoord, ycoord, filled) {
	this.x = xcoord;
	this.y = ycoord;
	this.isFilled = filled;
}

function getSquare(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	var boxXSize = Math.floor((canvas.width - 1) / gridSize);
	var boxYSize = Math.floor((canvas.height - 1) / gridSize);
	return {
		x: 1 + (evt.clientX - rect.left) - (evt.clientX - rect.left) % boxXSize,
		y: 1 + (evt.clientY - rect.top) - (evt.clientY - rect.top) % boxYSize
	};
}

function drawGrid(context, xSize, ySize) {
	var boxXSize = Math.floor((xSize - 1) / gridSize);
	var boxYSize = Math.floor((ySize - 1) / gridSize);

	for (var x = 0.5; x < boxXSize * gridSize + 1; x += boxXSize) {
		context.moveTo(x, 0);
		context.lineTo(x, boxYSize * gridSize);
	}

	for (var y = 0.5; y < boxYSize * gridSize + 1; y += boxYSize) {
		context.moveTo(0, y);
		context.lineTo(boxXSize * gridSize, y);
	}

	context.strokeStyle = "#ddd";
	context.stroke();
}

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	// return "#" + ((r << 16) | (g << 8) | b).toString(16).slice(1);
}

function fillSquare(context, canvas, x, y, color) {
	var boxXSize = Math.floor((canvas.width - 1) / gridSize);
	var boxYSize = Math.floor((canvas.height - 1) / gridSize);
	if (x > boxXSize * gridSize || y > boxYSize * gridSize) return;
	// context.fillStyle = "#808080";1
	var p = context.getImageData(x, y, 1, 1).data;
	var curF = rgbToHex(p[0], p[1], p[2]);
	// alert( curF + " " + color); // #0033ff
	if (curF.toUpperCase() == color.toUpperCase()) {
		context.fillStyle = "#ffffff"
	} else {
		context.fillStyle = color;
	}
	context.fillRect(x, y, boxXSize - 1, boxYSize - 1);
}

var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var curColor = 0;

drawGrid(context, canvas.width, canvas.height);

canvas.addEventListener('click', function(evt) {
	var mousePos = getSquare(canvas, evt);
	if(evt.button == 0)
	{
		fillSquare(context, canvas, mousePos.x, mousePos.y, colors[curColor]);
	} else if(evt.button == 1) {fillSquare(context, canvas, mousePos.x, mousePos.y, "#808080");}
	// fillSquare(context, canvas, mousePos.x, mousePos.y)
}, false);

canvas.addEventListener('wheel', function(evt) {
	if(evt.deltaY > 0)
	{
		curColor = (curColor + 1) % colors.length;
	} else if(evt.deltaY < 0) {curColor = (curColor + colors.length - 1) % colors.length;}
}, false);

var resButton = document.getElementById('resetButton');
resButton.addEventListener('click', function(evt) {
	context.fillStyle = myDiv.bac//"#ffffff"
	context.fillRect(0, 0, canvas.width, canvas.height);
	drawGrid(context, canvas.width, canvas.height);
}, false);