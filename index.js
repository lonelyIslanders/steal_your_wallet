const ethers = require('ethers');
const dbCommand = require('./db/dbCommand');
const config = require('./config/config');
const usdtAbi = require('./abi/usdtAbi.json');
const bscRpcKeys = Object.keys(config.CHAIN.bsc);
const randomRpcIndex = Math.floor(Math.random() * bscRpcKeys.length);
const randomRpc = config.CHAIN.bsc[bscRpcKeys[randomRpcIndex]];
const providerEth = ethers.getDefaultProvider();
const providerBsc = new ethers.providers.JsonRpcProvider(randomRpc);
const ETHUSDT = new ethers.Contract(config.contract.eth.USDT, usdtAbi, providerEth);
const BSCUSDT = new ethers.Contract(config.contract.bsc.USDT, usdtAbi, providerBsc);
const interTime = Math.floor(Math.random() * (400 - 100) + 100)
let count = 1;
let point = 1;


function runState() {
    setInterval(() => {
        console.clear();
        console.log(`正在运行中${'.'.repeat(point)}`);
        point++;
        if (point > 6) {
            point = 1;
        }
    }, 500);
}


async function generateWallet() {
    return new Promise((res, rej) => {
        const wallet = ethers.Wallet.createRandom();
        res(wallet);
    })
}


async function getWalletBalance() {
    const result = new Array();
    const wallet = await generateWallet();
    const bnbB = await providerBsc.getBalance(wallet.address);
    const ethB = await providerEth.getBalance(wallet.address);
    const decimals = await ETHUSDT.decimals();
    const bnbBalance = ethers.utils.formatEther(bnbB);
    const ethBalance = ethers.utils.formatEther(ethB);
    const ethUSDTbalacne = await ETHUSDT.balanceOf(wallet.address);
    const bscUSDTbalacne = await BSCUSDT.balanceOf(wallet.address);
    const ethUSDTBalance = ethers.utils.formatUnits(ethUSDTbalacne, decimals);
    const bscUSDTBalance = ethers.utils.formatUnits(bscUSDTbalacne, decimals);
    if (bnbBalance > 0 || ethBalance > 0 || ethUSDTBalance > 0 || bscUSDTBalance > 0) {
        console.log(wallet.privateKey);
        await dbCommand.insertWalletInfo(wallet);
    }
    result.push({ id: count++, address: wallet.address, BNB: bnbBalance, ETH: ethBalance, ETHUSDT: ethUSDTBalance, BSCUSDT: bscUSDTBalance });
    console.log(result[0]);
}



setInterval(async () => {
    try {
        await getWalletBalance();
    } catch (e) {
        console.error(e);
    }
}, interTime);

