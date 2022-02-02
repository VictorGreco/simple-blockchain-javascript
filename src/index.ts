import { Blockchain } from './Blockchain';
import { Transaction } from './Transaction';


const victorCoin = new Blockchain(1);

victorCoin.addTransaction(new Transaction('address1', 'address2', 500));
victorCoin.addTransaction(new Transaction('address2', 'address1', 100));

console.log('Start mining process 1...');

victorCoin.minePendingTransactions('miner-address');
console.log('address1 balance is: ', victorCoin.getBalanceOfAddress('address1'));
console.log('address2 balance is: ', victorCoin.getBalanceOfAddress('address2'));
console.log('miner-address balance is: ', victorCoin.getBalanceOfAddress('miner-address'));

console.log('Start mining process 2...');

victorCoin.minePendingTransactions('miner-address');

console.log('address1 balance is: ', victorCoin.getBalanceOfAddress('address1'));
console.log('address2 balance is: ', victorCoin.getBalanceOfAddress('address2'));
console.log('miner-address balance is: ', victorCoin.getBalanceOfAddress('miner-address'));



