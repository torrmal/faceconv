

iterator = 'getGenderFullColorData32';
inputWH = 32; // the input width and height 32x32, iamges will be scaled to this dimension


layer_defs = [];
layer_defs.push({type:'input', out_sx:inputWH, out_sy:inputWH, out_depth:3});
layer_defs.push({type:'conv', sx:10, filters:4, stride:3, pad:2, activation:'relu'});
layer_defs.push({type:'fc', filters:100, activation:'relu'});
//layer_defs.push({type:'softmax', num_classes:2});
layer_defs.push({type:'regression', num_neurons:1});

trainerParams = {method:'adadelta', batch_size:10, l2_decay:0.001};