/**
 * Script for fetching
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const exportFile = path.join(__dirname, '../dist/cards.json');
const apiEndpoint = 'https://thronesdb.com/api/public/cards/';

https.get(apiEndpoint, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    const excludedPacks = ['VDS', 'VKm', 'VHotK'];

    let error;
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
    }

    if (error) {
        console.error(error.message);
        res.resume();
        return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        let cards;
        try {
            cards = JSON.parse(rawData);
        } catch (e) {
            console.error(e.message);
        }
        const out = [];
        cards.forEach(card => {
            // ignore cards from "special product", such as the Kingsmoot variant and the Draft set.
            if (excludedPacks.includes(card.pack_code)) {
                return;
            }
            // ignore cards that are work in progress
            if (card.work_in_progress) {
                return;
            }
            // apply some mild data massaging here - remove any data points we don't need.
            delete card.work_in_progress;
            delete card.dateUpdate;

            out.push(card);
        });
        fs.writeFile(exportFile, JSON.stringify(out), 'utf8', (e) => {
            if (e) throw e;
        });
    });
}).on('error', (e) => {
    console.error(e);
});
