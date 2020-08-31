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
                }	
            }
        }
        return await model.fit(xs,ys,options);
    }

