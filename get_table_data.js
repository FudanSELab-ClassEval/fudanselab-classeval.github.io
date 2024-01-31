// Function to create a table with data
function createTable(data, type, modelNames, model2url) {
    const tableBox = document.createElement('div');
    tableBox.classList.add('container-fluid', 'd-flex', 'flex-column', 'align-items-center', `table-${type.charAt(0)}`);
    const label = document.createElement('label');
    label.classList.add('mb-3');
    label.setAttribute('for', 'plused');
    label.textContent = type;
    tableBox.appendChild(label);

    const table = document.createElement('table');
    table.setAttribute('id', 'plused');
    table.classList.add('table', 'table-responsive', 'table-striped', 'table-bordered', 'flex-shrink-1', 'border', 'border-3');

    // Create table header
    const headerRow = document.createElement('tr');
    ['#', 'Model', 'Class Level', 'Method Level'].forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    })
    table.appendChild(headerRow);

    // Create table rows
    var idx = 1;
    const row_datas = []
    for (const modelName of modelNames) {
        const regexPattern = new RegExp(`^${modelName}_.*?_${type.charAt(0)}_.*?$`);
        const matchingKey = Object.keys(data).find(key => regexPattern.test(key));
        const class_success = matchingKey ? decimalToPercentage(data[matchingKey]['class_success']) : null;
        const func_success = matchingKey ? decimalToPercentage(data[matchingKey]['fun_success']) : null;
        row_datas.push({
            "#": idx,
            "Model": modelName,
            "Class Level": class_success,
            "Method Level": func_success
        });
        idx += 1;
    }

    row_datas.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach((value,idx) => {
            const td = document.createElement('td');
            if (idx == 1) {
                const hlink = document.createElement('a');
                hlink.textContent = value;
                hlink.href = model2url[value];
                td.appendChild(hlink)
            } else {
                td.textContent = value;
            }
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    // Add a class to the table for styling (optional)
    // table.classList.add(`table-${type.charAt(0)}`);

    // const tableTitle = document.createElement('h2');
    // tableTitle.textContent = `${type}`;

    // tableBox.appendChild(tableTitle)
    tableBox.appendChild(table)

    return tableBox;
}
function appendTable(fileName, type, model2url) {
    fetch(fileName)
        .then(response => response.json())
        .then(data => {
            const modelNames = Object.keys(data.pass_1_greedy).map(modelKey => {
                return modelKey.split('_')[0];
            });
            const uniqueModelNames = Array.from(new Set(modelNames));

            const table = createTable(data.pass_1_greedy, type, uniqueModelNames, model2url);
            document.getElementById('tableContainer').appendChild(table);
        })
        .catch(error => console.error('Error fetching data:', error));

}
// Function to fetch and display JSON data in tables
function displayTables() {
    fetch('/model_url_map.json')
        .then(response => response.json())
        .then(data => {
            appendTable('pass_at_k_result_H.json', 'Holistic Generation', data);
            appendTable('pass_at_k_result_C.json', 'Compositional Generation', data);
            appendTable('pass_at_k_result_I.json', 'Incremental Generation', data);
        })
}

function decimalToPercentage(number) {
    // 将小数转化为百分数并保留一位小数
    const percentage = (number * 100).toFixed(1);
    // 去掉百分号
    return parseFloat(percentage);
}


// Call the function to display the tables
displayTables();