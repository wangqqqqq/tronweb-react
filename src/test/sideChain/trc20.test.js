import React from 'react';
const {PRIVATE_KEY,MAPPING_FEE, DEPOSIT_FEE, WITHDRAW_FEE, FEE_LIMIT, ADDRESS_BASE58, SIDE_CHAIN} = require('../util/config');
const trc20Contract = require('../util/contracts').trc20Contract;
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const publicMethod = require('../util/PublicMethod');
const tronWeb = tronWebBuilder.createInstanceSide();
const broadcaster = require('../util/broadcaster');
const wait = require('../util/wait');
const chai = require('chai');
const util = require('util');
const assert = chai.assert;
let createTxId;
let contractAddress;
let sideChainContractAddress;

async function trc20Before(){
    let deployMap = await publicMethod.deployTrc20ContractAndMapping();
    createTxId = deployMap.get("createTxId");
    contractAddress = deployMap.get("contractAddress");
    sideChainContractAddress = deployMap.get("sideChainContractAddress");
}

async function depositTrc20(){
    // before trx balance
    const mAccountbefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountbefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceBefore = mAccountbefore.balance;
    const sTrxBalanceBefore = sAccountbefore.balance;
    console.log('mTrxBalanceBefore: ' + mTrxBalanceBefore);
    console.log('sTrxBalanceBefore: ' + sTrxBalanceBefore);

    // approve
    let approveNum = 1000;
    let approveTrc20Map = await publicMethod.approveTrc20(approveNum, contractAddress);
    let approveTxFee = approveTrc20Map.get("approveTxFee");

    // before token balance
    const address = tronWeb.address.fromPrivateKey(PRIVATE_KEY);
    let mTrc20Contract = await tronWeb.sidechain.mainchain.contract().at(contractAddress);
    let mTrc20BalanceBefore = await mTrc20Contract.balanceOf(address).call();
    // mTrc20BalanceBefore = parseInt(mTrc20BalanceBefore, 16);
    console.log("mTrc20BalanceBefore："+mTrc20BalanceBefore);
    let sTrc20balanceResultBefore=await tronWeb.sidechain.sidechain.transactionBuilder.triggerSmartContract(
        sideChainContractAddress,
        'balanceOf(address)',
        {_isConstant: true},
        [{type: 'address', value: address}]);
    const sTrc20BalanceBefore = sTrc20balanceResultBefore && sTrc20balanceResultBefore.result ? new tronWeb.BigNumber(sTrc20balanceResultBefore.constant_result[0], 16).valueOf() : 0;
    console.log("sTrc20BalanceBefore:"+sTrc20BalanceBefore);

    // depositTrc20
    const depositNum = 1000;
    let depositTrc20Map = await publicMethod.depositTrc20(depositNum, contractAddress);
    let depositTxFee = depositTrc20Map.get("depositTxFee");

    // after trx balance
    const mAccountAfter = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountAfter = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceAfter = mAccountAfter.balance;
    const sTrxBalanceAfter = sAccountAfter.balance;
    console.log('mTrxBalanceAfter: ' + mTrxBalanceAfter);
    console.log('sTrxBalanceAfter: ' + sTrxBalanceAfter);
    assert.equal(mTrxBalanceBefore-depositTxFee-approveTxFee-DEPOSIT_FEE,mTrxBalanceAfter);
    assert.equal(sTrxBalanceBefore,sTrxBalanceAfter);

    // after token balance
    let mTrc20BalanceAfter = await mTrc20Contract.balanceOf(address).call();
    // mTrc20BalanceAfter = parseInt(mTrc20BalanceAfter, 16);
    console.log("mTrc20BalanceAfter："+mTrc20BalanceAfter);
    let sTrc20balanceResultAfter=await tronWeb.sidechain.sidechain.transactionBuilder.triggerSmartContract(
        sideChainContractAddress,
        'balanceOf(address)',
        {_isConstant: true},
        [{type: 'address', value: address}]);
    const sTrc20BalanceAfter = sTrc20balanceResultAfter && sTrc20balanceResultAfter.result ? new tronWeb.BigNumber(sTrc20balanceResultAfter.constant_result[0], 16).valueOf() : 0;
    console.log("sTrc20BalanceAfter:"+sTrc20BalanceAfter);
    assert.equal(mTrc20BalanceBefore-depositNum,mTrc20BalanceAfter.toString());
    assert.equal(parseInt(sTrc20BalanceBefore)+parseInt(depositNum),sTrc20BalanceAfter);

    // deposit trc20 from main chain to side chain
    let num = 100;
    let txID = await tronWeb.sidechain.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, contractAddress);
    assert.equal(txID.length, 64);

    // depositTrc20 with the defined private key
    num = 100;
    let options = {};
    txID = await tronWeb.sidechain.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, contractAddress, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // depositTrc20 with permissionId in options object
    num = 100;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, contractAddress, options);
    assert.equal(txID.length, 64);

    // depositTrc20 with permissionId in options object and the defined private key
    num = 100;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, contractAddress, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // should throw if an invalid num is passed
    num = 100.01;
    await assertThrow(
        tronWeb.sidechain.depositTrc20(num, DEPOSIT_FEE, FEE_LIMIT, contractAddress),
        'Invalid num provided'
    );

    // should throw if an invalid fee limit is passed
    num = 100;
    let feeLimit = 100000000000;
    await assertThrow(
        tronWeb.sidechain.depositTrc20(num, DEPOSIT_FEE, feeLimit, contractAddress),
        'Invalid feeLimit provided'
    );

    // should throw if an invalid contract address is passed
    await assertThrow(
        tronWeb.sidechain.depositTrc20(100, DEPOSIT_FEE, FEE_LIMIT, 'aaaaaaaaaa'),
        'Invalid contractAddress address provided'
    );
    await wait(90);

    console.log("execute depositTrc20 success")
}

