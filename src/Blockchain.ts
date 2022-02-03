import { Block } from './Block';
import { Transaction } from './Transaction';

export class Blockchain {
    chain: Block[];
    difficulty: number;
    pendingTransactions: Transaction[];
    miningReward: number;

    constructor(difficulty: number = 1) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(new Date().getTime(), [new Transaction(null, null, 0, 'Genesis block')]);
    }

    getLatestBLock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress: string) {
        const miningTransaction = new Transaction(null, miningRewardAddress, this.miningReward, 'Mining reward');
        this.pendingTransactions.push(miningTransaction);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBLock().hash); // In real blockchain would be impossible to add all the pensingTransactions in just one block.
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = []

    }

    addTransaction(transaction: Transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string) {
        const transactionsReducer = (balance: number, { fromAddress, toAddress, amount }: Transaction) => {
            if (toAddress === address) return balance + amount;
            if (fromAddress === address) return balance - amount;

            return balance;
        }

        const blocksReducer = (balance: number, block: Block) => 
            balance + block.transactions.reduce(transactionsReducer, 0);

        return this.chain.reduce(blocksReducer, 0); // balance
    }

    isValidChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            const isBlockHashCorrect = currentBlock.hash === currentBlock.calculateHash();
            const isPreviousBlockHashCorrect = currentBlock.previousHash === previousBlock.hash;
            const hasCurrentBlockValidTransactions = currentBlock.hasValidTransactions(); 

            if (!isBlockHashCorrect || 
                !isPreviousBlockHashCorrect || 
                !hasCurrentBlockValidTransactions) 
                return false;
        }

        return true;
    }
}