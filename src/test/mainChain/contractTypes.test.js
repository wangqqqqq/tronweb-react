import React from 'react';
const {PRIVATE_KEY, ADDRESS_HEX, ADDRESS_BASE58} = require('../util/config');
const funcContractTypesCall= require('../util/contracts').funcContractTypesCall;
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const broadcaster = require('../util/broadcaster');
const publicMethod = require('../util/PublicMethod');
const wait = require('../util/wait');
const chai = require('chai');
const util = require('util');
const assert = chai.assert;
const TronWeb = tronWebBuilder.TronWeb;
let tronWeb = tronWebBuilder.createInstance();
let contractAddress;
let contractAddress1;
let account0;
let account1;
let transaction;
let transaction0;

async function before() {
    account0 = await TronWeb.createAccount();
    await tronWeb.trx.sendTrx(account0.address.hex,700000000,{privateKey: PRIVATE_KEY})
    account1 = await TronWeb.createAccount();
    await tronWeb.trx.sendTrx(account1.address.hex,700000000,{privateKey: PRIVATE_KEY})
    console.log(account0,account1);

    const tx = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
        abi: funcContractTypesCall.abi,
        bytecode: funcContractTypesCall.bytecode,
        parameters: [account0.address.hex,1000001,['1'],["0xdCad3a6d3569DF655070DEd0"]],feeLimit:1000e6
    }, ADDRESS_HEX,), PRIVATE_KEY);
    assert.equal(tx.transaction.txID.length, 64);
    let createInfo;
    let count = 0;
    while (true) {
        createInfo = await tronWeb.trx.getTransactionInfo(tx.transaction.txID);
        if (Object.keys(createInfo).length === 0) {
            await wait(3);
            count+=1;
            if(count >10){
                throw Error("time out failed!!");
            }
            continue;
        } else {
            console.log("createInfo:" + util.inspect(createInfo))
            break;
        }
    }
    contractAddress = createInfo.contract_address;
    console.log("contractAddress1: ",contractAddress);

    const tx2 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract({
        abi: funcContractTypesCall.abi,
        bytecode: funcContractTypesCall.bytecode,
        parameters: [account0.address.hex,1000001,['1'],["0xdCad3a6d3569DF655070DEd0"]],feeLimit:1000e6
    }, ADDRESS_HEX), PRIVATE_KEY);
    assert.equal(tx2.transaction.txID.length, 64);
    let createInfo2;
    count = 0;
    while (true) {
        createInfo2 = await tronWeb.trx.getTransactionInfo(tx2.transaction.txID);
        if (Object.keys(createInfo2).length === 0) {
            count +=1;
            if(count > 15){
              throw Error("time out failed!!");
            }
            await wait(3);
            continue;
        } else {
            console.log("createInfo2:" + util.inspect(createInfo2))
            break;
        }
    }
    contractAddress1 = createInfo2.contract_address;
    console.log("contractAddress1: ",contractAddress1);

}

async function triggertypeInt(){
    const issuerAddress = account0.address.hex;
    const transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000001efa6ad');
    //abiV2
    const functionSelector = 'changeInt(int256)';
    const parameter = [1];
    const options = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[18],parametersV2:parameter};
    const transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector,options,
        [], issuerAddress);
    const transaction1 = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction1.receipt.result);
    const transaction2 = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt()', {},
        [], issuerAddress);
    assert.equal(transaction2.constant_result, '0000000000000000000000000000000000000000000000000000000000000001');
    //abiV1
    const parameter1 = [{type: 'int256', value: 5}];
    const options1 = {feeLimit: 1000e6};
    const transaction3 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector,options1,
        parameter1, issuerAddress);
    const transaction4 = await broadcaster.broadcaster(null, account0.privateKey, transaction3.transaction);
    assert.isTrue(transaction4.receipt.result);

    const transaction5 = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt()', {},
        [], issuerAddress);
    assert.equal(transaction5.constant_result, '0000000000000000000000000000000000000000000000000000000000000005');
    console.log("triggertypeInt success")
}

async function triggerNegativeInt(){
    const issuerAddress = ADDRESS_HEX;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getNegativeInt()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffe105953');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'int256', value: 1}];
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeNegativeInt(int256)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getNegativeInt()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000001");

    //abiV2
    const parameter1 = [5];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[22],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeNegativeInt(int256)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getNegativeInt()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000005");
    console.log("triggerNegativeInt success")
}