async function mappingTrc20(){
    // mappingTrc20 with the defined private key
    let deployMap = await publicMethod.deployTrc20Contract();
    createTxId = deployMap.get("createTxId");
    let options = {};
    let txID = await tronWeb.sidechain.mappingTrc20(createTxId, MAPPING_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)
    await wait(20)

    // mappingTrc20 with permissionId in options object
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.mappingTrc20(createTxId, MAPPING_FEE, FEE_LIMIT, options);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)
    await wait(20)

    // mappingTrc20 with permissionId in options object and the defined private key
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.mappingTrc20(createTxId, MAPPING_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)
    await wait(20)

    // should throw if an invalid trxHash
    let trxHash = '';
    await assertThrow(
        tronWeb.sidechain.mappingTrc20(trxHash, MAPPING_FEE, FEE_LIMIT),
        'Invalid trxHash provided'
    );

    // should throw if an invalid fee limit is passed
    let feeLimit = 100000000000;
    await assertThrow(
        tronWeb.sidechain.mappingTrc20(createTxId, MAPPING_FEE, feeLimit),
        'Invalid feeLimit provided'
    );

    console.log("execute mappingTrc20 success")
}

async function withdrawTrc20(){
    // before token balance
    let mTrc20Contract = await tronWeb.sidechain.mainchain.contract().at(contractAddress);
    let mTrc20BalanceBefore = await mTrc20Contract.balanceOf(ADDRESS_BASE58).call();
    console.log("mTrc20BalanceBefore："+mTrc20BalanceBefore);
    let sTrc20balanceResultBefore=await tronWeb.sidechain.sidechain.transactionBuilder.triggerSmartContract(
        sideChainContractAddress,
        'balanceOf(address)',
        {_isConstant: true},
        [{type: 'address', value: ADDRESS_BASE58}]);
    const sTrc20BalanceBefore = sTrc20balanceResultBefore && sTrc20balanceResultBefore.result ? new tronWeb.BigNumber(sTrc20balanceResultBefore.constant_result[0], 16).valueOf() : 0;
    console.log("sTrc20BalanceBefore:"+sTrc20BalanceBefore);

    // before trx balance
    const mAccountbefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountbefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceBefore = mAccountbefore.balance;
    const sTrxBalanceBefore = sAccountbefore.balance;
    console.log('mTrxBalanceBefore: ' + mTrxBalanceBefore);
    console.log('sTrxBalanceBefore: ' + sTrxBalanceBefore);

    // withdrawTrc20
    const depositNum = 10;
    let withdrawTrc20Map = await publicMethod.withdrawTrc20(depositNum, sideChainContractAddress);
    let withdrawTxFee = withdrawTrc20Map.get("withdrawTxFee");

    // after trx balance
    const mAccountAfter = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountAfter = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceAfter = mAccountAfter.balance;
    const sTrxBalanceAfter = sAccountAfter.balance;
    console.log('mTrxBalanceAfter: ' + mTrxBalanceAfter);
    console.log('sTrxBalanceAfter: ' + sTrxBalanceAfter);
    assert.equal(mTrxBalanceBefore,mTrxBalanceAfter);
    assert.equal(sTrxBalanceBefore-withdrawTxFee-WITHDRAW_FEE,sTrxBalanceAfter);

    // after token balance
    let mTrc20BalanceAfter = await mTrc20Contract.balanceOf(ADDRESS_BASE58).call();
    console.log("mTrc20BalanceAfter："+mTrc20BalanceAfter);
    let sTrc20balanceResultAfter=await tronWeb.sidechain.sidechain.transactionBuilder.triggerSmartContract(
        sideChainContractAddress,
        'balanceOf(address)',
        {_isConstant: true},
        [{type: 'address', value: ADDRESS_BASE58}]);
    const sTrc20BalanceAfter = sTrc20balanceResultAfter && sTrc20balanceResultAfter.result ? new tronWeb.BigNumber(sTrc20balanceResultAfter.constant_result[0], 16).valueOf() : 0;
    console.log("sTrc20BalanceAfter:"+sTrc20BalanceAfter);
    assert.equal(parseInt(mTrc20BalanceBefore)+parseInt(depositNum),mTrc20BalanceAfter);
    assert.equal(sTrc20BalanceBefore-depositNum,sTrc20BalanceAfter);

    // withdrawTrc20 with the defined private key
    let num = 10;
    let options = {};
    let txID = await tronWeb.sidechain.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, sideChainContractAddress, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // withdrawTrc20 with permissionId in options object
    num = 10;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, sideChainContractAddress, options);
    assert.equal(txID.length, 64);

    // withdrawTrc20 with permissionId in options object and the defined private key
    num = 10;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, sideChainContractAddress, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // should throw if an invalid num is passed
    num = 10.01;
    await assertThrow(
        tronWeb.sidechain.withdrawTrc20(num, WITHDRAW_FEE, FEE_LIMIT, sideChainContractAddress),
        'Invalid numOrId provided'
    );

    // should throw if an invalid fee limit is passed
    let feeLimit = 100000000000;
    await assertThrow(
        tronWeb.sidechain.withdrawTrc20(100, WITHDRAW_FEE, feeLimit, sideChainContractAddress),
        'Invalid feeLimit provided'
    );

    // should throw if an invalid contract address is passed
    await assertThrow(
        tronWeb.sidechain.withdrawTrc20(100, WITHDRAW_FEE, FEE_LIMIT, 'aaaaaaaaaa'),
        'Invalid contractAddress address provided'
    );

    console.log("execute withdrawTrc20 success")
}

async function trc20TestAll(){
    await trc20Before();
    await depositTrc20();
    await mappingTrc20();
    await withdrawTrc20();
}
export{
    trc20TestAll
}