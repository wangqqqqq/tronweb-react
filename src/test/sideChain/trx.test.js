import React from 'react';
const {DEPOSIT_FEE, WITHDRAW_FEE, FEE_LIMIT, PRIVATE_KEY} = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const publicMethod = require('../util/PublicMethod');
const tronWeb = tronWebBuilder.createInstanceSide();
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;

async function depositTrx(){
    const mAccountBefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountBefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mDepositBalanceBefore = mAccountBefore.balance;
    const sDepositBalanceBefore = sAccountBefore.balance;
    console.log('mDepositBalanceBefore: ' + mDepositBalanceBefore);
    console.log('sDepositBalanceBefore: ' + sDepositBalanceBefore);

    // depositTrx
    const depositNum = 10e7;
    let depositTrxMap = await publicMethod.depositTrx(depositNum);
    let depositTxFee = depositTrxMap.get("depositTxFee");

    const mAccountAfter = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountAfter = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mDepositBalanceAfter = mAccountAfter.balance;
    const sDepositBalanceAfter = sAccountAfter.balance;
    console.log('mDepositBalanceAfter: ' +  mDepositBalanceAfter)
    console.log('sDepositBalanceAfter: ' +  sDepositBalanceAfter)
    assert.equal(mDepositBalanceAfter, mDepositBalanceBefore - depositNum - depositTxFee - DEPOSIT_FEE);
    assert.equal(sDepositBalanceAfter, sDepositBalanceBefore + depositNum);

    // depositTrx with the defined private key
    let callValue = 10000000;
    let options = {};
    let txID = await tronWeb.sidechain.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)

    // depositTrx with permissionId in options object
    callValue = 10000000;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT, options);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)

    // depositTrx with permissionId in options object and the defined private key
    callValue = 10000000;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.depositTrx(callValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)

    // should throw if an invalid trx number is passed
    await assertThrow(
        tronWeb.sidechain.depositTrx(1000.01, DEPOSIT_FEE, FEE_LIMIT),
        'Invalid callValue provided'
    );

    // should throw if an invalid fee limit is passed
    await assertThrow(
        tronWeb.sidechain.depositTrx(10000, DEPOSIT_FEE, 0),
        'Invalid feeLimit provided'
    );
    await wait(90);

    console.log("execute depositTrx success")
}

async function withdrawTrx(){
    const mAcountBefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAcountBefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mWithdrawBalanceBefore = mAcountBefore.balance;
    const sWithdrawBalanceBefore = sAcountBefore.balance;
    console.log('mWithdrawBalanceBefore: ' + mWithdrawBalanceBefore);
    console.log('sWithdrawBalanceBefore: ' + sWithdrawBalanceBefore);

    // withdrawTrx
    const withdrawNum = 10e6;
    let withdrawTrxMap = await publicMethod.withdrawTrx(withdrawNum);
    let withdrawTxFee = withdrawTrxMap.get("withdrawTxFee");

    const mAccountAfter = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountAfter = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mWithdrawBalanceAfter = mAccountAfter.balance;
    const sWithdrawBalanceAfter = sAccountAfter.balance;
    console.log('mWithdrawBalanceAfter: ' +  mWithdrawBalanceAfter)
    console.log('sWithdrawBalanceAfter: ' +  sWithdrawBalanceAfter)
    assert.equal(mWithdrawBalanceBefore + withdrawNum, mWithdrawBalanceAfter);
    assert.equal(sWithdrawBalanceAfter, sWithdrawBalanceBefore - withdrawNum - WITHDRAW_FEE - withdrawTxFee);

    // withdraw trx from side chain to main chain
    let txID = await tronWeb.sidechain.withdrawTrx(10e6, WITHDRAW_FEE, 10000000);
    assert.equal(txID.length, 64);

    // withdrawTrx with the defined private key
    let callValue = 10e6;
    let options = {};
    txID = await tronWeb.sidechain.withdrawTrx(callValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // withdrawTrx with permissionId in options object
    callValue = 10e6;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.withdrawTrx(callValue, WITHDRAW_FEE, FEE_LIMIT, options);
    assert.equal(txID.length, 64);

    // withdrawTrx with permissionId in options object and the defined private key
    callValue = 10e6;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.withdrawTrx(callValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // should throw if an invalid trx number is passed
    await assertThrow(
        tronWeb.sidechain.withdrawTrx(1000.01, WITHDRAW_FEE, FEE_LIMIT),
        'Invalid callValue provided'
    );

    // should throw if an invalid fee limit is passed
    await assertThrow(
        tronWeb.sidechain.withdrawTrx(10000, WITHDRAW_FEE, 0),
        'Invalid feeLimit provided'
    );

    console.log("execute withdrawTrx success")
}

async function trxTestAll(){
    await depositTrx();
    await withdrawTrx();
}
export{
    trxTestAll
}