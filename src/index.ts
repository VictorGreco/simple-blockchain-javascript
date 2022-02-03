import 'dotenv/config';
import { ec } from 'elliptic';

import { Blockchain } from './Blockchain';
import { Transaction } from './Transaction';

const { WALLET_PRIVATE_KEY } = process.env;
const EC = new ec('secp256k1');

if (!WALLET_PRIVATE_KEY) {
    throw new Error('Missing WALLET_PRIVATE_KEY in .env, execute npm run key:gen');
}

const MY_WALLET = EC.keyFromPrivate(WALLET_PRIVATE_KEY);

const MY_WALLET_PULIC_ADDRESS = MY_WALLET.getPublic('hex');
const SOMEONE_ELSE_WALLET_ADDRESS = EC.genKeyPair().getPublic('hex');

const victorCoin = new Blockchain(1);
const transaction1 = new Transaction(MY_WALLET_PULIC_ADDRESS, SOMEONE_ELSE_WALLET_ADDRESS, 10, 'Pizza party');

transaction1.sign(MY_WALLET);
victorCoin.addTransaction(transaction1);

console.log('Start mining process 1...');

victorCoin.minePendingTransactions(MY_WALLET_PULIC_ADDRESS);
console.log(`${MY_WALLET_PULIC_ADDRESS} balance is: ${victorCoin.getBalanceOfAddress(MY_WALLET_PULIC_ADDRESS)}`);

console.log(`Is chain valid ?: ${victorCoin.isValidChain()}`);

victorCoin.chain[1].transactions[0].amount = 200;

console.log(`Is chain valid ?: ${victorCoin.isValidChain()}`);
