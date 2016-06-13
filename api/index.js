'use strict'

const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);
const wss = expressWs.getWss();
const LineReaderIterator = require('./lineReaderIterator.js');

app.listen(3000, () => console.log('Listening on :3000...'));

// when browser is pointed to the server, return them
// an html page so they can connect to and use the websocket.
app.get('/', (req, res, next) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.use((req, res, next) => {
    console.log('New Client Connected');
    return next();
});

let clientId = 1;

app.ws('/ws', (ws, req) => {
    let running = true;
    const readers = LineReaderIterator();
    let lr = readers.next();
    let myId = clientId++;

    ws.on('message', onMessageHandler);
    ws.on('close', onCloseHandler);

    readAndSend();
    function readAndSend(){
        if (running) {
            const line = lr.next();
            if (line) {
                log('Sending Line');
                let activation = createActivation(line);
                ws.send(JSON.stringify(activation));
            }
            else {
                log('Current file ended')
                if (!(lr = readers.next())) {
                    log('Restarting file loop');
                    readers.rewind();
                    lr = readers.next();
                } else {
                    log('Reading next file');
                }
            }
            setTimeout(readAndSend, Math.random() * 3000);
        }
    }

    function log(msg) {
        console.log(`${myId}:   ${msg}`);
    }

    function createActivation(line) {
        let parts = line.toString('ascii').split(',');

        return {
            lat: parts[2],
            lon: parts[3],
            business: parts[4],
            city: parts[0],
            state: parts[1],
            demographics: {
                age: parts[5],
                gender: parts[6]
            }
        }
    }

    function onMessageHandler(msg){
        log('Client Says:', msg);
    }

    function onCloseHandler(){
        log('Socket Closed');
        running = false;
        readers.closeAll();
    }
});
