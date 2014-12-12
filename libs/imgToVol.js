

imgToVol = {
	// get iamge Data from src and scale to maxWidth
	getImageDataFromSrc: function(src, maxWidth, limits) {
		var img = new Image;
		img.src = src;
		var width = img.width;
		var height = img.height;
		var canvas = new Canvas(maxWidth, maxWidth);
		var ctx = canvas.getContext('2d');
		var nWidth = width > height ? maxWidth: parseInt(maxWidth*width/height);
		var nHeight = height > width ? maxWidth: parseInt(maxWidth*height/width);
		ctx.drawImage(img, 0, 0, nWidth, nHeight);
		var imageData = ctx.getImageData(0, 0, maxWidth, maxWidth);
		var data = imageData.data;
		return {data: data, width: width, height: height};
	},
	// generate NN input Volume from image data
	getVolumeFromImageData: function(data, volumeW) {

	    var vol = new convnetjs.Vol(volumeW,volumeW,3,0.0);

		for(var c=0;c<3;c++) {
			for(var x=0;x<volumeW;x++) {
			  for(var y=0;y<volumeW;y++) {
			  	var ix = 4*(x + y*volumeW) + c;
			    vol.set(y,x,c,data[ix]/255.0-0.5);
			  }
			}
		}

		return vol;
	}
};
