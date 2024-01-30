import React from 'react';
const {FULL_NODE_API} = require('../util/config');
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, WITNESS_ACCOUNT, WITNESS_KEY, WITNESS_ACCOUNT2, WITNESS_KEY2, getTokenOptions, isProposalApproved} = require('../util/config');
const {testRevert, testConstant, arrayParam} = require('../util/contracts');
const tronWebBuilder = require('../util/tronWebBuilder');
const ethers = require('ethers');
import { verifyMessage } from 'ethers';
const broadcaster = require('../util/broadcaster');
const assertEqualHex = require('../util/assertEqualHex');
const waitChainData = require('../util/waitChainData');
const pollAccountFor = require('../util/pollAccountFor');
const assertThrow = require('../util/assertThrow');
const messageCases = require('../util/sign-message');
const tests = messageCases.tests;
const txPars = require('../util/txPars');
const TronWeb = tronWebBuilder.TronWeb;
const Trx = TronWeb.Trx;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let tronWeb;
let emptyAccounts;
let isAllowSameTokenNameApproved;
let accounts;

async function trxBefore(){
  tronWeb = tronWebBuilder.createInstance();
  emptyAccounts = await TronWeb.createAccount();
  isAllowSameTokenNameApproved = await isProposalApproved(tronWeb, 'getAllowSameTokenName')
  accounts = await tronWebBuilder.getTestAccountsInMain(43);
  assert.instanceOf(tronWeb.trx, Trx);
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
  console.log("getAccountById start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let accountId = TronWeb.toHex(`testtestlll${Math.ceil(Math.random()*100)}`);
  const transaction = await tronWeb.transactionBuilder.setAccountId(accountId, emptyAccount1.address.hex);
  const res = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  console.log("res:"+util.inspect(res,true,null,true))
  let count = 0;
  while (true) {
    count +=1;
    if(count > 15){
      throw Error("time out failed!!");
    }
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
  console.log("getAccountById end");
}

async function getAccountResources(){
  console.log("getAccountResources start");
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
  console.log("getAccountResources end");
}

async function getBalance(){
  console.log("getBalance start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  let balance = await tronWeb.trx.getBalance(emptyAccount1.address.hex);
  assert.isTrue(balance >= 0);
  balance = await tronWeb.trx.getBalance(emptyAccount1.address.base58);
  assert.isTrue(balance >= 0);
  console.log("getBalance end");
}

async function getBandwidth(){
  console.log("getBandwidth start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  let bp = await tronWeb.trx.getBandwidth(emptyAccount1.address.hex);
  assert.isTrue(bp >= 0);
  bp = await tronWeb.trx.getBandwidth(emptyAccount1.address.base58);
  assert.isTrue(bp >= 0);
  console.log("getBandwidth end");
}

async function getUnconfirmedAccount(){
  console.log("getUnconfirmedAccount start");
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
  console.log("getUnconfirmedAccount end");
}

async function geUnconfirmedAccountById(){
  console.log("geUnconfirmedAccountById start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let accountId = TronWeb.toHex(`testtestl${Math.ceil(Math.random()*1001)}`);
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
  console.log("geUnconfirmedAccountById end");
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
  console.log("getUnconfirmedBalance success");
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
  console.log("updateAccount success");
}

async function sign(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // let transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);

  let signedTransaction = await tronWeb.trx.sign(transaction, emptyAccount1.privateKey);
  assert.equal(signedTransaction.txID, transaction.txID);
  assert.equal(signedTransaction.signature.length, 1);

  await assertThrow(
      tronWeb.trx.sign(undefined, emptyAccount1.privateKey),
      'Invalid transaction provided'
  );

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  await assertThrow(
      tronWeb.trx.sign(transaction, emptyAccount1.privateKey),
      'Private key does not match address in transaction'
  );

  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  signedTransaction = await tronWeb.trx.sign(transaction, emptyAccount1.privateKey);
  await assertThrow(
      tronWeb.trx.sign(signedTransaction, emptyAccount1.privateKey),
      'Transaction is already signed'
  );

  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,10000000,{privateKey: PRIVATE_KEY})
  transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount2.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount2.address.base58);
  transaction.raw_data_hex += '00';
  await assertThrow(
      tronWeb.trx.sign(transaction, emptyAccount2.privateKey),
      'Invalid transaction'
  );
  console.log("sign success");
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
  console.log("signMessage success");
}

async function verifyMessageTestCase(){
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

/**
 * ledger.fromMnemonic.account signMsg
 */
async function signMessageV2_1(){
  console.log("signMessageV2_1 excute start");

  const tronAccount = await tronWeb.fromMnemonic('dad topple match blade valley enact sea style focus forest spend car verify radar input sleep melody repair diamond monitor indoor east solution dwarf', "m/44'/195'/5'/0/0");
  console.log(tronAccount.privateKey+", "+tronAccount.address)

  let msg = 'test';
  let signedMsg = await Trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  let signAddress = await Trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = '74657374';
  signedMsg = await tronWeb.trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await tronWeb.trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = 'hello world';
  signedMsg = await Trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await Trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = ' hello world ';
  signedMsg = await tronWeb.trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await tronWeb.trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = '0x74657374';
  signedMsg = await Trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await Trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = '>/hello world;\'sf  ·/。/、、】';
  signedMsg = await tronWeb.trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await tronWeb.trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = 'skdhfoshofoshdkfjhakKJHKhsdkfhkahskfhozcvuu203840802sd8w3rhkjha98du921oieksjkfdhHKHDHHD(*UHKHIUY*HUhkjsdhkjfhusyfihskdhfkjshi8w34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hsc';
  signedMsg = await Trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await Trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  msg = '736b6468666f73686f666f7368646b666a68616b4b4a484b6873646b66686b6168736b66686f7a63767575323033383430383032736438773372686b6a6861393864753932316f69656b736a6b666468484b4844484844282a55484b484955592a4855686b6a7364686b6a6668757379666968736b6468666b6a7368693877333468323439387339646668696873666b687338646675383977653568387337666468736b6664683938616866646a6b617368666b6b6a686b6a7366643877353238393437393233686b686439376b616b667370616c3b616668613879723832687363';
  signedMsg = await tronWeb.trx.signMessageV2(msg, tronAccount.privateKey);
  console.log(msg + "   .signMessageV2 :   " + signedMsg)
  signAddress = await tronWeb.trx.verifyMessageV2(msg, signedMsg);
  assert.equal(tronAccount.address, signAddress);

  console.log("signMessageV2_1 excute success");
}

/**
 * param is bytearray signedMsg equals param is string signedMsg
 */
async function signMessageV2_2(){
  console.log("signMessageV2_2 excute start");

  let hexStr = '736b6468666f73686f666f7368646b666a68616b4b4a484b6873646b66686b6168736b66686f7a63767575323033383430383032736438773372686b6a6861393864753932316f69656b736a6b666468484b4844484844282a55484b484955592a4855686b6a7364686b6a6668757379666968736b6468666b6a7368693877333468323439387339646668696873666b687338646675383977653568387337666468736b6664683938616866646a6b617368666b6b6a686b6a7366643877353238393437393233686b686439376b616b667370616c3b616668613879723832687363';
  let byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  let signedMsg = await Trx.signMessageV2(byteArray, PRIVATE_KEY);
  let signAddress = await Trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  let msg = 'skdhfoshofoshdkfjhakKJHKhsdkfhkahskfhozcvuu203840802sd8w3rhkjha98du921oieksjkfdhHKHDHHD(*UHKHIUY*HUhkjsdhkjfhusyfihskdhfkjshi8w34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hsc';
  let signedMsg2 = await Trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  const tronAccount = await tronWeb.fromMnemonic('dad topple match blade valley enact sea style focus forest spend car verify radar input sleep melody repair diamond monitor indoor east solution dwarf', "m/44'/195'/5'/0/0");
  console.log(tronAccount.privateKey+", "+tronAccount.address)
  signedMsg = await tronWeb.trx.signMessageV2(byteArray, tronAccount.privateKey);
  signAddress = await tronWeb.trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(tronAccount.address, signAddress);
  msg = 'skdhfoshofoshdkfjhakKJHKhsdkfhkahskfhozcvuu203840802sd8w3rhkjha98du921oieksjkfdhHKHDHHD(*UHKHIUY*HUhkjsdhkjfhusyfihskdhfkjshi8w34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hsc';
  signedMsg2 = await tronWeb.trx.signMessageV2(msg, tronAccount.privateKey);
  assert.equal(signedMsg, signedMsg2);

  hexStr = '74657374';
  byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  signedMsg = await Trx.signMessageV2(byteArray, PRIVATE_KEY);
  signAddress = await Trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  msg = 'test';
  signedMsg2 = await Trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  hexStr = '3734363537333734';
  byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  signedMsg = await tronWeb.trx.signMessageV2(byteArray, PRIVATE_KEY);
  signAddress = await tronWeb.trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  msg = '74657374';
  signedMsg2 = await tronWeb.trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  hexStr = '68656c6c6f20776f726c64';
  byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  signedMsg = await Trx.signMessageV2(byteArray, PRIVATE_KEY);
  signAddress = await Trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  msg = 'hello world';
  signedMsg2 = await Trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  hexStr = '2068656c6c6f20776f726c6420';
  byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  signedMsg = await tronWeb.trx.signMessageV2(byteArray, PRIVATE_KEY);
  signAddress = await tronWeb.trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  msg = ' hello world ';
  signedMsg2 = await tronWeb.trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  hexStr = '30783734363537333734';
  byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  signedMsg = await Trx.signMessageV2(byteArray, PRIVATE_KEY);
  signAddress = await Trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  msg = '0x74657374';
  signedMsg2 = await Trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  hexStr = '3e2f68656c6c6f20776f726c643b2773662020c2b72fe380822fe38081e38081e38091';
  byteArray = tronWeb.utils.code.hexStr2byteArray(hexStr)
  signedMsg = await tronWeb.trx.signMessageV2(byteArray, PRIVATE_KEY);
  signAddress = await tronWeb.trx.verifyMessageV2(byteArray, signedMsg);
  assert.equal(ADDRESS_BASE58, signAddress);
  msg = '>/hello world;\'sf  ·/。/、、】';
  signedMsg2 = await tronWeb.trx.signMessageV2(msg, PRIVATE_KEY);
  assert.equal(signedMsg, signedMsg2);

  console.log("signMessageV2_2 excute success");
}

async function signMessageV2_3() {
  console.log("signMessageV2_3 excute start");

  tests.forEach(function(test) {
    async function s3() {
      const tronWeb = new TronWeb({ fullHost: FULL_NODE_API }, test.privateKey)
      const signature = await tronWeb.trx.signMessageV2(test.message);
      assert.equal(signature, test.signature, 'computes message signature');
    }
  });

  console.log("signMessageV2_3 excute end");
}

/**
 * verifyMessageV2 fromMnemonic account with ledger account old sign & verifyMessageV2
 */
async function verifyMessageV2(){
  console.log("verifyMessageV2 excute start");

  // ledger account
  const tronAccount = await tronWeb.fromMnemonic('dad topple match blade valley enact sea style focus forest spend car verify radar input sleep melody repair diamond monitor indoor east solution dwarf', "m/44'/195'/5'/0/0");

  let msg = 'test';
  let signAddress = await Trx.verifyMessageV2(msg, "f8b1613fe5fc8dd443c424b1f47399f4f7ed6303a8ea79d393efdf4f3f92d76461e48c7843c3489a07cdfe70edac89b94b1b5e3df18143e40069c8ee34dd6aa301");
  assert.equal(tronAccount.address, signAddress);

  msg = '74657374';
  signAddress = await tronWeb.trx.verifyMessageV2(msg, "497da63cedf90e0a84d9c7008ebed3625566d922250a184529c9f0bc0978a49d5af07d23419763a100064c3f93653835b3b0f49da2d1eec7fc7c6f8beb21506e00");
  assert.equal(tronAccount.address, signAddress);

  msg = 'hello world';
  signAddress = await Trx.verifyMessageV2(msg, "e47031146537e55928d326a9955f2ccadb1c82b5f51b9dbd8ebf526738062e184ae5d54d7b16e2b683af5495045a615cc01ed2825e893f8a91ee27ef30372f3101");
  assert.equal(tronAccount.address, signAddress);

  msg = ' hello world ';
  signAddress = await tronWeb.trx.verifyMessageV2(msg, "896d736085d539a64c490b0c2bf24a381c058bef695ecbec6f515a6ced44e9ee0f65ae821d2d736b62de9b5c3499732637071033c56411c2b98ee6366d08272c01");
  assert.equal(tronAccount.address, signAddress);

  msg = '0x74657374';
  signAddress = await Trx.verifyMessageV2(msg, "12582b18b27fcb0bed3c35df16aabd065c786f9db41d4b2ddcb0ff4a52814d424cb9a8bbeaa03de754e58d4af82cbc1ee152fab5f15aef037f112be407d6160801");
  assert.equal(tronAccount.address, signAddress);

  msg = '>/hello world;\'sf  ·/。/、、】';
  signAddress = await tronWeb.trx.verifyMessageV2(msg, "a1abfab795239f3fc6e4ea08a2e2e84cd99f7c107bd0cf6596792968f022518b13e0f530d74d9e26320aed5fd610e7f2b3ea821d0b04a7912c3253fd0d475ad400");
  assert.equal(tronAccount.address, signAddress);

  // string.length is 225,tron success
  msg = 'skdhfoshofoshdkfjhakKJHKhsdkfhkahskfhozcvuu203840802sd8w3rhkjha98du921oieksjkfdhHKHDHHD(*UHKHIUY*HUhkjsdhkjfhusyfihskdhfkjshi8w34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hs';
  signAddress = await Trx.verifyMessageV2(msg, "7608eb30fbb9210e7ec0b0c4011d26d9cdc8591d1c19b8578ba64375a782c39745a5f069277dadbdbb315d81e3a85347e2b1fdfd966f2b8027bb07731c622e0e00");
  console.log("signAddress:"+signAddress)
  assert.equal(tronAccount.address, signAddress);

  // TODO string.length is 225, tron failed, eth succeed
  msg = 'skdhfoshofoshdkfjhakKJHKhsdkfhkahskfhozcvuu203840802sd8w3rhkjha98du921oieksjkfdhHKHDHHD(*UHKHIUY*HUhkjsdhkjfhusyfihskdhfkjshi8w34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hsc';
  signAddress = await Trx.verifyMessageV2(msg, "983993d84ed3e567e8f65b5ad1550210aeb256da1f49fe74d22f9fcabb7622115f4ce0bcf35d9cc4704f2e228c3c2cd1b2fda4a27a6becdc6596e8f06e066f4500");
  console.log("signAddress:"+signAddress)
  assert.isTrue(tronAccount.address != signAddress);

  // TODO string.length is 225, tron failed, eth succeed  #modified either.verifyMessage import way.
  msg = 'skdhfoshofoshdkfjhakKJHKhsdkfhkahskfhozcvuu203840802sd8w3rhkjha98du921oieksjkfdhHKHDHHD(*UHKHIUY*HUhkjsdhkjfhusyfihskdhfkjshi8w34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hscw34h2498s9dfhihsfkhs8dfu89we5h8s7fdhskfdh98ahfdjkashfkkjhkjsfd8w528947923hkhd97kakfspal;afha8yr82hsc';
  signAddress = await verifyMessage(msg, "0xa0f6e01dfe7e8f256458163779bc947e434449ac95957d50fa7c926a9d9733f70326f3560878a08a8ef621f906d98d401ff57f72b778f089a98aa98a0d13f46d00");
  console.log("signAddress:"+signAddress)
  assert.equal("0xAB8deb75f43b5928161b33348EDD91FAdac24615", signAddress);

  console.log("verifyMessageV2 excute success");
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
  // freezebalance
  activePermission.operations = '7fff1fc0037e0000000000000000000000000000000000000000000000000000';
  // freezebalanceV2
  // activePermission.operations = '7fff1fc0033ec107000000000000000000000000000000000000000000000000';
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
  console.log("signedUpdateTransaction: ",signedUpdateTransaction);
  await tronWeb.trx.broadcast(signedUpdateTransaction); //no any return
  await wait(40);

  let transaction = await tronWeb.transactionBuilder.freezeBalance(10e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // let transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  let signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 0);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey, 0);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey, 0);

  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  let result = await tronWeb.trx.broadcast(signedTransaction);
  console.log("first transaction result: ",result);
  assert.isTrue(result.result);

  transaction = await tronWeb.transactionBuilder.freezeBalance(11e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 0});
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 0});
  signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey);

  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  console.log("second transaction result: ",result);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(12e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
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
    console.log("signWeight: ",signWeight.result.code);
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
  console.log("getApprovedList result: ",result);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(13e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 0});
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 0});
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
    console.log("signWeight: ",signWeight);
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
  console.log("second approvedList: ",result);
  assert.isTrue(result.result);

  transaction = await tronWeb.transactionBuilder.freezeBalance(14e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    await tronWeb.trx.multiSign(transaction, (emptyAccount1.privateKey + '123'), 0);
  } catch (e) {
    assert.isTrue(e.indexOf('has no permission to sign') != -1);
  }

  transaction = await tronWeb.transactionBuilder.freezeBalance(15e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    let signedTransaction = await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 0);
    await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 0);
  } catch (e) {
    assert.isTrue(e.indexOf('already sign transaction') != -1);
  }

  console.log("=========")
  transaction = await tronWeb.transactionBuilder.freezeBalance(16e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  console.log("transaction3: "+util.inspect(transaction,true,null,true))
  signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 2);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey, 2);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey, 2);
  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);
  console.log("!!!!!!!")
  transaction = await tronWeb.transactionBuilder.freezeBalance(17e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2});
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2});
  signedTransaction = transaction;
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount2.privateKey);
  signedTransaction = await tronWeb.trx.multiSign(signedTransaction, emptyAccount3.privateKey);
  assert.equal(signedTransaction.signature.length, 3);
  // broadcast multi-sign transaction
  result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result);

  // create transaction and do multi-sign
  transaction = await tronWeb.transactionBuilder.freezeBalance(18e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
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
  transaction = await tronWeb.transactionBuilder.freezeBalance(19e5, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2});
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2});
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

  transaction = await tronWeb.transactionBuilder.freezeBalance(20e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    await tronWeb.trx.multiSign(transaction, (emptyAccount1.privateKey + '123'), 2);
  } catch (e) {
    assert.isTrue(e.indexOf('has no permission to sign') != -1);
  }

  transaction = await tronWeb.transactionBuilder.freezeBalance(21e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
  try {
    let signedTransaction = await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 2);
    await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 2);
  } catch (e) {
    console.log("e: "+e.toString())
    assert.isTrue(e.indexOf('already sign transaction') != -1);
  }

  try {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(22e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
    // const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
    let signedTransaction = await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 0);
    await tronWeb.trx.multiSign(signedTransaction, emptyAccount1.privateKey, 2);
  } catch (e) {
    assert.isTrue(e.indexOf('not contained of permission') != -1);
  }

  try {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(23e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
    // const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
    await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 1);
  } catch (e) {
    console.log("e:"+e);
    assert.isTrue(e.indexOf('Permission for this, does not exist!') != -1);
  }

  try {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(24e5, 3, 'BANDWIDTH', emptyAccount1.address.base58);
    // const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', emptyAccount1.address.base58);
    transaction.txID = transaction.txID + '00'
    await tronWeb.trx.multiSign(transaction, emptyAccount1.privateKey, 2);
  } catch (e) {
    console.log("e:"+e);
    assert.isTrue(e.indexOf('Invalid transaction') != -1);
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
  console.log("balanceBefore: ",balanceBefore);
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
  // let transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_HEX));
  await wait(30);
  let accountAfter = await tronWeb.trx.getUnconfirmedAccount(ADDRESS_HEX);
  assert.equal((!accountBefore.frozen ? 0: accountBefore.frozen[0].frozen_balance) + 10e5, accountAfter.frozen[0].frozen_balance);
  accountBefore = accountAfter;
  await tronWeb.trx.freezeBalance(10e5, 3, 'ENERGY', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  // transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'ENERGY', ADDRESS_HEX));
  await wait(30);
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
  // transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_BASE58);
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
  transaction = await tronWeb.trx.freezeBalance(11e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  // transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_HEX));
  console.log("970 transaction: ",transaction);
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
  transaction = await tronWeb.trx.freezeBalance(12e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  // transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_HEX));
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
      'Invalid transaction index provided'  // "Transaction not found in block"
  ); //tronweb, trongrid

  console.log("111111")
  // getTransactionInfo(Confirmed)
  // const idx = 2;
  transaction = await tronWeb.trx.freezeBalance(13e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  // transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_HEX));
  transaction = transaction.transaction;
  let count = 0;
  while (true) {
    count +=1;
    if(count > 15){
      throw Error("time out failed!!");
    }
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
  transaction = (await tronWeb.trx.freezeBalance(14e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX })).transaction;
  // transaction = (await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_HEX))).transaction;
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
  transaction = await tronWeb.trx.freezeBalance(15e5, 3, 'BANDWIDTH', { privateKey: PRIVATE_KEY, address: ADDRESS_HEX });
  // transaction = await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(10e5, 'BANDWIDTH', ADDRESS_HEX));
  count = 0;
  while (true) {
    count +=1;
    if(count > 15){
      throw Error("time out failed!!");
    }
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
  const receipt = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  console.log("receipt: ",JSON.stringify(receipt,null,2));
  await waitChainData('token', emptyAccount1.address.hex);
  token = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.hex);
  console.log("token: ",token)
  console.log("waiting for fullnode API get assetV2")
  await wait(70)
  const accountinfo = await tronWeb.trx.getUnconfirmedAccount(emptyAccount2.address.hex)
  console.log("accountinfo: ",JSON.stringify(accountinfo,null,2));
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
    console.log("token:"+token)
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
  console.log("createTokenExchange 1")
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
  console.log("createTokenExchange 2")
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
  console.log("createTokenExchange 3")
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
    if (i > 1){
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

/**
 * Need to execute java-tron2.HttpTestMutiSign001.test3Broadcasthex() to get transactionHex
 * /Users/wqq/Src/java-tron/framework/src/test/java/stest/tron/wallet/dailybuild/trctoken/ContractTrcToken001.java  makeTransactionHex 
 * 为了防止交易过期，要将testBefore中的创建用户注释掉。只保留tronewb instance的初始化。
 */
async function broadcastHex(){
  console.log("broadcastHex start")
  //const transactionHex = "0a84010a02d3cd2208ea9a7c42a222810e4088a697f8d2305a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a15415624c12e308b03a1a6b21d9b86e3942fac1ab92b121541959972f4d54d0c030247cafdf6ec7ab4e66fceda18e80770afdd93f8d23012416fa0f530f1d1822727de97baa204cf88f830b42b2ed5edd2e2be4bd4b47747627a760fca43b3b6b5bdf1b5044966ece9615422863ec2fb4063b5d2db3c1c592201"
  const transactionHex = "0a84010a0254432208f39d932a278ba45b40b0c1c497b9315a66080112620a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412310a15415624c12e308b03a1a6b21d9b86e3942fac1ab92b1215414891b65d0333bac7d2320efeda87168930004fc018e807709780c197b9311241458cf3fe26078b2832e7f85330bcd14148ab78cbc94ce97007aef78cc24b0e1103cc59de59f631a2bb4ad93cc5c5ee486c782cdff59025afcfd3fb5df054b8cf00"
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
  console.log("broadcastHex end")
}

async function getDelegatedResourceV2(){
  const idx = 10;
  await broadcaster.broadcaster(null, accounts.pks[idx], await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'BANDWIDTH', accounts.hex[idx]));
  await broadcaster.broadcaster(null, accounts.pks[idx], await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'ENERGY', accounts.hex[idx]));
  await wait(40);
  const transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.hex[idx + 1], 'BANDWIDTH', accounts.hex[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction);
  const transaction3 = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.hex[idx + 1], 'ENERGY', accounts.hex[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction3);
  await wait(40);

  const addressType = ['hex', 'b58'];
  let delegationInfo;
  for (let type of addressType) {
    delegationInfo = await tronWeb.trx.getDelegatedResourceV2(accounts[type][idx], accounts[type][idx + 1]);
    console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
    assert.isDefined(delegationInfo.delegatedResource);
  }

  await wait(10); // wait for solidity
  delegationInfo = await tronWeb.trx.getDelegatedResourceV2(accounts['hex'][idx], accounts['hex'][idx + 1], { confirmed: true });
  assert.isDefined(delegationInfo.delegatedResource);
  delegationInfo = await tronWeb.trx.getDelegatedResourceV2();
  console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
  delegationInfo = await tronWeb.trx.getDelegatedResourceV2(accounts['hex'][idx]);
  console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
  delegationInfo = tronWeb.trx.getDelegatedResourceV2(accounts['hex'][idx], accounts['hex'][idx + 1]);
  console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
  await assertThrow(
      tronWeb.trx.getDelegatedResourceV2('notAnAddress'),
      'Invalid address provided'
  );
  await assertThrow(
      tronWeb.trx.getDelegatedResourceV2(accounts.hex[idx], 'notAnAddress'),
      'Invalid address provided'
  );
}

async function getDelegatedResourceAccountIndexV2(){
  const idx = 10;
  await broadcaster.broadcaster(null, accounts.pks[idx], await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'BANDWIDTH',accounts.b58[idx]));
  await broadcaster.broadcaster(null, accounts.pks[idx], await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'ENERGY',accounts.b58[idx]));
  await wait(40);
  const transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.hex[idx+1], 'BANDWIDTH', accounts.b58[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction);
  const transaction3 = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[idx+2], 'ENERGY', accounts.hex[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction3);
  const transaction4 = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[idx+3], 'BANDWIDTH', accounts.hex[idx],true);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction4);
  const transaction5 = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.hex[idx+4], 'ENERGY', accounts.b58[idx],true);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction5);
  await wait(40);

  const addressType = ['hex', 'b58'];
  let delegationInfo;
  for (let type of addressType) {
    delegationInfo = await tronWeb.trx.getDelegatedResourceAccountIndexV2(accounts[type][idx]);
    console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
    assert.isDefined(delegationInfo.account);
    assert.isArray(delegationInfo.toAccounts);
    assert.equal(delegationInfo.toAccounts.length,4)
  }

  /*tronWeb.trx.getDelegatedResourceAccountIndexV2(accounts.hex[idx], (err, delegationInfo) => {
    if (err) return done(err);
    console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
    assert.isDefined(delegationInfo.account);
    assert.isArray(delegationInfo.toAccounts);
    assert.equal(delegationInfo.toAccounts.length,4)
    done();
  });*/

  await wait(10); // wait for solidity
  delegationInfo = await tronWeb.trx.getDelegatedResourceAccountIndexV2(accounts['hex'][idx], { confirmed: true });
  console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
  assert.isDefined(delegationInfo.account);
  assert.isArray(delegationInfo.toAccounts);
  assert.equal(delegationInfo.toAccounts.length,4)

  delegationInfo = await tronWeb.trx.getDelegatedResourceAccountIndexV2();
  console.log("delegationInfo: "+util.inspect(delegationInfo,true,null,true))
  assert.isDefined(delegationInfo.account);
  assert.isArray(delegationInfo.toAccounts);
  assert.isTrue(delegationInfo.toAccounts.length>2)

  await assertThrow(
      tronWeb.trx.getDelegatedResourceAccountIndexV2('notAnAddress'),
      'Invalid address provided'
  );
}