async function triggerchangeUint(){
    console.log("triggerchangeUint start")
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getUint()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '000000000000000000000000000000000000000000000000000000000166654f');
    //abiv1
    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'uint256', value: 1}];
    console.log("issuerAddress:",issuerAddress)
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeUint(uint256)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getUint()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000001");

    //abiV2
    const parameter1 = [5];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[24],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeUint(uint256)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getUint()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    console.log("transaction:"+util.inspect(transaction,true,null,true))
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000005");
    console.log("triggerchangeUint end")
}

async function triggerChangeAddress() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getAddress()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, "000000000000000000000000"+account0.address.hex.slice(2).toLowerCase());

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'address', value: ADDRESS_BASE58}];
    console.log("issuerAddress:",issuerAddress)
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeAddress(address)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getAddress()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    // console.log(transaction.constant_result,"---=======",ADDRESS_HEX);
    assert.equal(transaction.constant_result,"000000000000000000000000"+ADDRESS_HEX.slice(2));

    //abiV2
    const parameter1 = ["TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s"];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[15],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeAddress(address)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getAddress()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"0000000000000000000000005ab90009b529c5406b4f8a6fc4dab8a2bc778c75");

}

async function triggerchangeBytes32() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getBytes32()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000dcad3a6d3569df655070ded0');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'bytes32', value: "0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105a"}];
    console.log("issuerAddress:",issuerAddress)
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeBytes32(bytes32)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getBytes32()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"b55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105a");

    //abiV2
    const parameter1 = ["0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd231088"];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[17],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeBytes32(bytes32)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getBytes32()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"b55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd231088");

};

async function triggerchangeBytes() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getBytes()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'bytes', value: "0x06"}];
    console.log("issuerAddress:",issuerAddress)
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeBytes(bytes)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getBytes()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010600000000000000000000000000000000000000000000000000000000000000");

    //abiV2
    const parameter1 = ["0x08"];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[16],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeBytes(bytes)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getBytes()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010800000000000000000000000000000000000000000000000000000000000000");
    console.log("triggerchangeBytes success")
}

async function triggerchangeString() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getString()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000063132337177650000000000000000000000000000000000000000000000000000');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'string', value: "1q2w"}];
    console.log("issuerAddress:",issuerAddress)
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeString(string)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getString()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000043171327700000000000000000000000000000000000000000000000000000000");

    //abiV2
    const parameter1 = ["abe321"];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[23],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeString(string)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getString()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000066162653332310000000000000000000000000000000000000000000000000000");

};

async function triggerActionChoices() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getActionChoices()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000001');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'uint8', value: "2"}];
    console.log("issuerAddress:",issuerAddress)
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeActionChoices(uint8)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getActionChoices()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000002");

    //abiV2
    const parameter1 = ["3"];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[14],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeActionChoices(uint8)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getActionChoices()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000003");
};

async function triggerchangeint64Array() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt64NegativeArray()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0000000000000000000000000000000000000000000000000000000000000002fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'int64[]', value: [1,-12,3]}];
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeInt64NegativeArray(int64[])', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt64NegativeArray()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000001fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff40000000000000000000000000000000000000000000000000000000000000003");

    //abiV2
    const parameter1 = [[1,3]];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[21],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeInt64NegativeArray(int64[])",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt64NegativeArray()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000003");
    console.log("triggerchangeint64Array success")
};

async function triggerchangeuint32Array() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt32Array()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'uint32[2][]', value: [[5, 6], [7, 8], [9, 10]]}];
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeInt32Array(uint32[2][])', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt32Array()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000700000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000009000000000000000000000000000000000000000000000000000000000000000a");

    //abiV2
    const parameter1 = [[[2, 4], [3, 5], [4, 6]]];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[20],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeInt32Array(uint32[2][])",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt32Array()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000006");

};

async function triggerchangeuint256Array() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt256Array()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '000000000000000000000000000000000000000000000000000000000000000b00000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000021000000000000000000000000000000000000000000000000000000000000002c');

    const options = {feeLimit: 1000000000};
    const parameterN = [{type: 'uint256[2][2]', value:[[100, 122], [133, 144]]}];
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'changeInt256Array(uint256[2][2])', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt256Array()', {},
        [], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    console.log(transaction.constant_result);
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000007a00000000000000000000000000000000000000000000000000000000000000850000000000000000000000000000000000000000000000000000000000000090");

    //abiV2
    const parameter1 = [[[1, 2], [3, 4]]];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[19],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "changeInt256Array(uint256[2][2])",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getInt256Array()', {},
        [], issuerAddress);
    assert.equal(transaction.constant_result,"0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000004");

};

