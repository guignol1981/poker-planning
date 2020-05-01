const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'dist/index.html')));

const room = {
    voting: 'non définie',
    status: 'voting',
    players: []
};

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');

        room.players.splice(room.players.map(p => p.id).indexOf(socket.id), 1);

        if (room.players.find(p => p.isAdmin && room.players.length)) {
            room.players[0].isAdmin = true;
        }

        io.emit('room updated', { room });
    });

    socket.on('joined', () => {
        const name = 'Player #' + (room.players.length + 1);

        room.players.push({
            isAdmin: !room.players.length,
            name: name,
            id: socket.id
        });

        io.emit('room updated', { room });
    });

    socket.on('player updated', event => {
        if (!room.players.find(p => p.id === socket.id)) {
            return;
        }

        room.players.splice(
            room.players.map(p => p.id).indexOf(socket.id),
            1,
            event.player
        );

        io.emit('room updated', { room });
    });

    socket.on('room updated', event => {
        delete event.room.players;

        Object.assign(room, event.room);

        io.emit('room updated', { room });
    });

    socket.on('reset', () => {
        Object.assign(room, {
            voting: 'non définie',
            status: 'voting'
        });

        room.players.forEach(p => (p.vote = 0));

        io.emit('room updated', { room });
    });

    socket.on('vote submited', () => {
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

        io.emit('room updated', { room });
    });
});

server.listen(process.env.PORT || 3000, () =>
    console.log(
        `DTI-Poker-planning is running and listening on port ${process.env
            .PORT || 3000}`
    )
);
