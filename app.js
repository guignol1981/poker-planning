const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const randomName = require('random-name');
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

const rooms = [
    {
        id: 'test-room',
        voting: 'non définie',
        status: 'voting',
        players: []
    }
];

setInterval(() => {
    const indexes = [];

    rooms.forEach((r, i) => {
        if (!r.players.length) {
            indexes.push(i);
        }
    });

    for (let i = indexes.length - 1; i >= 0; i--) rooms.splice(indexes[i], 1);
}, 1000 * 60 * 5);

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('new room', () => {
        const roomId = uuidv4();

        rooms.push({
            id: roomId,
            voting: 'non définie',
            status: 'voting',
            players: []
        });

        io.to(socket.id).emit('room created', { roomId });
    });

    socket.on('room joined', event => {
        const room = rooms.find(r => r.id === event.roomId);

        if (!room) {
            io.to(socket.id).emit('404');
            return;
        }

        room.players.push({
            isAdmin: !room.players.length,
            name: randomName.first(),
            id: socket.id
        });

        socket.join(event.roomId);

        io.to(event.roomId).emit('room updated', { room });
    });

    socket.on('disconnect', event => {
        console.log('user disconnected');

        const room = rooms.find(r =>
            r.players.map(p => p.id).includes(socket.id)
        );

        if (!room) {
            return;
        }

        const player = room.players.find(p => p.id === socket.id);

        room.players.splice(room.players.map(p => p.id).indexOf(socket.id), 1);

        if (player.isAdmin && !!room.players.length) {
            room.players[
                Math.floor(Math.random() * room.players.length)
            ].isAdmin = true;
        }

        io.to(event.roomId).emit('room updated', { room });
    });

    socket.on('player updated', event => {
        const room = rooms.find(r => r.id === event.roomId);

        if (!room.players.find(p => p.id === socket.id)) {
            return;
        }

        room.players.splice(
            room.players.map(p => p.id).indexOf(socket.id),
            1,
            event.player
        );

        io.to(event.roomId).emit('room updated', { room });
    });

    socket.on('room updated', event => {
        const room = rooms.find(r => r.id === event.room.id);

        delete event.room.players;

        Object.assign(room, event.room);

        io.to(event.roomId).emit('room updated', { room });
    });

    socket.on('reset', event => {
        const room = rooms.find(r => r.id === event.roomId);

        Object.assign(room, {
            voting: 'non définie',
            status: 'voting'
        });

        room.players.forEach(p => (p.vote = 0));

        io.to(event.roomId).emit('room updated', { room });
    });

    socket.on('vote submited', event => {
        const room = rooms.find(r => r.id === event.roomId);

        room.status = 'results';
        room.results = room.players.reduce(
            (acc, cur) => {
                acc.datasets[0].data[acc.labels.indexOf(cur.vote)]++;
                return acc;
            },
            {
                labels: [0.5, 1, 2, 3, 5, 8, 13],
                datasets: [
                    {
                        label: 'Résultats',
                        data: [0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: [
                            '#3e95cd',
                            '#8e5ea2',
                            '#3cba9f',
                            '#e8c3b9',
                            '#c45850',
                            '#e74c3c',
                            '#8e44ad'
                        ]
                    }
                ]
            }
        );

        room.results.labels = room.results.labels.map(l => {
            return (
                l.toString() +
                ': ' +
                room.players
                    .filter(p => p.vote === l)
                    .map(p => p.name)
                    .join(', ')
            );
        });

        io.to(event.roomId).emit('room updated', { room });
    });
});

server.listen(process.env.PORT || 3000, () =>
    console.log(
        `DTI-Poker-planning is running and listening on port ${process.env
            .PORT || 3000}`
    )
);
