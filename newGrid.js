/** Main Trominos solution file by Alec Tiefenthal and Peter Larson
 * 
*/


document.createSvg = function(tagName) {
    var svgNS = "http://www.w3.org/2000/svg";
    return this.createElementNS(svgNS, tagName);
};


var numberPerSide = 8;
var size = 10;
var pixelsPerSide = 400;

var allCol = ["#DC143C", "#00008B", "#8B008B", "#008000", "#FF8000", "#4B8A08"];

var redCodes = ["#ffb3b3","#ff4d4d","#ff0000","#990000"]
var oraCodes = ["#ffe0b3","#ffb84d","#ff9900","#995c00"]
var greCodes = ["#99ff33","#85e085","#33cc33","#33ffad"]
var bluCodes = ["#99d6ff","#0099ff","#0000ff","#004d80"]
var vioCodes = ["#e580ff","#d11aff","#8c1aff","#5900b3"]
var roygbivCodes = [redCodes,oraCodes,greCodes,bluCodes,vioCodes];
var curColor = 0;
var roygbivColor = 0;

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

var totalFilled = 0;
var colorIncrement = 0;
var lsolve = function(x, y, size, depth) {
    if(size == 2)
    {
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
                                //box2.setAttribute("fill", rgbToHex(totalFilled/3*colorIncrement, 120 + totalFilled/3*colorIncrement/2, 255))
                                // box2.setAttribute("fill", allCol[curColor]);
                                
                                //New Depth-coloring
                                box2.setAttribute("fill", roygbivCodes[depth % roygbivCodes.length][roygbivColor % roygbivCodes[depth % roygbivCodes.length].length]);                            }
                        }
                    }
                    curColor = (curColor + 1) % allCol.length;
                    return true;
                }
            }
        }
        return false;
    } else {
        var result = lsolve(x + (size/4), y + (size/4), size/2, depth + 1);
        if(result == true)
        {
            roygbivColor++;
            lsolve(x, y, size/2, depth + 2);
            lsolve(x, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y, size/2, depth + 2);
            return true;
        } else if(lsolve(x, y, size/2, depth + 1) == true)
        {
            roygbivColor++;
            lsolve(x + (size/4), y + (size/4), size/2, depth + 2);
            lsolve(x, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y, size/2, depth + 2);
            return true;
        } else if(lsolve(x, y+size/2, size/2, depth + 1) == true)
        {
            roygbivColor++;
            lsolve(x + (size/4), y + (size/4), size/2, depth + 2);
            lsolve(x, y, size/2, depth + 2);
            lsolve(x+size/2, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y, size/2, depth + 2);
            return true;
        } else if(lsolve(x+size/2, y+size/2, size/2, depth + 1) == true)
        {
            roygbivColor++;
            lsolve(x + (size/4), y + (size/4), size/2, depth + 2);
            lsolve(x, y, size/2, depth + 2);
            lsolve(x, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y, size/2, depth + 2);
            return true;
        } else if(lsolve(x+size/2, y, size/2, depth + 1)== true)
        {
            roygbivColor++;
            lsolve(x + (size/4), y + (size/4), size/2, depth + 2);
            lsolve(x, y, size/2, depth + 2);
            lsolve(x, y+size/2, size/2, depth + 2);
            lsolve(x+size/2, y+size/2, size/2, depth + 2);
            return true;
        } else { return false }
    }
}

/** This function is called to begin solving using the method proposed in the reading. 
 * This function also sets up for recursion. 
 * 
*/
var beginCSolve = function(size) {

    //This section will find the location of a defect in the grid. 
    defectX=-1;
    defectY=-1;
    numberFound = 0;
    for(var si = 0; si<size; si++){
        for(var sy = 0; sy<size; sy++){
            var box = boxArray[si][sy];
            if(box.getAttribute("filled")== "true")
            {
                defectX = si;
                defectY = sy;
                numberFound++;
            }
        }
    }
    //If there are too many or two few defects, the code will not run. 
    if(numberFound != 1)
        return false;
    csolve(0,0,size,defectX,defectY, 0);

}

/**
 * This is the recursive function used for this solution. 
 * The idea of this algorithm is that it determines which quadrant of the algorithm has the defect in it. 
 * It then places a tile in the center, so that one square is filled in each of the quadrants with no defect. 
 * Finally, it calls itself recursivly on the now defective four quadrants. 
 * 
 */
