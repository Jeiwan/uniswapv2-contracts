const { ethers } = require("hardhat");
const hre = require("hardhat");

const ether = ethers.utils.parseEther;

async function main() {
  const [owner] = await ethers.getSigners();
  const provider = ethers.getDefaultProvider();

  const Token = await ethers.getContractFactory("Token");
  const weth = await Token.deploy("Wrapper ETH", "WETH", ether("10"));
  await weth.deployed();

  //
  //
  // Uniswap deployment
  //
  //
  // const Library = await ethers.getContractFactory("UniswapV2Library");
  // const library = await Library.deploy();
  // await library.deployed();

  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(owner.address);
  await factory.deployed();

  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(factory.address, weth.address);
  await router.deployed();

  const Pair = await ethers.getContractFactory("UniswapV2Pair");

  console.log("WETH deployed to:", weth.address);
  console.log("Factory deployed to:", factory.address);
  console.log("Router deployed to:", router.address);

  //
  //
  // Pair deployment
  //
  //
  const tokenA = await Token.deploy("Token A", "TKNA", ether("10"));
  await tokenA.deployed();

  const tokenB = await Token.deploy("Token B", "TKNB", ether("10"));
  await tokenB.deployed();

  await tokenA.approve(router.address, ether("1"));
  await tokenB.approve(router.address, ether("1"));

  await router.addLiquidity(
    tokenA.address,
    tokenB.address,
    ether("1"),
    ether("1"),
    ether("1"),
    ether("1"),
    owner.address,
    9999999999 // don't expire
  );

  console.log("WOOOOOOOOOOOOOOOT!");

  const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
  console.log(pairAddress)
  const pair = Pair.attach(pairAddress);

  console.log("Router deployed to:", pair.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
