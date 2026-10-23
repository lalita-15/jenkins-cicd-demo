
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    res.end(`
        <h1>Intership Task : 2 - Jenkins CI/CD Pipeline</h1>
        <p>Application deployed successfully!</p>
    `);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
