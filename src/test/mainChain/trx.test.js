import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, WITNESS_ACCOUNT, WITNESS_KEY, UPDATED_TEST_TOKEN_OPTIONS, getTokenOptions, isProposalApproved} = require('../util/config');
const {testRevert, testConstant, arrayParam} = require('../util/contracts');
const tronWebBuilder = require('../util/tronWebBuilder');
const broadcaster = require('../util/broadcaster');
const assertEqualHex = require('../util/assertEqualHex');
const waitChainData = require('../util/waitChainData');
const pollAccountFor = require('../util/pollAccountFor');
const assertThrow = require('../util/assertThrow');
const txPars = require('../util/txPars');
const TronWeb = tronWebBuilder.TronWeb;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let tronWeb;
let emptyAccounts;
let isAllowSameTokenNameApproved

async function trxBefore(){
  tronWeb = tronWebBuilder.createInstance();
  emptyAccounts = await TronWeb.createAccount();
  isAllowSameTokenNameApproved = await isProposalApproved(tronWeb, 'getAllowSameTokenName')

  assert.instanceOf(tronWeb.trx, TronWeb.Trx);
}

async function getAccount(){
  const emptyAccount = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,1000000,{privateKey: PRIVATE_KEY})
  console.log("emptyAccount:"+emptyAccount.address.base58)
  await wait(70);

  let account = await tronWeb.trx.getAccount(emptyAccount.address.hex);
  console.log("account:"+util.inspect(account,true,null,true))
  assert.equal(account.address, emptyAccount.address.hex.toLowerCase());
  account = await tronWeb.trx.getAccount(emptyAccount.address.base58);
  assert.equal(account.address, emptyAccount.address.hex.toLowerCase());

  await assertThrow(
      tronWeb.trx.getAccount('notAnAddress'),
      'Invalid address provided'
  );
  console.log("getAccount excute success");
}

async function getAccountById(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let accountId = TronWeb.toHex(`testtest${Math.ceil(Math.random()*100)}`);
  const transaction = await tronWeb.transactionBuilder.setAccountId(accountId, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);

  while (true) {
    const account = await tronWeb.trx.getAccountById(accountId);
    if (Object.keys(account).length === 0) {
      await wait(3);
      continue;
    } else {
      assert.equal(account.account_id, accountId.slice(2));
      break;
    }
  }

  const ids = ['', '12', '616161616262626231313131313131313131313131313131313131313131313131313131313131'];
  for (let id of ids) {
    await assertThrow(
        tronWeb.trx.getAccountById(id),
        'Invalid accountId provided'
    );
  }
}

async function getAccountResources(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})

  let accountResource = await tronWeb.trx.getAccountResources(emptyAccount1.address.hex);
  assert.isDefined(accountResource.freeNetLimit);
  assert.isDefined(accountResource.TotalEnergyLimit);
  accountResource = await tronWeb.trx.getAccountResources(emptyAccount1.address.base58);
  assert.isDefined(accountResource.freeNetLimit);
  assert.isDefined(accountResource.TotalEnergyLimit);

  await assertThrow(
      tronWeb.trx.getAccountResources('notAnAddress'),
      'Invalid address provided'
  );
}

async function getBalance(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  let balance = await tronWeb.trx.getBalance(emptyAccount1.address.hex);
  assert.isTrue(balance >= 0);
  balance = await tronWeb.trx.getBalance(emptyAccount1.address.base58);
  assert.isTrue(balance >= 0);
}

async function getBandwidth(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  let bp = await tronWeb.trx.getBandwidth(emptyAccount1.address.hex);
  assert.isTrue(bp >= 0);
  bp = await tronWeb.trx.getBandwidth(emptyAccount1.address.base58);
  assert.isTrue(bp >= 0);
}

