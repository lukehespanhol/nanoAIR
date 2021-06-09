/*
	Disabling canvas scroll for better experience on mobile interface.
	Source: 
		User 'soanvig', answer posted on Jul 20 '17 at 18:23 at:
		https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element 
*/
var HOST = window.location.origin;

document.addEventListener('touchstart', function(e) {
    document.documentElement.style.overflow = 'hidden';
});
document.addEventListener('touchend', function(e) {
    document.documentElement.style.overflow = 'auto';
});


///////////////////////////////////////////////
//
// MAIN SECTION
// 
///////////////////////////////////////////////

let linkBotsAndClots;
let linkEmergence;
let linkNanobotrace;
let linkRolling;
let linkSmoothRolling;

function setup() {
 	createCanvas(windowWidth, windowHeight, WEBGL);

	linkBotsAndClots = createA(HOST + "/botsAndClots/", "Bots and Clots", "_blank");      
	linkBotsAndClots.position(120, 80);

	linkEmergence = createA(HOST + "/emergence/", "Emergence", "_blank");      
	linkEmergence.position(120, 120);

	linkNanobotrace = createA(HOST + "/nanobotrace/", "Nanobot Race", "_blank");
	linkNanobotrace.position(120, 160);

	linkRolling = createA(HOST + "/rolling/", "Rolling", "_blank");      
	linkRolling.position(120, 200);

	linkSmoothRolling = createA(HOST + "/smoothRolling/", "Smooth Rolling", "_blank");      
	linkSmoothRolling.position(120, 240);
}

function draw() {
	background(sin(frameCount*0.01)*100 + 155, cos(frameCount*0.01)*100 + 155, sin(frameCount*0.01)*100 + 155);
}