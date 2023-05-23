import React from 'react';
const {ADDRESS_BASE58,ADDRESS_HEX,PRIVATE_KEY, WITNESS_ACCOUNT, WITNESS_KEY, UPDATED_TEST_TOKEN_OPTIONS, TOKEN_ID, getTokenOptions, isProposalApproved, FEE_LIMIT} = require('../util/config');
const { equals, getValues } = require('../util/testUtils');
const {testRevert, testConstant, arrayParam, tronToken, testAddressArray, trcTokenTest070, trcTokenTest059, funcABIV2, funcABIV2_2, funcABIV2_3, funcABIV2_4, abiV2Test1, testSetVal, testEmptyAbi} = require('../util/contracts');
const tronWebBuilder = require('../util/tronWebBuilder');
const assertEqualHex = require('../util/assertEqualHex');
const waitChainData = require('../util/waitChainData');
const pollAccountFor = require('../util/pollAccountFor');
const publicMethod = require('../util/PublicMethod');
const assertThrow = require('../util/assertThrow');
const broadcaster = require('../util/broadcaster');
const txPars = require('../util/txPars');
const TronWeb = tronWebBuilder.TronWeb;
const wait = require('../util/wait');
const chai = require('chai');
const assert = chai.assert;
const util = require('util');
let tronWeb;
let emptyAccounts;
let isAllowSameTokenNameApproved
let emptyAccount6;
let accounts;
async function transactionBuilderBefore(){
  console.log("start...");
  tronWeb = tronWebBuilder.createInstance();
  console.log("end...");
  emptyAccounts = await TronWeb.createAccount();
  isAllowSameTokenNameApproved = await isProposalApproved(tronWeb, 'getAllowSameTokenName')
  emptyAccount6 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount6.address.hex,5000000000,{privateKey: PRIVATE_KEY})

  assert.instanceOf(tronWeb.transactionBuilder, TronWeb.TransactionBuilder);
  accounts = await tronWebBuilder.getTestAccountsInMain(29);
  console.log("transactionBuilderBefore excute success")
}

async function sendTrx(){
  const emptyAccount = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,5000000000,{privateKey: PRIVATE_KEY})

  let params = [
    [emptyAccount1.address.base58, 10, {permissionId: 2}],
    [emptyAccount1.address.base58, 10]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.sendTrx(...param);
    console.log("---------sendTrx() transaction:----------");
    console.log(transaction);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.amount, 10);
    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.to_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.TransferContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[2] ? param[2]['permissionId'] : 0);
  }

  params = [
    [emptyAccount1.address.base58, 10, emptyAccount.address.base58, {permissionId: 2}],
    [emptyAccount1.address.base58, 10, emptyAccount.address.base58]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.sendTrx(...param);
    const parameter = txPars(transaction);
    console.log("---------sendTrx() transaction 2:----------");
    console.log(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.amount, 10);
    assert.equal(parameter.value.owner_address, emptyAccount.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.TransferContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[3] ? param[3]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx('40f0b27e3d16060a5b0e8e995120e00', 10),
      'Invalid recipient address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount2.address.hex, -10),
      'Invalid amount provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount3.address.hex, 10, '40f0b27e3d16060a5b0e8e995120e00'),
      'Invalid origin address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount3.address.hex, 10, emptyAccount3.address.hex),
      'Cannot transfer TRX to the same account'
  );

  await assertThrow(
      tronWeb.transactionBuilder.sendTrx(emptyAccount3.address.hex, 10, emptyAccounts.address.base58),
      null,
      'ContractValidateException'
  );
  console.log("---------sendTrx() end------------")
}

async function createToken(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount5 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount5.address.hex,5000000000,{privateKey: PRIVATE_KEY})
  console.log("emptyAccount1: ",emptyAccount1)
  console.log("emptyAccount2: ",emptyAccount2)
  console.log("emptyAccount3: ",emptyAccount3)
  console.log("emptyAccount4: ",emptyAccount4)
  console.log("emptyAccount5: ",emptyAccount5)
  let options = getTokenOptions();

  for (let i = 0; i < 2; i++) {
    if (i === 1) {
      options.permissionId = 2;
    }
    const transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount1.address.base58);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.total_supply, options.totalSupply);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  if (isAllowSameTokenNameApproved) {
    let options;

    let tempAccount = emptyAccount2;

    for (let i = 0; i < 2; i++) {
      options = getTokenOptions();
      options.voteScore = 5;
      options.precision = 4;
      if (i === 1) {
        options.permissionId = 2;
        tempAccount = emptyAccount3;
      }
      console.log("111")
      options.saleStart = options.saleStart + 20000;
      const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.base58);
      console.log("222")

      const parameter = txPars(transaction);
      assert.equal(transaction.txID.length, 64);
      assert.equal(parameter.value.vote_score, options.voteScore);
      assert.equal(parameter.value.precision, options.precision);
      assert.equal(parameter.value.total_supply, options.totalSupply);
      await assertEqualHex(parameter.value.abbr, options.abbreviation);
      assert.equal(parameter.value.owner_address, tempAccount.address.hex.toLowerCase());
      assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
      assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);

      const triggerTx = await broadcaster.broadcaster(null, tempAccount.privateKey, transaction)
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
      console.log("tempAccount.address.base58:"+tempAccount.address.base58)
      const tokenList = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.base58)
      console.log("tokenList:"+util.inspect(tokenList,true,null,true))
      const tokenID = tokenList[options.name].id
      const token = await tronWeb.trx.getTokenByID(tokenID)

      assert.equal(token.vote_score, options.voteScore);
      assert.equal(token.precision, options.precision);
    }
  } else {
    this.skip()
  }

  console.log("3333")
  options = getTokenOptions();
  options.totalSupply = '100'
  options.frozenAmount = '5'
  options.frozenDuration = '2'
  let accounts = await tronWebBuilder.getTestAccountsInMain(2);
  for (let i = 0; i < 2; i++) {
    if (i === 1) {
      options.permissionId = 2;
    }
    options.saleStart = options.saleStart + 20000;
    const transaction = await tronWeb.transactionBuilder.createToken(options,accounts.hex[i]);
    const parameter = txPars(transaction);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  console.log("4444")
  options = getTokenOptions();
  options.totalSupply = '100'
  options.frozenAmount = '0'
  options.frozenDuration = '0'

  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const transaction = await tronWeb.transactionBuilder.createToken(options,accounts.hex[i]);
    const parameter = txPars(transaction);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }


  if (isAllowSameTokenNameApproved) {

    const options = getTokenOptions();

    console.log("5555")

    options.precision = 0;
    let transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount4.address.base58);
    let parameter = txPars(transaction);
    console.log("parameter: "+util.inspect(parameter,true,null,true));
    const precision = typeof (parameter.value.precision) === 'number' ? (parameter.value.precision) : 0;
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.vote_score, options.voteScore);
    assert.equal(precision, options.precision);
    assert.equal(parameter.value.total_supply, options.totalSupply);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(parameter.value.owner_address, emptyAccount4.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
    await broadcaster.broadcaster(null, emptyAccount4.privateKey, transaction)
    let tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount4.address.base58)
    let tokenID = tokenList[options.name].id
    let token = await tronWeb.trx.getTokenByID(tokenID)
    const tokenPrecision = typeof (token.precision) === 'number' ? (token.precision) : 0;
    assert.equal(tokenPrecision, options.precision);

    console.log("66666")
    options.precision = 6;

    transaction = await tronWeb.transactionBuilder.createToken(options, emptyAccount5.address.base58);
    parameter = txPars(transaction);
    console.log("parameter: "+util.inspect(parameter,true,null,true));
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.vote_score, options.voteScore);
    assert.equal(parameter.value.precision, options.precision);
    assert.equal(parameter.value.total_supply, options.totalSupply);
    await assertEqualHex(parameter.value.abbr, options.abbreviation);
    assert.equal(parameter.value.owner_address, emptyAccount5.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');
    await broadcaster.broadcaster(null, emptyAccount5.privateKey, transaction)
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount5.address.base58)
    tokenID = tokenList[options.name].id
    token = await tronWeb.trx.getTokenByID(tokenID)
    assert.equal(token.precision, options.precision);
  } else {
    this.skip()
  }

  tronWeb.setPrivateKey(accounts.pks[0])
  options = getTokenOptions();
  options.name = 123;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token name provided'
  );

  options = getTokenOptions();
  options.abbreviation = 123;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token abbreviation provided'
  );

  options = getTokenOptions();
  options.totalSupply = [];
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Supply amount must be a positive integer'
  );

  options = getTokenOptions();
  options.trxRatio = {};
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'TRX ratio must be a positive integer'
  );

  options = getTokenOptions();
  options.tokenRatio = 'tokenRatio';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Token ratio must be a positive integer'
  );

  options = getTokenOptions();
  options.saleStart = Date.now() - 1;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale start timestamp provided'
  );

  options.saleStart = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale start timestamp provided'
  );

  options = getTokenOptions();
  options.saleEnd = Date.now() - 1000;

  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale end timestamp provided'
  );

  options.saleEnd = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid sale end timestamp provided'
  );

  options = getTokenOptions();
  options.description = 123;

  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token description provided'
  );

  options.description = '';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token description provided'
  );

  options = getTokenOptions();
  options.url = 123;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token url provided'
  );

  options.url = '';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token url provided'
  );

  options.url = '//www.example.com';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid token url provided'
  );

  options = getTokenOptions();
  options.freeBandwidth = -1;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth amount provided'
  );

  options.freeBandwidth = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth amount provided'
  );

  options = getTokenOptions();
  options.freeBandwidth = 10;
  delete options.freeBandwidthLimit;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth limit provided'
  );

  options.freeBandwidthLimit = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Free bandwidth limit provided'
  );

  options = getTokenOptions();
  options.frozenAmount = -1;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Frozen supply provided'
  );

  options.frozenAmount = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Frozen supply provided'
  );

  options = getTokenOptions();
  options.frozenDuration = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'Invalid Frozen duration provided'
  );

  options = getTokenOptions();
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options, '0xzzzww'),
      'Invalid issuer address provided'
  );

  options = getTokenOptions();
  options.precision = -1;

  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'precision must be a positive integer >= 0 and <= 6'
  );

  options.precision = 7;
  await assertThrow(
      tronWeb.transactionBuilder.createToken(options),
      'precision must be a positive integer >= 0 and <= 6'
  );

  console.log("777777")
  options = getTokenOptions();
  const transaction = await tronWeb.transactionBuilder.createAsset(options, emptyAccount6.address.base58);
  const parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  assert.equal(parameter.value.total_supply, options.totalSupply);
  await assertEqualHex(parameter.value.abbr, options.abbreviation);
  assert.equal(parameter.value.owner_address, emptyAccount6.address.hex.toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AssetIssueContract');

  console.log("execute createToken success")
}

async function createAccount(){
  const inactiveAccount1 = await tronWeb.createAccount();
  const inactiveAccountAddress1 = inactiveAccount1.address.base58;
  const inactiveAccount2 = await tronWeb.createAccount();
  const inactiveAccountAddress2 = inactiveAccount2.address.base58;
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  // permissionId
  let transaction = await tronWeb.transactionBuilder.createAccount(inactiveAccountAddress1, emptyAccount1.address.hex, {permissionId: 2});
  let parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  assert.equal(parameter.value.owner_address.toLowerCase(), emptyAccount1.address.hex.toLowerCase());
  assert.equal(parameter.value.account_address.toLowerCase(), tronWeb.address.toHex(inactiveAccountAddress1).toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AccountCreateContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);

  let updateTx = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  console.log("updateTx1.txID:"+updateTx.transaction.txID)
  assert.equal(updateTx.transaction.txID.length, 64);
  await wait(30);
  console.log("inactiveAccountAddress1:"+inactiveAccountAddress1)
  const in1 = await tronWeb.trx.getAccount(inactiveAccountAddress1);
  assert.equal(in1.address.toLowerCase(), inactiveAccount1.address.hex.toLowerCase());

  // no permissionId
  transaction = await tronWeb.transactionBuilder.createAccount(inactiveAccountAddress2, emptyAccount1.address.hex);
  parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  assert.equal(parameter.value.owner_address.toLowerCase(), emptyAccount1.address.hex.toLowerCase());
  assert.equal(parameter.value.account_address.toLowerCase(), tronWeb.address.toHex(inactiveAccountAddress2).toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AccountCreateContract');

  updateTx = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  console.log("updateTx2.txID:"+updateTx.transaction.txID)
  assert.equal(updateTx.transaction.txID.length, 64);
  await wait(30);
  const in2 = await tronWeb.trx.getAccount(inactiveAccountAddress2);
  assert.equal(in2.address.toLowerCase(), inactiveAccount2.address.hex.toLowerCase());

  await assertThrow(
      tronWeb.transactionBuilder.createAccount(123, emptyAccount2.address.base58),
      'Invalid account address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.createAccount(emptyAccount2.address.base58, '0xzzzww'),
      'Invalid origin address provided'
  );
  console.log("createAccount success")
}

async function updateAccount(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,100000000,{privateKey: PRIVATE_KEY})
  const newName = 'New name'
  const params = [
    [newName, emptyAccount1.address.base58, {permissionId: 2}],
    [newName, emptyAccount1.address.base58]
  ];

  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.updateAccount(...param);
    const parameter = txPars(transaction);

    assert.equal(transaction.txID.length, 64);
    await assertEqualHex(parameter.value.account_name, newName);
    assert.equal(parameter.value.owner_address.toLowerCase(), emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AccountUpdateContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[2] ? param[2]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.updateAccount(123, emptyAccount2.address.base58),
      'Invalid accountName'
  );

  await assertThrow(
      tronWeb.transactionBuilder.updateAccount('New name', '0xzzzww'),
      'Invalid origin address provided'
  );
  console.log("updateAccount success")
}

async function setAccountId(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  let ids = ['abcabc110', 'testtest', 'jackieshen110'];

  for (let id of ids) {
    let accountId = TronWeb.toHex(id);
    console.log("accountId",accountId)
    const transaction = await tronWeb.transactionBuilder.setAccountId(accountId, emptyAccount1.address.base58);
    console.log("set AccountId transaction",JSON.stringify(transaction, null, 2))
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    console.log("webTransaction: ",parameter.value.account_id);
    console.log("origin accountId: ",accountId.slice(2));
    assert.equal(parameter.value.account_id, accountId.slice(2));
    assert.equal(parameter.value.owner_address.toLowerCase(), emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.SetAccountIdContract');

  }

  // account id length should be between 8 and 32
  ids = ['', '12', '616161616262626231313131313131313131313131313131313131313131313131313131313131']
  for (let id of ids) {
    await assertThrow(
        tronWeb.transactionBuilder.setAccountId(id, emptyAccount1.address.base58),
        'Invalid accountId provided'
    );
  }

  await assertThrow(
      tronWeb.transactionBuilder.setAccountId(TronWeb.toHex('testtest001'), '0xzzzww'),
      'Invalid origin address provided'
  );

  const params = [
    [TronWeb.toHex('abcabc220'), accounts.b58[4], {permissionId: 2}],
    [TronWeb.toHex('abcab0000'), accounts.b58[4], {permissionId: 0}],
    [TronWeb.toHex('testtest'), accounts.b58[4]],
  ]

  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.setAccountId(...param);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    console.log("parameter",parameter);
    assert.equal(parameter.value.account_id, param[0].slice(2));
    assert.equal(parameter.value.owner_address, accounts.hex[4]);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.SetAccountIdContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[2] ? param[2]['permissionId'] : 0);
  }
  console.log("execute setAccountId end")
}

