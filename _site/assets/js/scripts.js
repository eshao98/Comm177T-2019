// Full JavaScript Code

var link = document.getElementById("link");
var hover = document.getElementById("img");
// Setting up variables to hold positions
var position = {x:0, y:0};
var mouse = {x:0, y:0};

document.addEventListener("mousemove", getMousePosition);

// Event handling functions

// Takes in event e parameter; mouse movement is tracked
function getMousePosition(e){
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

// Image position on hover
function trailMousePosition(){
	// Setting up variables 
	var distanceX = mouse.x - position.x;
	var distanceY = mouse.y - position.y;
	position.x+=distanceX/10;
	position.y+=distanceY/10;

	// Manages how the image is positioned relative to mouse hover
	hover.style.left = position.x + 100 + "px";
	hover.style.top = position.y + 100 + "px";

	hover_image.setAttribute("class", "move")
}

// Smooth out the transition, making it slower, "floaty"
setInterval(trailMousePosition, 50);

// Manages basic hiding and displaying of the image on mouse hover
link.onmouseover = function(){
img.style.display = "block";
}
link.onmouseout = function(){
img.style.display = "none";
}