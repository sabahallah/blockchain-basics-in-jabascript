# Blockchain Basic Implementation in `javascript`

This is a proof of concept implementation of `Blockchain` technology in order to get the idea of how blockchain works.  

## Resources

Code in this repository developed following this [Youtube Playlist](https://www.youtube.com/playlist?list=PLzvRQMJ9HDiTqZmbtFisdXFxul5k0F-Q4)

## Content

There are 3 javascript files `blockchain.js`, `blockchain-2.js` and `blockchain-3.js`

* `blockchain.js` contains:
  * Simple `Blockchain` and `Block` implementations.
  * Creating and validation chain of blocks.
  * Calculating the hash.
  * Proof of work or _Mining_.
  * Testing
* `blockchain-2.js` contains:
  * Same code in `blockchain.js` revamped to convert it into cryptocurrency and implement:
    * Miner rewards & transactions.
    * Testing.
* Same code in `blockchain-2.js` plus:
  * Signing the transactions.
  * Testing.

## Conclusion

* `Blockchain` is a chain of `Block`s.
* Each `Block` contains a list of `Transaction`s.
* Each `Transaction` holds a certain amount of data.
* `Transaction`s are signed and verfied with private and public key.
* `Block`s being created by `Miner`s.
* `Block`s created in a specific intervals, means each Block takes some time to be created.
* `Miner`s mining new `Block`s (generating the hash of the block with a specific criteria).
* All the `Transaction`s that are made between `Block`s are temporarily stored in the pending transactions array that can be included in the next created `Block`.
* Once a `Miner` success to mine a `Block`, the `Block` will be added to the chain along with the pending transactions plus `Miner` reward `Transaction`.
* Wallet address is always the public key, private key used to sign the transaction.

## Run

To run the js files:

* Open terminal and make sure you have `nodejs` installed.
* run `npm install`
* run `node blockchain.js`, `node blockchain-2.js` or `node blockchain-3.js`

## My Linkedin Profile

[Mahmoud SabahAllah](https://www.linkedin.com/in/sabahallah/)