function randomString(e) {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz",
      a = t.length,
      n = "";
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

//shoule set account id by multiSign transaction
async function setAccountIdMultiSign(){
  const accountsl = {
    b58: [],
    hex: [],
    pks: []
  }
  const idxS = 0;
  const idxE = 2;
  const threshold = 2;
  tronWeb = tronWebBuilder.createInstance();
  const sendTrxTx = await tronWeb.trx.sendTrx(accounts.b58[0], 5000000000);
  const sendTrxTx2 = await tronWeb.trx.sendTrx(accounts.b58[1], 500000000);
  assert.isTrue(sendTrxTx.result);
  assert.isTrue(sendTrxTx2.result);
  await wait(15);

  accountsl.pks.push(accounts.pks[1]);
  accountsl.b58.push(accounts.b58[1]);
  accountsl.hex.push(accounts.hex[1]);
  accountsl.pks.push(accounts.pks[0]);
  accountsl.b58.push(accounts.b58[0]);
  accountsl.hex.push(accounts.hex[0]);
  let ownerPk = accounts.pks[1]
  let ownerAddressBase58 = accounts.b58[1];
  let ownerAddress = accounts.hex[1];
  console.log("ownerAddress: "+ownerAddress + "    ownerAddressBase58：" + ownerAddressBase58)

  // update account permission
  let ownerPermission = { type: 0, permission_name: 'owner' };
  ownerPermission.threshold = 1;
  ownerPermission.keys  = [];
  let activePermission = { type: 2, permission_name: 'active0' };
  activePermission.threshold = threshold;
  //activePermission.operations = '7fff1fc0037e0000000000000000000000000000000000000000000000000000';
  activePermission.operations = '7fff1fc0037e0100000000000000000000000000000000000000000000000000';
  activePermission.keys = [];

  ownerPermission.keys.push({ address: ownerAddress, weight: 1 });
  for (let i = idxS; i < idxE; i++) {
    let address = accountsl.hex[i];
    let weight = 1;
    activePermission.keys.push({ address: address, weight: weight });
  }

  const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
      ownerAddress,
      ownerPermission,
      null,
      [activePermission]
  );

  console.log("updateTransaction:"+util.inspect(updateTransaction))
  await wait(30);
  const updateTx = await broadcaster.broadcaster(null, ownerPk, updateTransaction);
  console.log("updateTx:"+util.inspect(updateTx))
  console.log("updateTx.txID:"+updateTx.transaction.txID)
  assert.equal(updateTx.transaction.txID.length, 64);
  await wait(30);

  const accountID = TronWeb.toHex(randomString(10))
  const param = [accountID, ownerAddressBase58, {permissionId: 2}]
  const transaction = await tronWeb.transactionBuilder.setAccountId(...param);
  let signedTransaction = transaction;
  for (let i = idxS; i < idxE; i++) {
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accountsl.pks[i], 2);
  }

  assert.equal(signedTransaction.signature.length, 2);

  // broadcast multi-sign transaction
  const result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(30);
  const ans = await tronWeb.trx.getAccount(ownerAddress);
  assert.isTrue(result.result);
  assert.equal(accountID.replace(/^0x/, ''),ans.account_id,"setaccountID error!")
  console.log("execute setAccountIdMultiSign end")
}

async function updateToken(){
  const emptyAccount1 = emptyAccount6;

  let tokenOptions = getTokenOptions();

  let tokenID;
  await broadcaster.broadcaster(null,emptyAccount1.privateKey, await tronWeb.transactionBuilder.createToken(tokenOptions, emptyAccount1.address.base58))
  let tokenList
  while (!tokenList) {
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.base58)
  }
  if (isAllowSameTokenNameApproved) {
    tokenID = tokenList[tokenOptions.name].id
  } else {
    tokenID = tokenList[tokenOptions.name].name
  }

  for (let i = 0; i < 2; i++) {
    if (i === 1) UPDATED_TEST_TOKEN_OPTIONS.permissionId = 2;
    const transaction = await tronWeb.transactionBuilder.updateToken(UPDATED_TEST_TOKEN_OPTIONS, emptyAccount1.address.base58);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    await assertEqualHex(parameter.value.description, UPDATED_TEST_TOKEN_OPTIONS.description);
    await assertEqualHex(parameter.value.url, UPDATED_TEST_TOKEN_OPTIONS.url);
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UpdateAssetContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, UPDATED_TEST_TOKEN_OPTIONS.permissionId || 0);
  }

  let options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.description = 123;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token description provided'
  );

  options.description = '';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token description provided'
  );

  options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.url = 123;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token url provided'
  );

  options.url = '';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token url provided'
  );

  options.url = '//www.example.com';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Invalid token url provided'
  );

  options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.freeBandwidth = -1;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth amount must be a positive integer'
  );

  options.freeBandwidth = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth amount must be a positive integer'
  );

  options = _.clone(UPDATED_TEST_TOKEN_OPTIONS);
  options.freeBandwidth = 10;
  delete options.freeBandwidthLimit;
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth limit must be a positive integer'
  );

  options.freeBandwidthLimit = 'something';
  await assertThrow(
      tronWeb.transactionBuilder.updateToken(options, emptyAccount1.address.hex),
      'Free bandwidth limit must be a positive integer'
  );

  await assertThrow(
      tronWeb.transactionBuilder.updateToken(UPDATED_TEST_TOKEN_OPTIONS, '0xzzzww'),
      'Invalid issuer address provided'
  );

  const transaction = await tronWeb.transactionBuilder.updateAsset(UPDATED_TEST_TOKEN_OPTIONS, emptyAccount1.address.base58);
  const parameter = txPars(transaction);
  assert.equal(transaction.txID.length, 64);
  await assertEqualHex(parameter.value.description, UPDATED_TEST_TOKEN_OPTIONS.description);
  await assertEqualHex(parameter.value.url, UPDATED_TEST_TOKEN_OPTIONS.url);
  assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UpdateAssetContract');

  console.log("execute updateToken success")
}

async function purchaseToken(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let tokenOptions = getTokenOptions();
  let tokenID
  const transaction = await tronWeb.transactionBuilder.createToken(tokenOptions, emptyAccount1.address.base58)
  console.log("transaction: "+util.inspect(transaction,true,null,true))
  const purchaseTokenRes = await broadcaster.broadcaster(null, emptyAccount1.privateKey ,transaction)
  console.log("purchaseTokenRes: "+util.inspect(purchaseTokenRes,true,null,true))
  await wait(45)
  let tokenList
  while (!tokenList) {
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.base58)
  }
  if (isAllowSameTokenNameApproved) {
    tokenID = tokenList[tokenOptions.name].id
  } else {
    tokenID = tokenList[tokenOptions.name].name
  }
  assert.equal(tokenList[tokenOptions.name].abbr, tokenOptions.abbreviation)

  let token
  if (isAllowSameTokenNameApproved) {
    token = await tronWeb.trx.getTokenByID(tokenID)
    assert.equal(token.id, tokenID)
  } else {
    token = await tronWeb.trx.getTokenFromID(tokenID)
  }
  assert.equal(token.name, tokenOptions.name)

  const params = [
    [emptyAccount1.address.base58, tokenID, 20, emptyAccount2.address.base58, {permissionId: 2}],
    [emptyAccount1.address.base58, tokenID, 20, emptyAccount2.address.base58]
  ];
  for (let param of params) {
    await wait(20)

    const transaction = await tronWeb.transactionBuilder.purchaseToken(...param);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.amount, 20);
    assert.equal(parameter.value.owner_address, emptyAccount2.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ParticipateAssetIssueContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken('sasdsadasfa', tokenID, 20, emptyAccount2.address.base58),
      'Invalid issuer address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount3.address.base58, tokenID, 20, emptyAccount2.address.base58),
      null,
      'The asset is not issued by'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, 123432, 20, emptyAccount2.address.base58),
      'Invalid token ID provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, '1110000', 20, emptyAccount2.address.base58),
      null,
      'No asset named '
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, 20, 'sasdadasdas'),
      'Invalid buyer address provided'
  );

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, -3, emptyAccount2.address.base58),
      'Invalid amount provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, "some-amount", emptyAccount2.address.base58),
      'Invalid amount provided'
  )

  console.log("execute purchaseToken success")
}

async function sendToken(){
  console.log("sendToken excute start")
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let tokenOptions = getTokenOptions();
  let tokenID
  const res = await broadcaster.broadcaster(tronWeb.transactionBuilder.createToken(tokenOptions, emptyAccount1.address.base58), emptyAccount1.privateKey)
  console.log("res: "+util.inspect(res,true,null,true))
  await wait(45)
  let tokenList
  while (!tokenList) {
    tokenList = await tronWeb.trx.getTokensIssuedByAddress(emptyAccount1.address.base58)
  }
  console.log("tokenList: "+util.inspect(tokenList,true,null,true))
  console.log("tokenOptions.name: "+util.inspect(tokenOptions.name,true,null,true))
  if (isAllowSameTokenNameApproved) {
    tokenID = tokenList[tokenOptions.name].id
  } else {
    tokenID = tokenList[tokenOptions.name].name
  }

  let token
  if (isAllowSameTokenNameApproved) {
    token = await tronWeb.trx.getTokenByID(tokenID)
    assert.equal(token.id, tokenID)
  } else {
    token = await tronWeb.trx.getTokenFromID(tokenID)
  }
  assert.equal(token.name, tokenOptions.name)

  let params = [
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount3.address.base58, {permissionId: 2}],
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount3.address.base58]
  ];
  for (let param of params) {
    console.log("token: "+util.inspect(token,true,null,true));
    console.log("now datatime: "+util.inspect(Date.now(),true,null,true));

    await broadcaster.broadcaster(tronWeb.transactionBuilder.purchaseToken(emptyAccount1.address.base58, tokenID, 50, emptyAccount3.address.base58), emptyAccount3.privateKey)

    await wait(10)

    console.log("22222")

    const transaction = await tronWeb.transactionBuilder.sendToken(...param)

    const parameter = txPars(transaction)

    assert.equal(parameter.value.amount, 5)
    assert.equal(parameter.value.owner_address, emptyAccount3.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount2.address.hex.toLowerCase());
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }

  params = [
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount1.address.base58, {permissionId: 2}],
    [emptyAccount2.address.base58, 5, tokenID, emptyAccount1.address.base58]
  ];
  for (let param of params) {
    console.log("33333")
    const transaction = await tronWeb.transactionBuilder.sendToken(...param)

    const parameter = txPars(transaction);

    assert.equal(parameter.value.amount, 5)
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.value.to_address, emptyAccount2.address.hex.toLowerCase());
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }

  await assertThrow(
      tronWeb.transactionBuilder.sendToken('sadasfdfsgdfgssa', 5, tokenID, emptyAccount3.address.base58),
      'Invalid recipient address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, 5, 143234, emptyAccount3.address.base58),
      'Invalid token ID provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, 5, tokenID, 213253453453),
      'Invalid origin address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, -5, tokenID, emptyAccount3.address.base58),
      'Invalid amount provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.sendToken(emptyAccount2.address.base58, 'amount', tokenID, emptyAccount3.address.base58),
      'Invalid amount provided'
  )
  console.log("sendToken excute success")
}

async function createProposal(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000000,{privateKey: PRIVATE_KEY})

  let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]

  let inputs = [
    [parameters[0], ADDRESS_BASE58, {permissionId: 2}],
    [parameters[0], ADDRESS_BASE58]
  ];
  // tronex have no witness account TODO
  /*for (let input of inputs) {
    const transaction = await tronWeb.transactionBuilder.createProposal(...input)

    const parameter = txPars(transaction);

    assert.equal(parameter.value.owner_address, ADDRESS_HEX);
    assert.equal(parameter.value.parameters[0].value, parameters[0].value);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ProposalCreateContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, input[2] ? input[2]['permissionId'] : 0);
  }*/

  for (let input of inputs) {
    await assertThrow(
        tronWeb.transactionBuilder.createProposal(...input),
        'class org.tron.core.exception.ContractValidateException : Witness[415624c12e308b03a1a6b21d9b86e3942fac1ab92b] not exists'
    )
  }

  await assertThrow(
      tronWeb.transactionBuilder.createProposal(parameters, 'sadasdsffdgdf'),
      'Invalid issuer address provided'
  )

  await assertThrow(
      tronWeb.transactionBuilder.createProposal(parameters, emptyAccount1.address.base58),
      null,
      `Witness[${emptyAccount1.address.hex.toLowerCase()}] not exists`
  )
  console.log("createProposal excute success")
}

async function deleteProposal(){
  let proposals;
  const witnessAccount = "TT1smsmhxype64boboU8xTuNZVCKP1w6qT"
  const witnessKey = "9FD8E129DE181EA44C6129F727A6871440169568ADE002943EAD0E7A16D8EDAC"

  let parameters = [{"key": 0, "value": 100000}, {"key": 1, "value": 2}]

  await broadcaster.broadcaster(tronWeb.transactionBuilder.createProposal(parameters, witnessAccount), witnessKey)

  proposals = await tronWeb.trx.listProposals();
  console.log("proposals:"+util.inspect(proposals,true,null,true))

  const params = [
    [proposals[0].proposal_id, witnessAccount, {permissionId: 2}],
    [proposals[0].proposal_id, witnessAccount]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.deleteProposal(...param,)
    const parameter = txPars(transaction);

    assert.equal(parameter.value.owner_address, "41bafb56091591790e00aa05eaddcc7dc1474b5d4b");
    assert.equal(parameter.value.proposal_id, proposals[0].proposal_id);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ProposalDeleteContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[2] ? 2 : 0);
  }

  await broadcaster.broadcaster(await tronWeb.transactionBuilder.deleteProposal(proposals[0].proposal_id, witnessAccount), witnessKey);

  await assertThrow(
      tronWeb.transactionBuilder.deleteProposal(proposals[0].proposal_id, witnessAccount),
      null,
      `Proposal[${proposals[0].proposal_id}] canceled`);

  proposals = await tronWeb.trx.listProposals();
  if (proposals[0].state !== 'CANCELED')
    await broadcaster.broadcaster(tronWeb.transactionBuilder.deleteProposal(proposals[0].proposal_id, witnessAccount), witnessKey)
  console.log("deleteProposal excute success")
}

async function voteProposal(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10000000000,{privateKey: PRIVATE_KEY})

  let proposals = await tronWeb.trx.listProposals();
  const proposalsBeforeNums = proposals.length
  console.log("proposalsBeforeNums: "+proposalsBeforeNums)
  const sendTrxTransaction = await tronWeb.transactionBuilder.sendTrx(emptyAccount1.address.base58, 10000e6);
  await broadcaster.broadcaster(sendTrxTransaction, PRIVATE_KEY);
  waitChainData('tx', sendTrxTransaction.txID);
  const applyForSrTransaction = await tronWeb.transactionBuilder.applyForSR(emptyAccount1.address.base58, 'url.tron.network');
  await broadcaster.broadcaster(applyForSrTransaction, emptyAccount1.privateKey);
  waitChainData('tx', applyForSrTransaction.txID);
  let parameters = [{ "key": 0, "value": 100000 }, { "key": 1, "value": 2 }]

  const createRes = await broadcaster.broadcaster(tronWeb.transactionBuilder.createProposal(parameters, WITNESS_ACCOUNT), WITNESS_KEY)
  console.log("createRes: "+util.inspect(createRes,true,null,true))
  await wait(45);
  proposals = await tronWeb.trx.listProposals();
  console.log("proposals.length: "+proposals.length)
  assert.equal(proposals.length,proposalsBeforeNums+1);

  const params = [
    [proposals.length, true, emptyAccount1.address.base58, { permissionId: 2 }],
    [proposals.length, true, emptyAccount1.address.base58]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.voteProposal(...param)
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);
  }
  console.log("voteProposal excute success")
}

async function applyForSR(){
  let url = 'https://xtron.network';

  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10100000000,{privateKey: PRIVATE_KEY})

  const transaction = await tronWeb.transactionBuilder.applyForSR(emptyAccount1.address.base58, url);
  const parameter = txPars(transaction);

  assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
  await assertEqualHex(parameter.value.url, url);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.WitnessCreateContract');
  console.log("applyForSR excute success")
}

