import React from 'react';
import Config from '../util/config.js'
const {ADDRESS_BASE58,PRIVATE_KEY, FEE_LIMIT} = Config;
import Contract from '../util/contracts.js'
import contracts from '../util/contracts.js'
const testFallbackOldVersion = contracts.fallbackOldVersionTest;
const fallbackOldversionCall = contracts.fallbackOldversionCall;
const TestPayable = contracts.TestPayable;
const Test0 = contracts.Test0
const Test1 = contracts.Test1
const Test2 = contracts.Test2
import tronWebBuilder from '../util/tronWebBuilder.js';
import broadcaster from '../util/broadcaster.js';
import wait from '../util/wait.js';
import { assert } from 'chai';
import util from 'util';

const tronWeb = tronWebBuilder.createInstance();
let contractAddressTest0;
let contractAddressTest1;
let contractAddressTest2;
let contractAddressTestPayable;

async function oldVersion(){
    console.log("execute oldVersion start")
    // createSmartContract
    let options = {
        abi: testFallbackOldVersion.abi,
        bytecode: testFallbackOldVersion.bytecode,
    };
    let createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    let createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    assert.equal(createTx.transaction.txID.length, 64);
    let createInfo;
    let count = 0;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            break;
        }
    }
    console.log("deploy testFallbackOldVersion end.");
    const contractAddressTest0 = createInfo.contract_address;
    options = {
        abi: fallbackOldversionCall.abi,
        bytecode: fallbackOldversionCall.bytecode,
    };
    createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    assert.equal(createTx.transaction.txID.length, 64);
    createInfo;
    count =0;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            break;
        }
    }
    console.log("deploy fallbackOldversionCall end.");
    const contractAddressCall = createInfo.contract_address;

    // before trigger
    let accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);
    await wait(20);
    accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);

    // triggerSmartContract
    const value = 1000000;
    const functionSelector = 'call(address)';
    let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressCall, functionSelector, {feeLimit:FEE_LIMIT, callValue: value}, [{type: 'address', value: contractAddressTest0}], ADDRESS_BASE58);
    let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    count =0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee: ' + triggerTxFee)

    // after trigger
    const accountBalanceAfter = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(parseInt(parseInt(accountBalanceBefore)-value-triggerTxFee), accountBalanceAfter);

    triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressCall, functionSelector, {feeLimit:FEE_LIMIT}, [{type: 'address', value: contractAddressTest0}], ADDRESS_BASE58);
    triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("Second triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    count =0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(1,tronWeb.BigNumber(triggerInfo.contractResult[0], 16).valueOf());
    console.log("execute oldVersion success")
}

async function fallbackUpgradeBeofre(){
    console.log("execute fallbackUpgradeBeofre start")
    // createSmartContract
    let options = {
        abi: Test0.abi,
        bytecode: Test0.bytecode,
    };
    let createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    let createTx0 = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    assert.equal(createTx0.transaction.txID.length, 64);
    options = {
        abi: Test1.abi,
        bytecode: Test1.bytecode,
    };
    createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    let createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    assert.equal(createTx.transaction.txID.length, 64);
    options = {
        abi: Test2.abi,
        bytecode: Test2.bytecode,
    };
    createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    let createTx2 = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    assert.equal(createTx2.transaction.txID.length, 64);
    options = {
        abi: TestPayable.abi,
        bytecode: TestPayable.bytecode,
    };
    createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    let createTx3 = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    assert.equal(createTx3.transaction.txID.length, 64);
    let createInfo0;
    let createInfo;
    let createInfo2;
    let createInfo3;
    let count =0;
    while (true) {
        createInfo0 = await tronWeb.trx.getTransactionInfo(createTx0.transaction.txID);
        createInfo = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
        createInfo2 = await tronWeb.trx.getTransactionInfo(createTx2.transaction.txID);
        createInfo3 = await tronWeb.trx.getTransactionInfo(createTx3.transaction.txID);
        if (Object.keys(createInfo0).length === 0 || Object.keys(createInfo).length === 0 || Object.keys(createInfo2).length === 0 || Object.keys(createInfo3).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            break;
        }
    }
    contractAddressTest0 = createInfo0.contract_address;
    contractAddressTest1 = createInfo.contract_address;
    contractAddressTest2 = createInfo2.contract_address;
    contractAddressTestPayable = createInfo3.contract_address;
    console.log("execute fallbackUpgradeBeofre success")
}