async function getUnconfirmedAccount(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let account = await tronWeb.createAccount();
  let toHex = account.address.hex;
  const transaction = await tronWeb.transactionBuilder.sendTrx(account.address.hex, 10e5, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  await waitChainData('account', account.address.hex);

  account = await tronWeb.trx.getUnconfirmedAccount(toHex);
  assert.equal(account.address, toHex.toLowerCase());

  await assertThrow(
      tronWeb.trx.getUnconfirmedAccount('notAnAddress'),
      'Invalid address provided'
  );
}

async function geUnconfirmedAccountById(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let accountId = TronWeb.toHex(`testtest${Math.ceil(Math.random()*100)}`);
  const transaction = await tronWeb.transactionBuilder.setAccountId(accountId, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  await waitChainData('accountById', accountId);

  const account = await tronWeb.trx.getUnconfirmedAccountById(accountId);
  assert.equal(account.account_id, accountId.slice(2));

  const ids = ['', '12', '616161616262626231313131313131313131313131313131313131313131313131313131313131'];
  for (let id of ids) {
    await assertThrow(
        tronWeb.trx.getUnconfirmedAccountById(id),
        'Invalid accountId provided'
    );
  }
}

async function getUnconfirmedBalance(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  const account = await tronWeb.createAccount();
  let toHex = account.address.hex;
  const transaction = await tronWeb.transactionBuilder.sendTrx(account.address.hex, 10e5, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  await waitChainData('account', account.address.hex);

  const balance = await tronWeb.trx.getUnconfirmedBalance(toHex);
  assert.equal(balance, 10e5);
}

async function updateAccount(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  const accountName = Math.random().toString(36).substr(2);
  await tronWeb.trx.updateAccount(accountName, { privateKey: emptyAccount1.privateKey, address: emptyAccount1.address.hex });
  const account = await tronWeb.trx.getUnconfirmedAccount(emptyAccount1.address.hex);
  assert.equal(tronWeb.toUtf8(account.account_name), accountName);

  await assertThrow(
      tronWeb.trx.updateAccount({}),
      'Name must be a string'
  );
}

async function sign(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);

  let signedTransaction = await tronWeb.trx.sign(transaction, emptyAccount1.privateKey);
  assert.equal(signedTransaction.txID, transaction.txID);
  assert.equal(signedTransaction.signature.length, 1);

  await assertThrow(
      tronWeb.trx.sign(undefined, emptyAccount1.privateKey),
      'Invalid transaction provided'
  );

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  await assertThrow(
      tronWeb.trx.sign(transaction, emptyAccount1.privateKey),
      'Private key does not match address in transaction'
  );

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  signedTransaction = await tronWeb.trx.sign(transaction, emptyAccount1.privateKey);
  await assertThrow(
      tronWeb.trx.sign(signedTransaction, emptyAccount1.privateKey),
      'Transaction is already signed'
  );
}

async function signMessage(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})
  let hexMsg = '0xe66f4c8f323229131006ad3e4a2ca65dfdf339f0';
  const signedMsg = await tronWeb.trx.sign(hexMsg, emptyAccount1.privateKey);
  assert.isTrue(signedMsg.startsWith('0x'));

  hexMsg = 'e66f4c8f323229131006ad3e4a2ca65dfdf339f0';
  await assertThrow(
      tronWeb.trx.sign(hexMsg, emptyAccount1.privateKey),
      'Private key does not match address in transaction'
  );
}