async function freezeBalance(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  const params = [
    [100e6, 3, 'BANDWIDTH', emptyAccount1.address.base58, {permissionId: 2}],
    [100e6, 3, 'BANDWIDTH', emptyAccount1.address.base58]
  ];

  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.freezeBalance(...param)

    const parameter = txPars(transaction);
    // jlog(parameter)
    assert.equal(parameter.value.owner_address, emptyAccount1.address.hex.toLowerCase());
    assert.equal(parameter.value.frozen_balance, 100e6);
    assert.equal(parameter.value.frozen_duration, 3);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id || 0, param[4] ? param[4]['permissionId'] : 0);
  }
  console.log("freezeBalance excute success")
}

async function unfreezeBalance(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10100000000,{privateKey: PRIVATE_KEY})
  const transaction = await tronWeb.transactionBuilder.freezeBalance(100e6, 0, 'BANDWIDTH', emptyAccount1.address.base58);
  await broadcaster.broadcaster(transaction, emptyAccount1.privateKey);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const params = [
    ['BANDWIDTH', emptyAccount1.address.base58, { permissionId: 2 }],
    ['BANDWIDTH', emptyAccount1.address.base58]
  ];

  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.unfreezeBalance(...param)
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);
  }
  console.log("unfreezeBalance excute success")
}

async function freezeBalanceV2_1(){
  let transaction = await tronWeb.transactionBuilder.freezeBalanceV2(4e6, 'BANDWIDTH', accounts.b58[0], {permissionId: 2});
  let tx = await broadcaster.broadcaster(null, accounts.pks[0], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  console.log("parameter: "+util.inspect(parameter,true,null,true))
  assert.equal(parameter.value.owner_address, accounts.hex[0]);
  assert.equal(parameter.value.frozen_balance, 4e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);
  let accountInfo = await tronWeb.trx.getAccount(accounts.b58[0]);
  let accountResource = await tronWeb.trx.getAccountResources(accounts.b58[0])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[0].amount, 4e6);
  assert.equal(accountResource.tronPowerLimit, 4);

  transaction = await tronWeb.transactionBuilder.freezeBalanceV2(3e6, 'ENERGY', accounts.hex[0]);
  tx = await broadcaster.broadcaster(null, accounts.pks[0], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  console.log("parameter: "+util.inspect(parameter,true,null,true))
  assert.equal(parameter.value.owner_address, accounts.hex[0]);
  assert.equal(parameter.value.frozen_balance, 3e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  accountInfo = await tronWeb.trx.getAccount(accounts.hex[0]);
  accountResource = await tronWeb.trx.getAccountResources(accounts.b58[0])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[1].type, 'ENERGY');
  assert.equal(accountInfo.frozenV2[1].amount, 3e6);
  assert.equal(accountResource.tronPowerLimit, 7);
  console.log("freezeBalanceV2_1 excute success")
}

async function freezeBalanceV2_2(){
  let transaction = await tronWeb.transactionBuilder.freezeBalanceV2(5e6, 'ENERGY', accounts.b58[1], {permissionId: 2});
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  console.log("parameter: "+util.inspect(parameter,true,null,true))
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.value.frozen_balance, 5e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);
  let accountInfo = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResource = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[1].type, 'ENERGY');
  assert.equal(accountInfo.frozenV2[1].amount, 5e6);
  assert.equal(accountResource.tronPowerLimit, 5);

  transaction = await tronWeb.transactionBuilder.freezeBalanceV2(6e6, 'BANDWIDTH', accounts.hex[1]);
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  console.log("parameter: "+util.inspect(parameter,true,null,true))
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.frozen_balance, 6e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  accountInfo = await tronWeb.trx.getAccount(accounts.hex[1]);
  accountResource = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[0].amount, 6e6);
  assert.equal(accountResource.tronPowerLimit, 11);
  console.log("freezeBalanceV2_2 excute success")
}

async function freezeBalanceV2_3(){
  let accountResourceBeofre = await tronWeb.trx.getAccountResources()
  let accountBefore = await tronWeb.trx.getAccount();
  let transaction = await tronWeb.transactionBuilder.freezeBalanceV2(1e6);
  let tx = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  console.log("parameter: "+util.inspect(parameter,true,null,true))
  assert.equal(parameter.value.owner_address, ADDRESS_HEX);
  assert.equal(parameter.value.frozen_balance, 1e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.FreezeBalanceV2Contract');
  let accountResourceAfter = await tronWeb.trx.getAccountResources()
  let accountAfter = await tronWeb.trx.getAccount();
  console.log("accountResourceAfter: "+util.inspect(accountResourceAfter,true,null,true))
  console.log("accountAfter: "+util.inspect(accountAfter,true,null,true))
  assert.equal(accountAfter.frozenV2[0].amount, accountBefore.frozenV2[0].amount+1e6);
  assert.equal(accountResourceAfter.tronPowerLimit, accountResourceBeofre.tronPowerLimit+1);
  console.log("freezeBalanceV2_3 excute success")
}

async function freezeBalanceV2_4(){
  let params = [
    [100e6, 'BANDWIDTH', 'ddssddd', {permissionId: 2}],
    [100e6, 'BANDWIDTH', 'ddssddd'],
    [100e6, 'ENERGY', 'ddssddd', {permissionId: 2}],
    [100e6, 'ENERGY', 'ddssddd']
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.freezeBalanceV2(...param),
        'Invalid origin address provided'
    )
  }

  params = [
    ['-100', 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    ['-100', 'BANDWIDTH', accounts.b58[1]],
    ['-100', 'ENERGY', accounts.b58[1], {permissionId: 2}],
    ['-100', 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.freezeBalanceV2(...param),
        'Invalid amount provided'
    )
  }

  params = [
    [100e6, 'aabbccdd', accounts.b58[1], {permissionId: 2}],
    [100e6, 'aabbccdd', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.freezeBalanceV2(...param),
        'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
    )
  }
  console.log("freezeBalanceV2_4 excute success")
}

async function unfreezeBalanceV2_1(){
  let transaction = await tronWeb.transactionBuilder.unfreezeBalanceV2(3e6, 'BANDWIDTH', accounts.b58[0], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[0], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(40);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[0]);
  assert.equal(parameter.value.unfreeze_balance, 3e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnfreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);
  let accountInfo = await tronWeb.trx.getAccount(accounts.b58[0]);
  let accountResource = await tronWeb.trx.getAccountResources(accounts.b58[0])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[0].amount, 1e6);
  assert.equal(accountInfo.unfrozenV2[0].unfreeze_amount, 3e6);
  assert.equal(accountResource.tronPowerLimit, 4);

  transaction = await tronWeb.transactionBuilder.unfreezeBalanceV2(2e6, 'ENERGY', accounts.b58[0])
  tx = await broadcaster.broadcaster(null, accounts.pks[0], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[0]);
  assert.equal(parameter.value.unfreeze_balance, 2e6);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnfreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  accountInfo = await tronWeb.trx.getAccount(accounts.hex[0]);
  accountResource = await tronWeb.trx.getAccountResources(accounts.b58[0])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[1].type, 'ENERGY');
  assert.equal(accountInfo.frozenV2[1].amount, 1e6);
  assert.equal(accountResource.tronPowerLimit, 2);
  console.log("unfreezeBalanceV2_1 excute success")
}

async function unfreezeBalanceV2_2(){
  let transaction = await tronWeb.transactionBuilder.unfreezeBalanceV2(5e6, 'ENERGY', accounts.b58[1], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.unfreeze_balance, 5e6);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnfreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);
  let accountInfo = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResource = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.equal(accountInfo.frozenV2[1].type, 'ENERGY');
  assert.isUndefined(accountInfo.frozenV2[1].amount);
  assert.equal(accountResource.tronPowerLimit, 6);

  transaction = await tronWeb.transactionBuilder.unfreezeBalanceV2(6e6, 'BANDWIDTH', accounts.b58[1])
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.unfreeze_balance, 6e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnfreezeBalanceV2Contract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  accountInfo = await tronWeb.trx.getAccount(accounts.hex[1]);
  accountResource = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountInfo: "+util.inspect(accountInfo,true,null,true))
  console.log("accountResource: "+util.inspect(accountResource,true,null,true))
  assert.isUndefined(accountInfo.frozenV2[0].amount);
  assert.isUndefined(accountResource.tronPowerLimit);
  console.log("unfreezeBalanceV2_2 excute success")

}

async function unfreezeBalanceV2_3(){
  let accountResourceBeofre = await tronWeb.trx.getAccountResources()
  let accountBefore = await tronWeb.trx.getAccount();
  let transaction = await tronWeb.transactionBuilder.unfreezeBalanceV2(1e6);
  let tx = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("tx:"+util.inspect(tx))
  console.log("tx.txID:"+tx.transaction.txID)
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  console.log("parameter: "+util.inspect(parameter,true,null,true))
  assert.equal(parameter.value.owner_address, ADDRESS_HEX);
  assert.equal(parameter.value.unfreeze_balance, 1e6);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnfreezeBalanceV2Contract');
  let accountResourceAfter = await tronWeb.trx.getAccountResources()
  let accountAfter = await tronWeb.trx.getAccount();
  console.log("accountResourceAfter: "+util.inspect(accountResourceAfter,true,null,true))
  console.log("accountAfter: "+util.inspect(accountAfter,true,null,true))
  assert.equal(accountAfter.frozenV2[0].amount, accountBefore.frozenV2[0].amount-1e6);
  assert.equal(accountResourceAfter.tronPowerLimit, accountResourceBeofre.tronPowerLimit-1);
  console.log("unfreezeBalanceV2_3 excute success")
}

async function unfreezeBalanceV2_4(){
  let params = [
    [100e6, 'BANDWIDTH', 'ddssddd', {permissionId: 2}],
    [100e6, 'BANDWIDTH', 'ddssddd'],
    [100e6, 'ENERGY', 'ddssddd', {permissionId: 2}],
    [100e6, 'ENERGY', 'ddssddd']
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.unfreezeBalanceV2(...param),
        'Invalid origin address provided'
    )
  }

  params = [
    ['-100', 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    ['-100', 'BANDWIDTH', accounts.b58[1]],
    ['-100', 'ENERGY', accounts.b58[1], {permissionId: 2}],
    ['-100', 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.unfreezeBalanceV2(...param),
        'Invalid amount provided'
    )
  }

  params = [
    [100e6, 'aabbccdd', accounts.b58[1], {permissionId: 2}],
    [100e6, 'aabbccdd', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.unfreezeBalanceV2(...param),
        'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
    )
  }
  console.log("unfreezeBalanceV2_4 excute success")
}

async function delegateResource_before(){
  let transaction = await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'BANDWIDTH', accounts.b58[1]);
  await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  const transaction2 = await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'ENERGY', accounts.hex[1]);
  await broadcaster.broadcaster(null, accounts.pks[1], transaction2);
  const transaction3 = await tronWeb.transactionBuilder.freezeBalanceV2(50e6);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction3);
  await wait(40);
  console.log("delegateResource_before excute success")
}

async function delegateResource_1(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'BANDWIDTH', accounts.b58[1], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[0].amount, accountBefore1.frozenV2[0].amount-10e6);
  assert.equal(accountAfter1.delegated_frozenV2_balance_for_bandwidth, 10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'BANDWIDTH', accounts.b58[1])
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[0].amount, accountAfter1.frozenV2[0].amount-10e6);
  assert.equal(accountAfter2.delegated_frozenV2_balance_for_bandwidth, accountAfter1.delegated_frozenV2_balance_for_bandwidth+10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_1 excute success")
}

async function delegateResource_2(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'ENERGY', accounts.b58[1], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[1].amount, accountBefore1.frozenV2[1].amount-10e6);
  assert.equal(accountAfter1.account_resource.delegated_frozenV2_balance_for_energy, 10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'ENERGY', accounts.b58[1])
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[1].amount, accountAfter1.frozenV2[1].amount-10e6);
  assert.equal(accountAfter2.account_resource.delegated_frozenV2_balance_for_energy, accountAfter1.account_resource.delegated_frozenV2_balance_for_energy+10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_2 excute success")
}

async function delegateResource_3(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'BANDWIDTH', accounts.b58[1], true, {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.lock, true);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[0].amount, accountBefore1.frozenV2[0].amount-10e6);
  assert.equal(accountAfter1.delegated_frozenV2_balance_for_bandwidth, accountBefore1.delegated_frozenV2_balance_for_bandwidth+10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'BANDWIDTH',accounts.b58[1], true)
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.lock, true);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[0].amount, accountAfter1.frozenV2[0].amount-10e6);
  assert.equal(accountAfter2.delegated_frozenV2_balance_for_bandwidth, accountAfter1.delegated_frozenV2_balance_for_bandwidth+10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_3 excute success")
}

async function delegateResource_4(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'BANDWIDTH', accounts.b58[1], false, {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[0].amount, accountBefore1.frozenV2[0].amount-10e6);
  assert.equal(accountAfter1.delegated_frozenV2_balance_for_bandwidth, accountBefore1.delegated_frozenV2_balance_for_bandwidth+10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'BANDWIDTH',  accounts.b58[1], false)
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[0].amount, accountAfter1.frozenV2[0].amount-10e6);
  assert.equal(accountAfter2.delegated_frozenV2_balance_for_bandwidth, accountAfter1.delegated_frozenV2_balance_for_bandwidth+10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_4 excute success")
}

async function delegateResource_5(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'ENERGY', accounts.b58[1], true, {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(40);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.lock, true);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[1].amount, accountBefore1.frozenV2[1].amount-10e6);
  assert.equal(accountAfter1.account_resource.delegated_frozenV2_balance_for_energy,  accountBefore1.account_resource.delegated_frozenV2_balance_for_energy+10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'ENERGY',accounts.b58[1], true)
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.lock, true);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[1].amount, accountAfter1.frozenV2[1].amount-10e6);
  assert.equal(accountAfter2.account_resource.delegated_frozenV2_balance_for_energy, accountAfter1.account_resource.delegated_frozenV2_balance_for_energy+10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_5 excute success")
}

async function delegateResource_6(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  console.log("accountBefore1: "+util.inspect(accountBefore1,true,null,true))
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'ENERGY', accounts.b58[1], false, {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[1].amount, accountBefore1.frozenV2[1].amount-10e6);
  assert.equal(accountAfter1.account_resource.delegated_frozenV2_balance_for_energy, accountBefore1.account_resource.delegated_frozenV2_balance_for_energy + 10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7], 'ENERGY',  accounts.b58[1], false)
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[1].amount, accountAfter1.frozenV2[1].amount-10e6);
  assert.equal(accountAfter2.account_resource.delegated_frozenV2_balance_for_energy, accountAfter1.account_resource.delegated_frozenV2_balance_for_energy+10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_6 excute success")
}

async function delegateResource_7(){
  let accountBefore1 = await tronWeb.trx.getAccount(ADDRESS_BASE58);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(ADDRESS_BASE58)
  let transaction = await tronWeb.transactionBuilder.delegateResource(10e6, accounts.b58[7])
  let tx = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, ADDRESS_HEX);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.resource);
  assert.isUndefined(parameter.value.lock);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.DelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter1 = await tronWeb.trx.getAccount(ADDRESS_HEX);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(ADDRESS_HEX)
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[0].amount, accountBefore1.frozenV2[0].amount-10e6);
  const accountBefore_delegated_frozenV2_balance_for_bandwidth = accountBefore1.delegated_frozenV2_balance_for_bandwidth?accountBefore1.delegated_frozenV2_balance_for_bandwidth:0;
  assert.equal(accountAfter1.delegated_frozenV2_balance_for_bandwidth, accountBefore_delegated_frozenV2_balance_for_bandwidth+10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("delegateResource_7 excute success")
}

