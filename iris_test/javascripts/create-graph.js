/*
 * Parse the data and create a graph with the data.
 */
function parseData(createGraph) {
	Papa.parse("", {
		download: true,
			complete: function(results) {
			createGraph(results.data);
		}
	});
}

function createGraph(data) {

	var chart = c3.generate({
		data: {
			x: 'x',
			columns: [
				['x', '1', '2', '3'],
				['data1', 1, 2, 3]			
			]
		},
		axis: {
			x: {
				type: 'value',			
			}
		}
	});
	
	setTimeout(function () {
		chart.flow({
			columns: [
				['x', '3', '4','5'],
				['data1', 3, 4, 5]
			],
			duration: 1000,
			done: function () {
				chart.flow({
					columns: [
						['x', '6', '7', '8', '9'],
						['data1', 6, 7, 8, 9]
					],
					length: 0,
					duration: 1000,
					done: function () {
						chart.flow({
							columns: [
								['x', '10', '11'],
								['data1', 10, 11]
							],
							length: 2,
							duration: 1500,
							done: function () {
								chart.flow({
									columns: [
										['x', '12', '13'],
										['data1', 12, 13]
									],
									to: '12',
									duration: 1000,
								});
							}
						});
					}
				});
			},
		});
	}, 1000);
}	



parseData(createGraph);