async function verifyMessage(){
  console.log("verifyMessage excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let hexMsg = '0xe66f4c8f323229131006ad3e4a2ca65dfdf339f0';
  let signedMsg = await tronWeb.trx.sign(hexMsg, emptyAccount1.privateKey, null, false);

  const result = await tronWeb.trx.verifyMessage(hexMsg, signedMsg, emptyAccount1.address.hex, null);
  assert.isTrue(result);

  await assertThrow(
      tronWeb.trx.verifyMessage('e66f4c8f323229131006ad3e4a2ca65dfdf339f0', signedMsg, emptyAccount1.address.hex, null),
      'Expected hex message input'
  );

  const fakeSig = '0xafd220c015fd38ffcd34455ddf4f11d20549d9565f558dd84b508c37854727887879d62e675a285c0caf' +
      'a34ea7814b0ae5b74835bdfb612205deb8b97d7c24811c';
  await assertThrow(
      tronWeb.trx.verifyMessage(hexMsg, fakeSig, emptyAccount1.address.hex, null),
      'Signature does not match'
  );
  console.log("verifyMessage excute success");
}

async function multiSignTransaction(){
  console.log("multiSignTransaction excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  const threshold = 3;
  let ownerAddress = emptyAccount1.address.hex;
  let ownerPk = emptyAccount1.privateKey;
  let ownerPermission = { type: 0, permission_name: 'owner' };
  ownerPermission.threshold = threshold;
  ownerPermission.keys  = [];
  let activePermission = { type: 2, permission_name: 'active0' };
  activePermission.threshold = threshold;
  activePermission.operations = '7fff1fc0037e0000000000000000000000000000000000000000000000000000';
  activePermission.keys = [];

  let weight = 1;
  ownerPermission.keys.push({ address: emptyAccount1.address.hex, weight: weight });
  activePermission.keys.push({ address: emptyAccount1.address.hex, weight: weight });
  ownerPermission.keys.push({ address: emptyAccount2.address.hex, weight: weight });
  activePermission.keys.push({ address: emptyAccount2.address.hex, weight: weight });
  ownerPermission.keys.push({ address: emptyAccount3.address.hex, weight: weight });
  activePermission.keys.push({ address: emptyAccount3.address.hex, weight: weight });

  const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
      ownerAddress,
      ownerPermission,
      null,
      [activePermission]
  );
  assert.isTrue(updateTransaction.txID && updateTransaction.txID.length === 64);
  // broadcast update transaction
  const signedUpdateTransaction = await tronWeb.trx.sign(updateTransaction, ownerPk, null, false);
  await tronWeb.trx.broadcast(signedUpdateTransaction);
  await wait(3);

  let transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  let signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 0);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey, 0);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey, 0);

  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  let result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 0});
  signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey);

  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // sign and verify sign weight
  signedTransaction = transaction;
  let signWeight;
  let tempAccount = emptyAccount1;
  for (let i = 0; i < 3; i++) {
    if (i == 1) {
      tempAccount = emptyAccount2;
    }
    if (i == 2) {
      tempAccount = emptyAccount3;
    }
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, tempAccount.privateKey, 0);
    signWeight = await tronWeb.trx.getSignWeight(signedTransaction);
    if (i < 2) {
      assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
    }
    assert.equal(signWeight.approved_list.length, i + 1);
  }

  // get approved list TODO
  let approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
  assert.isTrue(approvedList.approved_list.length === threshold);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 0});
  // sign and verify sign weight
  signedTransaction = transaction;
  signWeight;
  tempAccount = emptyAccount1;
  for (let i = 0; i < 3; i++) {
    if (i == 1) {
      tempAccount = emptyAccount2;
    }
    if (i == 2) {
      tempAccount = emptyAccount3;
    }
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, tempAccount.privateKey);
    signWeight = await tronWeb.trx.getSignWeight(signedTransaction);
    if (i < 2) {
      assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
    }
    assert.equal(signWeight.approved_list.length, i + 1);
  }
  // get approved list
  approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
  assert.isTrue(approvedList.approved_list.length === threshold);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    await tronWeb.trx.multiSign(transaction, (emptyAccount1.privateKey + '123'), 0);
  } catch (e) {
    assert.isTrue(e.indexOf('has no permission to sign') != -1);
  }

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    let signedTransaction = await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 0);
    await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 0);
  } catch (e) {
    assert.isTrue(e.indexOf('already sign transaction') != -1);
  }

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 2);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey, 2);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey, 2);
  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2});
  signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey);
  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // sign and verify sign weight
  signedTransaction = transaction;
  signWeight;
  tempAccount = emptyAccount1;
  for (let i = 0; i < 3; i++) {
    if (i == 1) {
      tempAccount = emptyAccount2;
    }
    if (i == 2) {
      tempAccount = emptyAccount3;
    }
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, tempAccount.privateKey, 2);
    signWeight = await tronWeb.trx.getSignWeight(signedTransaction, 2);
    if (i < 2) {
      assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
    }
    assert.equal(signWeight.approved_list.length, i + 1);
  }
  // get approved list
  approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
  assert.isTrue(approvedList.approved_list.length === threshold);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2});
  // sign and verify sign weight
  signedTransaction = transaction;
  signWeight;
  tempAccount = emptyAccount1;
  for (let i = 0; i < 3; i++) {
    if (i == 1) {
      tempAccount = emptyAccount2;
    }
    if (i == 2) {
      tempAccount = emptyAccount3;
    }
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, tempAccount.privateKey);
    signWeight = await tronWeb.trx.getSignWeight(signedTransaction);
    if (i < 2) {
      assert.equal(signWeight.result.code, 'NOT_ENOUGH_PERMISSION');
    }
    assert.equal(signWeight.approved_list.length, i + 1);
  }
  // get approved list
  approvedList = await tronWeb.trx.getApprovedList(signedTransaction);
  assert.isTrue(approvedList.approved_list.length === threshold);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    await tronWeb.trx.multiSign(transaction, (emptyAccount1.privateKey + '123'), 2);
  } catch (e) {
    assert.isTrue(e.indexOf('has no permission to sign') != -1);
  }

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    let signedTransaction = await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 2);
    await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 2);
  } catch (e) {
    console.log("e: "+e.toString())
    assert.isTrue(e.indexOf('already sign transaction') != -1);
  }

  try {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
    let signedTransaction = await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 0);
    await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 2);
  } catch (e) {
    assert.isTrue(e.indexOf('not contained of permission') != -1);
  }

  try {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
    await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 1);
  } catch (e) {
    console.log("e:"+e);
    assert.isTrue(e.indexOf('Permission for this, does not exist!') != -1);
  }
  console.log("multiSignTransaction excute success");
}

async function blockTest(){
  console.log("blockTest excute start");

  // getBlock
  let earliestParentHash = '0000000000000000000000000000000000000000000000000000000000000000';
  let blockType = ['earliest', 'latest'];
  let block;
  for (let type of blockType) {
    block = await tronWeb.trx.getBlock(type);
    if (type === 'earliest') {
      assert.equal(earliestParentHash, block.block_header.raw_data.parentHash);
    }
    if (type === 'latest') {
      assert.isNumber(block.block_header.raw_data.number);
    }
  }
  await assertThrow(
      tronWeb.trx.getBlock(false),
      'No block identifier provided'
  );
  await assertThrow(
      tronWeb.trx.getBlock(10e10),
      'Block not found'
  );
  await assertThrow(
      tronWeb.trx.getBlock(-1),
      'Invalid block number provided'
  );

  // getBlockByHash
  block = await tronWeb.trx.getBlock('latest');
  const blockByHash = await tronWeb.trx.getBlockByHash(block.blockID);
  assert.equal(block.blockID, blockByHash.blockID);

  // getBlockByNumber
  block = await tronWeb.trx.getBlock('latest');
  const blockByNumber = await tronWeb.trx.getBlockByNumber(block.block_header.raw_data.number);
  assert.equal(block.blockID, blockByNumber.blockID);

  // getBlockRange
  const blocks = await tronWeb.trx.getBlockRange(0, 5);
  assert.equal(blocks.length, 6);
  const ranges = [[-1, 5, 'start'], [1, -5, 'end']];
  for (let range of ranges) {
    await assertThrow(
        tronWeb.trx.getBlockRange(range[0], range[1]),
        `Invalid ${range[2]} of range provided`
    );
  }

  // getBlockTransactionCount
  blockType = [1, 'latest', 'earliest'];
  for (let type of blockType) {
    const count = await tronWeb.trx.getBlockTransactionCount(type);
    assert.isNumber(count);
  }

  // getCurrentBlock
  block = await tronWeb.trx.getCurrentBlock();
  assert.isNumber(block.block_header.raw_data.number);
  console.log("blockTest excute success");
}

