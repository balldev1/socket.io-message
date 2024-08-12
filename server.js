const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    const httpServer = createServer(server);
    const io = new Server(httpServer);

    // เมื่อมีการเชื่อมต่อจากไคลเอนต์
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // เมื่อไคลเอนต์ส่งข้อความมา
        socket.on('message', (msg) => {
            console.log('Message received:', msg);

            // ส่งข้อความกลับไปยังไคลเอนต์
            socket.emit('response', `Server received: ${msg}`);
        });

        // เมื่อไคลเอนต์ตัดการเชื่อมต่อ
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    // port 3000
    httpServer.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
