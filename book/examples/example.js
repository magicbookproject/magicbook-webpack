// First we need to set up the variables
// to be used throughout the sketch.
var x = 100;
var y = 100;
var xspeed = 1;
var yspeed = 3.3;
var myName = "Rune Madsen";

// Remember how Processing works? The setup function
// is executed once when the sketch starts.
function setup() {
  createCanvas(640, 360);
  background(255);
} // End

function draw() {
  background(255);

  // Move the ball according to its speed.
  x = x + xspeed;
  y = y + yspeed;

  stroke(0);
  fill(175);

  // Display the ball at the location (x,y).
  ellipse(x,y,16,16);
}
