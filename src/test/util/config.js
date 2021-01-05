const fullHost = "http://127.0.0.1:" + (process.env.HOST_PORT || 9090)

module.exports = {

    // PRIVATE_KEY: process.env.PRIVATE_KEY,
    // PRIVATE_KEY: '8f48434338fc2b8e6e164e3495416de6d2fdfb0e176f82094c1c45405bb26afa',
    PRIVATE_KEY: 'FC8BF0238748587B9617EB6D15D47A66C0E07C1A1959033CF249C6532DC29FE6',
    // PRIVATE_KEY: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
    CONSUME_USER_RESOURCE_PERCENT: 30,
    FEE_LIMIT: 1000000000,
    FULL_NODE_API: fullHost,
    SOLIDITY_NODE_API: fullHost,
    EVENT_API: fullHost,
    NETWORK_ID: "*",
    /*ADDRESS_HEX: '41928c9af0651632157ef27a2cf17ca72c575a4d21',
    ADDRESS_BASE58: 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY',*/
    ADDRESS_HEX: '415624c12e308b03a1a6b21d9b86e3942fac1ab92b',
    ADDRESS_BASE58: 'THph9K2M2nLvkianrMGswRhz5hjSA9fuH7',
    /*ADDRESS_HEX: '415ab90009b529c5406b4f8a6fc4dab8a2bc778c75',
    ADDRESS_BASE58: 'TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s',*/
    /*ADDRESS_HEX: '41d1e7a6bc354106cb410e65ff8b181c600ff14292',
    ADDRESS_BASE58: 'TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU',*/
    /*ADDRESS_HEX: '4125c34b27ca968abbcd343cc4214c01d970b9440e',
    ADDRESS_BASE58: 'TDQsxPhq9bgmnw9CeDSrXsYjqt2rb1b3pg',*/
    UPDATED_TEST_TOKEN_OPTIONS: {
        description: 'Very useless utility token',
        url: 'https://none.example.com',
        freeBandwidth: 10,
        freeBandwidthLimit: 100
    },
    getTokenOptions: () => {
        const rnd = Math.random().toString(36).substr(2);
        return {
            name: `Token${rnd}`,
            abbreviation: `T${rnd.substring(2).toUpperCase()}`,
            description: 'Useless utility token',
            url: `https://example-${rnd}.com/`,
            totalSupply: 100000000,
            saleEnd: Date.now() + 150000, // 1 minute
            frozenAmount: 5,
            frozenDuration: 1,
            trxRatio: 10,
            tokenRatio: 2,
            saleStart: Date.now() + 5000,
            freeBandwidth: 100,
            freeBandwidthLimit: 1000
        }
    },
    isProposalApproved: async (tronWeb, proposal) => {
        let chainParameters = await tronWeb.trx.getChainParameters()
        for(let param of chainParameters) {
            if(param.key === proposal) {
                return param.value
            }
        }

        return false
    },
    SUN_NETWORK: process.env.SUN_NETWORK,
    SIDE_CHAIN: {
        // fullNode: 'http://39.107.81.225:9193',
        // solidityNode: 'http://39.107.81.225:9197',
        // eventServer: 'http://39.107.81.225:9190',
        fullNode: 'https://testhttpapi.tronex.io',
        solidityNode: 'https://testhttpapi.tronex.io',
        eventServer: 'https://testhttpapi.tronex.io',
        // fullNode: 'https://api.nileex.io/',
        // solidityNode: 'https://api.nileex.io/',
        // eventServer: 'https://event.nileex.io/',
        /*fullNode: 'http://3.225.171.164:8090',
        solidityNode: 'http://3.225.171.164:8090',
        eventServer: 'http://3.225.171.164:8090',*/
        /*fullNode: 'http://39.107.123.182:8590',
        solidityNode: 'http://39.107.123.182:8590',
        eventServer: 'http://39.107.123.182:8590',*/
        sideOptions: {
            fullNode: 'https://suntest.tronex.io',
            solidityNode: 'https://suntest.tronex.io',
            eventServer: 'https://suntest.tronex.io',
            mainGatewayAddress: 'TFLtPoEtVJBMcj6kZPrQrwEdM3W3shxsBU',
            mainGatewayAddress_hex: '413af23f37da0d48234fdd43d89931e98e1144481b',
            sideGatewayAddress: 'TRDepx5KoQ8oNbFVZ5sogwUxtdYmATDRgX',
            sideGatewayAddress_hex: '41a74544b896f6a50f8ef1c2d64803c462cbdb019d',
            sideChainId: '413AF23F37DA0D48234FDD43D89931E98E1144481B'
            /*fullNode: 'http://39.107.81.225:8190',
            solidityNode: 'http://39.107.81.225:8197',
            eventServer: 'http://39.107.81.225:8190',
            mainGatewayAddress: 'TT3g3giGizJL9yUNMjoBkW7v5Z7HKn5kxu',
            mainGatewayAddress_hex: '41bb5260e14ec6f67ceb21c6e94d233562c2fd9f27',
            sideGatewayAddress: 'TJQ21bkuhCtVt1s7XdCno9MwfhuACorSRv',
            sideGatewayAddress_hex: '415c723b1366156639a9019e1c7a0096c2fa25ac91',
            sideChainId: '41F7AFFF7316CDA1E1BC9B21B7CC98BB84A4EA5510'*/
            // fullNode: 'https://kageraex.io',
            // solidityNode: 'https://kageraex.io',
            // eventServer: 'https://kageraex.io',
            // mainGatewayAddress: 'TF9xuGSBXuHuVGm6Z7zydFTDHXuNeny1Et',
            // mainGatewayAddress_hex: '4138e16f3d0d982875d7ca8e221dbb511a4e836983',
            // sideGatewayAddress: 'TWLoD341FRJ43JfwTPADRqGnUT4zEU3UxG',
            // sideGatewayAddress_hex: '41df77ce160fb3935e3a9a2dde1deb3a672b2ebb31',
            // sideChainId: '41C0D909CC323543142E77AAD3786389364B981EEC'
        }
    },
    TOKEN_ID: 1000001,
    DEPOSIT_FEE: 0,
    MAPPING_FEE: 0,
    WITHDRAW_FEE: 0,
    RETRY_MAPPING_FEE: 0,
    RETRY_DEPOSIT_FEE: 0,
    RETRY_WITHDRAW_FEE: 0,
    ORACLE_PRIVATE_KEY: "324a2052e491e99026442d81df4d2777292840c1b3949e20696c49096c6bacb7",
    NONCE: 35,

    HASH20: '340736d60acb72d31f3ccf2f239e3037466ad593fe1a810604869ffb37408368',
    CONTRACT_ADDRESS20: 'TKzAbWH9gzPA2SrjSbv6wKsu7JrYwX5ABC',
    CONTRACT_ADDRESS20_HEX: '416ddfaa50bcb0c96cbaf1b5579821aedb87846ddf',

    ADDRESS20_MAPPING: 'TWKgfWi4cLHSEwAfuqMvLE1f8DeUbZrtJx',
    ADDRESS20_MAPPING_HEX: '41df41ed44271678b166ad6bf0434e0b4055b98346',

    HASH721: 'dec0b5e73b4a3ad5061337b9277701ea8a7c1f4dd5ff14e11b9c9eef00c72562',
    CONTRACT_ADDRESS721: 'THczcX2D1mqCDRN1JgkhxyDeEqPBz8oBSR',
    CONTRACT_ADDRESS721_HEX: '4153ee58746945a21c22384ef9b71c04465a5db889',

    ADDRESS721_MAPPING: 'TVG2vHBeWac6AxLCJE5MjuKtD7JVKRKkPn',
    ADDRESS721_MAPPING_HEX: '41d3990b7d3342cdef07d15c59111faea207286aab',
    TRC721_ID: 1001,

    Z_TRON: {
        fullNode: 'https://api.nileex.io/',
        solidityNode: 'https://api.nileex.io/',
        shieldedTRC20ContractAddress: 'TS9HZjJW11Uqj84GBtgCRitw9Fduzo3rqt',
        trc20ContractAddress: 'TKWMMoosiQ28196tuLMMw8AiuvHTXwPwkm',
        transParentToAddress: 'THph9K2M2nLvkianrMGswRhz5hjSA9fuH7'
    }
}
