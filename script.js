(function(){

	var undoStack = [];
	var redoStack = [];

	var $canvas = $('#my-canvas');
	var canvas = $canvas[0];
	var context = canvas.getContext("2d");

	var $undoBtn = $('#undoBtn');
	var $redoBtn = $('#redoBtn');

	var updateButtons = function() {
			$undoBtn.prop('disabled', undoStack.length === 0);
			$redoBtn.prop('disabled', redoStack.length === 0);
	};
	updateButtons();

	var paint = false;

	$canvas.mousedown(function(e){
		redoStack = [];
		updateButtons();

	  var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;
	  paint = true;

		undoStack.push({
			arrX: [mouseX],
			arrY: [mouseY]
		});
		redraw();
	});

	$canvas.mousemove(function(e){
		if(!paint)
			return;

		var move = undoStack[undoStack.length-1];

		var mouseX = e.pageX - this.offsetLeft;
	  var mouseY = e.pageY - this.offsetTop;

		move.arrX.push(mouseX);
		move.arrY.push(mouseY);

		redraw();
	});

	$canvas.mouseup(function(e){
	  paint = false;
		updateButtons();
	});

	$canvas.mouseleave(function(e){
	  paint = false;
	});

	function undo(){
		var move = undoStack.pop();
		redoStack.push(move);
		redraw();
		updateButtons();
	}

	function redo(){
		var move = redoStack.pop();
		undoStack.push(move);
		redraw();
		updateButtons();
	}

	function redraw(){
	  context.clearRect(0, 0, canvas.width, canvas.height);

	  context.strokeStyle = "#df4b26";
	  context.lineJoin = "round";
	  context.lineWidth = 5;

		undoStack.forEach(function(el){
			for(var i=0; i < el.arrX.length; i++) {
		    context.beginPath();
				if(i){
	      	context.moveTo(el.arrX[i-1], el.arrY[i-1]);
	     	}else{
	       	context.moveTo(el.arrX[i]-1, el.arrY[i]);
	     	}
			  context.lineTo(el.arrX[i], el.arrY[i]);
			  context.closePath();
			  context.stroke();
		  }
		})
	}

	// ========================================================

	$undoBtn.on('click', function() {
		undo();
	});

	$redoBtn.on('click', function() {
		redo();
	});

})();
