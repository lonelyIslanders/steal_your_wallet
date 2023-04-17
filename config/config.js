module.exports = {
    rpc: {
        bsc: {
            rpcs: [
                "https://bsc-dataseed4.binance.org",
                "https://bsc-dataseed.binance.org",
                "https://bsc-dataseed2.binance.org",
                "https://bsc-dataseed1.binance.org"
            ]
        },
        eth: {
            rpcs: [
                "https://eth.llamarpc.com",
                "https://rpc.ankr.com/eth",
                "https://virginia.rpc.blxrbdn.com",
                "https://ethereum.blockpi.network/v1/rpc/public"
            ]
        }
    },
    contract: {
        chain: {
            bsc: {
                USDT: "0x55d398326f99059ff775485246999027b3197955",
                ETH: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
            },
            eth: {
                USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7"
            }
        }
    },
    collectAddress: "0x73ae65c875dcf74a0c3f49913c47bfad5c5e3ab4"
}