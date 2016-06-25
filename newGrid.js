document.createSvg = function(tagName) {
    var svgNS = "http://www.w3.org/2000/svg";
    return this.createElementNS(svgNS, tagName);
};

var numberPerSide = 8;
var size = 10;
var pixelsPerSide = 400;

var allCol = ["#DC143C", "#00008B", "#8B008B", "#008000"];
var curColor = 0;

var boxArray = [];

var grid = function(numberPerSide, size, pixelsPerSide, fillColor) {
    var svg = document.createSvg("svg");
    svg.setAttribute("width", pixelsPerSide);
    svg.setAttribute("height", pixelsPerSide);
    svg.setAttribute("viewBox", [0, 0, numberPerSide * size, numberPerSide * size].join(" "));

    
    for(var i = 0; i < numberPerSide; i++) {
        boxArray.push([]);
        for(var j = 0; j < numberPerSide; j++) {
            var g = document.createSvg("g");
            g.setAttribute("transform", ["translate(", i*size, ",", j*size, ")"].join(""));
            var number = numberPerSide * i + j;
            var box = document.createSvg("rect");
            box.setAttribute("width", size);
            box.setAttribute("height", size);
            box.setAttribute("fill", fillColor);
            box.setAttribute("stroke", "black");
            box.setAttribute("stroke-width", 0.5);
            box.setAttribute("stroke-opacity", 1);
            box.setAttribute("filled", false);
            box.setAttribute("id", "b" + number);
            boxArray[i].push(box);
            g.appendChild(box);
            svg.appendChild(g);
        }  
    }
    svg.addEventListener(
        "click",
        function(e){
            var box2 = e.target;
            var curCol = e.target.getAttribute("fill");
            var toBeCol = e.button == 1 ? "#808080" : allCol[curColor];
            if(curCol == toBeCol)
            {
                e.target.setAttribute("fill", "#FFFFFF");
                box2.setAttribute("filled", false);
            } else {
                e.target.setAttribute("fill", toBeCol);
                box2.setAttribute("filled", true);
            }
        },
        false);
    return svg;
};

var container = document.getElementById("container");
container.addEventListener('wheel', function(evt) {
    if(evt.deltaY > 0)
    {
        curColor = (curColor + 1) % allCol.length;
    } else if(evt.deltaY < 0) {curColor = (curColor + allCol.length - 1) % allCol.length;}
}, false);
container.appendChild(grid(numberPerSide, size, pixelsPerSide, "#FFFFFF"));

var resButton = document.getElementById('resetButton');
resButton.addEventListener('click', function(evt) {
    for(var i = 0; i < numberPerSide; i++) {
        for(var j = 0; j < numberPerSide; j++) {
            var box = boxArray[i][j];
            box.setAttribute("filled", false);
            box.setAttribute("fill", "#FFFFFF");
        }
    }
}, false);

function rgbToHex(r, g, b) {
	if (r > 255 || g > 255 || b > 255)
		throw "Invalid color component";
    var str = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	return str.toUpperCase();
	// return "#" + ((r << 16) | (g << 8) | b).toString(16).slice(1);
}

var totalVisited = 0;
var totalFilled = 0;
var colorIncrement = 0;
var calls = 0;
var lsolve = function(x, y, size) {
    calls++;
    if(size == 2)
    {
        totalVisited = totalVisited + 4;
        for(var i = 0; i < size; i++) {
            for(var j = 0; j < size; j++) {
                var box = boxArray[i+x][j+y];
                if(box.getAttribute("filled") == "true")
                {
                    for(var k = 0; k < size; k++)
                    {
                        for(var l = 0; l < size; l++)
                        {
                            var box2 = boxArray[k+x][l+y];
                            if(box2.getAttribute("filled") == "false")
                            {
                                totalFilled++
                                box2.setAttribute("filled", true);
                                box2.setAttribute("fill", rgbToHex(totalFilled/3*colorIncrement, 120 + totalFilled/3*colorIncrement/2, 255))
                                // box2.setAttribute("fill", allCol[curColor]);
                            }
                        }
                    }
                    curColor = (curColor + 1) % allCol.length;
                    return true;
                }
            }
        }
        return false;
    } else {
        var result = lsolve(x + (size/4), y + (size/4), size/2);
        if(result == true)
        {
            lsolve(x, y, size/2);
            lsolve(x, y+size/2, size/2);
            lsolve(x+size/2, y+size/2, size/2);
            lsolve(x+size/2, y, size/2);
            return true;
        } else if(lsolve(x, y, size/2) == true)
        {
            lsolve(x + (size/2 - 1), y + (size/2 - 1), size/2);
            lsolve(x, y+size/2, size/2);
            lsolve(x+size/2, y+size/2, size/2);
            lsolve(x+size/2, y, size/2);
            return true;
        } else if(lsolve(x, y+size/2, size/2) == true)
        {
            lsolve(x + (size/2 - 1), y + (size/2 - 1), size/2);
            lsolve(x, y, size/2);
            lsolve(x+size/2, y+size/2, size/2);
            lsolve(x+size/2, y, size/2);
            return true;
        } else if(lsolve(x+size/2, y+size/2, size/2) == true)
        {
            lsolve(x + (size/2 - 1), y + (size/2 - 1), size/2);
            lsolve(x, y, size/2);
            lsolve(x, y+size/2, size/2);
            lsolve(x+size/2, y, size/2);
            return true;
        } else if(lsolve(x+size/2, y, size/2 == true))
        {
            lsolve(x + (size/2 - 1), y + (size/2 - 1), size/2);
            lsolve(x, y, size/2);
            lsolve(x, y+size/2, size/2);
            lsolve(x+size/2, y+size/2, size/2);
            return true;
        } else { return false }
    }
}

var resButton = document.getElementById('solveLButton');
resButton.addEventListener('click', function(evt) {
    calls = 0;
    totalFilled = 0;
    totalVisited = 0;
    colorIncrement = 255 / ((numberPerSide*numberPerSide - 1) / 3);
    lsolve(0,0,numberPerSide);
    var p = 0;
}, false);