const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const historyPath = path.join(root, 'history.json');
const port = process.env.PORT || 3000;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function readHistory() {
  try {
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    return Array.isArray(history) ? history : [];
  } catch (error) {
    return [];
  }
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function saveBooking(request, response) {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > 10000) request.destroy();
  });
  request.on('end', () => {
    try {
      const booking = JSON.parse(body);
      const requiredFields = ['model', 'store', 'date', 'time', 'name', 'phone'];
      if (requiredFields.some((field) => typeof booking[field] !== 'string' || !booking[field].trim())) {
        sendJson(response, 400, { error: '预约信息不完整' });
        return;
      }

      const history = readHistory();
      const record = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        model: booking.model.trim(),
        store: booking.store.trim(),
        date: booking.date.trim(),
        time: booking.time.trim(),
        name: booking.name.trim(),
        phone: booking.phone.trim(),
        createdAt: new Date().toISOString()
      };
      history.push(record);
      fs.writeFileSync(historyPath, `${JSON.stringify(history, null, 2)}\n`, 'utf8');
      sendJson(response, 201, { record });
    } catch (error) {
      sendJson(response, 400, { error: '无法解析预约信息' });
    }
  });
}

function serveFile(request, response) {
  const requestedPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.normalize(path.join(root, requestedPath));
  if (!filePath.startsWith(root) || path.extname(filePath) === '.json') {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  fs.readFile(filePath, (error, file) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(file);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/history') {
    saveBooking(request, response);
    return;
  }
  if (request.method === 'GET' && request.url === '/api/history') {
    sendJson(response, 200, readHistory());
    return;
  }
  if (request.method === 'GET') serveFile(request, response);
  else sendJson(response, 405, { error: 'Method not allowed' });
});

server.listen(port, () => {
  console.log(`AURA MOTORS is running at http://localhost:${port}`);
});
