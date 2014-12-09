


dataCollector = {
	drawPrediction: function(prediction, volumeW, label){
		var ret = [];
		for(var j=0; j<volumeW*volumeW; j++) {
			ret[j] = Math.abs(parseInt(prediction.w[''+j]));
		}
		this.drawMask(ret, volumeW, label);
	},
	drawMask: function(mask, volumeW, label) {
		console.log('\n'+label+':\n');
		for (var row =0; row<volumeW; row++) {
			var str = '';
			for (var col=0; col<volumeW; col++) {

				str = str+' '+(mask[col+row*volumeW]?mask[col+row*volumeW]:' ') ;
			}
			console.log(str);
		}
	},

	createTargetFromLimits: function(limitsData, volumeW) {
		var newW = limitsData.width0 > limitsData.height0? volumeW: parseInt(volumeW*limitsData.width0/limitsData.height0);
		var newH = limitsData.height0 > limitsData.width0? volumeW: parseInt(volumeW*limitsData.height0/limitsData.width0);
		var scaleW = newW/limitsData.width0;
		var scaleH = newH/limitsData.height0;
		var ret = [];
		// fill it with 0;
		for (var j =0; j < volumeW * volumeW; j++) {
			ret[j] = 0;
		}
		// get scaledBoxes
		var scaledBoxes = [];

		for (var box_i = 0; box_i < limitsData.faces.length; box_i++) {

			var x = Math.floor(limitsData.faces[box_i].x*scaleW*1.15);
			var y = Math.floor(limitsData.faces[box_i].y*scaleH*1.15);
			var x1 = Math.ceil(x+limitsData.faces[box_i].w*scaleW*0.85);
			var y1 =Math.ceil(y+limitsData.faces[box_i].h*scaleH*0.85);
			scaledBoxes[box_i] = {x:x, y:y, x1:x1, y1:y1};
		}

		// fill the boxes

		for (var box_i = 0; box_i < limitsData.faces.length; box_i++) {
			for(var x=scaledBoxes[box_i].x; x<=scaledBoxes[box_i].x1; x++) {
				for(var y=scaledBoxes[box_i].y; y<=scaledBoxes[box_i].y1; y++) {
					ret[x+y*volumeW] = box_i+1;
				}
			}
		}

		return ret;

	},

	// this function gets a random image from what points the json file in @listLocation
	// it rezises the image to the desired @volumeW x @volumeW,
	// it also gets generates a mask of size @targetVolumeW x @targetVolumeW based on what is in the faces field in the json entry
	// it then call the function @callback, passing the data that it needs to make a training
	getImageDataFromList:function(listLocation, callback, volumeW, targetVolumeW) {

		var set = require(listLocation);

		//var volumeW = 32; the input width
		//var targetVolumeW = 16; the mask width

		for (;;) {
			var j = Math.floor(Math.random() * training_data.length);
			// get one random sample from the json data
			var tdata = training_data[j];
			var image = tdata['image']; // the the image name
			// create a NN input volume from the image
			var imageData = imgToVol.getImageDataFromSrc('images/'+image, volumeW);
			// remember origianl dimensions, which we need to calculate what to resize the faces squares in the json training data
			tdata.width0 = imageData.width;
			tdata.height0 = imageData.height;
			tdata.targetVolumeW = targetVolumeW;
			tdata.targetData = this.createTargetFromLimits(tdata, targetVolumeW);
			tdata.vol = imgToVol.getVolumeFromImageData(imageData.data, volumeW);
			tdata.imageData = imageData.data;

		    if(!callback(tdata)){
		    	console.log('ok');
		    	break;
		    }
		}
	}
}