async function noFallbackAndNoReceive() {
    console.log("execute noFallbackAndNoReceive start")

    // triggerSmartContract
    const functionSelector = 'hello()';
    const triggerOptions = {
        feeLimit:FEE_LIMIT
    };
    console.log("contractAddressTest0: "+contractAddressTest0);
    let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTest0, functionSelector, triggerOptions, [], ADDRESS_BASE58);
    let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    let count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(triggerInfo.result, "FAILED");

    triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTest0, "  ", triggerOptions, [], ADDRESS_BASE58);
    triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo2:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(triggerInfo.result, "FAILED");
    console.log("execute noFallbackAndNoReceive success")
}

async function noCalldataAndNoCallvalue() {
    console.log("execute noCalldataAndNoCallvalue start")

    // trigger receive
    const triggerOptions = {
        feeLimit:FEE_LIMIT
    };
    let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTestPayable, "", triggerOptions, [], ADDRESS_BASE58);
    let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(triggerInfo.receipt.result, "SUCCESS");
    assert.equal("receive",tronWeb.toUtf8(triggerInfo.log[0].data.substr(128,14)));

    triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTest1, "    ", triggerOptions, [], ADDRESS_BASE58);
    triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(triggerInfo.receipt.result, "SUCCESS");
    assert.equal("fallback",tronWeb.toUtf8(triggerInfo.log[0].data.substr(128,16)));

    triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTest2, "", triggerOptions, [], ADDRESS_BASE58);
    triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(triggerInfo.receipt.result, "SUCCESS");
    assert.equal("fallback",tronWeb.toUtf8(triggerInfo.log[0].data.substr(128,16)));
    console.log("execute noCalldataAndNoCallvalue success")
}

async function noCalldataAndHasCallvalue() {
    console.log("execute noCalldataAndHasCallvalue start")

    // before trigger
    let accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);
    await wait(10);
    accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);
    await wait(10);
    accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);


    // trigger receive
    const value = 1000;
    const triggerOptions = {
        feeLimit:FEE_LIMIT,
        callValue:value
    };
    let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTestPayable, "", triggerOptions, [], ADDRESS_BASE58);
    let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    let triggerInfo;
    let count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee: ' + triggerTxFee)

    // after trigger
    assert.equal(triggerInfo.receipt.result, "SUCCESS");
    assert.equal("receive",tronWeb.toUtf8(triggerInfo.log[0].data.substr(128,14)));
    const accountBalanceAfter = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter: ' + accountBalanceAfter);
    assert.equal(parseInt(parseInt(accountBalanceBefore)-value-triggerTxFee), accountBalanceAfter);
    await wait(10);

    triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTest2, "", triggerOptions, [], ADDRESS_BASE58);
    triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    const triggerTxFee2 = typeof(triggerInfo.fee)=="undefined"?0:triggerInfo.fee;
    console.log('triggerTxFee2: ' + triggerTxFee2)
    assert.equal(triggerInfo.receipt.result, "SUCCESS");
    assert.equal("fallback",tronWeb.toUtf8(triggerInfo.log[0].data.substr(128,16)));
    const accountBalanceAfter2 = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceAfter2: ' + accountBalanceAfter2);
    assert.equal(parseInt(parseInt(accountBalanceAfter)-value-triggerTxFee2), accountBalanceAfter2);

    triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
        contractAddressTest1, "", triggerOptions, [], ADDRESS_BASE58);
    triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
    console.log("triggerTx:"+util.inspect(triggerTx))
    assert.equal(triggerTx.transaction.txID.length, 64);
    count = 0;
    while (true) {
        triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
        if (Object.keys(triggerInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("triggerInfo1:"+util.inspect(triggerInfo))
            break;
        }
    }
    assert.equal(triggerInfo.receipt.result, "REVERT");
    console.log("execute noCalldataAndHasCallvalue success")
}

async function fallbackTestAll(){
    await oldVersion();
    await fallbackUpgradeBeofre();
    await noFallbackAndNoReceive();
    await noCalldataAndNoCallvalue();
    await noCalldataAndHasCallvalue();
}
export{
    fallbackTestAll
}