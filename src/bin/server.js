import Emitter from 'events';
import app from "../app.js";
import { Server } from 'socket.io';

const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

//Socket Connection

const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('join', (roomName) => {
        socket.join(roomName);
    })
});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data);
});

eventEmitter.on('orderPlaced', (data) =>{
    io.to('adminRoom').emit('orderPlaced', data);
});

