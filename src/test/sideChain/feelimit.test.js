import React from 'react';
const {ADDRESS_BASE58,PRIVATE_KEY, FEE_LIMIT} = require('../util/config');
const testDeployRevert = require('../util/contracts').testDeployRevert;
const testTriggerError = require('../util/contracts').testTriggerError;
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const assert = require('assert');
const util = require('util');

async function mainBefore(){
    const tronWeb = tronWebBuilder.createInstance();
    const accountBalanceBefore1 = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore1: ' + accountBalanceBefore1);
    await tronWeb.trx.freezeBalance(1e6, 3, 'BANDWIDTH', {}, ADDRESS_BASE58)
    // await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(1e6, 'BANDWIDTH', ADDRESS_BASE58));
    await wait(60);
    while (true) {
        let accountBalanceBefore2 = await tronWeb.trx.getBalance(ADDRESS_BASE58);
        console.log('accountBalanceBefore2: ' + accountBalanceBefore2);
        if (accountBalanceBefore1 == accountBalanceBefore2) {
            await wait(3);
            continue;
        } else {
            break;
        }
    }
    return tronWeb;
}

async function sideBefore(){
    const tronWeb = tronWebBuilder.createInstanceSide();
    let accountBalanceBefore1 = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore1: ' + accountBalanceBefore1);
    await tronWeb.sidechain.sidechain.trx.freezeBalance(1e6, 3, 'BANDWIDTH', {}, ADDRESS_BASE58);
    await wait(60);
    while (true) {
        let accountBalanceBefore2 = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
        console.log('accountBalanceBefore2: ' + accountBalanceBefore2);
        if (accountBalanceBefore1 == accountBalanceBefore2) {
            await wait(3);
            continue;
        } else {
            break;
        }
    }

    return tronWeb;
}

