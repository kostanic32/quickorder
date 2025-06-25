
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let clients = [];
let orderHistory = [];

wss.on('connection', ws => {
  clients.push(ws);
  ws.on('close', () => {
    clients = clients.filter(c => c !== ws);
  });
});

app.post('/webhook/order', (req, res) => {
  const order = req.body;

  // Ručno prilagođavanje vremena za hrvatsku vremensku zonu (UTC+2)
  const now = new Date();
  now.setMinutes(now.getMinutes() + now.getTimezoneOffset() + 120);
  const time = now.toISOString().substr(11, 5); // format HH:MM

  order.time = time;

  console.log('Primljena narudžba:', order);
  orderHistory.push(order);

  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(order));
    }
  });

  res.status(200).send({ status: 'OK' });
});

app.get('/orders', (req, res) => {
  res.json(orderHistory);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server pokrenut na http://localhost:${PORT}`));