async function transactionTest(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  // send
  let balanceBefore = await tronWeb.trx.getUnconfirmedBalance(emptyAccount1.address.hex);
  await tronWeb.trx.send(emptyAccount1.address.hex, 10e5, { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  await waitChainData('balance', emptyAccount1.address.hex, balanceBefore);
  let balanceAfter = await tronWeb.trx.getUnconfirmedBalance(emptyAccount1.address.hex);
  assert.equal(balanceAfter - balanceBefore, 10e5);
  await assertThrow(
      tronWeb.trx.send('notValidAddress', 10e5, { privateKey: PRIVATE_KEY }),
      'Invalid recipient provided'
  );
  await assertThrow(
      tronWeb.trx.send(emptyAccount1.address.hex, -1, { privateKey: PRIVATE_KEY }),
      'Invalid amount provided'
  );

  // sendTransaction
  const emptyAccount2 = await TronWeb.createAccount();
  balanceBefore = await tronWeb.trx.getUnconfirmedBalance(emptyAccount2.address.hex);
  await tronWeb.trx.sendTransaction(emptyAccount2.address.base58, 1e6);
  await waitChainData('balance', emptyAccount2.address.hex, balanceBefore);
  balanceAfter = await tronWeb.trx.getUnconfirmedBalance(emptyAccount2.address.hex);
  assert.equal(balanceAfter - balanceBefore, 1e6);
  await assertThrow(
      tronWeb.trx.sendTransaction('notValidAddress', 10e5, { privateKey: PRIVATE_KEY }),
      'Invalid recipient provided'
  );
  await assertThrow(
      tronWeb.trx.sendTransaction(emptyAccount2.address.hex, -1, { privateKey: PRIVATE_KEY }),
      'Invalid amount provided'
  );

  // sendTrx
  const emptyAccount3 = await TronWeb.createAccount();
  balanceBefore = await tronWeb.trx.getUnconfirmedBalance(emptyAccount3.address.hex);
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex, 10e5, { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  await waitChainData('balance', emptyAccount3.address.hex, balanceBefore);
  balanceAfter = await tronWeb.trx.getUnconfirmedBalance(emptyAccount3.address.hex);
  assert.equal(balanceAfter - balanceBefore, 10e5);
  await assertThrow(
      tronWeb.trx.sendTrx('notValidAddress', 10e5, { privateKey: PRIVATE_KEY }),
      'Invalid recipient provided'
  );
  await assertThrow(
      tronWeb.trx.sendTrx(emptyAccount3.address.hex, -1, { privateKey: PRIVATE_KEY }),
      'Invalid amount provided'
  );

  // freezeBalance
  let accountBefore = await tronWeb.trx.getAccount(ADDRESS_HEX);
  await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  await waitChainData('freezeBp', ADDRESS_HEX, 0);
  let accountAfter = await tronWeb.trx.getUnconfirmedAccount(ADDRESS_HEX);
  assert.equal((!accountBefore.frozen ? 0: accountBefore.frozen[0].frozen_balance) + 10e5, accountAfter.frozen[0].frozen_balance);
  accountBefore = accountAfter;
  await tronWeb.trx.freezeBalance(10e5, 3, 'ENERGY', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  await waitChainData('freezeEnergy', ADDRESS_HEX, 0);
  accountAfter = await tronWeb.trx.getUnconfirmedAccount(ADDRESS_HEX);
  assert.equal(
      (!accountBefore.account_resource ||
      !accountBefore.account_resource.frozen_balance_for_energy
          ? 0
          : accountBefore.account_resource.frozen_balance_for_energy.frozen_balance) + 10e5,
      accountAfter.account_resource.frozen_balance_for_energy.frozen_balance
  );
  await assertThrow(
      tronWeb.trx.freezeBalance(10e8, 3, 'GAS', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX }),
      'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
  );
  await assertThrow(
      tronWeb.trx.freezeBalance(-10, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX }),
      'Invalid amount provided'
  );
  await assertThrow(
      tronWeb.trx.freezeBalance(10e8, 2, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX }),
      'Invalid duration provided, minimum of 3 days'
  );

  // skip since duration too long TODO
  /**
   describe.skip("#unfreezeBalance", async function () {
      // unfreezeBalance
      before(async function(){
          await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', {}, ADDRESS_BASE58);
          await tronWeb.trx.freezeBalance(10e5, 3, 'ENERGY', {}, ADDRESS_BASE58);
      });

      it('should unfreeze balance', async function () {
          let accountBefore = await tronWeb.trx.getUnconfirmedAccount(ADDRESS_HEX);
          await tronWeb.trx.unfreezeBalance('BANDWIDTH', {}, ADDRESS_BASE58);
          let accountAfter = await tronWeb.trx.getUnconfirmedAccount(ADDRESS_HEX);
          assert.equal(accountBefore.frozen[0].frozen_balance - 10e5, accountAfter.frozen[0].frozen_balance);

          accountBefore = accountAfter;
          await tronWeb.trx.unfreezeBalance('ENERGY', {}, ADDRESS_BASE58);
          accountAfter = await tronWeb.trx.getUnconfirmedAccount(ADDRESS_HEX);
          assert.equal(
              accountBefore.account_resource.frozen_balance_for_energy.frozen_balance - 10e5,
              accountAfter.account_resource.frozen_balance_for_energy.frozen_balance
          );
      });

      it('should throw invalid resource provided: expected "BANDWIDTH" or "ENERGY" error', async function () {
          await assertThrow(
              tronWeb.trx.unfreezeBalance(10e8, 3, 'GAS', {}, ADDRESS_BASE58),
              'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
          );
      });

  });*/

  // broadcast
  let transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', ADDRESS_BASE58);
  let signedTransaction = await tronWeb.trx.sign(transaction, PRIVATE_KEY);
  const result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);
  assert.equal(result.transaction.signature[0], signedTransaction.signature[0]);
  await assertThrow(
      tronWeb.trx.broadcast(false),
      'Invalid transaction provided'
  );
  await assertThrow(
      tronWeb.trx.broadcast(signedTransaction, false),
      'Invalid options provided'
  );
  await assertThrow(
      tronWeb.trx.broadcast(transaction),
      'Transaction is not signed'
  );

  // getTransaction
  transaction = await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  transaction = transaction.transaction;
  await waitChainData('tx', transaction.txID);
  let tx = await tronWeb.trx.getTransaction(transaction.txID);
  assert.equal(tx.txID, transaction.txID);
  await assertThrow(
      tronWeb.trx.getTransaction('a8813981b1737d9caf7d51b200760a16c9cdbc826fa8de102386af898048cbe5'),
      'Transaction not found'
  );

  // getTransactionFromBlock
  let currBlockNum;
  transaction = await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  transaction = transaction.transaction;
  console.log("transaction:"+util.inspect(transaction,true,null,true))

  const currBlock = await tronWeb.trx.getBlock('latest');
  currBlockNum = currBlock.block_header.raw_data.number;
  console.log("currBlockNum:"+currBlockNum);
  for (let i = currBlockNum; i < currBlockNum + 3;) {
    try {
      const tx = await tronWeb.trx.getTransactionFromBlock(i, 0);
      // assert.equal(tx.txID, transaction.txID);
      assert.isDefined(tx.txID);
      break;
    } catch (e) {
      if (e === 'Transaction not found in block') {
        i++;
        continue;
      } else if (e === 'Block not found') {
        await wait(3);
        continue;
      } else {
        throw new Error(e);
        break;
      }
    }
  }
  console.log("qqqqq")
  await assertThrow(
      tronWeb.trx.getTransactionFromBlock(currBlockNum - 1, 0),
      'Transaction not found in block'
  );
  console.log("wwwwww")

  await assertThrow(
      tronWeb.trx.getTransactionFromBlock(currBlockNum + 50, 0),
      'Block not found'
  );
  console.log("eeeeee")

  await assertThrow(
      tronWeb.trx.getTransactionFromBlock(currBlockNum, -1),
      'Invalid transaction index provided'
  );

  console.log("111111")
  // getTransactionInfo(Confirmed)
  // const idx = 2;
  transaction = await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  transaction = transaction.transaction;
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      assert.equal(tx.id, transaction.txID);
      break;
    }
  }

  console.log("222")
  // geUnconfirmedTransactionInfo
  // const idx = 25;
  transaction = (await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX })).transaction;
  await waitChainData('tx', transaction.txID);
  await wait(3)
  tx = await tronWeb.trx.getUnconfirmedTransactionInfo(transaction.txID);
  assert.equal(tx.id, transaction.txID);
  await assertThrow(
      tronWeb.trx.getUnconfirmedTransactionInfo('a8813981b1737d9caf7d51b200760a16c9cdbc826fa8de102386af898048cbe5'),
      'Transaction not found'
  );

  console.log("333")
  // getConfirmedTransaction
  // const idx = 26;
  transaction = await tronWeb.trx.freezeBalance(10e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  while (true) {
    try {
      const tx = await tronWeb.trx.getConfirmedTransaction(transaction.transaction.txID);
      assert.equal(tx.txID, transaction.transaction.txID);
      break;
    } catch (e) {
      if (e === 'Transaction not found') {
        await wait(3);
        continue;
      } else {
        throw new Error(e);
        break;
      }
    }
  }
}

