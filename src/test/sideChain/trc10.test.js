import React from 'react';
const {DEPOSIT_FEE, WITHDRAW_FEE, FEE_LIMIT, TOKEN_ID, PRIVATE_KEY} = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const publicMethod = require('../util/PublicMethod');
const tronWeb = tronWebBuilder.createInstanceSide();
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;

async function depositTrc10(){
    // before trx balance
    const mAccountbefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountbefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceBefore = mAccountbefore.balance;
    const sTrxBalanceBefore = sAccountbefore.balance;
    console.log('mTrxBalanceBefore: ' + mTrxBalanceBefore);
    console.log('sTrxBalanceBefore: ' + sTrxBalanceBefore);

    // before token balance
    const mAccountBefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const mTrc10BalanceBefore = mAccountBefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
    console.log("mAccountBefore.assetV2:"+mTrc10BalanceBefore);
    const sAccountBefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const sTrc10BalanceBefore = sAccountBefore.assetV2 ? sAccountBefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value : 0;
    console.log("sAccountBefore.assetV2:"+sTrc10BalanceBefore);

    // depositTrc10
    const depositNum = 1000;
    let depositTrc10Map = await publicMethod.depositTrc10(depositNum);
    let depositTxFee = depositTrc10Map.get("depositTxFee");

    // after trx balance
    const mAccountAfter = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountAfter = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceAfter = mAccountAfter.balance;
    const sTrxBalanceAfter = sAccountAfter.balance;
    console.log('mTrxBalanceAfter: ' + mTrxBalanceAfter);
    console.log('sTrxBalanceAfter: ' + sTrxBalanceAfter);
    assert.equal(parseInt(mTrxBalanceBefore)-depositTxFee-DEPOSIT_FEE,mTrxBalanceAfter);
    assert.equal(sTrxBalanceBefore,sTrxBalanceAfter);

    // after token balance
    const mTrc10BalanceAfter = mAccountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
    console.log("mAccountAfter.assetV2:"+mTrc10BalanceAfter);
    const sTrc10BalanceAfter = sAccountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
    console.log("sAccountAfter.assetV2:"+sTrc10BalanceAfter);
    assert.equal(mTrc10BalanceBefore-depositNum,mTrc10BalanceAfter);
    assert.equal(sTrc10BalanceBefore+depositNum,sTrc10BalanceAfter);

    // depositTrc10 with the defined private key
    let tokenValue = 10;
    let options = {};
    let txID = await tronWeb.sidechain.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)

    // depositTrc10 with permissionId in options object
    tokenValue = 10;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT, options);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)

    // depositTrc10 with permissionId in options object and the defined private key
    tokenValue = 10;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);
    console.log("txID: "+txID)

    // should throw if an invalid token id is passed
    let tokenId = -10;
    await assertThrow(
        tronWeb.sidechain.depositTrc10(tokenId, 100, DEPOSIT_FEE, FEE_LIMIT),
        'Invalid tokenId provided'
    )

    // should throw if an invalid token value is passed
    tokenValue = 100.01;
    await assertThrow(
        tronWeb.sidechain.depositTrc10(TOKEN_ID, tokenValue, DEPOSIT_FEE, 1000000),
        'Invalid tokenValue provided'
    );

    // should throw if an invalid fee limit is passed
    const feeLimit = 10000000000
    await assertThrow(
        tronWeb.sidechain.depositTrc10(TOKEN_ID, 100, DEPOSIT_FEE, feeLimit),
        'Invalid feeLimit provided'
    );
    await wait(90);

    console.log("execute depositTrc10 success")
}

async function withdrawTrc10(){
    // before trx balance
    const mAccountbefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountbefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceBefore = mAccountbefore.balance;
    const sTrxBalanceBefore = sAccountbefore.balance;
    console.log('mTrxBalanceBefore: ' + mTrxBalanceBefore);
    console.log('sTrxBalanceBefore: ' + sTrxBalanceBefore);

    // before token balance
    const mAccountBefore = await tronWeb.sidechain.mainchain.trx.getAccount();
    const mTrc10BalanceBefore = mAccountBefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
    console.log("mAccountBefore.assetV2:"+mTrc10BalanceBefore);
    const sAccountBefore = await tronWeb.sidechain.sidechain.trx.getAccount();
    const sTrc10BalanceBefore = sAccountBefore.assetV2 ? sAccountBefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value : 0;
    console.log("sAccountBefore.assetV2:"+sTrc10BalanceBefore);

    // withdrawTrc10
    const withdrawNum = 10e2;
    let withdrawTrc10Map = await publicMethod.withdrawTrc10(withdrawNum);
    let withdrawTxFee = withdrawTrc10Map.get("withdrawTxFee");

    // after trx balance
    const mAccountAfter = await tronWeb.sidechain.mainchain.trx.getAccount();
    const sAccountAfter = await tronWeb.sidechain.sidechain.trx.getAccount();
    const mTrxBalanceAfter = mAccountAfter.balance;
    const sTrxBalanceAfter = sAccountAfter.balance;
    console.log('mTrxBalanceAfter: ' + mTrxBalanceAfter);
    console.log('sTrxBalanceAfter: ' + sTrxBalanceAfter);
    assert.equal(mTrxBalanceBefore,mTrxBalanceAfter);
    assert.equal(await publicMethod.reduce(await publicMethod.reduce(sTrxBalanceBefore,withdrawTxFee),WITHDRAW_FEE),sTrxBalanceAfter);

    // after token balance
    const mTrc10BalanceAfter = mAccountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
    console.log("mAccountAfter.assetV2:"+mTrc10BalanceAfter);
    const sTrc10BalanceAfter = sAccountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
    console.log("sAccountAfter.assetV2:"+sTrc10BalanceAfter);
    assert.equal(mTrc10BalanceBefore+withdrawNum,mTrc10BalanceAfter);
    assert.equal(sTrc10BalanceBefore-withdrawNum,sTrc10BalanceAfter);

    // withdrawTrc10 with the defined private key
    let tokenValue = 10;
    let options = {};
    let txID = await tronWeb.sidechain.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // withdrawTrc10 with permissionId in options object
    tokenValue = 10;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT, options);
    assert.equal(txID.length, 64);

    // withdrawTrc10 with permissionId in options object and the defined private key
    tokenValue = 10;
    options = { permissionId: 0 };
    txID = await tronWeb.sidechain.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT, options, PRIVATE_KEY);
    assert.equal(txID.length, 64);

    // should throw if an invalid token id is passed
    let tokenId = -10;
    await assertThrow(
        tronWeb.sidechain.withdrawTrc10(tokenId, 100, WITHDRAW_FEE, 1000000),
        'Invalid tokenId provided'
    )

    // should throw if an invalid token value is passed
    tokenValue = 10.01;
    await assertThrow(
        tronWeb.sidechain.withdrawTrc10(TOKEN_ID, tokenValue, WITHDRAW_FEE, FEE_LIMIT),
        'Invalid tokenValue provided'
    );

    // should throw if an invalid fee limit is passed
    let feeLimit = 100000000000;
    await assertThrow(
        tronWeb.sidechain.withdrawTrc10(TOKEN_ID, 100, WITHDRAW_FEE, feeLimit),
        'Invalid feeLimit provided'
    );

    console.log("execute withdrawTrc10 success")
}

async function trc10TestAll(){
    await depositTrc10();
    await withdrawTrc10();
}
export{
    trc10TestAll
}