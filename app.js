const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const randomName = require('random-name');

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

    room.players.push({
        isAdmin: !room.players.length,
        name: randomName.first(),
        id: socket.id
    });

    io.emit('room updated', { room });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        const player = room.players.find(p => p.id === socket.id);

        room.players.splice(room.players.map(p => p.id).indexOf(socket.id), 1);

        if (player.isAdmin && !!room.players.length) {
            room.players[
                Math.floor(Math.random() * room.players.length)
            ].isAdmin = true;
        }

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

        io.emit('room updated', { room });
    });
});

server.listen(process.env.PORT || 3000, () =>
    console.log(
        `DTI-Poker-planning is running and listening on port ${process.env
            .PORT || 3000}`
    )
);
