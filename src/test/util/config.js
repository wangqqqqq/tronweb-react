const fullHost = "http://127.0.0.1:" + (process.env.HOST_PORT || 9090)

module.exports = {

    // PRIVATE_KEY: process.env.PRIVATE_KEY,
    // PRIVATE_KEY: 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0',
    PRIVATE_KEY: 'FC8BF0238748587B9617EB6D15D47A66C0E07C1A1959033CF249C6532DC29FE6',
    // PRIVATE_KEY: '9FD8E129DE181EA44C6129F727A6871440169568ADE002943EAD0E7A16D8EDAC',
    //  PRIVATE_KEY: '6815B367FDDE637E53E9ADC8E69424E07724333C9A2B973CFA469975E20753FC',
    //  PRIVATE_KEY: 'ce6a87e15d62c289717287136b23948cda9e0ab5b87f6352b489573f3fcdb41b',
    CONSUME_USER_RESOURCE_PERCENT: 30,
    FEE_LIMIT: 1000000000,
    // FULL_NODE_API: 'http://new.myservice.com',
    // SOLIDITY_NODE_API: 'http://new.myservice.com',
    // EVENT_API: 'http://newevent.myservice.com',
    FULL_NODE_API: 'http://main.myservice.com',
    SOLIDITY_NODE_API: 'http://main.myservice.com',
    EVENT_API: 'http://mainevent.myservice.com',
    // FULL_NODE_API: 'https://api.nileex.io',
    // SOLIDITY_NODE_API: 'https://api.nileex.io',
    // EVENT_API: 'https://nile.trongrid.io',
    NETWORK_ID: "*",
    // ADDRESS_HEX: '41928c9af0651632157ef27a2cf17ca72c575a4d21',
    // ADDRESS_BASE58: 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY',
    ADDRESS_HEX: '415624c12e308b03a1a6b21d9b86e3942fac1ab92b',
    ADDRESS_BASE58: 'THph9K2M2nLvkianrMGswRhz5hjSA9fuH7',
    WITNESS_ACCOUNT: 'TB4B1RMhoPeivkj4Hebm6tttHjRY9yQFes',
    WITNESS_KEY: '369F095838EB6EED45D4F6312AF962D5B9DE52927DA9F04174EE49F9AF54BC77',
    WITNESS_ACCOUNT2: 'TT1smsmhxype64boboU8xTuNZVCKP1w6qT',
    WITNESS_KEY2: '9fd8e129de181ea44c6129f727a6871440169568ade002943ead0e7a16d8edac',
    // ADDRESS_HEX: '41bafb56091591790e00aa05eaddcc7dc1474b5d4b',
    // ADDRESS_BASE58: 'TT1smsmhxype64boboU8xTuNZVCKP1w6qT',
    // ADDRESS_HEX: '41d1e7a6bc354106cb410e65ff8b181c600ff14292',
    // ADDRESS_BASE58: 'TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU',
    // ADDRESS_HEX: '4125c34b27ca968abbcd343cc4214c01d970b9440e',
    // ADDRESS_BASE58: 'TDQsxPhq9bgmnw9CeDSrXsYjqt2rb1b3pg',
    UPDATED_TEST_TOKEN_OPTIONS: {
        description: 'Very useless utility token',
        url: 'https://none.example.com',
        freeBandwidth: 10,
        freeBandwidthLimit: 100
    },
    TEST_TRON_GRID_API: 'http://trongrid.myservice.com',
        TEST_TRON_HEADER_API_KEY: '826c74b6-8f97-465f-99c1-e7ea5db0b9fd',
        TEST_TRON_HEADER_API_KEY2: '5788c434-8f78-459b-95dd-4d977ee080ba',
        TEST_TRON_HEADER_API_JWT_KEY: '4dc82750-57a1-4176-9ffe-8de7a2b5018a',
        TEST_TRON_HEADER_JWT_ID: '008f572b88cd44adb17d4bc3536d2d9c',
        TEST_TRON_HEADER_JWT_PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\n'
            + 'MIIEpAIBAAKCAQEA9AjO5R+uCIcP58OddqZ3MNyrltDMw8wotdzJBFEUrsyL/ug/\n'
            + 'EG2ciQ4PAfcml+yL17XzJr4P5DJJZ1TsYa27aSLB+7xWcgPACanYZegAPtpSF4e+\n'
            + 'ZpNmKknBVt1KFMD4hTHWWcFcv6eqMlMAW2qAXqiT5XnQdW+oQBDwyZt6DzjicBrP\n'
            + 'hAOA5NwjJJF5RvITCI5OR/ZjhZYjruPSpQGUlmNrxBoKvfSENAfBfp8W2ojOVgyF\n'
            + '64h/yHfXc0GcSVtC5zifrvRGki1c7ZXHSOplQ8uFzfOxk5QiZblNdM2YI3AEWvph\n'
            + 'TEjyvhrZne6CT2gcjND4xWsmedq7hlrHYsVA7QIDAQABAoIBACMyEgThqMv6DsUy\n'
            + 'ZUdzgsU9TlIWEzI6A7UW/rbsqrr7LUW6YT4RUP5DVM7Hwn0u1Ixr5YG0773NsuCA\n'
            + 'UwdTczAanzebVixjdhLuuBMafs6R1j0misNohteag5PvnnuXyUAMjAmt5Z6Oo/FW\n'
            + 'HzsQBSuhzJLQGsyVKgLzboblMZl4Jrciech9uBno0ZzGddBCmsjknHEmxhWUb0qJ\n'
            + 'EgKCj4FJCr2bNg0Q1rtI24VjDoSboxjY3e1zP6zcp2ZYdQDvqL7glGcF9Anba6nm\n'
            + 'RrW6FZ/HCe+2t/Vs2nhQFgHLtFPg4YaPt20bngH/p7/dRgh59zIvDMfHr543UPWo\n'
            + 'HxOA3oECgYEA+2ML0Fp59pqgJjkXExEzUFr4KZz0ODhsLtbIiEsgqrMRmiejtosJ\n'
            + 'vvwfIiPOQPzyFP49jc/IVJJufqE49tCVuYmzxkMIs8WpHIAILxCmXT56K1yDTp43\n'
            + 'uAja5bUMH21wK1w0Q1utQnc26NiMKGqeJhcqJY3+geqy+3nMxe4CaJkCgYEA+IM4\n'
            + 'yjao1WCimI6F69LuPOVJusZwXlGJmCK9rDDNrvT2tPBDGEf26Nud5wNRbxAfq3Z4\n'
            + 'AgM8E1+8vuafJNaSyhUBdMmRWq9/OhvQh8Cj7VHJIKABkRsmCIDEcy6JupdOrciu\n'
            + 'HuSAFi2aVRqeGgkwrMlV0TCWJvH8w0XV6+g/63UCgYAD29tckWb54BnBPHMcOdFd\n'
            + '1Gemy9/71PHkLivZ271eoW0NvroGnU/C/L/FmGMcIEXfCKANQzlCAxVrIDJtp3oE\n'
            + '5RY7XuANUmVsKJL3lfvXxpO9gqgJVuhoDMq/Z+4NtXJZWAr9VbTtJkNTg69zF1/i\n'
            + 'Gczt0qYrfFzO+2mnSCYFUQKBgQCfi8d682qjSx44aVALXek7yUzzj5D2zMxUkwFI\n'
            + 'ujBjAbwd4B6DSTh4uP6AIL44Wpaqgy16xU7ddVp9CRzlDqlA+glsTDh4izFYQiE3\n'
            + '9nKH2zkQLAm1ekOJs/nrpNYhqCCIK8214admFbL+rk8QkhPg6oWg/tt3d2Z6i6xS\n'
            + 'f1ICPQKBgQDE/F482n9DemzFiqleHAW1AhfSUKKUYs7kHuYVStlJ1iEcPS9aezLU\n'
            + 'rH4WZ2xKqbSvQNcyrdAP5TUORcJWc7zg6GCkRJdjXPOqk78n4tDmh2jtG826DAwY\n'
            + '6EcJbGmCAhqQNMDDF1dw8bvP2XGPVLD3hWjl+NqJCV0KXZdkZLqTbA==\n'
            + '-----END RSA PRIVATE KEY-----',
    getTokenOptions: () => {
        const rnd = Math.random().toString(36).substr(2);
        return {
            name: `Token${rnd}`,
            abbreviation: `T${rnd.substring(2).toUpperCase()}`,
            description: 'Useless utility token',
            url: `https://example-${rnd}.com/`,
            totalSupply: 100000000,
            saleEnd: Date.now() + 160000, // 1 minute
            frozenAmount: 5,
            frozenDuration: 1,
            trxRatio: 10,
            tokenRatio: 2,
            saleStart: Date.now() + 600,
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
        fullNode: 'http://main.myservice.com',
        solidityNode: 'http://main.myservice.com',
        eventServer: 'http://mainevent.myservice.com',
        // fullNode: 'http://39.107.81.225:9193',
        // solidityNode: 'http://39.107.81.225:9197',
        // eventServer: 'http://39.107.81.225:9190',
        // fullNode: 'https://testhttpapi.tronex.io',
        // solidityNode: 'https://testhttpapi.tronex.io',
        // eventServer: 'https://testhttpapi.tronex.io',
        // fullNode: 'https://api.nileex.io',
        // solidityNode: 'https://api.nileex.io',
        // eventServer: 'https://nile.trongrid.io',
        sideOptions: {
            // fullNode: 'https://suntest.tronex.io',
            // solidityNode: 'https://suntest.tronex.io',
            // eventServer: 'https://suntest.tronex.io',
            // mainGatewayAddress: 'TFLtPoEtVJBMcj6kZPrQrwEdM3W3shxsBU',
            // mainGatewayAddress_hex: '413af23f37da0d48234fdd43d89931e98e1144481b',
            // sideGatewayAddress: 'TRDepx5KoQ8oNbFVZ5sogwUxtdYmATDRgX',
            // sideGatewayAddress_hex: '41a74544b896f6a50f8ef1c2d64803c462cbdb019d',
            // sideChainId: '413AF23F37DA0D48234FDD43D89931E98E1144481B'
            fullNode: 'http://side.myservice.com',
            solidityNode: 'http://side.myservice.com',
            eventServer: 'http://side.myservice.com',
            mainGatewayAddress: 'TH3qs3nGmpweyXXccvpSKn8EaBYbXafk6i',
            mainGatewayAddress_hex: '414da950a9da5e7bce23c6fc8efc034272bab91a0d',
            sideGatewayAddress: 'TWrLwowiwSYMnVuymbrDir8C2UUy5tQshP',
            sideGatewayAddress_hex: '41e50e5c6c9e028dd2c7eae419f992cc20291c7956',
            sideChainId: '41F7AFFF7316CDA1E1BC9B21B7CC98BB84A4EA5510'
            /*fullNode: 'https://kageraex.io',
            solidityNode: 'https://kageraex.io',
            eventServer: 'https://kageraex.io',
            mainGatewayAddress: 'TF9xuGSBXuHuVGm6Z7zydFTDHXuNeny1Et',
            mainGatewayAddress_hex: '4138e16f3d0d982875d7ca8e221dbb511a4e836983',
            sideGatewayAddress: 'TWLoD341FRJ43JfwTPADRqGnUT4zEU3UxG',
            sideGatewayAddress_hex: '41df77ce160fb3935e3a9a2dde1deb3a672b2ebb31',
            sideChainId: '41C0D909CC323543142E77AAD3786389364B981EEC'*/
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
