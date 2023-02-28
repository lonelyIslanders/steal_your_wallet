module.exports = {
    CHAIN: {
        bsc: {
            rpc1: "https://binance.nodereal.io",
            rpc2: "https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
            rpc3: "https://rpc-bsc.bnb48.club",
            rpc4: "https://bsc-dataseed1.ninicoin.io",
            rpc5: "https://bsc-mainnet.rpcfast.com?api_key=S3X5aFCCW9MobqVatVZX93fMtWCzff0MfRj9pvjGKSiX5Nas7hz33HwwlrT5tXRM"
        },
        bsctest: {
            rpc: "https://endpoints.omniatech.io/v1/bsc/testnet/public"
        },
        eth: {
            rpc: "https://rpc.payload.de"
        }
    },
    CONTRACT: {
        eth: {
            mainNet: {//eth主网USDT合约地址
                USDT: "0xdac17f958d2ee523a2206206994597c13d831ec7"
            },
            testNet: {
                USDT: ""
            }
        },
        bsc: {
            mainNet: {//bsc主网USDT合约地址
                USDT: "0x55d398326f99059ff775485246999027b3197955"
            },
            testNet: {//bsc测试网USDT合约地址
                USDT: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
                ETH: "0x2170ed0880ac9a755fd29b2688956bd959f933f8"
            }
        }
    },
    collectAddress: "0x091c2c650868b49309e0076118fbe9807f770b8f"
}