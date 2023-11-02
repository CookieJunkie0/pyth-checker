const fs = require('fs');
const dotenv = require('dotenv').config({ path: './.env' });

const network = process.env.NETWORK;
const timeout = process.env.TIMEOUT * 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getResponse(address) {
    try {
        let response = await fetch(`https://airdrop.pyth.network/api/grant/v1/${network.toLowerCase()}_breakdown?identity=${address}`);
        if (response.ok) {
            return await response.json();
        } else {
        throw new Error(`Request for address ${address} failed with status: ${response.status}`);
        }
    } catch (error) {
        return null;
    }
}

async function fetchDataForAddresses() {
    try {
        const addresses = fs.readFileSync('wallets.txt', 'utf-8').split('\n');

        for (i=0; i < addresses.length; i++) {
            await sleep(timeout);

            const address = addresses[i];
            console.log(`Address ${i+1}/${addresses.length} - ${address}...`);

            const data = await getResponse(address);
            if (data !== null) {
                fs.appendFileSync('eligible.txt', `${address}:${data.amount}:${network}\n`);
            }
        }
    } catch(e) { console.log(e) }
}

fetchDataForAddresses();