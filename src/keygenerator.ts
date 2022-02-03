import 'dotenv/config'
import * as fs from 'fs';
import { ec } from 'elliptic';

if (!process.env.WALLET_PRIVATE_KEY) {
    const newWalletPrivateKey = new ec('secp256k1')
        .genKeyPair()
        .getPrivate('hex');
    const buffer = `WALLET_PRIVATE_KEY=${newWalletPrivateKey}\n`;
    
    fs.appendFile('.env', buffer, () => {});
    
    console.log(`Added new wallet private key to .env: ${buffer}`);
} else {
    console.log('Wallet private key already exist on .env');
}
