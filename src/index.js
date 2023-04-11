const { Server } = require('socket.io');

const app = require('./app');
const { port } = require('./config/app.config');
const DbMessageManager = require('./dao/dbMessageManager');

const httpServer = app.listen(port, () => {
    console.log(`Server runing al port ${port}`);
});

const io = new Server(httpServer);

const Messages = new DbMessageManager();

io.on('connection', socket => {
    console.log(`Client connected with id: ${socket.id}`);

    socket.on('newUser', async user => {
        socket.broadcast.emit('userConnected', user);
        socket.emit('messageLogs', await Messages.getMessages());
    });

    socket.on('message', async data => {
        await Messages.addMessage(data);
        io.emit('messageLogs', await Messages.getMessages());
    });
})