async function mainDefaultFeelimitWithCreate() {
    const tronWeb = await mainBefore();
    // before create
    const accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // createSmartContract
    const options = {
        abi: testDeployRevert.abi,
        bytecode: testDeployRevert.bytecode,
        callValue: 20
    };
    const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
    console.log("transaction.txID:"+transaction.txID)
    assert.equal(transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            console.log('accountBalanceBeforexxx: ' + await tronWeb.trx.getBalance(ADDRESS_BASE58));
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const createTxFee = typeof(createInfo.fee)=="undefined"?0:createInfo.fee;
    console.log('createTxFee: ' + createTxFee)

    // after create
    assert.equal(createInfo.result, "FAILED");
    assert.equal(createInfo.receipt.result, "OUT_OF_ENERGY");
    if (createTxFee == 0) {
        assert.equal(createInfo.receipt.energy_usage_total, 15e5);
    } else {
        assert.equal(createTxFee, 15e7);
    }
    const accountBalanceAfter = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(accountBalanceBefore-createTxFee, accountBalanceAfter);
}

async function mainDefaultFeelimitWithTrigger() {
    const tronWeb = await mainBefore();

    // createSmartContract
    const options = {
        abi: testTriggerError.abi,
        bytecode: testTriggerError.bytecode,
    };
    const createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    console.log("createTransaction:"+util.inspect(createTransaction))
    const createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    console.log("createTx:"+util.inspect(createTx))
    console.log("createTx.transaction.txID:"+createTx.transaction.txID)
    assert.equal(createTx.transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const contractAddress = createInfo.contract_address;

    // before trigger
    const accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // triggerSmartContract
    const functionSelector = 'testBadJumpDestination()';
    const triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress, functionSelector, {}, [], ADDRESS_BASE58);
    console.log("triggerTransaction:"+util.inspect(triggerTransaction))
    const triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee: ' + triggerTxFee)

    // after create
    assert.equal(triggerInfo.result, "FAILED");
    assert.equal(triggerInfo.receipt.result, "BAD_JUMP_DESTINATION");
    if (triggerTxFee == 0) {
        assert.equal(triggerInfo.receipt.energy_usage_total, 15e5);
    } else {
        assert.equal(triggerTxFee, 15e7);
    }
    const accountBalanceAfter = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(accountBalanceBefore-triggerTxFee, accountBalanceAfter);
}

async function mainCustomizedFeelimitWithCreate() {
    const tronWeb = await mainBefore();

    // before create
    const accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // createSmartContract
    const options = {
        abi: testDeployRevert.abi,
        bytecode: testDeployRevert.bytecode,
        feeLimit:FEE_LIMIT,
        callValue: 20
    };
    const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
    console.log("transaction.txID:"+transaction.txID)
    assert.equal(transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const createTxFee = typeof(createInfo.fee)=="undefined"?0:createInfo.fee;
    console.log('createTxFee: ' + createTxFee)

    // after create
    assert.equal(createInfo.result, "FAILED");
    assert.equal(createInfo.receipt.result, "OUT_OF_ENERGY");
    const accountBalanceAfter = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    if (createTxFee == 0) {
        assert.equal(createInfo.receipt.energy_usage_total, 1e7);
        assert.equal(accountBalanceBefore, accountBalanceAfter);
    } else {
        assert.equal(createTxFee, FEE_LIMIT);
        assert.equal(accountBalanceBefore-FEE_LIMIT, accountBalanceAfter);
    }
}

async function mainCustomizedFeelimitWithTrigger() {
    const tronWeb = await mainBefore();

    // createSmartContract
    const options = {
        abi: testTriggerError.abi,
        bytecode: testTriggerError.bytecode,
    };
    const createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    console.log("createTransaction:"+util.inspect(createTransaction))
    const createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    console.log("createTx:"+util.inspect(createTx))
    console.log("createTx.transaction.txID:"+createTx.transaction.txID)
    assert.equal(createTx.transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const contractAddress = createInfo.contract_address;

    // before trigger
    const accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // triggerSmartContract
    const functionSelector = 'testBadJumpDestination()';
    const triggerOptions = {
        feeLimit:FEE_LIMIT
    };
    const triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddress, functionSelector, triggerOptions, [], ADDRESS_BASE58);
    console.log("triggerTransaction:"+util.inspect(triggerTransaction))
    const triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee: ' + triggerTxFee)

    // after create
    assert.equal(triggerInfo.result, "FAILED");
    assert.equal(triggerInfo.receipt.result, "BAD_JUMP_DESTINATION");
    const accountBalanceAfter = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    if (triggerTxFee == 0) {
        assert.equal(triggerInfo.receipt.energy_usage_total, 1e7);
        assert.equal(accountBalanceBefore, accountBalanceAfter);
    } else {
        assert.equal(triggerTxFee, FEE_LIMIT);
        assert.equal(accountBalanceBefore-FEE_LIMIT, accountBalanceAfter);
    }
}

async function sideDefaultFeelimitWithCreate() {
    console.log("execute sideDefaultFeelimitWithCreate start")
    const tronWeb = await sideBefore();

    // before create
    let accountBalanceBefore = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // createSmartContract
    const options = {
        abi: testDeployRevert.abi,
        bytecode: testDeployRevert.bytecode,
        callValue: 20
    };
    const transaction = await tronWeb.sidechain.sidechain.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    await broadcaster.broadcasterInSideChain(null, PRIVATE_KEY, transaction);
    console.log("transaction.txID:"+transaction.txID)
    assert.equal(transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.sidechain.sidechain.trx.getTransactionInfo(transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const createTxFee = typeof(createInfo.fee)=="undefined"?0:createInfo.fee;
    console.log('createTxFee: ' + createTxFee)

    // after create
    assert.equal(createInfo.result, "FAILED");
    assert.equal(createInfo.receipt.result, "OUT_OF_ENERGY");
    if (createTxFee == 0) {
        assert.equal(createInfo.receipt.energy_usage_total, 15e5);
    } else {
        assert.equal(createTxFee, 15e7);
    }
    const accountBalanceAfter = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(parseInt(accountBalanceBefore)-createTxFee, accountBalanceAfter);
    console.log("execute sideDefaultFeelimitWithCreate success")
}

async function sideDefaultFeelimitWithTrigger() {
    console.log("execute sideDefaultFeelimitWithTrigger start")
    const tronWeb = await sideBefore();

    // createSmartContract
    const options = {
        abi: testTriggerError.abi,
        bytecode: testTriggerError.bytecode,
    };
    const createTransaction = await tronWeb.sidechain.sidechain.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    console.log("createTransaction:"+util.inspect(createTransaction))
    const createTx = await broadcaster.broadcasterInSideChain(null, PRIVATE_KEY, createTransaction);
    console.log("createTx:"+util.inspect(createTx))
    console.log("createTx.transaction.txID:"+createTx.transaction.txID)
    assert.equal(createTx.transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.sidechain.sidechain.trx.getTransactionInfo(createTx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const contractAddress = createInfo.contract_address;

    // before trigger
    const accountBalanceBefore = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // triggerSmartContract
    const functionSelector = 'testBadJumpDestination()';
    const triggerTransaction = await tronWeb.sidechain.sidechain.transactionBuilder.triggerSmartContract(
        contractAddress, functionSelector, {}, [], ADDRESS_BASE58);
    console.log("triggerTransaction:"+util.inspect(triggerTransaction))
    const triggerTx = await broadcaster.broadcasterInSideChain(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    while (true) {
        triggerInfo = await tronWeb.sidechain.sidechain.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee: ' + triggerTxFee)

    // after create
    assert.equal(triggerInfo.result, "FAILED");
    assert.equal(triggerInfo.receipt.result, "BAD_JUMP_DESTINATION");
    if (triggerTxFee == 0) {
        assert.equal(triggerInfo.receipt.energy_usage_total, 15e5);
    } else {
        assert.equal(triggerTxFee, 15e7);
    }
    const accountBalanceAfter = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(parseInt(accountBalanceBefore)-triggerTxFee, accountBalanceAfter);
    console.log("execute sideDefaultFeelimitWithTrigger success")
}

async function sideCustomizedFeelimitWithCreate() {
    console.log("execute sideCustomizedFeelimitWithCreate start")
    const tronWeb = await sideBefore();

    // before create
    const accountBalanceBefore = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // createSmartContract
    const options = {
        abi: testDeployRevert.abi,
        bytecode: testDeployRevert.bytecode,
        feeLimit:FEE_LIMIT,
        callValue: 20
    };
    const transaction = await tronWeb.sidechain.sidechain.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    await broadcaster.broadcasterInSideChain(null, PRIVATE_KEY, transaction);
    console.log("transaction.txID:"+transaction.txID)
    assert.equal(transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.sidechain.sidechain.trx.getTransactionInfo(transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const createTxFee = typeof(createInfo.fee)=="undefined"?0:createInfo.fee;
    console.log('createTxFee: ' + createTxFee)

    // after create
    assert.equal(createInfo.result, "FAILED");
    assert.equal(createInfo.receipt.result, "OUT_OF_ENERGY");
    const accountBalanceAfter = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    if (createTxFee == 0) {
        assert.equal(createInfo.receipt.energy_usage_total, 1e7);
        assert.equal(parseInt(accountBalanceBefore), accountBalanceAfter);
    } else {
        assert.equal(createTxFee, FEE_LIMIT);
        assert.equal(parseInt(accountBalanceBefore)-FEE_LIMIT, accountBalanceAfter);
    }
    console.log("execute sideCustomizedFeelimitWithCreate success")
}

async function sideCustomizedFeelimitWithTrigger() {
    console.log("execute sideCustomizedFeelimitWithTrigger start")
    const tronWeb = await sideBefore();

    // createSmartContract
    const options = {
        abi: testTriggerError.abi,
        bytecode: testTriggerError.bytecode,
    };
    const createTransaction = await tronWeb.sidechain.sidechain.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    console.log("createTransaction:"+util.inspect(createTransaction))
    const createTx = await broadcaster.broadcasterInSideChain(null, PRIVATE_KEY, createTransaction);
    console.log("createTx:"+util.inspect(createTx))
    console.log("createTx.transaction.txID:"+createTx.transaction.txID)
    assert.equal(createTx.transaction.txID.length, 64);
    let createInfo;
    while (true) {
        createInfo = await tronWeb.sidechain.sidechain.trx.getTransactionInfo(createTx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("createInfo:"+util.inspect(createInfo))
            break;
        }
    }
    const contractAddress = createInfo.contract_address;

    // before trigger
    const accountBalanceBefore = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // triggerSmartContract
    const functionSelector = 'testBadJumpDestination()';
    const triggerOptions = {
        feeLimit:FEE_LIMIT
    };
    const triggerTransaction = await tronWeb.sidechain.sidechain.transactionBuilder.triggerSmartContract(
        contractAddress, functionSelector, triggerOptions, [], ADDRESS_BASE58);
    console.log("triggerTransaction:"+util.inspect(triggerTransaction))
    const triggerTx = await broadcaster.broadcasterInSideChain(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    while (true) {
        triggerInfo = await tronWeb.sidechain.sidechain.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee: ' + triggerTxFee)

    // after create
    assert.equal(triggerInfo.result, "FAILED");
    assert.equal(triggerInfo.receipt.result, "BAD_JUMP_DESTINATION");
    const accountBalanceAfter = await tronWeb.sidechain.sidechain.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(parseInt(accountBalanceBefore)-FEE_LIMIT, accountBalanceAfter);
    if (triggerTxFee == 0) {
        assert.equal(triggerInfo.receipt.energy_usage_total, 1e7);
        assert.equal(parseInt(accountBalanceBefore), accountBalanceAfter);
    } else {
        assert.equal(triggerTxFee, FEE_LIMIT);
        assert.equal(parseInt(accountBalanceBefore)-FEE_LIMIT, accountBalanceAfter);
    }
    console.log("execute sideCustomizedFeelimitWithTrigger success")
}

async function feelimitTestAll(){
    await mainDefaultFeelimitWithCreate();
    await mainDefaultFeelimitWithTrigger();
    await mainCustomizedFeelimitWithCreate();
    await mainCustomizedFeelimitWithTrigger();
    await sideDefaultFeelimitWithCreate();
    await sideDefaultFeelimitWithTrigger();
    await sideCustomizedFeelimitWithCreate();
    await sideCustomizedFeelimitWithTrigger();
}
export{
    feelimitTestAll
}