async function tokenTest(){
  console.log("444")
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,10000000000,{privateKey: PRIVATE_KEY})

  // sendAsset
  let token;
  let options = getTokenOptions();
  options.saleEnd = Date.now() + 2500000;
  options.saleStart = Date.now() + 100000;
  let transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  console.log("555")
  await waitChainData('token', emptyAccount1.address.hex);
  token = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.hex);
  let assetBefore = (await tronWeb.trx.getUnconfirmedAccount(emptyAccount2.address.hex)).assetV2;
  await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
  console.log("555！！！")
  await tronWeb.trx.sendAsset(
      emptyAccount2.address.hex,
      10e4,
      token[Object.keys(token)[0]]['id'],
      { privateKey: emptyAccount1.privateKey, address: emptyAccount1.address.hex }
  );
  await waitChainData('sendToken', emptyAccount2.address.hex, !assetBefore ? 0 : assetBefore[0].value);
  let assetAfter = (await tronWeb.trx.getUnconfirmedAccount(emptyAccount2.address.hex)).assetV2;
  console.log("555？？？")
  assert.equal(!assetBefore ? 0 : assetBefore[0].value, assetAfter[0].value - 10e4);
  await assertThrow(
      tronWeb.trx.sendAsset(
          'notValidAddress',
          10e4,
          token[Object.keys(token)[0]]['id'],
          { privateKey: emptyAccount1.privateKey, address: emptyAccount1.address.hex }
      ),
      'Invalid recipient provided'
  );
  await assertThrow(
      tronWeb.trx.sendAsset(
          emptyAccount2.address.hex,
          -10,
          token[Object.keys(token)[0]]['id'],
          { privateKey: emptyAccount1.privateKey, address: emptyAccount1.address.hex }
      ),
      'Invalid amount provided'
  );
  await assertThrow(
      tronWeb.trx.sendAsset(
          emptyAccount2.address.hex,
          10e4,
          {},
          { privateKey: emptyAccount1.privateKey, address: emptyAccount1.address.hex }
      ),
      'Invalid token ID provided'
  );
  await assertThrow(
      tronWeb.trx.sendAsset(
          emptyAccount1.address.hex,
          10e4,
          token[Object.keys(token)[0]]['id'],
          { privateKey: emptyAccount1.privateKey, address: emptyAccount1.address.hex }
      ),
      'Cannot transfer tokens to the same account'
  );


  // sendToken
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,10000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,10000000000,{privateKey: PRIVATE_KEY})
  options = getTokenOptions();
  options.saleEnd = Date.now() + 2500000;
  options.saleStart = Date.now() + 100000;
  transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount3.address.hex);
  await broadcaster.broadcaster(null, emptyAccount3.privateKey, transaction);
  console.log("666")
  await waitChainData('token', emptyAccount3.address.hex);
  token = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount3.address.hex);
  assetBefore = (await tronWeb.trx.getUnconfirmedAccount(emptyAccount4.address.hex)).assetV2;
  // transfer from account 10 to 11
  await tronWeb.trx.sendToken(
      emptyAccount4.address.hex,
      10e4,
      token[Object.keys(token)[0]]['id'],
      { privateKey: emptyAccount3.privateKey, address: emptyAccount3.address.hex }
  );
  await waitChainData('sendToken', emptyAccount4.address.hex, !assetBefore ? 0 : assetBefore[0].value);
  assetAfter = (await tronWeb.trx.getUnconfirmedAccount(emptyAccount4.address.hex)).assetV2;
  assert.equal(!assetBefore ? 0 : assetBefore[0].value, assetAfter[0].value - 10e4);
  await assertThrow(
      tronWeb.trx.sendToken(
          'notValidAddress',
          10e4,
          token[Object.keys(token)[0]]['id'],
          { privateKey: emptyAccount3.privateKey, address: emptyAccount3.address.hex }
      ),
      'Invalid recipient provided'
  );
  await assertThrow(
      tronWeb.trx.sendToken(
          emptyAccount4.address.hex,
          -10,
          token[Object.keys(token)[0]]['id'],
          { privateKey: emptyAccount3.privateKey, address: emptyAccount3.address.hex }
      ),
      'Invalid amount provided'
  );
  await assertThrow(
      tronWeb.trx.sendAsset(
          emptyAccount4.address.hex,
          10e4,
          {},
          { privateKey: emptyAccount3.privateKey, address: emptyAccount3.address.hex }
      ),
      'Invalid token ID provided'
  );
  await assertThrow(
      tronWeb.trx.sendAsset(
          emptyAccount3.address.hex,
          10e4,
          token[Object.keys(token)[0]]['id'],
          { privateKey: emptyAccount3.privateKey, address: emptyAccount3.address.hex }
      ),
      'Cannot transfer tokens to the same account'
  );

  // getTokenFromID
  const emptyAccount5 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount5.address.hex,10000000000,{privateKey: PRIVATE_KEY})
  options = getTokenOptions();
  options.saleEnd = Date.now() + 2500000;
  options.saleStart = Date.now() + 100000;
  transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount5.address.hex);
  await broadcaster.broadcaster(null, emptyAccount5.privateKey, transaction);
  await waitChainData('token', emptyAccount5.address.hex);
  let tokens = await tronWeb.trx.listTokens(5, 0);
  for (let token of tokens) {
    const tk = await tronWeb.trx.getTokenFromID(token.id);
    assert.equal(tk.id, token.id);
  }
  await assertThrow(
      tronWeb.trx.getTokenFromID({}),
      'Invalid token ID provided'
  );
  await assertThrow(
      tronWeb.trx.getTokenFromID(1234565),
      'Token does not exist'
  );

  console.log("777")

  // getTokensIssuedByAddress
  const emptyAccount6 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount6.address.hex,10000000000,{privateKey: PRIVATE_KEY})
  options = getTokenOptions();
  options.saleEnd = Date.now() + 2500000;
  options.saleStart = Date.now() + 100000;
  transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount6.address.hex);
  await broadcaster.broadcaster(null, emptyAccount6.privateKey, transaction);
  await waitChainData('token', emptyAccount6.address.hex);
  tokens = await tronWeb.trx.listTokens(5, 0);
  for (let token of tokens) {
    const tk = await tronWeb.trx.getTokensIssuedByAddress(token.owner_address);
    assert.equal(tk[Object.keys(tk)[0]]['id'], token.id);
  }
  await assertThrow(
      tronWeb.trx.getTokensIssuedByAddress('abcdefghijklmn'),
      'Invalid address provided'
  );

  // listTokens
  tokens = await tronWeb.trx.listTokens(10, 0);
  assert.isArray(tokens);
  for (let token of tokens) {
    assert.isDefined(token.id);
  }
  await assertThrow(
      tronWeb.trx.listTokens(-1, 0),
      'Invalid limit provided'
  );
  await assertThrow(
      tronWeb.trx.listTokens(5, -1),
      'Invalid offset provided'
  );

  // parseToken
  tokens = await tronWeb.trx.listTokens(10, 0);
  for (let token of tokens) {
    const cloneToken = JSON.parse(JSON.stringify(token));
    token.name = tronWeb.fromUtf8(token.name);
    token.abbr = tronWeb.fromUtf8(token.abbr);
    token.description = token.description && tronWeb.fromUtf8(token.description);
    token.url = tronWeb.fromUtf8(token.url);

    const tk = tronWeb.trx._parseToken(token);
    assert.equal(tk.name, cloneToken.name);
    assert.equal(tk.abbr, cloneToken.abbr);
    assert.equal(tk.description, cloneToken.description);
    assert.equal(tk.url, cloneToken.url);
  }
}