async function delegateResource_8(){
  let params = [
    [100e6, accounts.b58[7], 'BANDWIDTH', 'ddssddd', {permissionId: 2}],
    [100e6, accounts.b58[7], 'BANDWIDTH',  'ddssddd'],
    [100e6, accounts.b58[7], 'ENERGY', 'ddssddd', {permissionId: 2}],
    [100e6, accounts.b58[7], 'ENERGY', 'ddssddd']
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.delegateResource(...param),
        'Invalid origin address provided'
    )
  }

  params = [
    ['-100', accounts.b58[7], 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    ['-100', accounts.b58[7], 'BANDWIDTH', accounts.b58[1]],
    ['-100', accounts.b58[7], 'ENERGY', accounts.b58[1], {permissionId: 2}],
    ['-100', accounts.b58[7], 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.delegateResource(...param),
        'Invalid amount provided'
    )
  }

  params = [
    [100e6, accounts.b58[7], 'aabbccdd', accounts.b58[1], {permissionId: 2}],
    [100e6, accounts.b58[7], 'aabbccdd', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.delegateResource(...param),
        'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
    )
  }

  params = [
    [100e6, 'adskjkkk', 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    [100e6, 'adskjkkk', 'BANDWIDTH', accounts.b58[1]],
    [100e6, 'adskjkkk', 'ENERGY', accounts.b58[1], {permissionId: 2}],
    [100e6, 'adskjkkk', 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.delegateResource(...param),
        'Invalid receiver address provided'
    )
  }

  params = [
    [100e6, accounts.b58[1], 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    [100e6, accounts.b58[1], 'BANDWIDTH', accounts.b58[1]],
    [100e6, accounts.b58[1], 'ENERGY', accounts.b58[1], {permissionId: 2}],
    [100e6, accounts.b58[1], 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.delegateResource(...param),
        'Receiver address must not be the same as owner address'
    )
  }
  console.log("delegateResource_8 excute success")
}

async function undelegateResource_before(){
  await broadcaster.broadcaster(null, accounts.pks[1], await tronWeb.transactionBuilder.freezeBalanceV2(60e6, 'BANDWIDTH', accounts.b58[1]));
  await broadcaster.broadcaster(null, accounts.pks[1], await tronWeb.transactionBuilder.freezeBalanceV2(60e6, 'ENERGY', accounts.b58[1]));
  await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(60e6));
  await wait(40);
  const transaction = await tronWeb.transactionBuilder.delegateResource(50e6, accounts.b58[7], 'BANDWIDTH', accounts.b58[1]);
  await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  const transaction2 = await tronWeb.transactionBuilder.delegateResource(50e6, accounts.b58[7], 'ENERGY', accounts.b58[1]);
  await broadcaster.broadcaster(null, accounts.pks[1], transaction2);
  const transaction3 = await tronWeb.transactionBuilder.delegateResource(50e6, accounts.b58[7]);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction3);
  await wait(30);
  console.log("undelegateResource_before excute success")
}

async function undelegateResource_1(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.undelegateResource(10e6, accounts.hex[7], 'BANDWIDTH', accounts.hex[1], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.resource);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnDelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[0].amount, accountBefore1.frozenV2[0].amount+10e6);
  assert.equal(accountAfter1.delegated_frozenV2_balance_for_bandwidth, accountBefore1.delegated_frozenV2_balance_for_bandwidth-10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.undelegateResource(10e6, accounts.b58[7], 'BANDWIDTH', accounts.b58[1])
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.resource);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnDelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[0].amount, accountAfter1.frozenV2[0].amount+10e6);
  assert.equal(accountAfter2.delegated_frozenV2_balance_for_bandwidth, accountAfter1.delegated_frozenV2_balance_for_bandwidth-10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceAfter1.tronPowerLimit);
  console.log("undelegateResource_1 excute success")
}

async function undelegateResource_2(){
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  let transaction = await tronWeb.transactionBuilder.undelegateResource(10e6, accounts.hex[7], 'ENERGY', accounts.hex[1], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnDelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[1].amount, accountBefore1.frozenV2[1].amount+10e6);
  assert.equal(accountAfter1.account_resource.delegated_frozenV2_balance_for_energy, accountBefore1.account_resource.delegated_frozenV2_balance_for_energy-10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);

  transaction = await tronWeb.transactionBuilder.undelegateResource(10e6, accounts.b58[7], 'ENERGY', accounts.b58[1])
  tx = await broadcaster.broadcaster(null, accounts.pks[1], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[1]);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.equal(parameter.value.resource, 'ENERGY');
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnDelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.b58[1]);
  let accountResourceAfter2 = await tronWeb.trx.getAccountResources(accounts.b58[1])
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  console.log("accountResourceAfter2: "+util.inspect(accountResourceAfter2,true,null,true))
  assert.equal(accountAfter2.frozenV2[1].amount, accountAfter1.frozenV2[1].amount+10e6);
  assert.equal(accountAfter2.account_resource.delegated_frozenV2_balance_for_energy, accountAfter1.account_resource.delegated_frozenV2_balance_for_energy-10e6);
  assert.equal(accountResourceAfter2.tronPowerLimit, accountResourceAfter1.tronPowerLimit);
  console.log("undelegateResource_2 excute success")
}

async function undelegateResource_3(){
  let accountBefore1 = await tronWeb.trx.getAccount();
  let accountResourceBefore1 = await tronWeb.trx.getAccountResources()
  let transaction = await tronWeb.transactionBuilder.undelegateResource(10e6, accounts.hex[7])
  let tx = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, ADDRESS_HEX);
  assert.equal(parameter.value.receiver_address, accounts.hex[7]);
  assert.equal(parameter.value.balance, 10e6);
  assert.isUndefined(parameter.value.resource);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UnDelegateResourceContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter1 = await tronWeb.trx.getAccount();
  let accountResourceAfter1 = await tronWeb.trx.getAccountResources()
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  console.log("accountResourceAfter1: "+util.inspect(accountResourceAfter1,true,null,true))
  assert.equal(accountAfter1.frozenV2[0].amount, accountBefore1.frozenV2[0].amount+10e6);
  assert.equal(accountAfter1.delegated_frozenV2_balance_for_bandwidth, accountBefore1.delegated_frozenV2_balance_for_bandwidth-10e6);
  assert.equal(accountResourceAfter1.tronPowerLimit, accountResourceBefore1.tronPowerLimit);
  console.log("undelegateResource_3 excute success")
}

async function undelegateResource_4(){
  let params = [
    [100e6, accounts.b58[7], 'BANDWIDTH', 'ddssddd', {permissionId: 2}],
    [100e6, accounts.b58[7], 'BANDWIDTH', 'ddssddd'],
    [100e6, accounts.b58[7], 'ENERGY', 'ddssddd', {permissionId: 2}],
    [100e6, accounts.b58[7], 'ENERGY', 'ddssddd']
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.undelegateResource(...param),
        'Invalid origin address provided'
    )
  }

  params = [
    ['-100', accounts.b58[7], 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    ['-100', accounts.b58[7], 'BANDWIDTH', accounts.b58[1]],
    ['-100', accounts.b58[7], 'ENERGY', accounts.b58[1], {permissionId: 2}],
    ['-100', accounts.b58[7], 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.undelegateResource(...param),
        'Invalid amount provided'
    )
  }

  params = [
    [100e6, accounts.b58[7], 'aabbccdd', accounts.b58[1], {permissionId: 2}],
    [100e6, accounts.b58[7], 'aabbccdd', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.undelegateResource(...param),
        'Invalid resource provided: Expected "BANDWIDTH" or "ENERGY"'
    )
  }

  params = [
    [100e6, 'adskjkkk', 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    [100e6, 'adskjkkk', 'BANDWIDTH', accounts.b58[1]],
    [100e6, 'adskjkkk', 'ENERGY', accounts.b58[1], {permissionId: 2}],
    [100e6, 'adskjkkk', 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.undelegateResource(...param),
        'Invalid receiver address provided'
    )
  }

  params = [
    [100e6, accounts.b58[1], 'BANDWIDTH', accounts.b58[1], {permissionId: 2}],
    [100e6, accounts.b58[1], 'BANDWIDTH', accounts.b58[1]],
    [100e6, accounts.b58[1], 'ENERGY', accounts.b58[1], {permissionId: 2}],
    [100e6, accounts.b58[1], 'ENERGY', accounts.b58[1]]
  ];
  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.undelegateResource(...param),
        'Receiver address must not be the same as owner address'
    )
  }
  console.log("undelegateResource_4 excute success")
}

async function withdrawExpireUnfreeze_1(){
  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'BANDWIDTH', accounts.hex[3]));
  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'ENERGY', accounts.hex[3]));
  await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'ENERGY'));
  await wait(40);

  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.unfreezeBalanceV2(10e6, 'BANDWIDTH', accounts.hex[3]));
  await wait(35);
  let accountBefore1 = await tronWeb.trx.getAccount(accounts.b58[3]);
  assert.isTrue(accountBefore1.unfrozenV2[0].unfreeze_amount > 0);
  let transaction = await tronWeb.transactionBuilder.withdrawExpireUnfreeze(accounts.b58[3], {permissionId: 2})
  let tx = await broadcaster.broadcaster(null, accounts.pks[3], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  let parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[3]);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.WithdrawExpireUnfreezeContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 2);
  let accountAfter1 = await tronWeb.trx.getAccount(accounts.b58[3]);
  console.log("accountAfter1: "+util.inspect(accountAfter1,true,null,true))
  assert.isUndefined(accountAfter1.unfrozenV2);

  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.unfreezeBalanceV2(10e6, 'ENERGY', accounts.hex[3]));
  await wait(35);
  let accountBefore2 = await tronWeb.trx.getAccount(accounts.b58[3]);
  console.log("accountBefore2: "+util.inspect(accountBefore2,true,null,true))
  assert.isTrue(accountBefore2.unfrozenV2[0].unfreeze_amount > 0);
  transaction = await tronWeb.transactionBuilder.withdrawExpireUnfreeze(accounts.hex[3])
  tx = await broadcaster.broadcaster(null, accounts.pks[3], transaction);
  console.log("tx:"+util.inspect(tx))
  assert.equal(tx.transaction.txID.length, 64);
  await wait(30);
  parameter = txPars(transaction);
  assert.equal(parameter.value.owner_address, accounts.hex[3]);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.WithdrawExpireUnfreezeContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id || 0, 0);
  let accountAfter2 = await tronWeb.trx.getAccount(accounts.hex[3]);
  console.log("accountAfter2: "+util.inspect(accountAfter2,true,null,true))
  assert.isUndefined(accountAfter2.unfrozenV2);
  console.log("withdrawExpireUnfreeze_1 excute success")
}

async function withdrawExpireUnfreeze_2(){
  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'BANDWIDTH', accounts.hex[3]));
  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'ENERGY', accounts.hex[3]));
  await broadcaster.broadcaster(null, PRIVATE_KEY, await tronWeb.transactionBuilder.freezeBalanceV2(50e6, 'ENERGY'));
  await wait(40);

  await broadcaster.broadcaster(null, accounts.pks[3], await tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'ENERGY', accounts.hex[3]));

  const params = [
    ['ddssddd', {permissionId: 2}],
    ['ddssddd']
  ];

  for (let param of params) {
    await assertThrow(
        tronWeb.transactionBuilder.withdrawExpireUnfreeze(...param),
        'Invalid origin address provided'
    )
  }
  console.log("withdrawExpireUnfreeze_2 excute success")
}

async function estimateEnergy_1(){
  let transaction;
  let contractAddress;
  transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, accounts.hex[6]);
  await broadcaster.broadcaster(null, accounts.pks[6], transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  contractAddress = transaction.contract_address;

  const issuerAddress = accounts.hex[6];
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options1 = {estimateEnery: true, confirmed: true};
  let energyRequired1;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options1.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddress, functionSelector, options1,
        parameter, issuerAddress);
    console.log("result1: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired1 = result.energy_required;
  }

  const options2 = {estimateEnery: true};
  let energyRequired2;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options2.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddress, functionSelector, options2,
        parameter, issuerAddress);
    console.log("result2: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired2 = result.energy_required;
  }
  assert.equal(energyRequired1,energyRequired2)
  console.log("estimateEnergy_1 excute success")
}

async function estimateEnergy_2(){
  let transaction;
  let contractAddressWithArray;
  transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testAddressArray.abi,
    bytecode: testAddressArray.bytecode,
    permissionId: 2,
    parameters: [
      [accounts.hex[16], accounts.hex[17], accounts.hex[18]]
    ]
  }, accounts.hex[6]);
  await broadcaster.broadcaster(null, accounts.pks[6], transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  contractAddressWithArray = transaction.contract_address;

  const functionSelector = 'transferWith2(address[2],uint256[2])';
  const parameter = [
    {type: 'address[2]', value: [accounts.hex[16], accounts.hex[17]]},
    {type: 'uint256[2]', value: [123456, 123456]}
  ]
  const options1 = {estimateEnery: true, confirmed: true};
  let energyRequired1;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options1.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddressWithArray, functionSelector, options1,
        parameter, accounts.hex[6]);
    console.log("result1: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired1 = result.energy_required;
  }

  const options2 = {estimateEnery: true};
  let energyRequired2;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options2.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddressWithArray, functionSelector, options2,
        parameter, accounts.hex[6]);
    console.log("result2: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired2 = result.energy_required;
  }
  assert.equal(energyRequired1,energyRequired2)
  console.log("estimateEnergy_2 excute success")
}

async function estimateEnergy_3(){
  let transaction;
  let contractAddressWithArray;
  transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testAddressArray.abi,
    bytecode: testAddressArray.bytecode,
    permissionId: 2,
    parameters: [
      [accounts.hex[16], accounts.hex[17], accounts.hex[18]]
    ]
  }, accounts.hex[6]);
  await broadcaster.broadcaster(null, accounts.pks[6], transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  contractAddressWithArray = transaction.contract_address;

  const functionSelector = 'transferWithArray(address[],uint256[])';
  const parameter = [
    {type: 'address[]', value: [accounts.hex[16], accounts.hex[17]]},
    {type: 'uint256[]', value: [123456, 123456]}
  ]
  const options1 = {estimateEnery: true, confirmed: true};
  let energyRequired1;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options1.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddressWithArray, functionSelector, options1,
        parameter, accounts.hex[6]);
    console.log("result1: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired1 = result.energy_required;
  }

  const options2 = {estimateEnery: true};
  let energyRequired2;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options2.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddressWithArray, functionSelector, options2,
        parameter, accounts.hex[6]);
    console.log("result2: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired2 = result.energy_required;
  }
  assert.equal(energyRequired1,energyRequired2)
  console.log("estimateEnergy_3 excute success")
}

