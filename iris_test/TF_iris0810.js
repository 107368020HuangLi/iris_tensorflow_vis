let xs,ys;
let Data;
let label;
let chart;
let num;
let test_num = [];
let test_loss = [];
const epochsLogs = [];

let labellist = [
    'Setosa',
    'Versicolor',
    'Virginica'
]

function parseData(createGraph) {
	Papa.parse("", {
		download: true,
			complete: function(results) {
			createGraph(results.data);
		}
	});
}


function loadJSON(){
    fetch('csvjson.json')
        .then(function(response){
            response.json().then(function(csvjson){
            
            Data = [];
            label = [];
            for(let record of csvjson){
                let col = [record.sepal_length, record.sepal_width, record.petal_length, record.petal_width];
                Data.push(col);
                label.push(labellist.indexOf(record.variety));
            }
            model();
        })
    }).catch(function(e){
    console.log('error: ' + e.toString());
});
}

        function model(){
            xs = tf.tensor2d(Data);
            let labelTensor = tf.tensor1d(label,'int32');
            ys = tf.oneHot(labelTensor,3);
            labelTensor.dispose();

            model = tf.sequential();

            let hidden1 = tf.layers.dense({
                units: 16,
                activation: 'sigmoid',
                inputDim: 4
            })

            let output = tf.layers.dense({
                units: 3,
                activation: 'softmax',
            })

            model.add(hidden1);
            model.add(output);

            const lr = 0.2;
            const optimizer = tf.train.sgd(lr);

            model.compile({
                optimizer: optimizer,
                loss: 'categoricalCrossentropy',
                metrics:['accuracy']
            });

            train();
        }
   
    async function train(){
        const options = {
            epochs:30,
            validationSpilt: 0.1,
            suffle: true,
            callbacks: {
                onTrainBegin: () => console.log('Train Start'),
                onTrainEnd: () => console.log('Train End'),
                onEpochEnd: (num, logs) => {
                    console.log('Epoch:' + num);
                    console.log('Loss:' + logs.loss);
                    //document.write('Epoch:' + num);
                    //document.write(num);
                    
                    test_num.push(num);
                    test_loss.push(logs.loss);

                    epochsLogs.push(logs.loss);
                    //document.write(test_num[num]+"\t");
                    //document.write(test_num.length);
                    //document.write("\n");
                    //document.write(test_loss[0]+"\t");
                        
                   // document.write(test_num[num]);
                    //document.write("/n");
                    
                    //console.log('Epoch:' + test_num);
                    
                    // test_num[num], test_loss[num]
                    
                    // test.push(logs.loss);
                    //document.write("Loss: "+ logs.loss);
                    //console.log(test_num);
                    //console.log(test);
                    //console.log(test_num);
                    
                    // const F_loss = epochsLogs.map((logs, num) => ({
                    //     x: num,
                    //     y: logs.loss
                    // }));

                    //document.write(num); 

                    if(num == options.epochs - 1){
                        //test_num.push(num-4);
                        //test_loss.push(logs.loss);
                        
                        //document.writeln((test_num));
                        //document.writeln((num));
                        //document.writeln((test_loss.length));
                        //document.writeln(test_loss);
                        
                    
                        chart = c3.generate({
                        data: {
                            x: 'epochs',
                            columns: [
                                ['epochs', test_num[num]],
                                ['Loss', test_loss[num]]	
                            ]
                        },
                        axis: {
                            x: {
                                type: 'value',			
                            }
                        }
                        });    
                    }
                    

                    // const data = {
                    //     values: [F_loss],
                    //     series: ['loss']
                    // };

                    //document.write(F_loss[i]);

                    // chart = c3.generate({
                    //     data: {
                    //         x: 'epochs',
                    //         columns: [
                    //             // ['epochs', num],
                    //             // ['Loss', logs.loss]	
                    //             // ['epochs', num],
                    //             // ['Loss', F_loss.y]
                    //         ]
                    //     },
                    //     axis: {
                    //         x: {
                    //             type: 'value',			
                    //         }
                    //     }
                    // });

                    }	
                }
            }
        return await model.fit(xs,ys,options);
    }

