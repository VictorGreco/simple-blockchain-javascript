import { SHA256 } from 'crypto-js';
import { Transaction } from './Transaction';

export class Block {
    timestamp: number;
    transactions: Transaction[];
    previousHash: string;
    hash: string;
    nounce: number;

    constructor(timestamp: number, transactions: Transaction[], previousHas = '0'){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHas;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash() {
        const hashData = `${this.timestamp}${JSON.stringify(this.transactions)}${this.previousHash}${this.nounce}`;

        return SHA256(hashData).toString();
    }

    mineBlock(difficulty: number) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nounce++;
            this.hash = this.calculateHash();
        }
    }

    hasValidTransactions() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) return false;
        }

        return true;
    }
}