import React from 'react';
const {PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58} = require('../util/config');
const testDeploy = require('../util/contracts').trc20Contract;
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const chai = require('chai');
const util = require('util');
const assert = chai.assert;
let tronWeb = tronWebBuilder.createInstance();
let contractAddress;

async function before() {
    // const tx = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
    //     abi: testDeploy.abi,
    //     bytecode: testDeploy.bytecode,
    //     parameters: [ADDRESS_BASE58]
    // }, ADDRESS_HEX), PRIVATE_KEY);
    // let testRevert = await tronWeb.contract().at(tx.transaction.contract_address);
    // console.log("tx.transaction.contract_address:"+tx.transaction.contract_address);
     const options = {
         abi: testDeploy.abi,
         bytecode: testDeploy.bytecode,
         parameters: [ADDRESS_BASE58],
     };
    const createTransaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
    // console.log("createTransaction:" + util.inspect(createTransaction))
    const createTx = await broadcaster.broadcaster(null, PRIVATE_KEY, createTransaction);
    // console.log("createTx:" + util.inspect(createTx))
    // console.log("createTx.transaction.txID:" + createTx.transaction.txID)
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
            console.log("createInfo:" + util.inspect(createInfo))
            break;
        }
    }
    contractAddress = createInfo.contract_address;
    // before trigger
    const accountBalanceBefore = await tronWeb.trx.getBalance(ADDRESS_BASE58);
    console.log('accountBalanceBefore: ' + accountBalanceBefore);
}
async function callMethod(){
    // triggerSmartContract
    const tw = await tronWeb.contract().at(contractAddress);
    const ts = await tw.totalSupply().call();
    console.log("ts:" + ts);
    assert.equal(ts,100000000000000);

    console.log("After clear abi and add local api,trigger constant method,result is ok");
    const clearAbiTransaction = await tronWeb.transactionBuilder.clearABI(contractAddress, ADDRESS_BASE58);
    console.log("clearAbiTransaction:" + util.inspect(clearAbiTransaction));
    const clearAbiTx = await broadcaster.broadcaster(null, PRIVATE_KEY, clearAbiTransaction);
    let count = 0;
    while (true) {
        let clearAbiInfo = await tronWeb.trx.getTransactionInfo(clearAbiTx.transaction.txID);
        if (Object.keys(clearAbiInfo).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("clearAbiInfo:" + util.inspect(clearAbiInfo))
            break;
        }
    }
    const tw1 = await tronWeb.contract(testDeploy.abi, contractAddress)
    const ts1 = await tw1.totalSupply().call()
    console.log("ts:" + ts1)
    assert.equal(ts1, 100000000000000);
}

async function isConstantCallTestAll(){
    console.log("isConstantCallTestAll start")
    await before();
    await callMethod();
    console.log("isConstantCallTestAll end")
}

export{
    isConstantCallTestAll
}
