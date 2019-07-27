const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, data, previousHash = ''){
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // in order to change the hash value while mining.
    }
    
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
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
        this.difficulty = 5;
    }

    createGenesisBlock(){
        return new Block('01/01/2018', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i=1; i<this.chain.length; i++){
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

chainTest.addBlock(new Block('01/02/2018', '{owner: "mahmoud"}'));
chainTest.addBlock(new Block('01/03/2018', '{owner: "ahmed"}'));
chainTest.addBlock(new Block('01/04/2018', '{owner: "wessam"}'));

console.log(JSON.stringify(chainTest, null, 3));
console.log('Is chain valid? ' + chainTest.isChainValid());

// now let's try to tamper with data
chainTest.chain[1].data = '{owner: "muhammad"}';
console.log('After tampering with data, is chain valid? ' + chainTest.isChainValid());