async function estimateEnergy_4(){
  let contractAddressWithTrctoken;

  let options = {
    abi: trcTokenTest070.abi,
    bytecode: trcTokenTest070.bytecode,
    parameters: [
      accounts.hex[18], TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    feeLimit: 9e7,
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  contractAddressWithTrctoken = transaction.contract_address;
  // contractAddressWithTrctoken = 'TE26AyNRRjAYN3GNDzH2kPeQndK98ZPK6L';

  // before balance
  const accountTrxBalanceBefore = await tronWeb.trx.getBalance(contractAddressWithTrctoken);
  const accountbefore = await tronWeb.trx.getAccount(contractAddressWithTrctoken);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  const toAddressBefore = await tronWeb.trx.getAccount(accounts.hex[17]);
  const toAddressTrc10BalanceBefore = toAddressBefore.assetV2?toAddressBefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value:0;
  console.log("accountTrxBalanceBefore:"+accountTrxBalanceBefore);
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);
  console.log("toAddressTrc10BalanceBefore:"+toAddressTrc10BalanceBefore);

  const functionSelector = 'TransferTokenTo(address,trcToken,uint256)';
  const parameter = [
    {type: 'address', value: accounts.hex[17]},
    {type: 'trcToken', value: TOKEN_ID},
    {type: 'uint256', value: 123}
  ];
  options = {
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    feeLimit:FEE_LIMIT
  };
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithTrctoken,  functionSelector, options,
      parameter, ADDRESS_HEX);
  const res = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction.transaction);
  console.log("transaction: "+util.inspect(transaction,true,null,true))
  console.log("res: "+util.inspect(res,true,null,true))
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("tx: "+util.inspect(tx,true,null,true))
      break;
    }
  }
  // after token balance
  const accountTrxBalanceAfter = await tronWeb.trx.getBalance(contractAddressWithTrctoken);
  console.log("accountTrxBalanceAfter:"+accountTrxBalanceAfter);
  const accountAfter = await tronWeb.trx.getAccount(contractAddressWithTrctoken);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(accounts.hex[17]);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrxBalanceAfter,(accountTrxBalanceBefore+321));
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore+1e3-123));
  assert.equal(toAddressTrc10BalanceAfter,123);

  const options1 = {
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    estimateEnery: true,
    confirmed: true
  };
  let energyRequired1;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options1.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddressWithTrctoken, functionSelector, options1,
        parameter, ADDRESS_HEX);
    console.log("result1: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired1 = result.energy_required;
  }

  const options2 = {
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    estimateEnery: true
  };
  let energyRequired2;
  for (let i = 0; i < 2; i++) {
    if (i === 1) options2.permissionId = 2;
    const result = await tronWeb.transactionBuilder.estimateEnergy(contractAddressWithTrctoken, functionSelector, options2,
        parameter, ADDRESS_HEX);
    console.log("result2: "+util.inspect(result,true,null,true))
    assert.isTrue(result.result.result);
    assert.isDefined(result.energy_required);
    assert.isNumber(result.energy_required);
    energyRequired2 = result.energy_required;
  }
  assert.equal(energyRequired1,energyRequired2)

  const transaction2 = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithTrctoken,  functionSelector, options,
      parameter, ADDRESS_HEX);
  const res2 = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction2.transaction);
  console.log("transaction2: "+util.inspect(transaction2,true,null,true))
  console.log("res2: "+util.inspect(res2,true,null,true))
  while (true) {
    const tx2 = await tronWeb.trx.getTransactionInfo(transaction2.transaction.txID);
    if (Object.keys(tx2).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("tx2: "+util.inspect(tx2,true,null,true))
      break;
    }
  }

  const options3 = {
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    _isConstant: true
  };
  const transaction3 = await tronWeb.transactionBuilder.triggerConstantContract(contractAddressWithTrctoken,  functionSelector, options3,
      parameter, ADDRESS_HEX);
  console.log("transaction3: "+util.inspect(transaction3,true,null,true))
  console.log("estimateEnergy_4 excute success")
}

async function withdrawBalance(){
  const params = [
    [WITNESS_ACCOUNT, { permissionId: 2 }],
    [WITNESS_ACCOUNT]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.withdrawBlockRewards(
        ...param
    );
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);

  }
  console.log("withdrawBalance excute success")
}

async function vote(){
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  let url = 'https://xtron.network';

  /**
   * Execute this method when Proposition 70 is not enabled
   */
  // await broadcaster.broadcaster(tronWeb.transactionBuilder.freezeBalance(100e6, 3, 'BANDWIDTH', emptyAccount2.address.base58), emptyAccount2.privateKey)
  /**
   * Execute this method when Proposition 70 is enabled
   */
  await broadcaster.broadcaster(tronWeb.transactionBuilder.freezeBalanceV2(100e6, 'BANDWIDTH', emptyAccount2.address.base58), emptyAccount2.privateKey)

  let votes = {}
  votes[tronWeb.address.toHex(WITNESS_ACCOUNT)] = 5

  const transaction = await tronWeb.transactionBuilder.vote(votes, emptyAccount2.address.base58)
  const parameter = txPars(transaction);

  assert.equal(parameter.value.owner_address, emptyAccount2.address.hex.toLowerCase());
  assert.equal(parameter.value.votes[0].vote_address, tronWeb.address.toHex(WITNESS_ACCOUNT));
  assert.equal(parameter.value.votes[0].vote_count, 5);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.VoteWitnessContract');
  console.log("vote excute success")
}

async function createSmartContract(){
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

  let options = {
    abi: testRevert.abi,
    bytecode: testRevert.bytecode
  };
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const tx = await tronWeb.transactionBuilder.createSmartContract(options)
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.consume_user_resource_percent, 100);
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.origin_energy_limit, 1e7);
    assert.equal(tx.raw_data.fee_limit, 15e7);
    assert.equal(tx.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }

  const bals = [1000, 2000, 3000, 4000];
  options = {
    abi: arrayParam.abi,
    bytecode: arrayParam.bytecode,
    permissionId: 2,
    parameters: [
      [emptyAccount1.address.hex, emptyAccount2.address.hex, emptyAccount3.address.hex, emptyAccount4.address.hex],
      [bals[0], bals[1], bals[2], bals[3]]
    ]
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, emptyAccount5.address.hex);
  await broadcaster.broadcaster(null, emptyAccount5.privateKey, transaction);
  console.log("transaction.txID: "+transaction.txID)
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  const deployed = await tronWeb.contract().at(transaction.contract_address);
  let bal = await deployed.balances(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[0]);
  bal = await deployed.balances(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[1]);
  bal = await deployed.balances(emptyAccount3.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[2]);
  bal = await deployed.balances(emptyAccount4.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, bals[3]);


  options = {
    abi: testRevert.abi,
    bytecode: testRevert.bytecode,
    userFeePercentage: 30,
    originEnergyLimit: 9e6,
    feeLimit: 9e8
  };
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    const tx = await tronWeb.transactionBuilder.createSmartContract(options)
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.consume_user_resource_percent, 30);
    assert.equal(tx.raw_data.contract[0].parameter.value.new_contract.origin_energy_limit, 9e6);
    assert.equal(tx.raw_data.fee_limit, 9e8);
    assert.equal(tx.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("createSmartContract excute success");
}

async function createSmartContractWithArray3(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,1000000000,{privateKey: PRIVATE_KEY})

  const options = {
    abi: testAddressArray.abi,
    bytecode: testAddressArray.bytecode,
    permissionId: 2,
    parameters: [
      [emptyAccount1.address.hex, emptyAccount2.address.hex, emptyAccount3.address.hex]
    ]
  };
  console.log("ADDRESS_HEX:"+ADDRESS_HEX);
  console.log("PRIVATE_KEY:"+PRIVATE_KEY);
  console.log("PRIVATE_KEY:"+util.inspect(await tronWeb.trx.getAccount(ADDRESS_HEX),true,null,true));
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, emptyAccount4.address.hex);
  const createTx = await broadcaster.broadcaster(null, emptyAccount4.privateKey, transaction);
  assert.equal(createTx.transaction.txID.length, 64);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(createTx.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  const deployed = await tronWeb.contract().at(transaction.contract_address);
  let bal = await deployed.balanceOf(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);
  bal = await deployed.balanceOf(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);
  bal = await deployed.balanceOf(emptyAccount3.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);

  console.log("createSmartContractWithArray3 excute success");
}

async function createSmartContractWithTrctokenAndStateMutability(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})

  // before token balance
  const accountbefore = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);
  const options = {
    abi: trcTokenTest070.abi,
    bytecode: trcTokenTest070.bytecode,
    parameters: [
      emptyAccount1.address.hex, TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    feeLimit: FEE_LIMIT
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  // after token balance
  const accountAfter = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(emptyAccount1.address.hex);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore-1e3));
  assert.equal(toAddressTrc10BalanceAfter,123);

  console.log("createSmartContractWithTrctokenAndStateMutability excute success");
}

async function createSmartContractWithPayable(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})

  // before token balance
  const accountbefore = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);
  const options = {
    abi: trcTokenTest059.abi,
    bytecode: trcTokenTest059.bytecode,
    parameters: [
      emptyAccount1.address.hex, TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3
  };
  const transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  // after token balance
  const accountAfter = await tronWeb.trx.getAccount(ADDRESS_HEX);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(emptyAccount1.address.hex);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore-1e3));
  assert.equal(toAddressTrc10BalanceAfter,123);

  console.log("createSmartContractWithPayable excute success");
}

async function triggerConstantContract(){
  console.log("triggerConstantContract excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let transaction;
  transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const issuerAddress = emptyAccount1.address.hex;
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options = {};
  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress, functionSelector, options,
        parameter, issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000004');
    transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("triggerConstantContract excute success");
}

async function triggerComfirmedConstantContract(){
  console.log("triggerComfirmedConstantContract excute start");
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const issuerAddress = emptyAccount1.address.hex;
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options = {};

  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    transaction = await tronWeb.transactionBuilder.triggerConfirmedConstantContract(contractAddress, functionSelector, options,
        parameter, issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000004');
    transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("triggerComfirmedConstantContract excute success");
}

async function clearabi(){
  console.log("clearabi excute start");
  await tronWeb.trx.sendTrx(accounts.hex[7],3000000000,{privateKey: PRIVATE_KEY})
  await wait(3);

  let contract;
  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, accounts.hex[7]);
  await broadcaster.broadcaster(null, accounts.pks[7], transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const params = [
    [transaction, accounts.hex[7], {permissionId: 2}],
    [transaction, accounts.hex[7]],
  ];
  for (const param of params) {
    const contractAddress = param[0].contract_address;
    const ownerAddress = param[1];

    // verify contract abi before
    contract = await tronWeb.trx.getContract(contractAddress);
    assert.isTrue(Object.keys(contract.abi).length > 0)

    // clear abi
    let transaction1 = await tronWeb.transactionBuilder.clearABI(contractAddress, ownerAddress, param[2]);
    const parameter = txPars(transaction1);
    assert.isTrue(!transaction1.visible &&
        transaction1.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.ClearABIContract');
    assert.equal(transaction1.txID.length, 64);
    assert.equal(parameter.value.contract_address, tronWeb.address.toHex(contractAddress));
    assert.equal(parameter.value.owner_address, tronWeb.address.toHex(ownerAddress));
    assert.equal(transaction1.raw_data.contract[0].Permission_id, param[2]?.permissionId);

    if (param.length === 2) {
      let transaction2 = await broadcaster.broadcaster(null, accounts.pks[7], transaction1);
      assert.isTrue(transaction2.receipt.result);

      // verify contract abi after
      while (true) {
        contract = await tronWeb.trx.getContract(contractAddress);
        if (Object.keys(contract.abi).length > 0) {
          await wait(3);
          continue;
        } else {
          break;
        }
      }
      assert.isTrue(Object.keys(contract.abi).length === 0);
    }
  }
  console.log("clearabi excute success");
}

async function clearabiMultiSign(){
  let transactions = [];
  let contracts = [];
  transactions.push(await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, accounts.hex[7]));
  console.log("Create transaction end.");
  transactions.forEach(async (tx) => {
    contracts.push(await broadcaster.broadcaster(null, accounts.pks[7], tx));
  });

  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transactions[0].txID);
    if (Object.keys(tx).length === 0 ) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  console.log("Deploy transaction end.");
  const accountsl = {
    b58: [],
    hex: [],
    pks: []
  }
  const idxS = 0;
  const idxE = 2;
  const threshold = 2;
  tronWeb = tronWebBuilder.createInstance();
  const sendTrxTx = await tronWeb.trx.sendTrx(accounts.b58[7], 5000000000);
  const sendTrxTx2 = await tronWeb.trx.sendTrx(accounts.b58[6], 500000000);
  assert.isTrue(sendTrxTx.result);
  assert.isTrue(sendTrxTx2.result);
  await wait(15);

  accountsl.pks.push(accounts.pks[6]);
  accountsl.b58.push(accounts.b58[6]);
  accountsl.hex.push(accounts.hex[6]);
  accountsl.pks.push(accounts.pks[7]);
  accountsl.b58.push(accounts.b58[7]);
  accountsl.hex.push(accounts.hex[7]);
  let ownerPk = accounts.pks[7]

  // update account permission
  let ownerPermission = { type: 0, permission_name: 'owner' };
  ownerPermission.threshold = 1;
  ownerPermission.keys  = [];
  let activePermission = { type: 2, permission_name: 'active0' };
  activePermission.threshold = threshold;
  //activePermission.operations = '7fff1fc0037e0300000000000000000000000000000000000000000000000000';
  activePermission.operations = '7fff1fc0037e0100000000000000000000000000000000000000000000000000';
  activePermission.keys = [];

  ownerPermission.keys.push({ address: accounts.hex[7], weight: 1 });
  for (let i = idxS; i < idxE; i++) {
    let address = accountsl.hex[i];
    let weight = 1;
    activePermission.keys.push({ address: address, weight: weight });
  }

  const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
      accounts.hex[7],
      ownerPermission,
      null,
      [activePermission]
  );

  console.log("updateTransaction:"+util.inspect(updateTransaction))
  await wait(30);
  const updateTx = await broadcaster.broadcaster(null, ownerPk, updateTransaction);
  console.log("updateTx:"+util.inspect(updateTx))
  console.log("updateTx.txID:"+updateTx.transaction.txID)
  assert.equal(updateTx.transaction.txID.length, 64);
  await wait(30);
  console.log("update permission end");
  const updateAfter = await tronWeb.trx.getAccount(accounts.hex[7]);
  console.log("account7 permission: ",JSON.stringify(updateAfter, null, 2))

  const param = [transactions[0], accounts.hex[7], {permissionId: 2}];
  const contractAddress = param[0].contract_address;
  const ownerAddress = param[1];

  // verify contract abi before
  const contract = await tronWeb.trx.getContract(contractAddress);
  assert.isTrue(Object.keys(contract.abi).length > 0)
  console.log("clear abi start");
  // clear abi
  const transaction = await tronWeb.transactionBuilder.clearABI(contractAddress, ownerAddress, param[2]);
  console.log("create multi transaction: ",JSON.stringify(transaction, null, 2));
  const parameter = txPars(transaction);
  assert.isTrue(!transaction.visible &&
      transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.ClearABIContract');
  assert.equal(transaction.txID.length, 64);
  assert.equal(parameter.value.contract_address, tronWeb.address.toHex(contractAddress));
  assert.equal(parameter.value.owner_address, tronWeb.address.toHex(ownerAddress));
  assert.equal(transaction.raw_data.contract[0].Permission_id, param[2]?.permissionId);

  let signedTransaction = transaction;
  for (let i = idxS; i < idxE; i++) {
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accountsl.pks[i], 2);
    console.log("multi transaction signed by ",accountsl.b58[i]);
    console.log("multi transaction is ",JSON.stringify(signedTransaction, null, 2));
  }
  assert.equal(signedTransaction.signature.length, 2);

  // broadcast multi-sign transaction

  const result = await tronWeb.trx.broadcast(signedTransaction);
  console.log("broadcast multi transaction result: ", JSON.stringify(result, null, 2));
  assert.isTrue(result.result)
  let contract1;
  // verify contract abi after
  while (true) {
    contract1 = await tronWeb.trx.getContract(contractAddress);
    if (Object.keys(contract1.abi).length > 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.isTrue(Object.keys(contract1.abi).length === 0);
  console.log("clearabiMultiSign excute success!");
}

async function updateBrokerage(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,10010000000,{privateKey: PRIVATE_KEY})

  let url = 'https://xtron2.network';
  // let witnesses;

  await broadcaster.broadcaster(tronWeb.transactionBuilder.applyForSR(emptyAccount1.address.base58, url), emptyAccount1.privateKey)


  console.log("emptyAccount1:"+emptyAccount1.address.base58)
  const transaction = await tronWeb.transactionBuilder.updateBrokerage(10, emptyAccount1.address.hex);

  await assertThrow(
      tronWeb.transactionBuilder.updateBrokerage(null, emptyAccount1.address.hex),
      'Invalid brokerage provided'
  );

  let brokerages = [-1, 101]
  for (let brokerage of brokerages) {
    await assertThrow(
        tronWeb.transactionBuilder.updateBrokerage(brokerage, emptyAccount1.address.hex),
        'Brokerage must be an integer between 0 and 100'
    );
  }

  await assertThrow(
      tronWeb.transactionBuilder.updateBrokerage(10, 'abcd'),
      'Invalid owner address provided'
  );
  console.log("updateBrokerage excute success")
}

async function updateBrokerageMultiSign(){
  await broadcaster.broadcaster(tronWeb.transactionBuilder.sendTrx(accounts.b58[1], 10000e6), PRIVATE_KEY);
  await broadcaster.broadcaster(tronWeb.transactionBuilder.applyForSR(accounts.b58[1], 'abc.tron.network'), accounts.pks[1])

  const params = [
    [10, accounts.hex[3], {permissionId: 2}],
    [20, accounts.hex[3]]
  ];
  for (const param of params) {
    const transaction = await tronWeb.transactionBuilder.updateBrokerage(...param);
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.brokerage, param[0]);
    assert.equal(parameter.value.owner_address, param[1]);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.UpdateBrokerageContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id, param[2]?.permissionId);
  }

  const accountsl = {
    b58: [],
    hex: [],
    pks: []
  }
  const idxS = 0;
  const idxE = 2;
  const threshold = 2;
  tronWeb = tronWebBuilder.createInstance();
  const sendTrxTx = await tronWeb.trx.sendTrx(accounts.b58[1], 5000000000);
  const sendTrxTx2 = await tronWeb.trx.sendTrx(accounts.b58[2], 500000000);
  assert.isTrue(sendTrxTx.result);
  assert.isTrue(sendTrxTx2.result);
  await wait(15);

  accountsl.pks.push(accounts.pks[2]);
  accountsl.b58.push(accounts.b58[2]);
  accountsl.hex.push(accounts.hex[2]);
  accountsl.pks.push(accounts.pks[1]);
  accountsl.b58.push(accounts.b58[1]);
  accountsl.hex.push(accounts.hex[1]);
  let ownerPk = accounts.pks[1]
  let ownerAddressBase58 = accounts.b58[1];
  let ownerAddress = accounts.hex[1];
  console.log("ownerAddress: "+ownerAddress + "    ownerAddressBase58：" + ownerAddressBase58)

  // update account permission
  let ownerPermission = { type: 0, permission_name: 'owner' };
  ownerPermission.threshold = 1;
  ownerPermission.keys  = [];
  let activePermission = { type: 2, permission_name: 'active0' };
  let witnessPermission = { type: 1, permission_name: 'witness' };
  activePermission.threshold = threshold;
  activePermission.operations = '7fff1fc0037e0200000000000000000000000000000000000000000000000000';
  activePermission.keys = [];
  witnessPermission.threshold = 1;
  witnessPermission.keys = [];

  ownerPermission.keys.push({ address: ownerAddress, weight: 1 });
  witnessPermission.keys.push({ address:ownerAddress, weight: 1 })
  for (let i = idxS; i < idxE; i++) {
    let address = accountsl.hex[i];
    let weight = 1;
    activePermission.keys.push({ address: address, weight: weight });
  }

  const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
      ownerAddress,
      ownerPermission,
      witnessPermission,
      [activePermission]
  );

  console.log("updateTransaction:"+util.inspect(updateTransaction))
  await wait(30);
  const updateTx = await broadcaster.broadcaster(null, ownerPk, updateTransaction);
  console.log("updateTx:"+util.inspect(updateTx))
  console.log("updateTx.txID:"+updateTx.transaction.txID)
  assert.equal(updateTx.transaction.txID.length, 64);
  await wait(30);

  const cnt = 30
  const param = [cnt, ownerAddress, {permissionId: 2}];
  const transaction = await tronWeb.transactionBuilder.updateBrokerage(...param);
  //
  let signedTransaction = transaction;
  for (let i = idxS; i < idxE; i++) {
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accountsl.pks[i], 2);
  }
  assert.equal(signedTransaction.signature.length, 2);

  // broadcast multi-sign transaction
  const result = await tronWeb.trx.broadcast(signedTransaction);
  assert.isTrue(result.result); //It takes about 3-5 minutes for the modification to succeed！

  console.log("updateBrokerageMultiSign excute success")
}

