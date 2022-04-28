# Uniswap V2 contracts, ready to be deployed to local or test network

Full copy of the original contracts with some minor changes:
1. All contracts were updated to version 0.8.13, with minor changes.
1. [Example contracts](https://github.com/Uniswap/v2-periphery/tree/master/contracts/examples) were not copied over due
to a missing contract they require. PR is welcomed!

## Usage
1. 
    ```shell
    $ yarn
    $ alias hh="yarn hardhat"
    $ hh node
    ```
1. In another terminal window:
    ```shell
    $ hh run scripts/deploy.js
    $ hh console
    ```
1. Use this to load contract ABI and attach to a deployed contract:
    ```js
    const Router = await ethers.getContractFactory("UniswapV2Router02");
    const router = Router.attach(ROUTER_ADDRESS);
    await router.swapExactTokensForTokens(...);
    ```

Refer to [this](https://docs.ethers.io/v5/api/contract/) if you need help
interacting with contracts.

## 🚨 ATTENTION 🚨
Each time you update `UniswapV2Pair.sol` contract, you need to update the hex
value in this line:

https://github.com/Jeiwan/uniswapv2-contracts/blob/dfe393ca55241544f54a780c4cd05b1824a2ed1a/contracts/libraries/UniswapV2Library.sol#L25

Use this command to get a new value:
```
$ cat artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json| jq -r .bytecode| xargs cast keccak| cut -c 3-
```

(Ensure you have [jq](https://stedolan.github.io/jq) and [cast](https://github.com/foundry-rs/foundry)
installed)

**Why?** Uniswap V2 uses [CREATE2](https://www.evm.codes/#f5) opcode to deploy pair contracts. This opcode
allows to generate contract addresses deterministically without depending on external state (deployer's
nonce). Instead, it uses the hash of the deployed contract code and salt:

https://github.com/Jeiwan/uniswapv2-contracts/blob/dfe393ca55241544f54a780c4cd05b1824a2ed1a/contracts/UniswapV2Factory.sol#L32

Each time you update the Pair contract (even when you change compiler version), its bytecode changes, which
means the hash of the bytecode also changes.

Have an idea how to automate this? PR is welcomed!