async function getCanDelegatedMaxSize(){
  const idx = 10;
  const transaction = await tronWeb.transactionBuilder.freezeBalanceV2(10e6, 'ENERGY', accounts.hex[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction);
  const transaction2 = await tronWeb.transactionBuilder.freezeBalanceV2(10e6, 'BANDWIDTH', accounts.hex[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction2);
  await wait(40);

  const addressType = ['hex', 'b58'];
  let max_size_bandwidth;
  for (let type of addressType) {
    const { max_size } = await tronWeb.trx.getCanDelegatedMaxSize(accounts[type][idx], "BANDWIDTH");
    console.log(accounts[type][idx]+"-BANDWIDTH-max_size: "+max_size)
    assert.isNumber(max_size);
    max_size_bandwidth = max_size;
  }

  const max_size1 = await tronWeb.trx.getCanDelegatedMaxSize(accounts.hex[idx]);
  console.log(accounts.hex[idx]+"-BANDWIDTH-max_size: "+max_size1.max_size)
  assert.isNumber(max_size1.max_size);
  assert.equal(max_size_bandwidth,max_size1.max_size);
  for (let type of addressType) {
    const { max_size } = await tronWeb.trx.getCanDelegatedMaxSize(accounts[type][idx], "ENERGY");
    console.log(accounts[type][idx]+"-ENERGY-max_size: "+max_size)
    assert.isNumber(max_size);
    assert.isTrue(max_size>=10000000);
  }

  /*tronWeb.trx.getCanDelegatedMaxSize(accounts.hex[idx], "BANDWIDTH", (err, max_size) => {
    if (err) return done(err);
    console.log("max_size: "+util.inspect(max_size,true,null,true));
    assert.isNumber(max_size.max_size);
    done();
  });*/

  await wait(10); // wait for solidity
  const max_size2 = await tronWeb.trx.getCanDelegatedMaxSize(accounts['hex'][idx], "BANDWIDTH", { confirmed: true });
  console.log("max_size2: "+max_size2.max_size)
  assert.isNumber(max_size2.max_size);
  assert.isTrue(max_size2.max_size>1000000);

  const max_size3 = await tronWeb.trx.getCanDelegatedMaxSize(accounts['hex'][idx]);
  console.log("max_size3: "+max_size3.max_size)
  assert.isNumber(max_size3.max_size);
  assert.isTrue(max_size3.max_size>1000000);

  const max_size4 = await tronWeb.trx.getCanDelegatedMaxSize(ADDRESS_HEX);
  console.log("max_size4: "+util.inspect(max_size4.max_size,true,null,true))
  assert.isNumber(max_size4.max_size);
  const max_size5 = await tronWeb.trx.getCanDelegatedMaxSize();
  assert.isNumber(max_size5.max_size);
  assert.isTrue(max_size5.max_size>1000000);
  assert.equal(max_size4.max_size,max_size5.max_size)

  await assertThrow(
      tronWeb.trx.getCanDelegatedMaxSize('notAnAddress', "ENERGY"),
      'Invalid address provided'
  );

  await assertThrow(
      tronWeb.trx.getCanDelegatedMaxSize(accounts.hex[idx], "ENER"),
      'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
  );
}

async function getAvailableUnfreezeCount(){
  const idx = 10;
  const addressType = ['hex', 'b58'];
  let count1;
  for (let type of addressType) {
    const { count } = await tronWeb.trx.getAvailableUnfreezeCount(accounts[type][idx]);
    console.log("count:"+count)
    assert.isNumber(count);
    assert.isTrue(count>30)
    if (type === 'b58') {
      assert.equal(count1,count)
    }
    count1 = count;
  }

  /*tronWeb.trx.getAvailableUnfreezeCount(accounts.hex[idx], (err, { count }) => {
    if (err) return done(err);
    assert.isNumber(count);
    console.log("count:" + count)
    assert.isTrue(count > 30)
    done();
  })*/
  const count2 = await tronWeb.trx.getAvailableUnfreezeCount(accounts['hex'][idx], { confirmed: true });
  console.log("count:"+count2.count)
  assert.isTrue(count2.count>30)
  assert.isNumber(count2.count);

  const count3 = await tronWeb.trx.getAvailableUnfreezeCount();
  console.log("count:"+count3.count)
  assert.isNumber(count3.count);
  assert.isTrue(count3.count>30)

  await assertThrow(
      tronWeb.trx.getAvailableUnfreezeCount('notAnAddress'),
      'Invalid address provided'
  );
}

async function getCanWithdrawUnfreezeAmount(){
  const idx = 11;
  const transaction2 = await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'ENERGY', accounts.hex[idx]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction2);
  const transaction = await tronWeb.transactionBuilder.unfreezeBalanceV2(10e6, 'ENERGY', accounts.hex[idx], accounts.hex[idx + 1]);
  await broadcaster.broadcaster(null, accounts.pks[idx], transaction);

  const transaction3 = await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'ENERGY');
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction3);
  const transaction4 = await tronWeb.transactionBuilder.unfreezeBalanceV2(10e6, 'ENERGY', tronWeb.defaultAddress.hex, accounts.hex[idx + 1]);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction4);
  await wait(60);

  const addressType = ['hex', 'b58'];
  for (let type of addressType) {
    const { amount } = await tronWeb.trx.getCanWithdrawUnfreezeAmount(accounts[type][idx], Date.now());
    console.log("amount: "+amount)
    assert.isNumber(amount);
    assert.equal(amount,10e6)
  }

  /*tronWeb.trx.getCanWithdrawUnfreezeAmount(accounts.hex[idx], Date.now(), (err, { amount }) => {
    if (err) return done(err);
    console.log("amount: "+amount)
    assert.isNumber(amount);
    assert.equal(amount,10e6)
    done();
  });*/

  const amount1 = await tronWeb.trx.getCanWithdrawUnfreezeAmount(accounts['hex'][idx], Date.now(), { confirmed: true });
  assert.isNumber(amount1.amount);
  assert.equal(amount1.amount,10e6)

  const amount2 = await tronWeb.trx.getCanWithdrawUnfreezeAmount();
  console.log("amount2: "+amount2.amount)
  assert.isNumber(amount2.amount);
  assert.isTrue(amount2.amount >1e6)

  await assertThrow(
      tronWeb.trx.getCanWithdrawUnfreezeAmount('notAnAddress', Date.now()),
      'Invalid address provided'
  );

  await assertThrow(
      tronWeb.trx.getCanWithdrawUnfreezeAmount(accounts.hex[idx], -1),
      'Invalid timestamp provided'
  );
}

