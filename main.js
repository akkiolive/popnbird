(function(){
	//element and context
	var stage = document.getElementById('stage'); //element
	var ctx; //context
	

	//keydown 
	//document.onkeydown = keydown;
	//stage.setAttribute('tabindex', 0); // focusしている時のみ、keyDown,up を有効に
	//stage.addEventListener('keydown', keydown, {passive:false});
	document.onkeydown = keydown;

	//canvas size
	var width = 480;
	var height = 260; 

	//return if element not exist
	if(typeof stage.getContext === 'undefined'){
		return;
	}

	//create context instance
	ctx = stage.getContext('2d');

	//setting width and height
	stage.width = width;
	stage.height = height;
	
	//adopt high resolution
	stage.style.width = width + 'px';
	stage.style.height = height + 'px';

	class Point{
		constructor(x, y){
			this.x = x;
			this.y = y;
		}
	}

	class Interapter{
		constructor(x, y, w, h){
			this.x = x;
			this.y = y;
			this.h = h;
			this.w = w;
			this.left = x;
			this.down = y+h;
			this.right = x+w;
			this.up = y;
		}
	}

	class Map{
		constructor(){
			this.d = 0;
			this.is = [];
			this.is.push(new Interapter(width-50*3, height*0.5, 10, height*0.5));
			this.is.push(new Interapter(width-50*2, height*0.5, 10, height*0.5));
			this.is.push(new Interapter(width-50*1, height*0.5, 10, height*0.5));
			this.is.push(new Interapter(width-50*0, height*0.5, 10, height*0.5));
		}

		createMap(){
			var i = new Interapter(width, height*0.5, 10, height*0.5);
			this.is.push(i);
		}

		moveMap(){
			for(var i of this.is){
				i.x -= 1;
			}
			if(this.is[0].right==0){
				this.is.shift();
			}
		}

		draw(){
			for(var i of this.is){
				ctx.beginPath();
				ctx.rect(i.x, i.y, i.w, i.h);
				ctx.stroke();
			}
		}
	}

	var map = new Map();

	class Player{
		constructor(){
			this.x = width*0.2;
			this.y = height*0.5;
			this.r = 3;
			this.color = "red";
			this.gravity = 0.05;
			this.force = 0;
			this.a = this.gravity - this.force;
			this.y_prev = this.y-1;
			this.y0 = this.y;
			this.v0 = 0;
			this.t0 = 0;
			this.jumppower = 1.5;
		}

		draw(){
			ctx.beginPath();
			ctx.fillStyke = this.color;
			ctx.rect(this.x, this.y, this.r, this.r);
			ctx.fill();
			ctx.stroke();
		}

		fall(){
			var t = map.d - this.t0;
			this.y = 0.5*this.gravity*t*t + this.v0*t + this.y0;
		}

		jump(){
			console.log("jump");
			this.y0 = this.y;
			this.t0 = map.d;
			this.v0 = -this.jumppower;
		}
	}

	var p = new Player();


	class Game{
		start(){
			setInterval(this.animate, 10);
		}

		animate(){
			ctx.clearRect(0,0,width,height);
			p.fall();
			p.draw();
			map.d += 1;
			if(map.d%50==0)map.createMap();
			map.moveMap();
			map.draw();
			if(collision()) console.log("collision! game over.");
		}
	}

	var game = new Game;
	game.start();

	function collision(){
		if(p.y<0 || height<p.y) return true;
		for(var i of map.is){
			if(i.left<=p.x && p.x<=i.right){
				if(i.up<=p.y && p.y<=i.down){
					return true;
				}
			}
		}
		return false;
	}

	function keydown(){
		p.jump();
	}

})();