async function exchangeTest(){
  console.log("888")

  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount5 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount5.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount6 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount6.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount7 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount7.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount8 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount8.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount9 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount9.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  // listExchanges
  let tokenNames = [];
  let tempAccount = emptyAccount1;
  // create token
  for (let i = 0; i < 2; i++) {
    if (i==1) {
      tempAccount = emptyAccount2;
    }
    const options = getTokenOptions();
    options.saleEnd = Date.now() + 2500000;
    options.saleStart = Date.now() + 100000;
    console.log("999")

    const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.hex);
    await broadcaster.broadcaster(null, tempAccount.privateKey, transaction);
    console.log("999-1")
    await waitChainData('token', tempAccount.address.hex);
    const token = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.hex);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    console.log("")
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount3.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    console.log("999-2")

    await waitChainData('sendToken', emptyAccount3.address.hex, 0);
    tokenNames.push(token[Object.keys(token)[0]]['id']);
  }
  await broadcaster.broadcaster(
      null,
      emptyAccount3.privateKey,
      await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount3.address.hex)
  );
  let exchanges = await tronWeb.trx.listExchanges();
  assert.isArray(exchanges);
  for (let exchange of exchanges) {
    assert.isDefined(exchange.exchange_id);
  }

  // listExchangesPaginated
  tokenNames = [];
  tempAccount = emptyAccount4;
  // create token
  for (let i = 0; i < 2; i++) {
    if (i==1) {
      tempAccount = emptyAccount5;
    }
    const options = getTokenOptions();
    options.saleEnd = Date.now() + 2500000;
    options.saleStart = Date.now() + 100000;
    const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.hex);
    await broadcaster.broadcaster(null, tempAccount.privateKey, transaction);
    await waitChainData('token', tempAccount.address.hex);
    const token = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.hex);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount6.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    await waitChainData('sendToken', emptyAccount6.address.hex, 0);
    tokenNames.push(token[Object.keys(token)[0]]['id']);
  }
  await broadcaster.broadcaster(
      null,
      emptyAccount6.privateKey,
      await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount6.address.hex)
  );
  exchanges = await tronWeb.trx.listExchangesPaginated(10, 0);
  assert.isArray(exchanges);
  assert.isTrue(exchanges.length > 0);
  for (let exchange of exchanges) {
    assert.isDefined(exchange.exchange_id);
  }

  // getExchangeByID;
  exchanges;
  tokenNames = [];
  tempAccount = emptyAccount7;
  // create token
  for (let i = 0; i < 2; i++) {
    if (i==1) {
      tempAccount = emptyAccount8;
    }
    const options = getTokenOptions();
    options.saleEnd = Date.now() + 2500000;
    options.saleStart = Date.now() + 100000;
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.createToken(options, tempAccount.address.hex));
    await waitChainData('token', tempAccount.address.hex);
    const token = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.hex);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount9.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    await waitChainData('sendToken', emptyAccount9.address.hex, 0);
    tokenNames.push(token[Object.keys(token)[0]]['id']);
  }
  await broadcaster.broadcaster(
      null,
      emptyAccount9.privateKey,
      await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount9.address.hex)
  );
  exchanges = await tronWeb.trx.listExchanges();
  for (let exchange of exchanges) {
    const ex = await tronWeb.trx.getExchangeByID(exchange.exchange_id);
    assert.equal(ex.exchange_id, exchange.exchange_id);
  }
}

