class Button {
	constructor(label, x, y, width, height, img = null, imgHover = null, action = null) {
		this.label = label;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
		this.imgHover = imgHover;
		this.action = action;
	}
  
	display() {
	  	let hovering = this.isHovered();
	  	if (this.img && this.imgHover) {
			// if hovering use hover image else use default
			// next 2 arguments are the position on the page 
			// last 2 arguments are the size
			image(hovering ? this.imgHover : this.img, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		} 
		else {
			fill(hovering ? color(100, 150, 255) : color(200));
			rectMode(CENTER);
			rect(this.x, this.y, this.width, this.height, 10);
			fill(0);
			textSize(16);
			text(this.label, this.x, this.y);
	  	}
	}
  
	isHovered() {
	  	return (
			mouseX > this.x - this.width / 2 &&
			mouseX < this.x + this.width / 2 &&
			mouseY > this.y - this.height / 2 &&
			mouseY < this.y + this.height / 2
	  	);
	}
}  