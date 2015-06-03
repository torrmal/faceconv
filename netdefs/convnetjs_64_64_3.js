

iterator = 'getGenderFullColorData64';
inputWH = 64; // the input width and height 32x32, iamges will be scaled to this dimension


layer_defs = [];
layer_defs.push({type:'input', out_sx:64, out_sy:64, out_depth:3});
layer_defs.push({type:'conv', sx:5, filters:16, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
layer_defs.push({type:'conv', sx:5, filters:20, stride:1, pad:2, activation:'relu'});
layer_defs.push({type:'pool', sx:2, stride:2});
//layer_defs.push({type:'softmax', num_classes:2});
layer_defs.push({type:'regression', num_neurons:1});

trainerParams = {method:'adadelta', batch_size:10, l2_decay:0.001};



dataIterator = function(trainData, net, trainer, logger){
	
	console.log('real = '+trainData.targetData);
	var prediction = net.forward(trainData.vol);
	var err =  Math.abs(prediction.w[0]-trainData.targetData);
	
	console.log('pred = '+((prediction.w[0]>0.5)?1:0));
	console.log('err  = '+err);
	
	trainer.train(trainData.vol, [trainData.targetData]);
	logger(err);
    return true;
}