async function triggerSmartContract(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, emptyAccount1.address.hex);
  await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const contractAddress = transaction.contract_address;
  const issuerAddress = emptyAccount1.address.hex;
  const functionSelector = 'testPure(uint256,uint256)';
  const parameter = [
    {type: 'uint256', value: 1},
    {type: 'uint256', value: 2}
  ]
  const options = {};

  for (let i = 0; i < 2; i++) {
    if (i === 1) options.permissionId = 2;
    transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, options,
        parameter, issuerAddress);
    assert.isTrue(transaction.result.result &&
        transaction.transaction.raw_data.contract[0].parameter.type_url === 'type.googleapis.com/protocol.TriggerSmartContract');
    console.log("trigger transaction: ",JSON.stringify(transaction, null, 2) )
    assert.equal(transaction.constant_result, '0000000000000000000000000000000000000000000000000000000000000004');
    transaction = await broadcaster.broadcaster(null, emptyAccount1.privateKey, transaction.transaction);
    assert.isTrue(transaction.receipt.result)
    assert.equal(transaction.transaction.raw_data.contract[0].Permission_id || 0, options.permissionId || 0);
  }
  console.log("triggerSmartContract excute success")
}

async function triggerSmartContractWithArrays(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,1000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,100000000,{privateKey: PRIVATE_KEY})

  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testAddressArray.abi,
    bytecode: testAddressArray.bytecode,
    parameters: [
      [emptyAccount1.address.hex, emptyAccount2.address.hex, emptyAccount3.address.hex]
    ]
  }, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let contractAddressWithArray = transaction.contract_address;

  let functionSelector = 'transferWith2(address[2],uint256[2])';
  let parameter = [
    {type: 'address[2]', value: [emptyAccount1.address.hex, emptyAccount2.address.hex]},
    {type: 'uint256[2]', value: [123456, 123456]}
  ]
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithArray,  functionSelector, {},
      parameter, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction.transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let deployed = await tronWeb.contract().at(contractAddressWithArray);
  let bal = await deployed.balanceOf(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100123456);
  bal = await deployed.balanceOf(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100123456);
  bal = await deployed.balanceOf(emptyAccount3.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100000000);

  functionSelector = 'transferWithArray(address[],uint256[])';
  parameter = [
    {type: 'address[]', value: [emptyAccount1.address.hex, emptyAccount2.address.hex]},
    {type: 'uint256[]', value: [123456, 123456]}
  ]
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithArray,  functionSelector, {},
      parameter, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction.transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  deployed = await tronWeb.contract().at(contractAddressWithArray);
  bal = await deployed.balanceOf(emptyAccount1.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100246912);
  bal = await deployed.balanceOf(emptyAccount2.address.hex).call();
  bal = bal.toNumber();
  assert.equal(bal, 100246912);

  console.log("triggerSmartContractWithArrays excute success");
}

async function triggerSmartContractWithTrctoken(){
  const emptyAccount1 = await TronWeb.createAccount();

  let options = {
    abi: trcTokenTest070.abi,
    bytecode: trcTokenTest070.bytecode,
    parameters: [
      emptyAccount1.address.hex, TOKEN_ID, 123
    ],
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    feeLimit: 9e7,
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_HEX);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  let createInfo
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let contractAddressWithTrctoken = transaction.contract_address;

  // before balance
  const accountTrxBalanceBefore = await tronWeb.trx.getBalance(contractAddressWithTrctoken);
  const accountbefore = await tronWeb.trx.getAccount(contractAddressWithTrctoken);
  const accountTrc10BalanceBefore = accountbefore.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrxBalanceBefore:"+accountTrxBalanceBefore);
  console.log("accountTrc10BalanceBefore:"+accountTrc10BalanceBefore);

  const functionSelector = 'TransferTokenTo(address,trcToken,uint256)';
  const parameter = [
    {type: 'address', value: emptyAccount1.address.hex},
    {type: 'trcToken', value: TOKEN_ID},
    {type: 'uint256', value: 123}
  ];
  options = {
    callValue:321,
    tokenId:TOKEN_ID,
    tokenValue:1e3,
    feeLimit:FEE_LIMIT
  };
  transaction = await tronWeb.transactionBuilder.triggerSmartContract(contractAddressWithTrctoken,  functionSelector, options,
      parameter, ADDRESS_HEX);
  const res = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction.transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  // after token balance
  const accountTrxBalanceAfter = await tronWeb.trx.getBalance(contractAddressWithTrctoken);
  console.log("accountTrxBalanceAfter:"+accountTrxBalanceAfter);
  const accountAfter = await tronWeb.trx.getAccount(contractAddressWithTrctoken);
  const accountTrc10BalanceAfter = accountAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("accountTrc10BalanceAfter:"+accountTrc10BalanceAfter);
  const toAddressAfter = await tronWeb.trx.getAccount(emptyAccount1.address.hex);
  const toAddressTrc10BalanceAfter = toAddressAfter.assetV2.filter((item)=> item.key == TOKEN_ID)[0].value;
  console.log("toAddressTrc10BalanceAfter:"+toAddressTrc10BalanceAfter);
  assert.equal(accountTrxBalanceAfter,(accountTrxBalanceBefore+321));
  assert.equal(accountTrc10BalanceAfter,(accountTrc10BalanceBefore+1e3-123));
  assert.equal(toAddressTrc10BalanceAfter,246);

  console.log("triggerSmartContractWithTrctoken excute success");
}

async function createTokenExchange(){
  let tokenNames = [];
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount2 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount2.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount3 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount3.address.hex,3000000000,{privateKey: PRIVATE_KEY})
  const emptyAccount4 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount4.address.hex,3000000000,{privateKey: PRIVATE_KEY})

  // create token
  let tempAccount = emptyAccount1;
  for (let i = 0; i < 2; i++) {
    const options = getTokenOptions();

    const transaction = await tronWeb.transactionBuilder.createToken(options, tempAccount.address.hex);
    await broadcaster.broadcaster(null, tempAccount.privateKey, transaction);
    await waitChainData('token', tempAccount.address.hex);
    const token = await tronWeb.trx.getTokensIssuedByAddress(tempAccount.address.hex);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount3.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    await waitChainData('sendToken', emptyAccount3.address.hex, 0);
    await broadcaster.broadcaster(null, tempAccount.privateKey, await tronWeb.transactionBuilder.sendToken(
        emptyAccount4.address.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    await waitChainData('sendToken', emptyAccount4.address.hex, 0);
    tokenNames.push(token[Object.keys(token)[0]]['id']);

    tempAccount = emptyAccount2;
  }

  let transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount3.address.hex);
  let parameter = txPars(transaction);

  assert.equal(transaction.txID.length, 64);
  assert.equal(TronWeb.toUtf8(parameter.value.first_token_id), tokenNames[0]);
  assert.equal(TronWeb.toUtf8(parameter.value.second_token_id), tokenNames[1]);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ExchangeCreateContract');
  assert.isUndefined(transaction.raw_data.contract[0].Permission_id);

  transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[0], 10e3, tokenNames[1], 10e3, emptyAccount3.address.hex, {permissionId: 2});
  parameter = txPars(transaction);

  assert.equal(transaction.txID.length, 64);
  assert.equal(TronWeb.toUtf8(parameter.value.first_token_id), tokenNames[0]);
  assert.equal(TronWeb.toUtf8(parameter.value.second_token_id), tokenNames[1]);
  assert.equal(parameter.type_url, 'type.googleapis.com/protocol.ExchangeCreateContract');
  assert.equal(transaction.raw_data.contract[0].Permission_id, 2);
  console.log("createTokenExchange success")
}

async function createTRXExchange(){
  // TODO
}

async function injectExchangeTokens(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(2);
  const idxS = 0;
  const idxE = 2;
  let tokenNames = [];
  let exchangeId = '';

  // create token
  for (let i = idxS; i < idxE; i++) {
    const options = getTokenOptions();
    const transaction = await tronWeb.transactionBuilder.createToken(options, accounts.hex[i]);
    await broadcaster.broadcaster(null, accounts.pks[i], transaction);
    await waitChainData('token', accounts.hex[i]);
    const token = await tronWeb.trx.getTokensIssuedByAddress(accounts.hex[i]);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, accounts.pks[i], await tronWeb.transactionBuilder.sendToken(
        tronWeb.defaultAddress.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    tokenNames.push(token[Object.keys(token)[0]]['id']);
  }
  const transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[1], 10, tokenNames[0], 10);
  const result = await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("result: "+util.inspect(result,true,null,true))
  let receipt = await tronWeb.trx.getTransactionInfo(transaction.txID);
  while (!Object.keys(receipt).length) {
    await wait(5);
    receipt = await tronWeb.trx.getTransactionInfo(transaction.txID);
  }
  exchangeId = receipt.exchange_id;

  const params = [
    [exchangeId, tokenNames[0], 10, { permissionId: 2 }],
    [exchangeId, tokenNames[0], 10]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.injectExchangeTokens(
        ...param
    );
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);
  }
  console.log("injectExchangeTokens success")
}

async function withdrawExchangeTokens(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(2);
  const idxS = 0;
  const idxE = 2;
  let tokenNames = [];
  let exchangeId = '';

  // create token
  for (let i = idxS; i < idxE; i++) {
    const options = getTokenOptions();
    const transaction = await tronWeb.transactionBuilder.createToken(options, accounts.hex[i]);
    await broadcaster.broadcaster(null, accounts.pks[i], transaction);
    await waitChainData('token', accounts.hex[i]);
    const token = await tronWeb.trx.getTokensIssuedByAddress(accounts.hex[i]);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, accounts.pks[i], await tronWeb.transactionBuilder.sendToken(
        tronWeb.defaultAddress.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    tokenNames.push(token[Object.keys(token)[0]]['id']);
  }
  const transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[1], 10, tokenNames[0], 10);
  await broadcaster.broadcaster(transaction);
  let receipt = await tronWeb.trx.getTransactionInfo(transaction.txID);
  while (!Object.keys(receipt).length) {
    await wait(5);
    receipt = await tronWeb.trx.getTransactionInfo(transaction.txID);
  }
  exchangeId = receipt.exchange_id;

  transaction.raw_data_hex = transaction.raw_data_hex + '00';
  const authResult2 =
      TronWeb.utils.transaction.txCheck(transaction);
  assert.equal(authResult2, false);

  const params = [
    [exchangeId, tokenNames[0], 10, { permissionId: 2 }],
    [exchangeId, tokenNames[0], 10]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.withdrawExchangeTokens(
        ...param
    );
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);
  }
  console.log("withdrawExchangeTokens excute success");
}

