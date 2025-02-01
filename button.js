class Button {
    constructor(label, x, y, isCircle = false) {
      this.label = label;
      this.x = x;
      this.y = y;
      this.diameter = 50; 
      this.isCircle = isCircle;
      this.fontSize = 16; 
    }
    
    display() {
      if (this.isHovered() && !settingMenu) {
        fill(100, 150, 255);
      } else {
        fill(200);
      }
      
      if (this.isCircle) {
        ellipse(this.x, this.y, this.diameter); 
      } else {
        rectMode(CENTER);
        rect(this.x, this.y, 200, 50, 10); 
      }
      
      fill(0);
      textSize(this.fontSize); 
      text(this.label, this.x, this.y);
    }
    
    isHovered() {
      if (this.isCircle) {
        let distance = dist(mouseX, mouseY, this.x, this.y);
        return distance < this.diameter / 2;
      } else {
        return (
          mouseX > this.x - 100 &&
          mouseX < this.x + 100 &&
          mouseY > this.y - 25 &&
          mouseY < this.y + 25
        );
      }
    }
  }