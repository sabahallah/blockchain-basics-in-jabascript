const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    // hashing the transaction
    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // signing the transaction
    signTransaction(signingKeyPair){

        // verifying the public key is the fromAddress
        if(signingKeyPair.getPublic('hex') !== this.fromAddress){
            throw new Error('you can\'t sign transactions for other wallets');
        }

        const hashTx = this.calculateHash();
        const sig = signingKeyPair.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        // to handle reward transaction case which the fromAddress will be null
        if(this.fromAddress === null){
            return true;
        }

        if(!this.signature || this.signature === 0){
            throw new Error('No signature in this transaction!');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

    hasValidTransactions() {
        for (const tx of this.transactions) {
            if (!tx.isValid()) {
                return false;
            }
        }
        return true;
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

        // difference between previous version is we addding the reward transaction to the current pending transations in the current block. not the next block.
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        let block = new  Block(Date.now(), this.pendingTransactions, this.chain[this.chain.length-1].hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined...');
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    addTransaction(transaction){
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }
    
        // Verify the transactiion
        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }
        
        if (transaction.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }
      
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

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

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

const myKey = ec.genKeyPair();
const myWalletAddress = myKey.getPublic('hex');
const myPrivateKey = myKey.getPrivate('hex');

const ahmedkey = ec.genKeyPair();
const ahmedWalletAddress = ahmedkey.getPublic('hex');
const ahmedPrivateKey = ahmedkey.getPrivate('hex');

const tx1 = new Transaction(myWalletAddress, ahmedWalletAddress, 20);
tx1.signTransaction(myKey);
chainTest.addTransaction(tx1);

chainTest.minePendingTransactions(myWalletAddress);
console.log('Balance in my wallet is, ' + chainTest.getBalanceOfAddress(myWalletAddress));
console.log('Balance in Ahmed wallet is, ' + chainTest.getBalanceOfAddress(ahmedWalletAddress));

console.log('\nStart mining again!\n');

chainTest.minePendingTransactions(myWalletAddress);
console.log('Balance in my wallet is, ' + chainTest.getBalanceOfAddress(myWalletAddress));
console.log('Balance in Ahmed wallet is, ' + chainTest.getBalanceOfAddress(ahmedWalletAddress));

console.log('Is valid chain? ' + chainTest.isChainValid());

// let's tamper with the data
chainTest.chain[1].transactions[0].amount = 95;

console.log('Is valid chain after tampering with data? ' + chainTest.isChainValid());