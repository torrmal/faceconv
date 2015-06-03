
var request = require('HTTPRequest');
Canvas = require('canvas');
Image = Canvas.Image;


dataCollector = {
	

	getGenderFullColorData32: function(callback, net, trainer, logger){

			request.get('http://sampler.rla.io/getsample', function(a,c,b){
				//console.log(a);

				console.log('got one');
				try{
					var data = JSON.parse(b);
				}
				catch(err) {
					console.log(err);
					dataCollector.getGenderFullColorData32(callback, net, trainer, logger);
					return;
				}
				var img = new Image;
				img.src = data.base64;
				console.log(img.width);
				var imageData = imgToVol.getImageDataFromSrc(data.base64, img.width);
				// remember origianl dimensions, which we need to calculate what to resize the faces squares in the json training data
				var tdata = {};
				tdata.targetData = data.sex;
				tdata.vol = imgToVol.getVolumeFromImageData(imageData.data, img.width);
				tdata.imageData = imageData.data;

			    if(!callback(tdata, net, trainer, logger)){
			    	console.log('error');
			    	
			    }
			    dataCollector.getGenderFullColorData32(callback, net, trainer, logger);
			});
			
	
		
	},

	getGenderFullColorData64: function(callback, net, trainer, logger){

			request.get('http://sampler.rla.io/getsample?dw=64', function(a,c,b){
				//console.log(a);

				console.log('got one');
				try{
					var data = JSON.parse(b);
				}
				catch(err) {
					console.log(err);
					dataCollector.getGenderFullColorData64(callback, net, trainer, logger);
					return;
				}
				var img = new Image;
				img.src = data.base64;
				console.log(img.width);
				var imageData = imgToVol.getImageDataFromSrc(data.base64, img.width);
				// remember origianl dimensions, which we need to calculate what to resize the faces squares in the json training data
				var tdata = {};
				tdata.targetData = data.sex;
				tdata.vol = imgToVol.getVolumeFromImageData(imageData.data, img.width);
				tdata.imageData = imageData.data;

			    if(!callback(tdata, net, trainer, logger)){
			    	console.log('error');
			    	
			    }
			    dataCollector.getGenderFullColorData64(callback, net, trainer, logger);
			});
			
	
		
	}

}

