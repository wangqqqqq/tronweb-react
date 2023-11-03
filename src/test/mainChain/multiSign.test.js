import React from 'react';
const {DEPOSIT_FEE, WITHDRAW_FEE, FEE_LIMIT, ADDRESS_BASE58, SIDE_CHAIN} = require('../util/config');
const tronWebBuilder = require('../util/tronWebBuilder');
const assertThrow = require('../util/assertThrow');
const publicMethod = require('../util/PublicMethod');
const broadcaster = require('../util/broadcaster');
const tronWeb = tronWebBuilder.createInstance();
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let accounts;
const ownerIdx = 0;
const idxS = 0;
const idxE = 2;
const threshold = 2;

async function multiSignTestBefore(){
    accounts = await tronWebBuilder.getTestAccountsInMain(2);
    await wait(15);
    let ownerPk = accounts.pks[0];
    let ownerAddress = tronWeb.address.toHex(tronWeb.address.fromPrivateKey(ownerPk));
    console.log("ownerAddress: "+ownerAddress)

    // update account permission
    let ownerPermission = { type: 0, permission_name: 'owner' };
    ownerPermission.threshold = threshold;
    ownerPermission.keys  = [];
    let activePermission = { type: 2, permission_name: 'active0' };
    activePermission.threshold = threshold;
    activePermission.operations = '7fff1fc0037ec107000000000000000000000000000000000000000000000000';
    activePermission.keys = [];

    for (let i = idxS; i < idxE; i++) {
        let address = accounts.hex[i];
        let weight = 1;
        ownerPermission.keys.push({ address: address, weight: weight });
        activePermission.keys.push({ address: address, weight: weight });
    }

    const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
        ownerAddress,
        ownerPermission,
        null,
        [activePermission]
    );

    console.log("ownerPk:"+ownerPk)
    console.log("updateTransaction:"+util.inspect(updateTransaction))
    await wait(30);
    const updateTx = await broadcaster.broadcaster(null, ownerPk, updateTransaction);
    console.log("updateTx:"+util.inspect(updateTx))
    console.log("updateTx.txID:"+updateTx.transaction.txID)
    assert.equal(updateTx.transaction.txID.length, 64);
    await wait(30);
    console.log("execute multiSignTestBefore success")
    let updateInfo;
    // while (true) {
    //     updateInfo = await tronWeb.trx.getTransactionInfo(updateTx.transaction.txID);
    //     if (Object.keys(updateInfo).length === 0) {
    //         await wait(3);
    //         continue;
    //     } else {
    //         console.log("updateInfo:"+util.inspect(updateInfo))
    //         break;
    //     }
    // }
}

async function multiSignATransactionByOwnerPermission(){
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    console.log("transaction:"+util.inspect(transaction))
    let signedTransaction = transaction;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i], 0);
        console.log("signedTransaction:"+util.inspect(signedTransaction))
    }
    assert.equal(signedTransaction.signature.length, 2);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute multiSignATransactionByOwnerPermission success")

}

async function multiSignATransactionByOwnerPermission_PermissionIdInsideTx() {
    await wait(5);

    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx], {permissionId: 0});

    let signedTransaction = transaction;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i]);
    }

    assert.equal(signedTransaction.signature.length, 2);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute multiSignATransactionByOwnerPermission_PermissionIdInsideTx success")
}

async function verifyWeightAfterMultiSignByOwnerPermission() {

    // create transaction and do multi-sign
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);

    // sign and verify sign weight
    let signedTransaction = transaction;
    let signWeight;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i], 0);
        signWeight = await tronWeb.trx.getSignWeight(signedTransaction);
        if (i < idxE - 1) {
            assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
        }
        assert.equal(signWeight.approved_list.length, i - idxS + 1);
    }

    // get approved list
    const approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
    assert.isTrue(approvedList.approved_list.length === threshold);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute verifyWeightAfterMultiSignByOwnerPermission success")
}

async function verifyWeightAfterMultiSignByOwnerPermission_PermissionIdInsideTx() {
    // create transaction and do multi-sign
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5,'BANDWIDTH', accounts.b58[ownerIdx], {permissionId: 0});

    // sign and verify sign weight
    let signedTransaction = transaction;
    let signWeight;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i]);
        signWeight = await tronWeb.trx.getSignWeight(signedTransaction);
        if (i < idxE - 1) {
            assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
        }
        assert.equal(signWeight.approved_list.length, i - idxS + 1);
    }

    // get approved list
    const approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
    assert.isTrue(approvedList.approved_list.length === threshold);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute verifyWeightAfterMultiSignByOwnerPermission_PermissionIdInsideTx success")
}

async function multiSignATransactionWithNoPermissionErrorByOwnerPermission() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    try {
        // let key = accounts.pks[ownerIdx].substring(7,10);
        // let fakeStr = key.substring(7,10);
        // let fakeKey = key.replace(fakeStr, "111");
        await tronWeb.trx.multiSign(transaction, (accounts.pks[ownerIdx] + '123'), 0);
    } catch (e) {
        console.log(e);
        assert.isTrue(String(e).indexOf('Error: private key must be 32 bytes, hex or bigint, not string') != -1);
    }
    console.log("execute multiSignATransactionWithNoPermissionErrorByOwnerPermission success")
}

async function multiSignDuplicatedATransactionByOwnerPermission() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    try {
        let signedTransaction = await tronWeb.trx.multiSign(transaction, accounts.pks[ownerIdx], 0);
        await tronWeb.trx.multiSign(signedTransaction, accounts.pks[ownerIdx], 0);
    } catch (e) {
        assert.isTrue(e.indexOf('already sign transaction') != -1);
    }
    console.log("execute multiSignDuplicatedATransactionByOwnerPermission success")
}