async function triggersetMappinga() {
    const issuerAddress = account0.address.hex;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getMappinga(address)', {},
        [{type: 'address', value:"THph9K2M2nLvkianrMGswRhz5hjSA9fuH7"}], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, await publicMethod.to64String("0"));

    const options = {feeLimit: 1000000000};
    const val = 1111;
    const parameterN = [{type: 'uint256', value:val}];
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, 'setMappinga(uint256)', options,
        parameterN, issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getMappinga(address)', {},
        [{type: 'address', value:issuerAddress}], issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result,await publicMethod.to64String(val.toString(16)));

    //abiV2
    const parameter1 = ["10"];
    const options1 = {feeLimit: 1000e6,funcABIV2:funcContractTypesCall.abi[40],parametersV2:parameter1};
    transaction0 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, "setMappinga(uint256)",options1,
        [], issuerAddress);
    assert.isTrue(transaction0.result.result &&
        transaction0.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    transaction = await broadcaster.broadcaster(null, account0.privateKey, transaction0.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, 'getMappinga(address)', {},
        [{type: 'address', value:issuerAddress}], issuerAddress);
    assert.equal(transaction.constant_result,"000000000000000000000000000000000000000000000000000000000000000a");
};

async function callsendInt() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getInt().call();
    const Before = parseInt(dataBefore._hex, 16);
    assert.equal(Before, 32482989);

    const val = 123;
    let result = await contractInstance.changeInt(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(parseInt(result._hex, 16),val);

    const dataAfter = await contractInstance.getInt().call();
    const After = parseInt(dataAfter._hex, 16);
    assert.equal(After, val);
};

async function callsendNegativeInt() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getNegativeInt().call();
    const Before = parseInt(dataBefore._hex, 16);
    assert.equal(Before, -32482989);

    const val = -1123;
    let result = await contractInstance.changeNegativeInt(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(parseInt(result._hex, 16),val);

    const dataAfter = await contractInstance.getNegativeInt().call();
    const After = parseInt(dataAfter._hex, 16);
    assert.equal(After, val);
};

async function callsendchangeUint() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getUint().call();
    const Before = parseInt(dataBefore._hex, 16);
    assert.equal(Before, 23487823);

    const val = 1123;
    let result = await contractInstance.changeUint(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(parseInt(result._hex, 16),val);

    const dataAfter = await contractInstance.getUint().call();
    const After = parseInt(dataAfter._hex, 16);
    assert.equal(After, val);
};

async function callsendchangeAddress() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getAddress().call();
    assert.equal(dataBefore, account0.address.hex.toLowerCase());

    const val = account1.address.hex.toLowerCase();
    let result = await contractInstance.changeAddress(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(result,val);

    const dataAfter = await contractInstance.getAddress().call();
    assert.equal(dataAfter, val);
};

async function callsendchangeBytes32() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getBytes32().call();
    assert.equal(dataBefore, "0x0000000000000000000000000000000000000000dcad3a6d3569df655070ded0");

    const val = "0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105a";
    let result = await contractInstance.changeBytes32(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(result,val);

    const dataAfter = await contractInstance.getBytes32().call();
    assert.equal(dataAfter, val);
};

async function callsendchangeBytes() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getBytes().call();
    assert.equal(dataBefore, "0x000000");

    const val = "0xb55a21aaee0ce8f1c8ffaa0dbd23105cb55a21aaee0ce8f1c8ffaa0dbd23105890";
    let result = await contractInstance.changeBytes(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(result,val);

    const dataAfter = await contractInstance.getBytes().call();
    assert.equal(dataAfter, val);
};

async function callsendchangeString() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const dataBefore = await contractInstance.getString().call();
    // console.log(dataBefore,"--------");
    assert.equal(dataBefore, "123qwe");

    const val = "b55a21aaee0ce8f1c8ff122344400403lkkhhj";
    let result = await contractInstance.changeString(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    });
    // console.log(result,"=========");
    assert.equal(result,val);

    const dataAfter = await contractInstance.getString().call();
    assert.equal(dataAfter, val);
    console.log("callsendchangeString execute success")
};

async function callsendActionChoices() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getActionChoices().call();
    assert.equal(dataBefore, 1);

    const val = "3";
    let result = await contractInstance.changeActionChoices(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(result,val);

    const dataAfter = await contractInstance.getActionChoices().call();
    assert.equal(dataAfter, val);
    console.log("callsendActionChoices execute success")
};