async function tradeExchangeTokens(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(2);
  const idxS = 0;
  const idxE = 2;
  let tokenNames = [];
  let exchangeId = '';

  // create token
  for (let i = idxS; i < idxE; i++) {
    const options = getTokenOptions();
    const transaction = await tronWeb.transactionBuilder.createToken(options, accounts.hex[i]);
    await broadcaster.broadcaster(null, accounts.pks[i], transaction);
    await waitChainData('token', accounts.hex[i]);
    const token = await tronWeb.trx.getTokensIssuedByAddress(accounts.hex[i]);
    await waitChainData('tokenById', token[Object.keys(token)[0]]['id']);
    await broadcaster.broadcaster(null, accounts.pks[i], await tronWeb.transactionBuilder.sendToken(
        tronWeb.defaultAddress.hex,
        10e4,
        token[Object.keys(token)[0]]['id'],
        token[Object.keys(token)[0]]['owner_address']
    ));
    tokenNames.push(token[Object.keys(token)[0]]['id']);
  }
  // console.log(tokenNames, 99999999);
  const transaction = await tronWeb.transactionBuilder.createTokenExchange(tokenNames[1], 10, tokenNames[0], 10);
  await broadcaster.broadcaster(transaction);
  let receipt = await tronWeb.trx.getTransactionInfo(transaction.txID);
  while (!Object.keys(receipt).length) {
    await wait(5);
    receipt = await tronWeb.trx.getTransactionInfo(transaction.txID);
  }
  exchangeId = receipt.exchange_id;

  const params = [
    [exchangeId, tokenNames[0], 10, 5, { permissionId: 2 }],
    [exchangeId, tokenNames[0], 10, 5]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.tradeExchangeTokens(
        ...param
    );
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);

    transaction.raw_data_hex = transaction.raw_data_hex + '00';
    const authResult2 =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult2, false);

    transaction.txID = transaction.txID + '00'
    const authResult3 =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult3, false);
  }
  console.log("tradeExchangeTokens excute success");
}

async function updateSetting(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(1);
  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, accounts.hex[0]);
  await broadcaster.broadcaster(null, accounts.pks[0], transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const params = [
    [transaction.contract_address, 10, accounts.b58[0], { permissionId: 2 }],
    [transaction.contract_address, 20, accounts.b58[0]]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.updateSetting(
        ...param
    );
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);
  }
  console.log("updateSetting excute success");
}

async function updateEnergyLimit(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(1);
  let transaction = await tronWeb.transactionBuilder.createSmartContract({
    abi: testConstant.abi,
    bytecode: testConstant.bytecode
  }, accounts.hex[0]);
  await broadcaster.broadcaster(null, accounts.pks[0], transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const params = [
    [transaction.contract_address, 10e6, accounts.b58[0], { permissionId: 2 }],
    [transaction.contract_address, 10e6, accounts.b58[0]]
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.updateEnergyLimit(
        ...param
    );
    const authResult =
        TronWeb.utils.transaction.txCheck(transaction);
    assert.equal(authResult, true);
  }
  console.log("updateEnergyLimit excute success");
}

async function accountPermissionUpdate(){
  let accounts = await tronWebBuilder.getTestAccountsInMain(1);
  await broadcaster.broadcaster(tronWeb.transactionBuilder.sendTrx(accounts.b58[0], 10000e6), PRIVATE_KEY);
  const transaction = await tronWeb.transactionBuilder.applyForSR(accounts.b58[0], 'url.tron.network');
  await broadcaster.broadcaster(transaction, accounts.pks[0]);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const permissionData = {
    "owner": {
      "type": 0,
      "keys": [
        {
          "address": accounts.hex[0],
          "weight": 1
        }
      ],
      "threshold": 1,
      "permission_name": "owner"
    },
    "witness": {
      "keys": [
        {
          "address": accounts.hex[0],
          "weight": 1
        }
      ],
      "threshold": 1,
      "id": 1,
      "type": 1,
      "permission_name": "witness"
    },
    "owner_address": accounts.hex[0],
    "actives": [
      {
        "operations": "7fff1fc0033e0000000000000000000000000000000000000000000000000000",
        "keys": [
          {
            "address": accounts.hex[0],
            "weight": 1
          }
        ],
        "threshold": 1,
        "id": 2,
        "type": 2,
        "permission_name": "active"
      }
    ]
  };
  const params = [
    [accounts.hex[0], permissionData.owner, permissionData.witness, permissionData.actives, {permissionId: 2}],
    [accounts.hex[0], permissionData.owner, permissionData.witness, permissionData.actives] // No suppored for multiSign
  ];
  for (let param of params) {
    const transaction = await tronWeb.transactionBuilder.updateAccountPermissions(
        ...param
    );
    const parameter = txPars(transaction);
    assert.equal(transaction.txID.length, 64);
    assert.equal(parameter.value.owner_address, param[0]);
    assert.equal(parameter.type_url, 'type.googleapis.com/protocol.AccountPermissionUpdateContract');
    assert.equal(transaction.raw_data.contract[0].Permission_id, param[4]?.permissionId);
  }
  console.log("accountPermissionUpdate excute success");
}

async function accountPermissionUpdateMultiSign(){
  const accountsl = {
    b58: [],
    hex: [],
    pks: []
  }
  const idxS = 0;
  const idxE = 2;
  const threshold = 2;
  tronWeb = tronWebBuilder.createInstance();
  const sendTrxTx = await tronWeb.trx.sendTrx(accounts.b58[8], 5000000000);
  const sendTrxTx2 = await tronWeb.trx.sendTrx(accounts.b58[9], 500000000);
  assert.isTrue(sendTrxTx.result);
  assert.isTrue(sendTrxTx2.result);
  await wait(15);

  accountsl.pks.push(accounts.pks[8]);
  accountsl.b58.push(accounts.b58[8]);
  accountsl.hex.push(accounts.hex[8]);
  accountsl.pks.push(accounts.pks[9]);
  accountsl.b58.push(accounts.b58[9]);
  accountsl.hex.push(accounts.hex[9]);

  // update account permission
  let ownerPermission = { type: 0, permission_name: 'owner' };
  ownerPermission.threshold = threshold;
  ownerPermission.keys  = [];
  let activePermission = { type: 2, permission_name: 'active0' };
  activePermission.threshold = threshold;
  activePermission.operations = '7fff1fc0037e0100000000000000000000000000000000000000000000000000';
  activePermission.keys = [];

  for (let i = idxS; i < idxE; i++) {
    let address = accountsl.hex[i];
    let weight = 1;
    ownerPermission.keys.push({ address: address, weight: weight });
    activePermission.keys.push({ address: address, weight: weight });
  }

  let updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
      accounts.hex[8],
      ownerPermission,
      null,
      [activePermission]
  );

  console.log("updateTransaction:"+util.inspect(updateTransaction))
  await wait(30);
  const updateTx = await broadcaster.broadcaster(null, accounts.pks[8], updateTransaction);
  console.log("updateTx:"+util.inspect(updateTx))
  console.log("updateTx.txID:"+updateTx.transaction.txID)
  assert.equal(updateTx.transaction.txID.length, 64);
  await wait(30);

  let res = await tronWeb.trx.getAccount(accounts.b58[8])
  assert.equal(res.owner_permission.threshold,2,"ownerPermission set 2 users error!")

  ownerPermission = { type: 0, permission_name: 'owner' };
  ownerPermission.threshold = 1;
  ownerPermission.keys  = [];
  ownerPermission.keys.push({ address: accounts.hex[8], weight: 1 });
  updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(
      accounts.hex[8],
      ownerPermission,
      null,
      [activePermission]
  );
  let signedTransaction = updateTransaction;
  for (let i = idxS; i < idxE; i++) {
    signedTransaction = await tronWeb.trx.multiSign(signedTransaction, accountsl.pks[i], 0);
  }
  assert.equal(signedTransaction.signature.length, 2);

  // broadcast multi-sign transaction
  const result = await tronWeb.trx.broadcast(signedTransaction);
  await wait(30);
  assert.isTrue(result.result)
  res = await tronWeb.trx.getAccount(accounts.b58[8])
  assert.equal(res.owner_permission.threshold, 1, "multiSign updateAccountPermissions error!")
  console.log("accountPermissionUpdateMultiSign excute success");
}

async function alterExistentTransactions(){
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

  let receiver = emptyAccount3.address.base58
  let sender = emptyAccount4.address.hex
  let privateKey = emptyAccount4.privateKey
  let balance = await tronWeb.trx.getUnconfirmedBalance(sender);
  let transaction = await tronWeb.transactionBuilder.sendTrx(receiver, 10, sender);
  let previousId = transaction.txID;
  transaction = await tronWeb.transactionBuilder.extendExpiration(transaction, 3600);
  await broadcaster.broadcaster(null, privateKey, transaction);
  assert.notEqual(transaction.txID, previousId)
  assert.equal(balance - await tronWeb.trx.getUnconfirmedBalance(sender), 10);

  receiver = emptyAccount5.address.base58
  sender = emptyAccount6.address.hex
  privateKey = emptyAccount6.privateKey
  balance = await tronWeb.trx.getUnconfirmedBalance(sender);
  transaction = await tronWeb.transactionBuilder.sendTrx(receiver, 10, sender);
  let data = "Sending money to Bill.";
  transaction = await tronWeb.transactionBuilder.addUpdateData(transaction, data);
  let id = transaction.txID;
  await broadcaster.broadcaster(null, privateKey, transaction);
  await waitChainData('tx', id);
  assert.equal(balance - await tronWeb.trx.getUnconfirmedBalance(sender), 10);
  let unconfirmedTx = await tronWeb.trx.getTransaction(id)
  assert.equal(tronWeb.toUtf8(unconfirmedTx.raw_data.data), data);

  receiver = emptyAccount1.address.base58
  sender = emptyAccount2.address.hex
  privateKey = emptyAccount2.privateKey
  // const balance = await tronWeb.trx.getUnconfirmedBalance(sender);
  transaction = await tronWeb.transactionBuilder.sendTrx(receiver, 10, sender);
  previousId = transaction.txID;
  data = "Sending money to Bill.";
  transaction = await tronWeb.transactionBuilder.alterTransaction(transaction, {data});
  id = transaction.txID;
  assert.notEqual(id, previousId)
  await broadcaster.broadcaster(null, privateKey, transaction);
  await waitChainData('tx', id);
  unconfirmedTx = await tronWeb.trx.getTransaction(id)
  assert.equal(tronWeb.toUtf8(unconfirmedTx.raw_data.data), data);
  console.log("alterExistentTransactions excute success");
}

async function rawParameter(){
  const emptyAccount1 = await TronWeb.createAccount();
  await tronWeb.trx.sendTrx(emptyAccount1.address.hex,1000000000,{privateKey: PRIVATE_KEY})
  let param1;
  let param2;
  let contractAddress1;
  let contractAddress2;
  let contractAddress3;
  const totalSupply = 100000000000000000;
  param1 = await publicMethod.to64String(ADDRESS_HEX)+ await publicMethod.to64String(TronWeb.fromDecimal(totalSupply));
  param2 = await publicMethod.to64String(emptyAccount1.address.hex)+await publicMethod.to64String(TronWeb.fromDecimal(123));
  const tx1 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract(
      {
        abi: [],
        bytecode: tronToken.bytecode,
        rawParameter: param1,
      },
      ADDRESS_BASE58
  ), PRIVATE_KEY);
  contractAddress1 = tronWeb.address.fromHex(tx1.transaction.contract_address)

  const tx2 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract(
      {
        abi: [{}],
        bytecode: tronToken.bytecode,
        rawParameter: param1,
      },
      ADDRESS_BASE58
  ), PRIVATE_KEY)
  contractAddress2 = tronWeb.address.fromHex(tx2.transaction.contract_address)

  const tx3 = await broadcaster.broadcaster(tronWeb.transactionBuilder.createSmartContract(
      {
        abi: tronToken.abi,
        bytecode: tronToken.bytecode,
        rawParameter: param1,
      },
      ADDRESS_BASE58
  ), PRIVATE_KEY)
  contractAddress3 = tronWeb.address.fromHex(tx3.transaction.contract_address)

  //use contract1, query before balance
  let functionSelector1 = 'balanceOf(address)';
  let param3B = await publicMethod.to64String(ADDRESS_HEX);
  let transactionB = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress1, functionSelector1, {rawParameter: param3B},
      [], ADDRESS_BASE58);
  let ownerBalanceBefore = tronWeb.BigNumber(transactionB.constant_result[0], 16);
  console.log("ownerBalanceBefore:",ownerBalanceBefore);

  // abi:[]
  let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress1, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  const triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
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
  assert.equal("SUCCESS", triggerInfo.receipt.result);
  let functionSelector = 'balanceOf(address)';
  let param3 = await publicMethod.to64String(ADDRESS_HEX);
  let transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress1, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  let ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  console.log("ownerBalanceAfter:",ownerBalanceAfter);
  assert.equal(ownerBalanceAfter, totalSupply-123);

  let param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress1, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  let newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 123);

  // abi:[{}]
  const triggerTransaction2 = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress2, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  const triggerTx2 = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction2.transaction);
  assert.equal(triggerTx2.transaction.txID.length, 64);
  let triggerInfo2;
  while (true) {
    triggerInfo2 = await tronWeb.trx.getTransactionInfo(triggerTx2.transaction.txID);
    if (Object.keys(triggerInfo2).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo2:"+util.inspect(triggerInfo2))
      break;
    }
  }
  assert.equal("SUCCESS", triggerInfo2.receipt.result);
  functionSelector = 'balanceOf(address)';
  param3 = await publicMethod.to64String(ADDRESS_HEX);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress2, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-123);
  param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress2, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 123);

  // trigger have abi with address and number
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress3, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTransaction.transaction.txID.length, 64);
  let triggerInfo3;
  while (true) {
    triggerInfo3 = await tronWeb.trx.getTransactionInfo(triggerTransaction.transaction.txID);
    if (Object.keys(triggerInfo3).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo3:"+util.inspect(triggerInfo3))
      break;
    }
  }
  assert.equal("SUCCESS", triggerInfo3.receipt.result);
  functionSelector = 'balanceOf(address)';
  param3 = await publicMethod.to64String(ADDRESS_HEX);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-123);
  param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 123);

  // abi:{}
  // clear abi
  console.log("clear abi")
  const clearAbiTransaction = await tronWeb.transactionBuilder.clearABI(contractAddress3, ADDRESS_BASE58);
  console.log("clearAbiTransaction:"+util.inspect(clearAbiTransaction))
  const clearAbiTx = await broadcaster.broadcaster(null, PRIVATE_KEY, clearAbiTransaction);
  while (true) {
    let clearAbiInfo = await tronWeb.trx.getTransactionInfo(clearAbiTx.transaction.txID);
    if (Object.keys(clearAbiInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("clearAbiInfo:"+util.inspect(clearAbiInfo))
      break;
    }
  }
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress3, "transfer(address,uint256)",
      {
        rawParameter: param2,
      },
      [], ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTransaction.transaction.txID.length, 64);
  let triggerInfo4;
  while (true) {
    triggerInfo4 = await tronWeb.trx.getTransactionInfo(triggerTransaction.transaction.txID);
    if (Object.keys(triggerInfo4).length === 0) {
      await wait(3);
      continue;
    } else {
      console.log("triggerInfo4:"+util.inspect(triggerInfo4))
      break;
    }
  }
  assert.equal("SUCCESS", triggerInfo4.receipt.result);
  functionSelector = 'balanceOf(address)';
  param3 = await publicMethod.to64String(ADDRESS_HEX);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param3},
      [], ADDRESS_BASE58);
  ownerBalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(ownerBalanceAfter, totalSupply-246);
  param4 = await publicMethod.to64String(emptyAccount1.address.hex);
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(contractAddress3, functionSelector, {rawParameter: param4},
      [], ADDRESS_BASE58);
  newAccount1BalanceAfter = tronWeb.BigNumber(transaction.constant_result[0], 16);
  assert.equal(newAccount1BalanceAfter, 246);
  console.log("rawParameter execute success");
}