async function multiSignATransactionByActivePermission() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    let signedTransaction = transaction;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i], 2);
    }

    assert.equal(signedTransaction.signature.length, 2);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute multiSignATransactionByActivePermission success")
}

async function multiSignATransactionByActivePermission_PermissionIdInsideTx() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5,'BANDWIDTH', accounts.b58[ownerIdx], {permissionId: 2});
    console.log("transaction:"+util.inspect(transaction))

    let signedTransaction = transaction;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i]);
        console.log("signedTransaction:"+util.inspect(signedTransaction.raw_data.contract))
    }

    assert.equal(signedTransaction.signature.length, 2);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    console.log("result:"+util.inspect(result))
    assert.isTrue(result.result);
    console.log("execute multiSignATransactionByActivePermission_PermissionIdInsideTx success")
}

async function verifyWeightAfterMultiSignByActivePermission() {
    // create transaction and do multi-sign
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);

    // sign and verify sign weight
    let signedTransaction = transaction;
    let signWeight;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i], 2);
        signWeight = await tronWeb.trx.getSignWeight(signedTransaction, 2);
        if (i < idxE - 1) {
            assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
        }
        assert.equal(signWeight.approved_list.length, i - idxS + 1);
    }

    // get approved list
    const approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
    assert.isTrue(approvedList.approved_list.length === threshold);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute verifyWeightAfterMultiSignByActivePermission success")
}

async function verifyWeightAfterMultiSignByActivePermission_PermissionIdInsideTx() {
    // create transaction and do multi-sign
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx], {permissionId: 2});

    // sign and verify sign weight
    let signedTransaction = transaction;
    let signWeight;
    for (let i = idxS; i < idxE; i++) {
        signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accounts.pks[i]);
        signWeight = await tronWeb.trx.getSignWeight(signedTransaction);
        if (i < idxE - 1) {
            assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
        }
        assert.equal(signWeight.approved_list.length, i - idxS + 1);
    }

    // get approved list
    const approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
    assert.isTrue(approvedList.approved_list.length === threshold);

    // broadcast multi-sign transaction
    const result = await tronWeb.trx.broadcast(signedTransaction);
    await wait(5);

    assert.isTrue(result.result);
    console.log("execute verifyWeightAfterMultiSignByActivePermission_PermissionIdInsideTx success")
}

async function multiSignATransactionWithNoPermissionErrorByActivePermission() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    try {
        await tronWeb.trx.multiSign(transaction, (accounts.pks[ownerIdx] + '123'), 2);
    } catch (e) {
        assert.isTrue(e.message.indexOf('has no permission to sign') != -1);
    }
    console.log("execute multiSignATransactionWithNoPermissionErrorByActivePermission success")
}

async function multiSignDuplicatedATransactionByActivePermission() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    try {
        let signedTransaction = await tronWeb.trx.multiSign(transaction, accounts.pks[ownerIdx], 2);
        await tronWeb.trx.multiSign(signedTransaction, accounts.pks[ownerIdx], 2);
    } catch (e) {
        assert.isTrue(e.meesage.indexOf('already sign transaction') != -1);
    }
    console.log("execute multiSignDuplicatedATransactionByActivePermission success")
}

async function multiSignATransactionWithPermissionErrorByBothOwnerAndActivePermission() {
    try {
        const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
        let signedTransaction = await tronWeb.trx.multiSign(transaction, accounts.pks[ownerIdx], 0);
        await tronWeb.trx.multiSign(signedTransaction, accounts.pks[ownerIdx], 2);
    } catch (e) {
        assert.isTrue(e.message.indexOf('not contained of permission') != -1);
    }
    console.log("execute multiSignATransactionWithPermissionErrorByBothOwnerAndActivePermission success")
}

async function multiSignATransactionWithWrongPermissionIdError() {
    const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', accounts.b58[ownerIdx]);
    try {
        await tronWeb.trx.multiSign(transaction, (accounts.pks[ownerIdx] + '123'), 2);
    } catch (e) {
        assert.isTrue(e.message.indexOf('has no permission to sign') != -1);
    }
    console.log("execute multiSignATransactionWithWrongPermissionIdError success")
}

async function multiSignTestAll(){
    await multiSignTestBefore();
    await multiSignATransactionByOwnerPermission();
    await multiSignATransactionByOwnerPermission_PermissionIdInsideTx();
    await verifyWeightAfterMultiSignByOwnerPermission();
    await verifyWeightAfterMultiSignByOwnerPermission_PermissionIdInsideTx();
    await multiSignATransactionWithNoPermissionErrorByOwnerPermission();
    await multiSignDuplicatedATransactionByOwnerPermission();
    await multiSignATransactionByActivePermission();
    await multiSignATransactionByActivePermission_PermissionIdInsideTx();
    await verifyWeightAfterMultiSignByActivePermission(); //广播消息第一次返回undefined，第二次执行成功。
    await verifyWeightAfterMultiSignByActivePermission_PermissionIdInsideTx();
    await multiSignATransactionWithNoPermissionErrorByActivePermission();
    await multiSignDuplicatedATransactionByActivePermission();
    await multiSignATransactionWithPermissionErrorByBothOwnerAndActivePermission();
    await multiSignATransactionWithWrongPermissionIdError();
}
export{
    multiSignTestAll
}