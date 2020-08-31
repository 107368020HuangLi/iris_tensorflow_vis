let labellist = [
    'Setosa',
    'Versicolor',
    'Virginica'
]
let xs,ys;

let epp ;
let hidden_num;

async function show(){
    tfvis.visor();
}

async function myFunction(){
    const rbs = document.querySelectorAll('input[name="choice"]');
        // let selectedValue;
        for (const rb of rbs) {
            if (rb.checked) {
                epp = rb.value;
                break;
            }
        }
        //alert(selectedValue);
        console.log("epochs:"+epp);
}

async function myFunction2(){
    const rbs2 = document.querySelectorAll('input[name="Hidden"]');
        // let selectedValue;
        for (const rb2 of rbs2) {
            if (rb2.checked) {
                hidden_num = rb2.value;
                break;
            }
        }
        //alert(selectedValue);
        console.log("Hidden:"+hidden_num);
        //document.write("Hidden:"+hidden_num);      
}


async function train(){
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

                xs = tf.tensor2d(Data);

                let labelTensor = tf.tensor1d(label,'int32');
                ys = tf.oneHot(labelTensor,3);
                labelTensor.dispose();  //????????
                

                model = tf.sequential();

                let hidden1 = tf.layers.dense({
                    units: 16,
                    activation: 'sigmoid',
                    inputDim: 4
                })

                let hidden2 = tf.layers.dense({
                    units: 8,
                    activation: 'sigmoid',
                })

                let hidden3 = tf.layers.dense({
                    units: 8,
                    activation: 'sigmoid',
                })

                let output = tf.layers.dense({
                    units: 3,
                    activation: 'softmax',
                })

                model.add(hidden1);
                
                if(hidden_num == 2){
                    model.add(hidden2);
                }
                
                if(hidden_num == 3){
                    model.add(hidden3);
                }


                model.add(output);

                const lr = 0.2;
                const optimizer = tf.train.adam();

                model.compile({
                optimizer: optimizer,
                loss: 'categoricalCrossentropy',
                metrics:['accuracy']
                });

                train2();
            })
        }).catch(function(e){
            console.log('error:' + e.toString());
        });    

        async function train2(){ 
            await model.fit(xs,ys, {
                batchSize: 15,
                epochs: epp,
                validationSpilt: 0.1,
                suffle: true,
                callbacks: tfvis.show.fitCallbacks(
                    
                    {name:'顯示训练過程'},
                    ['loss','acc'],  // 度量单位，这里看损失参数
                )
            });  
        } 
}

async function save(){ 
    await model.save('downloads://my-model');
}

async function load(){ 
    const model = await tf.loadLayersModel('localstorage://my-model-1');
    const final_output = model.predict(tf.tensor2d([5,4,2,1],[1,4])); // 预测数字5
    
    console.log(final_output.dataSync());  // 输出：9.982701301574707
}
