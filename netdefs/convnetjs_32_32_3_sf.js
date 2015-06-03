

iterator = 'getGenderFullColorData32';
inputWH = 32; // the input width and height 32x32, iamges will be scaled to this dimension


layer_defs = [];
layer_defs.push({type:'input', out_sx:32, out_sy:32, out_depth:3});
layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'softmax', num_classes:2});
//layer_defs.push({type:'regression', num_neurons:1});

trainerParams = {method:'adadelta', batch_size:10, l2_decay:0.001};



dataIterator = function(trainData, net, trainer, logger){
	
	console.log('real = '+trainData.targetData);
	var prediction = net.forward(trainData.vol);
	var pred = (prediction.w[0]>prediction.w[1])?0:1;
	
	var err =  Math.abs(pred-trainData.targetData);
	
	console.log('pred = '+pred);
	console.log('err  = '+err);
	console.log('pred.cert  = '+prediction.w[pred]);
	
	trainer.train(trainData.vol, Math.round(trainData.targetData));
	logger(err);
    return true;
}