async function callsendint64Array() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getInt64NegativeArray().call();
    assert.equal(parseInt(dataBefore[0]._hex, 16), -1);
    assert.equal(parseInt(dataBefore[1]._hex, 16), 2);
    assert.equal(parseInt(dataBefore[2]._hex, 16), -3);

    const val = [-111,123];
    let result = await contractInstance.changeInt64NegativeArray(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(parseInt(result[0]._hex, 16), val[0]);
    assert.equal(parseInt(result[1]._hex, 16), val[1]);

    const dataAfter = await contractInstance.getInt64NegativeArray().call();
    assert.equal(parseInt(dataAfter[0]._hex, 16), val[0]);
    assert.equal(parseInt(dataAfter[1]._hex, 16), val[1]);
    console.log("callsendint64Array execute success")

};

async function callsenduint32Array() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getInt32Array().call();
    assert.equal(dataBefore[0][0], 1);
    assert.equal(dataBefore[0][1], 2);
    assert.equal(dataBefore[1][0], 3);
    assert.equal(dataBefore[1][1], 4);
    assert.equal(dataBefore[2][0], 5);
    assert.equal(dataBefore[2][1], 6);

    const val = [[122, 332], [991, 884]];
    let result = await contractInstance.changeInt32Array(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(result[0][0], val[0][0]);
    assert.equal(result[0][1], val[0][1]);
    assert.equal(result[1][0], val[1][0]);
    assert.equal(result[1][1], val[1][1]);

    const dataAfter = await contractInstance.getInt32Array().call();
    assert.equal(dataAfter[0][0], val[0][0]);
    assert.equal(dataAfter[0][1], val[0][1]);
    assert.equal(dataAfter[1][0], val[1][0]);
    assert.equal(dataAfter[1][1], val[1][1]);
    console.log("callsenduint32Array execute success")
};

async function callsenduint256Array() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getInt256Array().call();
    assert.equal(parseInt(dataBefore[0][0]._hex, 16), 11);
    assert.equal(dataBefore[0][1], 22);
    assert.equal(dataBefore[1][0], 33);
    assert.equal(dataBefore[1][1], 44);

    const val = [[100, 122], [133, 144]];
    let result = await contractInstance.changeInt256Array(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    })
    assert.equal(result[0][0], val[0][0]);
    assert.equal(result[0][1], val[0][1]);
    assert.equal(result[1][0], val[1][0]);
    assert.equal(result[1][1], val[1][1]);

    const dataAfter = await contractInstance.getInt256Array().call();
    assert.equal(dataAfter[0][0], val[0][0]);
    assert.equal(dataAfter[0][1], val[0][1]);
    assert.equal(dataAfter[1][0], val[1][0]);
    assert.equal(dataAfter[1][1], val[1][1]);
    console.log("callsenduint256Array execute success")
};

async function callsendsetMappinga() {
    const contractInstance = await tronWeb.contract(funcContractTypesCall.abi,contractAddress1);
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    const dataBefore = await contractInstance.getMappinga(address).call();
    assert.equal(dataBefore, 0);

    const val = 1122;
    let result = await contractInstance.setMappinga(val).send({
        feeLimit:1000000000,
        callValue:0,
        tokenId:0,
        tokenValue:0,
        shouldPollResponse:true
    });
    assert.equal(result, val);

    const dataAfter = await contractInstance.getMappinga(address).call();
    assert.equal(dataAfter, val);
    console.log("callsendsetMappinga execute success")
};



async function contractTypesTestAll(){
    console.log("contractTypesTestAll start")
    await before();
    await triggertypeInt();
    await triggerNegativeInt();
    await triggerchangeUint();
    await triggerChangeAddress();
    await triggerchangeBytes32();
    await triggerchangeBytes();
    await triggerchangeString();
    await triggerActionChoices();
    await triggerchangeint64Array();
    await triggerchangeuint32Array();
    await triggerchangeuint256Array();    //sometimes error.
    await triggersetMappinga();

    await callsendInt();
    await callsendNegativeInt();
    await callsendchangeUint();
    await callsendchangeAddress();
    await callsendchangeBytes32();
    await callsendchangeBytes();
    await callsendchangeString();
    await callsendActionChoices();
    await callsendint64Array();
    await callsenduint32Array();
    await callsenduint256Array();
    await callsendsetMappinga();
    console.log("contractTypesTestAll end")
}

export{
    contractTypesTestAll
}
