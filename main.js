// including required libraries

convnetjs = require("convnetjs");
Canvas = require('canvas');
Image = Canvas.Image;

require('./libs/dataCollector.js');
require('./libs/imgToVol.js');



console.log('starting convnetjs trainer...');

var inputWH = 32 // the input width and height 32x32, iamges will be scaled to this dimension
var maskWH = 16 // the output of the NN will be a mask of 16x16

// defining the neural network, you can play with this definition
layer_defs = [];
layer_defs.push({type:'input', out_sx:inputWH, out_sy:inputWH, out_depth:3});
layer_defs.push({type:'conv', sx:10, filters:4, stride:3, pad:1, activation:'relu'});
layer_defs.push({type:'conv', sx:10, filters:4, stride:3, pad:2, activation:'relu'});
layer_defs.push({type:'regression', num_neurons:maskWH*maskWH});


net = new convnetjs.Net();
net.makeLayers(layer_defs);

// defining the trainer
trainer = new convnetjs.SGDTrainer(net, {method:'adadelta', batch_size:4, l2_decay:0.0001});


// function to be called on every iteration, it takes an image and it learns from it
var dataIterator = function(trainData){

	var prediction = net.forward(trainData.vol);
	// draw target and prediction masks so that we can visualize how accurate is the NN predicting the mask
	// draw the target
	dataCollector.drawMask(trainData.targetData, maskWH, 'target');
	// draw the prediction
	dataCollector.drawPrediction(prediction, maskWH, 'prediction');
	// teach the target
	trainer.train(trainData.vol, trainData.targetData);
	// draw a separator
	console.log('======');
    return true;
}

// iterate over all images in json/all.js and learn how to create a mask
dataCollector.getImageDataFromList('json/all.js', dataIterator, inputWH, maskWH);


