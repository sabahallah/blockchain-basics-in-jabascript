const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // in order to change the hash value while mining.
    }
    
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    // control how fast new blocks can be added to the blockchain
    mineBlock(difficulty){
        console.log('Mining a block with difficulty of ' + difficulty);
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 500;
    }
    
    createGenesisBlock(){
        return new Block('01/01/2018', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress) {
        let block = new  Block(Date.now(), this.pendingTransactions, this.chain[this.chain.length-1].hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined...');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];

    }

    addTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    isChainValid() {
        for(let i=1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

// Testing

let chainTest = new BlockChain();

chainTest.addTransaction(new Transaction('address1', 'address2', 100));
chainTest.addTransaction(new Transaction('address2', 'address1', 40));

chainTest.minePendingTransactions('mahmoud-address');
console.log('Balance of Mahmoud is, ' + chainTest.getBalanceOfAddress('mahmoud-address'));

chainTest.minePendingTransactions('mahmoud-address');
console.log('Balance of Mahmoud is, ' + chainTest.getBalanceOfAddress('mahmoud-address'));

console.log(chainTest.isChainValid());
