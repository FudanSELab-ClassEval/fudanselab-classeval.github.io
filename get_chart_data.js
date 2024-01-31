fetch('pass_at_k_result.json')
    .then(response => response.json())
    .then(data => {
        // Extract model names and performances from the nested structure
        const modelNames = Object.keys(data.pass_1_greedy).map(modelKey => {
            // Extracting the common modelname part before the first underscore
            return modelKey.split('_')[0];
        });

        // Remove duplicate model names
        const uniqueModelNames = Array.from(new Set(modelNames));

        // Construct chartData
        var chartData = {
            labels: uniqueModelNames,
            datasets: ['H', 'C', 'I'].map((suffix, index) => {
                var label = ''
                if (suffix == 'H') {
                    label = 'Holistic Generation'
                } else if (suffix == 'C') {
                    label = 'Compositional Generation'
                } else {
                    label = 'Incremental Generation'
                }

                return {
                    label: label, // Removing the leading underscore for label
                    data: uniqueModelNames.map(modelName => {
                        // 构建正则表达式
                        const regexPattern = new RegExp(`^${modelName}_.*?_${suffix}_.*?$`);
                        const matchingKey = Object.keys(data.pass_1_greedy).find(key => regexPattern.test(key));
                        return matchingKey ? data.pass_1_greedy[matchingKey]['class_success']*100 : null;
                    }),
                    backgroundColor: suffix=='H'?`orange`:(suffix=='C')?`lightgreen`:`lightblue`,
                    // borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                    borderColor: suffix=='H'?`orangered`:(suffix=='C')?`green`:`darkblue`,
                    borderWidth: 1
                }
            }
            )
        };


    // Get the canvas element
    var ctx = document.getElementById('chart').getContext('2d');

    // Create a line chart
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    grid: {
                        display: false // 不显示y轴网格线
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 70,
                    title: {
                        display: true,
                        text: 'Class Level Pass@1 Greedy',
                        font: {
                            family: 'Times',
                            size: 20,
                            style: 'normal',
                            lineHeight: 1.2
                        },
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            maintainAspectRatio: false // Allow the chart to be responsive
        }
    });
})
.catch(error => console.error('Error fetching JSON:', error));
