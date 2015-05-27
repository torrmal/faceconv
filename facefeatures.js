// including required libraries

convnetjs = require("convnetjs");
fs = require('fs');
md5= require('md5');
Canvas = require('canvas');
Image = Canvas.Image;
var argv = require('minimist')(process.argv.slice(2));

if(!argv.net){
	console.log("You must specify -net\n");
	return;
}

try {
	require('./netdefs/'+argv.net+'.js');
}
catch(e) {
	console.log('no net named '+argv.net);
	return;
}


require('./libs/dataCollector.js');
require('./libs/imgToVol.js');

console.log('starting convnetjs trainer...');

net = new convnetjs.Net();
net.makeLayers(layer_defs);

var errCount = 1;

var iteration = 0;
var fileSubName = argv.net+md5(JSON.stringify(layer_defs)+iterator);
var fileName = 'trained/'+fileSubName+'.json';
var resultFileName = 'results/'+fileSubName;

try {
	var content = fs.readFileSync(fileName,{encoding:'utf8'});
	var json = JSON.parse(content);
	net = new convnetjs.Net(); // create an empty network
	net.fromJSON(json); 
	console.log('net preloaded');
	var stats = fs.readFileSync(resultFileName,{encoding:'utf8'});
	stats = stats.split(':');
	errCount = parseFloat(stats[1]);
}
catch(e){
	console.log(e);
	console.log('no-pretrained-nn');
}

trainer = new convnetjs.SGDTrainer(net, trainerParams);

// function to be called on every iteration, it takes an image and it learns from it
var dataIterator = function(trainData){
	
	iteration ++;
	if(iteration >= 20) {
		var json = net.toJSON();
		json = JSON.stringify(json);

		fs.writeFileSync(fileName, json); 
		var resString = Math.floor(Date.now())+':'+errCount+"\n";
		fs.writeFileSync(resultFileName, resString);
		iteration = 0;
	}
	console.log('real = '+trainData.targetData);
	var prediction = net.forward(trainData.vol);
	errCount = errCount*99 + Math.abs(prediction.w[0]-trainData.targetData);
	errCount = errCount / 100; 
	console.log('pred = '+((prediction.w[0]>0.5)?1:0));
	console.log('err  = '+errCount);
	
	trainer.train(trainData.vol, [trainData.targetData]);

	console.log('======');
    return true;
}

// iterate over all images in json/all.js and learn how to create a mask
dataCollector[iterator](dataIterator);


