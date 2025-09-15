//  Node server which will handle socket.io connection

const io = require('socket.io')(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

// instance of http server, which listen incoming events
io.on('connection', socket => {
    // when new user joins
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name); // notify others
    });

    // handles message broadcasting
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-left', users[socket.id]);
        delete users[socket.id];
    });
})