function  csolve(offsetX, offsetY, size, defectX, defectY, depth) {
    //If the size is two, then we have the base case code. We will place a single trominoe on the three empty spaces. 
    //depth = (depth + 1) % roygbivCodes.length;
    if(size == 2)
    {
        //TODO: Check logic
        //if(defectX - offsetX <= size && defectY - offsetY <= size){

            for(var k = 0; k < size; k++)
            {
                for(var l = 0; l < size; l++)
                {
                    var box2 = boxArray[k+offsetX][l+offsetY];
                    if( k+offsetX != defectX || l+offsetY != defectY){
                        if(box2.getAttribute("filled") == "true" )
                            console.log("There was a problem");
                        box2.setAttribute("filled", true);
                        box2.setAttribute("fill", roygbivCodes[depth % roygbivCodes.length][roygbivColor % roygbivCodes[depth % roygbivCodes.length].length]); //rgbToHex(totalFilled*colorIncrement, totalFilled*colorIncrement, totalFilled*colorIncrement));
                    }

                }
            }
            totalFilled++;
            roygbivColor++;
        //}
    //If the size is larger than 2, then we will call the algorithm recursivly. 
    //We will make different calls depending on the quadrant that the piece is in, but the general form is the same for all. 
    //First we place the center piece, 
    //Then we call this algorithm on the four quadrants recursively. 
    } else {
        depth++;
        if(defectX-offsetX >= size/2){
            if( defectY-offsetY >= size/2){
                //Is in bottom right corner. 

                csolve(offsetX+size/2-1, offsetY+size/2-1, 2, offsetX+size/2,offsetY+size/2, depth)
                roygbivColor = 0;
                //recursion for bottom left. 
                csolve(offsetX,offsetY+size/2,size/2,offsetX+size/2-1,offsetY+size/2, depth+1)
                //recursion for top left. 
                csolve(offsetX,offsetY,size/2,offsetX+size/2-1,offsetY+size/2-1, depth+1) 
                //recusions for bottom right. 
                csolve(offsetX+size/2,offsetY+size/2,size/2,defectX,defectY, depth+1) 
                //recursion for top right
                csolve(offsetX+size/2,offsetY,size/2,offsetX+size/2,offsetY+size/2-1, depth+1) 

          
            } else {
                //Is in top right corner
                 //Place center piece. 
                csolve(offsetX+size/2-1, offsetY+size/2-1, 2, offsetX+size/2,offsetY+size/2-1, depth)
                roygbivColor = 0;
                //recursion for bottom left. 
                csolve(offsetX,offsetY+size/2,size/2,offsetX+size/2-1,offsetY+size/2, depth+1)
                //recursion for top left. 
                csolve(offsetX,offsetY,size/2,offsetX+size/2-1,offsetY+size/2-1, depth+1) 
                //recusions for bottom right. 
                csolve(offsetX+size/2,offsetY+size/2,size/2,offsetX+size/2,offsetY+size/2, depth+1) 
                //recursion for top right
                csolve(offsetX+size/2,offsetY,size/2,defectX,defectY, depth+1)   
            }
        } else {
            if( defectY-offsetY >= size/2){
                //Is in bottom left corner. 
                csolve(offsetX+size/2-1, offsetY+size/2-1, 2, offsetX+size/2-1,offsetY+size/2, depth)
                //recursion for bottom left. 
                roygbivColor = 0;
                csolve(offsetX,offsetY+size/2,size/2,defectX,defectY, depth+1)
                //recursion for top left. 
                csolve(offsetX,offsetY,size/2,offsetX+size/2-1,offsetY+size/2-1, depth+1) 
                //recusions for bottom right. 
                csolve(offsetX+size/2,offsetY+size/2,size/2,offsetX+size/2,offsetY+size/2, depth+1) 
                //recursion for top right
                csolve(offsetX+size/2,offsetY,size/2,offsetX+size/2,offsetY+size/2-1, depth+1)  

            } else {
                //Is in top left corner

                csolve(offsetX+size/2-1, offsetY+size/2-1, 2, offsetX+size/2-1,offsetY+size/2-1, depth)
                //recursion for bottom left. 
                roygbivColor = 0;
                csolve(offsetX,offsetY+size/2,size/2,offsetX+size/2-1,offsetY+size/2, depth+1)
                //recursion for top left. 
                csolve(offsetX,offsetY,size/2,defectX,defectY, depth+1) 
                //recusions for bottom right. 
                csolve(offsetX+size/2,offsetY+size/2,size/2,offsetX+size/2,offsetY+size/2, depth+1) 
                //recursion for top right
                csolve(offsetX+size/2,offsetY,size/2,offsetX+size/2,offsetY+size/2-1, depth+1)   
            }
        }

    }
}


//This code adds an event listener to the button to solve by l mettod. 
var resButton = document.getElementById('solveLButton');
resButton.addEventListener('click', function(evt) {
    totalFilled = 0;
    colorIncrement = 255 / ((numberPerSide*numberPerSide - 1) / 3);
    lsolve(0,0,numberPerSide,0);
    var p = 0;
}, false);

//This code adds an event listener to the button to solve by the center placement mettod. 
var otherButton = document.getElementById('solveCButton');
otherButton.addEventListener('click', function(evt) {
    totalFilled = 0;
    colorIncrement = 255 / ((numberPerSide*numberPerSide - 1) / 3);
    beginCSolve(numberPerSide);
    // var box = boxArray[0][1];
    // box.setAttribute("fill", allCol[curColor]);
    }, false);

    //Button to change the size of the grid. Repeatedly doing this will 
var kButton = document.getElementById('kButton');
kButton.addEventListener('click', function(evt) {
    var input = document.getElementById('kInput');
    numberPerSide = Math.pow(2,parseInt(input.value));
    container.innerHTML = '';
    container.appendChild(grid(numberPerSide, size, pixelsPerSide, "#FFFFFF"));


    }, false);