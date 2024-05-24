const express = require('express');
const http = require('http');
const ws = require('ws');

const PORT = 8081;
const HOSTNAME = 'localhost';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.post('/receive', (req, res) => {
    const message = req.body;
    console.log('body: ', message);

    sendMessageToOtherUsers(message.sender, message);
    res.sendStatus(200);
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server started at http://${HOSTNAME}:${PORT}`);
});

const wss = new ws.WebSocketServer({ server });
const users = {};

// взаимодействие с транспортным уровнем
const sendMsgToTransportLevel = async (message) => {
    try {
        const response = await axios.post(`http://${HOSTNAME_TRANSPORT_LEVEL}:${PORT_TRANSPORT_LEVEL}/send`, message);
        if (response.status !== 200) {
            message.error = 'Error from transport level by sending message';
            users[message.sender].forEach(element => {
                if (message.id === element.id) {
                    element.ws.send(JSON.stringify(message));
                }
            });
        }
        console.log('Response from transport level: ', response.data);
    } catch (error) {
        console.error('Error sending message to transport level:', error.message);
    }
};

function sendMessageToOtherUsers(sender, message) {
    const msgString = JSON.stringify(message);
    for (const key in users) {
        if (key !== sender) { // Отправляем всем пользователям, кроме отправителя
            users[key].forEach(element => {
                element.ws.send(msgString);
            });
        }
    }
}

wss.on('connection', (websocketConnection, req) => {
    if (req.url.length === 0) {
        console.log(`Error: req.url = ${req.url}`);
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const sender = url.searchParams.get('username');

    if (sender !== null) {
        console.log(`[open] Connected, sender: ${sender}`);

        if (users[sender]) {
            users[sender].push({ id: users[sender].length, ws: websocketConnection });
        } else {
            users[sender] = [{ id: 1, ws: websocketConnection }];
        }
    } else {
        console.log('[open] Connected');
    }

    websocketConnection.on('message', (messageString) => {
        console.log('[message] Received from ' + sender + ': ' + messageString);

        const message = JSON.parse(messageString);
        message.sender = message.sender ?? sender;

        sendMessageToOtherUsers(sender, message); // Отправляем сообщение другим пользователям
        // sendMsgToTransportLevel(message);
    });

    websocketConnection.on('close', (event) => {
        console.log(sender, '[close] Connection closed', event);

        delete users[sender];
    });
});