async function verifyMessageForUsingSignatureFrom(){
  const hexMsg = '0a02616222082b6a2d73221629b740d8d7c2c6d5315a65080112610a2d747970';
  const signedMsg = await tronWeb.trx.sign(hexMsg, PRIVATE_KEY, null, false);
  console.log(`signedMsg: ${signedMsg}`)
  let result = await tronWeb.trx.verifyMessage(hexMsg, signedMsg, ADDRESS_BASE58, null);
  assert.isTrue(result);
  //1c对应01， 1b对应00.
  let newSignedMsg;
  if (signedMsg.substring(signedMsg.length-2,signedMsg.length) == "1c")
      newSignedMsg = signedMsg.substring(0, signedMsg.length-2) + "01"
  else if(signedMsg.substring(signedMsg.length-2,signedMsg.length) == "1b")
      newSignedMsg = signedMsg.substring(0, signedMsg.length-2) + "00"
  console.log(`newSignedMsg: ${newSignedMsg}`)
  result = await tronWeb.trx.verifyMessage(hexMsg, newSignedMsg, ADDRESS_BASE58, null);
  assert.isTrue(result);
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
  await verifyMessageTestCase();
  await signMessageV2_1();
  await signMessageV2_2();
  await signMessageV2_3();
  await verifyMessageV2();
  //Execute this method when Proposition 70 is not enabled
  /*await multiSignTransaction(); //need freeze V1 started.
  await transactionTest(); */ //need freeze V1 started
  await blockTest();
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
  /*await broadcastHex();                        //todo6.0.0 need use java tron to make transaction. */
  await getDelegatedResourceV2();  
  await getDelegatedResourceAccountIndexV2();  //如何确定，默认账户肯定代理过两个人呢？  
  await getCanDelegatedMaxSize();
  await getAvailableUnfreezeCount();
  await getCanWithdrawUnfreezeAmount();
  await verifyMessageForUsingSignatureFrom();
  console.log("trxTestAll end")
}

export{
  trxTestAll
}
