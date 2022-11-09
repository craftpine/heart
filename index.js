'use strict';

const maxScale         = 3;
const scaleStep        = .001;
const width            = 400;
const height           = 400;
const heartsCount      = 20;
const newHeartInterval = 250;
const colourList       = [
  "#9925fb",
  "#cb27fc",
  "#fd28fc",
  "#22cccb",
  "#1aa5cb",
  "#137dca"
];

// https://stackoverflow.com/a/58333880
function drawHeart(ctx, fromx, fromy,lw,hlen,color) {
  var x = fromx;
  var y = fromy;
  var width = lw ;
  var height = hlen;

  ctx.save();
  ctx.beginPath();
  var topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    x, y, 
    x - width / 2, y, 
    x - width / 2, y + topCurveHeight
  );

  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2, y + (height + topCurveHeight) / 2, 
    x, y + (height + topCurveHeight) / 2, 
    x, y + height
  );

  // bottom right curve
  ctx.bezierCurveTo(
    x, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + (height + topCurveHeight) / 2, 
    x + width / 2, y + topCurveHeight
  );

  // top right curve
  ctx.bezierCurveTo(
    x + width / 2, y, 
    x, y, 
    x, y + topCurveHeight
  );

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

class Heart {
  constructor(scale = 0, colour = 'red') {
    this.s = scale;
    this.c = colour;
    this.x = width/2;
    this.h = height * scale; // size
    this.y = height/2 - (this.h !== 0 ? this.h / 2 : 0);
    this.i = scaleStep;
  }
  
  step() {
    this.s += this.i;  // increase scale
    this.i += 0.00005; // increase scale step
    this.h = height * this.s; // calc new height
    this.y = height / 2 - (this.h !== 0 ? this.h / 2 : 0); // calc new pos
  }
  
  draw(context) {
    if (this.s === 0)
      return;
    drawHeart(context, this.x, this.y, this.h, this.h, this.c);
  }
}

class ColourWheel {
  constructor(colors) {
    this.i = 0;
    this.c = colors;
  }
  
  next() {
    let c = this.c[this.i++];
    this.i %= this.c.length;
    return c;
  }
}

window.addEventListener('load', function() {
  var canvas  = document.getElementById("animation"),
      context = canvas.getContext("2d"),
      colours = new ColourWheel(colourList),
      hearts  = [];
  
  context.fillStyle = 'rgba(38, 38, 38, 1)';
  context.fillRect(0, 0, width, height);
  //context.globalCompositeOperation = "difference"; 
  //context.globalCompositeOperation = "color"; 
  
  let lastTime = 0;
  +(function animation(time) {
    requestAnimationFrame(animation);
    
    // step all hearts
    for (let h of hearts) h.step();
    
    // remove all hearts that grew too big
    hearts = hearts.filter(h => h.s <= maxScale * 1.5);
    
    // add new heart when time is due
    if (time - lastTime >= newHeartInterval) {
      lastTime = time;
      hearts.push(new Heart(0, colours.next()));
    }
    
    // sort by biggest heart
    hearts.sort((a, b) => b.s - a.s);
    
    // draw hearts
    for (let h of hearts) h.draw(context);
  }());
});