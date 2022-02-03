import { SHA256 } from "crypto-js";
import { ec } from "elliptic";

export class Transaction {
    fromAddress: string | null;
    toAddress: string | null;
    amount: number;
    signature?: string;
    description?: string;

    constructor(fromAddress: string | null, toAddress: string | null, amount: number, description: string = '') {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.description = description;
    }

    calculateHash() {
        return SHA256(`${this.fromAddress}${this.toAddress}${this.amount}`).toString();
    }

    sign(key: ec.KeyPair) {
        if (key.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets');
        }

        const transactionHash = this.calculateHash();
        const signature = key.sign(transactionHash, 'base64');

        this.signature = signature.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0 || typeof this.signature !== 'string') {
            throw new Error('No signature provided for this transaction');
        }

        const pubblicKey = new ec('secp256k1').keyFromPublic(this.fromAddress, 'hex');
        
        return pubblicKey.verify(this.calculateHash(), this.signature);
    }
}