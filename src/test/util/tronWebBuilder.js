const chalk = require('chalk')
const TronWeb = require('tronweb');
const wait = require('../util/wait');
const jlog = require('./jlog')
const util = require('util');

const {FULL_NODE_API, SOLIDITY_NODE_API, EVENT_API, PRIVATE_KEY, SUN_NETWORK, SIDE_CHAIN, TEST_TRON_GRID_API} = require('./config')


const createInstanceSide = (extraOptions = {}, sideExtraOptions = {}) => {
    let options = Object.assign({
        // fullHost: SIDE_CHAIN.fullNode,
        fullHost: SIDE_CHAIN.fullNode,
        solidityNode: SIDE_CHAIN.solidityNode,
        eventServer: SIDE_CHAIN.eventServer,
        privateKey: PRIVATE_KEY,
    }, extraOptions)
    let sideOptions = Object.assign({
        // fullHost: SIDE_CHAIN.sideOptions.fullNode,
        fullNode: SIDE_CHAIN.sideOptions.fullNode,
        solidityNode: SIDE_CHAIN.sideOptions.solidityNode,
        eventServer: SIDE_CHAIN.sideOptions.eventServer,
        mainGatewayAddress: SIDE_CHAIN.sideOptions.mainGatewayAddress,
        sideGatewayAddress: SIDE_CHAIN.sideOptions.sideGatewayAddress,
        sideChainId: SIDE_CHAIN.sideOptions.sideChainId
    }, sideExtraOptions);
    return new TronWeb(options, sideOptions);
}

const createInstance = (extraOptions = {}) => {
    let options = Object.assign({
       // fullNode: FULL_NODE_API,
       // solidityNode: SOLIDITY_NODE_API,
       // // eventServer: EVENT_API,
        fullNode: SIDE_CHAIN.fullNode,
        solidityNode: SIDE_CHAIN.solidityNode,
        eventServer: SIDE_CHAIN.eventServer,
       //  fullHost: TEST_TRON_GRID_API,
        privateKey: PRIVATE_KEY,
    }, extraOptions)
    return new TronWeb(options);
}

let instance

const getInstance = () => {
    if (!instance) {
        instance = createInstance()
    }
    return instance
}

const newTestAccounts = async (amount) => {
    const tronWeb = createInstance();

    console.log(chalk.blue(`Generating ${amount} new accounts...`))
    await tronWeb.fullNode.request('/admin/temporary-accounts-generation?accounts=' + amount);
    const lastCreated = await getTestAccounts(-1)
    jlog(lastCreated.b58)
}

const getTestAccounts = async (block) => {
    const accounts = {
        b58: [],
        hex: [],
        pks: []
    }
    const tronWeb = createInstance();
    const accountsJson = await tronWeb.fullNode.request('/admin/accounts-json');
    const index = typeof block === 'number'
        ? (block > -1 && block < accountsJson.more.length ? block : accountsJson.more.length - 1)
        : undefined
    accounts.pks = typeof block === 'number'
        ? accountsJson.more[index].privateKeys
        : accountsJson.privateKeys;
    for (let i = 0; i < accounts.pks.length; i++) {
        let addr = tronWeb.address.fromPrivateKey(accounts.pks[i]);
        accounts.b58.push(addr);
        accounts.hex.push(tronWeb.address.toHex(addr));
    }
    return Promise.resolve(accounts);
}

const getTestAccountsInMain = async (amount) => {
    let accounts = {
        b58: [],
        hex: [],
        pks: []
    }
    const tronWeb = createInstance();
    for (let i = 0; i < amount; i++) {
        const emptyAccount = await TronWeb.createAccount();
        await tronWeb.trx.sendTrx(emptyAccount.address.hex,10000000000,{privateKey: PRIVATE_KEY})

        accounts.pks.push(emptyAccount.privateKey);
        accounts.b58.push(emptyAccount.address.base58);
        accounts.hex.push(emptyAccount.address.hex.toLocaleString().toLowerCase());
    }
    console.log("accounts:"+util.inspect(accounts,true,null,true));

   return Promise.resolve(accounts);
}

 const isTransactionConfirmed = async (txId, maxWait=10) => {
    const tronWeb = createInstance();
    // maxWait ： {} second;
    const begin = Date.now();
    maxWait = maxWait * 1000;
    let result = false;
    while (Date.now() - begin <= maxWait) {
        const tx = await tronWeb.trx.getTransactionInfo(txId);
        if (Object.keys(tx).length === 0) {
            await wait(3);
            continue;
        } else {
            result = true;
            // console.log("transaction result:", JSON.stringify(tx, null, 2));
            break;
        }
    }
    return result;
}


module.exports = {
    createInstance,
    getInstance,
    createInstanceSide,
    newTestAccounts,
    getTestAccounts,
    getTestAccountsInMain,
    isTransactionConfirmed,
    TronWeb
}

