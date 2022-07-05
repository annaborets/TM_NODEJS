const fs = require('fs');
const path = require('path');
const http = require('http');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const composeDoc = (template, data) => {
    let parsedData;

    try {
        parsedData = JSON.parse(data);
    } catch (error) {
        console.log(`Data json parsing error: ${error.message}. Exiting...`)
        process.exit('1')
    }

    const composedTemplate = template.replace(/{{ (.*) }}/gm, (_, prop) => {
        return parsedData[prop] || 'Not found';
    })

    return composedTemplate;
}


const initServer = (dataToRender) => {
    const port = 3000;

    const requestListener = function (req, res) {
        res.writeHead(200);
        res.end(dataToRender);
    }

    const server = http.createServer(requestListener);
    server.listen(port);
    console.log(`Running server on ${port} port`)
}

readline.question('template path?\n', (templatePath) => {
    readline.question('data path?\n', (dataPath) => {
        if (path.extname(templatePath) !== '.html' || path.extname(dataPath) !== '.json') {
            console.log('Unsupported file extensions. Exiting...');
            process.exit(1);
        }

        if (!fs.existsSync(templatePath) || !fs.existsSync(dataPath)) {
            console.log('Could not find one or both of the provided paths. Exiting...')
            process.exit(1);
        }

        const template = fs.readFileSync('/Users/anna/Desktop/TM_academy/task_6/assets/template.html', 'utf-8');
        const data = fs.readFileSync('/Users/anna/Desktop/TM_academy/task_6/assets/data.json', 'utf-8');

        const composedDoc = composeDoc(template, data);

        initServer(composedDoc);
    });
})