async function proposalTest(){
  console.log("999")

  let tokenNames = [];
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  // getChainParameters
  const params = await tronWeb.trx.getChainParameters();
  assert.isArray(params);
  assert.isDefined(params[0].key);

  // getProposal
  let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]
  await broadcaster.broadcaster(
      null,
      WITNESS_KEY,
      await tronWeb.transactionBuilder.createProposal(parameters[0], WITNESS_ACCOUNT)
  );
  let proposals = await tronWeb.trx.listProposals();
  for (let proposal of proposals) {
    const ps = await tronWeb.trx.getProposal(proposal.proposal_id);
    assert.equal(ps.proposal_id, proposal.proposal_id);
  }
  await assertThrow(
      tronWeb.trx.getProposal(-1),
      'Invalid proposalID provided'
  );

  // listProposals
  for (let i = 0; i < 5; i++) {
    let parameters = [{"key": i + 1, "value": 100000}, {"key": i + 2, "value": 2}]
    await broadcaster.broadcaster(
        null,
        WITNESS_KEY,
        await tronWeb.transactionBuilder.createProposal(parameters[0], WITNESS_ACCOUNT)
    );
  }
  proposals = await tronWeb.trx.listProposals();
  for (let proposal of proposals) {
    assert.isDefined(proposal.proposal_id);
    assert.isDefined(proposal.proposer_address);
  }
  console.log("proposalTest excute success");
}

