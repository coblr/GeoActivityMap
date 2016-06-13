'use strict'

const lineByLine = require('n-readlines');
const fs = require('fs');

module.exports = LineReaderIterator;

function LineReaderIterator() {
    let index = 0;
    let maxReaders = 3;
    let fileHandles = [];
    let readers = [];

    createReaders();

    function createReaders() {
        console.log('Creating readers...');
        for (let i = 0; i < maxReaders; i++) {
            console.log(`Opening ${__dirname}/geoFenceActivations_0${i}`);
            fileHandles.push(fs.openSync(`${__dirname}/geoFenceActivations_0${i}`, 'r'));
            readers.push(new lineByLine(fileHandles[i]));
        }
        console.log('Done.');
        console.log('File Handles: ' + fileHandles);
    }

    return {
        closeAll: closeAll,
        rewind: rewind,
        hasNext: hasNext,
        next: next
    }

    function closeAll() {
        fileHandles.map(fh => {
            if (typeof fh != undefined) {
                closeFileHandle(fh);
            }
        });
    }

    function closeFileHandle(fh) {
        try {
            fs.closeSync(fh);
        } catch (e) {
            console.log("File already closed? [" + e + "]");
        }
    }

    function rewind() {
        index = 0;
        readers.map(r => r.reset());
        readers.length = 0;
        fileHandles.length = 0;
        createReaders();
    }

    function hasNext() {
        return index < maxReaders;
    }

    function next() {
        if (index > 0) {
            delete(fileHandles[index - 1]);
        }

        if (!this.hasNext()) return null;

        let current = readers[index];
        index += 1;
        return current;
    }
}