// import * as tfvis from "@tensorflow/tfjs-vis";
// import "@tensorflow/tfjs-node"
// import "@tensorflow/tfjs-vis"
// const tfjs = require("@tensorflow/tfjs");
// const tfvis = require("@tensorflow/tfjs-vis");
//import * as tfvis from './node_modules/@tensorflow/tfjs-vis';

//tfvis.visor();
// const renderBarChart = () => {
//     const data = [
//         { index: 0, value: 50 },
//         { index: 1, value: 100 },
//         { index: 2, value: 150 },
//        ];
     
//      // Render to visor
//      const surface = { name: 'Bar chart', tab: 'Charts' };
//      tfvis.render.barchart(surface, data);
//   };
  
//   renderBarChart();

//import * as tf from '@tensorflow/tfjs';

// 0维数组
// const t0 = tf.tensor(1); 
// t0.print();
// console.log(t0);

// // 1维数组
// const t1 = tf.tensor([1,2]);
// t1.print();
// console.log(t1);

// // 2维数组
// const t2 = tf.tensor([[1],[3]]);
// t2.print();
// console.log(t2);

// const input = [1,2,3,4];  // 输入
// const w = [[1,2,4,1],[3,1,1,2],[2,3,2,4],[1,3,3,4]]; // 神经元数组，里面是相应的权重
// const output = [0,0,0,0];

// for(let i=0; i < w.length; i++){
//     for(let j = 0; j<input.length; j++){
//         output[i] += input[j]*w[i][j];
//     }
// }
// console.log(output);

// // 使用Tensor来实现
// tf.tensor(w).dot(tf.tensor(input)).print();


window.onload = async () =>{
  const xs = [1,2,3,4];
  const ys = [2,4,6,8];

  // tfvis.render.scatterplot(
  //     { name:'线性回归训练集'},
  //     { values:xs.map((x,i) => ({x,y:ys[i]}))},
  //     {xAxisDomain: [0,5], yAxisDomain: [0,9]},  // 设置x轴y轴的范围
  // );

  const model = tf.sequential();  // 初始化一个模型
  model.add(tf.layers.dense({units:1,inputShape:[1]}));    // 给模型添加层，全连接层；units:神经元的个数，inputShape：输入形状 
  model.compile({loss: tf.losses.meanSquaredError, optimizer:tf.train.sgd(0.1)}); // 设置loss:损失函数，均方误差; 设置优化器：optimizer

  // 把数据转换为Tensor
  const inputs = tf.tensor(xs);
  const labels = tf.tensor(ys);
  await model.fit(inputs,labels, {
      batchSzie:1,  // 每次模型要学习的样本设置为：1
      epochs: 100,   // 迭代整个训练的次数
      callbacks: tfvis.show.fitCallbacks(
          {name:'训练過程'},
          ['loss'],  // 度量单位，这里看损失参数
      )
  }); 

  const output = model.predict(tf.tensor([1])); // 预测数字5
  console.log(output.dataSync()[0]);  // 输出：9.982701301574707
}