async function triggerSmartContractWithFuncABIV2_V1_input(){
  const transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: funcABIV2.abi,
        bytecode: funcABIV2.bytecode,
        funcABIV2: funcABIV2.abi[0],
        parametersV2: [1]
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  const deployed = await tronWeb.contract().at(transaction.contract_address);
  let check = await deployed.check().call();
  assert.ok(check.eq(1));

  /* test send method */
  const sendTxId = await deployed.setCheck(8).send({}, PRIVATE_KEY);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        sendTxId
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  let check1 = await deployed.check().call();
  assert.ok(check1.eq(8));

  /* test triggersmartcontract */
  const setTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      transaction.contract_address,
      "setCheck(uint256)",
      {
        funcABIV2: funcABIV2.abi[2],
        parametersV2: [
          16
        ]
      },
      [],
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, setTransaction.transaction);

  check = await deployed.check().call();
  assert.ok(check.eq(16));
  console.log("triggerSmartContractWithFuncABIV2_V1_input execute success")
}

async function triggerSmartContractWithFuncABIV2_V2_input(){
  let coder = tronWeb.utils.abi;
  const abi = JSON.parse(funcABIV2_2.interface);
  const bytecode = funcABIV2_2.bytecode;
  const outputValues = getValues(JSON.parse(funcABIV2_2.values))
  let transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi,
        bytecode,
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  let deployed = await tronWeb
  .contract(abi, transaction.contract_address)
  let check = await deployed.test().call();
  assert.ok(equals(check[0], outputValues[0]));

  transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: funcABIV2_3.abi,
        bytecode: funcABIV2_3.bytecode,
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  deployed = await tronWeb
  .contract(funcABIV2_3.abi, transaction.contract_address)
  let txID = await deployed.setStruct(['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']).send();
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  check = await deployed.s(0).call();
  assert.ok(equals(check, ['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY','TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']));

  transaction = await tronWeb.transactionBuilder.createSmartContract(
      {
        abi: funcABIV2_4.abi,
        bytecode: funcABIV2_4.bytecode,
      },
      ADDRESS_HEX
  );
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(
        transaction.txID
    );
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  deployed = await tronWeb
  .contract(funcABIV2_4.abi, transaction.contract_address);
  txID = await deployed.setStruct(['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY', 1000100, 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']).send();
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(txID);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }

  check = await deployed.s(0).call();
  assert.ok(equals(check, ['TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY', 1000100, 'TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY']));
  console.log("triggerSmartContractWithFuncABIV2_V2_input execute success");
}

async function encodeABIV2test1_V1_input(){
  let contractInstance;
  let contractAddress;
  // createSmartContract
  const options = {
    abi: abiV2Test1.abi,
    bytecode: abiV2Test1.bytecode,
    feeLimit:FEE_LIMIT,
    funcABIV2: abiV2Test1.abi[0],
    parametersV2: [
      [5],
      ADDRESS_BASE58,
      TOKEN_ID,
      ["q","w","e"],
      ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]
    ],
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("transaction.txID:"+transaction.txID)
  assert.equal(transaction.txID.length, 64);
  let createInfo;
  contractAddress="41674f4632185a848b5cb18172de090112c6ab5676";
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      contractAddress = transaction.contract_address;
      console.log("contractAddress:"+contractAddress)
      break;
    }
  }
  contractInstance = await tronWeb.contract(abiV2Test1.abi,contractAddress);

  // strs
  let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeStrs(string[])", {feeLimit:FEE_LIMIT}, [
        {type: 'string[]', value: ["o","p"]}
      ], ADDRESS_BASE58);
  let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  let triggerInfo;
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getStrs()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,64),'6f00000000000000000000000000000000000000000000000000000000000000')
  assert.equal(transaction.constant_result[0].substr(448,64),'7000000000000000000000000000000000000000000000000000000000000000')

  // bys
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBys(bytes[])", {feeLimit:FEE_LIMIT}, [
        {type: 'bytes[]', value: ["0x298fa36a9e2ebd6d3698e552987294fa8b65cd00","0x60f68c9b9e50"]}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBys()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,40),'298fa36a9e2ebd6d3698e552987294fa8b65cd00')
  assert.equal(transaction.constant_result[0].substr(448,12),'60f68c9b9e50')

  // bool
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBool(bool)", {feeLimit:FEE_LIMIT},
      [
        {type: 'bool', value: false}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBool()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0].substr(63,1),16),0);

  // int
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeInt(int256)", {feeLimit:FEE_LIMIT},
      [
        {type: 'int256', value: 37497}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getInt()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0],16),37497);

  // negativeInt
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeNegativeInt(int256)", {feeLimit:FEE_LIMIT},
      [
        {type: 'int256', value: -37497}
      ], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);

  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getNegativeInt()",
      {},
      []);
  assert.equal(transaction.constant_result[0],'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6d87');
  console.log("encodeABIV2test1_V1_input execute success")
}

async function encodeABIV2test1_V2_input(){
  let contractInstance;
  let contractAddress;
  // createSmartContract
  const options = {
    abi: abiV2Test1.abi,
    bytecode: abiV2Test1.bytecode,
    feeLimit:FEE_LIMIT,
    funcABIV2: abiV2Test1.abi[0],
    parametersV2: [
      [5],
      ADDRESS_BASE58,
      TOKEN_ID,
      ["q","w","e"],
      ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]
    ],
  };
  let transaction = await tronWeb.transactionBuilder.createSmartContract(options, ADDRESS_BASE58);
  await broadcaster.broadcaster(null, PRIVATE_KEY, transaction);
  console.log("transaction.txID:"+transaction.txID)
  assert.equal(transaction.txID.length, 64);
  let createInfo;
  contractAddress="41674f4632185a848b5cb18172de090112c6ab5676";
  while (true) {
    createInfo = await tronWeb.trx.getTransactionInfo(transaction.txID);
    if (Object.keys(createInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      contractAddress = transaction.contract_address;
      console.log("contractAddress:"+contractAddress)
      break;
    }
  }
  contractInstance = await tronWeb.contract(abiV2Test1.abi,contractAddress);
  const originAddress = await contractInstance.origin().call();
  assert.ok(equals(originAddress, ADDRESS_BASE58));
  const token = parseInt(await contractInstance.token().call(), 10);
  assert.ok(equals(token, TOKEN_ID));
  let strs = await contractInstance.getStrs().call();
  assert.ok(equals(strs, ["q","w","e"]));
  let bys = await contractInstance.getBys().call();
  assert.ok(equals(bys, ["0xf579f9c22b185800e3b6e6886ffc8584215c05a5","0xd9dcae335acd3d4ffd2e6915dc702a59136ab46f"]));

  // send&call--------------------------------------------------------------------------------------------
  // strs
  await contractInstance.changeStrs(["z","x"]).send({}, PRIVATE_KEY);
  strs = await contractInstance.getStrs().call();
  assert.ok(equals(strs, ["z","x"]));

  // bys
  await contractInstance.changeBys(["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"]).send({}, PRIVATE_KEY);
  bys = await contractInstance.getBys().call();
  assert.ok(equals(bys, ["0x60F68C9B9e50".toLowerCase(),"0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"]));

  // data
  let txid=await contractInstance.changeMapAll(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[687],[9,0,23,1],ADDRESS_BASE58,TOKEN_ID).send({}, PRIVATE_KEY);
  let triggerInfo;
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(triggerInfo.contractResult[0].substr(88,40),ADDRESS_HEX.substr(2))
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),9)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),0)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),23)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1)

  // changeMapAll2--3ceng struct
  txid=await contractInstance.changeMapAll2(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[687],[9,0,23,1],"TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s",1000007]]).send({}, PRIVATE_KEY);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000007)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),"5ab90009b529c5406b4f8a6fc4dab8a2bc778c75")
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),9)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),0)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),23)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1)

  // changeMapAll3--4ceng struct
  txid=await contractInstance.changeMapAll3(0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[[67],[11,2,2323,1001],"TJEuSMoC7tbs99XkbGhSDk7cM1xnxR931s",1000007]]]).send({}, PRIVATE_KEY);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000007)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),"5ab90009b529c5406b4f8a6fc4dab8a2bc778c75")
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),11)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),2)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),2323)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1001)

  // StructArray
  txid=await contractInstance.changeStructArray([3],[4]).send({}, PRIVATE_KEY);
  while (true) {
    const tx = await tronWeb.trx.getTransactionInfo(txid);
    if (Object.keys(tx).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  const structArray = await contractInstance.getStructArray().call();
  assert.equal(structArray[1],3);
  assert.equal(structArray[2],4);
  contractInstance.getStructArray().call((err, data)=>{
    assert.equal(data.toString(),structArray.toString())
  });

  // bool
  await contractInstance.changeBool(true).send({}, PRIVATE_KEY);
  const bool = await contractInstance.getBool().call();
  assert.ok(equals(bool, true));

  // int
  await contractInstance.changeInt(68236424).send({}, PRIVATE_KEY);
  const intValue = await contractInstance.getInt().call();
  assert.ok(equals(intValue, 68236424));

  // negativeInt
  await contractInstance.changeNegativeInt(-68236424).send({}, PRIVATE_KEY);
  const negativeIntValue = await contractInstance.getNegativeInt().call();
  assert.ok(equals(negativeIntValue, -68236424));
  contractInstance.getNegativeInt().call((err, data)=>{
    assert.equal(data.toString(),negativeIntValue.toString())
  });

  // triggerSmartContract&triggerConstantContract--------------------------------------------------------------------------------------------
  // strs
  let triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeStrs(string[])", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[15],parametersV2:[["o","p"]]}, [], ADDRESS_BASE58);
  let triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getStrs()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,64),'6f00000000000000000000000000000000000000000000000000000000000000')
  assert.equal(transaction.constant_result[0].substr(448,64),'7000000000000000000000000000000000000000000000000000000000000000')

  // bys
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBys(bytes[])", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[9],parametersV2:[["0x298fa36a9e2ebd6d3698e552987294fa8b65cd00","0x60f68c9b9e50"]]}, [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBys()",
      {},
      []);
  assert.equal(transaction.constant_result[0].substr(320,40),'298fa36a9e2ebd6d3698e552987294fa8b65cd00')
  assert.equal(transaction.constant_result[0].substr(448,12),'60f68c9b9e50')

  // data
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeMapAll(uint256,string[],uint256,bytes[],(uint256),uint256[],address,trcToken)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[11],parametersV2:[0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[687],[9,0,23,1],ADDRESS_BASE58,TOKEN_ID]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  console.log("triggerInfo:"+util.inspect(triggerInfo))
  assert.equal(triggerInfo.contractResult[0].substr(88,40),ADDRESS_HEX.substr(2))
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),9)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),0)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),23)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),1)

  // changeMapAll2--3ceng struct
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeMapAll2(uint256,string[],uint256,bytes[],(((uint256),uint256[],address,trcToken)))", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[12],parametersV2:[0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[683],[5,6,68,9],"TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU",1000008]]]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000008)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),'d1e7a6bc354106cb410e65ff8b181c600ff14292')
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),5)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),6)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),68)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),9)

  // changeMapAll2--4ceng struct
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeMapAll3(uint256,string[],uint256,bytes[],((((uint256),uint256[],address,trcToken))))", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[13],parametersV2:[0,["a","s"],0,["0x60F68C9B9e50","0x298fa36a9e2ebd6d3698e552987294fa8b65cd00"],[[[[683],[5,6,68,9],"TV75jZpdmP2juMe1dRwGrwpV6AMU6mr1EU",1000008]]]]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  console.log("changeMapAll3:"+util.inspect(triggerInfo))
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(0,64),16),1000008)
  assert.equal(triggerInfo.contractResult[0].substr(88,40),'d1e7a6bc354106cb410e65ff8b181c600ff14292')
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(192,64),16),4)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(256,64),16),5)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(320,64),16),6)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(384,64),16),68)
  assert.equal(parseInt(triggerInfo.contractResult[0].substr(448,64),16),9)

  // StructArray
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeStructArray((uint256),(uint256))", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[16],parametersV2:[[909],[404]]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  console.log("StructArray  tx: "+triggerTx.transaction.txID)
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getStructArray()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0].substr(transaction.constant_result[0].length-128,64),16),909);
  assert.equal(parseInt(transaction.constant_result[0].substr(transaction.constant_result[0].length-64,64),16),404);

  // bool
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeBool(bool)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[8],parametersV2:[false]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getBool()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0].substr(63,1),16),0);

  // int
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeInt(int256)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[10],parametersV2:[37497]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);
  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getInt()",
      {},
      []);
  assert.equal(parseInt(transaction.constant_result[0],16),37497);

  // negativeInt
  triggerTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
      contractAddress, "changeNegativeInt(int256)", {feeLimit:FEE_LIMIT,funcABIV2:abiV2Test1.abi[14],parametersV2:[-37497]},
      [], ADDRESS_BASE58);
  triggerTx = await broadcaster.broadcaster(null, PRIVATE_KEY, triggerTransaction.transaction);
  assert.equal(triggerTx.transaction.txID.length, 64);

  while (true) {
    triggerInfo = await tronWeb.trx.getTransactionInfo(triggerTx.transaction.txID);
    if (Object.keys(triggerInfo).length === 0) {
      await wait(3);
      continue;
    } else {
      break;
    }
  }
  transaction = await tronWeb.transactionBuilder.triggerConstantContract(
      contractAddress,
      "getNegativeInt()",
      {},
      []);
  assert.equal(transaction.constant_result[0],'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6d87');
  console.log("encodeABIV2test1_V2_input execute success")
}

async function transactionBuilderTestAll(){
  console.log("transactionBuilderTestAll start")
  await transactionBuilderBefore();
  await sendTrx();
  await createToken();
  await createAccount();
  await updateAccount();
  await setAccountId();
  await setAccountIdMultiSign()
  await updateToken();
  await purchaseToken();
  await sendToken();
  await createProposal();
  await deleteProposal();
  await voteProposal();
  await applyForSR();
  // Execute this method when Proposition 70 is not enabled
  /*await freezeBalance();
  await unfreezeBalance();*/
  // Execute this method when Proposition 70 is enabled
  await freezeBalanceV2_1();
  await freezeBalanceV2_2();
  await freezeBalanceV2_3();
  await freezeBalanceV2_4();
  await unfreezeBalanceV2_1();
  await unfreezeBalanceV2_2();
  await unfreezeBalanceV2_3();
  await unfreezeBalanceV2_4();
  await delegateResource_before();
  await delegateResource_1();
  await delegateResource_2();
  await delegateResource_3();
  await delegateResource_4();
  await delegateResource_5();
  await delegateResource_6();
  await delegateResource_7();
  await delegateResource_8();
  await undelegateResource_before();
  await undelegateResource_1();
  await undelegateResource_2();
  await undelegateResource_3();
  await undelegateResource_4();
  await withdrawExpireUnfreeze_1();
  await withdrawExpireUnfreeze_2();
  await estimateEnergy_1();
  await estimateEnergy_2();
  await estimateEnergy_3();
  await estimateEnergy_4();
  await withdrawBalance();
  await vote();
  await createSmartContract();
  await createSmartContractWithArray3();
  await createSmartContractWithTrctokenAndStateMutability();
  await createSmartContractWithPayable();
  await triggerConstantContract();
  await triggerComfirmedConstantContract();
  await clearabi();
  await clearabiMultiSign()
  await updateBrokerage();
  await updateBrokerageMultiSign();
  await triggerSmartContract();
  await triggerSmartContractWithArrays();
  await triggerSmartContractWithTrctoken();
  await createTokenExchange();
  await createTRXExchange();
  await injectExchangeTokens();
  await updateSetting();
  await updateEnergyLimit();
  await accountPermissionUpdate();
  await accountPermissionUpdateMultiSign()
  await withdrawExchangeTokens();
  await tradeExchangeTokens();
  await alterExistentTransactions();
  await rawParameter(); //有时候不通过，是因为好像余额转了两次
  await triggerSmartContractWithFuncABIV2_V1_input();
  await triggerSmartContractWithFuncABIV2_V2_input();
  await encodeABIV2test1_V1_input();
  await encodeABIV2test1_V2_input();
  console.log("transactionBuilderTestAll end")
}

export{
  transactionBuilderTestAll
}