async function getContract(){
  const idx = 42;
  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testRevert.abi,
    bytecode: testRevert.bytecode
  }, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  await waitChainData('contract', transaction.contract_address)

  const contract = await tronWeb.trx.getContract(transaction.contract_address);
  assert.equal(contract.contract_address, transaction.contract_address);

  await assertThrow(
      tronWeb.trx.getContract('notAddress'),
      'Invalid contract address provided'
  );

  await assertThrow(
      tronWeb.trx.getContract('417cbcc41052b59584d1ac9fc1ce39106533aa1d40'),
      'Contract does not exist'
  );
  console.log("getContract excute success");
}

async function listNodes(){
  const nodes = await tronWeb.trx.listNodes();
  assert.isArray(nodes);
  console.log("listNodes excute success");
}

async function listSuperRepresentatives(){
  const srs = await tronWeb.trx.listSuperRepresentatives();
  assert.isArray(srs);
  let i = 1;
  for (let sr of srs) {
    if (i > 2){
      break;
    }
    console.log("sr: "+util.inspect(sr,true,null,true))
    assert.isDefined(sr.address);
    assert.isDefined(sr.voteCount);
    assert.isDefined(sr.latestBlockNum);
    i =i + 1;
  }
}

async function timeUntilNextVoteCycle(){
  const num = await tronWeb.trx.timeUntilNextVoteCycle();
  assert.isNumber(num);
}

async function getReward(){
  let reward = await tronWeb.trx.getReward(ADDRESS_HEX);
  assert.equal(reward, 0)
}

async function getUnconfirmedReward(){
  let reward = await tronWeb.trx.getUnconfirmedReward(ADDRESS_HEX);
  assert.equal(reward, 0)
}

async function getBrokerage(){
  let brokerage = await tronWeb.trx.getBrokerage(ADDRESS_HEX);
  assert.equal(brokerage, 20)
}

async function getUnconfirmedBrokerage(){
  let brokerage = await tronWeb.trx.getUnconfirmedBrokerage(ADDRESS_HEX);
  assert.equal(brokerage, 20)
}

async function broadcastHex(){
  const transactionHex = "0a84010a02c8f32208bb3165e33e20e23b40b087d6f6b22f5a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a15415624c12e308b03a1a6b21d9b86e3942fac1ab92b121541a1f92379d71b31e4c10c5868184eeb965ef862fa18e8077090c5d2f6b22f124122323c125105a34bc1db7c8c675f5d214f6fe1c7f635ae88adbcc31b7b11122266aab617bb2068802e727ab15180cef0d8c0c1f8cb24af450226a73529bb270a00"
  let result = await tronWeb.trx.broadcastHex(transactionHex);
  console.log("result1: "+util.inspect(result,true,null,true))
  assert.isTrue(result.result);

  result = await tronWeb.trx.broadcastHex(transactionHex);
  console.log("result2: "+util.inspect(result,true,null,true))
  assert.isFalse(result.result);
  assert.equal(result.code,"DUP_TRANSACTION_ERROR");

  await assertThrow(
      tronWeb.trx.broadcastHex(false),
      'Invalid hex transaction provided'
  );

  await assertThrow(
      tronWeb.trx.broadcastHex(transactionHex, false),
      'Invalid options provided'
  );
}

async function trxTestAll(){
  console.log("trxTestAll start")
  await trxBefore();
 await getAccount();
 await getAccountById();
 await getAccountResources();
 await getBalance();
 await getBandwidth();
 await getUnconfirmedAccount();
 await geUnconfirmedAccountById();
 await getUnconfirmedBalance();
 await updateAccount();
 await sign();
 await signMessage();
 await verifyMessage();
 await multiSignTransaction();
 await blockTest();
  await transactionTest();
  await tokenTest();
  await exchangeTest();
  await proposalTest();
  await getContract();
  await listNodes();
 await listSuperRepresentatives();
 await timeUntilNextVoteCycle();
  await getReward();
  await getUnconfirmedReward();
  await getBrokerage();
  await getUnconfirmedBrokerage();
  await broadcastHex();

  console.log("trxTestAll end")
}

export{
  trxTestAll
}
